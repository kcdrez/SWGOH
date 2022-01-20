import { ActionContext } from "vuex";

import { loadingState } from "../types/loading";
import { State as RootState } from "./store";
import { ConfigType, UpdateItem } from "../types/planner";
import { maxGearLevel } from "./gear";

interface State {
  requestState: loadingState;
  targetConfig: ConfigType;
  unitList: string[];
}

type ActionCtx = ActionContext<State, RootState>;

const store = {
  namespaced: true,
  state: {
    requestState: loadingState.initial,
    targetConfig: {},
    unitList: [],
  },
  getters: {
    gearTarget(state: State) {
      return (unitId: string): number => {
        return state.targetConfig[unitId]?.gear.target;
      };
    },
    relicTarget(state: State) {
      return (unitId: string): number => {
        return state.targetConfig[unitId]?.relic.target;
      };
    },
    unitList(state: State, _getters: any, rootState: RootState) {
      return state.unitList.map((id: string) => {
        const match = rootState.player.player?.units.find((x) => x.id === id);
        return {
          id,
          gearTarget: state.targetConfig[id]?.gear.target,
          relicTarget: state.targetConfig[id]?.relic.target,
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
      state.targetConfig = payload;
      window.localStorage.setItem(
        "generalPlanner",
        JSON.stringify(state.targetConfig)
      );
    },
    UPDATE_PLANNER_ITEM(state: State, { unitId, type, value }: UpdateItem) {
      if (!state.targetConfig[unitId]) {
        state.targetConfig[unitId] = {
          gear: { target: 0 },
          relic: { target: 0 },
        };
      }

      state.targetConfig[unitId][type].target = value;
      window.localStorage.setItem(
        "generalPlanner",
        JSON.stringify(state.targetConfig)
      );
    },
    UPSERT_UNIT(state: State, id: string) {
      const index = state.unitList.findIndex((x) => x === id);
      if (index >= 0) {
        state.unitList.splice(index, 1, id);
      } else {
        state.unitList.push(id);
      }
      window.localStorage.setItem(
        "generalPlanner-unitList",
        JSON.stringify(state.unitList)
      );
    },
    SET_UNIT_LIST(state: State, payload: string[]) {
      state.unitList = payload;
      window.localStorage.setItem(
        "generalPlanner-unitList",
        JSON.stringify(state.unitList)
      );
    },
    REMOVE_UNIT(state: State, id: string) {
      const index = state.unitList.findIndex((x) => x === id);
      state.unitList.splice(index, 1);
    },
  },
  actions: {
    async initialize({ commit, dispatch }: ActionCtx) {
      commit("SET_REQUEST_STATE", loadingState.loading);
      const targetData: ConfigType = JSON.parse(
        window.localStorage.getItem("generalPlanner") || "{}"
      );
      const unitListData: string[] = JSON.parse(
        window.localStorage.getItem("generalPlanner-unitList") || "[]"
      );
      await Promise.all(
        //might have to put a limiter on this if the list is really big
        unitListData.map((id) => dispatch("unit/fetchUnit", id, { root: true }))
      );
      commit("UPDATE_PLANNER", targetData);
      commit("SET_UNIT_LIST", unitListData);
      unitListData.forEach((id) => {
        if (!(id in targetData)) {
          commit("UPDATE_PLANNER_ITEM", {
            id,
            type: "relic",
            value: 5,
          });
        }
      });
      commit("SET_REQUEST_STATE", loadingState.ready);
    },
    addUnit({ commit }: ActionCtx, id: string) {
      commit("UPSERT_UNIT", id);
    },
    updatePlannerTarget({ commit }: ActionCtx, payload: UpdateItem) {
      commit("UPDATE_PLANNER_ITEM", payload);
    },
    initPlannerTarget({ commit }: ActionCtx, unitId: string) {
      commit("UPDATE_PLANNER_ITEM", {
        unitId,
        type: "gear",
        value: maxGearLevel,
      });
      commit("UPDATE_PLANNER_ITEM", { unitId, type: "relic", value: 5 });
    },
    removeUnit({ commit }: ActionCtx, id: string) {
      commit("REMOVE_UNIT", id);
    },
  },
};

export { store, State };
