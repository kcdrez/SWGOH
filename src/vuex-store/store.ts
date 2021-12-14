import { InjectionKey } from "vue";
import { createStore, Store } from "vuex";
import apiClientHelp from "../api/swgoh.help";
import apiClientGG from "../api/swgoh.gg";
import { Unit, Gear, Player, UnitData } from "../api/interfaces";

interface State {
  helpClient: apiClientHelp | null;
  ggClient: apiClientGG | null;
  unit: Unit | null;
  gearList: Gear[];
  player: Player | null;
}

export const key: InjectionKey<Store<State>> = Symbol();

const store = createStore<State>({
  state: {
    helpClient: null,
    ggClient: null,
    unit: null,
    gearList: [],
    player: null,
  },
  mutations: {
    SET_CLIENT(state, { helpClient, ggClient }) {
      state.helpClient = helpClient;
      state.ggClient = ggClient;
    },
    SET_UNIT(state, payload) {
      state.unit = payload;
    },
    SET_GEAR(state, payload: Gear[]) {
      state.gearList = payload;
    },
    SET_PLAYER(state, payload: any) {
      state.player = payload;
    },
  },
  actions: {
    async initialize({ commit, state, dispatch }) {
      const helpClient = new apiClientHelp();
      await helpClient.connect();

      const ggClient = new apiClientGG();

      commit("SET_CLIENT", {
        helpClient,
        ggClient,
      });
      const gearList = await ggClient.gear();
      const player = await ggClient.player("843518525");
      // const units = await state.helpClient?.fetchUnit([
      //   "AHSOKATANO",
      //   "MAGMATROOPER",
      // ]);
      // console.log(units);

      // const allUnits = await helpClient.fetchAllUnits();
      // console.log(allUnits);

      commit("SET_GEAR", gearList);
      commit("SET_PLAYER", player);

      // await dispatch("fetchUnit", "AHSOKATANO");
      // await dispatch("fetchUnit", ["AHSOKATANO", "MAGMATROOPER"]);
      // await dispatch("fetchPlayers");
      // await dispatch("fetchData");
      // await state.apiClient?.debug()
    },
    async fetchPlayers({ state }) {
      const response = await state.helpClient?.fetchPlayer("843518525");
    },
    async fetchUnit({ state, commit }, id) {
      const response = await state.helpClient?.fetchUnit(id);
      commit("SET_UNIT", response);
    },
    async fetchData({ state }) {
      const response = await state.helpClient?.fetchData("equipmentList");
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
