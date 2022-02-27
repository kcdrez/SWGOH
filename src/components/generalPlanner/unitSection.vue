<template>
  <div>
    <div class="collapse-header section-header">
      <h3>
        <div data-bs-toggle="collapse" href="#unit-section-table">
          Unit Summary
        </div>
      </h3>
    </div>
    <div id="unit-section-table" class="collapse" ref="unitSection">
      <MultiSelect
        class="select-columns"
        :options="cols"
        storageKey="unitTable"
        @checked="selectedColumns = $event"
      />
      <table
        class="
          table table-bordered table-dark table-sm table-striped
          m-0
          swgoh-table
        "
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
          <tr v-for="unit in fullUnitList" :key="unit.id">
            <td class="text-center" v-if="showCol('name')">
              <router-link
                :to="{ name: 'UnitPage', params: { unitId: unit.id } }"
                >{{ unit.name }}</router-link
              >
            </td>
            <td class="text-center" v-if="showCol('curLevel')">
              <span class="row-label">Current Level:</span>
              {{ getCurLevel(unit) }}
            </td>
            <td class="text-center" v-if="showCol('targetLevel')">
              <span class="row-label">Target Level:</span>
              <div v-if="unit.is_ship">-</div>
              <template v-else>
                <select
                  class="form-control form-control-sm mb-1"
                  :value="unit.gearTarget"
                  @input="changeTarget(unit, 'gear', $event)"
                  v-if="(unit.gear_level || 0) < maxGearLevel"
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
              </template>
            </td>
            <td
              class="text-center"
              :class="{
                'hidden-sm': gearTotalDays(unit) === 0 && !unit.is_ship,
              }"
              v-if="showCol('gearDate')"
            >
              <span class="row-label">Est. Gear Level:</span>
              <Timestamp
                :timeLength="gearTotalDays(unit)"
                :displayText="$filters.pluralText(gearTotalDays(unit), 'day')"
                :title="$filters.daysFromNow(gearTotalDays(unit))"
                displayClasses="d-inline"
              />
            </td>
            <td
              class="text-center"
              :class="{
                'hidden-sm': relicTotalDays(unit.id) === 0 && !unit.is_ship,
              }"
              v-if="showCol('relicDate')"
            >
              <span class="row-label">Est. Relic Level:</span>
              <Timestamp
                :timeLength="relicTotalDays(unit.id, unit.relic_tier)"
                :displayText="
                  $filters.pluralText(
                    relicTotalDays(unit.id, unit.relic_tier),
                    'day'
                  )
                "
                :title="
                  $filters.daysFromNow(relicTotalDays(unit.id, unit.relic_tier))
                "
                displayClasses="d-inline"
              />
            </td>
            <td class="text-center" v-if="showCol('totalDate')">
              <span class="row-label">Est. Total Level:</span>
              <Timestamp
                :timeLength="
                  relicTotalDays(unit.id, unit.relic_tier) +
                  gearTotalDays(unit, unit.relicTier)
                "
                :displayText="
                  $filters.pluralText(
                    relicTotalDays(unit.id, unit.relic_tier) +
                      gearTotalDays(unit),
                    'day'
                  )
                "
                :title="
                  $filters.daysFromNow(
                    relicTotalDays(unit.id, unit.relic_tier) +
                      gearTotalDays(unit)
                  )
                "
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
import { mapActions, mapGetters, mapState } from "vuex";

import { UnitPlannerItem, UpdateItem } from "../../types/planner";
import { Unit } from "../../types/unit";
import { maxGearLevel } from "../../types/gear";
import { setupEvents } from "../../utils";
import Timestamp from "../timestamp.vue";

export default defineComponent({
  name: "UnitSection",
  components: { Timestamp },
  data() {
    return {
      sortDir: "asc",
      sortMethod: "name",
      searchText: "",
      maxGearLevel,
      selectedColumns: [],
    };
  },
  computed: {
    ...mapGetters("planner", ["fullUnitList"]),
    ...mapGetters("gear", {
      gearOptions: "gearOptions",
      gearTotalDays: "totalDays",
      currentGearLevel: "currentGearLevel",
    }),
    ...mapGetters("relic", {
      relicOptions: "relicOptions",
      relicTotalDays: "totalDays",
    }),
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
          value: "target",
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
    getCurLevel(unit: UnitPlannerItem & Unit): string {
      const gearLevel = this.currentGearLevel(unit);
      if (unit.is_ship) {
        return "-";
      } else if (gearLevel < this.maxGearLevel) {
        return `Gear ${gearLevel}`;
      } else if (unit.relic_tier > 0) {
        return `Relic ${unit.relic_tier}`;
      } else {
        return `Gear ${this.maxGearLevel}`;
      }
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
