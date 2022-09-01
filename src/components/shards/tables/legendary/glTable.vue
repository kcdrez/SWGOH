<template>
  <LegendarySummaryTable
    v-if="unitList.length > 0"
    :unitList="unitList"
    :storageKey="storageKey + 'Table'"
    header="Galactic Legends"
    nodeKey="galactic_legends"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

import { Unit } from "types/unit";
import LegendarySummaryTable from "./legendarySummaryTable.vue";

const storageKey = "glUnits";

export default defineComponent({
  name: "GLTable",
  components: { LegendarySummaryTable },
  data() {
    return {
      storageKey,
    };
  },
  computed: {
    ...mapGetters("shards", ["unitFarmingList"]),
    unitList(): Unit[] {
      return this.unitFarmingList.filter((unit: Unit) => {
        return unit.whereToFarm.some(
          (node) => node.table === "Galactic Legends"
        );
      });
    },
  },
});
</script>
