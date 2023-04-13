<template>
  <ExpandableSection
    v-if="unitList.length > 0"
    title="Guild Events Store"
    :idRef="refName"
    :options="expandOptions"
  >
    <StoreTable
      :ref="refName"
      :units="unitList"
      :selectedColumns="selectedColumns"
      showUnitName
      :simpleView="simpleView"
      :currencyTypes="['get1', 'get2', 'get3']"
      :nodeTableNames="[
        'Guild Events Store (Mk 1)',
        'Guild Events Store (Mk 2)',
        'Guild Events Store (Mk 3)',
      ]"
      :storageKey="refName"
    />
  </ExpandableSection>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

import { setupEvents, setupSimpleView } from "utils";
import { Unit } from "types/unit";
import StoreTable from "./storeTable.vue";

const storageKey = "cantinaStore";
interface dataModel {
  selectedColumns: string[];
  refName: string;
}

export default defineComponent({
  name: "GuildEventsTable",
  setup() {
    const { simpleView } = setupSimpleView(storageKey);
    return { simpleView };
  },
  components: { StoreTable },
  data() {
    return {
      selectedColumns: [],
      refName: storageKey + "Table",
    } as dataModel;
  },
  computed: {
    ...mapGetters("shards", ["unitFarmingList"]),
    cols(): { label: string; value: any }[] {
      const list = [
        {
          label: "Name",
          value: "name",
        },
        {
          label: "Locations",
          value: "locations",
        },
        {
          label: "Owned Shards",
          value: "owned",
        },
        {
          label: "Shards Remaining",
          value: "remaining",
        },
        {
          label: "Progress",
          value: "progress",
        },
        {
          label: "Currency Owned",
          value: "wallet",
        },
        {
          label: "Daily Currency Obtained",
          value: "dailyCurrency",
        },
        {
          label: "Remaining Currency",
          value: "remainingCurrency",
        },
        {
          label: "Estimated Time",
          value: "time",
        },
        {
          label: "Priority",
          value: "priority",
        },
      ];
      return list;
    },
    unitList(): Unit[] {
      return this.unitFarmingList.filter((unit: Unit) => {
        return unit.whereToFarm.some(
          (node) =>
            node.table === "Guild Events Store (Mk 1)" ||
            node.table === "Guild Events Store (Mk 2)" ||
            node.table === "Guild Events Store (Mk 3)"
        );
      });
    },
    expandOptions(): any {
      return {
        toggle: {
          change: (val: boolean) => {
            this.simpleView = val;
          },
          value: this.simpleView,
          onLabel: "Simple",
          offLabel: "Advanced",
        },
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
