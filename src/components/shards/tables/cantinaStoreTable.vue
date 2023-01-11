<template>
  <div v-if="unitList.length > 0">
    <div class="collapse-header section-header extended-2">
      <h3 class="w-100" data-bs-toggle="collapse" href="#cantinaStoreSection">
        <div class="d-inline">Cantina Store</div>
      </h3>
      <div class="simple-view-container">
        <Toggle v-model="simpleView" onLabel="Simple" offLabel="Advanced" />
      </div>
      <MultiSelect
        class="select-columns"
        :options="cols"
        :storageKey="storageKey + 'Columns'"
        @checked="selectedColumns = $event"
      />
    </div>
    <StoreTable
      id="cantinaStoreSection"
      class="collapse"
      ref="cantinaStoreSection"
      :units="unitList"
      :selectedColumns="selectedColumns"
      showUnitName
      :currencyTypes="['cantinaBattleCurrency']"
      :storageKey="storageKey + 'Table'"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

import { setupEvents, setupSimpleView } from "utils";
import { Unit } from "types/unit";
import StoreTable from "./storeTable.vue";

const storageKey = "cantinaStore";

export default defineComponent({
  name: "CantinaStoreTable",
  setup() {
    const { simpleView } = setupSimpleView(storageKey);
    return { simpleView };
  },
  components: { StoreTable },
  data() {
    return {
      selectedColumns: [],
      storageKey,
    };
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
          (node) => node.table === "Cantina Battles Store"
        );
      });
    },
  },
  mounted() {
    const tableComponent = this.$refs?.cantinaStoreSection as any;
    setupEvents(tableComponent?.$el, storageKey + "Collapse", false, () => {
      tableComponent?.refresh();
    });
  },
});
</script>
