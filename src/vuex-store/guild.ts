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
} from "types/guild";
import { round2Decimals } from "utils";

interface State {
  requestState: loadingState;
  guildId: string;
  territoryWarEvents: ITerritoryWarEvent[];
  territoryBattleEvents: TerritoryBattleEvent[];
  accessLevel: number;
}

type ActionCtx = ActionContext<State, RootState>;

const store = {
  namespaced: true,
  state: {
    requestState: loadingState.initial,
    guildId: "",
    territoryWarEvents: [],
    territoryBattleEvents: [],
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
      state.territoryWarEvents = payload?.territoryWar || [];
      state.territoryBattleEvents = payload?.territoryBattle || [];
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
      { state }: ActionCtx,
      data: {
        unitId: string | string[] | undefined;
        guildId: string | undefined;
      }
    ) {
      const guildId = data.guildId ?? state.guildId;
      if (Array.isArray(data.unitId) || data.unitId === undefined) {
        return await apiClient.fetchGuildUnits(guildId, data.unitId);
      } else {
        return await apiClient.fetchGuildUnitData(guildId, data.unitId);
      }
    },
  },
};

export { store, State };
