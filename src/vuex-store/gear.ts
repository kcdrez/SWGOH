import { ActionContext } from "vuex";

import { Gear, Mission } from "../api/interfaces";
import {
  difficultyIds,
  tableIds,
  mapIds,
  missionIds,
  challenges,
} from "../api/locationMapping";
import { loadingState } from '../enums/loading';
import { State as RootState } from './store'
import { unvue } from '../utils'

interface State {
  requestState: loadingState;
  gearList: Gear[];
  gearLocations: any[];
  ownedGear: any;
}

type ActionCtx = ActionContext<State, RootState>

const store = {
  namespaced: true,
  state: {
    requestState: loadingState.initial,
    gearList: [],
    gearLocations: [],
    ownedGear: {}
  },
  getters: {
    gearLocation(_state: State) {
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
        return locations.sort((a, b) => a > b ? 1 : -1);
      };
    },
    gearOwnedCount(state: State) {
      return (gear: Gear): number => {
        return state.ownedGear[gear.base_id] || 0;
      };
    },
    findGearData(state: State) {
      return (id: string): Gear | undefined => {
        return state.gearList.find((el: Gear) => el.base_id === id);
      }
    }
  },
  mutations: {
    SET_REQUEST_STATE(state: State, payload: loadingState) {
      state.requestState = payload;
    },
    SET_GEAR(state: State, payload: Gear[]) {
      state.gearList = payload;
    },
    SET_GEAR_LOCATIONS(state: State, payload: any) {
      state.gearLocations = payload;
    },
    SET_GEAR_OWNED(state: State, payload: any) {
      state.ownedGear = payload;
    },
  },
  actions: {
    async fetchGear({ commit, rootState }: ActionCtx) {
      commit("SET_REQUEST_STATE", loadingState.loading);

      let gearList = await rootState.ggClient?.gear();
      const gearLocations = await rootState.helpClient?.fetchGear();
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
      commit("SET_REQUEST_STATE", loadingState.ready);
    },
    saveOwnedCount({ state, commit }: ActionCtx, { count, base_id }: any) {
      const countData = unvue(state.ownedGear);
      countData[base_id] = count;
      commit("SET_GEAR_OWNED", countData);
      window.localStorage.setItem("ownedGear", JSON.stringify(countData));
    },
  }
}

export { store, State };