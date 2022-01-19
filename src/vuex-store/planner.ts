import { ActionContext, Getter } from "vuex";

import { loadingState } from "../enums/loading";
import { State as RootState } from "./store";
import { unvue } from "../utils";
import { ConfigType, UpdateItem } from "../types/planner";

interface State {
  requestState: loadingState;
  plannerConfig: ConfigType;
}

type ActionCtx = ActionContext<State, RootState>;

const store = {
  namespaced: true,
  state: {
    requestState: loadingState.initial,
    plannerConfig: {},
  },
  getters: {
    gearTarget(state: State) {
      return (unitId: string): number => {
        return state.plannerConfig[unitId]?.gear.target;
      };
    },
    relicTarget(state: State) {
      return (unitId: string): number => {
        return state.plannerConfig[unitId]?.relic.target;
      };
    },
    unitList(state: State, getters: any, rootState: RootState) {
      return Object.keys(state.plannerConfig).map((id: string) => {
        const match = rootState.player.player?.units.find((x) => x.id === id);
        return {
          id,
          gearTarget: state.plannerConfig[id]?.gear.target,
          relicTarget: state.plannerConfig[id]?.relic.target,
          ...match,
        };
      });
    },
  },
  mutations: {
    SET_REQUEST_STATE(state: State, payload: loadingState) {
      state.requestState = payload;
    },
    UPDATE_PLANNER(state: State, payload: ConfigType) {
      state.plannerConfig = payload;
      window.localStorage.setItem(
        "generalPlanner",
        JSON.stringify(state.plannerConfig)
      );
    },
    UPDATE_PLANNER_ITEM(state: State, { unitId, type, value }: UpdateItem) {
      if (!state.plannerConfig[unitId]) {
        state.plannerConfig[unitId] = {
          gear: { target: 0 },
          relic: { target: 0 },
        };
      }
      if (type === "gear") {
        state.plannerConfig[unitId].relic.target = 0;
        state.plannerConfig[unitId].gear.target = value;
      } else {
        state.plannerConfig[unitId].gear.target = 13;
        state.plannerConfig[unitId].relic.target = value;
      }
      window.localStorage.setItem(
        "generalPlanner",
        JSON.stringify(state.plannerConfig)
      );
    },
  },
  actions: {
    async initialize({ commit, dispatch }: ActionCtx) {
      const data: ConfigType = JSON.parse(
        window.localStorage.getItem("generalPlanner") || "{}"
      );
      await Promise.all(
        //might have to put a limiter on this
        Object.keys(data).map((id) =>
          dispatch("unit/fetchUnit", id, { root: true })
        )
      );
      commit("UPDATE_PLANNER", data);
    },
    addUnit(
      { commit }: ActionCtx,
      {
        unitId,
        gearTarget,
        relicTarget,
      }: { unitId: string; gearTarget: number; relicTarget: number }
    ) {
      commit("UPDATE_PLANNER_ITEM", {
        type: "gear",
        value: gearTarget,
        unitId,
      });
      commit("UPDATE_PLANNER_ITEM", {
        type: "relic",
        value: relicTarget,
        unitId,
      });
    },
    updatePlannerTarget({ commit }: ActionCtx, payload: UpdateItem) {
      commit("UPDATE_PLANNER_ITEM", payload);
    },
  },
};

export { store, State };
