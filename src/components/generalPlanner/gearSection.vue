<template>
  <ExpandableSection
    title="Gear Summary"
    :idRef="refName"
    :options="expandOptions"
  >
    <GearTable
      :gearList="fullGearList"
      showRequiredByUnit
      :selectedColumns="selectedColumns"
      :storageKey="refName"
    />
  </ExpandableSection>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { Unit } from "types/unit";
import { Gear } from "types/gear";
import GearTable from "components/gear/gearTable.vue";
import { iExpandOptions } from "types/general";

const storageKey = "gearSection";
interface dataModel {
  selectedColumns: string[];
  refName: string;
}

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
      refName: storageKey + "Table",
    } as dataModel;
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
    expandOptions(): iExpandOptions {
      return {
        multiSelect: {
          options: this.cols,
          change: (newVal: string[]) => {
            this.selectedColumns = newVal;
          },
        },
        onShow: () => {
          const tableComponent = this.$refs[this.refName] as any;
          tableComponent?.refresh();
        },
      };
    },
  },
});
</script>

<style lang="scss" scoped></style>
