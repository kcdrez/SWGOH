<template>
  <LegendarySummaryTable
    v-if="unitList.length > 0"
    :unitList="unitList"
    :storageKey="storageKey + 'Table'"
    header="Legendary Units"
    nodeKey="legendary"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

import { Unit } from "../../../../types/unit";
import LegendarySummaryTable from "./legendarySummaryTable.vue";

const storageKey = "legendaryUnits";

export default defineComponent({
  name: "LegendaryTable",
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
          (node) => node.table === "Legendary Events"
        );
      });
    },
  },
});
</script>
