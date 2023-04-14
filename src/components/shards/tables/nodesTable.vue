<template>
  <ExpandableSection
    v-if="unitList.length > 0"
    :title="label"
    :idRef="refName"
    :options="expandOptions"
  >
    <ShardTable
      :ref="refName"
      :units="unitList"
      :nodeTableNames="nodeTableNames"
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

interface dataModel {
  selectedColumns: string[];
}

export default defineComponent({
  name: "NodesTable",
  components: { ShardTable },
  setup(props) {
    const { simpleView } = setupSimpleView(props.idRef);
    return { simpleView, refName: props.idRef + "Table" };
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    nodeTableNames: {
      type: Array as () => string[],
      required: true,
    },
    idRef: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      selectedColumns: [],
    } as dataModel;
  },
  computed: {
    ...mapGetters("shards", ["unitFarmingList"]),
    unitList(): Unit[] {
      return this.unitFarmingList.filter((unit: Unit) => {
        return unit.whereToFarm.some((node) =>
          this.nodeTableNames.includes(node.table)
        );
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
          options: [
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
          ],
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
