<template>
  <div v-if="unitList.length > 0">
    <div class="collapse-header section-header">
      <h3
        class="w-100"
        data-bs-toggle="collapse"
        href="#galacticWarStoreSection"
      >
        <div class="d-inline">Galactic War Store</div>
      </h3>
      <div class="simple-view-container">
        <Toggle v-model="simpleView" onLabel="Simple" offLabel="Advanced" />
      </div>
      <MultiSelect
        class="select-columns"
        :options="cols"
        storageKey="galacticWarStoreSection"
        @checked="selectedColumns = $event"
      />
    </div>
    <StoreTable
      id="galacticWarStoreSection"
      class="collapse"
      ref="galacticWarStoreSection"
      :units="unitList"
      :selectedColumns="selectedColumns"
      showUnitName
      allowEditAvg
      :simpleView="simpleView"
      :currencyTypes="['galacticWarCurrency']"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

import { setupEvents } from "../../../utils";
import { Unit } from "../../../types/unit";
import StoreTable from "./storeTable.vue";

export default defineComponent({
  name: "GalacticWarTable",
  components: { StoreTable },
  data() {
    return {
      selectedColumns: [],
      simpleView: JSON.parse(
        window.localStorage.getItem("galacticWarTableSimpleView") || "true"
      ),
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
          (node) => node.table === "Galactic War Store"
        );
      });
    },
  },
  watch: {
    simpleView(newVal) {
      window.localStorage.setItem("galacticWarTableSimpleView", newVal);
    },
  },
  mounted() {
    setupEvents(
      (this.$refs?.galacticWarStoreSection as any)?.$el as HTMLElement,
      "galacticWarStoreSection"
    );
  },
});
</script>
