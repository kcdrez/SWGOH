import { ActionContext } from "vuex";
import { v4 as uuid } from "uuid";

import { loadingState } from "../types/loading";
import { State as RootState } from "./store";
import { Team } from "../types/speed";
import { Mod, Unit } from "../types/unit";
import { apiClient } from "../api/api-client";
import { PlayerResponse } from "../types/player";

interface State {
  requestState: loadingState;
  teams: Team[];
}

type ActionCtx = ActionContext<State, RootState>;

const store = {
  namespaced: true,
  state: {
    requestState: loadingState.initial,
    teams: [],
  },
  getters: {
    speedValueFromMod(_state: State) {
      return (mod: Mod): number => {
        if (mod.primaryStat.unitStat === 5) {
          return mod.primaryStat.value;
        } else {
          const match = mod.secondaryStat.find((x) => x.unitStat === 5);
          if (match) {
            return match.value;
          }
        }
        return 0;
      };
    },
    hasSpeedSet(_state: State) {
      return (unit: Unit): boolean => {
        return unit.mods.filter((x) => x.set === 4).length >= 4;
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
        match.units.push({ id: payload.unit.id, speedBonus: 0 });
      }
    },
    REMOVE_UNIT(state: State, payload: { teamId: string; unit: Unit }) {
      const matchTeam = state.teams.find((x) => x.id === payload.teamId);
      if (matchTeam) {
        const unitIndex = matchTeam.units.findIndex((x) => x.id === payload.unit.id);
        if (unitIndex >= 0) {
          matchTeam.units.splice(unitIndex, 1)
        }
      }
    },
    DELETE_TEAM(state: State, team: Team) {
      const index = state.teams.findIndex((x) => x.id === team.id);
      if (index >= 0) {
        state.teams.splice(index, 1);
      }
    }
  },
  actions: {
    initialize({ commit }: ActionCtx, player: PlayerResponse) {
      player.teams?.forEach((team) => {
        commit("UPSERT_TEAM", team);
      });
    },
    addTeam({ commit, dispatch }: ActionCtx, team: Team) {
      if (!team) {
        commit("UPSERT_TEAM", {
          id: uuid(),
          name: "Default Name",
          units: [],
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
      commit("DELETE_TEAM", team)
      dispatch("saveTeams");
    },
    saveTeams({ rootState, state }: ActionCtx) {
      apiClient.updateTeams(rootState.player.player?.id || "", state.teams);
    },
  },
};

export { store, State };
