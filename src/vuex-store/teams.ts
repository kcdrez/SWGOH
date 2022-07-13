import { ActionContext } from "vuex";
import { v4 as uuid } from "uuid";

import { loadingState } from "../types/loading";
import { State as RootState } from "./store";
import { ITeam, SpeedConfig, Team } from "../types/teams";
import { Mod } from "../types/unit";
import { apiClient } from "../api/api-client";
import { PlayerResponse } from "../types/player";

interface State {
  requestState: loadingState;
  teams: Team[];
  abilityStatsData: SpeedConfig;
}

type ActionCtx = ActionContext<State, RootState>;

const store = {
  namespaced: true,
  state: {
    requestState: loadingState.initial,
    teams: [],
    abilityStatsData: {},
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
    DELETE_TEAM(state: State, team: Team) {
      const index = state.teams.findIndex((x) => x.id === team.id);
      if (index >= 0) {
        state.teams.splice(index, 1);
      }
    },
    SET_ABILITY_STATS(state: State, payload: SpeedConfig) {
      state.abilityStatsData = payload;
    },
  },
  actions: {
    async initialize({ commit, state, rootState }: ActionCtx) {
      if (state.requestState === loadingState.initial) {
        commit("SET_REQUEST_STATE", loadingState.loading);
        (rootState.player.player?.teams ?? []).forEach((team) => {
          commit(
            "UPSERT_TEAM",
            new Team(team, rootState.player.player?.id ?? "")
          );
        });
        commit("SET_ABILITY_STATS", await apiClient.abilityStats());
        commit("SET_REQUEST_STATE", loadingState.ready);
      }
    },
    upsertTeam({ commit, dispatch, rootState }: ActionCtx, team: ITeam) {
      if (!team) {
        commit(
          "UPSERT_TEAM",
          new Team(
            {
              id: uuid(),
              name: "Default Name",
              units: [],
            },
            rootState.player.player?.id
          )
        );
      } else {
        commit("UPSERT_TEAM", new Team(team, rootState.player.player?.id));
      }
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
      apiClient.updateTeams(
        rootState.player.player?.id || "",
        state.teams.map((x) => x.sanitize())
      );
    },
  },
};

export { store, State };
