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
import { store as gearStore } from './gear'
import { loadingState } from '../enums/loading';

export interface State {
  helpClient: apiClientHelp | null;
  ggClient: apiClientGG | null;
  unit: Unit | null;
  player: Player | null;
  allyCode: string;
  requestState: loadingState;
}

export const key: InjectionKey<Store<State>> = Symbol();

const store = createStore<State>({
  modules: {
    gear: gearStore
  },
  state: {
    helpClient: null,
    ggClient: null,
    unit: null,
    player: null,
    allyCode: "",
    requestState: loadingState.initial
  },
  getters: {},
  mutations: {
    SET_REQUEST_STATE(state, payload: loadingState) {
      state.requestState = payload;
    },
    SET_CLIENT(state, { helpClient, ggClient }) {
      state.helpClient = helpClient;
      state.ggClient = ggClient;
    },
    SET_UNIT(state, payload) {
      state.unit = payload;
    },
    SET_PLAYER(state, payload: any) {
      state.player = payload;
    },
    SET_ALLY_CODE(state, payload) {
      state.allyCode = payload;
    },
  },
  actions: {
    async initialize({ commit, state, dispatch }) {
      commit("SET_REQUEST_STATE", loadingState.loading);

      const helpClient = new apiClientHelp();
      await helpClient.connect();

      const ggClient = new apiClientGG();

      commit("SET_CLIENT", {
        helpClient,
        ggClient,
      });

      const allyCode = window.localStorage.getItem("allyCode") || "";
      if (allyCode) {
        dispatch("fetchPlayer", allyCode);
      }

      // await dispatch("fetchUnit", "C3POCHEWBACCA");
      // await dispatch("fetchUnit", ["AHSOKATANO", "MAGMATROOPER"]);
      // await dispatch("fetchPlayers");
      // await dispatch("fetchData");
      // await state.apiClient?.debug()
      commit("SET_REQUEST_STATE", loadingState.ready);

      dispatch("gear/fetchGear", { root: true });
    },
    async fetchPlayer({ state, commit }, allyCode: string | number) {
      commit("SET_REQUEST_STATE", loadingState.loading);
      const player = await state.ggClient?.player(allyCode.toString());
      if (player) {
        commit("SET_PLAYER", player);
        commit("SET_ALLY_CODE", allyCode);
        window.localStorage.setItem("allyCode", allyCode.toString());
      }
      commit("SET_REQUEST_STATE", loadingState.ready);
    },
    resetPlayer({ commit }) {
      commit("SET_PLAYER", null);
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
    }
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
