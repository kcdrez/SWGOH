import { ActionContext } from "vuex";
import moment from "moment";
import momentTz from "moment-timezone";

import { Player } from "types/player";
import { loadingState } from "types/loading";
import { State as RootState } from "./store";
import { apiClient } from "../api/api-client";
import { Unit } from "types/unit";
import { Goal, IGoal } from "types/goals";

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
    shipsList(state: State) {
      return state.player?.units.filter((unit) => unit.isShip);
    },
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
    SET_PLAYER(state: State, payload: Player) {
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
    async initialize({ state, dispatch, commit }: ActionCtx) {
      if (state.requestState === loadingState.initial) {
        commit("SET_REQUEST_STATE", loadingState.loading);
        const allyCode = window.localStorage.getItem("allyCode") || "";
        if (allyCode) {
          await dispatch("fetchPlayer", allyCode);
        }
        await dispatch("unit/initialize", null, { root: true });
        await dispatch("gear/initialize", null, { root: true });
        commit("SET_REQUEST_STATE", loadingState.ready);
      }
    },
    async fetchPlayer({ commit }: ActionCtx, allyCode: string) {
      commit("SET_REQUEST_STATE", loadingState.loading);
      try {
        let player = await apiClient.fetchPlayer(allyCode);
        if (!player) {
          player = await apiClient.createPlayer(allyCode);
        }
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
    saveEnergy({ rootState, state }: ActionCtx) {
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
      apiClient.saveEnergyData(state.player?.id || "", {
        refreshes,
        energy,
      });
    },
    async addGoal({ state, dispatch }: ActionCtx, goalData: IGoal) {
      const newGoal = new Goal(goalData);
      state.player?.goalList.push(newGoal);
      await dispatch("saveGoals");
    },
    async removeGoal({ state, dispatch }: ActionCtx, goalId: string) {
      const index =
        state.player?.goalList.findIndex((x) => x.id === goalId) ?? -1;
      if (index > -1) {
        state.player?.goalList.splice(index, 1);
        await dispatch("saveGoals");
      }
    },
    async saveGoals({ state }: ActionCtx) {
      await apiClient.saveGoals(
        state.player?.id ?? "",
        state.player?.goalList ?? []
      );
    },
  },
};

export { store, State };
