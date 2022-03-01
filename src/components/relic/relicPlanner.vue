<template>
  <div v-if="!unit.isShip && unit.relicLevel < maxRelicLevel">
    <div class="collapse-header section-header mt-3">
      <h3 class="w-100" data-bs-toggle="collapse" href="#relicSection">
        <div class="d-inline">Relic Planner</div>
      </h3>
    </div>
    <div id="relicSection" class="collapse" ref="relicSection">
      <div class="relic-header">
        <div class="current-level">
          <div>Current Relic Level:</div>
          <RelicIcon
            :relicLevel="unit.relicLevel"
            :forceSide="unit.alignment"
          />
        </div>
        <div class="target-level">
          Target Level:
          <select v-model.number="unit.relicTarget" class="mx-2">
            <option v-for="num in unit.relicOptions" :value="num" :key="num">
              Relic {{ num }}
            </option>
          </select>
        </div>
      </div>
      <Timestamp
        class="time-estimate"
        label="Estimated completion:"
        :title="$filters.daysFromNow(unit.relicTotalDays)"
        :displayText="$filters.pluralText(unit.relicTotalDays, 'day')"
        displayClasses="d-inline"
      />
      <EnergySpent showCantina />
      <MultiSelect
        class="select-columns"
        :options="cols"
        storageKey="relicTable"
        @checked="selectedColumns = $event"
      />
      <RelicTable
        :relicList="relicList"
        :targetLevels="[{ level: unit.relicLevel, target: unit.relicTarget }]"
        :selectedColumns="selectedColumns"
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
import RelicIcon from "../units/relicLevelIcon.vue";
import { loadingState } from "../../types/loading";
import { Relic, maxRelicLevel } from "../../types/relic";
import { setupEvents } from "../../utils";

export default defineComponent({
  name: "RelicPlannerComponent",
  components: { RelicTable, Timestamp, EnergySpent, RelicIcon },
  data() {
    return {
      maxRelicLevel,
      selectedColumns: [],
    };
  },
  computed: {
    ...mapState("relic", ["relicConfig"]),
    ...mapState("unit", ["unit"]),
    ...mapGetters(["someLoading"]),
    requestState(): loadingState {
      return this.someLoading(["relic", "unit"]);
    },
    relicList(): Relic[] {
      return Object.values(this.relicConfig);
    },
    cols(): { text: string; value: any }[] {
      const list = [
        {
          text: "Name",
          value: "name",
        },
        {
          text: "Locations",
          value: "locations",
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
    if (!this.unit.isShip && this.unit.relicLevel < maxRelicLevel) {
      setupEvents(this.$refs.relicSection as HTMLElement, "relicPlanner");
    }
  },
});
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";

.select-columns {
  width: 200px;
  margin-left: auto;
  margin-bottom: 0.25rem;
}

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

    .current-level,
    .target-level {
      display: flex;
      align-items: center;
    }
  }

  @media only screen and (min-width: 1200px) {
    display: flex;
    justify-content: center;

    .target-level,
    .current-level {
      margin: 0 2rem;
      display: flex;
      align-items: center;
    }
  }

  @media only screen and (max-width: 600px) {
    text-align: center;

    .current-level {
      display: inline-flex;
      align-items: center;
      max-height: 40px;
    }
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
