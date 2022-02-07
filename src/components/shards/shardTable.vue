<template>
  <div>
    <table
      class="table table-bordered table-dark table-sm table-striped mb-0 show-on-mobile swgoh-table"
    >
      <thead>
        <tr class="text-center align-middle">
          <th>
            <div v-if="showHeader">Shard Info</div>
            <div class="sort-methods">
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
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="unit in filteredUnitList" :key="unit.id">
          <div class="swgoh-row">
            <div>
              <UnitIcon
                :unit="unit"
                class="text-center"
                v-if="showUnitName"
                isLink
                hideImgOnMobile
              />
              <div class="text-center">
                Current Star Level: <b>{{ unit.stars || 0 }}</b>
              </div>
            </div>
            <div v-if="unitLocations(unit).length <= 0" class="text-center">
              No known farmable locations.
            </div>
            <div v-else>
              <ul class="m-0 p-0 text-center">
                <li v-for="(l, index) in unitLocations(unit)" :key="index">
                  {{ l }}
                </li>
              </ul>
            </div>
            <div class="py-3">
              <ShardsOwned :unit="unit" class="owned-amount" />
              <ShardProgressBar :unit="unit" class="mt-2" />
            </div>
            <div>
              <NodesPerDay :unit="unit" />
            </div>
            <div class="estimation" v-if="showUnitName">
              <Timestamp
                :displayText="
                  $filters.pluralText(shardTimeEstimation(unit), 'day')
                "
                label="Estimated Completion:"
                :title="$filters.daysFromNow(shardTimeEstimation(unit))"
                displayClasses="d-inline"
              />
            </div>
          </div>
        </tr>
      </tbody>
    </table>
    <table
      class="table table-bordered table-dark table-sm table-striped show-on-desktop"
    >
      <thead class="sticky-header">
        <tr class="text-center align-middle">
          <th width="20%" v-if="showUnitName">
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
          <th
            :width="showUnitName ? '20%' : '33%'"
            class="c-pointer"
            @click="sortBy('location')"
          >
            Locations
            <i class="fas mx-1" :class="sortIcon('location')"></i>
          </th>
          <th
            :width="showUnitName ? '20%' : '33%'"
            class="c-pointer"
            @click="sortBy('progress')"
          >
            Amount/Progress
            <i class="fas mx-1" :class="sortIcon('progress')"></i>
          </th>
          <th :width="showUnitName ? '20%' : '33%'">Node Attempts per Day</th>
          <th
            width="20%"
            class="c-pointer"
            @click="sortBy('time')"
            v-if="showUnitName"
          >
            Est. Time
            <i class="fas mx-1" :class="sortIcon('time')"></i>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="unit in filteredUnitList" :key="unit.id">
          <td class="text-center align-middle" v-if="showUnitName">
            <UnitIcon :unit="unit" isLink />
            <div>
              Current Star Level: <b>{{ unit.stars || 0 }}</b>
            </div>
          </td>
          <td class="align-middle text-center">
            <div v-if="unitLocations(unit).length <= 0" class="text-center">
              No known farmable locations.
            </div>
            <ul v-else class="m-0">
              <li v-for="(l, index) in unitLocations(unit)" :key="index">
                {{ l }}
              </li>
            </ul>
          </td>
          <td class="align-middle">
            <ShardsOwned :unit="unit" />
            <ShardProgressBar :unit="unit" class="mt-2" />
          </td>
          <td class="align-middle nodes-per-day">
            <NodesPerDay :unit="unit" />
          </td>
          <td class="text-center align-middle" v-if="showUnitName">
            <Timestamp
              :displayText="
                $filters.pluralText(shardTimeEstimation(unit), 'day')
              "
              :title="$filters.daysFromNow(shardTimeEstimation(unit))"
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
import { mapActions, mapGetters, mapState } from "vuex";

import ShardsOwned from "./shardsOwned.vue";
import UnitIcon from "../units/unitIcon.vue";
import ShardProgressBar from "./shardProgressBar.vue";
import NodesPerDay from "./nodesPerDay.vue";
import Timestamp from "../timestamp.vue";
import { Unit } from "../../types/unit";
import { FarmingNode } from "../../types/shards";

export default defineComponent({
  name: "ShardTable",
  components: {
    ShardsOwned,
    UnitIcon,
    ShardProgressBar,
    NodesPerDay,
    Timestamp,
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
    showHeader: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      sortDir: "asc",
      sortMethod: "name",
      searchText: "",
    };
  },
  computed: {
    ...mapGetters("shards", ["unitNodes", "shardTimeEstimation", "nodeLabel"]),
    ...mapState("shards", ["ownedShards"]),
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
          } else if (this.sortMethod === "locations") {
            // const locationsA = this.gearLocation(a.lookupMissionList);
            // const locationsB = this.gearLocation(b.lookupMissionList);
            // if (this.sortDir === "asc") {
            //   return locationsA[0] > locationsB[0] ? 1 : -1;
            // } else {
            //   return locationsA[0] < locationsB[0] ? -1 : 1;
            // }
          } else if (this.sortMethod === "progress") {
            // const progressA = this.gearOwnedCount(a) / a.amount;
            // const progressB = this.gearOwnedCount(b) / b.amount;
            // if (this.sortDir === "asc") {
            //   return progressA - progressB;
            // } else {
            //   return progressB - progressA;
            // }
          } else if (this.sortMethod === "time") {
            // const compareA = this.timeEstimation(a);
            // const compareB = this.timeEstimation(b);
            // if (this.sortDir === "asc") {
            //   return compareA - compareB;
            // } else {
            //   return compareB - compareA;
            // }
          }
          return 0;
        });
    },
  },
  methods: {
    ...mapActions("gear", ["saveOwnedCount"]),
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
    unitLocations(unit: Unit): string[] {
      return (this.unitNodes(unit) as FarmingNode[]).map((x) => {
        return this.nodeLabel(x.id);
      });
    },
  },
});
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";

.show-on-desktop {
  @media only screen and (max-width: 1500px) {
    ::v-deep(.nodes-container) {
      flex-basis: 100%;

      .input-group {
        display: block;

        * {
          width: 100%;

          &:first-child {
            border-radius: 0.2rem 0.2rem 0 0 !important;
          }

          &:last-child {
            border-radius: 0 0 0.2rem 0.2rem !important;
          }

          &:not(:first-child) {
            &:not(button) {
              display: block;
            }
            border-top: none;
            text-align: center;
            //everything except the first element is off so the following is used to compensate :shrug:
            position: relative;
            left: 1px;
          }
        }
      }
    }
  }
}
</style>
