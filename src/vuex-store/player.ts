import { ActionContext } from "vuex";
import moment from "moment";
import momentTz from "moment-timezone";

import { Player } from "../types/player";
import { loadingState } from "../types/loading";
import { State as RootState } from "./store";
import { apiClient } from "../api/api-client";
import { Unit } from "../types/unit";

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
  getters: {
    unitData(state: State) {
      return (unitId: string): Unit | undefined => {
        return state.player?.units.find((x) => x.id === unitId);
      };
    },
    lastUpdated(state: State): { fromNow: string; timestamp: string } {
      const fullTimezone = momentTz.tz.guess();
      const timezoneOffset = new Date().getTimezoneOffset();
      const timezone =
        momentTz.tz.zone(fullTimezone)?.abbr(timezoneOffset) || "";
      return {
        fromNow: moment.utc(state.player?.updated).local().fromNow(),
        timestamp:
          moment
            .utc(state.player?.updated)
            .local()
            .format("MMM D, YYYY @h:mma ") + timezone,
      };
    },
  },
  mutations: {
    SET_REQUEST_STATE(state: State, payload: loadingState) {
      state.requestState = payload;
    },
    SET_PLAYER(state: State, payload: any) {
      state.player = {
        ...payload,
        units: payload.units.map((u: any) => new Unit(u)),
      };
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
    async initialize({ dispatch, commit }: ActionCtx) {
      commit("SET_REQUEST_STATE", loadingState.loading);
      const allyCode = window.localStorage.getItem("allyCode") || "";
      if (allyCode) {
        await dispatch("fetchPlayer", allyCode);
      }
      commit("SET_REQUEST_STATE", loadingState.ready);
    },
    async fetchPlayer({ commit, dispatch }: ActionCtx, allyCode: string) {
      commit("SET_REQUEST_STATE", loadingState.loading);
      try {
        let player = await apiClient.fetchPlayer(allyCode);
        if (!player.id) {
          player = await apiClient.createPlayer(allyCode);
        }
        commit("SET_PLAYER", player);
        commit("SET_ALLY_CODE", allyCode);
        await dispatch("planner/initialize", player.planner, { root: true });
        dispatch("relic/initialize", player, { root: true });
        dispatch("gear/initialize", player, { root: true });
        dispatch("teams/initialize", player, { root: true });
        dispatch("opponents/initialize", player, { root: true });
        dispatch("shards/initialize", player, { root: true });
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
    saveEnergy({ rootState }: ActionCtx) {
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
