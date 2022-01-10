import { ActionContext, ActionTree, CommitOptions, createLogger, createStore, DispatchOptions, GetterTree, MutationTree, Store as VuexStore } from "vuex";
import apiClientHelp from "../api/swgoh.help";
import apiClientGG from "../api/swgoh.gg";
import { store as gearStore } from './gear'
import { store as unitStore } from './unit'
import { store as playerStore } from './player'
import { loadingState } from '../enums/loading';

interface ApiClients { helpClient: apiClientHelp, ggClient: apiClientGG };

export type State = {
  helpClient: apiClientHelp | null;
  ggClient: apiClientGG | null;
  requestState: loadingState;
};

const state = {
  helpClient: null,
  ggClient: null,
  requestState: loadingState.initial
};

enum MutationTypes {
  SET_REQUEST_STATE = "SET_REQUEST_STATE",
  SET_CLIENT = "SET_CLIENT"
};

type Mutations<S = State> = {
  [MutationTypes.SET_REQUEST_STATE](state: S, payload: loadingState): void;
  [MutationTypes.SET_CLIENT](state: S, payload: ApiClients): void;
};

const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_CLIENT](state: State, payload: ApiClients) {
    state.ggClient = payload.ggClient;
    state.helpClient = payload.helpClient;
  },
  [MutationTypes.SET_REQUEST_STATE](state: State, payload: loadingState) {
    state.requestState = payload;
  },
};

enum ActionTypes {
  initialize = "initialize"
};

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, State>, "commit">;

interface Actions {
  [ActionTypes.initialize](
    { commit }: AugmentedActionContext
  ): void;
}

const actions: ActionTree<State, State> & Actions = {
  async [ActionTypes.initialize]({ commit, dispatch }: AugmentedActionContext) {
    commit(MutationTypes.SET_REQUEST_STATE, loadingState.loading);

    const helpClient = new apiClientHelp();
    await helpClient.connect();
    const ggClient = new apiClientGG();

    commit(MutationTypes.SET_CLIENT, {
      helpClient,
      ggClient,
    });
    commit(MutationTypes.SET_REQUEST_STATE, loadingState.ready);

    dispatch("gear/fetchGear", { root: true });
  }
};

type Getters = {};

const getters: GetterTree<State, State> & Getters = {};

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

export const store = createStore({
  modules: {
    gear: gearStore,
    unit: unitStore,
    player: playerStore
  },
  state,
  mutations,
  actions,
  getters,
  plugins:
    process.env.NODE_ENV === 'production' //todo figure out how to do this
      ? []
      : [createLogger()],
});

export function useStore() {
  return store as Store;
}

// const store = createStore<State>({
//   modules: {
//     gear: gearStore,
//     unit: unitStore,
//     player: playerStore
//   },
//   state: {
//     helpClient: null,
//     ggClient: null,
//     requestState: loadingState.initial
//   },
//   getters: {},
//   mutations: {
//     SET_REQUEST_STATE(state, payload: loadingState) {
//       state.requestState = payload;
//     },
//     SET_CLIENT(state, { helpClient, ggClient }) {
//       state.helpClient = helpClient;
//       state.ggClient = ggClient;
//     }
//   },
//   actions: {
//     async initialize({ commit, state, dispatch }) {
//       commit("SET_REQUEST_STATE", loadingState.loading);

//       const helpClient = new apiClientHelp();
//       await helpClient.connect();

//       const ggClient = new apiClientGG();

//       commit("SET_CLIENT", {
//         helpClient,
//         ggClient,
//       });

//       // await dispatch("fetchUnit", "C3POCHEWBACCA");
//       // await dispatch("fetchUnit", ["AHSOKATANO", "MAGMATROOPER"]);
//       // await dispatch("fetchPlayers");
//       // await dispatch("fetchData");
//       // await state.apiClient?.debug()
//       commit("SET_REQUEST_STATE", loadingState.ready);

//       dispatch("gear/fetchGear", { root: true });
//     },
//     // async fetchPlayer({ state, commit }, allyCode: string | number) {
//     //   commit("SET_REQUEST_STATE", loadingState.loading);
//     //   const player = await state.ggClient?.player(allyCode.toString());
//     //   if (player) {
//     //     commit("SET_PLAYER", player);
//     //     commit("SET_ALLY_CODE", allyCode);
//     //     window.localStorage.setItem("allyCode", allyCode.toString());
//     //   }
//     //   commit("SET_REQUEST_STATE", loadingState.ready);
//     // },
//     // resetPlayer({ commit }) {
//     //   commit("SET_PLAYER", null);
//     // },
//     // async fetchPlayers({ state }) {
//     //   const response = await state.helpClient?.fetchPlayer("843518525");
//     // },
//     // async fetchData({ state }) {
//     //   const response = await state.helpClient?.fetchData("effectList");
//     //   console.log(response);
//     // }
//   },
// });

// export default store;

// abilityList - list of all abilities and tiers
// equipmentList - List of all gear

//Unklikely to use
// guildRaidList - Generic raid info
// guildExchangeItemList - Exchangeable gear

//Not Helpful data:
// battleEnvironmentsList
// battleTargetingRuleList
// categoryList
// tableList
// raidConfigList
// requirementList
// recipeList

// challengeList
// challengeStyleList
// effectList
// environmentCollectionList
// eventSamplingList
// helpEntryList
// materialList
// playerTitleList
// powerUpBundleList
// skillList
// starterGuildList
// statModList
// statModSetList
// statProgressionList
// targetingSetList
// territoryBattleDefinitionList
// territoryWarDefinitionList
// unitsList
// unlockAnnouncementDefinitionList
// warDefinitionList
// xpTableList
