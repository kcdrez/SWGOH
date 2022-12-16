import { ActionContext } from "vuex";

import { loadingState } from "types/loading";
import { State as RootState } from "./store";
import { round2Decimals } from "utils";
import { DailyCurrency, IWallet, Wallet } from "types/currency";

export const tbFrequency = 2 / 30;
export const twFrequency = 4 / 30;

interface State {
  requestState: loadingState;
  wallet: Wallet;
  dailyCurrency: DailyCurrency;
}

type ActionCtx = ActionContext<State, RootState>;

const store = {
  namespaced: true,
  state: {
    requestState: loadingState.initial,
    wallet: new Wallet({}),
    dailyCurrency: new DailyCurrency({}),
  },
  getters: {
    dailyAvgGET1(_state: State, _getters: any, rootState: RootState) {
      let amount = 0;
      let avgAmount = 0;
      rootState.guild.territoryBattleEvents.forEach((event) => {
        amount += event.get1;
      });
      avgAmount +=
        (amount / rootState.guild.territoryBattleEvents.length) * tbFrequency;
      amount = 0;
      rootState.guild.territoryWarEvents.forEach((event) => {
        amount += event.currencies.get1;
      });
      avgAmount +=
        (amount / rootState.guild.territoryBattleEvents.length) * twFrequency;
      return round2Decimals(avgAmount);
    },
    dailyAvgGET2(_state: State, _getters: any, rootState: RootState) {
      let amount = 0;
      let avgAmount = 0;
      rootState.guild.territoryBattleEvents.forEach((event) => {
        amount += event.get2;
      });
      avgAmount +=
        (amount / rootState.guild.territoryBattleEvents.length) * tbFrequency;
      amount = 0;
      rootState.guild.territoryWarEvents.forEach((event) => {
        amount += event.currencies.get2;
      });
      avgAmount +=
        (amount / rootState.guild.territoryBattleEvents.length) * twFrequency;
      return round2Decimals(avgAmount);
    },
    dailyAvgGET3(_state: State, _getters: any, rootState: RootState) {
      let amount = 0;
      let avgAmount = 0;
      rootState.guild.territoryBattleEvents.forEach((event) => {
        amount += event.get3;
      });
      avgAmount +=
        (amount / rootState.guild.territoryBattleEvents.length) * tbFrequency;
      amount = 0;
      rootState.guild.territoryWarEvents.forEach((event) => {
        amount += event.currencies.get3;
      });
      avgAmount +=
        (amount / rootState.guild.territoryBattleEvents.length) * twFrequency;
      return round2Decimals(avgAmount);
    },
  },
  mutations: {
    SET_REQUEST_STATE(state: State, payload: loadingState) {
      state.requestState = payload;
    },
    SET_WALLET(state: State, payload: IWallet) {
      state.wallet = new Wallet(payload);
    },
    SET_CURRENCY(state: State, payload: IWallet) {
      state.dailyCurrency = new DailyCurrency(payload);
    },
  },
  actions: {
    async initialize({ commit, state, rootState }: ActionCtx) {
      if (state.requestState === loadingState.initial) {
        commit("SET_WALLET", rootState.player.player?.wallet);
        commit("SET_CURRENCY", rootState.player.player?.dailyCurrency);
        commit("SET_REQUEST_STATE", loadingState.ready);
      }
    },
  },
};

export { store, State };
