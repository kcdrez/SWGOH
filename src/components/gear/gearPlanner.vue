<template>
  <div>
    <div class="collapse-header section-header">
      <h3 class="w-100" data-bs-toggle="collapse" href="#gearSection">
        <div class="d-inline">Gear Planner</div>
      </h3>
      <i
        class="far fa-question-circle show-help"
        title="Click to view the assumptions this calculator makes"
        data-bs-toggle="modal"
        data-bs-target="#gearAssumptionsModal"
      ></i>
    </div>
    <div id="gearSection" class="collapse" ref="gearSection">
      <template v-if="currentGearLevel(unit) < maxGearLevel">
        <div class="gear-header">
          <div class="current-level">
            Current Gear Level: <b>{{ currentGearLevel(unit) }}</b>
          </div>
          <div class="target-level">
            Target Level:
            <select v-model.number="gearTarget">
              <option
                v-for="num in gearOptions(unit.gear_level)"
                :value="num"
                :key="num"
              >
                Gear {{ num }}
              </option>
            </select>
          </div>
        </div>
        <Timestamp
          class="time-estimate"
          label="Estimated completion:"
          :title="$filters.daysFromNow(totalDays(unit))"
          :displayText="$filters.pluralText(totalDays(unit), 'day')"
          displayClasses="d-inline"
        />
        <div class="standard-energy-container">
          <div class="input-group input-group-sm">
            <span
              class="input-group-text c-help energy-text"
              title="Energy used on Light and Dark side tables"
              >Standard Energy:</span
            >
            <span
              class="input-group-text c-help refresh-text"
              title="How many times you refresh the energy using crystals per day"
              >Daily Refreshes:</span
            >
            <input
              class="form-control refresh-input"
              type="number"
              v-model.number="refreshesStandard"
              min="0"
            />
            <span
              class="input-group-text c-help energy-spent-text"
              title="How much of your daily energy used for farming other things (i.e. character shards)"
              >Daily Energy Used:</span
            >
            <input
              class="form-control energy-spent-input"
              type="number"
              v-model.number="energySpentStandard"
              min="0"
              :max="145 + refreshesStandard * 120 + 135"
            />
          </div>
        </div>
        <div class="fleet-energy-container">
          <div class="input-group input-group-sm">
            <span
              class="input-group-text c-help energy-text"
              title="Energy used on fleet/ship nodes"
              >Fleet Energy:</span
            >
            <span
              class="input-group-text c-help refresh-text"
              title="How many times you refresh the fleet energy using crystals per day"
              >Daily Refreshes:</span
            >
            <input
              class="form-control refresh-input"
              type="number"
              v-model.number="refreshesFleet"
              min="0"
            />
            <span
              class="input-group-text c-help energy-spent-text"
              title="How much of your daily energy used for farming other things (e.g. character shards)"
              >Daily Energy Used:</span
            >
            <input
              class="form-control energy-spent-input"
              type="number"
              v-model.number="energySpentFleet"
              min="0"
              :max="145 + refreshesFleet * 120 + 45"
            />
          </div>
        </div>
        <GearTable :gearList="fullSalvageList(this.unit, this.gearTarget)" />
      </template>
      <template v-else>
        <h3 class="mb-0">
          {{ unit.name }} is already at gear level {{ maxGearLevel }}.
        </h3>
      </template>
    </div>
    <div class="modal fade" id="gearAssumptionsModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Gear Calculator Assumptions</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <ul>
              <li>
                Assumes the cheapest (by energy) node is farmed (e.g. if salvage
                is obtainable in both Normal and Hard nodes, the Normal node
                will be used in calculation).
              </li>
              <li>
                For gear obtained from Daily Challenges, it is assumed that an
                average of 60 per week is obtained.
              </li>
              <li>
                Gear drop rate is 20% per node. There a handful that are only
                10%. This will be addressed in a future update.
              </li>
              <li>
                The time estimation is based solely on getting gear from node
                farming and does not account for gear obtained in any other
                method (TW, TB, GAC, stores, etc.). A future version of this
                tool may account for some of these things.
              </li>
            </ul>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapGetters, mapActions } from "vuex";

import { UpdateItem } from "../../types/planner";
import GearTable from "./gearTable.vue";
import { loadingState } from "../../types/loading";
import { setupEvents } from "../../utils";
import Timestamp from "../timestamp.vue";

export default defineComponent({
  name: "GearPlannerComponent",
  components: { GearTable, Timestamp },
  computed: {
    ...mapState("gear", ["maxGearLevel"]),
    ...mapState("unit", ["unit"]),
    ...mapGetters("gear", ["gearOptions", "fullSalvageList", "totalDays"]),
    ...mapGetters("unit", ["currentGearLevel"]),
    ...mapGetters(["someLoading"]),
    ...mapState(["collapseSections"]),
    requestState(): loadingState {
      return this.someLoading(["gear", "unit"]);
    },
    gearTarget: {
      get(): number {
        return (
          this.$store.getters["planner/gearTarget"](this.unit.id) ||
          this.maxGearLevel
        );
      },
      set(value: number) {
        const payload: UpdateItem = {
          type: "gear",
          value,
          unitId: this.unit.id,
        };
        this.$store.dispatch("planner/updatePlannerTarget", payload);
      },
    },
    refreshesStandard: {
      get(): number {
        return this.$store.state.gear.refreshes.standard;
      },
      set(value: number) {
        this.$store.dispatch("gear/updateRefreshes", {
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
        this.$store.dispatch("gear/updateRefreshes", {
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
        this.$store.dispatch("gear/updateEnergy", {
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
        this.$store.dispatch("gear/updateEnergy", {
          value,
          type: "fleet",
        });
      },
    },
  },
  methods: {
    ...mapActions(["toggleCollapse"]),
  },
  mounted() {
    setupEvents(this.$refs.gearSection as HTMLElement, "gearPlanner");
  },
});
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";

.gear-header,
.time-estimate {
  font-size: 1.25rem;
  margin: 0.25rem 0;
}

.gear-header {
  select {
    width: 115px;
  }

  @media only screen and (min-width: 600px) and (max-width: 1200px) {
    display: flex;
    justify-content: space-around;
  }

  @media only screen and (min-width: 1200px) {
    display: flex;
    justify-content: center;

    .target-level,
    .current-level {
      margin: 0 2rem;
    }
  }

  @media only screen and (max-width: 600px) {
    text-align: center;

    .target-level {
      margin-top: 0.25rem;
    }
  }
}

.time-estimate {
  text-align: center;

  ::v-deep(span) {
    font-weight: bold;
  }
}

.standard-energy-container,
.fleet-energy-container {
  margin-bottom: 1rem;

  .energy-text {
    background: $dark;
    color: $light;
    width: 130px;
    display: block;
  }

  .refresh-text,
  .energy-spent-text {
    background: $gray-4;
    color: $light;
  }

  @media only screen and (min-width: 1300px) {
    width: 48%;
    display: inline-block;
  }

  @media only screen and (max-width: 680px) {
    .input-group {
      display: block;

      * {
        width: 100%;
      }

      .energy-text {
        border-radius: 0.2rem 0.2rem 0 0 !important;
      }
      .energy-spent-input {
        border-radius: 0 0 0.2rem 0.2rem !important;
      }

      .refresh-text,
      .energy-spent-text,
      .energy-spent-input,
      input {
        display: block;
        border-top: none;
        text-align: center;
        //everything except the first element is off so the following is used to compensate :shrug:
        position: relative;
        left: 1px;
      }
    }
  }
}

.standard-energy-container {
  @media only screen and (min-width: 1300px) {
    margin-right: 1rem;
  }
}

.fleet-energy-container {
  @media only screen and (min-width: 1300px) {
    margin-left: 1rem;
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
  display: flex;
  align-items: center;

  a {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}

.show-help {
  cursor: pointer;
  color: $primary-light-1;
  font-size: 1.5rem;
  position: relative;
  left: calc(-50% + 100px);

  &:hover {
    color: $primary-light-2;
  }
}
</style>
