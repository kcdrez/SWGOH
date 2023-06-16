import { ActionContext } from "vuex";
import { v4 as uuid } from "uuid";
import moment from "moment";

import { loadingState } from "types/loading";
import { State as RootState } from "./store";
import { apiClient } from "../api/api-client";
import {
  GuildPayload,
  TerritoryBattleEvent,
  ITerritoryWarEvent,
  iRaidEvent,
} from "types/guild";
import { round2Decimals } from "utils";
import { Goal, IGoal, iGoalPlayer } from "types/goals";
import { rest } from "lodash";

interface State {
  requestState: loadingState;
  guildId: string;
  territoryWarEvents: ITerritoryWarEvent[];
  territoryBattleEvents: TerritoryBattleEvent[];
  raidEvents: iRaidEvent[];
  accessLevel: number;
  goals: Goal[];
  players: iGoalPlayer[];
}

type ActionCtx = ActionContext<State, RootState>;

const store = {
  namespaced: true,
  state: {
    requestState: loadingState.initial,
    guildId: "",
    territoryWarEvents: [],
    territoryBattleEvents: [],
    raidEvents: [],
    accessLevel: 0,
    tbRecommended: {
      DSGeos: {
        phase1: {
          top: {
            teams: [
              {
                name: "Poggle Geos",
                units: [
                  {
                    id: "POGGLETHELESSER",
                    level: 12,
                    type: "Gear",
                  },
                  {
                    id: "GEONOSIANSPY",
                    level: 12,
                    type: "Gear",
                  },
                  {
                    id: "GEONOSIANSOLDIER",
                    level: 12,
                    type: "Gear",
                  },
                  {
                    id: "GEONOSIANBROODALPHA",
                    level: 12,
                    type: "Gear",
                  },
                  {
                    id: "SUNFAC",
                    level: 12,
                    type: "Gear",
                  },
                ],
              },
            ],
          },
        },
      },
    },
    goals: [],
    players: [],
  },
  getters: {
    tbEvents(state: State) {
      return (
        type: "Light" | "Dark" | "ROTE" | undefined
      ): TerritoryBattleEvent[] => {
        return state.territoryBattleEvents.filter((event) => {
          if (
            (event.type === "-" && type === "ROTE") ||
            (type ? event.type === type : true)
          ) {
            return moment(event.date).isAfter(moment().subtract(6, "months"));
          } else {
            return false;
          }
        });
      };
    },
    tbAvgStars(state: State, getters: any) {
      return (type: "Light" | "Dark" | "ROTE"): number => {
        const total = state.territoryBattleEvents.reduce(
          (total: number, e: TerritoryBattleEvent) => {
            if (moment(e.date).isAfter(moment().subtract(6, "months"))) {
              if ((type === "ROTE" && e.type === "-") || e.type === type) {
                return total + e.stars;
              }
            }
            return total;
          },
          0
        );
        return round2Decimals(total / getters.tbEvents(type).length);
      };
    },
    tbAvgCurrency(state: State, getters: any) {
      return (
        type: "Light" | "Dark" | "ROTE",
        currencyType: "get1" | "get2" | "get3"
      ): number => {
        const total = state.territoryBattleEvents.reduce(
          (total: number, e: TerritoryBattleEvent) => {
            if (moment(e.date).isAfter(moment().subtract(6, "months"))) {
              if ((type === "ROTE" && e.type === "-") || e.type === type) {
                return total + e[currencyType];
              }
            }
            return total;
          },
          0
        );
        return round2Decimals(total / getters.tbEvents(type).length);
      };
    },
    tbAvgShards(state: State, getters: any) {
      return (type: "Light" | "Dark" | "ROTE", unitId?: string): number => {
        const total = state.territoryBattleEvents.reduce(
          (total: number, e: TerritoryBattleEvent) => {
            if (moment(e.date).isAfter(moment().subtract(6, "months"))) {
              if (unitId) {
                if (
                  ((type === "ROTE" && e.type === "-") || e.type === type) &&
                  e.characterShards.id === unitId
                ) {
                  return total + e.characterShards.count;
                }
              } else if (
                (type === "ROTE" && e.type === "-") ||
                e.type === type
              ) {
                return total + e.characterShards.count;
              }
            }
            return total;
          },
          0
        );
        return round2Decimals(total / getters.tbEvents(type).length);
      };
    },
  },
  mutations: {
    SET_REQUEST_STATE(state: State, payload: loadingState) {
      state.requestState = payload;
    },
    SET_GUILD_ID(state: State, id: string) {
      state.guildId = id;
    },
    SET_ACCESS_LEVEL(state: State, level: number) {
      state.accessLevel = level;
    },
    SET_EVENTS(state: State, payload: GuildPayload) {
      if (payload.territoryWar) {
        state.territoryWarEvents = payload?.territoryWar || [];
      }
      if (payload.territoryBattle) {
        state.territoryBattleEvents = payload?.territoryBattle || [];
      }
      if (payload.raidEvents) {
        state.raidEvents = payload.raidEvents ?? [];
      }
      if (payload.goalList) {
        state.goals = payload?.goalList?.map((x) => new Goal(x, "guild")) ?? [];
      }
    },
    UPSERT_TERRITORY_WAR_EVENT(state: State, payload: ITerritoryWarEvent) {
      const index = state.territoryWarEvents.findIndex(
        (x) => x.id === payload.id
      );
      if (index >= 0) {
        state.territoryWarEvents.splice(index, 1, payload);
      } else {
        state.territoryWarEvents.push(payload);
      }
    },
    REMOVE_TERRITORY_WAR_EVENT(state: State, eventId: string) {
      const index = state.territoryWarEvents.findIndex((x) => x.id === eventId);
      if (index >= 0) {
        state.territoryWarEvents.splice(index, 1);
      }
    },
    UPSERT_TERRITORY_BATTLE_EVENT(state: State, payload: TerritoryBattleEvent) {
      const index = state.territoryBattleEvents.findIndex(
        (x) => x.id === payload.id
      );
      if (index >= 0) {
        state.territoryBattleEvents.splice(index, 1, payload);
      } else {
        state.territoryBattleEvents.push(payload);
      }
    },
    REMOVE_TERRITORY_BATTLE_EVENT(state: State, eventId: string) {
      const index = state.territoryBattleEvents.findIndex(
        (x) => x.id === eventId
      );
      if (index >= 0) {
        state.territoryBattleEvents.splice(index, 1);
      }
    },
    REMOVE_RAID_EVENT(state: State, eventId: string) {
      const index = state.raidEvents.findIndex((x) => x.id === eventId);
      if (index >= 0) {
        state.raidEvents.splice(index, 1);
      }
    },
    REMOVE_GOAL(state: State, goalId: string) {
      const index = state.goals.findIndex((x) => x.id === goalId);
      if (index >= 0) {
        state.goals.splice(index, 1);
      }
    },
    SET_PLAYER_DATA(state: State, playerData: iGoalPlayer[]) {
      playerData.forEach((player) => {
        const match = state.players.find((p) => player.allyCode === p.allyCode);
        if (match) {
          player.units.forEach((unit) => {
            const unitMatch = match.units.find(
              (u) => u.base_id === unit.base_id
            );
            if (!unitMatch) {
              match.units.push(unit);
            }
          });
        } else {
          state.players.push(player);
        }
      });
    },
  },
  actions: {
    async initialize(
      { commit, state, rootState, dispatch }: ActionCtx,
      routeParams: any = {}
    ) {
      const guildId =
        routeParams?.guildId || rootState.player.player?.guild_id || "";
      const allyCode = rootState.player.allyCode;

      if (state.requestState !== loadingState.initial) {
        commit("SET_REQUEST_STATE", loadingState.ready);
        return;
      } else if (!guildId) {
        console.error("guildId not set");
        commit("SET_REQUEST_STATE", loadingState.ready);
        return;
      }

      commit("SET_REQUEST_STATE", loadingState.loading);
      commit("SET_GUILD_ID", guildId);

      if (allyCode) {
        const guildData = await apiClient.fetchGuild(guildId);
        if (guildData) {
          commit("SET_EVENTS", guildData);
        } else {
          await apiClient.createGuild(guildId);
        }
        await dispatch("fetchAccessCode", { guildId, allyCode });
      } else {
        const guildData = await apiClient.fetchGuild(guildId);
        commit("SET_EVENTS", guildData);
      }

      commit("SET_REQUEST_STATE", loadingState.ready);
    },
    async fetchAccessCode(
      { commit }: ActionCtx,
      { guildId, allyCode }: { guildId: string; allyCode: string }
    ) {
      const accessLevel = await apiClient.fetchAccessLevel(guildId, allyCode);
      commit("SET_ACCESS_LEVEL", accessLevel.role);
    },
    async addTerritoryWarEvent(
      { dispatch, state }: ActionCtx,
      event: ITerritoryWarEvent
    ) {
      if (!event.id) {
        event.id = uuid();
      }
      await dispatch("saveTerritoryWarEvents", [
        ...state.territoryWarEvents,
        event,
      ]);
    },
    async removeTerritoryWarEvent(
      { commit, dispatch }: ActionCtx,
      eventId: string
    ) {
      commit("REMOVE_TERRITORY_WAR_EVENT", eventId);
      await dispatch("saveTerritoryWarEvents");
    },
    async saveTerritoryWarEvents(
      { state, commit }: ActionCtx,
      territoryWarEvents?: any[]
    ) {
      const eventList = territoryWarEvents ?? state.territoryWarEvents;
      const response = await apiClient.updateTerritoryWarEvents(
        state.guildId,
        eventList
      );
      commit("SET_EVENTS", response);
    },
    addTerritoryBattleEvent(
      { dispatch, state }: ActionCtx,
      event: TerritoryBattleEvent
    ) {
      dispatch("saveTerritoryBattleEvents", [
        ...state.territoryBattleEvents,
        event,
      ]);
    },
    removeTerritoryBattleEvent(
      { commit, dispatch, state }: ActionCtx,
      eventId: string
    ) {
      commit("REMOVE_TERRITORY_BATTLE_EVENT", eventId);
      dispatch("saveTerritoryBattleEvents", state.territoryBattleEvents);
    },
    async saveTerritoryBattleEvents(
      { state, commit }: ActionCtx,
      events: TerritoryBattleEvent[]
    ) {
      const response = await apiClient.updateTerritoryBattleEvents(
        state.guildId,
        events
      );
      commit("SET_EVENTS", response);
    },
    async fetchGuildUnitData(
      { state, commit }: ActionCtx,
      data: {
        unitId: string | string[] | undefined;
        guildId: string | undefined;
      }
    ) {
      const guildId = data.guildId ?? state.guildId;
      if (Array.isArray(data.unitId) || data.unitId === undefined) {
        const filteredIds =
          data.unitId?.filter((unitId) => {
            if (state.players.length === 0) {
              return true;
            }
            const anyPlayerHasIt = state.players.some((player) => {
              if (player.units.length === 0) {
                return true;
              }
              const exists = player.units.some(
                (unit) => unit.base_id === unitId
              );
              return exists;
            });
            return !anyPlayerHasIt;
          }) ?? undefined;
        if (filteredIds?.length ?? 0 > 0) {
          const response = await apiClient.fetchGuildUnits(
            guildId,
            filteredIds
          );
          commit("SET_PLAYER_DATA", response);
        }
      } else {
        const playerData = state.players.reduce(
          (acc: any, player: any) => {
            const { units, ...restPlayer } = player;
            if (units.length === 0) {
              acc.exists = true;
            }
            const unitMatch = units.find(
              (unit) => unit.base_id === data.unitId
            );
            acc.exists = !!unitMatch || acc.exists;
            acc.list.push({
              unit: unitMatch,
              ...restPlayer,
            });
            return acc;
          },
          { exists: false, list: [] }
        );

        if (playerData.exists) {
          return apiClient.mapGuildUnit(playerData.list);
        } else {
          const players = await apiClient.fetchGuildUnitData(
            guildId,
            data.unitId
          );
          commit(
            "SET_PLAYER_DATA",
            players.map((player) => {
              const { unit, ...restPlayer } = player;
              return {
                units: [unit],
                ...restPlayer,
              };
            })
          );

          return apiClient.mapGuildUnit(players);
        }
      }
    },
    addRaidEvent({ dispatch, state }: ActionCtx, event: iRaidEvent) {
      dispatch("saveRaidEvents", [...state.raidEvents, event]);
    },
    removeRaidEvent({ commit, dispatch, state }: ActionCtx, eventId: string) {
      commit("REMOVE_RAID_EVENT", eventId);
      dispatch("saveRaidEvents", state.raidEvents);
    },
    async saveRaidEvents({ state, commit }: ActionCtx, events: iRaidEvent[]) {
      const response = await apiClient.updateRaidEvents(state.guildId, events);
      commit("SET_EVENTS", response);
    },
    addGoal({ state, dispatch }: ActionCtx, goalData: IGoal) {
      const newGoal = new Goal(goalData);
      state?.goals.push(newGoal);
      dispatch("saveGoals", true);
    },
    removeGoal({ commit, dispatch, state }: ActionCtx, goalId: string) {
      commit("REMOVE_GOAL", goalId);
      dispatch("saveGoals", false);
    },
    saveGoal({ dispatch, state }: ActionCtx, goalData: IGoal) {
      const index = state.goals.findIndex((x) => x.id === goalData.id);
      if (index > -1) {
        state.goals.splice(index, 1, new Goal(goalData));
      }
      dispatch("saveGoals", true);
    },
    async saveGoals({ state, commit }: ActionCtx, shouldRefresh: boolean) {
      const response = await apiClient.updateGuildGoals(
        state.guildId,
        state?.goals ?? [],
        shouldRefresh
      );
      if (shouldRefresh) {
        commit("SET_PLAYER_DATA", response);
      }
    },
  },
};

export { store, State };
