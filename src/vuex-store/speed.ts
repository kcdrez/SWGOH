import { ActionContext } from "vuex";
import { v4 as uuid } from 'uuid';

import { loadingState } from "../types/loading";
import { State as RootState } from "./store";
import { Team } from "../types/speed";
import { Mod, Unit } from "../types/unit";

interface State {
  requestState: loadingState;
  teams: Team[]
}

type ActionCtx = ActionContext<State, RootState>;

const store = {
  namespaced: true,
  state: {
    requestState: loadingState.initial,
    teams: [],
  },
  getters: {
    speedValueFromMod(state: State) {
      return (mod: Mod): number => {
        if (mod.primaryStat.unitStat === 5) {
          return mod.primaryStat.value;
        } else {
          const match = mod.secondaryStat.find(x => x.unitStat === 5);
          if (match) {
            return match.value;
          }
        }
        return 0
      }
    },
    hasSpeedSet(state: State) {
      return (unit: Unit): boolean => {
        return unit.mods.filter(x => x.set === 4).length >= 4;
      }
    }
  },
  mutations: {
    SET_REQUEST_STATE(state: State, payload: loadingState) {
      state.requestState = payload;
    },
    SET_TEAMS(state: State, payload: Team[]) {
      state.teams = payload;
    },
    UPSERT_TEAM(state: State, payload: Team) {
      const index = state.teams.findIndex(x => x.id === payload.id);
      if (index >= 0) {
        state.teams.splice(index, 1, payload)
      } else {
        state.teams.push(payload)
      }
    },
    ADD_UNIT(state: State, payload: { teamId: string, unit: Unit }) {
      const match = state.teams.find(x => x.id === payload.teamId);
      if (match) {
        match.units.push(payload.unit);
      }
    }
  },
  actions: {
    addTeam({ commit }: ActionCtx, team: Team) {
      if (!team) {
        commit("UPSERT_TEAM", { teamId: uuid(), name: "Default Name", units: [] })
      } else {
        commit("UPSERT_TEAM", team)
      }
    },
    addUnit({ commit }: ActionCtx, data: { teamId: string, unit: Unit }) {
      commit("ADD_UNIT", data)
    }
  },
};

export { store, State };
