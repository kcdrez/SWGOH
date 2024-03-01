<template>
  <ExpandableSection
    title="Shard Summary"
    :idRef="refName"
    :options="expandOptions"
    class="mt-3"
    v-if="plannerList.length > 0"
  >
    <ShardTable
      :ref="refName"
      :units="plannerList"
      showUnitName
      showActions
      :selectedColumns="selectedColumns"
      :simpleView="simpleView"
      :storageKey="refName"
    />
  </ExpandableSection>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapState } from "vuex";

import { setupSimpleView } from "utils";
import ShardTable from "components/shards/tables/shardTable.vue";
import { iExpandOptions } from "types/general";

const storageKey = "shardSection";
interface dataModel {
  selectedColumns: string[];
  refName: string;
}

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
      refName: storageKey + "Table",
    } as dataModel;
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
          value: "ownedShards",
        },
        {
          label: "Shards Remaining",
          value: "remainingShards",
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
          value: "estimatedTime",
        },
        {
          label: "Actions",
          value: "actions",
        },
      ];
      return list;
    },
    expandOptions(): iExpandOptions {
      return {
        toggle: {
          change: (val: boolean) => {
            this.simpleView = val;
          },
          value: this.simpleView,
          onLabel: "Simple",
          offLabel: "Advanced",
        },
        multiSelect: {
          options: this.cols,
          change: (newVal: string[]) => {
            this.selectedColumns = newVal;
          },
        },
        onShow: () => {
          const tableComponent = this.$refs[this.refName] as any;
          tableComponent?.refresh();
        },
      };
    },
  },
});
</script>

<style lang="scss" scoped></style>
