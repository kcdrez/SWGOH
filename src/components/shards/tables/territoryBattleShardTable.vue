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
              <span>Unit Name</span>
              <i class="fas mx-1" :class="sortIcon('name')"></i>
            </div>
            <input
              class="form-control form-control-sm mx-auto my-1 w-75"
              placeholder="Search"
              v-model="searchText"
            />
          </th>
          <th v-if="showCol('locations')"><span>Locations</span></th>
          <th
            v-if="showCol('owned')"
            class="c-pointer"
            @click="sortBy('owned')"
          >
            <span>Shards Owned</span>
            <i class="fas mx-1" :class="sortIcon('owned')"></i>
          </th>
          <th
            v-if="showCol('remaining')"
            class="c-pointer"
            @click="sortBy('remaining')"
          >
            <span>Shards Remaining</span>
            <i class="fas mx-2" :class="sortIcon('remaining')"></i>
          </th>
          <th
            v-if="showCol('progress')"
            class="c-pointer"
            @click="sortBy('progress')"
          >
            <span>Progress</span>
            <i class="fas mx-1" :class="sortIcon('progress')"></i>
          </th>
          <th
            class="c-pointer"
            @click="sortBy('time')"
            v-if="showUnitName && showCol('time')"
          >
            <span>Est. Time</span>
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
          <td class="align-middle text-center" v-if="showCol('locations')">
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
            <span class="row-label">Owned Amount:</span>
            <ShardsOwned :unit="unit" />
          </td>
          <td class="align-middle text-center" v-if="showCol('remaining')">
            {{ unit.remainingShards }}
          </td>
          <td class="align-middle" v-if="showCol('progress')">
            <span class="row-label">Progress:</span>
            <ProgressBar :percent="unit.shardPercent" />
          </td>
          <td
            class="text-center align-middle"
            v-if="showUnitName && showCol('time')"
          >
            <span class="row-label">Completion Date: </span>
            <Timestamp
              :timeLength="estimatedTime(unit)"
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
import { mapActions } from "vuex";

import ShardsOwned from "../shardsOwned.vue";
import UnitIcon from "../../units/unitIcon.vue";
import NodesPerDay from "../nodesPerDay.vue";
import ShardPriority from "../shardPriority.vue";
import Timestamp from "../../timestamp.vue";
import { Unit } from "../../../types/unit";
import { estimatedTime } from "../../../types/guild";

export default defineComponent({
  name: "TerritoryBattleShardTable",
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
      type: Array,
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
  },
  data() {
    return {
      sortDir: "asc",
      sortMethod: "name",
      searchText: "",
    };
  },
  computed: {
    // ...mapGetters("guild", ["tbAvgShards"]),
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
  },
  methods: {
    ...mapActions("guild", ["initialize"]),
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
    estimatedTime,
  },
  async created() {
    await this.initialize();
    const storageData = JSON.parse(
      window.localStorage.getItem(this.storageKey) || "{}"
    );
    this.sortDir = storageData.sortDir ?? "asc";
    this.sortMethod = storageData.sortMethod ?? "name";
  },
});
</script>

<style lang="scss" scoped>
@import "../../../styles/variables.scss";

.show-on-desktop {
  @media only screen and (max-width: 1200px) {
    ::v-deep(.nodes-container) {
      flex-basis: 100%;

      .input-group {
        display: block;

        * {
          width: 100%;

          &:first-child {
            border-radius: 0.2rem 0.2rem 0 0 !important;
            justify-content: center;
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
