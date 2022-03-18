<template>
  <div v-if="prerequisites">
    <div class="mb-2 d-flex justify-content-center">
      <h5 class="text-center mb-0">Total Progress:</h5>
      <div class="total-progress-bar">
        <ProgressBar :percent="totalProgress('requirement')" />
      </div>
    </div>
    <table
      class="table table-bordered table-dark table-sm table-striped swgoh-table"
    >
      <thead class="sticky-header show-on-mobile">
        <!-- <tr class="sort-methods" v-if="showUnitName">
          <th class="show-on-mobile">
            <div class="input-group input-group-sm my-2">
              <span class="input-group-text">Sort By:</span>
              <select
                class="form-control"
                @change="sortMethod = $event.target.value"
              >
                <option value="name" v-if="showUnitName">Name</option>
                <option value="location">Location</option>
                <option value="progress">Progress</option>
                <option value="time">Time Remaining</option>
              </select>
            </div>
            <div class="input-group input-group-sm my-2">
              <span class="input-group-text">Sort Direction:</span>
              <select
                class="form-control"
                @change="sortDir = $event.target.value"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
            <div class="input-group input-group-sm my-2">
              <span class="input-group-text">Search:</span>
              <input
                class="form-control"
                v-model="searchText"
                placeholder="Search by name"
              />
            </div>
          </th>
        </tr> -->
        <tr class="text-center align-middle">
          <th v-if="showCol('name')" width="750px">
            <div class="c-pointer" @click="sortBy('name')">
              <span>Unit Name</span>
              <i class="fas mx-2" :class="sortIcon('name')"></i>
            </div>
            <input
              class="form-control form-control-sm mx-auto my-1 w-75"
              placeholder="Search"
              v-model="searchText"
            />
          </th>
          <th v-if="showCol('current')">Current Level</th>
          <th v-if="showCol('requirements')">Requirements</th>
          <th v-if="showCol('recommended') && showRecommended">Recommended</th>
          <th v-if="showCol('progress')">Progress</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in prerequisites" :key="index">
          <td class="text-center align-middle" v-if="showCol('name')">
            <UnitIcon
              v-if="item.id"
              :unit="getUnit(item.id)"
              isLink
              :hideImage="simpleView"
            />
            <template v-else-if="item.tags">
              <div>You need {{ item.count }} of the following units:</div>
              <div class="unit-list-tags">
                <UnitIcon
                  class="unit-icon"
                  v-for="unit in getUnitsByTag(item.tags)"
                  :key="unit.id"
                  :unit="unit"
                  isLink
                  :hideImage="simpleView"
                />
              </div>
            </template>
          </td>
          <td class="text-center align-middle" v-if="showCol('current')">
            <RequirementIcon
              class="justify-content-center"
              :type="item.requirement.type"
              :unitId="item.id"
              currentLevel
            />
          </td>
          <td class="text-center align-middle" v-if="showCol('requirements')">
            <RequirementIcon
              class="justify-content-center"
              :value="item.requirement.value"
              :type="item.requirement.type"
              :unitId="item.id"
            />
          </td>
          <td
            class="text-center align-middle"
            v-if="showCol('recommended') && showRecommended"
          >
            <div class="percent-container" v-if="getRecommended(item)">
              <span>{{ getRecommended(item) }}</span>
              <ProgressBar :percent="getPercent(item, 'recommended')" />
            </div>
            <div v-else>-</div>
          </td>
          <td class="text-center align-middle" v-if="showCol('progress')">
            <ProgressBar :percent="getPercent(item, 'requirement')" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapGetters } from "vuex";

import RelicLevelIcon from "../../units/relicLevelIcon.vue";
import UnitIcon from "../../units/unitIcon.vue";
import GearText from "../../gear/gearText.vue";
import RequirementIcon from "./legendary/requirementIcon.vue";
import {
  Unit,
  getPercent,
  getUnitsByTag,
  getUnit,
  totalProgress,
} from "../../../types/unit";
import { FarmingNode, shardMapping } from "../../../types/shards";
import { maxGearLevel } from "../../../types/gear";
import { round2Decimals } from "../../../utils";

export default defineComponent({
  name: "LegendaryRequirementsTable",
  components: { UnitIcon, RelicLevelIcon, GearText, RequirementIcon },
  props: {
    unit: {
      type: Object as () => Unit,
      required: true,
    },
    selectedColumns: {
      type: Array,
      validator: (arr: any[]) => {
        return arr.every((x) => {
          return typeof x === "string";
        });
      },
      required: true,
    },
    simpleView: {
      type: Boolean,
      default: false,
    },
    storageKey: {
      type: String,
      required: true,
    },
    nodeKey: {
      type: String,
      default: "legendary",
    },
  },
  data() {
    return {
      sortDir: "desc",
      sortMethod: "name",
      searchText: "",
    };
  },
  computed: {
    ...mapState("shards", ["shardFarming"]),
    ...mapState("player", ["player"]),
    ...mapGetters("player", ["unitData"]),
    ...mapState("unit", ["unitList"]),
    prerequisites() {
      const legendaryUnits: FarmingNode = this.shardFarming.find(
        (x: FarmingNode) => x.id === this.nodeKey
      );
      return (
        legendaryUnits?.characters.find((x) => x.id === this.unit.id)
          ?.prerequisites ?? []
      );
    },
    cols(): { text: string; value: any }[] {
      const list = [
        {
          text: "Name",
          value: "name",
        },
      ];
      return list;
    },
    showRecommended(): boolean {
      return this.nodeKey === "legendary";
    },
  },
  methods: {
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
    showCol(key: string): boolean {
      return this.selectedColumns.some((x) => x === key);
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
    getRecommended(item: any): string {
      if (item.recommended) {
        return `${item.recommended.type}: ${item.recommended.value}`;
      } else {
        return "";
      }
    },
    getPercent,
    getUnitsByTag,
    getUnit,
    totalProgress(prerequisiteType: "requirement" | "recommended") {
      return totalProgress(this.prerequisites, prerequisiteType);
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
.unit-list-tags {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  .unit-icon {
    margin: 0.25rem;
    flex-basis: 25%; //will be 3 per row due to margin
  }
}
.percent-container {
  display: grid;
  grid-template-columns: 2fr 5fr;
  align-items: center;
}
.total-progress-bar {
  flex-basis: 25%;
  margin: 0 0.5rem;
}
</style>
