import { ActionContext } from "vuex";

import { Unit, UnitBasic, isUnit } from "../types/unit";
import { loadingState } from "../types/loading";
import { State as RootState } from "./store";
import { apiClient } from "../api/api-client";
import { PlayerResponse } from "../types/player";
import {
  FarmingNode,
  NodePayload,
  OwnedShardsMap,
  shardMapping,
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
    remainingShards(_state: State) {
      return (unit: Unit | UnitBasic): number => {
        if (isUnit(unit)) {
          let amount = 0;
          for (let i = unit.stars + 1; i <= 7; i++) {
            amount += shardMapping[i];
          }
          return amount;
        } else {
          return 330;
        }
      };
    },
    unitNodes(state: State) {
      return (unit: Unit | UnitBasic): FarmingNode[] => {
        return state.shardFarming.filter((node) => {
          return node.characters.some((c) => c.id === unit.id);
        });
      };
    },
    shardTimeEstimation(state: State, getters: any) {
      return (unit: Unit | UnitBasic): number => {
        const nodes: FarmingNode[] = getters.unitNodes(unit);

        if (nodes.length <= 0) {
          return 0;
        }
        const currentShards = state.ownedShards[unit.id]?.owned || 0;
        const remainingShards = getters.remainingShards(unit) - currentShards;
        const dropRate = 0.33;
        const characterAcceleration =
          nodes[0].characters.find((x) => x.id === unit.id)?.dropRate || 0;
        const nodesList = state.ownedShards[unit.id]?.nodes || [];
        const nodesPerDay = nodesList.reduce(
          (total, node) => total + node.count,
          0
        );

        return Math.ceil(
          remainingShards /
            (dropRate *
              characterAcceleration *
              (nodesList.length === 0 ? 5 : nodesPerDay))
        );
      };
    },
    nodeLabel(state: State) {
      return (nodeId: string): string => {
        const node = state.shardFarming.find((x) => x.id === nodeId);
        if (node) {
          let str = `${node.table} ${node.map}-${node.mission}`;
          if (node.difficulty) {
            str += ` (${node.difficulty})`;
          }
          return str;
        } else {
          return nodeId;
        }
      };
    },
    plannerList(
      state: State,
      _getters: any,
      rootState: RootState
    ): (Unit | UnitBasic)[] {
      return Object.entries(state.ownedShards).reduce(
        (acc: (Unit | UnitBasic)[], [id, value]) => {
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
      const match = state.ownedShards[id];
      if (match && (tracking === undefined || tracking === null)) {
        tracking = match.tracking || false;
      }
      state.ownedShards[id] = {
        owned: count || 0,
        nodes: nodes || [],
        tracking,
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
    async initialize({ commit }: ActionCtx, player: PlayerResponse) {
      const farmingData = await apiClient.fetchFarmingData();
      commit("SET_SHARD_FARMING", farmingData);
      commit("SET_OWNED_SHARDS", player.shards);
    },
    saveShardsCount({ commit, dispatch }: ActionCtx, data: NodePayload) {
      commit("UPSERT_SHARD_COUNT", data);
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