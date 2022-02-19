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
import { mapActions, mapGetters, mapState } from "vuex";

import { Unit } from "../../types/unit";
import { FarmingNode, Node } from "../../types/shards";

export default defineComponent({
  name: "ShardPriority",
  props: {
    unit: {
      required: true,
      type: Object as PropType<Unit>,
    },
    nodeTableNames: {
      type: Array,
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
    ...mapState("shards", ["ownedShards"]),
    ...mapGetters("shards", ["unitNodes", "unitPriority"]),
    nodeData(): Node[] {
      const nodesList: FarmingNode[] = this.unitNodes(this.unit.id);
      const nodesListByUnit: Node[] =
        this.ownedShards[this.unit.id]?.nodes || [];

      return nodesList.map((node) => {
        const match = nodesListByUnit.find((n) => n.id === node.id);
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
    ...mapActions("shards", ["saveShardsCount"]),
    save() {
      this.editing = false;
      const payload: any = { id: this.unit.id };

      payload.nodes = this.nodeData;
      this.saveShardsCount(payload);
    },
    edit() {
      this.editing = true;
      this.$nextTick(() => {
        (this.$refs?.saveButton as any).focus();
      });
    },
    cancel() {
      this.editing = false;
      this.priority = this.unitPriority(this.unit.id, this.nodeTableNames);
    },
  },
  created() {
    this.cancel();
  },
});
</script>
