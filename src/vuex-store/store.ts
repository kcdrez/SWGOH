import { createStore } from "vuex";
import { store as gearStore, State as GearState } from "./gear";
import { store as unitStore, State as UnitState } from "./unit";
import { store as playerStore, State as PlayerState } from "./player";
import { store as relicStore, State as RelicState } from "./relic";
import { store as plannerStore, State as PlannerState } from "./planner";
import { loadingState } from "../types/loading";
import { ApiClient, apiClient } from "../api/api-client";

export interface State {
  apiClient: ApiClient;
  requestState: loadingState;
  //modules' state
  gear: GearState;
  relic: RelicState;
  unit: UnitState;
  player: PlayerState;
  planner: PlannerState;
}

const store = createStore<State>({
  modules: {
    gear: gearStore,
    relic: relicStore,
    unit: unitStore,
    player: playerStore,
    planner: plannerStore,
  },
  state: {
    apiClient: apiClient,
    requestState: loadingState.initial,
    gear: gearStore.state,
    relic: relicStore.state,
    unit: unitStore.state,
    player: playerStore.state,
    planner: plannerStore.state,
  },
  getters: {},
  mutations: {
    SET_REQUEST_STATE(state, payload: loadingState) {
      state.requestState = payload;
    },
  },
  actions: {
    async initialize({ commit, state, dispatch }) {
      commit("SET_REQUEST_STATE", loadingState.loading);
      await dispatch("player/initialize", { root: true });
      await dispatch("gear/fetchGear", { root: true });
      await dispatch("relic/initialize", { root: true });
      await dispatch("planner/initialize", { root: true });
      commit("SET_REQUEST_STATE", loadingState.ready);
    },
    // async fetchData({ state }) {
    //   const response = await state.apiClient?.fetchData("effectList");
    //   console.log(response);
    // },
  },
});

export default store;

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
