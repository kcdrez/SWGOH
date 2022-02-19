import { ActionContext } from "vuex";

import { loadingState } from "../types/loading";
import { State as RootState } from "./store";
import { unvue } from "../utils";
import relicConfig from "../types/relicMapping";
import { Relic, RelicConfigType, maxRelicLevel } from "../types/relic";
import { isUnit, Unit, UnitBasic } from "../types/unit";
import { apiClient } from "../api/api-client";
import { PlayerResponse } from "@/types/player";
interface State {
  requestState: loadingState;
  relicConfig: RelicConfigType;
  ownedRelics: any;
  refreshes: { cantina: number };
  energy: { cantina: number };
}

type ActionCtx = ActionContext<State, RootState>;

const store = {
  namespaced: true,
  state: {
    requestState: loadingState.initial,
    relicConfig: relicConfig,
    ownedRelics: {},
    refreshes: { cantina: 0 },
    energy: { cantina: 0 },
  },
  getters: {
    currentRelicLevel(_state: State) {
      return (relic_tier: number | undefined): number => {
        if (!relic_tier) {
          return 0;
        } else {
          return relic_tier < 0 ? 0 : relic_tier;
        }
      };
    },
    relicOptions(_state: State) {
      return (relicLevel: number): number[] => {
        const list = [];
        if (relicLevel < 0) {
          relicLevel = 0;
        }
        for (let i = (relicLevel || 0) + 1; i <= maxRelicLevel; i++) {
          list.push(i);
        }
        return list;
      };
    },
    timeEstimation(state: State, getters: any) {
      return (mat: Relic, arr: { level: number; target: number }[]): number => {
        const owned: number = state.ownedRelics[mat.id] || 0;
        const amountNeeded: number = getters.amountNeeded(mat.amount, arr);
        const remaining: number = amountNeeded - owned;


        if (remaining > 0) {
          const totalEnergy =
            120 + 45 + 120 * state.refreshes.cantina - state.energy.cantina;
          const triesPerDay = mat.location.energy
            ? totalEnergy / mat.location.energy
            : 0;
          const amountPerDay = mat.dropRate ? triesPerDay * mat.dropRate : 0;
          return amountPerDay === 0 ? -1 : Math.ceil(remaining / amountPerDay);
        } else if (amountNeeded === 0 && remaining > 0) {
          return -1;
        } else {
          return 0;
        }
      };
    },
    amountNeeded(_state: State) {
      return (relicAmountMap: any, arr: { level: number; target: number }[]): number => {
        let amount = 0;

        arr.forEach(({ level, target }) => {
          for (let i = level + 1; i <= target; i++) {
            const key = i.toString();
            if (i in relicAmountMap) {
              amount += relicAmountMap[key];
            }
          }
        });
        return amount;
      };
    },
    totalDays(state: State, getters: any, rootState: RootState) {
      return (unitId: string, relicLevel: number | undefined): number => {
        const { target } = rootState.planner.targetConfig[unitId].relic;
        return (Object.values(state.relicConfig) as Array<Relic>).reduce(
          (acc, el) => {
            const days = getters.timeEstimation(el, [
              { level: relicLevel ?? 0, target },
            ]);
            return days > 0 ? acc + days : acc;
          },
          0
        );
      };
    },
  },
  mutations: {
    SET_REQUEST_STATE(state: State, payload: loadingState) {
      state.requestState = payload;
    },
    SET_OWNED_RELICS(state: State, payload: any) {
      if (payload) {
        state.ownedRelics = payload;
      }
    },
    UPDATE_REFRESHES(state: State, amount: number) {
      state.refreshes.cantina = amount;
    },
    UPDATE_ENERGY(state: State, amount: number) {
      state.energy.cantina = amount;
    },
  },
  actions: {
    initialize({ commit }: ActionCtx, player: PlayerResponse) {
      commit("SET_REQUEST_STATE", loadingState.loading);
      commit("SET_OWNED_RELICS", player.relic);
      commit("UPDATE_REFRESHES", player.energyData?.refreshes?.cantina || 0);
      commit("UPDATE_ENERGY", player.energyData?.energy?.cantina || 0);
      commit("SET_REQUEST_STATE", loadingState.ready);
    },
    saveOwnedCount(
      { state, commit, rootState }: ActionCtx,
      { count, id }: { count: number; id: string }
    ) {
      const countData = unvue(state.ownedRelics);
      countData[id] = count;
      commit("SET_OWNED_RELICS", countData);
      if (rootState.player?.player) {
        apiClient.saveRelicData(rootState.player.player.id, state.ownedRelics);
      }
    },
    updateRefreshes({ commit, dispatch }: ActionCtx, amount: number) {
      commit("UPDATE_REFRESHES", amount);
      dispatch("player/saveEnergy", null, { root: true });
    },
    updateEnergy({ commit, dispatch }: ActionCtx, amount: number) {
      commit("UPDATE_ENERGY", amount);
      dispatch("player/saveEnergy", null, { root: true });
    },
  },
};

export { store, State };
