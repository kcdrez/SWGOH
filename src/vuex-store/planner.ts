import { ActionContext } from "vuex";

import { Gear, Mission } from "../types/gear";
import {
  difficultyIds,
  tableIds,
  mapIds,
  missionIds,
  challenges,
} from "../types/locationMapping";
import { loadingState } from "../enums/loading";
import { State as RootState } from "./store";
import { unvue } from "../utils";

interface State {
  requestState: loadingState;
}

type ActionCtx = ActionContext<State, RootState>;

const store = {
  namespaced: true,
  state: {
    requestState: loadingState.initial,
  },
  getters: {},
  mutations: {
    SET_REQUEST_STATE(state: State, payload: loadingState) {
      state.requestState = payload;
    },
  },
  actions: {},
};

export { store, State };
