<template>
  <div v-if="prerequisites">
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
          <th v-if="showCol('requirements')">Requirements</th>
          <th v-if="showCol('recommended')">Recommended</th>
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
          <td class="text-center align-middle" v-if="showCol('requirements')">
            <div class="percent-container">
              <RelicLevelIcon
                v-if="item.requirement.type === 'Relic'"
                class="m-auto"
                :relicLevel="item.requirement.value"
                :forceSide="getUnit(item.requirement.id).alignment"
              />
              <div
                v-else-if="item.requirement.type === 'Stars'"
                class="d-flex justify-content-center"
              >
                <span>{{ item.requirement.value }}</span>
                <img src="images/star.png" class="mx-1" />
              </div>
              <GearText
                :level="item.requirement.value"
                v-else-if="item.requirement.type === 'Gear'"
              />
              <span v-else>{{ getRequirement(item) }} </span>
              <ProgressBar :percent="getPercent(item, 'requirement')" />
            </div>
          </td>
          <td class="text-center align-middle" v-if="showCol('recommended')">
            <div class="percent-container" v-if="getRecommended(item)">
              <span>{{ getRecommended(item) }}</span>
              <ProgressBar :percent="getPercent(item, 'recommended')" />
            </div>
            <div v-else>-</div>
          </td>
        </tr>
        <tr>
          <td class="align-middle text-center">Total:</td>
          <td class="align-middle text-center">
            <ProgressBar :percent="totalProgress('requirement')" />
          </td>
          <td class="align-middle text-center">
            <ProgressBar :percent="totalProgress('recommended')" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";

import RelicLevelIcon from "../../units/relicLevelIcon.vue";
import UnitIcon from "../../units/unitIcon.vue";
import GearText from "../../gear/gearText.vue";
import { Unit } from "../../../types/unit";
import { FarmingNode } from "../../../types/shards";
import { maxGearLevel } from "../../../types/gear";
import { round2Decimals } from "../../../utils";

export default defineComponent({
  name: "LegendaryRequirementsTable",
  components: { UnitIcon, RelicLevelIcon, GearText },
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
    ...mapState("unit", ["unitList"]),
    prerequisites() {
      const legendaryUnits: FarmingNode = this.shardFarming.find(
        (x: FarmingNode) => x.id === this.nodeKey
      );
      return (
        legendaryUnits?.characters.find((x) => x.id === this.unit.id)
          ?.prerequisites ?? null
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
    getRequirement(item: any): string {
      if (item.requirement) {
        return `${item.requirement.type}: ${item.requirement.value}`;
      } else {
        return "-";
      }
    },
    getRecommended(item: any): string {
      if (item.recommended) {
        return `${item.recommended.type}: ${item.recommended.value}`;
      } else {
        return "";
      }
    },
    getPercent(
      item: any,
      prerequisiteType: "requirement" | "recommended"
    ): number {
      let percentage = 0;
      const type = item[prerequisiteType]?.type ?? item.requirement.type;
      const value = item[prerequisiteType]?.value ?? item.requirement.value;
      if (item.id) {
        const unit: Unit = this.getUnit(item.id);
        percentage = this.getUnitPercent(unit, type, value);
      } else if (item.tags) {
        const list = this.getUnitsByTag(item.tags).map((u) => {
          return this.getUnitPercent(u, type, value);
        });

        if (list.length >= item.count) {
          percentage = 100;
        } else {
          for (let i = list.length; i < item.count; i++) {
            list.push(0);
          }
          percentage =
            list.reduce((partialSum, a) => partialSum + a, 0) / list.length;
        }
      }

      if (percentage > 100) {
        return 100;
      } else if (percentage < 0) {
        return 0;
      } else {
        return round2Decimals(percentage);
      }
    },
    getUnitPercent(unit: Unit, type: string, target: number) {
      if (type === "Power") {
        return (unit.power / target) * 100;
      } else if (type === "Relic") {
        const total = target + maxGearLevel;
        return ((unit.gearLevel + unit.relicLevel) / total) * 100;
      } else if (type === "Gear") {
        return (unit.gearLevel / target) * 100;
      } else if (type === "Stars") {
        return (unit.stars / target) * 100;
      }
      return 0;
    },
    getUnitsByTag(tags: string[]): Unit[] {
      return [...this.player.units, ...this.unitList]
        .filter((u: Unit) => {
          return tags.every((tag) => {
            if (tag === "is_ship") {
              return u.isShip;
            } else if (tag.includes("!")) {
              const notTag = tag.replace("!", "");
              if (notTag === "is_ship") {
                return !u.isShip;
              } else {
                return !u.categories.includes(notTag);
              }
            } else {
              return u.categories.includes(tag);
            }
          });
        })
        .reduce((acc, el) => {
          const match = acc.find((x: any) => x.id === el.id);
          if (!match) {
            acc.push(el);
          }
          return acc;
        }, []);
    },
    getUnit(unitId: string) {
      return [...this.player.units, ...this.unitList].find(
        (x) => x.id === unitId
      );
    },
    totalProgress(prerequisiteType: "requirement" | "recommended") {
      let list: number[] = [];
      (this.prerequisites ?? []).forEach((item) => {
        list.push(this.getPercent(item, prerequisiteType));
      });
      return round2Decimals(
        list.reduce((partialSum, a) => partialSum + a, 0) / list.length
      );
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
</style>
