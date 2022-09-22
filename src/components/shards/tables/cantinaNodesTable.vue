<template>
  <div v-if="unitList.length > 0">
    <div class="collapse-header section-header extended-2">
      <h3 class="w-100" data-bs-toggle="collapse" href="#cantinaNodesTable">
        <div class="d-inline">Cantina Battles</div>
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
    <ShardTable
      id="cantinaNodesTable"
      class="collapse"
      ref="cantinaNodesTable"
      :units="unitList"
      :nodeTableNames="['Cantina']"
      :selectedColumns="selectedColumns"
      showUnitName
      showPriority
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
import ShardTable from "./shardTable.vue";

const storageKey = "cantinaNodes";

export default defineComponent({
  name: "CantinaNodesTable",
  setup() {
    const { simpleView } = setupSimpleView(storageKey);
    return { simpleView };
  },
  components: { ShardTable },
  data() {
    return {
      selectedColumns: [],
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
          text: "Attempts",
          value: "attempts",
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
        return unit.whereToFarm.some((node) => node.table === "Cantina");
      });
    },
  },
  mounted() {
    const tableComponent = this.$refs?.cantinaNodesTable as any;
    setupEvents(tableComponent?.$el, storageKey + "Collapse", false, () => {
      tableComponent?.refresh();
    });
  },
});
</script>
