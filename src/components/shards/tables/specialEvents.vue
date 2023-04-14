<template>
  <ExpandableSection
    v-if="unitList.length > 0"
    title="Special Events"
    :idRef="refName"
    :options="expandOptions"
  >
    <ShardTable
      :ref="refName"
      :units="unitList"
      :nodeTableNames="tableNames"
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
import { iExpandOptions } from "types/general";

const storageKey = "specialEvents";
interface dataModel {
  selectedColumns: string[];
  refName: string;
  tableNames: string[];
  loading: boolean;
}

export default defineComponent({
  name: "specialEventsTable",
  setup() {
    const { simpleView } = setupSimpleView(storageKey);
    return { simpleView };
  },
  components: { ShardTable },
  data() {
    return {
      selectedColumns: [],
      loading: true,
      refName: storageKey + "Table",
      tableNames: [
        "Proving Grounds",
        "Galactic Bounties I",
        "Galactic Bounties II",
        "Assault Battles",
      ],
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
          label: "Estimated Time",
          value: "time",
        },
      ];
      return list;
    },
    unitList(): Unit[] {
      return this.unitFarmingList.filter((unit: Unit) => {
        return unit.whereToFarm.some((node) => {
          return this.tableNames.includes(node.table);
        });
      });
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
