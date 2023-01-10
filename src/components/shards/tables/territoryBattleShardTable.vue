<template>
  <Loading :state="loading ? 'LOADING' : 'READY'" size="md">
    <table
      class="table table-bordered table-dark table-sm table-striped swgoh-table"
    >
      <thead class="sticky-header show-on-mobile">
        <tr class="sort-methods" v-if="showUnitName">
          <th class="show-on-mobile">
            <SortMethods
              :sortByOptions="sortByOptions"
              :sortMethod="sortMethod"
              :sortDir="sortDir"
              showSearch
              @methodChange="sortMethod = $event"
              @directionChange="sortDir = $event"
              @searchChange="searchText = $event"
            />
          </th>
        </tr>
        <ColumnHeaders
          class="text-center align-middle"
          :headers="headers"
          @searchChange="searchText = $event"
        />
      </thead>
      <tbody>
        <tr
          v-for="unit in filteredUnitList"
          :key="unit.id"
          class="align-middle text-center"
        >
          <td v-if="showUnitName && showCol('name')">
            <UnitIcon :unit="unit" isLink :hideImage="simpleView" />
          </td>
          <td
            class="farming-locations text-left text-center-sm"
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
          <td v-if="showCol('owned')">
            <div class="input-group input-group-sm">
              <span class="input-group-text row-label">Shards Owned:</span>
              <ShardsOwned :unit="unit" class="shards-owned" />
            </div>
          </td>
          <td v-if="showCol('remaining')">
            <span class="row-label">Remaining Shards:</span>
            {{ unit.remainingShards }}
          </td>
          <td v-if="showCol('progress')">
            <ProgressBar :percent="unit.shardPercent" />
          </td>
          <td v-if="showUnitName && showCol('time')">
            <span class="row-label">Completion Date: </span>
            <Timestamp
              :timeLength="estimatedTime(unit)"
              displayClasses="d-inline"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </Loading>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs } from "vue";
import { mapActions } from "vuex";

import ShardsOwned from "../shardsOwned.vue";
import UnitIcon from "components/units/unitIcon.vue";
import NodesPerDay from "../nodesPerDay.vue";
import ShardPriority from "../shardPriority.vue";
import Timestamp from "components/timestamp.vue";
import { Unit, unitsByPriority } from "types/unit";
import { estimatedTime } from "types/guild";
import { setupColumnEvents, setupSorting } from "utils";
import { iHeader } from "types/general";

export default defineComponent({
  name: "TerritoryBattleShardTable",
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
      type: Object as PropType<Unit[]>,
    },
    showUnitName: {
      type: Boolean,
      default: false,
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
      sortByOptions: [
        {
          value: "name",
          label: "Name",
          show: this.showUnitName,
        },
        {
          value: "location",
          label: "Location",
        },
        {
          value: "progress",
          label: "Progress",
        },
        {
          value: "time",
          label: "Time Remaining",
        },
      ],
    };
  },
  computed: {
    headers(): iHeader[] {
      return [
        {
          label: "Unit Name",
          show: this.showUnitName && this.showCol("name"),
          input: {
            type: "input",
            classes: "mx-auto my-1 w-75",
            placeholder: "Search",
          },
          icon: this.sortIcon("name"),
          click: () => {
            this.sortBy("name");
          },
        },
        {
          label: "Locations",
          show: this.showCol("locations"),
        },
        {
          label: "Shards Owned",
          show: this.showCol("owned"),
          icon: this.sortIcon("owned"),
          click: () => {
            this.sortBy("owned");
          },
        },
        {
          label: "Shards Remaining",
          show: this.showCol("remaining"),
          icon: this.sortIcon("remaining"),
          click: () => {
            this.sortBy("remaining");
          },
        },
        {
          label: "Progress",
          show: this.showCol("progress"),
          icon: this.sortIcon("progress"),
          click: () => {
            this.sortBy("progress");
          },
        },
        {
          label: "Est. Time",
          show: this.showUnitName && this.showCol("time"),
          icon: this.sortIcon("time"),
          click: () => {
            this.sortBy("time");
          },
        },
      ];
    },
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
              return this.estimatedTime(a) > this.estimatedTime(b) ? 1 : -1;
            } else {
              return this.estimatedTime(a) > this.estimatedTime(b) ? -1 : 1;
            }
          }
          return 0;
        });
    },
    orderedPriorityList(): Unit[] {
      return unitsByPriority(this.units, []);
    },
  },
  methods: {
    ...mapActions("guild", ["initialize"]),
    estimatedTime,
    refresh() {
      this.loading = true;
      this.orderedPriorityList.forEach((unit) => {
        unit.estimatedTime = this.estimatedTime(unit);
      });
      this.loading = false;
    },
  },
  async created() {
    await this.initialize();
    if (this.loadOnCreation) {
      this.refresh();
    }
  },
});
</script>

<style lang="scss" scoped></style>
