import { ActionContext } from "vuex";

import { loadingState } from "types/loading";
import { maxGearLevel } from "types/gear";
import { maxRelicLevel } from "types/relic";
import { ConfigType, UpdateItem } from "types/planner";
import { State as RootState } from "./store";
import { apiClient } from "../api/api-client";
import { Unit } from "types/unit";

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
    fullUnitList(state: State, _getters: any, rootState: RootState): Unit[] {
      return state.unitList.reduce((unitList: Unit[], id: string) => {
        const matchOwned = rootState.player.player?.units.find(
          (x) => x.id === id
        );
        if (matchOwned) {
          unitList.push(matchOwned);
        } else {
          const matchUnowned = rootState.unit.unitList.find((x) => x.id === id);
          if (matchUnowned) {
            unitList.push(matchUnowned);
          }
        }
        return unitList;
      }, []);
    },
  },
  mutations: {
    SET_REQUEST_STATE(state: State, payload: loadingState) {
      state.requestState = payload;
    },
    UPDATE_PLANNER(state: State, payload: ConfigType) {
      if (payload) {
        state.targetConfig = payload;
      }
    },
    UPDATE_PLANNER_ITEM(state: State, { unitId, type, value }: UpdateItem) {
      if (!state.targetConfig[unitId]) {
        state.targetConfig[unitId] = {
          gear: { target: 0 },
          relic: { target: 0 },
        };
      }

      state.targetConfig[unitId][type].target = value;
    },
    UPSERT_UNIT(state: State, id: string) {
      const index = state.unitList.findIndex((x) => x === id);
      if (index >= 0) {
        state.unitList.splice(index, 1, id);
      } else {
        state.unitList.push(id);
      }
    },
    SET_UNIT_LIST(state: State, payload: string[]) {
      if (payload) {
        state.unitList = payload;
      }
    },
    REMOVE_UNIT(state: State, id: string) {
      const index = state.unitList.findIndex((x) => x === id);
      state.unitList.splice(index, 1);
    },
  },
  actions: {
    async initialize({ commit, state, rootState }: ActionCtx) {
      if (state.requestState === loadingState.initial) {
        commit("SET_REQUEST_STATE", loadingState.loading);
        const planner = rootState.player.player?.planner;
        const targetData = planner?.targetData ?? {};
        const unitList = planner?.unitList ?? [];

        commit("UPDATE_PLANNER", targetData);
        commit("SET_UNIT_LIST", unitList);
        state.unitList.forEach((id: string) => {
          if (!(id in targetData)) {
            commit("UPDATE_PLANNER_ITEM", {
              id,
              type: "relic",
              value: 5,
            });
          }
        });
        commit("SET_REQUEST_STATE", loadingState.ready);
      }
    },
    addUnit({ commit, dispatch, state }: ActionCtx, id: string) {
      commit("UPSERT_UNIT", id);
      if (!(id in state.targetConfig)) {
        dispatch("initPlannerTarget", id);
      }
      dispatch("save");
    },
    updatePlannerTarget({ commit, dispatch }: ActionCtx, payload: UpdateItem) {
      commit("UPDATE_PLANNER_ITEM", payload);
      dispatch("save");
    },
    initPlannerTarget(
      { commit, dispatch, state, rootState }: ActionCtx,
      unitId: string
    ) {
      const exists = unitId in state.targetConfig;
      if (!exists) {
        const playerUnit = rootState.player.player?.units.find(
          (x) => x.id === unitId
        );
        let gearValue = maxGearLevel;
        let relicValue = 1;
        if (playerUnit) {
          gearValue = Math.min(playerUnit.gearLevel + 1, maxGearLevel);
          if (playerUnit.relicLevel === -1) {
            relicValue = 1;
          } else {
            relicValue = Math.min(playerUnit.gearLevel + 1, maxRelicLevel);
          }
        }
        commit("UPDATE_PLANNER_ITEM", {
          unitId,
          type: "gear",
          value: gearValue,
        });
        commit("UPDATE_PLANNER_ITEM", {
          unitId,
          type: "relic",
          value: relicValue,
        });
        dispatch("save");
      }
    },
    removeUnit({ commit, dispatch }: ActionCtx, id: string) {
      commit("REMOVE_UNIT", id);
      dispatch("save");
    },
    save({ rootState, state }: ActionCtx) {
      if (rootState.player.player) {
        apiClient.savePlannerData(rootState.player.player.id, {
          targetData: state.targetConfig,
          unitList: state.unitList,
        });
      }
    },
  },
};

export { store, State };
