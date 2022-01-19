import { ActionContext } from "vuex";

import { CombinedUnit, Unit } from "../types/unit";
import { PlayerUnit } from "../types/player";
import { loadingState } from "../enums/loading";
import { State as RootState } from "./store";

interface State {
  requestState: loadingState;
  unit: CombinedUnit | null;
  unitList: Unit[]
}

type ActionCtx = ActionContext<State, RootState>;

const store = {
  namespaced: true,
  state: {
    requestState: loadingState.initial,
    unit: null,
    unitList: []
  },
  getters: {
    currentGearLevel(_state: State, _getters: any, rootState: RootState) { //move to gear module
      return (unit: CombinedUnit): number => {
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
    SET_UNIT(state: State, payload: CombinedUnit) {
      state.unit = payload;
    },
    ADD_UNIT(state: State, payload: Unit) {
      const match = state.unitList.find(x => x.id === payload.id);
      if (!match) {
        state.unitList.push(payload);
      }
    }
  },
  actions: {
    async fetchUnit({ state, commit, dispatch, rootState }: ActionCtx, id: string) {
      commit("SET_REQUEST_STATE", loadingState.loading);
      await dispatch("getUnit", id)
      try {
        const exists = state.unitList.find(x => x.id === id)
        if (exists) {
          commit("SET_UNIT", exists);
          commit("SET_REQUEST_STATE", loadingState.ready);
        } else {
          console.error("Could not find a match with id of ", id)
          commit("SET_REQUEST_STATE", loadingState.error);
        }
      } catch (err: any) {
        commit("SET_REQUEST_STATE", loadingState.error);
        console.error(err);
        throw new Error(err);
      }
    },
    async getUnit({ state, commit, rootState }: ActionCtx, id: string) {
      commit("SET_REQUEST_STATE", loadingState.loading);

      try {
        const exists = state.unitList.find(x => x.id === id)
        if (exists) {
          commit("SET_REQUEST_STATE", loadingState.ready);
        } else {
          const response = await rootState.apiClient?.fetchUnit(id);
          const match = rootState.player.player?.units.find(
            (u: PlayerUnit) => u?.id === response?.id
          );
          if (match && response) {
            commit("SET_UNIT", { ...match, ...response });
            commit("ADD_UNIT", { ...match, ...response });
            commit("SET_REQUEST_STATE", loadingState.ready);
          } else {
            commit("SET_REQUEST_STATE", loadingState.error);
          }
        }
      }
      catch (err: any) {
        commit("SET_REQUEST_STATE", loadingState.error);
        console.error(err);
        throw new Error(err);
      }
    }
  },
};

export { store, State };
