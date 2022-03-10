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
          <!-- <th v-if="showCol('locations')">Locations</th> -->
          <th v-if="showCol('owned')">
            <span>Shards Owned</span>
            <i class="fas mx-2" :class="sortIcon('owned')"></i>
          </th>
          <th v-if="showCol('remaining')">
            <span>Shards Remaining</span>
            <i class="fas mx-2" :class="sortIcon('remaining')"></i>
          </th>
          <th
            v-if="showCol('progress')"
            class="c-pointer"
            @click="sortBy('progress')"
          >
            Progress
            <i class="fas mx-1" :class="sortIcon('progress')"></i>
          </th>
          <th v-if="showCol('wallet')">
            <span>Currency Owned</span>
            <i class="fas mx-2" :class="sortIcon('wallet')"></i>
          </th>
          <th v-if="showCol('dailyCurrency')">
            <span>Daily Currency Obtained</span>
            <i class="fas mx-2" :class="sortIcon('dailyCurrency')"></i>
          </th>
          <th class="c-pointer" @click="sortBy('remainingCurrency')">
            Remaining Currency
            <i class="fas mx-1" :class="sortIcon('remainingCurrency')"></i>
          </th>
          <th
            class="c-pointer"
            @click="sortBy('time')"
            v-if="showUnitName && showCol('time')"
          >
            Est. Time
            <i class="fas mx-1" :class="sortIcon('time')"></i>
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
          <td class="align-middle" v-if="showCol('owned')">
            <ShardsOwned :unit="unit" />
          </td>
          <td class="align-middle text-center" v-if="showCol('remaining')">
            {{ unit.remainingShards }}
          </td>
          <td class="align-middle" v-if="showCol('progress')">
            <span class="row-label">Progress:</span>
            <ProgressBar :percent="unit.shardPercent" />
          </td>
          <td class="align-middle" v-if="showCol('wallet')">
            <Wallet :currencyType="currencyType" />
          </td>
          <td class="align-middle text-center" v-if="showCol('dailyCurrency')">
            <DailyCurrency
              :currencyType="currencyType"
              :allowEdit="allowEditAvg"
            />
          </td>
          <td
            class="align-middle text-center"
            v-if="showCol('remainingCurrency')"
          >
            {{ unit.currencyAmountRemaining(currencyType) }}
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
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import ShardsOwned from "../shardsOwned.vue";
import UnitIcon from "../../units/unitIcon.vue";
import NodesPerDay from "../nodesPerDay.vue";
import ShardPriority from "../shardPriority.vue";
import Timestamp from "../../timestamp.vue";
import Wallet from "../wallet.vue";
import DailyCurrency from "../dailyCurrency.vue";
import { Unit } from "../../../types/unit";

export default defineComponent({
  name: "StoreTable",
  components: {
    ShardsOwned,
    UnitIcon,
    NodesPerDay,
    Timestamp,
    ShardPriority,
    Wallet,
    DailyCurrency,
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
      type: Array,
      validator: (arr: string[]) => {
        return arr.every((x) => {
          return typeof x === "string";
        });
      },
      required: true,
    },
    allowEditAvg: {
      type: Boolean,
      default: false,
    },
    simpleView: {
      type: Boolean,
      default: false,
    },
    currencyType: {
      type: String,
      //todo
      default: "get1",
      // required: true,
    },
  },
  data() {
    return {
      sortDir: "desc",
      sortMethod: "progress",
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
.select-columns {
  width: 200px;
  margin-left: auto;
  margin-bottom: 0.25rem;
}
</style>
