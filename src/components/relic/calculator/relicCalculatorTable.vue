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
      class="
        table table-bordered table-dark table-sm table-striped
        mb-0
        swgoh-table
        collapse
      "
    >
      <thead class="text-center sticky-header align-middle">
        <tr>
          <th
            width="300px"
            v-if="showCol('name')"
            @click="sortBy('name')"
            class="c-pointer"
          >
            Gear
            <i class="fas mx-1" :class="sortIcon('name')"></i>
          </th>
          <th
            width="300px"
            v-if="showCol('locations')"
            @click="sortBy('locations')"
            class="c-pointer"
          >
            Locations
            <i class="fas mx-1" :class="sortIcon('locations')"></i>
          </th>
          <th
            width="100px"
            v-if="showCol('amount')"
            @click="sortBy('amount')"
            class="c-pointer"
          >
            Amount per Day
            <i class="fas mx-1" :class="sortIcon('amount')"></i>
          </th>
          <th
            width="100px"
            v-if="showCol('energy')"
            @click="sortBy('energy')"
            class="c-pointer"
          >
            Energy per Day
            <i class="fas mx-1" :class="sortIcon('energy')"></i>
          </th>
          <th
            width="100px"
            v-if="showCol('farmed')"
            @click="sortBy('farmed')"
            class="c-pointer"
          >
            Total Gear Farmed
            <i class="fas mx-1" :class="sortIcon('farmed')"></i>
          </th>
          <th
            width="100px"
            v-if="showCol('relicDaily')"
            @click="sortBy('relicDaily')"
            class="c-pointer"
          >
            Relic Mats per Day
            <i class="fas mx-1" :class="sortIcon('relicDaily')"></i>
          </th>
          <th
            width="100px"
            v-if="showCol('relicTotal')"
            @click="sortBy('relicTotal')"
            class="c-pointer"
          >
            Relic Mats Total
            <i class="fas mx-1" :class="sortIcon('relicTotal')"></i>
          </th>
        </tr>
      </thead>
      <tbody class="align-middle text-center">
        <tr v-for="row in plannerData.challengeGear" :key="row.id">
          <td v-if="showCol('name')">
            <GearIcon v-for="id in row.ids" :key="id" :gearId="id" showName />
          </td>
          <td v-if="showCol('locations')">{{ locationLabel(row.location) }}</td>
          <td v-if="showCol('amount')">
            {{ row.gearPerDay }}
          </td>
          <td v-if="showCol('energy')">-</td>
          <td v-if="showCol('farmed')">
            <input
              v-model.number="row.totalGear"
              class="form-control form-control-sm"
              type="number"
            />
          </td>
          <td v-if="showCol('relicDaily')">
            {{ row.relicPiecesPerDay }}
          </td>
          <td v-if="showCol('relicTotal')">
            {{ row.relicPiecesTotal }}
          </td>
        </tr>
        <tr v-for="row in plannerData.storeGear" :key="row.id">
          <td v-if="showCol('name')">
            <GearIcon v-for="id in row.ids" :key="id" :gearId="id" showName />
          </td>
          <td v-if="showCol('locations')">{{ locationLabel(row.location) }}</td>
          <td v-if="showCol('amount')">
            <input
              v-model.number="row.purchases"
              class="form-control form-control-sm"
              type="number"
            />
          </td>
          <td v-if="showCol('energy')">
            {{ row.totalCurrency }}
          </td>
          <td v-if="showCol('farmed')">
            {{ row.totalGear }}
          </td>
          <td v-if="showCol('relicDaily')">
            {{ row.relicPiecesPerDay }}
          </td>
          <td v-if="showCol('relicTotal')">
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
            {{ locationLabel(plannerData.farmingNodeData.location) }}
          </td>
          <td v-if="showCol('amount')">
            {{ plannerData.remainingGearPerDay }}
          </td>
          <td v-if="showCol('energy')">
            {{ plannerData.totalEnergy }}
          </td>
          <td v-if="showCol('farmed')">
            {{ plannerData.remainingGear }}
          </td>
          <td v-if="showCol('relicDaily')">
            {{ plannerData.relicPiecesPerDay }}
          </td>
          <td v-if="showCol('relicTotal')">
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

import GearIcon from "../../gear/gearIcon.vue";
import { FarmingNode } from "../../../types/shards";
import { setupEvents } from "../../../utils";
import { RelicPlanner } from "../../../types/relicPlanner";

const storageKey = "relicCalculatorTable";

export default defineComponent({
  name: "RelicCalculatorTable",
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
      sortDir: "desc",
      sortMethod: "priority",
    };
  },
  computed: {
    ...mapState("gear", ["gearList"]),
    ...mapState("player", ["player"]),
    ...mapState("shards", ["shardFarming"]),
    ...mapGetters("planner", ["fullUnitList"]),

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
  watch: {
    sortDir() {
      this.saveSortData();
    },
    sortMethod() {
      this.saveSortData();
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
    sortBy(type: string): void {
      if (this.sortMethod === type) {
        this.sortDir = this.sortDir === "asc" ? "desc" : "asc";
      } else {
        this.sortDir = "asc";
      }
      this.sortMethod = type;
    },
    sortIcon(type: string): string {
      if (this.sortMethod === type) {
        return this.sortDir === "asc" ? "fa-sort-down" : "fa-sort-up";
      } else {
        return "fa-sort";
      }
    },
    saveSortData() {
      window.localStorage.setItem(
        this.storageKey,
        JSON.stringify({
          sortDir: this.sortDir,
          sortMethod: this.sortMethod,
        })
      );
    },
  },
  mounted() {
    setupEvents(this.$refs[this.storageKey] as HTMLElement, this.storageKey);
  },
  created() {
    const storageData = JSON.parse(
      window.localStorage.getItem(this.storageKey) || "{}"
    );
    this.sortDir = storageData.sortDir ?? "asc";
    this.sortMethod = storageData.sortMethod ?? "name";
  },
});
</script>

<style lang="scss" scoped>
.sticky-header {
  top: 106px;
}
</style>