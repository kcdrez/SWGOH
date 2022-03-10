<template>
  <div v-if="unitList.length > 0">
    <div class="collapse-header section-header">
      <h3
        class="w-100"
        data-bs-toggle="collapse"
        href="#territoryBattlesSection"
      >
        <div class="d-inline">Territory Battle Units</div>
      </h3>
      <div class="simple-view-container">
        <Toggle v-model="simpleView" onLabel="Simple" offLabel="Advanced" />
      </div>
      <MultiSelect
        class="select-columns"
        :options="cols"
        storageKey="territoryBattlesSection"
        @checked="selectedColumns = $event"
      />
    </div>
    <TerritoryBattleShardTable
      id="territoryBattlesSection"
      class="collapse"
      ref="territoryBattlesSection"
      :units="unitList"
      :selectedColumns="selectedColumns"
      showUnitName
      :simpleView="simpleView"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

import { setupEvents } from "../../../utils";
import { Unit } from "../../../types/unit";
import TerritoryBattleShardTable from "./territoryBattleShardTable.vue";

export default defineComponent({
  name: "TbTableContainer",
  components: { TerritoryBattleShardTable },
  data() {
    return {
      selectedColumns: [],
      simpleView: JSON.parse(
        window.localStorage.getItem("tbTableSimpleView") || "true"
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
          text: "Estimated Time",
          value: "time",
        },
      ];
      return list;
    },
    unitList(): Unit[] {
      return this.unitFarmingList.filter((unit: Unit) => {
        return unit.whereToFarm.some(
          (node) => node.table === "Territory Battles"
        );
      });
    },
  },
  watch: {
    simpleView(newVal) {
      window.localStorage.setItem("tbTableSimpleView", newVal);
    },
  },
  mounted() {
    setupEvents(
      (this.$refs?.territoryBattlesSection as any)?.$el as HTMLElement,
      "territoryBattlesSection"
    );
  },
});
</script>
