import { BareActionContext } from "vuex-typex";

import { Player } from "../api/interfaces";
import { loadingState } from "../enums/loading";
import { storeBuilder, RootState } from "./store2";

export const moduleName = "player";

export class State {
  player: Player | null = null;
  allyCode: string = "";
  requestState: loadingState = loadingState.initial;
}

const b = storeBuilder.module<State>(moduleName, new State());

export const getters = {};

export const mutations = {
  SET_REQUEST_STATE: b.commit((state: State, payload: loadingState) => {
    state.requestState = payload;
  }),
  SET_PLAYER: b.commit((state: State, payload: Player | null) => {
    state.player = payload;
  }),
  SET_ALLY_CODE: b.commit((state: State, payload: string) => {
    state.allyCode = payload;
  }),
};

type ActionContext = BareActionContext<State, RootState>;

export const actions = {
  initialize: b.dispatch((ctx: ActionContext) => {
    const allyCode = window.localStorage.getItem("allyCode") || "";
    if (allyCode) {
      actions.fetchPlayer(allyCode); //will this work? if not separate to different function?
    }
  }),
  fetchPlayer: b.dispatch(async (ctx: ActionContext, allyCode: string) => {
    mutations.SET_REQUEST_STATE(loadingState.loading);
    const player = await ctx.rootState.ggClient?.player(allyCode.toString());
    if (player) {
      mutations.SET_PLAYER(player);
      mutations.SET_ALLY_CODE(allyCode);
      window.localStorage.setItem("allyCode", allyCode.toString());
    }
    mutations.SET_REQUEST_STATE(loadingState.ready);
  }),
  resetPlayer: b.dispatch(() => {
    mutations.SET_PLAYER(null);
  }),
};

export default {
  mutations,
  actions,
  getters,
  get state(): State {
    return b.state()();
  },
};
