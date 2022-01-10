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

import { Gear, Mission } from "../api/interfaces";
import {
  difficultyIds,
  tableIds,
  mapIds,
  missionIds,
  challenges,
} from "../api/locationMapping";
import { loadingState } from "../enums/loading";
import { State as RootState } from "./store";

export type State = {
  gearList: Gear[];
  gearLocations: any[];
  ownedGear: any;
  requestState: loadingState;
};

export const state: State = {
  requestState: loadingState.initial,
  gearList: [],
  gearLocations: [],
  ownedGear: {},
};

enum MutationTypes {
  SET_REQUEST_STATE = "SET_REQUEST_STATE",
  SET_GEAR = "SET_GEAR",
  SET_GEAR_LOCATIONS = "SET_GEAR_LOCATIONS",
  SET_GEAR_OWNED = "SET_GEAR_OWNED",
}

type Mutations<S = State> = {
  [MutationTypes.SET_REQUEST_STATE](state: S, payload: loadingState): void;
  [MutationTypes.SET_GEAR](state: S, payload: Gear[]): void;
  [MutationTypes.SET_GEAR_LOCATIONS](state: S, payload: any): void; //todo add type for payload
  [MutationTypes.SET_GEAR_OWNED](state: S, payload: any): void; //todo add type for payload
};

const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_REQUEST_STATE](state: State, payload: loadingState) {
    state.requestState = payload;
  },
  [MutationTypes.SET_GEAR](state: State, payload: Gear[]) {
    state.gearList = payload;
  },
  [MutationTypes.SET_GEAR_LOCATIONS](state: State, payload: any) {
    state.gearLocations = payload;
  },
  [MutationTypes.SET_GEAR_OWNED](state: State, payload: any) {
    state.ownedGear = payload;
  },
};

enum ActionTypes {
  fetchGear = "fetchGear",
  saveOwnedCount = "saveOwnedCount",
}

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, "commit">;

interface Actions {
  [ActionTypes.fetchGear]({ commit }: AugmentedActionContext): void;
}

const actions: ActionTree<State, RootState> & Actions = {
  async [ActionTypes.fetchGear]({
    commit,
    dispatch,
    rootState,
  }: AugmentedActionContext) {
    commit(MutationTypes.SET_REQUEST_STATE, loadingState.loading);

    let gearList = await rootState.ggClient?.gear();
    const gearLocations = await rootState.helpClient?.fetchGear();
    const gearOwned = JSON.parse(
      window.localStorage.getItem("ownedGear") || "{}"
    );
    commit(MutationTypes.SET_GEAR_OWNED, gearOwned);

    gearList = gearList.map((gear: any) => {
      const match = gearLocations.find((x: any) => x.id === gear.base_id);
      if (match) {
        const { lookupMissionList, raidLookupList, actionLinkLookupList } =
          match;
        return {
          ...gear,
          lookupMissionList,
          raidLookupList,
          actionLinkLookupList,
        };
      } else {
        return gear;
      }
    });

    commit(MutationTypes.SET_GEAR, gearList);
    commit(MutationTypes.SET_REQUEST_STATE, loadingState.ready);
  },
};

type gearLocationFn = (missions: Mission[]) => string[];
type gearOwnedCountFn = (gear: Gear) => number;
type findGearDataFn = (id: string) => Gear | undefined;
type Getters = {
  gearLocation(state: State): gearLocationFn;
  gearOwnedCount(state: State): gearOwnedCountFn;
  findGearData(state: State): findGearDataFn;
};

const getters: GetterTree<State, RootState> & Getters = {
  gearLocation: (_state) => {
    return (missions: Mission[]): string[] => {
      const locations: string[] = [];
      missions?.forEach((mission) => {
        const {
          campaignId,
          campaignNodeDifficulty,
          campaignMapId,
          campaignMissionId,
          campaignNodeId,
        } = mission.missionIdentifier;
        const difficulty: any = difficultyIds[campaignNodeDifficulty];
        const table: any = tableIds[campaignId];
        const level: any = mapIds[campaignMapId];
        const node: any = missionIds[campaignMissionId];

        if (campaignMapId === "CHALLENGES") {
          const label = `Daily Challenges (${challenges[campaignNodeId]})`;
          if (!locations.includes(label)) {
            locations.push(label);
          }
        } else if (table) {
          locations.push(`${table} ${level}-${node} (${difficulty})`);
        }
      });
      return locations.sort((a, b) => (a > b ? 1 : -1));
    };
  },
  gearOwnedCount: (state) => {
    return (gear: Gear): number => {
      return state.ownedGear[gear.base_id] || 0;
    };
  },
  findGearData(state) {
    return (id: string): Gear | undefined => {
      return state.gearList.find((el: Gear) => el.base_id === id);
    };
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
