import { ActionContext } from "vuex";

import { Gear, Mission, ConfigType, OwnedCount } from "../types/gear";
import {
  difficultyIds,
  tableIds,
  mapIds,
  missionIds,
  challenges,
} from "../types/locationMapping";
import { loadingState } from "../types/loading";
import { State as RootState } from "./store";
import { Unit } from "../types/unit";
import { apiClient } from "../api/api-client";

export const maxGearLevel = 13;

interface State {
  requestState: loadingState;
  gearList: Gear[];
  gearLocations: any[];
  gearConfig: ConfigType;
  refreshes: { standard: number; fleet: number };
  energy: { standard: number; fleet: number };
  maxGearLevel: number;
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
    maxGearLevel,
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
        return locations.sort((a, b) => (a > b ? 1 : -1));
      };
    },
    gearOwnedCount(state: State) {
      return (gear: Gear): number => {
        return state.gearConfig[gear.id]?.owned || 0;
      };
    },
    findGearData(state: State) {
      return (id: string): Gear | undefined => {
        return state.gearList.find((el: Gear) => el.id === id);
      };
    },
    gearOptions(_state: State) {
      return (gearLevel: number): number[] => {
        const list = [];
        for (let i = (gearLevel || 0) + 1; i <= maxGearLevel; i++) {
          list.push(i);
        }
        return list;
      };
    },
    timeEstimation(state: State, getters: any) {
      return (gear: Gear): number => {
        if (state.gearConfig[gear.id]?.irrelevant) {
          return 0;
        }
        const owned: number = getters.gearOwnedCount(gear);
        const remaining = gear.amount - owned;

        if (remaining > 0) {
          let energy = 100;
          let totalDays = 0;

          gear.lookupMissionList.forEach((mission) => {
            const {
              campaignId,
              campaignNodeDifficulty,
              campaignMapId,
              campaignMissionId,
              campaignNodeId,
            } = mission.missionIdentifier;

            if (["C01SP", "C01D", "C01L"].includes(campaignId)) {
              let missionEnergy = 1;
              const node = Number(campaignMissionId.replace(/\D/g, ""));

              if (node <= 4) {
                missionEnergy = 6;
              } else if (node >= 6) {
                missionEnergy = 8;
              } else if (node >= 9) {
                missionEnergy = 10;
              }

              if (campaignNodeDifficulty === 5) {
                missionEnergy *= 2;
              }

              if (missionEnergy < energy) {
                const dropRate = 0.2;
                const refreshes = ["C01D", "C01L"].includes(campaignId)
                  ? state.refreshes.standard
                  : state.refreshes.fleet;
                const extraEnergy = ["C01D", "C01L"].includes(campaignId)
                  ? 135
                  : 45;
                const otherEnergy = ["C01D", "C01L"].includes(campaignId)
                  ? state.energy.standard
                  : state.energy.fleet;
                const totalEnergy =
                  240 + extraEnergy + 120 * refreshes - otherEnergy;

                const chancesPerDay = totalEnergy / missionEnergy;
                const piecesPerDay = chancesPerDay * dropRate;
                totalDays = remaining / piecesPerDay;
                energy = missionEnergy;
              }
            } else if (campaignMapId === "CHALLENGES") {
              energy = 0;
              totalDays = remaining / (60 / 7);
            }
          });
          return Math.round(totalDays);
        } else {
          return 0;
        }
      };
    },
    totalDays(state: State, getters: any, rootState: RootState) {
      return (unit: Unit): any => {
        const { target } = rootState.planner.targetConfig[unit.id].gear;
        let totalStandard = 0;
        let totalFleet = 0;
        let totalChallenges = 0;
        getters.fullSalvageList(unit, target).forEach((gear: Gear) => {
          const isChallenge = gear.lookupMissionList.some(
            (x: Mission) => x.missionIdentifier.campaignMapId === "CHALLENGES"
          );
          const isFleet = gear.lookupMissionList.some(
            (x: Mission) => x.missionIdentifier.campaignId === "C01SP"
          );
          if (state.gearConfig[gear.id]?.irrelevant) {
            //do nothing
          } else if (isChallenge) {
            totalChallenges = Math.max(
              getters.timeEstimation(gear),
              totalChallenges
            );
          } else if (isFleet) {
            totalFleet += getters.timeEstimation(gear);
          } else {
            totalStandard += getters.timeEstimation(gear);
          }
        });
        return Math.max(totalStandard, totalFleet, totalChallenges);
      };
    },
    fullGearListByLevel(state: State, getters: any) {
      return (unit: Unit): any[] => {
        if (unit) {
          const { gear_level } = unit;
          const futureGear =
            unit?.unitTierList.filter((x: any) => x.tier >= gear_level) || [];


          return futureGear.map((gear: any) => {
            return {
              tier: gear.tier,
              gear: gear.equipmentSetList
                .map((id: string, index: number) => {
                  let alreadyEquipped = false;
                  if (gear.tier === unit?.gear_level) {
                    alreadyEquipped = unit?.gear[index].is_obtained || false;
                  }

                  if (alreadyEquipped) {
                    return null;
                  } else {
                    return getters.findGearData(id);
                  }
                })
                .filter((x: any) => !!x),
            };
          });
        } else {
          return [];
        }
      };
    },
    fullSalvageList(state: State, getters: any) {
      return (unit: Unit, gearTarget: number): Gear[] => {
        let list: Gear[] = [];
        getters.fullGearListByLevel(unit).forEach((tier: any) => {
          console.log(tier)
          if (tier.tier + 1 <= gearTarget) {
            tier.gear.forEach((gear: any) => {
              gear.ingredients.forEach(({ gear, amount }: any) => {
                const gearData = { ...getters.findGearData(gear), amount };
                const exists = list.find(
                  (x: any) => x.id === gearData.id
                );
                if (exists) {
                  exists.amount += amount;
                } else {
                  list.push(gearData);
                }
              });
            });
          }
        });
        return list;
      };
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
        irrelevant: payload.irrelevant,
      };
    },
    UPDATE_REFRESHES(
      state: State,
      payload: { value: number; type: "standard" | "fleet" }
    ) {
      state.refreshes[payload.type] = payload.value;
    },
    UPDATE_ENERGY(
      state: State,
      payload: { value: number; type: "standard" | "fleet" }
    ) {
      state.energy[payload.type] = payload.value;
    },
  },
  actions: {
    async fetchGear({ commit, rootState }: ActionCtx) {
      commit("SET_REQUEST_STATE", loadingState.loading);

      let gearList = await rootState.apiClient?.fetchGearList();
      // commit("SET_GEAR_OWNED", gearOwned);
      commit("SET_GEAR", gearList);
      commit("SET_REQUEST_STATE", loadingState.ready);
    },
    saveOwnedCount({ commit, state, rootState }: ActionCtx, data: OwnedCount) {
      commit("UPSERT_OWNED_GEAR", data);
      if (rootState.player?.player) {
        apiClient.saveGearData(rootState.player.player.id, state.gearConfig);
      }
    },
  },
};

export { store, State };
