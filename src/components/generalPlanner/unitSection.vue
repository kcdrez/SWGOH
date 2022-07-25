<template>
  <div>
    <div class="collapse-header section-header extended-2">
      <h3>
        <div data-bs-toggle="collapse" href="#unit-section-table">
          Unit Summary
        </div>
      </h3>
      <div class="toggles-container">
        <div class="simple-view-container">
          <Toggle v-model="simpleView" onLabel="Simple" offLabel="Advanced" />
        </div>
        <MultiSelect
          class="select-columns"
          :options="cols"
          storageKey="unitTable"
          @checked="selectedColumns = $event"
        />
      </div>
    </div>
    <div id="unit-section-table" class="collapse" ref="unitSection">
      <table
        class="table table-bordered table-dark table-sm table-striped m-0 swgoh-table"
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
                  <option value="curLevel">Current Level</option>
                  <option value="targetLevel">Target Level</option>
                  <option value="estGear">Estimated Gear Time</option>
                  <option value="estRelic">Estimated Relic Time</option>
                  <option value="completed">Estimated Completed</option>
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
              v-if="showCol('curLevel')"
              class="c-pointer"
              @click="sortBy('curLevel')"
            >
              Current Level
              <i class="fas mx-1" :class="sortIcon('curLevel')"></i>
            </th>
            <th
              v-if="showCol('targetLevel')"
              class="c-pointer"
              @click="sortBy('targetLevel')"
            >
              Target Level
              <i class="fas mx-1" :class="sortIcon('targetLevel')"></i>
            </th>
            <th
              v-if="showCol('gearDate')"
              class="c-pointer"
              @click="sortBy('estGear')"
            >
              Est. Gear Level
              <i class="fas mx-1" :class="sortIcon('estGear')"></i>
            </th>
            <th
              v-if="showCol('relicDate')"
              class="c-pointer"
              @click="sortBy('estRelic')"
            >
              Est. Relic Level
              <i class="fas mx-1" :class="sortIcon('estRelic')"></i>
            </th>
            <th
              v-if="showCol('totalDate')"
              class="c-pointer"
              @click="sortBy('completed')"
            >
              Est. Completed Date
              <i class="fas mx-1" :class="sortIcon('completed')"></i>
            </th>
            <th v-if="showCol('actions')">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="unit in unitList" :key="unit.id">
            <td class="align-middle text-center" v-if="showCol('name')">
              <UnitIcon :unit="unit" isLink :hideImage="simpleView" />
            </td>
            <td class="align-middle text-center" v-if="showCol('curLevel')">
              <GearText
                :level="unit.gearLevel"
                v-if="unit.gearLevel < maxGearLevel"
              />
              <RelicLevelIcon
                class="d-inline-block"
                :relicLevel="unit.relicLevel"
                :forceSide="unit.alignment"
                v-else
              />
            </td>
            <td class="align-middle text-center" v-if="showCol('targetLevel')">
              <span class="row-label">Target Level:</span>
              <div v-if="unit.isShip">-</div>
              <div class="d-flex" v-else>
                <select
                  class="form-control form-control-sm me-1"
                  v-model="unit.gearTarget"
                  v-if="unit.gearLevel < maxGearLevel"
                >
                  <option
                    v-for="num in unit.gearOptions"
                    :value="num"
                    :key="num"
                  >
                    Gear {{ num }}
                  </option>
                </select>
                <select
                  v-model="unit.relicTarget"
                  class="form-control form-control-sm"
                >
                  <option
                    v-for="num in unit.relicOptions"
                    :value="num"
                    :key="num"
                  >
                    Relic {{ num }}
                  </option>
                </select>
              </div>
            </td>
            <td
              class="align-middle text-center"
              :class="{
                'hidden-sm': unit.gearTotalDays === 0 && !unit.isShip,
              }"
              v-if="showCol('gearDate')"
            >
              <span class="row-label">Est. Gear Level:</span>
              <Timestamp
                :timeLength="unit.gearTotalDays"
                displayClasses="d-inline"
              />
            </td>
            <td
              class="align-middle text-center"
              :class="{
                'hidden-sm': unit.relicTotalDays === 0 && !unit.isShip,
              }"
              v-if="showCol('relicDate')"
            >
              <span class="row-label">Est. Relic Level:</span>
              <Timestamp
                :timeLength="unit.relicTotalDays"
                displayClasses="d-inline"
              />
            </td>
            <td class="align-middle text-center" v-if="showCol('totalDate')">
              <span class="row-label">Est. Completed Date:</span>
              <Timestamp
                :timeLength="unit.relicTotalDays + unit.gearTotalDays"
                displayClasses="d-inline"
              />
            </td>
            <td class="align-middle" v-if="showCol('actions')">
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
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";

import { UnitPlannerItem } from "../../types/planner";
import { Unit } from "../../types/unit";
import { maxGearLevel } from "../../types/gear";
import { setupEvents } from "../../utils";
import Timestamp from "../timestamp.vue";
import GearText from "../gear/gearText.vue";
import RelicLevelIcon from "../units/relicLevelIcon.vue";
import UnitIcon from "../units/unitIcon.vue";

export default defineComponent({
  name: "UnitSection",
  components: { Timestamp, GearText, RelicLevelIcon, UnitIcon },
  data() {
    return {
      sortDir: "asc",
      sortMethod: "name",
      searchText: "",
      maxGearLevel,
      selectedColumns: [],
      simpleView: JSON.parse(
        window.localStorage.getItem("unitSection") || "true"
      ),
    };
  },
  computed: {
    ...mapGetters("planner", ["fullUnitList"]),
    unitList(): Unit[] {
      return this.fullUnitList.sort((a: Unit, b: Unit) => {
        if (this.sortMethod === "name") {
          const compareA = a.name.toLowerCase();
          const compareB = b.name.toLowerCase();
          if (this.sortDir === "asc") {
            return compareA > compareB ? 1 : -1;
          } else {
            return compareA > compareB ? -1 : 1;
          }
        } else if (this.sortMethod === "curLevel") {
          const compareA =
            a.gearLevel === maxGearLevel
              ? a.relicLevel + maxGearLevel
              : a.gearLevel;
          const compareB =
            b.gearLevel === maxGearLevel
              ? b.relicLevel + maxGearLevel
              : b.gearLevel;
          if (this.sortDir === "asc") {
            return compareA > compareB ? 1 : -1;
          } else {
            return compareA > compareB ? -1 : 1;
          }
        } else if (this.sortMethod === "targetLevel") {
          const compareA =
            a.gearTarget === maxGearLevel
              ? a.relicTarget + maxGearLevel
              : a.gearTarget;
          const compareB =
            b.gearTarget === maxGearLevel
              ? b.relicTarget + maxGearLevel
              : b.gearTarget;
          if (this.sortDir === "asc") {
            return compareA > compareB ? 1 : -1;
          } else {
            return compareA > compareB ? -1 : 1;
          }
        } else if (this.sortMethod === "estGear") {
          const compareA = a.gearTotalDays === 0 ? Infinity : a.gearTotalDays;
          const compareB = b.gearTotalDays === 0 ? Infinity : b.gearTotalDays;
          if (this.sortDir === "asc") {
            return compareA > compareB ? 1 : -1;
          } else {
            return compareA > compareB ? -1 : 1;
          }
        } else if (this.sortMethod === "estRelic") {
          const compareA = a.relicTotalDays === 0 ? Infinity : a.relicTotalDays;
          const compareB = b.relicTotalDays === 0 ? Infinity : b.relicTotalDays;
          if (this.sortDir === "asc") {
            return compareA > compareB ? 1 : -1;
          } else {
            return compareA > compareB ? -1 : 1;
          }
        } else if (this.sortMethod === "completed") {
          let compareA = a.gearTotalDays + a.relicTotalDays;
          compareA = compareA === 0 ? Infinity : compareA;

          let compareB = b.gearTotalDays + b.relicTotalDays;
          compareB = compareB === 0 ? Infinity : compareB;

          if (this.sortDir === "asc") {
            return compareA > compareB ? 1 : -1;
          } else {
            return compareA > compareB ? -1 : 1;
          }
        }
        return 0;
      });
    },
    cols(): { text: string; value: any }[] {
      const list = [
        {
          text: "Name",
          value: "name",
        },
        {
          text: "Current Level",
          value: "curLevel",
        },
        {
          text: "Target Level",
          value: "targetLevel",
        },
        {
          text: "Est. Gear Date",
          value: "gearDate",
        },
        {
          text: "Est. Relic Date",
          value: "relicDate",
        },
        {
          text: "Est. Total Date",
          value: "totalDate",
        },
        {
          text: "Actions",
          value: "actions",
        },
      ];
      return list;
    },
  },
  watch: {
    simpleView(newVal) {
      window.localStorage.setItem("unitSection", newVal);
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
    remove(unit: Unit & UnitPlannerItem) {
      this.removeUnit(unit.id);
      this.$toast(
        `${unit.name} was successfully removed from the General Planner`,
        {
          positionY: "top",
          class: "toast-success",
        }
      );
    },
    showCol(key: string): boolean {
      return this.selectedColumns.some((x) => x === key);
    },
  },
  mounted() {
    setupEvents(this.$refs.unitSection as HTMLElement, "unitSection");
  },
});
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";

.swgoh-row {
  .target-container {
    select {
      margin: 0.5rem 0;
    }
    .target-level {
      text-align: center;
    }

    @media only screen and (min-width: 640px) {
      display: flex;
      align-items: center;

      select {
        margin: 0 0.5rem;
      }
      .target-level {
        min-width: 125px;
      }
    }
  }
}
</style>
