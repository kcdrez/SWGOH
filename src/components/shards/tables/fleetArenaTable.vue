<template>
  <div v-if="unitList.length > 0">
    <div class="collapse-header section-header extended-2">
      <h3
        class="w-100"
        data-bs-toggle="collapse"
        href="#fleetArenaStoreSection"
      >
        <div class="d-inline">Fleet Arena Store</div>
      </h3>
      <div class="toggles-container">
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
    </div>
    <StoreTable
      id="fleetArenaStoreSection"
      class="collapse"
      ref="fleetArenaStoreSection"
      :units="unitList"
      :selectedColumns="selectedColumns"
      showUnitName
      :simpleView="simpleView"
      :currencyTypes="['fleetArenaCurrency']"
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

const storageKey = "fleetArena";

export default defineComponent({
  name: "FleetArenaStoreTable",
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
          (node) => node.table === "Fleet Arena Store"
        );
      });
    },
  },
  mounted() {
    const tableComponent = this.$refs?.fleetArenaStoreSection as any;
    setupEvents(tableComponent?.$el, storageKey + "Collapse", false, () => {
      tableComponent?.refresh();
    });
  },
});
</script>
