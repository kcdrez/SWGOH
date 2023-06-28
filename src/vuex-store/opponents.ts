import { ActionContext } from "vuex";
import { v4 as uuid } from "uuid";

import { State as RootState } from "./store";
import { apiClient } from "../api/api-client";
import { loadingState } from "types/loading";
import { Match, MatchPayload, Team } from "types/teams";
import { Unit } from "types/unit";
import { OpponentResponse, Player } from "types/player";

interface State {
  requestState: loadingState;
  player: Player | null;
  teams: Team[];
  allyCode: string;
  matches: Match[];
}

type ActionCtx = ActionContext<State, RootState>;

const store = {
  namespaced: true,
  state: {
    requestState: loadingState.initial,
    teams: [],
    allyCode: "",
    player: null,
    matches: [],
  },
  getters: {
    unitData(state: State) {
      return (unitId: string): Unit | undefined => {
        return state.player?.units.find((x) => x.id === unitId);
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
    SET_MATCHES(state: State, payload: Match[]) {
      state.matches = payload;
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
        // match.units.push({ id: payload.unit.id });
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
    SET_OPPONENT(state: State, payload: Player) {
      if (!payload.id) {
        payload.id = uuid();
      }
      state.player = payload;
    },
    SET_ALLY_CODE(state: State, payload: string | null) {
      if (typeof payload === "string") {
        state.allyCode = payload;
      } else {
        state.allyCode = "";
      }
    },
    UPSERT_MATCH(state: State, payload: Match) {
      const index = state.matches.findIndex((x) => x.id === payload.id);
      if (index >= 0) {
        state.matches.splice(index, 1, payload);
      } else {
        state.matches.push(payload);
      }
    },
    REMOVE_MATCH(state: State, matchId: string) {
      const matchIndex = state.matches.findIndex((x) => x.id === matchId);
      if (matchIndex >= 0) {
        state.matches.splice(matchIndex, 1);
      }
    },
    RESET(state: State) {
      state.allyCode = "";
      state.matches = [];
      state.player = null;
      state.teams = [];
    },
  },
  actions: {
    async initialize({ commit, dispatch, state, rootState }: ActionCtx) {
      if (state.requestState === loadingState.initial) {
        //todo: handle player.opponent
        commit("SET_REQUEST_STATE", loadingState.loading);
        const player = rootState.player.player;

        if (player?.id) {
          const opponentResponse: OpponentResponse =
            await apiClient.fetchOpponent(player.id);
          await dispatch("fetchPlayer", opponentResponse.opponentAllyCode);
          commit(
            "SET_TEAMS",
            (opponentResponse?.teams || []).map(
              (t) => new Team(t, state.player?.id)
            )
          );

          const matches: Match[] = (opponentResponse?.matches || []).reduce(
            (acc: Match[], { opponentTeamId, playerTeamId, gameMode }) => {
              const opponentTeam: Team | undefined = state.teams.find(
                (team) => team.id === opponentTeamId
              );
              const playerTeam: Team | undefined = rootState.teams.teams.find(
                (team) => team.id === playerTeamId
              );
              if (opponentTeam && playerTeam) {
                acc.push(
                  new Match({
                    opponentTeamId,
                    playerTeamId,
                    gameMode,
                    id: uuid(),
                    name: playerTeam.name + " Versus " + opponentTeam.name,
                  })
                );
              }
              if (!opponentTeam) {
                console.error(
                  "Could not find matching opponent team",
                  opponentTeamId
                );
              }
              if (!playerTeam) {
                console.error(
                  "Could not find matching player team",
                  playerTeamId
                );
              }
              return acc;
            },
            []
          );

          commit("SET_MATCHES", matches);
        }

        commit("SET_REQUEST_STATE", loadingState.ready);
      }
    },
    async fetchPlayer({ commit, dispatch }: ActionCtx, allyCode: string) {
      if (allyCode) {
        commit("SET_REQUEST_STATE", loadingState.loading);
        try {
          const player = await apiClient.fetchPlayer(allyCode);
          commit("SET_OPPONENT", player);
          commit("SET_ALLY_CODE", allyCode);
          commit("SET_REQUEST_STATE", loadingState.ready);
          dispatch("saveTeams");
        } catch (err) {
          console.error(err);
          commit("SET_REQUEST_STATE", loadingState.error);
          // commit("SET_REQUEST_STATE", loadingState.error, { root: true });
        }
      }
    },
    upsertTeam({ commit, dispatch, state }: ActionCtx, team: Team) {
      if (!team) {
        commit(
          "UPSERT_TEAM",
          new Team(
            {
              id: uuid(),
              name: "Default Name",
              units: [],
            },
            state.player?.id
          )
        );
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
      dispatch("refreshMatches", { opponentTeamId: data.teamId });
      dispatch("saveTeams");
    },
    removeUnit(
      { commit, dispatch }: ActionCtx,
      data: { teamId: string; unit: Unit }
    ) {
      commit("REMOVE_UNIT", data);
      dispatch("refreshMatches", { opponentTeamId: data.teamId });
      dispatch("saveTeams");
    },
    deleteTeam({ commit, dispatch }: ActionCtx, team: Team) {
      commit("DELETE_TEAM", team);
      dispatch("refreshMatches", { opponentTeamId: team.id });
      dispatch("saveTeams");
    },
    saveTeams({ rootState, state }: ActionCtx) {
      apiClient.updateOpponentTeams(
        rootState.player.player?.id || "",
        state.allyCode,
        state.teams
      );
    },
    saveMatches({ rootState, state }: ActionCtx) {
      apiClient.updateMatches(rootState.player.player?.id || "", state.matches);
    },
    addMatch(
      { dispatch, commit, state, rootState }: ActionCtx,
      matchData: MatchPayload & { ignoreSave: boolean }
    ) {
      if (matchData.playerTeam && matchData.opponentTeam) {
        commit(
          "UPSERT_MATCH",
          new Match({
            id: matchData?.id ? matchData.id : uuid(),
            playerTeamId: matchData.playerTeam.id,
            opponentTeamId: matchData.opponentTeam.id,
            gameMode: "",
            name: `${matchData.playerTeam.name} Versus ${matchData.opponentTeam.name}`,
            sortDir: "asc",
            sortMethod: "total",
            searchName: "",
          })
        );

        if (!matchData?.ignoreSave) {
          dispatch("saveMatches");
        }
      }
    },
    removeMatch(
      { dispatch, commit }: ActionCtx,
      data: { matchId: string; ignoreSave?: boolean }
    ) {
      commit("REMOVE_MATCH", data.matchId);
      if (!data.ignoreSave) {
        dispatch("saveMatches");
      }
    },
    async deleteOpponent({ rootState, commit }: ActionCtx) {
      await apiClient.deleteOpponent(rootState.player.player?.id);
      commit("RESET");
    },
    refreshMatches(
      { rootState, dispatch, state, commit }: ActionCtx,
      data: { playerTeamId?: string; opponentTeamId?: string }
    ) {
      let saveChanges = false;
      state.matches.forEach((match) => {
        if (
          match.playerTeamId === data.playerTeamId ||
          match.opponentTeamId === data.opponentTeamId
        ) {
          const playerTeam: Team | undefined = rootState.teams.teams.find(
            (t) => t.id === match.playerTeamId
          );
          const opponentTeam: Team | undefined = state.teams.find(
            (t) => t.id === match.opponentTeamId
          );
          if (!playerTeam || !opponentTeam) {
            dispatch("removeMatch", { matchId: match.id, ignoreSave: true });
          } else {
            dispatch("addMatch", {
              playerTeam,
              opponentTeam,
              id: match.id,
              ignoreSave: true,
            });
          }
          saveChanges = true;
        }
      });
      if (saveChanges) {
        dispatch("saveMatches");
      }
    },
  },
};

export { store, State };
