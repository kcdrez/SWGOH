<template>
  <div>
    <div class="collapse-header section-header mt-3 extended-1">
      <h3>
        <div data-bs-toggle="collapse" href="#gear-section-table">
          Gear Summary
        </div>
      </h3>
      <div class="toggles-container">
        <MultiSelect
          class="select-columns"
          :options="cols"
          :storageKey="storageKey + 'Columns'"
          @checked="selectedColumns = $event"
        />
      </div>
    </div>
    <div id="gear-section-table" ref="gearSection" class="collapse">
      <GearTable
        :gearList="fullGearList"
        showRequiredByUnit
        :selectedColumns="selectedColumns"
        :storageKey="storageKey + 'Table'"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { Unit } from "types/unit";
import { Gear } from "types/gear";
import { setupEvents } from "utils";
import GearTable from "components/gear/gearTable.vue";

const storageKey = "gearSection";

export default defineComponent({
  name: "GearSection",
  components: { GearTable },
  props: {
    units: {
      type: Array as () => Unit[],
      required: true,
    },
  },
  data() {
    return {
      selectedColumns: [],
      storageKey,
    };
  },
  computed: {
    fullGearList(): Gear[] {
      const list: Gear[] = [];
      this.units.forEach((unit: Unit) => {
        unit.fullSalvageList.forEach((gear: Gear) => {
          const match = list.find((x) => x.id === gear.id);
          if (match) {
            match.neededBy.push(...gear.neededBy);
            match.totalAmount += gear.totalAmount;
          } else {
            list.push(gear);
          }
        });
      });
      return list;
    },
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
          text: "Mark",
          value: "mark",
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
    setupEvents(this.$refs.gearSection as HTMLElement, storageKey);
  },
});
</script>

<style lang="scss" scoped></style>
