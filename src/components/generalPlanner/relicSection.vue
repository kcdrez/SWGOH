<template>
  <ExpandableSection
    title="Relic Summary"
    :idRef="refName"
    :options="expandOptions"
    class="mt-3"
  >
    <RelicTable
      :relicList="fullRelicList"
      :targetLevels="relicTargetLevels"
      :selectedColumns="selectedColumns"
      showRequiredByUnit
      :storageKey="refName"
    />
  </ExpandableSection>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";

import { Unit } from "types/unit";
import { Relic } from "types/relic";
import { setupEvents } from "utils";
import RelicTable from "components/relic/relicTable.vue";

const storageKey = "relicSection";
interface dataModel {
  selectedColumns: string[];
  refName: string;
}

export default defineComponent({
  name: "RelicSection",
  components: { RelicTable },
  props: {
    units: {
      type: Array as () => Unit[],
      required: true,
    },
    relicTargets: {
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
    ...mapState("relic", ["relicConfig"]),
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
          label: "Rarity",
          value: "rarity",
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
          label: "Required By",
          value: "required",
        },
        {
          label: "Estimated Time",
          value: "time",
        },
      ];
      return list;
    },
    fullRelicList(): Relic[] {
      const list: Relic[] = Object.values(this.relicConfig);
      list.forEach((relic) => relic.resetNeeded());
      this.units.forEach((unit: Unit) => {
        if (unit.relicLevel < unit.relicTarget) {
          list.forEach((relic: Relic) => {
            const target = this.relicTargets[unit.id] ?? unit.relicTarget;
            relic.addNeededBy({
              name: unit.name,
              id: unit.id,
              amount: relic.amountNeeded([{ target, level: unit.relicLevel }]),
            });
          });
        }
      });
      return list;
    },
    relicTargetLevels(): any[] {
      const list: any[] = [];
      this.units.forEach((unit: Unit) => {
        const target = this.relicTargets[unit.id] ?? unit.relicTarget;
        list.push({ level: unit.relicLevel, target });
      });
      return list;
    },
    expandOptions(): any {
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
