<template>
  <div class="collapse" id="gearSection">
    <Loading :state="requestState" size="md" message="Loading Gear Data">
      <template v-if="unit.gear_level < 13">
        <h3 class="gear-header">
          Gear Needed to get {{ unit.name }} from Gear Level
          {{ currentGearLevel(unit) }} to
          <select v-model.number="gearTarget">
            <option
              v-for="num in gearOptions(unit.gear_level)"
              :value="num"
              :key="num"
            >
              Gear {{ num }}
            </option>
          </select>
          :
        </h3>
        <h3>
          It will take approximately {{ totalDays(unit) }} day{{
            totalDays(unit) === 1 ? "" : "s"
          }}
          to get to Gear Level {{ gearTarget }}.
        </h3>
        <div class="input-group input-group-sm w-50">
          <span
            class="input-group-text c-help energy-text"
            title="Energy used on Light and Dark side tables"
            >Standard Energy:</span
          >
          <span
            class="input-group-text c-help"
            title="How many times you refresh the energy using crystals"
            >Daily Refreshes:</span
          >
          <input
            class="form-control"
            type="number"
            v-model.number="refreshesStandard"
            min="0"
          />
          <span
            class="input-group-text c-help"
            title="How much of your daily energy used for farming other things (i.e. character shards)"
            >Daily Energy Used:</span
          >
          <input
            class="form-control"
            type="number"
            v-model.number="energySpentStandard"
            min="0"
            :max="145 + refreshesStandard * 120 + 135"
          />
        </div>
        <div class="input-group input-group-sm my-2 w-50">
          <span
            class="input-group-text c-help energy-text"
            title="Energy used on fleet/ship nodes"
            >Fleet Energy:</span
          >
          <span
            class="input-group-text c-help"
            title="How many times you refresh the energy using crystals"
            >Daily Refreshes:</span
          >
          <input
            class="form-control"
            type="number"
            v-model.number="refreshesFleet"
            min="0"
          />
          <span
            class="input-group-text c-help"
            title="How much of your daily energy used for farming other things (e.g. character shards)"
            >Daily Energy Used:</span
          >
          <input
            class="form-control"
            type="number"
            v-model.number="energySpentFleet"
            min="0"
            :max="145 + refreshesFleet * 120 + 45"
          />
        </div>
        <table class="table table-bordered table-dark table-sm table-striped">
          <thead>
            <tr class="text-center">
              <th width="20%">
                <div class="c-pointer" @click="sortBy('name')">
                  Salvage Name
                  <i class="fas mx-1" :class="sortIcon('name')"></i>
                </div>
                <input
                  class="form-control form-control-sm mx-auto my-1 w-75"
                  placeholder="Search"
                  v-model="searchName"
                />
              </th>
              <th width="20%" class="c-pointer" @click="sortBy('location')">
                Locations
                <i class="fas mx-1" :class="sortIcon('location')"></i>
              </th>
              <th width="20%" class="c-pointer" @click="sortBy('amount')">
                Amount
                <i class="fas mx-1" :class="sortIcon('amount')"></i>
              </th>
              <th width="10%" class="c-pointer" @click="sortBy('time')">
                Est. Time
                <i class="fas mx-1" :class="sortIcon('time')"></i>
              </th>
              <!-- <th width="15%">Actions</th> -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="salvage in filteredSalvageList" :key="salvage.base_id">
              <td class="text-center">
                <GearIcon :gear="salvage" />
              </td>
              <td>
                <ul class="m-0">
                  <li
                    v-for="(l, index) in gearLocation(
                      salvage.lookupMissionList
                    )"
                    :key="index"
                  >
                    {{ l }}
                  </li>
                </ul>
              </td>
              <td>
                <Salvage :salvage="salvage" />
              </td>
              <td class="text-center">{{ timeEstimation(salvage) }} Days</td>
              <!-- <td>
              <div class="btn-group btn-group-sm" role="group">
                <button type="button" class="btn btn-primary">Left</button>
                <button type="button" class="btn btn-secondary">Middle</button>
                <button type="button" class="btn btn-info">Right</button>
              </div>
            </td> -->
            </tr>
          </tbody>
        </table>
      </template>
      <template v-else>
        <h3>{{ unit.name }} is already at gear level 13.</h3>
      </template>
    </Loading>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapGetters } from "vuex";

import { Gear, Mission } from "../../types/gear";
import Salvage from "./owned.vue";
import GearIcon from "./gearIcon.vue";
import Loading from "../loading.vue";
import { UpdateItem } from "../../types/planner";

export default defineComponent({
  name: "GearPlannerComponent",
  components: { Salvage, GearIcon, Loading },
  data() {
    return {
      sortMethod: "name",
      sortDir: "asc",
      searchName: "",
    };
  },
  computed: {
    ...mapState("gear", ["gearList", "gearLocations", "requestState"]),
    ...mapState("unit", ["unit"]),
    ...mapGetters("gear", [
      "gearLocation",
      "gearOwnedCount",
      "findGearData",
      "gearOptions",
      "timeEstimation",
      "fullSalvageList",
      "totalDays",
    ]),
    ...mapGetters("unit", ["currentGearLevel"]),
    filteredSalvageList(): Gear[] {
      return this.fullSalvageList(this.unit, this.gearTarget)
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
            const locationsA = this.gearLocation(a.lookupMissionList);
            const locationsB = this.gearLocation(b.lookupMissionList);
            if (this.sortDir === "asc") {
              return locationsA[0] > locationsB[0] ? 1 : -1;
            } else {
              return locationsA[0] < locationsB[0] ? -1 : 1;
            }
          } else if (this.sortMethod === "amount") {
            if (this.sortDir === "asc") {
              return a.amount - b.amount;
            } else {
              return b.amount - a.amount;
            }
          } else if (this.sortMethod === "time") {
            const compareA = this.timeEstimation(a);
            const compareB = this.timeEstimation(b);
            if (this.sortDir === "asc") {
              return compareA - compareB;
            } else {
              return compareB - compareA;
            }
          }
          return 0;
        })
        .filter((gear: Gear) => {
          const name = gear.name.toLowerCase().replace(/\s/g, "");
          const compare = this.searchName.toLowerCase().replace(/\s/g, "");
          return name.includes(compare);
        });
    },
    gearTarget: {
      get(): number {
        return this.$store.getters["planner/gearTarget"](this.unit.id) || 13;
      },
      set(value: number) {
        const payload: UpdateItem = {
          type: "gear",
          value,
          unitId: this.unit.id,
        };
        this.$store.commit("planner/UPDATE_PLANNER_ITEM", payload);
      },
    },
    refreshesStandard: {
      get(): number {
        return this.$store.state.gear.refreshes.standard;
      },
      set(value: number) {
        this.$store.commit("gear/UPDATE_REFRESHES", {
          value,
          type: "standard",
        });
      },
    },
    refreshesFleet: {
      get(): number {
        return this.$store.state.gear.refreshes.fleet;
      },
      set(value: number) {
        this.$store.commit("gear/UPDATE_REFRESHES", {
          value,
          type: "fleet",
        });
      },
    },
    energySpentStandard: {
      get(): number {
        return this.$store.state.gear.energy.standard;
      },
      set(value: number) {
        this.$store.commit("gear/UPDATE_ENERGY", {
          value,
          type: "standard",
        });
      },
    },
    energySpentFleet: {
      get(): number {
        return this.$store.state.gear.energy.fleet;
      },
      set(value: number) {
        this.$store.commit("gear/UPDATE_ENERGY", {
          value,
          type: "fleet",
        });
      },
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
.gear-header {
  select {
    width: 115px;
    font-size: 1.25rem;
  }
}

table {
  thead {
    tr {
      vertical-align: top;
    }
  }
}

.collapse-header {
  text-shadow: 2px 2px 2px black;

  a {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}

.energy-text {
  width: 130px;
  display: block;
}
</style>
