<template>
  <div v-if="!unit.isShip && unit.gearLevel < maxGearLevel">
    <div class="collapse-header section-header">
      <h3>
        <div data-bs-toggle="collapse" href="#gearSection">Gear Planner</div>
      </h3>
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
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { mapState, mapGetters } from "vuex";

import { loadingState } from "types/loading";
import { maxGearLevel } from "types/gear";
import GearTable from "components/gear/gearTable.vue";
import EnergySpent from "components/energySpent.vue";
import GearText from "components/gear/gearText.vue";
import { setupEvents } from "utils";
import Timestamp from "components/timestamp.vue";
import { Unit } from "types/unit";

const storageKey = "gearPlanner";

export default defineComponent({
  name: "GearPlannerComponent",
  components: { GearTable, Timestamp, EnergySpent, GearText },
  props: {
    unit: {
      type: Object as PropType<Unit>,
      required: true,
    },
  },
  data() {
    return {
      maxGearLevel,
      selectedColumns: [],
      storageKey,
    };
  },
  computed: {
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
@import "styles/variables.scss";

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
</style>
