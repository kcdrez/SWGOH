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

export default defineComponent({
  name: "GearPlannerComponent",
  components: { GearTable },
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

.energy-text {
  width: 130px;
  display: block;
}
</style>
