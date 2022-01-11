import { ActionContext, StoreOptions } from "vuex";
import { Player } from "../api/interfaces";
import { loadingState } from '../enums/loading';
import { State as RootState } from './store';

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
    requestState: loadingState.initial
  },
  getters: {},
  mutations: {
    SET_REQUEST_STATE(state: State, payload: loadingState) {
      state.requestState = payload;
    },
    SET_PLAYER(state: State, payload: any) {
      state.player = payload;
    },
    SET_ALLY_CODE(state: State, payload: any) {
      state.allyCode = payload;
    }
  },
  actions: {
    initialize({ dispatch }: ActionCtx) {
      const allyCode = window.localStorage.getItem("allyCode") || "";
      if (allyCode) {
        dispatch("fetchPlayer", allyCode);
      }
    },
    async fetchPlayer({ state, commit, rootState }: ActionCtx, allyCode: string | number) {
      commit("SET_REQUEST_STATE", loadingState.loading);
      const player = await rootState.ggClient?.player(allyCode.toString());
      if (player) {
        commit("SET_PLAYER", player);
        commit("SET_ALLY_CODE", allyCode);
        window.localStorage.setItem("allyCode", allyCode.toString());
      }
      commit("SET_REQUEST_STATE", loadingState.ready);
    },
    resetPlayer({ commit }: ActionCtx) {
      commit("SET_PLAYER", null);
    },
  },
};

export { store, State };
