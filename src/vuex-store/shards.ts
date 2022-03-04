import { ActionContext } from "vuex";

import { Unit } from "../types/unit";
import { loadingState } from "../types/loading";
import { State as RootState } from "./store";
import { apiClient } from "../api/api-client";
import { PlayerResponse } from "../types/player";
import {
  FarmingNode,
  NodePayload,
  OwnedShardsMap,
  shardMapping,
  Node,
} from "../types/shards";

interface State {
  requestState: loadingState;
  ownedShards: OwnedShardsMap;
  shardFarming: FarmingNode[];
}

type ActionCtx = ActionContext<State, RootState>;

const store = {
  namespaced: true,
  state: {
    requestState: loadingState.initial,
    ownedShards: {},
    shardFarming: [],
  },
  getters: {
    plannerList(state: State, _getters: any, rootState: RootState): Unit[] {
      return Object.entries(state.ownedShards).reduce(
        (acc: Unit[], [id, value]) => {
          if (value.tracking) {
            const match = rootState.player.player?.units.find(
              (unit) => unit.id === id
            );
            if (match) {
              acc.push(match);
            } else {
              const match2 = rootState.unit.unitList.find((x) => x.id === id);
              if (match2) {
                acc.push(match2);
              } else {
                console.warn("No match found for", id);
              }
            }
          }
          return acc;
        },
        []
      );
    },
    unitFarmingList(
      _state: State,
      _getters: any,
      rootState: RootState,
      rootGetters: any
    ): Unit[] {
      const list: Unit[] = [];
      rootState.unit.unitList.forEach((unit) => {
        const playerOwned: Unit = rootGetters["player/unitData"](unit.id);
        if (playerOwned) {
          if (playerOwned.stars < 7) {
            list.push(playerOwned);
          }
        } else {
          list.push(unit);
        }
      });
      return list;
    },
  },
  mutations: {
    SET_REQUEST_STATE(state: State, payload: loadingState) {
      state.requestState = payload;
    },
    SET_SHARD_FARMING(state: State, payload: FarmingNode[]) {
      state.shardFarming = payload;
    },
    SET_OWNED_SHARDS(state: State, payload: OwnedShardsMap) {
      state.ownedShards = payload;
    },
    UPSERT_SHARD_COUNT(
      state: State,
      { id, count, nodes, tracking }: NodePayload
    ) {
      const match = state.ownedShards[id] || {};

      let nodesData: Node[] = [];
      if (nodes) {
        nodesData = nodes.map((node) => {
          const nodeMatch = (match?.nodes || []).find((n) => n.id === node.id);
          const nodeCount = node?.count || nodeMatch?.count || 0;
          const priority = node?.priority || nodeMatch?.priority || 0;
          return {
            id: node.id,
            count: nodeCount,
            priority,
          };
        });
      } else {
        nodesData = match?.nodes || [];
      }

      state.ownedShards[id] = {
        owned: count || match?.owned || 0,
        nodes: nodesData,
        tracking: tracking || match?.tracking || false,
      };
    },
    ADD_UNIT(state: State, unitId: string) {
      const match = state.ownedShards[unitId];
      if (match) {
        match.tracking = true;
      } else {
        state.ownedShards[unitId] = {
          owned: 0,
          nodes: [],
          tracking: true,
        };
      }
    },
    REMOVE_UNIT(state: State, unitId: string) {
      const match = state.ownedShards[unitId];
      if (match) {
        match.tracking = false;
      }
    },
  },
  actions: {
    async initialize({ state, getters, commit, rootState }: ActionCtx) {
      try {
        if (state.requestState === loadingState.initial) {
          commit("SET_REQUEST_STATE", loadingState.loading);
          const farmingData = await apiClient.fetchFarmingData();
          commit("SET_SHARD_FARMING", farmingData);
          commit("SET_OWNED_SHARDS", rootState.player.player?.shards || {});
          commit("SET_REQUEST_STATE", loadingState.ready);
        }
      } catch (err) {
        commit("SET_REQUEST_STATE", loadingState.error);
      }
    },
    saveShardsCount(
      { commit, dispatch, getters }: ActionCtx,
      data: NodePayload
    ) {
      commit("UPSERT_SHARD_COUNT", data);
      const match: Unit | undefined = getters.unitFarmingList.find(
        (unit: Unit) => unit.id === data.id
      );
      if (match) {
        match.calculateEstimation();
      }
      dispatch("save");
    },
    addUnit({ commit, dispatch }: ActionCtx, unitId: string) {
      commit("ADD_UNIT", unitId);
      dispatch("save");
    },
    removeUnit({ commit, dispatch }: ActionCtx, unitId: string) {
      commit("REMOVE_UNIT", unitId);
      dispatch("save");
    },
    save({ state, rootState }: ActionCtx) {
      if (rootState.player?.player) {
        apiClient.saveShardFarming(
          rootState.player.player.id,
          state.ownedShards
        );
      }
    },
  },
};

export { store, State };
