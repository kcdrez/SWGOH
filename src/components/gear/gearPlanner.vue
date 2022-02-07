<template>
  <div v-if="!unit.is_ship && currentGearLevel(unit) < maxGearLevel">
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
      <EnergySpent showFleet showStandard />
      <GearTable
        :gearList="fullSalvageList(this.unit, this.gearTarget)"
        showHeader
      />
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
import EnergySpent from "../energySpent.vue";
import { loadingState } from "../../types/loading";
import { setupEvents } from "../../utils";
import Timestamp from "../timestamp.vue";

export default defineComponent({
  name: "GearPlannerComponent",
  components: { GearTable, Timestamp, EnergySpent },
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
  },
  methods: {
    ...mapActions(["toggleCollapse"]),
  },
  mounted() {
    if (
      !this.unit.is_ship &&
      this.currentGearLevel(this.unit) < this.maxGearLevel
    ) {
      setupEvents(this.$refs.gearSection as HTMLElement, "gearPlanner");
    }
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
