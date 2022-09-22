<template>
  <Loading :state="loading ? 'LOADING' : 'READY'" size="md">
    <table
      class="table table-bordered table-dark table-sm table-striped swgoh-table"
    >
      <thead class="sticky-header show-on-mobile">
        <tr class="sort-methods" v-if="showUnitName">
          <th class="show-on-mobile">
            <div class="input-group input-group-sm my-2">
              <span class="input-group-text">Sort By:</span>
              <select class="form-control" v-model="sortMethod">
                <template v-for="option in sortByOptions">
                  <option
                    :key="option.value"
                    :value="option.value"
                    v-if="!option.hidden"
                  >
                    {{ option.label }}
                  </option>
                </template>
              </select>
            </div>
            <div class="input-group input-group-sm my-2">
              <span class="input-group-text">Sort Direction:</span>
              <select class="form-control" v-model="sortDir">
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
              <span>Unit Name</span>
              <i class="fas mx-2" :class="sortIcon('name')"></i>
            </div>
            <input
              class="form-control form-control-sm mx-auto my-1 w-75"
              placeholder="Search"
              v-model="searchText"
            />
          </th>
          <th v-if="showCol('locations')">
            <span>Locations</span>
          </th>
          <th
            v-if="showCol('owned')"
            @click="sortBy('owned')"
            class="c-pointer"
          >
            <span>Shards Owned</span>
            <i class="fas mx-2" :class="sortIcon('owned')"></i>
          </th>
          <th
            v-if="showCol('remaining')"
            @click="sortBy('remaining')"
            class="c-pointer"
          >
            <span>Shards Remaining</span>
            <i class="fas mx-2" :class="sortIcon('remaining')"></i>
          </th>
          <th
            class="c-pointer"
            v-if="showCol('progress')"
            @click="sortBy('progress')"
          >
            <span>Progress</span>
            <i class="fas mx-2" :class="sortIcon('progress')"></i>
          </th>
          <th v-if="showCol('attempts')">
            <span>Node Attempts per Day</span>
            <!-- <i class="fas mx-2" :class="sortIcon('attempts')"></i> -->
          </th>
          <th
            class="c-pointer"
            @click="sortBy('time')"
            v-if="showUnitName && showCol('time')"
          >
            <span>Est. Time</span>
            <i class="fas mx-2" :class="sortIcon('time')"></i>
          </th>
          <th
            v-if="showCol('priority') && showPriority"
            width="150px"
            class="c-pointer"
            @click="sortBy('priority')"
          >
            <span>Priority</span>
            <i class="fas mx-2" :class="sortIcon('priority')"></i>
          </th>
          <th v-if="showCol('actions') && showActions" width="100px">
            <span>Actions</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="unit in filteredUnitList" :key="unit.id">
          <td
            class="text-center align-middle"
            v-if="showUnitName && showCol('name')"
          >
            <UnitIcon :unit="unit" isLink :hideImage="simpleView" />
          </td>
          <td
            class="align-middle text-left text-center-sm farming-locations"
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
          <td class="align-middle" v-if="showCol('owned')">
            <div class="input-group input-group-sm">
              <span class="input-group-text row-label">Shards Owned:</span>
              <ShardsOwned :unit="unit" class="shards-owned" />
            </div>
          </td>
          <td class="align-middle text-center" v-if="showCol('remaining')">
            <span class="row-label">Shards Remaining:</span>
            {{ unit.remainingShards }}
          </td>
          <td class="align-middle progress-cell" v-if="showCol('progress')">
            <ProgressBar :percent="unit.shardPercent" />
          </td>
          <td class="align-middle nodes-per-day" v-if="showCol('attempts')">
            <span class="row-label">Node Attempts per Day:</span>
            <NodesPerDay :unit="unit" v-if="unit.showNodesPerDay" />
          </td>
          <td
            class="text-center align-middle"
            v-if="showUnitName && showCol('time')"
          >
            <span class="row-label">Completion Date:</span>
            <Timestamp
              :timeLength="unit.estimatedTime"
              displayClasses="d-inline"
            />
          </td>
          <td class="align-middle" v-if="showCol('priority') && showPriority">
            <div class="input-group input-group-sm">
              <span class="input-group-text row-label">Priority:</span>
              <ShardPriority
                :unit="unit"
                :nodeTableNames="nodeTableNames"
                class="priority-input"
              />
            </div>
          </td>
          <td class="align-middle" v-if="showCol('actions') && showActions">
            <div
              class="btn-group btn-group-sm d-block text-center"
              role="group"
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
  </Loading>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs } from "vue";

import ShardsOwned from "../shardsOwned.vue";
import UnitIcon from "components/units/unitIcon.vue";
import NodesPerDay from "../nodesPerDay.vue";
import ShardPriority from "../shardPriority.vue";
import Timestamp from "components/timestamp.vue";
import { Unit } from "types/unit";
import { estimatedTime } from "types/shards";
import { setupColumnEvents, setupSorting } from "utils";

export default defineComponent({
  name: "ShardTable",
  setup(props) {
    const { sortDir, sortMethod, searchText, sortBy, sortIcon } = setupSorting(
      props.storageKey
    );
    const list = toRefs(props).selectedColumns;
    const { showCol } = setupColumnEvents(list);

    return {
      sortDir,
      sortMethod,
      searchText,
      sortBy,
      sortIcon,
      showCol,
    };
  },
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
      type: Array as () => Unit[],
    },
    showUnitName: {
      type: Boolean,
      default: false,
    },
    showPriority: {
      type: Boolean,
      default: false,
    },
    showActions: {
      type: Boolean,
      default: false,
    },
    nodeTableNames: {
      type: Array as () => string[],
      default: () => {
        return [];
      },
    },
    selectedColumns: {
      type: Array as () => string[],
      validator: (arr: string[]) => {
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
    loadOnCreation: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: true,
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
          } else if (this.sortMethod === "owned") {
            if (this.sortDir === "asc") {
              return a.ownedShards > b.ownedShards ? 1 : -1;
            } else {
              return a.ownedShards > b.ownedShards ? -1 : 1;
            }
          } else if (this.sortMethod === "remaining") {
            if (this.sortDir === "asc") {
              return a.remainingShards > b.remainingShards ? 1 : -1;
            } else {
              return a.remainingShards > b.remainingShards ? -1 : 1;
            }
          } else if (this.sortMethod === "time") {
            if (this.sortDir === "asc") {
              return a.estimatedTime > b.estimatedTime ? 1 : -1;
            } else {
              return a.estimatedTime > b.estimatedTime ? -1 : 1;
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
    sortByOptions() {
      return [
        {
          value: "name",
          label: "Name",
          hidden: !this.showUnitName,
        },
        {
          value: "locations",
          label: "Locations",
        },
        {
          value: "owned",
          label: "Shards Owned",
        },
        {
          value: "remaining",
          label: "Shards Remaining",
        },
        {
          value: "progress",
          label: "Progress",
        },
        {
          value: "time",
          label: "Est. Time",
          hidden: !this.showUnitName,
        },
        {
          value: "priority",
          label: "Priority",
          hidden: !this.showPriority,
        },
      ];
    },
  },
  methods: {
    refresh() {
      this.loading = true;
      estimatedTime(this.units, this.nodeTableNames);
      this.loading = false;
    },
  },
  created() {
    if (this.loadOnCreation) {
      this.refresh();
    }
  },
});
</script>

<style lang="scss" scoped>
.progress-cell {
  min-width: 125px;
}
</style>
