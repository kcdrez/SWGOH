import { ActionContext } from "vuex";

import { loadingState } from "../enums/loading";
import { State as RootState } from "./store";
import { unvue } from "../utils";
import relicConfig from "../types/relicMapping";
import { Relic } from "../types/relic";

type ConfigType = {
  [key: string]: Relic;
};

interface State {
  requestState: loadingState;
  relicConfig: ConfigType;
  ownedRelics: any;
}

type ActionCtx = ActionContext<State, RootState>;

const store = {
  namespaced: true,
  state: {
    requestState: loadingState.initial,
    relicConfig: relicConfig,
    ownedRelics: {},
  },
  getters: {},
  mutations: {
    SET_REQUEST_STATE(state: State, payload: loadingState) {
      state.requestState = payload;
    },
    SET_OWNED_RELICS(state: State, payload: any) {
      state.ownedRelics = payload;
    },
  },
  actions: {
    async initialize({ commit }: ActionCtx) {
      commit("SET_REQUEST_STATE", loadingState.loading);

      const relicsOwned = JSON.parse(
        window.localStorage.getItem("ownedRelics") || "{}"
      );
      commit("SET_OWNED_RELICS", relicsOwned);
      commit("SET_REQUEST_STATE", loadingState.ready);
    },
    saveOwnedCount(
      { state, commit }: ActionCtx,
      { count, id }: { count: number; id: string }
    ) {
      const countData = unvue(state.ownedRelics);
      countData[id] = count;
      commit("SET_OWNED_RELICS", countData);
      window.localStorage.setItem("ownedRelics", JSON.stringify(countData));
    },
  },
};

export { store, State };
