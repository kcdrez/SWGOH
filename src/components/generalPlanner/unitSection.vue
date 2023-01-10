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
              <SortMethods
                :sortByOptions="sortByOptions"
                :sortMethod="sortMethod"
                :sortDir="sortDir"
                showSearch
                @methodChange="sortMethod = $event"
                @directionChange="sortDir = $event"
                @searchChange="searchText = $event"
              />
            </th>
          </tr>
          <ColumnHeaders
            class="text-center align-middle"
            :headers="headers"
            @searchChange="searchText = $event"
          />
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
                :alignment="unit.alignment"
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
              <span class="row-label">Est. Gear Date:</span>
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
              v-if="showCol('estRelic')"
            >
              <span class="row-label">Est. Relic Date:</span>
              <Timestamp
                :timeLength="unit.relicTotalDays"
                displayClasses="d-inline"
              />
            </td>
            <td class="align-middle text-center" v-if="showCol('completed')">
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
          <tr>
            <td :colspan="totalColSpan" class="text-center align-middle">
              Total
            </td>
            <td class="text-center align-middle" v-if="showCol('gearDate')">
              <span class="row-label">Est. Gear Date:</span>
              <Timestamp :timeLength="total.gear" displayClasses="d-inline" />
            </td>
            <td class="text-center align-middle" v-if="showCol('estRelic')">
              <span class="row-label">Est. Relic Date:</span>
              <Timestamp :timeLength="total.relic" displayClasses="d-inline" />
            </td>
            <td class="text-center align-middle" v-if="showCol('completed')">
              <span class="row-label">Est. Completed Date:</span>
              <Timestamp
                :timeLength="total.gear + total.relic"
                displayClasses="d-inline"
              />
            </td>
            <td v-if="showCol('actions')" class="hidden-sm"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions } from "vuex";

import { UnitPlannerItem } from "types/planner";
import { Unit } from "types/unit";
import { maxGearLevel } from "types/gear";
import { setupEvents, setupSimpleView, setupSorting } from "utils";
import Timestamp from "components/timestamp.vue";
import GearText from "components/gear/gearText.vue";
import RelicLevelIcon from "components/units/relicLevelIcon.vue";
import UnitIcon from "components/units/unitIcon.vue";
import { iHeader } from "types/general";

const storageKey = "unitSection";

export default defineComponent({
  name: "UnitSection",
  setup() {
    const { simpleView } = setupSimpleView(storageKey);
    const { sortDir, sortMethod, searchText, sortBy, sortIcon } =
      setupSorting(storageKey);

    return {
      sortDir,
      sortMethod,
      searchText,
      sortBy,
      sortIcon,
      simpleView,
    };
  },
  components: { Timestamp, GearText, RelicLevelIcon, UnitIcon },
  props: {
    units: {
      type: Array as () => Unit[],
      required: true,
    },
  },
  data() {
    return {
      maxGearLevel,
      selectedColumns: [], //todo
      sortByOptions: [
        {
          value: "name",
          label: "Name",
        },
        {
          value: "curLevel",
          label: "Current Level",
        },
        {
          value: "targetLevel",
          label: "Target Level",
        },
        {
          value: "estGear",
          label: "Estimated Gear Time",
        },
        {
          value: "estRelic",
          label: "Estimated Relic Time",
        },
        {
          value: "completed",
          label: "Estimated Completed",
        },
      ],
    };
  },
  computed: {
    unitList(): Unit[] {
      return this.units.sort((a: Unit, b: Unit) => {
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
          value: "estRelic",
        },
        {
          text: "Est. Total Date",
          value: "completed",
        },
        {
          text: "Actions",
          value: "actions",
        },
      ];
      return list;
    },
    headers(): iHeader[] {
      return [
        {
          label: "Name",
          show: this.showCol("name"),
          icon: this.sortIcon("name"),
          click: () => {
            this.sortBy("name");
          },
        },
        {
          label: "Current Level",
          show: this.showCol("curLevel"),
          icon: this.sortIcon("curLevel"),
          click: () => {
            this.sortBy("curLevel");
          },
        },
        {
          label: "Target Level",
          show: this.showCol("targetLevel"),
          icon: this.sortIcon("targetLevel"),
          click: () => {
            this.sortBy("targetLevel");
          },
        },
        {
          label: "Est. Gear Date",
          show: this.showCol("gearDate"),
          icon: this.sortIcon("gearDate"),
          click: () => {
            this.sortBy("gearDate");
          },
        },
        {
          label: "Est. Relic Date",
          show: this.showCol("estRelic"),
          icon: this.sortIcon("estRelic"),
          click: () => {
            this.sortBy("estRelic");
          },
        },
        {
          label: "Est. Completed Date",
          show: this.showCol("completed"),
          icon: this.sortIcon("completed"),
          click: () => {
            this.sortBy("completed");
          },
        },
        {
          label: "Actions",
          show: this.showCol("actions"),
        },
      ];
    },
    total(): { gear: number; relic: number } {
      return this.unitList.reduce(
        (total: any, unit: Unit) => {
          total.gear += unit.gearTotalDays;
          total.relic += unit.relicTotalDays;
          return total;
        },
        {
          gear: 0,
          relic: 0,
        }
      );
    },
    totalColSpan(): number {
      return [
        this.showCol("name"),
        this.showCol("curLevel"),
        this.showCol("targetLevel"),
      ].filter((x) => !!x).length;
    },
  },
  methods: {
    ...mapActions("planner", ["removeUnit"]),
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
    setupEvents(this.$refs.unitSection as HTMLElement, storageKey);
  },
});
</script>

<style lang="scss" scoped>
@import "styles/variables.scss";

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
