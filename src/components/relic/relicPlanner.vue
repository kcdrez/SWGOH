<template>
  <div v-if="!unit.is_ship && relicLevel < maxRelicLevel">
    <div class="collapse-header section-header mt-3">
      <h3 class="w-100" data-bs-toggle="collapse" href="#relicSection">
        <div class="d-inline">Relic Planner</div>
      </h3>
    </div>
    <div id="relicSection" class="collapse" ref="relicSection">
      <div class="relic-header">
        <div class="current-level">
          Current Relic Level: <b>{{ relicLevel }}</b>
        </div>
        <div class="target-level">
          Target Level:
          <select v-model.number="relicTarget">
            <option
              v-for="num in relicOptions(unit.relic_tier)"
              :value="num"
              :key="num"
            >
              Relic {{ num }}
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
      <EnergySpent showCantina />
      <RelicTable
        :relicList="relicList"
        :targetLevels="[{ level: relicLevel, target: relicTarget }]"
        showHeader
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapState } from "vuex";

import RelicTable from "./relicTable.vue";
import Timestamp from "../timestamp.vue";
import EnergySpent from "../energySpent.vue";
import { UpdateItem } from "../../types/planner";
import { loadingState } from "../../types/loading";
import { Relic, maxRelicLevel } from "../../types/relic";
import { setupEvents } from "../../utils";

export default defineComponent({
  name: "RelicPlannerComponent",
  components: { RelicTable, Timestamp, EnergySpent },
  data() {
    return {
      maxRelicLevel,
    };
  },
  computed: {
    ...mapState("relic", ["relicConfig"]),
    ...mapState("unit", ["unit"]),
    ...mapGetters("relic", ["relicOptions", "totalDays", "currentRelicLevel"]),
    ...mapGetters(["someLoading"]),
    requestState(): loadingState {
      return this.someLoading(["relic", "unit"]);
    },
    relicLevel(): number {
      return this.currentRelicLevel(this.unit);
    },
    relicTarget: {
      get(): number {
        return this.$store.getters["planner/relicTarget"](this.unit.id);
      },
      set(value: number) {
        const payload: UpdateItem = {
          type: "relic",
          value,
          unitId: this.unit.id,
        };
        this.$store.dispatch("planner/updatePlannerTarget", payload);
      },
    },
    relicList(): Relic[] {
      return Object.values(this.relicConfig);
    },
  },
  mounted() {
    if (!this.unit.is_ship && this.relicLevel < maxRelicLevel) {
      setupEvents(this.$refs.relicSection as HTMLElement, "relicPlanner");
    }
  },
});
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";

.relic-header,
.time-estimate {
  font-size: 1.25rem;
  margin: 0.25rem 0;
}

.relic-header {
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

  a {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
