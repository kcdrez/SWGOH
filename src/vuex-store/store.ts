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
  gearLocations: any[];
}

export const key: InjectionKey<Store<State>> = Symbol();

const store = createStore<State>({
  state: {
    helpClient: null,
    ggClient: null,
    unit: null,
    gearList: [],
    player: null,
    gearLocations: [],
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
    SET_GEAR_LOCATIONS(state, payload: any) {
      state.gearLocations = payload;
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
      let gearList = await ggClient.gear();
      const player = await ggClient.player("843518525");
      const gearLocations = await helpClient.fetchGear();

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
      // const units = await state.helpClient?.fetchUnit([
      //   "AHSOKATANO",
      //   "MAGMATROOPER",
      // ]);
      // console.log(units);

      // const allUnits = await helpClient.fetchAllUnits();
      // console.log(allUnits);

      // const x = await helpClient.fetchEvents();
      // console.log(x);

      commit("SET_GEAR", gearList);
      // commit("SET_GEAR_LOCATIONS", gearLocations);
      commit("SET_PLAYER", player);

      // await dispatch("fetchUnit", "C3POCHEWBACCA");
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
