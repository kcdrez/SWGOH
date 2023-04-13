<template>
  <ExpandableSection
    v-if="unitList.length > 0"
    title="Light & Dark Side Battles"
    :idRef="refName"
    :options="expandOptions"
  >
    <ShardTable
      :ref="refName"
      :units="unitList"
      :nodeTableNames="['Light Side', 'Dark Side']"
      :selectedColumns="selectedColumns"
      showUnitName
      showPriority
      :simpleView="simpleView"
      :storageKey="refName"
    />
  </ExpandableSection>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

import { setupSimpleView } from "utils";
import { Unit } from "types/unit";
import ShardTable from "./shardTable.vue";

const storageKey = "standardNodes";

interface dataModel {
  selectedColumns: string[];
  refName: string;
}

export default defineComponent({
  name: "StandardNodesTable",
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
          label: "Attempts",
          value: "attempts",
        },
        {
          label: "Estimated Time",
          value: "time",
        },
        {
          label: "Priority",
          value: "priority",
        },
      ];
      return list;
    },
    unitList(): Unit[] {
      return this.unitFarmingList.filter((unit: Unit) => {
        return unit.whereToFarm.some(
          (node) => node.table === "Light Side" || node.table === "Dark Side"
        );
      });
    },
    expandOptions(): any {
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
