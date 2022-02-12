import { ActionContext } from "vuex";
import { v4 as uuid } from "uuid";

import { loadingState } from "../types/loading";
import { State as RootState } from "./store";
import { SpeedAbility, Team } from "../types/teams";
import { Unit } from "../types/unit";
import { apiClient } from "../api/api-client";
import { Player, PlayerResponse } from "../types/player";

interface State {
  requestState: loadingState;
  player: Player | null;
  teams: Team[];
  allyCode: string;
}

type ActionCtx = ActionContext<State, RootState>;

const store = {
  namespaced: true,
  state: {
    requestState: loadingState.initial,
    teams: [],
    allyCode: "",
    player: null,
  },
  getters: {},
  mutations: {
    SET_REQUEST_STATE(state: State, payload: loadingState) {
      state.requestState = payload;
    },
    SET_TEAMS(state: State, payload: Team[]) {
      state.teams = payload;
    },
    UPSERT_TEAM(state: State, payload: Team) {
      const index = state.teams.findIndex((x) => x.id === payload.id);
      if (index >= 0) {
        state.teams.splice(index, 1, payload);
      } else {
        state.teams.push(payload);
      }
    },
    ADD_UNIT(state: State, payload: { teamId: string; unit: Unit }) {
      const match = state.teams.find((x) => x.id === payload.teamId);
      if (match) {
        match.units.push({ id: payload.unit.id, speedBonus: 0 });
      }
    },
    REMOVE_UNIT(state: State, payload: { teamId: string; unit: Unit }) {
      const matchTeam = state.teams.find((x) => x.id === payload.teamId);
      if (matchTeam) {
        const unitIndex = matchTeam.units.findIndex(
          (x) => x.id === payload.unit.id
        );
        if (unitIndex >= 0) {
          matchTeam.units.splice(unitIndex, 1);
        }
      }
    },
    DELETE_TEAM(state: State, team: Team) {
      const index = state.teams.findIndex((x) => x.id === team.id);
      if (index >= 0) {
        state.teams.splice(index, 1);
      }
    },
    SET_OPPONENT(state: State, payload: any) {
      state.player = payload;
    },
    SET_ALLY_CODE(state: State, payload: string | null) {
      if (typeof payload === "string") {
        state.allyCode = payload;
        window.localStorage.setItem("opponentAllyCode", payload);
      } else {
        state.allyCode = "";
        window.localStorage.removeItem("opponentAllyCode");
      }
    },
  },
  actions: {
    async initialize({ commit, dispatch }: ActionCtx, player: PlayerResponse) {
      //todo: handle player.opponent
      commit("SET_REQUEST_STATE", loadingState.loading);
      const allyCode = window.localStorage.getItem("opponentAllyCode") || "";
      if (allyCode) {
        await dispatch("fetchPlayer", allyCode);
      }
      commit("SET_REQUEST_STATE", loadingState.ready);
    },
    async fetchPlayer({ commit }: ActionCtx, allyCode: string) {
      commit("SET_REQUEST_STATE", loadingState.loading);
      try {
        const player = await apiClient.fetchPlayer(allyCode);
        commit("SET_OPPONENT", player);
        commit("SET_ALLY_CODE", allyCode);
        commit("SET_REQUEST_STATE", loadingState.ready);
      } catch (err) {
        console.error(err);
        commit("SET_REQUEST_STATE", loadingState.error);
      }
    },
    addTeam({ commit, dispatch }: ActionCtx, team: Team) {
      if (!team) {
        commit("UPSERT_TEAM", {
          id: uuid(),
          name: "Default Name",
          units: [],
          // sortMethod: "total"
        });
      } else {
        commit("UPSERT_TEAM", team);
      }
      dispatch("saveTeams");
    },
    addUnit(
      { commit, dispatch }: ActionCtx,
      data: { teamId: string; unit: Unit }
    ) {
      commit("ADD_UNIT", data);
      dispatch("saveTeams");
    },
    removeUnit(
      { commit, dispatch }: ActionCtx,
      data: { teamId: string; unit: Unit }
    ) {
      commit("REMOVE_UNIT", data);
      dispatch("saveTeams");
    },
    deleteTeam({ commit, dispatch }: ActionCtx, team: Team) {
      commit("DELETE_TEAM", team);
      dispatch("saveTeams");
    },
    saveTeams({ rootState, state }: ActionCtx) {
      apiClient.updateTeams(rootState.player.player?.id || "", state.teams);
    },
  },
};

function unitMatchesLeader(
  leader: SpeedAbility,
  unit: Unit,
  leaderId: string,
  gameMode: string = ""
): number {
  if (leader.omicron && gameMode === leader.omicron.mode) {
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
      return Math.floor(baseSpeed * value);
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
  getUnitData: Function
): number {
  if (ability.scalesBy) {
    if (anyTagsMatch(unitData, unitData.id, ability.tags || [])) {
      return team.units.reduce((total: number, teamMember: any) => {
        const teamMemberData: Unit = getUnitData(teamMember.id);
        if (
          teamMember.id === unitData.id &&
          ability.scalesBy?.includes("!Self")
        ) {
          //do nothing
        } else if (
          anyTagsMatch(teamMemberData, unitData.id, ability?.scalesBy || [])
        ) {
          if (ability.scalesBy?.includes("Self")) {
            total += getSpeedAmount(ability.value, teamMemberData.stats["5"]);
          } else {
            total += getSpeedAmount(ability.value, unitData.stats["5"]);
          }
        }
        return total;
      }, 0);
    }
  } else if (ability.omicron && team.gameMode === ability.omicron.mode) {
    return getUniqueAbilitySpeed(ability.omicron, unitData, team, getUnitData);
  } else {
    return getSpeedAmount(ability.value, unitData.stats["5"]);
  }
  return 0;
}

function getUniqueFromTeamMembers(
  ability: SpeedAbility,
  unit: Unit,
  fullTeam: Team,
  teamMemberId: string,
  getUnitData: Function
): number {
  let amount = 0;
  if (ability.omicron && fullTeam.gameMode === ability.omicron.mode) {
    return getUniqueFromTeamMembers(
      ability.omicron,
      unit,
      fullTeam,
      teamMemberId,
      getUnitData
    );
  } else if (
    anyTagsMatch(unit, teamMemberId, ability?.tags || []) &&
    teamMemberId !== unit.id
  ) {
    if (ability.scalesBy?.includes("Self")) {
      const memberData: Unit = getUnitData(teamMemberId);
      amount += getSpeedAmount(ability.value, memberData.stats["5"]);
    } else {
      amount += getUniqueAbilitySpeed(ability, unit, fullTeam, getUnitData);
    }
  }
  return amount;
}

export { store, State };
