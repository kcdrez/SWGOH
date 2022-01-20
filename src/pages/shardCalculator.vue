<template>
  <div>
    <h1>Shard Calculator Page</h1>
    <ShardRow v-for="unit in units" :key="unit.base_id" />
    <button class="btn btn-primary" @click="addRow">Add Row</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import ShardRow from "../components/shardRow.vue";

interface unit {
  id: string;
  name: string;
}

interface dataModel {
  units: unit[];
}

export default defineComponent({
  name: "ShardCalculatorPage",
  components: { ShardRow },
  data() {
    return {
      units: [],
    } as dataModel;
  },
  methods: {
    addRow() {
      this.units.push({ id: this.units.length.toString(), name: "" });
    },
  },
});
</script>
