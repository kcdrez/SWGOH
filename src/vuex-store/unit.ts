import { ActionContext } from "vuex";

import { Unit } from "../types/unit";
import { loadingState } from "../types/loading";
import { State as RootState } from "./store";
import { apiClient } from "../api/api-client";

interface State {
  requestState: loadingState;
  unit: Unit | null;
  unitList: Unit[];
}

type ActionCtx = ActionContext<State, RootState>;

const store = {
  namespaced: true,
  state: {
    requestState: loadingState.initial,
    unit: null,
    unitList: [],
  },
  getters: {
    unitName(state: State) {
      return (unitId: string): string => {
        const match = state.unitList.find((x) => x.id === unitId);
        if (match) {
          return match.name;
        } else {
          return unitId;
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
    SET_ALL_UNITS(state: State, payload: Unit[]) {
      state.unitList = payload;
    },
  },
  actions: {
    async initialize({ state, commit }: ActionCtx) {
      if (state.requestState === loadingState.initial) {
        commit("SET_REQUEST_STATE", loadingState.loading);
        const unitsList = await apiClient.fetchAllUnits();
        commit("SET_ALL_UNITS", unitsList);
        commit("SET_REQUEST_STATE", loadingState.ready);
      }
    },
    async fetchUnit({ commit, rootState, dispatch }: ActionCtx, id: string) {
      commit("SET_REQUEST_STATE", loadingState.loading);
      try {
        const exists = rootState.player.player?.units.find((x) => x.id === id);
        if (exists) {
          commit("SET_UNIT", exists);
          dispatch("planner/initPlannerTarget", exists.id, { root: true });
          commit("SET_REQUEST_STATE", loadingState.ready);
        } else {
          const response = await apiClient.fetchUnit(id);
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
