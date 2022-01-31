<template>
  <div class="container general-planner-page">
    <table class="table table-bordered table-dark table-sm table-striped">
      <thead>
        <tr class="text-center align-middle">
          <th width="20%">
            <div class="c-pointer" @click="sortBy('name')">
              Unit Name
              <i class="fas mx-1" :class="sortIcon('name')"></i>
            </div>
            <input
              class="form-control form-control-sm mx-auto my-1 w-75"
              placeholder="Search"
              v-model="searchName"
            />
          </th>
          <th width="10%" class="c-pointer" @click="sortBy('curLevel')">
            Current Level
            <i class="fas mx-1" :class="sortIcon('curLevel')"></i>
          </th>
          <th width="10%" class="c-pointer" @click="sortBy('targetLevel')">
            Target Level
            <i class="fas mx-1" :class="sortIcon('targetLevel')"></i>
          </th>
          <!-- <th width="20%" class="c-pointer" @click="sortBy('zeta')">
            Zetas
            <i class="fas mx-1" :class="sortIcon('zeta')"></i>
          </th> -->
          <!-- <th width="10%" class="c-pointer" @click="sortBy('unlock')">
            Est. 7*
            <i class="fas mx-1" :class="sortIcon('unlock')"></i>
          </th> -->
          <!-- <th width="10%" class="c-pointer" @click="sortBy('estZeta')">
            Est. Zetas
            <i class="fas mx-1" :class="sortIcon('estZeta')"></i>
          </th> -->
          <th width="15%" class="c-pointer" @click="sortBy('estGear')">
            Est. Gear Level
            <i class="fas mx-1" :class="sortIcon('estGear')"></i>
          </th>
          <th width="15%" class="c-pointer" @click="sortBy('estRelic')">
            Est. Relic Level
            <i class="fas mx-1" :class="sortIcon('estRelic')"></i>
          </th>
          <th width="15%" class="c-pointer" @click="sortBy('completed')">
            Est. Completed Date
            <i class="fas mx-1" :class="sortIcon('completed')"></i>
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="unit in unitList" :key="unit.id">
          <td class="text-center">
            <router-link
              :to="{ name: 'UnitPage', params: { unitId: unit.id } }"
              >{{ unit.name }}</router-link
            >
          </td>
          <td class="text-center">{{ getCurLevel(unit) }}</td>
          <td class="text-center">
            <select
              class="form-control form-control-sm mb-1"
              :value="unit.gearTarget"
              @input="changeTarget(unit, 'gear', $event)"
              v-if="unit.gear_level < maxGearLevel"
            >
              <option
                v-for="num in gearOptions(unit.gear_level)"
                :value="num"
                :key="num"
              >
                Gear {{ num }}
              </option>
            </select>
            <select
              :value="unit.relicTarget"
              @input="changeTarget(unit, 'relic', $event)"
              class="form-control form-control-sm"
            >
              <option
                v-for="num in relicOptions(unit.relic_tier)"
                :value="num"
                :key="num"
              >
                Relic {{ num }}
              </option>
            </select>
          </td>
          <td class="text-center">
            {{ $filters.dateTime(gearTotalDays(unit)) }}
          </td>
          <td class="text-center">
            {{ $filters.dateTime(relicTotalDays(unit)) }}
          </td>
          <td class="text-center">
            {{ $filters.dateTime(relicTotalDays(unit) + gearTotalDays(unit)) }}
          </td>
          <td>
            <div
              class="btn-group btn-group-sm d-block text-center"
              role="group"
            >
              <button
                type="button"
                class="btn btn-danger"
                title="Remove from general planner"
                @click="remove(unit)"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <GearTable :gearList="fullGearList" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapActions, mapGetters } from "vuex";

import Loading from "../components/loading.vue";
import Error from "../components/error.vue";
import { Unit } from "../types/unit";
import { UnitPlannerItem, UpdateItem } from "../types/planner";
import GearTable from "../components/gear/gearTable.vue";
import { Gear } from "../types/gear";

export default defineComponent({
  name: "GeneralPlannerPage",
  components: { Loading, Error, GearTable },
  data() {
    return {
      sortDir: "",
      sortMethod: "",
      searchName: "",
    };
  },
  computed: {
    ...mapGetters("planner", ["unitList", "gearTarget"]),
    ...mapGetters("unit", ["currentGearLevel"]),
    ...mapGetters("gear", {
      gearOptions: "gearOptions",
      gearTotalDays: "totalDays",
      fullSalvageListByUnit: "fullSalvageList",
    }),
    ...mapGetters("relic", {
      relicOptions: "relicOptions",
      relicTotalDays: "totalDays",
    }),
    ...mapState("gear", ["maxGearLevel"]),
    fullGearList(): Gear[] {
      const list: Gear[] = [];
      this.unitList.forEach((unit: Unit) => {
        const unitGearList = this.fullSalvageListByUnit(
          unit,
          this.gearTarget(unit.id)
        );
        unitGearList.forEach((gear: Gear) => {
          const match = list.find((el) => gear.id === el.id);
          if (match) {
            match.amount += gear.amount;
          } else {
            list.push(gear);
          }
        });
      });
      return list;
    },
  },
  methods: {
    ...mapActions("planner", ["removeUnit"]),
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
    getCurLevel(unit: UnitPlannerItem & Unit): string {
      const gearLevel = this.currentGearLevel(unit);
      if (gearLevel < this.maxGearLevel) {
        return `Gear ${gearLevel}`;
      } else if (unit.relic_tier > 0) {
        return `Relic ${unit.relic_tier}`;
      } else {
        return `Gear ${this.maxGearLevel}`;
      }
    },
    changeTarget(
      unit: UnitPlannerItem & Unit,
      type: "gear" | "relic",
      event: any
    ) {
      const { value } = event.target;
      const payload: UpdateItem = {
        type,
        value: Number(value),
        unitId: unit.id,
      };
      this.$store.dispatch("planner/updatePlannerTarget", payload);
    },
    remove(unit: Unit & UnitPlannerItem) {
      this.removeUnit(unit.id);
      this.$toast(
        `${unit.name} was successfully removed from the general planner`,
        {
          positionY: "top",
          class: "toast-success",
        }
      );
    },
  },
  async created() {},
});
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";

.general-planner-page {
  max-width: 90%;
}
</style>
