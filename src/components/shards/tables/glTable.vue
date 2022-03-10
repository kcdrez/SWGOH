<template>
  <div v-if="unitList.length > 0">
    <div class="collapse-header section-header">
      <h3
        class="w-100"
        data-bs-toggle="collapse"
        href="#galacticLegendsSection"
      >
        <div class="d-inline">Galactic Legend Units</div>
      </h3>
      <div class="simple-view-container">
        <Toggle v-model="simpleView" onLabel="Simple" offLabel="Advanced" />
      </div>
      <MultiSelect
        class="select-columns"
        :options="cols"
        storageKey="galacticLegendsSection"
        @checked="selectedColumns = $event"
      />
    </div>
    <ShardTable
      id="galacticLegendsSection"
      class="collapse"
      ref="galacticLegendsSection"
      :units="unitList"
      :initialSort="{ sortDir: 'asc', sortMethod: 'priority' }"
      :nodeTableNames="['Galactic Legend Events']"
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
  name: "GLTable",
  components: { ShardTable },
  data() {
    return {
      selectedColumns: [],
      simpleView: JSON.parse(
        window.localStorage.getItem("glTableSimpleView") || "true"
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
        return unit.whereToFarm.some(
          (node) => node.table === "Galactic Legend Events"
        );
      });
    },
  },
  watch: {
    simpleView(newVal) {
      window.localStorage.setItem("glTableSimpleView", newVal);
    },
  },
  mounted() {
    setupEvents(
      (this.$refs?.galacticLegendsSection as any)?.$el as HTMLElement,
      "galacticLegendsSection"
    );
  },
});
</script>
