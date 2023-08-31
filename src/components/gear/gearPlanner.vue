<template>
  <ExpandableSection
    title="Gear Planner"
    :idRef="storageKey"
    :options="expandOptions"
    v-if="!unit.isShip && unit.gearLevel < maxGearLevel"
  >
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
    <GearTable
      :gearList="unit.fullSalvageList()"
      :selectedColumns="selectedColumns"
      :storageKey="storageKey + 'Table'"
    />
  </ExpandableSection>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { maxGearLevel } from "types/gear";
import GearTable from "components/gear/gearTable.vue";
import EnergySpent from "components/energySpent.vue";
import GearText from "components/gear/gearText.vue";
import Timestamp from "components/general/timestamp.vue";
import { Unit } from "types/unit";
import { iExpandOptions } from "types/general";

const storageKey = "gearPlanner";

export default defineComponent({
  name: "GearPlanner",
  components: { GearTable, Timestamp, EnergySpent, GearText },
  props: {
    unit: {
      type: Object as () => Unit,
      required: true,
    },
  },
  data() {
    return {
      maxGearLevel,
      selectedColumns: [],
      storageKey,
    } as any;
  },
  computed: {
    cols(): { label: string; value: any }[] {
      return [
        {
          label: "Icon",
          value: "icon",
        },
        {
          label: "Name",
          value: "name",
        },
        {
          label: "Mark",
          value: "mark",
        },
        {
          label: "Locations",
          value: "locations",
        },
        {
          label: "Amount Owned",
          value: "owned",
        },
        {
          label: "Amount Needed",
          value: "totalAmount",
        },
        {
          label: "Progress",
          value: "progress",
        },
        {
          label: "Estimated Time",
          value: "time",
        },
        {
          label: "Actions",
          value: "actions",
        },
      ];
    },
    expandOptions(): iExpandOptions {
      return {
        multiSelect: {
          options: this.cols,
          change: (newVal: string[]) => {
            this.selectedColumns = newVal;
          },
        },
      };
    },
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
