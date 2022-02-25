<template>
  <div class="nodes-container">
    <div
      class="input-group input-group-sm"
      v-for="(node, index) in nodes"
      :key="node.id"
    >
      <span class="input-group-text">{{ node.label }}</span>
      <input
        class="form-control"
        type="number"
        v-model.number="node.count"
        min="0"
        max="1000"
        @keydown.enter="save"
        ref="saveButton"
        :disabled="!isEditing(node.id)"
      />
      <template v-if="isEditing(node.id)">
        <button type="button" class="btn btn-success" @click="save">
          <i class="fas fa-save"></i>
        </button>
        <button type="button" class="btn btn-warning" @click="cancel(node.id)">
          <i class="fas fa-ban"></i>
        </button>
      </template>
      <button
        type="button"
        class="btn btn-primary"
        @click="edit(index, node.id)"
        v-else
      >
        <i class="fas fa-edit"></i>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters, mapState } from "vuex";

import { FarmingNode, NodePayload, Node } from "../../types/shards";
import { Unit } from "../../types/unit";
import { unvue } from "../../utils";

interface dataModel {
  editing: string[];
  nodes: Node[];
  archived: Node[];
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
      editing: [],
      nodes: [],
      archived: [],
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
    save(nodeId: string): void {
      this.cancelEditing(nodeId);
      this.saveShardsCount(this.unitNodeData);
    },
    edit(index: number, nodeId: string): void {
      this.editing.push(nodeId);
      this.$nextTick(() => {
        const buttons: HTMLElement[] = this.$refs.saveButton as HTMLElement[];

        if (buttons) {
          buttons[index].focus();
        }
      });
    },
    cancel(nodeId: string): void {
      this.cancelEditing(nodeId);

      const old = this.archived.find((x) => x.id === nodeId);
      if (old) {
        const newIndex = this.nodes.findIndex((x) => x.id === nodeId);
        this.nodes.splice(newIndex, 1, unvue(old));
      }
    },
    cancelEditing(nodeId: string) {
      const index = this.editing.indexOf(nodeId);
      this.editing.splice(index, 1);
    },
    isEditing(nodeId: string): boolean {
      return this.editing.some((x) => x === nodeId);
    },
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
    this.archived = unvue(finalList);
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
