<template>
  <div class="input-group input-group-sm">
    <span class="input-group-text label-priority">Priority:</span>
    <input
      class="form-control priority-level"
      type="number"
      v-model.number="priority"
      min="0"
      max="1000"
      @keydown.enter="save"
      ref="saveButton"
      :disabled="!editing"
    />
    <template v-if="editing">
      <button type="button" class="btn btn-success" @click="save">
        <i class="fas fa-save"></i>
      </button>
      <button type="button" class="btn btn-warning" @click="cancel">
        <i class="fas fa-ban"></i>
      </button>
    </template>
    <button type="button" class="btn btn-primary" @click="edit" v-else>
      <i class="fas fa-edit"></i>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import { Unit } from "../../types/unit";
import { Node } from "../../types/shards";

export default defineComponent({
  name: "ShardPriority",
  props: {
    unit: {
      required: true,
      type: Object as PropType<Unit>,
    },
    nodeTableNames: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
  data() {
    return {
      editing: false,
      priority: 0,
    };
  },
  computed: {
    nodeData(): Node[] {
      return this.unit.whereToFarm.map((node) => {
        const match = this.unit.shardNodes.find((n) => n.id === node.id);
        return {
          id: node.id,
          priority: this.nodeTableNames.includes(node.table)
            ? this.priority
            : match?.priority,
        };
      });
    },
  },
  methods: {
    save() {
      this.editing = false;
      this.unit.shardNodes = this.nodeData;
    },
    edit() {
      this.editing = true;
      this.$nextTick(() => {
        (this.$refs?.saveButton as any).focus();
      });
    },
    cancel() {
      this.editing = false;
      this.priority = this.unit.tablePriority(this.nodeTableNames);
    },
  },
  created() {
    this.cancel();
  },
});
</script>
