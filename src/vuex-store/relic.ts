import { ActionContext } from "vuex";

import { loadingState } from "../enums/loading";
import { State as RootState } from "./store";
import { unvue } from "../utils";
import relicConfig from "../types/relicMapping";
import { Relic } from "../types/relic";
import { Unit } from "../types/unit";

export const maxRelicLevel = 9;

type ConfigType = {
  [key: string]: Relic;
};

interface State {
  requestState: loadingState;
  relicConfig: ConfigType;
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
    relicOptions(_state: State) {
      return (relicLevel: number): number[] => {
        const list = [];
        if (relicLevel < 0) {
          relicLevel = 0;
        }
        for (let i = relicLevel; i <= maxRelicLevel; i++) {
          list.push(i);
        }
        return list;
      };
    },
    timeEstimation(state: State, getters: any) {
      return (mat: Relic, level: number, target: number): number => {
        const owned: number = state.ownedRelics[mat.id] || 0;
        const totalAmount: number = getters.amountNeeded(mat, level, target);
        const remaining: number = totalAmount - owned;

        if (remaining > 0) {
          const totalEnergy =
            120 + 45 + 120 * state.refreshes.cantina - state.energy.cantina;
          const triesPerDay = totalEnergy / mat.location.energy;
          const amountPerDay = triesPerDay * mat.dropRate;
          return Math.round(remaining / amountPerDay);
        } else {
          return 0;
        }
      };
    },
    amountNeeded(_state: State) {
      return (mat: Relic, level: number, target: number): number => {
        const amountMap = mat.amount;
        let amount = 0;
        for (let i = level; i <= target; i++) {
          const key = i.toString();
          if (i in amountMap) {
            amount += amountMap[key];
          }
        }
        return amount;
      };
    },
    totalDays(state: State, getters: any, rootState: RootState) {
      return (unit: Unit): number => {
        const { target } = rootState.planner.targetConfig[unit.id].relic;
        return (Object.values(state.relicConfig) as Array<Relic>).reduce(
          (acc, el) => {
            return acc + getters.timeEstimation(el, unit.relic_tier, target);
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
      state.ownedRelics = payload;
    },
    UPDATE_REFRESHES(state: State, amount: number) {
      state.refreshes.cantina = amount;
    },
    UPDATE_ENERGY(state: State, amount: number) {
      state.energy.cantina = amount;
    },
  },
  actions: {
    async initialize({ commit }: ActionCtx) {
      commit("SET_REQUEST_STATE", loadingState.loading);

      const relicsOwned = JSON.parse(
        window.localStorage.getItem("ownedRelics") || "{}"
      );
      commit("SET_OWNED_RELICS", relicsOwned);
      commit("SET_REQUEST_STATE", loadingState.ready);
    },
    saveOwnedCount(
      { state, commit }: ActionCtx,
      { count, id }: { count: number; id: string }
    ) {
      const countData = unvue(state.ownedRelics);
      countData[id] = count;
      commit("SET_OWNED_RELICS", countData);
      window.localStorage.setItem("ownedRelics", JSON.stringify(countData));
    },
  },
};

export { store, State };
