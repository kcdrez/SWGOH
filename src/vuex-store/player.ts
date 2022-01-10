import { InjectionKey } from "vue";
import { createStore, Store as VuexStore, ActionContext, MutationTree, ActionTree, GetterTree, CommitOptions, DispatchOptions, Module } from "vuex";
import apiClientHelp from "../api/swgoh.help";
import apiClientGG from "../api/swgoh.gg";
import { Unit, Gear, Player, UnitData, Mission } from "../api/interfaces";
import {
  difficultyIds,
  tableIds,
  mapIds,
  missionIds,
  challenges,
} from "../api/locationMapping";
import { unvue } from "../utils";
import { store as gearStore } from './gear'
import { store as unitStore } from './unit'
import { loadingState } from '../enums/loading';
import { State as RootState } from './store';

type State = {
  player: Player | null;
  allyCode: string;
  requestState: loadingState;
};

const state = {
  player: null,
  allyCode: "",
  requestState: loadingState.initial
};

enum MutationTypes {
  SET_REQUEST_STATE = "SET_REQUEST_STATE",
  SET_PLAYER = "SET_PLAYER",
  SET_ALLY_CODE = "SET_ALLY_CODE"
};

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
  }
};

enum ActionTypes {
  initialize = "initialize",
  fetchPlayer = "fetchPlayer",
  resetPlayer = "resetPlayer"
};

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
  // rootState<K extends keyof RootState>( //how to do this?
  //   payload: Parameters<RootState>[1]
  // ): ReturnType<RootState>;
} & Omit<ActionContext<State, RootState>, "commit">;

interface Actions {
  [ActionTypes.initialize](
    { commit }: AugmentedActionContext
  ): void;
  [ActionTypes.fetchPlayer](
    { commit }: AugmentedActionContext,
    allyCode: number
  ): void;
  [ActionTypes.resetPlayer](
    { commit }: AugmentedActionContext
  ): void;
};

const actions: ActionTree<State, RootState> & Actions = {
  [ActionTypes.initialize]({ commit, dispatch }: AugmentedActionContext) {
    console.log('init player module')
    const allyCode = window.localStorage.getItem("allyCode") || "";
    if (allyCode) {
      dispatch("fetchPlayer", allyCode); //todo: this isnt strongly typed
    }
  },
  async [ActionTypes.fetchPlayer]({ commit, rootState }: AugmentedActionContext, allyCode: number) {
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
  }
};

type Getters = {};

const getters: GetterTree<State, RootState> & Getters = {};

//setup store type
type Store = Omit<
  VuexStore<State>,
  "commit" | "getters" | "dispatch"
> & {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload: P,
    options?: CommitOptions
  ): ReturnType<Mutations[K]>;
} & {
  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>;
  };
} & {
  dispatch<K extends keyof Actions>(
    key: K,
    payload: Parameters<Actions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<Actions[K]>;
};

export const store: Module<State, RootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};

// interface State {
//   player: Player | null;
//   allyCode: string;
//   requestState: loadingState;
// }

// type ActionCtx = ActionContext<State, RootState>;

// const store = {
//   namespaced: true,
//   state: {
//     player: null,
//     allyCode: "",
//     requestState: loadingState.initial
//   },
//   getters: {},
//   mutations: {
//     SET_REQUEST_STATE(state: State, payload: loadingState) {
//       state.requestState = payload;
//     },
//     SET_PLAYER(state: State, payload: any) {
//       state.player = payload;
//     },
//     SET_ALLY_CODE(state: State, payload: any) {
//       state.allyCode = payload;
//     }
//   },
//   actions: {
//     initialize({ dispatch }: ActionCtx) {
//       console.log('init player module')
//       const allyCode = window.localStorage.getItem("allyCode") || "";
//       if (allyCode) {
//         dispatch("fetchPlayer", allyCode);
//       }
//     },
//     async fetchPlayer({ state, commit, rootState }: ActionCtx, allyCode: string | number) {
//       commit("SET_REQUEST_STATE", loadingState.loading);
//       const player = await rootState.ggClient?.player(allyCode.toString());
//       if (player) {
//         commit("SET_PLAYER", player);
//         commit("SET_ALLY_CODE", allyCode);
//         window.localStorage.setItem("allyCode", allyCode.toString());
//       }
//       commit("SET_REQUEST_STATE", loadingState.ready);
//     },
//     resetPlayer({ commit }: ActionCtx) {
//       commit("SET_PLAYER", null);
//     },
//   },
// };

// export { store, State };
