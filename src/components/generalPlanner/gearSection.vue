<template>
  <div>
    <div class="collapse-header section-header mt-3">
      <h3>
        <div data-bs-toggle="collapse" href="#gear-section-table">
          Gear Summary
        </div>
      </h3>
    </div>
    <div id="gear-section-table" ref="gearSection" class="collapse">
      <GearTable :gearList="fullGearList" showRequiredByUnit />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

import { Unit } from "../..//types/unit";
import { Gear } from "../..//types/gear";
import { setupEvents } from "../../utils";
import GearTable from "../gear/gearTable.vue";

export default defineComponent({
  name: "GearSection",
  components: { GearTable },
  computed: {
    ...mapGetters("planner", ["fullUnitList", "gearTarget"]),
    ...mapGetters("gear", ["fullSalvageList"]),
    fullGearList(): Gear[] {
      const list: Gear[] = [];
      this.fullUnitList.forEach((unit: Unit) => {
        const unitGearList = this.fullSalvageList(
          unit,
          this.gearTarget(unit.id)
        );
        unitGearList.forEach((gear: Gear) => {
          const match = list.find((el) => gear.id === el.id);
          if (match) {
            match.amount += gear.amount;
            match.neededBy?.push({ name: unit.name, id: unit.id });
          } else {
            list.push(
              new Gear({
                ...gear.sanitize,
                neededBy: [{ name: unit.name, id: unit.id }],
              })
            );
          }
        });
      });
      return list;
    },
  },
  mounted() {
    setupEvents(this.$refs.gearSection as HTMLElement, "gearSection");
  },
});
</script>
