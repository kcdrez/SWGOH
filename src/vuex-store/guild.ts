import { ActionContext } from "vuex";
import { v4 as uuid } from "uuid";

import { loadingState } from "../types/loading";
import { State as RootState } from "./store";
import { SpeedAbility, Team, TeamMember } from "../types/teams";
import { Unit } from "../types/unit";
import { apiClient } from "../api/api-client";
import {
  GuildPayload,
  TerritoryBattleEvent,
  TerritoryWarEvent,
} from "../types/guild";
import { round2Decimals } from "../utils";

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
      return (type: "Light" | "Dark"): number => {
        const total = state.territoryBattleEvents.reduce(
          (total: number, e: TerritoryBattleEvent) => {
            return e.type === type ? total + e.characterShards.count : total;
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
      const guildId = rootState.player.player?.guild_id || "";
      const allyCode = rootState.player.allyCode;

      if (state.requestState !== loadingState.initial) {
        return;
      } else if (!guildId) {
        console.error("guildId not set");
        return;
      }

      commit("SET_REQUEST_STATE", loadingState.loading);
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
  },
};

function unitMatchesLeader(
  leader: SpeedAbility,
  unit: Unit,
  leaderId: string,
  gameMode: string = "",
  checkGameMode: boolean = false
): number {
  if (leader.omicron && gameMode === leader.omicron.mode && checkGameMode) {
    return unitMatchesLeader(leader.omicron, unit, leaderId);
  } else if (leader.special && leader.special.tags) {
    if (anyTagsMatch(unit, leaderId, leader.special.tags)) {
      return leader.special.value || 0;
    } else if (anyTagsMatch(unit, leaderId, leader.tags || [])) {
      return leader.value || 0;
    }
  } else if (leader.tags) {
    if (anyTagsMatch(unit, leaderId, leader.tags)) {
      return leader.value || 0;
    }
  }
  return 0;
}

function allTagsMatch(
  unit: Unit,
  leaderId: string,
  tagsList: string[]
): boolean {
  return tagsList.some((x) => {
    let matchesList: boolean[] = [];
    const split = x.split(" & ").map((x) => x.trim());

    split.forEach((el) => {
      let tagMatches = false;
      if (unit.alignment === el) {
        tagMatches = true;
      } else if (unit.categories.includes(el)) {
        tagMatches = true;
      } else if (el === "Self" && unit.id === leaderId) {
        tagMatches = true;
      }
      matchesList.push(tagMatches);
    });
    return matchesList.every((x) => x === true);
  });
}

function anyTagsMatch(
  unit: Unit,
  leaderId: string,
  tagsList: string[]
): boolean {
  if (tagsList.includes("!Self") && unit.id === leaderId) {
    return false;
  } else if (tagsList.some((r) => r.includes("&"))) {
    return allTagsMatch(unit, leaderId, tagsList);
  } else if (tagsList.some((r) => unit.alignment === r)) {
    return true;
  } else if (tagsList.some((r) => unit.categories.includes(r))) {
    return true;
  } else if (tagsList.includes("Self") && unit.id === leaderId) {
    return true;
  } else if (tagsList.some((r) => r === "Ally")) {
    return true;
  } else if (tagsList.some((t) => t === unit.id)) {
    return true;
  }
  return false;
}

function getSpeedAmount(value: number | undefined, baseSpeed: number): number {
  if (value) {
    if (value < 1) {
      return baseSpeed * value;
    } else {
      return value;
    }
  }
  return 0;
}

function getUniqueAbilitySpeed(
  ability: SpeedAbility,
  unitData: Unit,
  team: Team,
  checkGameMode: boolean,
  getUnitData: Function,
  getGrandTotal: Function,
  getUniqueTotal: Function
): number {
  if (ability.scalesBy) {
    if (anyTagsMatch(unitData, unitData.id, ability.tags || [])) {
      return team.units.reduce((total: number, member: TeamMember) => {
        const teamMemberData: Unit = getUnitData(member.id);
        if (member.id === unitData.id && ability.scalesBy?.includes("!Self")) {
          //do nothing
        } else if (
          anyTagsMatch(teamMemberData, unitData.id, ability?.scalesBy || [])
        ) {
          if (ability.scalesBy?.includes("Self")) {
            if (ability.scaleSource === "total") {
              total += getSpeedAmount(
                ability.value,
                getGrandTotal(member, team, checkGameMode)
              );
            } else if (ability.scaleSource === "unique") {
              const uniqueTotal = getUniqueTotal(team, member, checkGameMode);
              const speedAmount = getSpeedAmount(
                ability.value,
                uniqueTotal + teamMemberData.stats["5"]
              );
              total += speedAmount;
            } else {
              total += getSpeedAmount(ability.value, teamMemberData.stats["5"]);
            }
          } else {
            total += getSpeedAmount(ability.value, unitData.stats["5"]);
          }
        }
        return total;
      }, 0);
    }
  } else if (
    ability.omicron &&
    team.gameMode === ability.omicron.mode &&
    checkGameMode
  ) {
    return getUniqueAbilitySpeed(
      ability.omicron,
      unitData,
      team,
      checkGameMode,
      getUnitData,
      getGrandTotal,
      getUniqueTotal
    );
  } else {
    return getSpeedAmount(ability.value, unitData.stats["5"]);
  }
  return 0;
}

function getUniqueFromTeamMembers(
  ability: SpeedAbility,
  unit: Unit,
  fullTeam: Team,
  sourceMember: TeamMember,
  checkGameMode: boolean,
  getUnitData: Function,
  getGrandTotal: Function,
  getUniqueTotal: Function
): number {
  let amount = 0;
  if (
    ability.omicron &&
    fullTeam.gameMode === ability.omicron.mode &&
    checkGameMode
  ) {
    return getUniqueFromTeamMembers(
      ability.omicron,
      unit,
      fullTeam,
      sourceMember,
      checkGameMode,
      getUnitData,
      getGrandTotal,
      getUniqueTotal
    );
  } else if (
    anyTagsMatch(unit, sourceMember.id, ability?.tags || []) &&
    sourceMember.id !== unit.id
  ) {
    if (ability.scalesBy?.includes("Self")) {
      const memberData: Unit = getUnitData(sourceMember.id);

      if (ability.scaleSource === "total") {
        const total = getGrandTotal(sourceMember, fullTeam, checkGameMode);
        amount += getSpeedAmount(ability.value, total);
      } else if (ability.scaleSource === "unique") {
        const uniqueTotal = getUniqueTotal(
          fullTeam,
          sourceMember,
          checkGameMode
        );
        const speedAmount = getSpeedAmount(
          ability.value,
          uniqueTotal + memberData.stats["5"]
        );
        amount += speedAmount;
      } else {
        amount += getSpeedAmount(ability.value, memberData.stats["5"]);
      }
    } else {
      amount += getUniqueAbilitySpeed(
        ability,
        unit,
        fullTeam,
        checkGameMode,
        getUnitData,
        getGrandTotal,
        getUniqueTotal
      );
    }
  }
  return amount;
}

export { store, State };
