<template>
  <input
    class="form-control form-control-sm"
    type="number"
    v-model.number="priority"
    min="0"
    max="1000"
    @change="save"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import _ from "lodash";

import { Unit } from "types/unit";
import { Node } from "types/shards";

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
      priority: this.unit.tablePriority(this.nodeTableNames),
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
    save: _.debounce(function (this: any) {
      this.unit.shardNodes = this.nodeData;
    }, 1000),
  },
});
</script>
