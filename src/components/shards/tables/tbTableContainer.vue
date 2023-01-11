<template>
  <div v-if="unitList.length > 0">
    <div class="collapse-header section-header extended-2">
      <h3
        class="w-100"
        data-bs-toggle="collapse"
        href="#territoryBattlesSection"
      >
        <div class="d-inline">Territory Battle Units</div>
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
    <TerritoryBattleShardTable
      id="territoryBattlesSection"
      class="collapse"
      ref="territoryBattlesSection"
      :units="unitList"
      :selectedColumns="selectedColumns"
      showUnitName
      :simpleView="simpleView"
      :storageKey="storageKey + 'Table'"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

import { setupEvents, setupSimpleView } from "utils";
import { Unit } from "types/unit";
import TerritoryBattleShardTable from "./territoryBattleShardTable.vue";

const storageKey = "territoryBattles";

export default defineComponent({
  name: "TbTableContainer",
  setup() {
    const { simpleView } = setupSimpleView(storageKey);
    return { simpleView };
  },
  components: { TerritoryBattleShardTable },
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
          label: "Estimated Time",
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
  mounted() {
    const tableComponent = this.$refs?.territoryBattlesSection as any;
    setupEvents(tableComponent?.$el, storageKey + "Collapse", false, () => {
      tableComponent?.refresh();
    });
  },
});
</script>
