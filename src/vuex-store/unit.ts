import { ActionContext } from "vuex";

import { Unit } from "../types/unit";
import { loadingState } from "../enums/loading";
import { State as RootState } from "./store";

interface State {
  requestState: loadingState;
  unit: Unit | null;
}

type ActionCtx = ActionContext<State, RootState>;

const store = {
  namespaced: true,
  state: {
    requestState: loadingState.initial,
    unit: null,
  },
  getters: {
    currentGearLevel(_state: State, _getters: any, rootState: RootState) {
      //move to gear module
      return (unit: Unit): number => {
        if (unit) {
          return (
            unit.gear_level +
            unit.gear.filter((x: any) => x.is_obtained).length / 10
          );
        } else {
          return 0;
        }
      };
    },
  },
  mutations: {
    SET_REQUEST_STATE(state: State, payload: loadingState) {
      state.requestState = payload;
    },
    SET_UNIT(state: State, payload: Unit) {
      state.unit = payload;
    },
  },
  actions: {
    async fetchUnit({ commit, rootState, dispatch }: ActionCtx, id: string) {
      commit("SET_REQUEST_STATE", loadingState.loading);
      try {
        const exists = rootState.player.player?.units.find((x) => x.id === id);
        if (exists) {
          commit("SET_UNIT", exists);
          dispatch("planner/initPlannerTarget", exists.id, { root: true });
          commit("SET_REQUEST_STATE", loadingState.ready);
        } else {
          const response = await rootState.apiClient?.fetchUnit(id);
          commit("SET_UNIT", response);
          dispatch("planner/initPlannerTarget", response.id, { root: true });
          commit("SET_REQUEST_STATE", loadingState.ready);
        }
      } catch (err: any) {
        commit("SET_REQUEST_STATE", loadingState.error);
        console.error(err);
        throw new Error(err);
      }
    },
  },
};

export { store, State };
