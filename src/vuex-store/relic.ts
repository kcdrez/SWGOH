import { ActionContext } from "vuex";

import { loadingState } from "../types/loading";
import { State as RootState } from "./store";
import { unvue } from "../utils";
import relicConfig from "../types/relicMapping";
import { RelicConfigType, OwnedRelicConfig } from "../types/relic";
import { RelicPlanner, tableData } from "../types/relicPlanner";

import { apiClient } from "../api/api-client";

interface State {
  requestState: loadingState;
  relicConfig: RelicConfigType;
  ownedRelics: OwnedRelicConfig;
  refreshes: { cantina: number };
  energy: { cantina: number };
  calculator: {
    timeline: number,
    relicTarget: number,
    tableData: RelicPlanner[]
  }
}

type ActionCtx = ActionContext<State, RootState>;

const store = {
  namespaced: true,
  state: {
    requestState: loadingState.initial,
    relicConfig,
    ownedRelics: {},
    refreshes: { cantina: 0 },
    energy: { cantina: 0 },
    calculator: {
      timeline: 14,
      relicTarget: 8,
      tableData
    }
  },
  getters: {},
  mutations: {
    SET_REQUEST_STATE(state: State, payload: loadingState) {
      state.requestState = payload;
    },
    SET_OWNED_RELICS(state: State, payload: any) {
      if (payload) {
        state.ownedRelics = payload;
      }
    },
    UPDATE_REFRESHES(state: State, amount: number) {
      state.refreshes.cantina = amount;
    },
    UPDATE_ENERGY(state: State, amount: number) {
      state.energy.cantina = amount;
    },
  },
  actions: {
    async initialize({ commit, state, rootState }: ActionCtx) {
      if (state.requestState === loadingState.initial) {
        commit("SET_REQUEST_STATE", loadingState.loading);
        commit("SET_OWNED_RELICS", rootState.player.player?.relic);
        commit(
          "UPDATE_REFRESHES",
          rootState.player.player?.energyData?.refreshes?.cantina || 0
        );
        commit(
          "UPDATE_ENERGY",
          rootState.player.player?.energyData?.energy?.cantina || 0
        );
        commit("SET_REQUEST_STATE", loadingState.ready);
      }
    },
    saveOwnedCount(
      { state, commit, rootState }: ActionCtx,
      { count, id }: { count: number; id: string }
    ) {
      const countData = unvue(state.ownedRelics);
      countData[id] = count;
      commit("SET_OWNED_RELICS", countData);
      if (rootState.player?.player) {
        apiClient.saveRelicData(rootState.player.player.id, state.ownedRelics);
      }
    },
    updateRefreshes({ commit, dispatch }: ActionCtx, amount: number) {
      commit("UPDATE_REFRESHES", amount);
      dispatch("player/saveEnergy", null, { root: true });
    },
    updateEnergy({ commit, dispatch }: ActionCtx, amount: number) {
      commit("UPDATE_ENERGY", amount);
      dispatch("player/saveEnergy", null, { root: true });
    },
    saveCalculatorData({ state }: ActionCtx) {
      window.localStorage.setItem('relicCalculatorData', JSON.stringify(state.calculator.tableData.map(x => x.sanitize())))
    }
  },
};

export { store, State };
