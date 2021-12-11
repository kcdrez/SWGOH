import { InjectionKey } from "vue";
import { createStore, Store } from "vuex";
import apiClient from "../api/client";
import { Unit } from "../api/interfaces";

interface State {
  apiClient: apiClient | null;
  unit: Unit | null;
}

export const key: InjectionKey<Store<State>> = Symbol();

const store = createStore<State>({
  state: {
    apiClient: null,
    unit: null,
  },
  mutations: {
    SET_CLIENT(state, client) {
      state.apiClient = client;
    },
    SET_UNIT(state, payload) {
      state.unit = payload;
    },
  },
  actions: {
    async initialize({ commit, state, dispatch }) {
      const client = new apiClient();
      await client.connect();

      commit("SET_CLIENT", client);

      await dispatch("fetchUnit", "AHSOKATANO");
      // await dispatch("fetchPlayers");
      await dispatch("fetchData");
    },
    async fetchPlayers({ state }) {
      const response = await state.apiClient?.fetchPlayer("843518525");
      console.log(response);
    },
    async fetchUnit({ state, commit }, id) {
      const response = await state.apiClient?.fetchUnit(id);
      commit("SET_UNIT", response);
      console.log(response);
    },
    async fetchData({ state }) {
      const response = await state.apiClient?.fetchData("equipmentList");
      console.log(response);
    },
  },
});

export default store;

// abilityList
// battleEnvironmentsList
// battleTargetingRuleList
// categoryList
// challengeList
// challengeStyleList
// effectList
// environmentCollectionList
// equipmentList
// eventSamplingList
// guildExchangeItemList
// guildRaidList
// helpEntryList
// materialList
// playerTitleList
// powerUpBundleList
// raidConfigList
// recipeList
// requirementList
// skillList
// starterGuildList
// statModList
// statModSetList
// statProgressionList
// tableList
// targetingSetList
// territoryBattleDefinitionList
// territoryWarDefinitionList
// unitsList
// unlockAnnouncementDefinitionList
// warDefinitionList
// xpTableList
