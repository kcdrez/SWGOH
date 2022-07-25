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

import { setupEvents } from "../../../utils";
import { Unit } from "../../../types/unit";
import StoreTable from "./storeTable.vue";

const storageKey = "fleetArena";

export default defineComponent({
  name: "FleetArenaStoreTable",
  components: { StoreTable },
  data() {
    return {
      selectedColumns: [],
      simpleView: JSON.parse(window.localStorage.getItem(storageKey) || "true"),
      storageKey,
    };
  },
  computed: {
    ...mapGetters("shards", ["unitFarmingList"]),
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
          text: "Owned Shards",
          value: "owned",
        },
        {
          text: "Shards Remaining",
          value: "remaining",
        },
        {
          text: "Progress",
          value: "progress",
        },
        {
          text: "Currency Owned",
          value: "wallet",
        },
        {
          text: "Daily Currency Obtained",
          value: "dailyCurrency",
        },
        {
          text: "Remaining Currency",
          value: "remainingCurrency",
        },
        {
          text: "Estimated Time",
          value: "time",
        },
        {
          text: "Priority",
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
  watch: {
    simpleView(newVal) {
      window.localStorage.setItem(storageKey, newVal);
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
