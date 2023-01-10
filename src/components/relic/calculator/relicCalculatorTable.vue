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
    <table
      :id="plannerData.id"
      :ref="storageKey"
      class="table table-bordered table-dark table-sm table-striped mb-0 swgoh-table collapse"
    >
      <thead class="text-center sticky-header align-middle show-on-mobile">
        <tr class="sort-methods">
          <th class="show-on-mobile">
            <SortMethods
              :sortByOptions="sortByOptions"
              :sortMethod="sortMethod"
              :sortDir="sortDir"
              @methodChange="sortMethod = $event"
              @directionChange="sortDir = $event"
            />
          </th>
        </tr>
        <ColumnHeaders :headers="headers" />
      </thead>
      <tbody class="align-middle text-center">
        <tr v-for="(row, index) in plannerData.challengeGear" :key="index">
          <td v-if="showCol('name')">
            <GearIcon v-for="id in row.ids" :key="id" :gearId="id" showName />
          </td>
          <td v-if="showCol('locations')">
            <span class="row-label">Location(s):</span>
            {{ locationLabel(row.location) }}
          </td>
          <td v-if="showCol('amount')">
            <span class="row-label">Amount per Day:</span>
            {{ row.gearPerDay }}
          </td>
          <td v-if="showCol('energy')">
            <span class="row-label">Energy per Day:</span>
            -
          </td>
          <td v-if="showCol('farmed')">
            <span class="row-label">Total Gear Farmed:</span>
            <input
              v-model.number="row.totalGear"
              class="form-control form-control-sm"
              type="number"
            />
          </td>
          <td v-if="showCol('relicDaily')">
            <span class="row-label">Relic Mats per Day:</span>
            {{ row.relicPiecesPerDay }}
          </td>
          <td v-if="showCol('relicTotal')">
            <span class="row-label">Relic Mats Total:</span>
            {{ row.relicPiecesTotal }}
          </td>
        </tr>
        <tr v-for="(row, index) in plannerData.storeGear" :key="index">
          <td v-if="showCol('name')">
            <GearIcon v-for="id in row.ids" :key="id" :gearId="id" showName />
          </td>
          <td v-if="showCol('locations')">
            <span class="row-label">Location(s):</span>
            {{ locationLabel(row.location) }}
          </td>
          <td v-if="showCol('amount')">
            <span class="row-label">Amount per Day:</span>
            <input
              v-model.number="row.purchases"
              class="form-control form-control-sm"
              type="number"
            />
          </td>
          <td v-if="showCol('energy')">
            <span class="row-label">Energy per Day:</span>
            {{ row.totalCurrency }}
          </td>
          <td v-if="showCol('farmed')">
            <span class="row-label">Total Gear Farmed:</span>
            {{ row.totalGear }}
          </td>
          <td v-if="showCol('relicDaily')">
            <span class="row-label">Relic Mats per Day:</span>
            {{ row.relicPiecesPerDay }}
          </td>
          <td v-if="showCol('relicTotal')">
            <span class="row-label">Relic Mats Total:</span>
            {{ row.relicPiecesTotal }}
          </td>
        </tr>
        <tr>
          <td v-if="showCol('name')">
            <GearIcon
              v-for="id in plannerData.farmingNodeData.ids"
              :key="id"
              :gearId="id"
              showName
            />
          </td>
          <td v-if="showCol('locations')">
            <span class="row-label">Location(s):</span>
            {{ locationLabel(plannerData.farmingNodeData.location) }}
          </td>
          <td v-if="showCol('amount')">
            <span class="row-label">Amount per Day:</span>
            {{ plannerData.remainingGearPerDay }}
          </td>
          <td v-if="showCol('energy')">
            <span class="row-label">Energy per Day:</span>
            {{ plannerData.totalEnergy }}
          </td>
          <td v-if="showCol('farmed')">
            <span class="row-label">Total Gear Farmed:</span>
            {{ plannerData.remainingGear }}
          </td>
          <td v-if="showCol('relicDaily')">
            <span class="row-label">Relic Mats per Day:</span>
            {{ plannerData.relicPiecesPerDay }}
          </td>
          <td v-if="showCol('relicTotal')">
            <span class="row-label">Relic Mats Total:</span>
            {{ plannerData.remainingRelicPieces }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapGetters } from "vuex";

import GearIcon from "components/gear/gearIcon.vue";
import { FarmingNode } from "types/shards";
import { RelicPlanner } from "types/relicPlanner";
import { setupEvents, setupSorting } from "utils";
import { iHeader } from "types/general";

const storageKey = "relicCalculatorTable";

export default defineComponent({
  name: "RelicCalculatorTable",
  setup(props) {
    const { sortDir, sortMethod, searchText, sortBy, sortIcon } = setupSorting(
      `${storageKey}-${props.plannerData.id}`
    );

    return {
      sortDir,
      sortMethod,
      searchText,
      sortBy,
      sortIcon,
    };
  },
  components: { GearIcon },
  props: {
    plannerData: {
      type: Object as () => RelicPlanner,
      required: true,
    },
  },
  data() {
    return {
      selectedColumns: [],
      sortByOptions: [
        {
          value: "name",
          label: "Name",
        },
        {
          value: "locations",
          label: "Locations",
        },
        {
          value: "amount",
          label: "Amount per Day",
        },
        {
          value: "energy",
          label: "Energy per Day",
        },
        {
          value: "farmed",
          label: "Total Gear Farmed",
        },
        {
          value: "relicDaily",
          label: "Relic Mats per Day",
        },
        {
          value: "relicTotal",
          label: "Relic Mats Total",
        },
      ],
    };
  },
  computed: {
    ...mapState("gear", ["gearList"]),
    ...mapState("player", ["player"]),
    ...mapState("shards", ["shardFarming"]),
    ...mapGetters("planner", ["fullUnitList"]),
    headers(): iHeader[] {
      return [
        {
          label: "Gear",
          show: this.showCol("name"),
          icon: this.sortIcon("name"),
          maxWidth: "300px",
          click: () => {
            this.sortBy("name");
          },
        },
        {
          label: "Locations",
          show: this.showCol("locations"),
          icon: this.sortIcon("locations"),
          maxWidth: "300px",
          click: () => {
            this.sortBy("locations");
          },
        },
        {
          label: "Amount per Day",
          show: this.showCol("amount"),
          icon: this.sortIcon("amount"),
          maxWidth: "100px",
          click: () => {
            this.sortBy("amount");
          },
        },
        {
          label: "Energy per Day",
          show: this.showCol("energy"),
          icon: this.sortIcon("energy"),
          maxWidth: "100px",
          click: () => {
            this.sortBy("energy");
          },
        },
        {
          label: "Total Gear Farmed",
          show: this.showCol("farmed"),
          icon: this.sortIcon("farmed"),
          maxWidth: "100px",
          click: () => {
            this.sortBy("farmed");
          },
        },
        {
          label: "Relic Mats per Day",
          show: this.showCol("relicDaily"),
          icon: this.sortIcon("relicDaily"),
          maxWidth: "100px",
          click: () => {
            this.sortBy("relicDaily");
          },
        },
        {
          label: "Relic Mats Total",
          show: this.showCol("relicTotal"),
          icon: this.sortIcon("relicTotal"),
          maxWidth: "100px",
          click: () => {
            this.sortBy("relicTotal");
          },
        },
      ];
    },
    cols(): { text: string; value: any }[] {
      const list = [
        {
          text: "Gear",
          value: "name",
        },
        {
          text: "Locations",
          value: "locations",
        },
        {
          text: "Amount per Day",
          value: "amount",
        },
        {
          text: "Energy per Day",
          value: "energy",
        },
        {
          text: "Total Gear Farmed",
          value: "farmed",
        },
        {
          text: "Relic Mats per Day",
          value: "relicDaily",
        },
        {
          text: "Relic Mats Total",
          value: "relicTotal",
        },
      ];
      return list;
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
