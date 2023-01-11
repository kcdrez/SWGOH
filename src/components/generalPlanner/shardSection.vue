<template>
  <div class="mb-3">
    <div class="collapse-header section-header mt-3 extended-2">
      <h3>
        <div data-bs-toggle="collapse" href="#shard-section-table">
          Shard Summary
        </div>
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
      id="shard-section-table"
      class="collapse"
      ref="shardSection"
      :units="plannerList"
      showUnitName
      showActions
      :selectedColumns="selectedColumns"
      :simpleView="simpleView"
      :storageKey="storageKey + 'Table'"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapState } from "vuex";

import { setupEvents, setupSimpleView } from "utils";
import ShardTable from "components/shards/tables/shardTable.vue";

const storageKey = "shardSection";

export default defineComponent({
  name: "ShardSection",
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
    ...mapGetters("planner", ["fullUnitList"]),
    ...mapState("relic", ["relicConfig"]),
    ...mapGetters("shards", ["plannerList"]),
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
          label: "Attempts",
          value: "attempts",
        },
        {
          label: "Estimated Time",
          value: "time",
        },
        {
          label: "Actions",
          value: "actions",
        },
      ];
      return list;
    },
  },
  mounted() {
    const tableComponent = this.$refs?.shardSection as any;
    setupEvents(tableComponent?.$el, storageKey + "Collapse", false, () => {
      tableComponent?.refresh();
    });
  },
});
</script>

<style lang="scss" scoped></style>
