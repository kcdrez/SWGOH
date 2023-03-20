<template>
  <div>
    <div class="collapse-header section-header extended-1">
      <h3>
        <div data-bs-toggle="collapse" :href="`#${plannerData.id}`">
          {{ plannerData.label }}
        </div>
      </h3>
      <MultiSelect
        class="select-columns"
        :options="cols"
        :storageKey="storageKey + 'Columns'"
        @checked="selectedColumns = $event"
      />
    </div>
    <div :ref="storageKey" class="collapse">
      <SwgohTable :table="{ header, body }" :id="plannerData.id" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapGetters } from "vuex";

import { FarmingNode } from "types/shards";
import { RelicPlanner } from "types/relicPlanner";
import { setupEvents, setupSorting } from "utils";
import { iHeaderCell, iTableBody, iTableHead, iTableRow } from "types/general";

const storageKey = "relicCalculatorTable";

export default defineComponent({
  name: "RelicCalculatorTable",
  setup(props) {
    const { sortDir, sortMethod, sortBy, sortIcon } = setupSorting(
      `${storageKey}-${props.plannerData.id}`
    );

    return {
      sortDir,
      sortMethod,
      sortBy,
      sortIcon,
    };
  },
  props: {
    plannerData: {
      type: Object as () => RelicPlanner,
      required: true,
    },
  },
  data() {
    return {
      selectedColumns: [],
    };
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
        (gear) => {
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
        (gear) => {
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
    cols(): iHeaderCell[] {
      return this.header.headers.reduce((acc: iHeaderCell[], row) => {
        row.cells.forEach((cell) => acc.push(cell));
        return acc;
      }, []);
    },
    storageKey() {
      return `${storageKey}-${this.plannerData.id}`;
    },
  },
  methods: {
    locationLabel(locationId: string) {
      const match: FarmingNode | undefined = this.shardFarming.find(
        (x: FarmingNode) => x.id === locationId
      );
      return match ? match.label : locationId;
    },
    showCol(key: string): boolean {
      return this.selectedColumns.some((x) => x === key);
    },
  },
  mounted() {
    setupEvents(this.$refs[this.storageKey] as HTMLElement, this.storageKey);
  },
});
</script>

<style lang="scss" scoped>
.sticky-header {
  top: 106px;
}
</style>
