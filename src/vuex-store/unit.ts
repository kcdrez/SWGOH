import { ActionContext } from "vuex";

import { Unit, UnitBasic, isUnit } from "../types/unit";
import { loadingState } from "../types/loading";
import { State as RootState } from "./store";
import { apiClient } from "../api/api-client";

interface State {
  requestState: loadingState;
  unit: Unit | null;
  unitList: UnitBasic[];
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
    currentGearLevel(_state: State, _getters: any, rootState: RootState) {
      //move to gear module
      return (unit: Unit | UnitBasic): number => {
        if (isUnit(unit)) {
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
    SET_ALL_UNITS(state: State, payload: UnitBasic[]) {
      state.unitList = payload;
    },
  },
  actions: {
    async initialize({ commit }: ActionCtx) {
      commit("SET_REQUEST_STATE", loadingState.loading);
      const response = await apiClient.fetchAllUnits();
      commit("SET_ALL_UNITS", response);
      commit("SET_REQUEST_STATE", loadingState.ready);
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
