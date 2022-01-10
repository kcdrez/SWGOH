import {
  Store as VuexStore,
  ActionContext,
  MutationTree,
  ActionTree,
  GetterTree,
  CommitOptions,
  DispatchOptions,
  Module,
} from "vuex";
import { Player } from "../api/interfaces";
import { loadingState } from "../enums/loading";
import { State as RootState } from "./store";

export type State = {
  player: Player | null;
  allyCode: string;
  requestState: loadingState;
};

export const state: State = {
  player: null,
  allyCode: "",
  requestState: loadingState.initial,
};

enum MutationTypes {
  SET_REQUEST_STATE = "SET_REQUEST_STATE",
  SET_PLAYER = "SET_PLAYER",
  SET_ALLY_CODE = "SET_ALLY_CODE",
}

type Mutations<S = State> = {
  [MutationTypes.SET_REQUEST_STATE](state: S, payload: loadingState): void;
  [MutationTypes.SET_PLAYER](state: S, payload: Player | null): void;
  [MutationTypes.SET_ALLY_CODE](state: S, payload: number): void;
};

const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_REQUEST_STATE](state: State, payload: loadingState) {
    state.requestState = payload;
  },
  [MutationTypes.SET_PLAYER](state: State, payload: Player | null) {
    state.player = payload;
  },
  [MutationTypes.SET_ALLY_CODE](state: State, payload: number) {
    state.allyCode = payload.toString();
  },
};

enum ActionTypes {
  initialize = "initialize",
  fetchPlayer = "fetchPlayer",
  resetPlayer = "resetPlayer",
}

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
  dispatch<K extends keyof Actions>(
    key: K,
    payload: Parameters<Actions[K]>[1]
  ): ReturnType<Actions[K]>;
} & Omit<ActionContext<State, RootState>, "commit"> &
  Omit<ActionContext<State, RootState>, "dispatch">;

interface Actions {
  [ActionTypes.initialize]({ commit }: AugmentedActionContext): void;
  [ActionTypes.fetchPlayer](
    { commit }: AugmentedActionContext,
    allyCode: number
  ): void;
  [ActionTypes.resetPlayer]({ commit }: AugmentedActionContext): void;
}

const actions: ActionTree<State, RootState> & Actions = {
  [ActionTypes.initialize]({ dispatch }: AugmentedActionContext) {
    const allyCode = window.localStorage.getItem("allyCode") || "";
    if (allyCode) {
      dispatch("fetchPlayer", allyCode); //todo: this isnt strongly typed
    }
  },
  async [ActionTypes.fetchPlayer](
    { commit, rootState }: AugmentedActionContext,
    allyCode: number
  ) {
    commit(MutationTypes.SET_REQUEST_STATE, loadingState.loading);
    const player = await rootState.ggClient?.player(allyCode.toString());
    if (player) {
      commit(MutationTypes.SET_PLAYER, player);
      commit(MutationTypes.SET_ALLY_CODE, allyCode);
      window.localStorage.setItem("allyCode", allyCode.toString());
    }
    commit(MutationTypes.SET_REQUEST_STATE, loadingState.ready);
  },
  [ActionTypes.resetPlayer]({ commit }: AugmentedActionContext) {
    commit(MutationTypes.SET_PLAYER, null);
  },
};

type Getters = {};
const getters: GetterTree<State, RootState> & Getters = {};

// type Store = Omit<VuexStore<State>, "commit" | "getters" | "dispatch"> & {
//   commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
//     key: K,
//     payload: P,
//     options?: CommitOptions
//   ): ReturnType<Mutations[K]>;
// } & {
//   getters: {
//     [K in keyof Getters]: ReturnType<Getters[K]>;
//   };
// } & {
//   dispatch<K extends keyof Actions>(
//     key: K,
//     payload: Parameters<Actions[K]>[1],
//     options?: DispatchOptions
//   ): ReturnType<Actions[K]>;
// };

export const store: Module<State, RootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
