import { ActionContext } from "vuex";
import { v4 as uuid } from "uuid";

import { loadingState } from "../types/loading";
import { State as RootState } from "./store";
import { apiClient } from "../api/api-client";
import {
  GuildPayload,
  TerritoryBattleEvent,
  TerritoryWarEvent,
} from "../types/guild";
import { round2Decimals } from "../utils";
import { Unit } from "../types/unit";

interface State {
  requestState: loadingState;
  guildId: string;
  territoryWarEvents: TerritoryWarEvent[];
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
  },
  getters: {
    tbEvents(state: State) {
      return (type: "Light" | "Dark"): TerritoryBattleEvent[] => {
        return state.territoryBattleEvents.filter((event) => {
          return event.type === type;
        });
      };
    },
    tbAvgStars(state: State, getters: any) {
      return (type: "Light" | "Dark"): number => {
        const total = state.territoryBattleEvents.reduce(
          (total: number, e: TerritoryBattleEvent) => {
            return e.type === type ? total + e.stars : total;
          },
          0
        );
        return round2Decimals(total / getters.tbEvents(type).length);
      };
    },
    tbAvgCurrency(state: State, getters: any) {
      return (
        type: "Light" | "Dark",
        currencyType: "get1" | "get2"
      ): number => {
        const total = state.territoryBattleEvents.reduce(
          (total: number, e: TerritoryBattleEvent) => {
            return e.type === type ? total + e[currencyType] : total;
          },
          0
        );
        return round2Decimals(total / getters.tbEvents(type).length);
      };
    },
    tbAvgShards(state: State, getters: any) {
      return (type: "Light" | "Dark", unitId?: string): number => {
        const total = state.territoryBattleEvents.reduce(
          (total: number, e: TerritoryBattleEvent) => {
            if (unitId) {
              if (e.type === type && e.characterShards.id === unitId) {
                return total + e.characterShards.count;
              } else {
                return total;
              }
            } else {
              return e.type === type ? total + e.characterShards.count : total;
            }
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
    UPSERT_TERRITORY_WAR_EVENT(state: State, payload: TerritoryWarEvent) {
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
    async initialize({ commit, state, rootState }: ActionCtx) {
      commit("SET_REQUEST_STATE", loadingState.loading);
      const guildId = rootState.player.player?.guild_id || "";
      const allyCode = rootState.player.allyCode;

      if (state.requestState !== loadingState.initial) {
        commit("SET_REQUEST_STATE", loadingState.ready);
        return;
      } else if (!guildId) {
        console.error("guildId not set");
        commit("SET_REQUEST_STATE", loadingState.ready);
        return;
      }
      commit("SET_GUILD_ID", guildId);

      const [guildData, accessLevel] = await Promise.all([
        apiClient.fetchGuild(guildId),
        apiClient.fetchAccessLevel(guildId, allyCode),
      ]);
      if (guildData) {
        commit("SET_EVENTS", guildData);
      } else {
        await apiClient.createGuild(guildId);
      }
      commit("SET_ACCESS_LEVEL", accessLevel.role);
      commit("SET_REQUEST_STATE", loadingState.ready);
    },
    addTerritoryWarEvent(
      { commit, dispatch }: ActionCtx,
      event: TerritoryWarEvent
    ) {
      if (!event.id) {
        event.id = uuid();
      }
      commit("UPSERT_TERRITORY_WAR_EVENT", event);
      dispatch("saveTerritoryWarEvents");
    },
    removeTerritoryWarEvent({ commit, dispatch }: ActionCtx, eventId: string) {
      commit("REMOVE_TERRITORY_WAR_EVENT", eventId);
      dispatch("saveTerritoryWarEvents");
    },
    saveTerritoryWarEvents({ state }: ActionCtx) {
      apiClient.updateTerritoryWarEvents(
        state.guildId,
        state.territoryWarEvents
      );
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
    async fetchGuildUnitData({ state }: ActionCtx, unitId: string) {
      return await apiClient.fetchGuildUnitData(state.guildId, unitId);
    },
  },
};

export { store, State };
