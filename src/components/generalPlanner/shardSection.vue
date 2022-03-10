<template>
  <div class="mb-3">
    <div class="collapse-header section-header mt-3">
      <h3>
        <div data-bs-toggle="collapse" href="#shard-section-table">
          Shard Summary
        </div>
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
    <div id="shard-section-table" class="collapse" ref="shardSection">
      <ShardTable
        :units="plannerList"
        showUnitName
        showActions
        :selectedColumns="selectedColumns"
        :simpleView="simpleView"
        :storageKey="storageKey + 'Table'"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapState } from "vuex";

import { setupEvents } from "../../utils";
import ShardTable from "../shards/tables/shardTable.vue";

const storageKey = "shardSection";

export default defineComponent({
  name: "ShardSection",
  components: { ShardTable },
  data() {
    return {
      selectedColumns: [],
      simpleView: JSON.parse(window.localStorage.getItem(storageKey) || "true"),
      storageKey,
    };
  },
  computed: {
    ...mapGetters("planner", ["fullUnitList"]),
    ...mapState("relic", ["relicConfig"]),
    ...mapGetters("shards", ["plannerList"]),
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
          text: "Actions",
          value: "actions",
        },
      ];
      return list;
    },
  },
  watch: {
    simpleView(newVal) {
      window.localStorage.setItem(storageKey, newVal);
    },
  },
  mounted() {
    setupEvents(
      this.$refs.shardSection as HTMLElement,
      storageKey + "Collapse"
    );
  },
});
</script>

<style lang="scss" scoped></style>
