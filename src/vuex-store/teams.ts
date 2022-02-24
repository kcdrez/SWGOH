import { ActionContext } from "vuex";
import { v4 as uuid } from "uuid";

import { loadingState } from "../types/loading";
import rootStore, { State as RootState } from "./store";
import { SpeedAbility, SpeedConfig, Team, TeamMember } from "../types/teams";
import { Mod, Unit } from "../types/unit";
import { apiClient } from "../api/api-client";
import { PlayerResponse } from "../types/player";

interface State {
  requestState: loadingState;
  teams: Team[];
  speedAbilityData: SpeedConfig;
}

type ActionCtx = ActionContext<State, RootState>;

const store = {
  namespaced: true,
  state: {
    requestState: loadingState.initial,
    teams: [],
    speedAbilityData: {},
  },
  getters: {
    speedValueFromMod(_state: State) {
      return (mod: Mod | undefined): string => {
        if (mod) {
          if (mod.primaryStat.unitStat === 5) {
            return mod.primaryStat.value.toString();
          } else {
            const match = mod.secondaryStat.find((x) => x.unitStat === 5);
            if (match) {
              return match.value.toString();
            }
          }
        }
        return "-";
      };
    },
    // hasSpeedSet(_state: State) {
    //   return (unit: Unit): boolean => {
    //     return unit.mods.filter((x) => x.set === 4).length >= 4;
    //   };
    // },
    leaderSpeedBonus(
      state: State,
      _getters: any,
      _rootState: RootState,
      rootGetters: any
    ) {
      return (team: Team, unit: TeamMember, checkGameMode: boolean): number => {
        const leader = team.units.find(
          (teamMember) => teamMember.isLeader && unit.owner === teamMember.owner
        );
        if (leader) {
          const abilityData = state.speedAbilityData[leader.id];
          if (abilityData?.leader) {
            const { leader: leaderData } = abilityData;
            const unitData: Unit = rootGetters["player/unitData"](unit.id);

            if (leaderData.scalesBy) {
              if (anyTagsMatch(unitData, leader.id, leaderData.tags || [])) {
                return team.units.reduce((total: number, unit: any) => {
                  const teamMemberData: Unit = rootGetters["player/unitData"](
                    unit.id
                  );
                  if (
                    anyTagsMatch(
                      teamMemberData,
                      leader.id,
                      leaderData?.scalesBy || []
                    )
                  ) {
                    total += leaderData.value || 0;
                  }
                  return total;
                }, 0);
              }
            } else {
              return Math.floor(
                unitMatchesLeader(
                  leaderData,
                  unitData,
                  leader.id,
                  team.gameMode,
                  checkGameMode
                )
              );
            }
          }
        }
        return 0;
      };
    },
    uniqueSpeedBonus(
      state: State,
      getters: any,
      _rootState: RootState,
      rootGetters: any
    ) {
      return (team: Team, unit: TeamMember, checkGameMode: boolean): number => {
        const abilityData = state.speedAbilityData[unit.id];
        if (abilityData?.unique) {
          const { unique: uniqueAbilityList } = abilityData;
          const unitData: Unit = rootGetters["player/unitData"](unit.id);

          let amount = 0;
          (uniqueAbilityList || []).forEach((ability) => {
            amount += getUniqueAbilitySpeed(
              ability,
              unitData,
              team,
              checkGameMode,
              rootGetters["player/unitData"],
              getters["grandTotal"],
              getters["uniqueSpeedBonus"]
            );
          });
          return Math.floor(amount);
        }

        return 0;
      };
    },
    speedBonusFromTeamMembers(
      state: State,
      getters: any,
      _rootState: RootState,
      rootGetters: any
    ) {
      return (team: Team, unit: TeamMember, checkGameMode: boolean): number => {
        let amount = 0;

        team.units.forEach((member) => {
          if (member.owner === unit.owner) {
            const unitData: Unit = rootGetters["player/unitData"](unit.id);
            const abilityData = state.speedAbilityData[member.id];

            (abilityData?.unique || []).forEach((ability) => {
              amount += getUniqueFromTeamMembers(
                ability,
                unitData,
                team,
                member,
                checkGameMode,
                rootGetters["player/unitData"],
                getters["grandTotal"],
                getters["uniqueSpeedBonus"]
              );
            });
          }
        });
        return Math.floor(amount);
      };
    },
    grandTotal(
      _state: State,
      getters: any,
      _rootState: RootState,
      rootGetters: any
    ) {
      return (unit: TeamMember, team: Team, checkGameMode: boolean): number => {
        const unitData: Unit = rootGetters["player/unitData"](unit.id);
        return Math.floor(
          unitData.speed +
          getters.leaderSpeedBonus(team, unit, checkGameMode) +
          getters.uniqueSpeedBonus(team, unit, checkGameMode) +
          getters.speedBonusFromTeamMembers(team, unit, checkGameMode)
        );
      };
    },
  },
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
        match.units.push({ id: payload.unit.id });
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
    SET_SPEED_ABILITY_DATA(state: State, payload: SpeedConfig) {
      state.speedAbilityData = payload;
    },
  },
  actions: {
    async initialize({ commit }: ActionCtx, player: PlayerResponse) {
      commit("SET_REQUEST_STATE", loadingState.loading);
      player.teams?.forEach((team) => {
        commit("UPSERT_TEAM", team);
      });
      commit("SET_SPEED_ABILITY_DATA", await apiClient.speedData());
      commit("SET_REQUEST_STATE", loadingState.ready);
    },
    upsertTeam({ commit, dispatch }: ActionCtx, team: Team) {
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
      dispatch(
        "opponents/refreshMatches",
        { playerTeamId: data.teamId },
        { root: true }
      );
      dispatch("saveTeams");
    },
    removeUnit(
      { commit, dispatch }: ActionCtx,
      data: { teamId: string; unit: Unit }
    ) {
      commit("REMOVE_UNIT", data);
      dispatch(
        "opponents/refreshMatches",
        { playerTeamId: data.teamId },
        { root: true }
      );
      dispatch("saveTeams");
    },
    deleteTeam({ commit, dispatch }: ActionCtx, team: Team) {
      commit("DELETE_TEAM", team);
      dispatch(
        "opponents/refreshMatches",
        { playerTeamId: team.id },
        { root: true }
      );
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
                uniqueTotal + teamMemberData.speed
              );
              total += speedAmount;
            } else {
              total += getSpeedAmount(ability.value, teamMemberData.speed);
            }
          } else {
            total += getSpeedAmount(ability.value, unitData.speed);
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
    return getSpeedAmount(ability.value, unitData.speed);
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
          uniqueTotal + memberData.speed
        );
        amount += speedAmount;
      } else {
        amount += getSpeedAmount(ability.value, memberData.speed);
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
