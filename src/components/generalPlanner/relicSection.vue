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
import { setupEvents, unvue } from "../../utils";
import RelicTable from "../relic/relicTable.vue";
import { Relic } from "../../types/relic";

export default defineComponent({
  name: "RelicSection",
  components: { RelicTable },
  computed: {
    ...mapGetters("planner", ["fullUnitList", "relicTarget"]),
    ...mapState("relic", ["relicConfig"]),
    fullRelicList(): Relic[] {
      const list: Relic[] = unvue(Object.values(this.relicConfig));
      this.fullUnitList.forEach((unit: Unit) => {
        const target = this.relicTarget(unit.id);

        if (unit.relicLevel < target) {
          list.forEach((relic: Relic) => {
            if (relic.amount[target] > 0) {
              if (relic.neededBy) {
                relic.neededBy.push({ name: unit.name, id: unit.id });
              } else {
                relic.neededBy = [{ name: unit.name, id: unit.id }];
              }
            }
          });
        }
      });
      return list;
    },
    relicTargetLevels(): any[] {
      const list: any[] = [];
      this.fullUnitList.forEach((unit: Unit) => {
        const target = this.relicTarget(unit.id);
        list.push({ level: unit.relicLevel, target });
      });
      return list;
    },
  },
  mounted() {
    setupEvents(this.$refs.relicSection as HTMLElement, "relicSection");
  },
});
</script>
