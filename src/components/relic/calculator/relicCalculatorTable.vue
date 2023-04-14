<template>
  <ExpandableSection
    :title="plannerData.label"
    :idRef="plannerData.id"
    :options="expandOptions"
  >
    <SwgohTable :table="{ header, body }" />
  </ExpandableSection>
</template>

<script lang="ts">
import { Ref, defineComponent, ref } from "vue";
import { mapState, mapGetters } from "vuex";

import { FarmingNode } from "types/shards";
import { RelicPlanner } from "types/relicPlanner";
import { setupColumnEvents, setupSorting } from "utils";
import {
  iExpandOptions,
  iHeaderCell,
  iHeaderRow,
  iTableBody,
  iTableHead,
  iTableRow,
} from "types/general";

const storageKey = "relicCalculatorTable";

export default defineComponent({
  name: "RelicCalculatorTable",
  setup(props) {
    const { sortDir, sortMethod, sortBy, sortIcon } = setupSorting(
      `${storageKey}-${props.plannerData.id}`
    );

    const selectedColumns: Ref<string[]> = ref([]);
    const { showCol } = setupColumnEvents(selectedColumns);

    return {
      sortDir,
      sortMethod,
      sortBy,
      sortIcon,
      selectedColumns,
      showCol,
    };
  },
  props: {
    plannerData: {
      type: Object as () => RelicPlanner,
      required: true,
    },
    zIndex: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {} as any;
  },
  computed: {
    ...mapState("gear", ["gearList"]),
    ...mapState("player", ["player"]),
    ...mapState("shards", ["shardFarming"]),
    ...mapGetters("planner", ["fullUnitList"]),
    header(): iTableHead {
      return {
        classes: "sticky-header show-on-mobile",
        sortMethod: this.sortMethod,
        sortDir: this.sortDir,
        methodChange: (val: string) => {
          this.sortMethod = val;
        },
        directionChange: (val: "asc" | "desc") => {
          this.sortDir = val;
        },
        headers: [
          {
            cells: [
              {
                label: "Gear",
                value: "name",
                show: this.showCol("name"),
                sortMethodShow: true,
                icon: this.sortIcon("name"),
                maxWidth: "300px",
                click: () => {
                  this.sortBy("name");
                },
              },
              {
                label: "Locations",
                value: "locations",
                show: this.showCol("locations"),
                sortMethodShow: true,
                icon: this.sortIcon("locations"),
                maxWidth: "300px",
                click: () => {
                  this.sortBy("locations");
                },
              },
              {
                label: "Amount per Day",
                value: "amount",
                show: this.showCol("amount"),
                sortMethodShow: true,
                icon: this.sortIcon("amount"),
                maxWidth: "100px",
                click: () => {
                  this.sortBy("amount");
                },
              },
              {
                label: "Energy per Day",
                value: "energy",
                show: this.showCol("energy"),
                sortMethodShow: true,
                icon: this.sortIcon("energy"),
                maxWidth: "100px",
                click: () => {
                  this.sortBy("energy");
                },
              },
              {
                label: "Total Gear Farmed",
                value: "farmed",
                show: this.showCol("farmed"),
                sortMethodShow: true,
                icon: this.sortIcon("farmed"),
                maxWidth: "100px",
                click: () => {
                  this.sortBy("farmed");
                },
              },
              {
                label: "Relic Mats per Day",
                value: "relicDaily",
                show: this.showCol("relicDaily"),
                sortMethodShow: true,
                icon: this.sortIcon("relicDaily"),
                maxWidth: "100px",
                click: () => {
                  this.sortBy("relicDaily");
                },
              },
              {
                label: "Relic Mats Total",
                value: "relicTotal",
                show: this.showCol("relicTotal"),
                sortMethodShow: true,
                icon: this.sortIcon("relicTotal"),
                maxWidth: "100px",
                click: () => {
                  this.sortBy("relicTotal");
                },
              },
            ],
          },
        ],
      };
    },
    body(): iTableBody {
      const challengeGearRows: iTableRow[] = this.plannerData.challengeGear.map(
        (gear: any) => {
          return {
            cells: [
              {
                show: this.showCol("name"),
                type: "gearList",
                data: {
                  ids: gear.ids,
                  showName: true,
                },
              },
              {
                show: this.showCol("locations"),
                label: "Location(s):",
                data: this.locationLabel(gear.location),
              },
              {
                show: this.showCol("amount"),
                label: "Amount per Day:",
                data: gear.gearPerDay,
              },
              {
                show: this.showCol("energy"),
                label: "Energy per Day:",
                data: "-",
              },
              {
                show: this.showCol("farmed"),
                label: "Total Gear Farmed:",
                type: "number",
                data: {
                  value: gear.totalGear,
                },
                change: (val: number) => {
                  gear.totalGear = val;
                },
              },
              {
                show: this.showCol("relicDaily"),
                label: "Relic Mats per Day:",
                data: gear.relicPiecesPerDay,
              },
              {
                show: this.showCol("relicTotal"),
                label: "Relic Mats Total:",
                data: gear.relicPiecesTotal,
              },
            ],
          };
        }
      );
      const storeGearRows: iTableRow[] = this.plannerData.storeGear.map(
        (gear: any) => {
          return {
            cells: [
              {
                show: this.showCol("name"),
                type: "gearList",
                data: {
                  ids: gear.ids,
                  showName: true,
                },
              },
              {
                show: this.showCol("locations"),
                label: "Location(s):",
                data: this.locationLabel(gear.location),
              },
              {
                show: this.showCol("amount"),
                label: "Amount per Day:",
                type: "number",
                data: {
                  value: gear.purchases,
                },
                change: (val: number) => {
                  gear.purchases = val;
                },
              },
              {
                show: this.showCol("energy"),
                label: "Energy per Day:",
                data: gear.totalCurrency,
              },
              {
                show: this.showCol("farmed"),
                label: "Total Gear Farmed:",
                data: gear.totalGear,
              },
              {
                show: this.showCol("relicDaily"),
                label: "Relic Mats per Day:",
                data: gear.relicPiecesPerDay,
              },
              {
                show: this.showCol("relicTotal"),
                label: "Relic Mats Total:",
                data: gear.relicPiecesTotal,
              },
            ],
          };
        }
      );

      return {
        classes: "align-middle text-center",
        rows: [
          ...challengeGearRows,
          ...storeGearRows,
          {
            cells: [
              {
                show: this.showCol("name"),
                type: "gearList",
                data: {
                  ids: this.plannerData.farmingNodeData.ids,
                  showName: true,
                },
              },
              {
                show: this.showCol("locations"),
                label: "Location(s):",
                data: this.locationLabel(
                  this.plannerData.farmingNodeData.location
                ),
              },
              {
                show: this.showCol("amount"),
                label: "Amount per Day:",
                data: this.plannerData.remainingGearPerDay,
              },
              {
                show: this.showCol("energy"),
                label: "Energy per Day:",
                data: this.plannerData.totalEnergy,
              },
              {
                show: this.showCol("farmed"),
                label: "Total Gear Farmed:",
                data: this.plannerData.remainingGear,
              },
              {
                show: this.showCol("relicDaily"),
                label: "Relic Mats per Day:",
                data: this.plannerData.relicPiecesPerDay,
              },
              {
                show: this.showCol("relicTotal"),
                label: "Relic Mats Total:",
                data: this.plannerData.remainingRelicPieces,
              },
            ],
          },
        ],
      };
    },
    cols(): { label: string; value: string }[] {
      return this.header.headers.reduce(
        (acc: { label: string; value: string }[], row: iHeaderRow) => {
          row.cells.forEach((cell: iHeaderCell) =>
            acc.push({ label: cell.label, value: cell.value })
          );
          return acc;
        },
        []
      );
    },
    storageKey() {
      return `${storageKey}-${this.plannerData.id}`;
    },
    expandOptions(): iExpandOptions {
      return {
        multiSelect: {
          options: this.cols,
          change: (newVal: string[]) => {
            this.selectedColumns = newVal;
          },
        },
        zIndex: this.zIndex,
      };
    },
  },
  methods: {
    locationLabel(locationId: string) {
      const match: FarmingNode | undefined = this.shardFarming.find(
        (x: FarmingNode) => x.id === locationId
      );
      return match ? match.label : locationId;
    },
  },
});
</script>

<style lang="scss" scoped>
.sticky-header {
  top: 106px;
}
</style>
