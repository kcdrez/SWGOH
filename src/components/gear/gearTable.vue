<template>
  <div>
    <MultiSelect
      class="select-columns"
      :options="cols"
      storageKey="gearTable"
      @checked="selectedColumns = $event"
    />
    <table
      class="table table-bordered table-dark table-sm table-striped mb-0 swgoh-table"
      v-if="gearList.length > 0"
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
          <th v-if="showCol('name')">
            <div class="c-pointer" @click="sortBy('name')">
              Salvage Name
              <i class="fas mx-1" :class="sortIcon('name')"></i>
            </div>
            <input
              class="form-control form-control-sm mx-auto my-1 w-75"
              placeholder="Search"
              v-model="searchText"
            />
          </th>
          <th
            class="c-pointer"
            @click="sortBy('location')"
            v-if="showCol('locations')"
          >
            Locations
            <i class="fas mx-1" :class="sortIcon('location')"></i>
          </th>
          <th
            class="c-pointer"
            @click="sortBy('progress')"
            v-if="showCol('progress')"
          >
            Amount/Progress
            <i class="fas mx-1" :class="sortIcon('progress')"></i>
          </th>
          <th v-if="showRequiredByUnit && showCol('required')">Required By</th>
          <th class="c-pointer" @click="sortBy('time')" v-if="showCol('time')">
            Est. Time
            <i class="fas mx-1" :class="sortIcon('time')"></i>
          </th>
          <th v-if="showCol('actions')">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="filteredSalvageList.length === 0">
          <td colspan="100%" class="empty-search">
            There are no gear pieces that meet that search criteria.
          </td>
        </tr>
        <tr v-for="salvage in filteredSalvageList" :key="salvage.id">
          <td class="text-center" v-if="showCol('name')">
            <GearIcon :gear="salvage" />
          </td>
          <td v-if="showCol('locations')">
            <div v-if="salvage.locations.length <= 0" class="text-center">
              No known farmable locations.
            </div>
            <template v-else>
              <button
                class="btn btn-sm btn-info m-auto d-block"
                data-bs-toggle="collapse"
                :href="`#locations-${salvage.id}`"
              >
                Show/Hide Locations
              </button>
              <ul class="m-0 collapse" :id="`locations-${salvage.id}`">
                <li v-for="(l, index) in salvage.locations" :key="index">
                  {{ l }}
                </li>
              </ul>
            </template>
          </td>
          <td v-if="showCol('progress')">
            <OwnedAmount :salvage="salvage" />
            <ProgressBar :percent="salvage.percent" class="mt-2" />
          </td>
          <td v-if="showRequiredByUnit && showCol('required')">
            <ul>
              <li v-for="unit in salvage.neededBy" :key="unit.id">
                <router-link
                  :to="{ name: 'UnitPage', params: { unitId: unit.id } }"
                  >{{ unit.name }}</router-link
                >
              </li>
            </ul>
          </td>
          <td class="text-center" v-if="showCol('time')">
            <span class="row-label">Completion Date: </span>
            <Timestamp
              :timeLength="salvage.timeEstimation"
              :displayText="$filters.pluralText(salvage.timeEstimation, 'day')"
              :title="$filters.daysFromNow(salvage.timeEstimation)"
              displayClasses="d-inline"
            />
          </td>
          <td v-if="showCol('actions')">
            <div
              class="btn-group btn-group-sm d-block text-center"
              role="group"
            >
              <button
                type="button"
                class="btn btn-warning text-dark"
                title="Mark this salvage as irrelevant, removing it from the planner estimation"
                @click="salvage.irrelevant = true"
              >
                <i class="fas fa-toilet"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="text-center">
      There are no gear requirements and you can likely immediately upgrade to
      this level. This is likely due to the fact that all the gear needed is
      marked as irrelevant.
    </div>
    <table
      class="table table-bordered table-dark table-sm table-striped"
      v-if="irrelevantGear.length > 0"
    >
      <thead
        class="c-pointer sticky-header"
        data-bs-toggle="collapse"
        href="#irrelevantSection"
        title="Show/Hide irrelevant pieces"
      >
        <tr>
          <th :colspan="showRequiredByUnit ? '6' : '5'" class="text-center">
            Irrelevant Pieces
          </th>
        </tr>
      </thead>
      <tbody id="irrelevantSection" class="collapse">
        <tr v-for="salvage in irrelevantGear" :key="salvage.id">
          <td :colspan="showRequiredByUnit ? '5' : '4'" class="text-center">
            <GearIcon :gear="salvage" />
          </td>
          <td class="align-middle">
            <div
              class="btn-group btn-group-sm d-block text-center"
              role="group"
            >
              <button
                type="button"
                class="btn btn-success"
                title="Mark this salvage as relevant, moving it back into the planner estimation"
                @click="salvage.irrelevant = false"
              >
                <i class="fas fa-heart"></i>
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
import { mapActions } from "vuex";

import { Gear } from "../../types/gear";
import OwnedAmount from "./gearOwned.vue";
import GearIcon from "./gearIcon.vue";
import Timestamp from "../timestamp.vue";

export default defineComponent({
  name: "GearTable",
  components: { OwnedAmount, GearIcon, Timestamp },
  props: {
    gearList: {
      required: true,
      type: Object as PropType<Gear[]>,
    },
    showRequiredByUnit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      sortDir: "asc",
      sortMethod: "name",
      searchText: "",
      selectedColumns: [],
    };
  },
  computed: {
    filteredSalvageList(): Gear[] {
      return this.gearList
        .filter((gear: Gear) => {
          if (gear.irrelevant) {
            return false;
          }
          const name = gear.name.toLowerCase().replace(/\s/g, "");
          const compare = this.searchText.toLowerCase().replace(/\s/g, "");
          return name.includes(compare);
        })
        .sort((a: Gear, b: Gear) => {
          if (this.sortMethod === "name") {
            const compareA = a.name.toLowerCase();
            const compareB = b.name.toLowerCase();
            if (this.sortDir === "asc") {
              return compareA > compareB ? 1 : -1;
            } else {
              return compareA > compareB ? -1 : 1;
            }
          } else if (this.sortMethod === "locations") {
            if (this.sortDir === "asc") {
              return a.locations[0] > b.locations[0] ? 1 : -1;
            } else {
              return a.locations[0] < b.locations[0] ? -1 : 1;
            }
          } else if (this.sortMethod === "progress") {
            if (this.sortDir === "asc") {
              return a.progress - b.progress;
            } else {
              return b.progress - a.progress;
            }
          } else if (this.sortMethod === "time") {
            if (this.sortDir === "asc") {
              return a.timeEstimation - b.timeEstimation;
            } else {
              return b.timeEstimation - a.timeEstimation;
            }
          }
          return 0;
        });
    },
    irrelevantGear(): Gear[] {
      return this.gearList.filter((gear: Gear) => {
        return gear.irrelevant;
      });
    },
    cols(): { text: string; value: any }[] {
      const list = [
        {
          text: "Name",
          value: "name",
        },
        {
          text: "Locations",
          value: "locations",
        },
        {
          text: "Progress",
          value: "progress",
        },
        {
          text: "Estimated Time",
          value: "time",
        },
        {
          text: "Actions",
          value: "actions",
        },
      ];

      if (this.showRequiredByUnit) {
        list.splice(3, 0, {
          text: "Required By",
          value: "required",
        });
      }
      return list;
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
    showCol(key: string): boolean {
      return this.selectedColumns.some((x) => x === key);
    },
  },
});
</script>

<style lang="scss" scoped>
.empty-search {
  font-size: 1.5rem;
  text-align: center;
}

.select-columns {
  width: 200px;
  margin-left: auto;
  margin-bottom: 0.25rem;
}
</style>
