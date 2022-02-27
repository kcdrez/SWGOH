<template>
  <div>
    <MultiSelect
      class="select-columns"
      :options="cols"
      storageKey="relicTable"
      @checked="selectedColumns = $event"
    />
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
            v-if="showCol('progress')"
            class="c-pointer"
            @click="sortBy('progress')"
          >
            Amount/Progress
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
          <td class="text-center align-middle" v-if="showCol('name')">
            <RelicIcon :item="mat" />
          </td>
          <td class="text-center align-middle" v-if="showCol('locations')">
            <span class="row-label">Location: </span>
            {{ mat.location.node }}
          </td>
          <td class="align-middle" v-if="showCol('progress')">
            <OwnedAmount
              :item="mat"
              :needed="amountNeeded(mat.amount, targetLevels)"
            />
            <RelicProgressBar
              :itemId="mat.id"
              :amountNeeded="amountNeeded(mat.amount, targetLevels)"
              class="mt-2"
            />
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
              :timeLength="timeEstimation(mat, targetLevels)"
              :displayText="
                $filters.pluralText(timeEstimation(mat, targetLevels), 'day')
              "
              :title="$filters.daysFromNow(timeEstimation(mat, targetLevels))"
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
import { mapGetters, mapState } from "vuex";

import { Relic } from "../../types/relic";
import OwnedAmount from "./relicOwned.vue";
import RelicIcon from "./relicIcon.vue";
import RelicProgressBar from "./relicProgressBar.vue";
import Timestamp from "../timestamp.vue";

export default defineComponent({
  name: "RelicTable",
  components: { OwnedAmount, RelicIcon, RelicProgressBar, Timestamp },
  props: {
    relicList: {
      required: true,
      type: Object as PropType<Relic[]>,
    },
    targetLevels: {
      required: true,
      type: Array,
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
  },
  data() {
    return {
      sortMethod: "name",
      sortDir: "asc",
      searchText: "",
      selectedColumns: [],
    };
  },
  computed: {
    ...mapGetters("relic", ["timeEstimation", "amountNeeded"]),
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
            const amountNeededA = this.amountNeeded(
              a.amount,
              this.targetLevels
            );
            const amountNeededB = this.amountNeeded(
              b.amount,
              this.targetLevels
            );

            if (amountNeededA === 0 && amountNeededB === 0) {
              return 0;
            } else if (amountNeededA === 0) {
              return this.sortDir === "asc" ? 1 : -1;
            } else if (amountNeededB === 0) {
              return this.sortDir === "asc" ? -1 : 1;
            }

            const progressA = (this.ownedRelics[a.id] || 0) / amountNeededA;
            const progressB = (this.ownedRelics[b.id] || 0) / amountNeededB;

            if (this.sortDir === "asc") {
              return progressA - progressB;
            } else {
              return progressB - progressA;
            }
          } else if (this.sortMethod === "time") {
            const compareA = this.timeEstimation(a, this.targetLevels);
            const compareB = this.timeEstimation(b, this.targetLevels);
            if (this.sortDir === "asc") {
              return compareA - compareB;
            } else {
              return compareB - compareA;
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
