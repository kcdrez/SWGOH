<template>
  <div v-if="unit.stars < 7">
    <div class="collapse-header section-header mt-3">
      <h3 class="w-100" data-bs-toggle="collapse" href="#shardSection">
        <div class="d-inline">Shard Planner</div>
      </h3>
    </div>
    <div id="shardSection" class="collapse" ref="shardSection">
      <h5 v-if="unit.nodes.length === 0" class="my-1 text-center">
        This unit is not currently farmable.
      </h5>
      <template v-else>
        <div class="shard-header">
          <div class="current-level">
            Current Star Level:
            <img
              v-for="index in unit.stars || 0"
              :key="index"
              src="images/star.png"
            />
            <!-- <b>{{ unit.stars || 0 }}</b> -->
          </div>
        </div>
        <Timestamp
          class="time-estimate"
          label="Estimated completion:"
          :title="$filters.daysFromNow(unit.shardTimeEstimation)"
          :displayText="$filters.pluralText(unit.shardTimeEstimation, 'day')"
          displayClasses="d-inline"
        />
        <EnergySpent showStandard showFleet showCantina />
        <ShardTable :units="[unit]" showHeader />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapGetters, mapActions } from "vuex";

import ShardTable from "./shardTable.vue";
import EnergySpent from "../energySpent.vue";
import { loadingState } from "../../types/loading";
import { setupEvents } from "../../utils";
import Timestamp from "../timestamp.vue";

export default defineComponent({
  name: "ShardPlannerComponent",
  components: { ShardTable, Timestamp, EnergySpent },
  computed: {
    ...mapState("unit", ["unit"]),
    ...mapGetters(["someLoading"]),
    ...mapState(["collapseSections"]),
    requestState(): loadingState {
      return this.someLoading(["unit"]);
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
  },
  methods: {
    ...mapActions(["toggleCollapse"]),
  },
  mounted() {
    if (this.unit.stars < 7) {
      setupEvents(this.$refs.shardSection as HTMLElement, "shardPlanner");
    }
  },
});
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";

.shard-header,
.time-estimate {
  font-size: 1.25rem;
  margin: 0.25rem 0;
}

.shard-header {
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

    .current-level {
      margin: 0 2rem;
    }
  }

  @media only screen and (max-width: 600px) {
    text-align: center;
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

.current-level {
  display: flex;
  align-items: center;
  justify-content: center;

  img:first-child {
    margin-left: 1rem;
  }
}
</style>
