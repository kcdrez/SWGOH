import { ActionContext } from "vuex";
import { Player, PlayerResponse } from "../types/player";
import { loadingState } from "../types/loading";
import { State as RootState } from "./store";
import { apiClient } from "../api/api-client";

interface State {
  player: Player | null;
  allyCode: string;
  requestState: loadingState;
}

type ActionCtx = ActionContext<State, RootState>;

const store = {
  namespaced: true,
  state: {
    player: null,
    allyCode: "",
    requestState: loadingState.initial,
  },
  getters: {},
  mutations: {
    SET_REQUEST_STATE(state: State, payload: loadingState) {
      state.requestState = payload;
    },
    SET_PLAYER(state: State, payload: any) {
      state.player = payload;
    },
    SET_ALLY_CODE(state: State, payload: string | null) {
      if (payload === "kcdrez") {
        payload = "843518525";
      }
      if (typeof payload === "string") {
        state.allyCode = payload;
        window.localStorage.setItem("allyCode", payload);
      } else {
        state.allyCode = "";
        window.localStorage.removeItem("allyCode");
      }
    },
  },
  actions: {
    async initialize({ dispatch }: ActionCtx) {
      const allyCode = window.localStorage.getItem("allyCode") || "";
      if (allyCode) {
        await dispatch("fetchPlayer", allyCode);
      }
    },
    async fetchPlayer({ commit, dispatch }: ActionCtx, allyCode: string) {
      commit("SET_REQUEST_STATE", loadingState.loading);
      try {
        const player = await apiClient.fetchPlayer(allyCode);
        // commit("gear/SET_GEAR_OWNED", player.gear, { root: true });
        // commit("relic/SET_OWNED_RELICS", player.relic, { root: true });
        await dispatch("planner/initialize", player.planner, { root: true });
        dispatch("relic/initialize", player, { root: true });
        dispatch("gear/initialize", player, { root: true });
        commit("SET_PLAYER", player);
        commit("SET_ALLY_CODE", allyCode);
        commit("SET_REQUEST_STATE", loadingState.ready);
      } catch (err) {
        console.error(err);
        commit("SET_REQUEST_STATE", loadingState.error);
      }
    },
    resetPlayer({ commit }: ActionCtx) {
      commit("SET_PLAYER", null);
      commit("SET_ALLY_CODE", null);
    },
    saveEnergy({ state, rootState }: ActionCtx) {
      const { refreshes: cantinaRefreshes, energy: cantinaEnergy } =
        rootState.relic;
      const { refreshes: otherRefreshes, energy: otherEnergy } = rootState.gear;

      const refreshes = {
        ...cantinaRefreshes,
        ...otherRefreshes,
      };
      const energy = {
        ...cantinaEnergy,
        ...otherEnergy,
      };
      apiClient.saveEnergyData(rootState.player.player?.id || "", {
        refreshes,
        energy,
      });
    },
  },
};

export { store, State };
