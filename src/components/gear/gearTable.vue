<template>
  <table class="table table-bordered table-dark table-sm table-striped">
    <thead>
      <tr class="text-center align-middle">
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
        <th width="15%">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="salvage in filteredSalvageList" :key="salvage.base_id">
        <td class="text-center">
          <GearIcon :gear="salvage" />
        </td>
        <td>
          <button
            class="btn btn-sm btn-info m-auto d-block"
            data-bs-toggle="collapse"
            :href="`#locations-${salvage.base_id}`"
          >
            Show/Hide Locations
          </button>
          <ul class="m-0 collapse" :id="`locations-${salvage.base_id}`">
            <li
              v-for="(l, index) in gearLocation(salvage.lookupMissionList)"
              :key="index"
            >
              {{ l }}
            </li>
          </ul>
        </td>
        <td>
          <Salvage :salvage="salvage" />
        </td>
        <td class="text-center">
          {{ $filters.dateTime(timeEstimation(salvage)) }}
        </td>
        <td>
          <div class="btn-group btn-group-sm d-block text-center" role="group">
            <button
              type="button"
              class="btn btn-warning text-dark"
              title="Mark this salvage as irrelevant, removing it from the planner estimation"
              @click="markRelevant(salvage, true)"
            >
              <i class="fas fa-toilet"></i>
            </button>
          </div>
        </td>
      </tr>
    </tbody>
    <thead
      class="c-pointer"
      data-bs-toggle="collapse"
      href="#irrelevantSection"
      title="Show/Hide irrelevant pieces"
    >
      <tr>
        <th colspan="5" class="text-center">Irrelevant Pieces</th>
      </tr>
    </thead>
    <tbody id="irrelevantSection" class="collapse">
      <tr v-for="salvage in irrelevantGear" :key="salvage.base_id">
        <td colspan="4" class="text-center"><GearIcon :gear="salvage" /></td>
        <td>
          <div class="btn-group btn-group-sm d-block text-center" role="group">
            <button
              type="button"
              class="btn btn-success"
              title="Mark this salvage as relevant, moving it back into the planner estimation"
              @click="markRelevant(salvage, false)"
            >
              <i class="fas fa-heart"></i>
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { mapActions, mapGetters, mapState } from "vuex";

import { Gear } from "../../types/gear";
import Salvage from "./owned.vue";
import GearIcon from "./gearIcon.vue";

export default defineComponent({
  name: "GearTable",
  components: { Salvage, GearIcon },
  props: {
    gearList: {
      required: true,
      type: Object as PropType<Gear[]>,
    },
  },
  data() {
    return {
      sortDir: "",
      sortMethod: "",
      searchName: "",
    };
  },
  computed: {
    ...mapGetters("gear", [
      "gearLocation",
      "timeEstimation",
      "fullSalvageList",
    ]),
    ...mapState("gear", ["gearConfig"]),
    filteredSalvageList(): Gear[] {
      return this.gearList
        .filter((gear: Gear) => {
          if (gear.base_id in this.gearConfig) {
            if (this.gearConfig[gear.base_id].irrelevant) {
              return false;
            }
          }
          const name = gear.name.toLowerCase().replace(/\s/g, "");
          const compare = this.searchName.toLowerCase().replace(/\s/g, "");
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
        });
    },
    irrelevantGear(): Gear[] {
      return this.gearList.filter((gear: Gear) => {
        if (gear.base_id in this.gearConfig) {
          if (this.gearConfig[gear.base_id].irrelevant) {
            return true;
          }
        }
        return false;
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
    markRelevant(salvage: Gear, isRelevant: boolean) {
      this.saveOwnedCount({
        base_id: salvage.base_id,
        count: salvage.owned,
        irrelevant: isRelevant,
      });
    },
  },
});
</script>