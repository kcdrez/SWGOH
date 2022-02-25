<template>
  <div>
    <div class="collapse-header section-header mt-3">
      <h3>
        <div data-bs-toggle="collapse" href="#relic-section-table">
          Relic Summary
        </div>
      </h3>
    </div>
    <div id="relic-section-table" class="collapse" ref="relicSection">
      <RelicTable
        :relicList="fullRelicList"
        :targetLevels="relicTargetLevels"
        showRequiredByUnit
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapState } from "vuex";

import { Unit } from "../..//types/unit";
import { setupEvents } from "../../utils";
import RelicTable from "../relic/relicTable.vue";
import { Relic } from "../../types/relic";

export default defineComponent({
  name: "RelicSection",
  components: { RelicTable },
  computed: {
    ...mapGetters("planner", ["fullUnitList"]),
    ...mapState("relic", ["relicConfig"]),
    fullRelicList(): Relic[] {
      const list: Relic[] = Object.values(this.relicConfig);
      this.fullUnitList.forEach((unit: Unit) => {
        if (unit.relicLevel < unit.relicTarget) {
          list.forEach((relic: Relic) => {
            if (relic.amount[unit.relicTarget] > 0) {
              relic.addNeededBy({ name: unit.name, id: unit.id });
            }
          });
        }
      });
      return list;
    },
    relicTargetLevels(): any[] {
      const list: any[] = [];
      this.fullUnitList.forEach((unit: Unit) => {
        list.push({ level: unit.relicLevel, target: unit.relicTarget });
      });
      return list;
    },
  },
  mounted() {
    setupEvents(this.$refs.relicSection as HTMLElement, "relicSection");
  },
  created() {},
});
</script>
