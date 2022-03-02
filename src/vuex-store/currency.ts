import { ActionContext } from "vuex";
import { v4 as uuid } from "uuid";

import { loadingState } from "../types/loading";
import { State as RootState } from "./store";
import { apiClient } from "../api/api-client";
import { round2Decimals } from "../utils";

export const tbFrequency = 2 / 30
export const twFrequency = 4 / 30

interface State {
  requestState: loadingState;
}

type ActionCtx = ActionContext<State, RootState>;

const store = {
  namespaced: true,
  state: {
    requestState: loadingState.initial,
  },
  getters: {
    dailyAvgGET1(_state: State, _getters: any, rootState: RootState) {
      let amount = 0;
      let avgAmount = 0;
      rootState.guild.territoryBattleEvents.forEach(event => {
        amount += event.get1
      })
      avgAmount += (amount / rootState.guild.territoryBattleEvents.length) * tbFrequency
      amount = 0
      rootState.guild.territoryWarEvents.forEach(event => {
        amount += event.get1
      })
      avgAmount += (amount / rootState.guild.territoryBattleEvents.length) * twFrequency
      return round2Decimals(avgAmount)
    },
    dailyAvgGET2(_state: State, _getters: any, rootState: RootState) {
      let amount = 0;
      let avgAmount = 0;
      rootState.guild.territoryBattleEvents.forEach(event => {
        amount += event.get2
      })
      avgAmount += (amount / rootState.guild.territoryBattleEvents.length) * tbFrequency
      amount = 0
      rootState.guild.territoryWarEvents.forEach(event => {
        amount += event.get2
      })
      avgAmount += (amount / rootState.guild.territoryBattleEvents.length) * twFrequency
      return round2Decimals(avgAmount)
    }
  },
  mutations: {
    SET_REQUEST_STATE(state: State, payload: loadingState) {
      state.requestState = payload;
    },
  },
  actions: {
    async initialize({ commit, state, rootState }: ActionCtx) {
      commit("SET_REQUEST_STATE", loadingState.ready);
    },
  },
};

export { store, State };
