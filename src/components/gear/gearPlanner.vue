<template>
  <div v-if="!unit.isShip && unit.gearLevel < maxGearLevel">
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
          <GearText :level="unit.gearLevel" />
        </div>
        <div class="target-level">
          Target Level:
          <select v-model.number="unit.gearTarget">
            <option v-for="num in unit.gearOptions" :value="num" :key="num">
              Gear {{ num }}
            </option>
          </select>
        </div>
      </div>
      <Timestamp
        class="time-estimate"
        label="Estimated completion:"
        :title="$filters.daysFromNow(unit.gearTotalDays)"
        :displayText="$filters.pluralText(unit.gearTotalDays, 'day')"
        displayClasses="d-inline"
      />
      <EnergySpent showFleet showStandard />
      <MultiSelect
        class="select-columns"
        :options="cols"
        :storageKey="storageKey + 'Columns'"
        @checked="selectedColumns = $event"
      />
      <GearTable
        :gearList="unit.fullSalvageList"
        :selectedColumns="selectedColumns"
        :storageKey="storageKey + 'Table'"
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
import { mapState, mapGetters } from "vuex";

import { loadingState } from "../../types/loading";
import { maxGearLevel } from "../../types/gear";
import GearTable from "./gearTable.vue";
import EnergySpent from "../energySpent.vue";
import GearText from "./gearText.vue";
import { setupEvents } from "../../utils";
import Timestamp from "../timestamp.vue";

const storageKey = "gearPlanner";

export default defineComponent({
  name: "GearPlannerComponent",
  components: { GearTable, Timestamp, EnergySpent, GearText },
  data() {
    return {
      maxGearLevel,
      selectedColumns: [],
      storageKey,
    };
  },
  computed: {
    ...mapState("unit", ["unit"]),
    ...mapGetters(["someLoading"]),
    ...mapState(["collapseSections"]),
    requestState(): loadingState {
      return this.someLoading(["gear", "unit"]);
    },
    cols(): { text: string; value: any }[] {
      const list = [
        {
          text: "Icon",
          value: "icon",
        },
        {
          text: "Name",
          value: "name",
        },
        {
          text: "Mark",
          value: "mark",
        },
        {
          text: "Locations",
          value: "locations",
        },
        {
          text: "Amount Owned",
          value: "owned",
        },
        {
          text: "Amount Needed",
          value: "needed",
        },
        {
          text: "Progress",
          value: "progress",
        },
        {
          text: "Estimated Time",
          value: "time",
        },
        {
          text: "Actions",
          value: "actions",
        },
      ];
      return list;
    },
  },
  mounted() {
    if (!this.unit.isShip && this.unit.gearLevel < this.maxGearLevel) {
      setupEvents(this.$refs.gearSection as HTMLElement, storageKey);
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
