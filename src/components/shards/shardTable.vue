<template>
  <div>
    <table
      class="table table-bordered table-dark table-sm table-striped swgoh-table"
    >
      <thead class="sticky-header show-on-mobile">
        <tr class="sort-methods" v-if="showUnitName">
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
        </tr>
        <tr class="text-center align-middle">
          <th v-if="showUnitName && showCol('name')">
            <div class="c-pointer" @click="sortBy('name')">
              Unit Name
              <i class="fas mx-1" :class="sortIcon('name')"></i>
            </div>
            <input
              class="form-control form-control-sm mx-auto my-1 w-75"
              placeholder="Search"
              v-model="searchText"
            />
          </th>
          <th v-if="showCol('locations')">Locations</th>
          <th
            v-if="showCol('progress')"
            class="c-pointer"
            @click="sortBy('progress')"
          >
            Amount/Progress
            <i class="fas mx-1" :class="sortIcon('progress')"></i>
          </th>
          <th v-if="showCol('attempts')">Node Attempts per Day</th>
          <th
            class="c-pointer"
            @click="sortBy('time')"
            v-if="showUnitName && showCol('time')"
          >
            Est. Time
            <i class="fas mx-1" :class="sortIcon('time')"></i>
          </th>
          <th
            v-if="
              (showCol('priority') && showPriority) ||
              (showCol('actions') && !showPriority)
            "
            :class="{ 'c-pointer': showPriority }"
            @click="sortBy('priority')"
          >
            {{ showPriority ? "Priority" : "Actions" }}
            <i
              class="fas mx-1"
              :class="sortIcon('priority')"
              v-if="showPriority"
            ></i>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="unit in filteredUnitList" :key="unit.id">
          <td
            class="text-center align-middle"
            v-if="showUnitName && showCol('name')"
          >
            <UnitIcon :unit="unit" isLink />
          </td>
          <td
            class="align-middle text-center farming-locations"
            v-if="showCol('locations')"
          >
            <div v-if="unit.locations.length <= 0" class="text-center">
              No known farmable locations.
            </div>
            <template v-else>
              <span class="row-label">Farming Locations:</span>
              <ul class="m-0">
                <li v-for="(l, index) in unit.locations" :key="index">
                  {{ l }}
                </li>
              </ul>
            </template>
          </td>
          <td class="align-middle" v-if="showCol('progress')">
            <span class="row-label">Amount/Progress:</span>
            <ShardsOwned :unit="unit" />
            <ProgressBar :percent="unit.shardPercent" class="mt-2" />
          </td>
          <td class="align-middle nodes-per-day" v-if="showCol('attempts')">
            <span class="row-label">Node Attempts per Day:</span>
            <NodesPerDay :unit="unit" v-if="unit.showNodesPerDay" />
          </td>
          <td
            class="text-center align-middle"
            v-if="showUnitName && showCol('time')"
          >
            <span class="row-label">Completion Date: </span>
            <Timestamp
              :timeLength="unit.shardTimeEstimation"
              :displayText="
                $filters.pluralText(unit.shardTimeEstimation, 'day')
              "
              :title="$filters.daysFromNow(unit.shardTimeEstimation)"
              displayClasses="d-inline"
            />
          </td>
          <td
            class="text-center align-middle"
            v-if="
              (showCol('priority') && showPriority) ||
              (showCol('actions') && !showPriority)
            "
          >
            <ShardPriority
              :unit="unit"
              v-if="showPriority"
              :nodeTableNames="nodeTableNames"
            />
            <div
              class="btn-group btn-group-sm d-block text-center"
              role="group"
              v-else
            >
              <button
                type="button"
                class="btn btn-success"
                title="Add to active farming list"
                v-if="unit.tracking"
                @click="unit.tracking = true"
              >
                <i class="fas fa-heart"></i>
              </button>
              <button
                type="button"
                class="btn btn-danger"
                title="Remove from active farming list"
                @click="unit.tracking = false"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import ShardsOwned from "./shardsOwned.vue";
import UnitIcon from "../units/unitIcon.vue";
import NodesPerDay from "./nodesPerDay.vue";
import ShardPriority from "./shardPriority.vue";
import Timestamp from "../timestamp.vue";
import { Unit } from "../../types/unit";

export default defineComponent({
  name: "ShardTable",
  components: {
    ShardsOwned,
    UnitIcon,
    NodesPerDay,
    Timestamp,
    ShardPriority,
  },
  props: {
    units: {
      required: true,
      type: Object as PropType<Unit[]>,
    },
    showUnitName: {
      type: Boolean,
      default: false,
    },
    showPriority: {
      type: Boolean,
      default: false,
    },
    initialSort: {
      type: Object,
    },
    nodeTableNames: {
      type: Array as PropType<string[]>,
      default: () => {
        return [];
      },
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
  },
  data() {
    return {
      sortDir: this.initialSort?.sortDir || "asc",
      sortMethod: this.initialSort?.sortMethod || "name",
      searchText: "",
    };
  },
  computed: {
    filteredUnitList(): Unit[] {
      return this.units
        .filter((unit: Unit) => {
          const name = unit.name.toLowerCase().replace(/\s/g, "");
          const compare = this.searchText.toLowerCase().replace(/\s/g, "");
          return name.includes(compare);
        })
        .sort((a: Unit, b: Unit) => {
          if (this.sortMethod === "name") {
            const compareA = a.name.toLowerCase();
            const compareB = b.name.toLowerCase();
            if (this.sortDir === "asc") {
              return compareA > compareB ? 1 : -1;
            } else {
              return compareA > compareB ? -1 : 1;
            }
          } else if (this.sortMethod === "progress") {
            if (this.sortDir === "asc") {
              return a.shardPercent > b.shardPercent ? 1 : -1;
            } else {
              return a.shardPercent > b.shardPercent ? -1 : 1;
            }
          } else if (this.sortMethod === "time") {
            if (this.sortDir === "asc") {
              return a.shardTimeEstimation > b.shardTimeEstimation ? 1 : -1;
            } else {
              return a.shardTimeEstimation > b.shardTimeEstimation ? -1 : 1;
            }
          } else if (this.sortMethod === "priority") {
            const priorityA = a.tablePriority(this.nodeTableNames);
            const priorityB = b.tablePriority(this.nodeTableNames);

            if (priorityA <= 0) {
              return this.sortDir === "asc" ? 1 : -1;
            } else if (priorityB <= 0) {
              return this.sortDir === "asc" ? -1 : 1;
            } else if (this.sortDir === "asc") {
              return priorityA > priorityB ? 1 : -1;
            } else {
              return priorityA > priorityB ? -1 : 1;
            }
          }
          return 0;
        });
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
  },
});
</script>

<style lang="scss" scoped>
@media only screen and (max-width: 768px) {
  .farming-locations {
    ul {
      list-style: none;
      padding: 0;
    }
  }
}
</style>
