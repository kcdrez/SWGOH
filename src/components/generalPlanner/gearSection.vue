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
    gearTargets: {
      type: Object,
      default: () => {
        return {};
      },
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
        const gearTarget: number = this.gearTargets[unit.id] ?? unit.gearTarget;
        unit.fullSalvageList(gearTarget).forEach((gear: Gear) => {
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
    cols(): { label: string; value: any }[] {
      const list = [
        {
          label: "Icon",
          value: "icon",
        },
        {
          label: "Name",
          value: "name",
        },
        {
          label: "Mark",
          value: "mark",
        },
        {
          label: "Locations",
          value: "locations",
        },
        {
          label: "Amount Owned",
          value: "owned",
        },
        {
          label: "Amount Needed",
          value: "needed",
        },
        {
          label: "Progress",
          value: "progress",
        },
        {
          label: "Estimated Time",
          value: "time",
        },
        {
          label: "Required By",
          value: "required",
        },
        {
          label: "Actions",
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
