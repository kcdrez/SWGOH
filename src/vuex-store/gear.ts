import { ActionContext } from "vuex";

import { Gear, ConfigType, OwnedCount, EnergyType } from "types/gear";
import { loadingState } from "types/loading";
import { State as RootState } from "./store";
import { apiClient } from "../api/api-client";

type updateEnergy = {
  value: number;
  type: "standard" | "fleet";
};

interface State {
  requestState: loadingState;
  gearList: Gear[];
  gearLocations: any[];
  gearConfig: ConfigType;
  refreshes: EnergyType;
  energy: EnergyType;
}

type ActionCtx = ActionContext<State, RootState>;

const store = {
  namespaced: true,
  state: {
    requestState: loadingState.initial,
    gearList: [],
    gearLocations: [],
    gearConfig: {},
    refreshes: { standard: 0, fleet: 0 },
    energy: { standard: 0, fleet: 0 },
  },
  getters: {},
  mutations: {
    SET_REQUEST_STATE(state: State, payload: loadingState) {
      state.requestState = payload;
    },
    SET_GEAR(state: State, payload: Gear[]) {
      state.gearList = payload;
    },
    SET_GEAR_LOCATIONS(state: State, payload: any) {
      if (payload) {
        state.gearLocations = payload;
      }
    },
    SET_GEAR_OWNED(state: State, payload: any) {
      if (payload) {
        state.gearConfig = payload;
      }
    },
    UPSERT_OWNED_GEAR(state: State, payload: OwnedCount) {
      state.gearConfig[payload.id] = {
        owned: payload.count || 0,
        irrelevant: !!payload.irrelevant,
      };
    },
    UPDATE_REFRESHES(state: State, payload: updateEnergy) {
      state.refreshes[payload.type] = payload.value;
    },
    UPDATE_ENERGY(state: State, payload: updateEnergy) {
      state.energy[payload.type] = payload.value;
    },
  },
  actions: {
    async initialize({ commit, state, rootState }: ActionCtx) {
      if (state.requestState === loadingState.initial) {
        commit("SET_REQUEST_STATE", loadingState.loading);
        commit("SET_GEAR_OWNED", rootState.player.player?.gear);

        const refreshStandard: updateEnergy = {
          type: "standard",
          value: rootState.player.player?.energyData?.refreshes?.standard || 0,
        };
        const refreshFleet: updateEnergy = {
          type: "fleet",
          value: rootState.player.player?.energyData?.refreshes?.fleet || 0,
        };

        const energyStandard: updateEnergy = {
          type: "standard",
          value: rootState.player.player?.energyData?.energy?.standard || 0,
        };
        const energyFleet: updateEnergy = {
          type: "fleet",
          value: rootState.player.player?.energyData?.energy?.fleet || 0,
        };

        commit("UPDATE_REFRESHES", refreshStandard);
        commit("UPDATE_REFRESHES", refreshFleet);
        commit("UPDATE_ENERGY", energyStandard);
        commit("UPDATE_ENERGY", energyFleet);

        const gearList = await apiClient.fetchGearList();
        commit("SET_GEAR", gearList);

        commit("SET_REQUEST_STATE", loadingState.ready);
      }
    },
    saveOwnedCount({ commit, state, rootState }: ActionCtx, data: OwnedCount) {
      commit("UPSERT_OWNED_GEAR", data);
      if (rootState.player?.player) {
        apiClient.saveGearData(rootState.player.player.id, state.gearConfig);
      }
    },
    updateRefreshes({ commit, dispatch }: ActionCtx, payload: updateEnergy) {
      commit("UPDATE_REFRESHES", payload);
      dispatch("player/saveEnergy", null, { root: true });
    },
    updateEnergy({ commit, dispatch }: ActionCtx, payload: updateEnergy) {
      commit("UPDATE_ENERGY", payload);
      dispatch("player/saveEnergy", null, { root: true });
    },
  },
};

export { store, State };
