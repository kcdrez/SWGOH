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
          <th
            v-if="showCol('current')"
            @click="sortBy('current')"
            class="c-pointer"
          >
            <span>Current Level</span>
            <i class="fas mx-2" :class="sortIcon('current')"></i>
          </th>
          <th
            v-if="showCol('requirements')"
            @click="sortBy('requirements')"
            class="c-pointer"
          >
            <span>Requirements</span>
            <i class="fas mx-2" :class="sortIcon('requirements')"></i>
          </th>
          <th
            v-if="showCol('recommended') && showRecommended"
            @click="sortBy('recommended')"
            class="c-pointer"
          >
            <span>Recommended</span>
            <i class="fas mx-2" :class="sortIcon('recommended')"></i>
          </th>
          <th
            v-if="showCol('progress')"
            @click="sortBy('progress')"
            class="c-pointer"
          >
            <span>Progress</span>
            <i class="fas mx-2" :class="sortIcon('progress')"></i>
          </th>
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
import _ from "lodash";

import RelicLevelIcon from "../../../units/relicLevelIcon.vue";
import UnitIcon from "../../../units/unitIcon.vue";
import GearText from "../../../gear/gearText.vue";
import RequirementIcon from "./requirementIcon.vue";
import {
  Unit,
  getPercent,
  getUnitsByTag,
  getUnit,
  totalProgress,
} from "../../../../types/unit";
import { displayValue, FarmingNode } from "../../../../types/shards";
import {
  isGearRequirement,
  isRelicRequirement,
} from "../../../../types/shards";

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
      _searchText: "",
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
      const prereqs =
        legendaryUnits?.characters.find((x) => x.id === this.unit.id)
          ?.prerequisites ?? [];
      return prereqs
        .filter((p) => {
          const unit: Unit | undefined = getUnit(p?.id || "");
          if (unit) {
            const name = unit.name.toLowerCase().replace(/\s/g, "");
            const compare = this._searchText.toLowerCase().replace(/\s/g, "");
            return name.includes(compare);
          } else {
            return false;
          }
        })
        .sort((a, b) => {
          const unitA: Unit | undefined = getUnit(a?.id ?? "");
          const unitB: Unit | undefined = getUnit(b?.id ?? "");
          if (unitA && unitB) {
            if (this.sortMethod === "name") {
              const compareA = unitA.name.toLowerCase();
              const compareB = unitB.name.toLowerCase();
              if (this.sortDir === "asc") {
                return compareA > compareB ? 1 : -1;
              } else {
                return compareA > compareB ? -1 : 1;
              }
            } else if (this.sortMethod === "current") {
              const isRelicA = isRelicRequirement(
                a.requirement?.type || "",
                null,
                unitA.relicLevel
              );
              const isRelicB = isRelicRequirement(
                b.requirement?.type || "",
                null,
                unitB.relicLevel
              );
              const isGearA = isGearRequirement(
                a.requirement?.type || "",
                null,
                unitA.relicLevel
              );
              const isGearB = isGearRequirement(
                b.requirement?.type || "",
                null,
                unitB.relicLevel
              );
              const isStarsA = a.requirement?.type === "Stars";
              const isStarsB = b.requirement?.type === "Stars";
              const isPowerA = a.requirement?.type === "Power";
              const isPowerB = b.requirement?.type === "Power";
              const valueA = displayValue(
                a.requirement?.type || "",
                null,
                unitA.relicLevel,
                unitA.gearLevel,
                unitA.stars
              );
              const valueB = displayValue(
                b.requirement?.type || "",
                null,
                unitB.relicLevel,
                unitB.gearLevel,
                unitB.stars
              );

              if (isStarsA || isStarsB) {
                if (isStarsA && isStarsB) {
                  if (this.sortDir === "asc") {
                    return valueA > valueB ? 1 : -1;
                  } else {
                    return valueA > valueB ? -1 : 1;
                  }
                } else if (this.sortDir === "asc") {
                  return isStarsA ? 1 : -1;
                } else {
                  return isStarsA ? -1 : 1;
                }
              } else if (isPowerA || isPowerB) {
                if (isPowerA && isPowerB) {
                  if (this.sortDir === "asc") {
                    return valueA > valueB ? 1 : -1;
                  } else {
                    return valueA > valueB ? -1 : 1;
                  }
                } else if (this.sortDir === "asc") {
                  return isPowerA ? 1 : -1;
                } else {
                  return isPowerB ? -1 : 1;
                }
              } else if (isRelicA === isRelicB || isGearA === isGearB) {
                if (this.sortDir === "asc") {
                  return valueA > valueB ? 1 : -1;
                } else {
                  return valueA > valueB ? -1 : 1;
                }
              } else if (isRelicA || isRelicB) {
                if (this.sortDir === "asc") {
                  return isRelicA ? 1 : -1;
                } else {
                  return isRelicA ? -1 : 1;
                }
              } else if (isGearA || isGearB) {
                if (this.sortDir === "asc") {
                  return isGearA ? 1 : -1;
                } else {
                  return isGearA ? -1 : 1;
                }
              } else if (!isGearA && !isGearB) {
                if (this.sortDir === "asc") {
                  return a.requirement?.type === "Stars" ? 1 : -1;
                } else {
                  return a.requirement?.type === "Stars" ? -1 : 1;
                }
              } else if (
                a.requirement?.type === "Power" ||
                b.requirement?.type === "Power"
              ) {
                if (this.sortDir === "asc") {
                  return a.requirement?.type === "Power" ? 1 : -1;
                } else {
                  return a.requirement?.type === "Power" ? -1 : 1;
                }
              }
            } else if (this.sortMethod === "requirements") {
              const typeA = a.requirement?.type ?? "";
              const typeB = b.requirement?.type ?? "";
              if (typeA === typeB) {
                const valueA = a.requirement?.value ?? 0;
                const valueB = b.requirement?.value ?? 0;
                if (this.sortDir === "asc") {
                  return valueA > valueB ? 1 : -1;
                } else {
                  return valueA > valueB ? -1 : 1;
                }
              } else {
                if (this.sortDir === "asc") {
                  return typeA > typeB ? 1 : -1;
                } else {
                  return typeA > typeB ? -1 : 1;
                }
              }
            } else if (this.sortMethod === "recommended") {
              const typeA = a.recommended?.type ?? "";
              const typeB = b.recommended?.type ?? "";
              if (typeA === typeB) {
                const valueA = a.recommended?.value ?? 0;
                const valueB = b.recommended?.value ?? 0;
                if (this.sortDir === "asc") {
                  return valueA > valueB ? 1 : -1;
                } else {
                  return valueA > valueB ? -1 : 1;
                }
              } else {
                if (this.sortDir === "asc") {
                  return typeA > typeB ? 1 : -1;
                } else {
                  return typeA > typeB ? -1 : 1;
                }
              }
            } else if (this.sortMethod === "progress") {
              const percentA = this.getPercent(a, "requirement");
              const percentB = this.getPercent(b, "requirement");
              if (this.sortDir === "asc") {
                return percentA > percentB ? 1 : -1;
              } else {
                return percentA > percentB ? -1 : 1;
              }
            }
          }
          return 0;
        });
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
    setSearchText: _.debounce(function (this: any) {
      this._searchText = this.searchText;
    }, 500),
  },
  watch: {
    sortDir() {
      this.saveSortData();
    },
    sortMethod() {
      this.saveSortData();
    },
    searchText() {
      this.setSearchText();
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