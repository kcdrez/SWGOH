<template>
  <div>
    <div class="collapse-header section-header mt-3 position-relative">
      <h3>
        <div data-bs-toggle="collapse" href="#gear-section-table">
          Gear Summary
        </div>
      </h3>
      <MultiSelect
        class="select-columns"
        :options="cols"
        storageKey="gearTable"
        @checked="selectedColumns = $event"
      />
    </div>
    <div id="gear-section-table" ref="gearSection" class="collapse">
      <GearTable
        :gearList="fullGearList"
        showRequiredByUnit
        :selectedColumns="selectedColumns"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

import { Unit } from "../../types/unit";
import { Gear } from "../../types/gear";
import { setupEvents } from "../../utils";
import GearTable from "../gear/gearTable.vue";

export default defineComponent({
  name: "GearSection",
  components: { GearTable },
  data() {
    return {
      selectedColumns: [],
    };
  },
  computed: {
    ...mapGetters("planner", ["fullUnitList"]),
    fullGearList(): Gear[] {
      const list: Gear[] = [];
      this.fullUnitList.forEach((unit: Unit) => {
        unit.fullSalvageList.forEach((gear: Gear) => {
          const match = list.find((el) => gear.id === el.id);
          if (match) {
            match.amount += gear.amount;
            match.neededBy?.push({
              name: unit.name,
              id: unit.id,
              amount: gear.amount,
            });
          } else {
            list.push(
              gear.clone({
                neededBy: [
                  { name: unit.name, id: unit.id, amount: gear.amount },
                ],
                amount: gear.amount,
              })
            );
          }
        });
      });
      return list;
    },
    cols(): { text: string; value: any }[] {
      const list = [
        {
          text: "Name",
          value: "name",
        },
        {
          text: "Locations",
          value: "locations",
        },
        {
          text: "Progress",
          value: "progress",
        },
        {
          text: "Estimated Time",
          value: "time",
        },
        {
          text: "Required By",
          value: "required",
        },
        {
          text: "Actions",
          value: "actions",
        },
      ];
      return list;
    },
  },
  mounted() {
    setupEvents(this.$refs.gearSection as HTMLElement, "gearSection");
  },
});
</script>

<style lang="scss" scoped>
</style>
