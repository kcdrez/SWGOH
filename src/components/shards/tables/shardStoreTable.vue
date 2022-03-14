<template>
  <div v-if="unitList.length > 0">
    <div class="collapse-header section-header">
      <h3 class="w-100" data-bs-toggle="collapse" href="#shardStoreSection">
        <div class="d-inline">Shard Store</div>
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
      id="shardStoreSection"
      class="collapse"
      ref="shardStoreSection"
      :units="unitList"
      :selectedColumns="selectedColumns"
      showUnitName
      :simpleView="simpleView"
      :currencyTypes="['shardCurrency']"
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

const storageKey = "shardStore";

export default defineComponent({
  name: "ShardStoreTable",
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
        return unit.whereToFarm.some((node) => node.table === "Shard Store");
      });
    },
  },
  watch: {
    simpleView(newVal) {
      window.localStorage.setItem(storageKey, newVal);
    },
  },
  mounted() {
    setupEvents(
      (this.$refs?.shardStoreSection as any)?.$el as HTMLElement,
      storageKey + "Collapse"
    );
  },
});
</script>
