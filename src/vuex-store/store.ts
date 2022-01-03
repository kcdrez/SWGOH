import { InjectionKey } from "vue";
import { createStore, Store } from "vuex";
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

interface State {
  helpClient: apiClientHelp | null;
  ggClient: apiClientGG | null;
  unit: Unit | null;
  gearList: Gear[];
  player: Player | null;
  gearLocations: any[];
  ownedGear: any;
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
    ownedGear: {},
  },
  getters: {
    gearLocation(state: State) {
      return (missions: Mission[]): string[] => {
        const locations: string[] = [];
        missions.forEach((mission) => {
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
        return locations;
      };
    },
    gearOwnedCount(state: State) {
      return (gear: Gear): number => {
        return state.ownedGear[gear.base_id] || 0;
      };
    },
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
    SET_GEAR_OWNED(state, payload) {
      state.ownedGear = payload;
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
      const gearOwned = JSON.parse(
        window.localStorage.getItem("ownedGear") || "{}"
      );
      commit("SET_GEAR_OWNED", gearOwned);

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

      commit("SET_GEAR", gearList);
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
      const response = await state.helpClient?.fetchData("effectList");
      console.log(response);
    },
    saveOwnedCount({ state, commit }, { count, base_id }) {
      const countData = unvue(state.ownedGear);
      countData[base_id] = count;
      commit("SET_GEAR_OWNED", countData);
      window.localStorage.setItem("ownedGear", JSON.stringify(countData));
    },
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
