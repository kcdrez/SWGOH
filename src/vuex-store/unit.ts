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

import { CombinedUnit, UnitData } from "../api/interfaces";
import { loadingState } from "../enums/loading";
import { State as RootState } from "./store";

export type State = {
  unit: CombinedUnit | null;
  requestState: loadingState;
};

export const state: State = {
  requestState: loadingState.initial,
  unit: null,
};

enum MutationTypes {
  SET_REQUEST_STATE = "SET_REQUEST_STATE",
  SET_UNIT = "SET_UNIT",
}

type Mutations<S = State> = {
  [MutationTypes.SET_REQUEST_STATE](state: S, payload: loadingState): void;
  [MutationTypes.SET_UNIT](state: S, payload: CombinedUnit): void;
};

const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_REQUEST_STATE](state: State, payload: loadingState) {
    state.requestState = payload;
  },
  [MutationTypes.SET_UNIT](state: State, payload: CombinedUnit) {
    state.unit = payload;
  },
};

enum ActionTypes {
  fetchUnit = "fetchUnit",
}

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, "commit">;

interface Actions {
  [ActionTypes.fetchUnit]({ commit }: AugmentedActionContext, id: string): void;
}

const actions: ActionTree<State, RootState> & Actions = {
  async [ActionTypes.fetchUnit](
    { commit, rootState }: AugmentedActionContext,
    id: string
  ) {
    commit(MutationTypes.SET_REQUEST_STATE, loadingState.loading);
    const response = await rootState.helpClient?.fetchUnit(id);
    const match = rootState.player?.player?.units.find(
      (u: UnitData) => u.data.base_id === response?.id
    );
    if (match && response) {
      commit(MutationTypes.SET_UNIT, { ...match.data, ...response });
      commit(MutationTypes.SET_REQUEST_STATE, loadingState.ready);
    } else {
      commit(MutationTypes.SET_REQUEST_STATE, loadingState.error);
    }
  },
};

type Getters = {
  currentGearLevel(state: State): number;
};

const getters: GetterTree<State, RootState> & Getters = {
  currentGearLevel: (state) => {
    if (state.unit) {
      return (
        state.unit?.gear_level +
        state.unit.gear.filter((x: any) => x.is_obtained).length / 10
      );
    } else {
      return 0;
    }
  },
};

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
