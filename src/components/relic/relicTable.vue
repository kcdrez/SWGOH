<template>
  <div>
    <table
      class="table table-bordered table-dark table-sm table-striped show-on-mobile"
    >
      <thead>
        <tr class="text-center align-middle">
          <th>
            <div>Relic Info</div>
            <div class="sort-methods">
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
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="mat in filteredRelics" :key="mat.id">
          <div class="relic-row">
            <RelicIcon :item="mat" class="text-center" />
            <div class="text-center">
              {{ mat.location.node || "No known farmable locations." }}
            </div>
            <div class="py-3">
              <OwnedAmount
                class="owned-amount"
                :item="mat"
                :needed="amountNeeded(mat, targetLevels)"
              />
              <RelicProgressBar
                :item="mat"
                :amountNeeded="amountNeeded(mat, targetLevels)"
                class="mt-2"
              />
            </div>
            <div v-if="showRequiredByUnit">
              <ul class="text-center p-0 my-2">
                <li v-for="unit in mat.neededBy" :key="unit.id">
                  <router-link
                    :to="{ name: 'UnitPage', params: { unitId: unit.id } }"
                    >{{ unit.name }}</router-link
                  >
                </li>
              </ul>
            </div>
            <div class="text-center estimation">
              <Timestamp
                v-if="timeEstimation(mat, targetLevels) >= 0"
                :displayText="`${timeEstimation(mat, targetLevels)} days`"
                label="Estimated Completion:"
                :title="$filters.daysFromNow(timeEstimation(mat, targetLevels))"
                displayClasses="d-inline"
              />
              <div v-else>-</div>
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
          <th :width="showRequiredByUnit ? '15%' : '20%'">
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
            :width="showRequiredByUnit ? '15%' : '20%'"
            class="c-pointer"
            @click="sortBy('location')"
          >
            Locations
            <i class="fas mx-1" :class="sortIcon('location')"></i>
          </th>
          <th
            :width="showRequiredByUnit ? '15%' : '20%'"
            class="c-pointer"
            @click="sortBy('progress')"
          >
            Amount/Progress
            <i class="fas mx-1" :class="sortIcon('progress')"></i>
          </th>
          <th v-if="showRequiredByUnit" width="15%">Required By</th>
          <th width="10%" class="c-pointer" @click="sortBy('time')">
            Est. Time
            <i class="fas mx-1" :class="sortIcon('time')"></i>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="mat in filteredRelics" :key="mat.id">
          <td class="text-center align-middle">
            <RelicIcon :item="mat" />
          </td>
          <td class="text-center align-middle">{{ mat.location.node }}</td>
          <td class="align-middle">
            <OwnedAmount
              :item="mat"
              :needed="amountNeeded(mat, targetLevels)"
            />
            <RelicProgressBar
              :item="mat"
              :amountNeeded="amountNeeded(mat, targetLevels)"
              class="mt-2"
            />
          </td>
          <td v-if="showRequiredByUnit">
            <ul>
              <li v-for="unit in mat.neededBy" :key="unit.id">
                <router-link
                  :to="{ name: 'UnitPage', params: { unitId: unit.id } }"
                  >{{ unit.name }}</router-link
                >
              </li>
            </ul>
          </td>
          <td class="text-center align-middle">
            <div v-if="timeEstimation(mat, targetLevels) >= 0">
              {{ timeEstimation(mat, targetLevels) }}
              Days
            </div>
            <div v-else>-</div>
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
            const amountNeededA = this.amountNeeded(a, this.targetLevels);
            const amountNeededB = this.amountNeeded(b, this.targetLevels);

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
              if (this.amountNeeded(a, this.targetLevels) <= 0) {
              }
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
  },
});
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";

.relic-row {
  > * {
    padding: 0.5rem 1rem;

    &:not(:last-child) {
      border-bottom: solid $gray-5 1px;
    }
  }
}

.sort-methods {
  @media only screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.show-on-mobile {
  tr:not(:last-child) {
    border-bottom: black solid 3px;
  }
}

.estimation {
  ::v-deep(.display-container) {
    display: inline-block;
  }
}
</style>