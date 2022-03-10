<template>
  <div v-if="unitList.length > 0">
    <div class="collapse-header section-header">
      <h3 class="w-100" data-bs-toggle="collapse" href="#conquestSection">
        <div class="d-inline">Conquest Units</div>
      </h3>
      <div class="simple-view-container">
        <Toggle v-model="simpleView" onLabel="Simple" offLabel="Advanced" />
      </div>
      <MultiSelect
        class="select-columns"
        :options="cols"
        storageKey="conquestSection"
        @checked="selectedColumns = $event"
      />
    </div>
    <ShardTable
      id="conquestSection"
      class="collapse"
      ref="conquestSection"
      :units="unitList"
      :initialSort="{ sortDir: 'asc', sortMethod: 'priority' }"
      :nodeTableNames="['Conquest']"
      :selectedColumns="selectedColumns"
      showUnitName
      showPriority
      :simpleView="simpleView"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

import { setupEvents } from "../../../utils";
import { Unit } from "../../../types/unit";
import ShardTable from "./shardTable.vue";

export default defineComponent({
  name: "ConquestTable",
  components: { ShardTable },
  data() {
    return {
      selectedColumns: [],
      simpleView: JSON.parse(
        window.localStorage.getItem("conquestTableSimpleView") || "true"
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
        return unit.whereToFarm.some((node) => node.table === "Conquest");
      });
    },
  },
  watch: {
    simpleView(newVal) {
      window.localStorage.setItem("conquestTableSimpleView", newVal);
    },
  },
  mounted() {
    setupEvents(
      (this.$refs?.conquestSection as any)?.$el as HTMLElement,
      "conquestSection"
    );
  },
});
</script>
