import { InjectionKey } from "vue";
import { createStore, Store, ActionContext } from "vuex";

import { Unit, Gear, Player, UnitData, Mission, CombinedUnit, PlayerUnit } from "../api/interfaces";
import {
  difficultyIds,
  tableIds,
  mapIds,
  missionIds,
  challenges,
} from "../api/locationMapping";
import { loadingState } from '../enums/loading';
import { State as RootState } from './store';
import { unvue } from '../utils'

interface State {
  requestState: loadingState;
  unit: CombinedUnit | null;
}

type ActionCtx = ActionContext<State, RootState>;

const store = {
  namespaced: true,
  state: {
    requestState: loadingState.initial,
    unit: null,
  },
  getters: {
    currentGearLevel(state: State): number {
      if (state.unit) {
        return (
          state.unit?.gear_level +
          state.unit.gear.filter((x: any) => x.is_obtained).length / 10
        );
      } else {
        return 0;
      }
    },
  },
  mutations: {
    SET_REQUEST_STATE(state: State, payload: loadingState) {
      state.requestState = payload;
    },
    SET_UNIT(state: State, payload: CombinedUnit) {
      state.unit = payload;
    },
  },
  actions: {
    async fetchUnit({ state, commit, rootState }: ActionCtx, id: string) {
      console.log(rootState)
      commit("SET_REQUEST_STATE", loadingState.loading);
      const response = await rootState.helpClient?.fetchUnit(id);
      // const match = rootState.player?.player?.units.find((u: UnitData) => u.data.base_id === response?.id);
      // if (match && response) {
      //   commit("SET_UNIT", { ...match.data, ...response });
      //   commit("SET_REQUEST_STATE", loadingState.ready);
      // } else {
      //   commit("SET_REQUEST_STATE", loadingState.error);
      // }
    },
  }
}

export { store, State };