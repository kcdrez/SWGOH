<template>
  <div class="mb-3">
    <div class="collapse-header section-header mt-3 position-relative">
      <h3>
        <div data-bs-toggle="collapse" href="#shard-section-table">
          Shard Summary
        </div>
      </h3>
      <MultiSelect
        class="select-columns"
        :options="cols"
        storageKey="shardTable"
        @checked="selectedColumns = $event"
        @click.stop=""
      />
    </div>
    <div id="shard-section-table" class="collapse" ref="shardSection">
      <ShardTable
        :units="plannerList"
        showUnitName
        showPriority
        :selectedColumns="selectedColumns"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapState } from "vuex";

import { setupEvents } from "../../utils";
import ShardTable from "../shards/shardTable.vue";

export default defineComponent({
  name: "ShardSection",
  components: { ShardTable },
  data() {
    return {
      selectedColumns: [],
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
          text: "Priority",
          value: "priority",
        },
        {
          text: "Actions",
          value: "actions",
        },
      ];
      return list;
    },
  },

  mounted() {
    setupEvents(this.$refs.shardSection as HTMLElement, "shardSection");
  },
});
</script>

<style lang="scss" scoped>
.select-columns {
  position: absolute;
  top: 0;
  right: 1rem;
  width: 250px;
  margin-top: 0.5rem;
  text-align: left;
}
</style>
