<template>
  <div>
    <div class="collapse-header section-header mt-3 extended-1">
      <h3>
        <div data-bs-toggle="collapse" href="#relic-section-table">
          Relic Summary
        </div>
      </h3>
      <MultiSelect
        class="select-columns"
        :options="cols"
        :storageKey="storageKey + 'Columns'"
        @checked="selectedColumns = $event"
      />
    </div>
    <div id="relic-section-table" class="collapse" ref="relicSection">
      <RelicTable
        :relicList="fullRelicList"
        :targetLevels="relicTargetLevels"
        :selectedColumns="selectedColumns"
        showRequiredByUnit
        :storageKey="storageKey + 'Table'"
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

const storageKey = "relicSection";

export default defineComponent({
  name: "RelicSection",
  components: { RelicTable },
  data() {
    return {
      selectedColumns: [],
      storageKey,
    };
  },
  computed: {
    ...mapGetters("planner", ["fullUnitList"]),
    ...mapState("relic", ["relicConfig"]),
    cols(): { text: string; value: any }[] {
      const list = [
        {
          text: "Icon",
          value: "icon",
        },
        {
          text: "Name",
          value: "name",
        },
        {
          text: "Rarity",
          value: "rarity",
        },
        {
          text: "Locations",
          value: "locations",
        },
        {
          text: "Amount Owned",
          value: "owned",
        },
        {
          text: "Amount Needed",
          value: "needed",
        },
        {
          text: "Progress",
          value: "progress",
        },
        {
          text: "Required By",
          value: "required",
        },
        {
          text: "Estimated Time",
          value: "time",
        },
      ];
      return list;
    },
    fullRelicList(): Relic[] {
      const list: Relic[] = Object.values(this.relicConfig);
      this.fullUnitList.forEach((unit: Unit) => {
        if (unit.relicLevel < unit.relicTarget) {
          list.forEach((relic: Relic) => {
            if (relic.amount[unit.relicTarget] > 0) {
              relic.addNeededBy({
                name: unit.name,
                id: unit.id,
                amount: relic.amountNeeded([
                  { target: unit.relicTarget, level: unit.relicLevel },
                ]),
              });
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
    setupEvents(this.$refs.relicSection as HTMLElement, storageKey);
  },
  created() {},
});
</script>

<style lang="scss" scoped></style>
