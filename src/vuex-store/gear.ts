import { ActionContext } from "vuex";

import { Gear, ConfigType, OwnedCount, EnergyType } from "../types/gear";
import { loadingState } from "../types/loading";
import { State as RootState } from "./store";
import { apiClient } from "../api/api-client";
import {
  challenges,
  difficultyIds,
  mapIds,
  missionIds,
  missionIdsOffset,
  tableIds,
} from "../types/locationMapping";
import { nodeList, gearList, storesData } from "../components/gear/tempData";

type updateEnergy = {
  value: number;
  type: "standard" | "fleet";
};

interface State {
  requestState: loadingState;
  gearList: Gear[];
  gearLocations: any[];
  gearConfig: ConfigType;
  refreshes: EnergyType;
  energy: EnergyType;
}

type ActionCtx = ActionContext<State, RootState>;

const store = {
  namespaced: true,
  state: {
    requestState: loadingState.initial,
    gearList: [],
    gearLocations: [],
    gearConfig: {},
    refreshes: { standard: 0, fleet: 0 },
    energy: { standard: 0, fleet: 0 },
  },
  getters: {
    allFarmableNodes(state: State) {
      const locations: any[] = [];
      state.gearList.forEach((gear) => {
        gear.missionList.forEach((mission) => {
          const {
            campaignId,
            campaignNodeDifficulty,
            campaignMapId,
            campaignMissionId,
            campaignNodeId,
          } = mission.missionIdentifier;
          const difficulty: string = difficultyIds[campaignNodeDifficulty];
          const table: string = tableIds[campaignId];
          const level: string = mapIds[campaignMapId];
          let node: string = "";

          if (campaignMapId === "CHALLENGES") {
            // const label = `Daily Challenges (${challenges[campaignNodeId]})`;
          } else if (table) {
            const tableStr =
              table === "Light" || table === "Dark" ? `${table} Side` : table;

            if (difficulty === "Hard") {
              node = missionIdsOffset[campaignMissionId];
            } else if (difficulty === "Normal") {
              node = missionIds[campaignMissionId];
            } else {
              console.log("unknown difficulty", difficulty);
            }

            const id = `${tableStr
              .replace(" ", "")
              .toLowerCase()}_${difficulty.toLowerCase()}_${level}${node.toLowerCase()}`;
            const locationMatch = locations.find((x) => x.id === id);
            if (locationMatch) {
              locationMatch.gear.push({
                id: gear.id,
              });
            } else {
              locations.push({
                id,
                table: tableStr,
                difficulty,
                level,
                node,
                gear: [{ id: gear.id }],
              });
            }
          }
        });
      });

      const hardNodes = nodeList.map((node) => {
        const match = locations.find((x) => x.id === node.id);
        if (match) {
          return {
            ...node,
            ...match,
          };
        } else {
          // console.warn("Couldnt find gear data for " + node.id);
          // return { ...node, gear: [] };
          return node;
        }
      });
      const normalNodes = locations.map((location) => {
        const match = nodeList.find((x) => x.id === location.id);
        if (match) {
          return {
            ...location,
            ...match,
          };
        } else {
          // console.warn("Couldnt find character data for " + location.id);
          // return { ...location, characters: [] };
          return location;
        }
      });
      const allNodes = [...hardNodes, ...normalNodes];
      const combined: any[] = [];

      allNodes.forEach((x) => {
        const filtered = combined.filter((y: any) => y.id === x.id);
        if (filtered.length > 0) {
          const combinedData = filtered.reduce(
            (acc, el) => {
              return { ...acc, ...el };
            },
            { ...x }
          );
          combined.push(combinedData);
        } else {
          combined.push(x);
        }
      });
      return combined;
    },
    allGearFarmableLocations(state: State) {
      return state.gearList.map((gear: Gear) => {
        const locations = gear.locations;
        const guildStoreMatch = storesData.guildStore.find(
          (x) => x.id === gear.id
        );
        const squadArenaMatch = storesData.squadArenaStore.find(
          (x) => x.id === gear.id
        );
        const get2 = storesData.guildEventsStore_get2.find(
          (x) => x.id === gear.id
        );
        const get1 = storesData.guildEventsStore_get1.find(
          (x) => x.id === gear.id
        );
        const champMatch = storesData.championshipStore.find(
          (x) => x.id === gear.id
        );
        const shardShopMatch = storesData.shardShop.find(
          (x) => x.id === gear.id
        );
        const conquestStoreMatch = storesData.conquestStore.find(
          (x) => x.id === gear.id
        );

        if (guildStoreMatch) {
          locations.push("Guild Store");
        }
        if (squadArenaMatch) {
          locations.push("Squad Arena Store");
        }
        if (get1) {
          locations.push("Guild Events Store (GET1)");
        }
        if (get2) {
          locations.push("Guild Events Store (GET2)");
        }
        if (champMatch) {
          locations.push("Championship Store");
        }
        if (shardShopMatch) {
          locations.push("Shard Shop Currency");
        }
        if (conquestStoreMatch) {
          locations.push("Conquest Store");
        }
        return {
          id: gear.id,
          name: gear.name,
          locations,
        };
      });
    },
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
      state.gearConfig = payload;
    },
    UPSERT_OWNED_GEAR(state: State, payload: OwnedCount) {
      state.gearConfig[payload.id] = {
        owned: payload.count || 0,
        irrelevant: !!payload.irrelevant,
      };
    },
    UPDATE_REFRESHES(state: State, payload: updateEnergy) {
      state.refreshes[payload.type] = payload.value;
    },
    UPDATE_ENERGY(state: State, payload: updateEnergy) {
      state.energy[payload.type] = payload.value;
    },
  },
  actions: {
    async initialize({ commit, state, rootState }: ActionCtx) {
      if (state.requestState === loadingState.initial) {
        commit("SET_REQUEST_STATE", loadingState.loading);
        commit("SET_GEAR_OWNED", rootState.player.player?.gear);

        const refreshStandard: updateEnergy = {
          type: "standard",
          value: rootState.player.player?.energyData?.refreshes?.standard || 0,
        };
        const refreshFleet: updateEnergy = {
          type: "fleet",
          value: rootState.player.player?.energyData?.refreshes?.fleet || 0,
        };

        const energyStandard: updateEnergy = {
          type: "standard",
          value: rootState.player.player?.energyData?.energy?.standard || 0,
        };
        const energyFleet: updateEnergy = {
          type: "fleet",
          value: rootState.player.player?.energyData?.energy?.fleet || 0,
        };

        commit("UPDATE_REFRESHES", refreshStandard);
        commit("UPDATE_REFRESHES", refreshFleet);
        commit("UPDATE_ENERGY", energyStandard);
        commit("UPDATE_ENERGY", energyFleet);

        const gearList = await apiClient.fetchGearList();
        commit("SET_GEAR", gearList);

        commit("SET_REQUEST_STATE", loadingState.ready);
      }
    },
    saveOwnedCount({ commit, state, rootState }: ActionCtx, data: OwnedCount) {
      commit("UPSERT_OWNED_GEAR", data);
      if (rootState.player?.player) {
        apiClient.saveGearData(rootState.player.player.id, state.gearConfig);
      }
    },
    updateRefreshes({ commit, dispatch }: ActionCtx, payload: updateEnergy) {
      commit("UPDATE_REFRESHES", payload);
      dispatch("player/saveEnergy", null, { root: true });
    },
    updateEnergy({ commit, dispatch }: ActionCtx, payload: updateEnergy) {
      commit("UPDATE_ENERGY", payload);
      dispatch("player/saveEnergy", null, { root: true });
    },
  },
};

export { store, State };
