<template>
  <ExpandableSection
    v-if="unitList.length > 0"
    :title="label"
    :idRef="refName"
    :options="expandOptions"
  >
    <TerritoryBattleShardTable
      v-if="type === 'TB'"
      :ref="refName"
      :units="unitList"
      :selectedColumns="selectedColumns"
      showUnitName
      :simpleView="simpleView"
      :storageKey="refName"
    />
    <StoreTable
      v-else-if="type === 'store'"
      :ref="refName"
      :units="unitList"
      :selectedColumns="selectedColumns"
      showUnitName
      :simpleView="simpleView"
      :currencyTypes="currencyTypes"
      :nodeTableNames="nodeTableNames"
      :storageKey="refName"
    />
    <LegendarySummaryTable
      v-else-if="type === 'legendary' || type === 'gl'"
      :unitList="unitList"
      :storageKey="refName"
    />
    <ShardTable
      v-else
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
import { mapGetters, mapState } from "vuex";

import { setupSimpleView } from "utils";
import { Unit } from "types/unit";
import ShardTable from "./shardTable.vue";
import { iExpandOptions } from "types/general";
import TerritoryBattleShardTable from "./territoryBattleShardTable.vue";
import StoreTable from "./storeTable.vue";
import { CurrencyTypeConfig } from "types/currency";
import LegendarySummaryTable from "./legendary/legendarySummaryTable.vue";

interface dataModel {
  selectedColumns: string[];
}

export default defineComponent({
  name: "NodesTable",
  components: {
    ShardTable,
    TerritoryBattleShardTable,
    StoreTable,
    LegendarySummaryTable,
  },
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
      default: () => {
        return [];
      },
    },
    idRef: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: null,
    },
    currencyTypes: {
      type: Array as () => CurrencyTypeConfig[],
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      selectedColumns: [],
    } as dataModel;
  },
  computed: {
    ...mapGetters("shards", ["unitFarmingList"]),
    ...mapState("shards", ["shardFarming"]),
    ...mapState("player", ["player"]),
    unitList(): Unit[] {
      return this.unitFarmingList.filter((unit: Unit) => {
        return unit.whereToFarm.some((node) =>
          this.nodeTableNames.includes(node.table)
        );
      });
    },
    expandOptions(): iExpandOptions {
      const cols = [
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
          showOption: this.type === "standard",
        },
        {
          label: "Currency Owned",
          value: "wallet",
          showOption: this.type === "store",
        },
        {
          label: "Daily Currency Obtained",
          value: "dailyCurrency",
          showOption: this.type === "store",
        },
        {
          label: "Remaining Currency",
          value: "remainingCurrency",
          showOption: this.type === "store",
        },
        {
          label: "Remaining Currency",
          value: "remainingCurrency",
          showOption: this.type === "store",
        },
        {
          label: "Estimated Time",
          value: "estimatedTime",
        },
        {
          label: "Priority",
          value: "priority",
          showOption:
            this.type === "standard" ||
            this.type === "store" ||
            this.type === "raid",
        },
      ];

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
          options: cols,
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
