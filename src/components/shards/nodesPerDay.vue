<template>
  <div class="nodes-container">
    <div
      class="input-group input-group-sm"
      v-for="node in nodes"
      :key="node.id"
    >
      <span class="input-group-text">{{ node.label }}</span>
      <input
        class="form-control"
        type="number"
        v-model.number="node.count"
        min="0"
        max="1000"
        @change="save"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapState } from "vuex";
import _ from "lodash";

import { FarmingNode, NodePayload, Node } from "../../types/shards";
import { Unit } from "../../types/unit";
import { unvue } from "../../utils";

interface dataModel {
  nodes: Node[];
}

export default defineComponent({
  name: "NodesPerDay",
  props: {
    unit: {
      type: Object as () => Unit,
      required: true,
    },
  },
  data() {
    return {
      nodes: [],
    } as dataModel;
  },
  computed: {
    ...mapState("shards", ["ownedShards"]),
    unitNodeData(): NodePayload {
      return {
        id: this.unit.id,
        count: this.ownedShards[this.unit.id]?.owned ?? 0,
        nodes: this.nodes,
      };
    },
  },
  methods: {
    ...mapActions("shards", ["saveShardsCount"]),
    save: _.debounce(function (this: any) {
      this.saveShardsCount(this.unitNodeData);
    }, 1000),
  },
  created(): void {
    const nodesList: FarmingNode[] = this.unit.whereToFarm.filter(
      (node: FarmingNode) => {
        return (
          node.table === "Light Side" ||
          node.table === "Dark Side" ||
          node.table === "Cantina" ||
          node.table === "Fleet"
        );
      }
    );

    const finalList: Node[] = nodesList.map((node) => {
      const { count } =
        this.unit.shardNodes.find((n) => n.id === node.id) || {};
      return {
        id: node.id,
        count: count ?? 0,
        label: node.label,
      };
    });

    this.nodes = unvue(finalList);
  },
});
</script>

<style lang="scss" scoped>
.nodes-container {
  .input-group:not(:last-child) {
    margin-bottom: 0.25rem;
  }
}
</style>
