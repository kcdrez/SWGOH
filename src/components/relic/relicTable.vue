<template>
  <div>
    <table
      class="table table-bordered table-dark table-sm table-striped swgoh-table"
    >
      <thead class="sticky-header show-on-mobile">
        <tr class="sort-methods">
          <th class="show-on-mobile">
            <div class="input-group input-group-sm my-2">
              <span class="input-group-text">Sort By:</span>
              <select
                class="form-control"
                @change="sortMethod = $event.target.value"
              >
                <option value="name">Name</option>
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
        </tr>
        <tr class="text-center align-middle">
          <th v-if="showCol('icon')">Icon</th>
          <th v-if="showCol('name')">
            <div class="c-pointer" @click="sortBy('name')">
              Mat Name
              <i class="fas mx-1" :class="sortIcon('name')"></i>
            </div>
            <input
              class="form-control form-control-sm mx-auto my-1 w-75"
              placeholder="Search"
              v-model="searchText"
            />
          </th>
          <th
            v-if="showCol('locations')"
            class="c-pointer"
            @click="sortBy('location')"
          >
            Locations
            <i class="fas mx-1" :class="sortIcon('location')"></i>
          </th>
          <th
            v-if="showCol('owned')"
            class="c-pointer"
            @click="sortBy('owned')"
            width="160px"
          >
            Amount Owned
            <i class="fas mx-1" :class="sortIcon('owned')"></i>
          </th>
          <th
            v-if="showCol('needed')"
            class="c-pointer"
            @click="sortBy('needed')"
          >
            Amount Needed
            <i class="fas mx-1" :class="sortIcon('needed')"></i>
          </th>
          <th
            v-if="showCol('progress')"
            class="c-pointer"
            @click="sortBy('progress')"
            width="145px"
          >
            Progress
            <i class="fas mx-1" :class="sortIcon('progress')"></i>
          </th>
          <th v-if="showRequiredByUnit && showCol('required')">Required By</th>
          <th v-if="showCol('time')" class="c-pointer" @click="sortBy('time')">
            Est. Time
            <i class="fas mx-1" :class="sortIcon('time')"></i>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="mat in filteredRelics" :key="mat.id">
          <td class="text-center align-middle" v-if="showCol('icon')">
            <RelicIcon :item="mat" />
          </td>
          <td class="align-middle text-center" v-if="showCol('name')">
            {{ mat.name }}
          </td>
          <td class="text-center align-middle" v-if="showCol('locations')">
            <span class="row-label">Location: </span>
            {{ mat.location.node }}
          </td>
          <td class="text-center align-middle" v-if="showCol('owned')">
            <OwnedAmount :item="mat" :needed="mat.amountNeeded(targetLevels)" />
          </td>
          <td class="align-middle text-center" v-if="showCol('needed')">
            {{ mat.amountNeeded(targetLevels) }}
          </td>
          <td class="align-middle" v-if="showCol('progress')">
            <ProgressBar :percent="mat.percent(targetLevels)" class="mt-2" />
          </td>
          <td v-if="showRequiredByUnit && showCol('required')">
            <span class="row-label">Required By: </span>
            <ul>
              <li v-for="unit in mat.neededBy" :key="unit.id">
                <router-link
                  :to="{ name: 'UnitPage', params: { unitId: unit.id } }"
                  >{{ unit.name }}</router-link
                >
              </li>
            </ul>
          </td>
          <td class="text-center align-middle" v-if="showCol('time')">
            <span class="row-label">Completion Date: </span>
            <Timestamp
              :timeLength="mat.timeEstimation(targetLevels)"
              :displayText="
                $filters.pluralText(mat.timeEstimation(targetLevels), 'day')
              "
              :title="$filters.daysFromNow(mat.timeEstimation(targetLevels))"
              displayClasses="d-inline"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { mapState } from "vuex";

import { Relic } from "../../types/relic";
import OwnedAmount from "./relicOwned.vue";
import RelicIcon from "./relicIcon.vue";
import Timestamp from "../timestamp.vue";

export default defineComponent({
  name: "RelicTable",
  components: { OwnedAmount, RelicIcon, Timestamp },
  props: {
    relicList: {
      required: true,
      type: Object as PropType<Relic[]>,
    },
    targetLevels: {
      required: true,
      type: Array as PropType<{ level: number; target: number }[]>,
      validator: (arr: any[]) => {
        return arr.every((x) => {
          return "level" in x && "target" in x;
        });
      },
    },
    showRequiredByUnit: {
      type: Boolean,
      default: false,
    },
    selectedColumns: {
      type: Array,
      validator: (arr: string[]) => {
        return arr.every((x) => {
          return typeof x === "string";
        });
      },
      required: true,
    },
    storageKey: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      sortMethod: "name",
      sortDir: "asc",
      searchText: "",
    };
  },
  computed: {
    ...mapState("relic", ["ownedRelics"]),
    filteredRelics(): Relic[] {
      return (this.relicList as Relic[])
        .sort((a: Relic, b: Relic) => {
          if (this.sortMethod === "name") {
            const compareA = a.name.toLowerCase();
            const compareB = b.name.toLowerCase();
            if (this.sortDir === "asc") {
              return compareA > compareB ? 1 : -1;
            } else {
              return compareA > compareB ? -1 : 1;
            }
          } else if (this.sortMethod === "location") {
            const compareA = a.location.node.toLowerCase();
            const compareB = b.location.node.toLowerCase();
            if (this.sortDir === "asc") {
              return compareA > compareB ? 1 : -1;
            } else {
              return compareA > compareB ? -1 : 1;
            }
          } else if (this.sortMethod === "progress") {
            const amountNeededA = a.amountNeeded(this.targetLevels);
            const amountNeededB = b.amountNeeded(this.targetLevels);

            if (amountNeededA === 0 && amountNeededB === 0) {
              return 0;
            } else if (amountNeededA === 0) {
              return this.sortDir === "asc" ? 1 : -1;
            } else if (amountNeededB === 0) {
              return this.sortDir === "asc" ? -1 : 1;
            }

            if (this.sortDir === "asc") {
              return (
                a.progress(this.targetLevels) - b.progress(this.targetLevels)
              );
            } else {
              return (
                b.progress(this.targetLevels) - a.progress(this.targetLevels)
              );
            }
          } else if (this.sortMethod === "time") {
            if (this.sortDir === "asc") {
              return (
                a.timeEstimation(this.targetLevels) -
                b.timeEstimation(this.targetLevels)
              );
            } else {
              return (
                b.timeEstimation(this.targetLevels) -
                a.timeEstimation(this.targetLevels)
              );
            }
          }
          return 0;
        })
        .filter((relic: Relic) => {
          const name = relic.name.toLowerCase().replace(/\s/g, "");
          const id = relic.id.toLowerCase().replace(/\s/g, "");
          const compare = this.searchText.toLowerCase().replace(/\s/g, "");
          return name.includes(compare) || id.includes(compare);
        });
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

<style lang="scss" scoped></style>
