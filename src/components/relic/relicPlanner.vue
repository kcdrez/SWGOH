<template>
  <ExpandableSection
    title="Relic Planner"
    :idRef="storageKey"
    :options="expandOptions"
    v-if="!unit.isShip && unit.relicLevel < maxRelicLevel"
  >
    <div class="relic-header">
      <div class="current-level">
        <div>Current Relic Level:</div>
        <RelicLevelIcon
          :relicLevel="unit.relicLevel"
          :alignment="unit.alignment"
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
      displayClasses="d-inline" />
    <EnergySpent showCantina />
    <RelicTable
      :relicList="relicList"
      :targetLevels="[{ level: unit.relicLevel, target: unit.relicTarget }]"
      :selectedColumns="selectedColumns"
      :storageKey="storageKey + 'Table'"
  /></ExpandableSection>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";

import RelicTable from "components/relic/relicTable.vue";
import Timestamp from "components/general/timestamp.vue";
import EnergySpent from "components/energySpent.vue";
import RelicLevelIcon from "components/units/relicLevelIcon.vue";
import { Relic, maxRelicLevel } from "types/relic";
import { Unit } from "types/unit";
import { iExpandOptions } from "types/general";

const storageKey = "relicPlanner";

export default defineComponent({
  name: "RelicPlannerComponent",
  components: { RelicTable, Timestamp, EnergySpent, RelicLevelIcon },
  props: {
    unit: {
      type: Object as () => Unit,
      required: true,
    },
  },
  data() {
    return {
      maxRelicLevel,
      selectedColumns: [],
      storageKey,
    } as any;
  },
  computed: {
    ...mapState("relic", ["relicConfig"]),
    relicList(): Relic[] {
      return Object.values(this.relicConfig);
    },
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
          label: "Rarity",
          value: "rarity",
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
          value: "needed",
        },
        {
          label: "Progress",
          value: "progress",
        },
        {
          label: "Estimated Time",
          value: "time",
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
