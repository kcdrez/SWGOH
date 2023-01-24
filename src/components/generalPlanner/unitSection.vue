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
      <SwgohTable :table="{ header, body }" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from "vue";
import { mapActions } from "vuex";

import { UnitPlannerItem } from "types/planner";
import { Unit } from "types/unit";
import { maxGearLevel } from "types/gear";
import {
  setupColumnEvents,
  setupEvents,
  setupSimpleView,
  setupSorting,
} from "utils";
import { iHeaderCell, iTableBody, iTableHead } from "types/general";

const storageKey = "unitSection";

export default defineComponent({
  name: "UnitSection",
  setup() {
    const { simpleView } = setupSimpleView(storageKey);
    const { sortDir, sortMethod, sortBy, sortIcon } = setupSorting(storageKey);
    const selectedColumns: Ref<string[]> = ref([]);
    const { showCol } = setupColumnEvents(selectedColumns);

    return {
      sortDir,
      sortMethod,
      sortBy,
      sortIcon,
      simpleView,
      selectedColumns,
      showCol,
    };
  },
  props: {
    units: {
      type: Array as () => Unit[],
      required: true,
    },
  },
  data() {
    return {
      maxGearLevel,
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
        } else if (this.sortMethod === "gearDate") {
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
    header(): iTableHead {
      return {
        classes: "sticky-header show-on-mobile",
        sortMethod: this.sortMethod,
        sortDir: this.sortDir,
        methodChange: (val: string) => {
          this.sortMethod = val;
        },
        directionChange: (val: "asc" | "desc") => {
          this.sortDir = val;
        },
        headers: [
          {
            cells: [
              {
                label: "Name",
                show: this.showCol("name"),
                sortMethodShow: true,
                icon: this.sortIcon("name"),
                value: "name",
                click: () => {
                  this.sortBy("name");
                },
              },
              {
                label: "Current Level",
                show: this.showCol("curLevel"),
                sortMethodShow: true,
                icon: this.sortIcon("curLevel"),
                value: "curLevel",
                click: () => {
                  this.sortBy("curLevel");
                },
              },
              {
                label: "Target Level",
                show: this.showCol("targetLevel"),
                sortMethodShow: true,
                icon: this.sortIcon("targetLevel"),
                value: "targetLevel",
                click: () => {
                  this.sortBy("targetLevel");
                },
              },
              {
                label: "Est. Gear Date",
                show: this.showCol("gearDate"),
                sortMethodShow: true,
                icon: this.sortIcon("gearDate"),
                value: "gearDate",
                click: () => {
                  this.sortBy("gearDate");
                },
              },
              {
                label: "Est. Relic Date",
                show: this.showCol("estRelic"),
                sortMethodShow: true,
                icon: this.sortIcon("estRelic"),
                value: "estRelic",
                click: () => {
                  this.sortBy("estRelic");
                },
              },
              {
                label: "Est. Completed Date",
                show: this.showCol("completed"),
                sortMethodShow: true,
                icon: this.sortIcon("completed"),
                value: "completed",
                click: () => {
                  this.sortBy("completed");
                },
              },
              {
                label: "Actions",
                show: this.showCol("actions"),
                value: "actions",
              },
            ],
          },
        ],
      };
    },
    body(): iTableBody {
      return {
        classes: "align-middle text-center",
        rows: this.unitList.map((unit: Unit) => {
          return {
            cells: [
              {
                type: "unit",
                data: {
                  unit,
                  isLink: true,
                  hideImage: this.simpleView,
                },
                show: this.showCol("name"),
              },
              {
                show: this.showCol("curLevel"),
                type: "unitLevel",
                data: {
                  classes: "justify-content-center",
                  type: "Relic",
                  unitId: unit.id,
                },
              },
              {
                show: this.showCol("targetLevel"),
                type: "unitLevel",
                edit: true,
                label: "Target Level:",
                data: {
                  unitId: unit.id,
                  type: "Relic",
                },
              },
              {
                show: this.showCol("gearDate"),
                type: "time",
                label: "Est. Gear Date:",
                classes:
                  unit.gearTotalDays === 0 && !unit.isShip ? "hidden-sm" : "",
                data: {
                  timestamp: unit.gearTotalDays,
                  classes: "d-inline",
                },
              },
              {
                show: this.showCol("estRelic"),
                type: "time",
                label: "Est. Gear Date:",
                classes:
                  unit.relicTotalDays === 0 && !unit.isShip ? "hidden-sm" : "",
                data: {
                  timestamp: unit.relicTotalDays,
                  classes: "d-inline",
                },
              },
              {
                show: this.showCol("completed"),
                type: "time",
                label: "Est. Completed Date:",
                classes:
                  unit.relicTotalDays === 0 && !unit.isShip ? "hidden-sm" : "",
                data: {
                  timestamp: unit.relicTotalDays + unit.gearTotalDays,
                  classes: "d-inline",
                },
              },
              {
                show: this.showCol("actions"),
                type: "buttons",
                data: {
                  buttons: [
                    {
                      click: () => {
                        this.remove(unit);
                      },
                      icon: "fas fa-trash",
                      classes: "btn btn-danger",
                      title: "Remove unit from General Planner",
                    },
                  ],
                },
              },
            ],
          };
        }),
      };
    },
    cols(): iHeaderCell[] {
      return this.header.headers.reduce((acc: iHeaderCell[], row) => {
        row.cells.forEach((cell) => acc.push(cell));
        return acc;
      }, []);
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
