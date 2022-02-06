<template>
  <div>
    <div class="collapse-header section-header mt-3">
      <h3 class="w-100" data-bs-toggle="collapse" href="#relicSection">
        <div class="d-inline">Relic Planner</div>
      </h3>
    </div>
    <div id="relicSection" class="collapse" ref="relicSection">
      <div class="relic-header">
        <div class="current-level">
          Current Relic Level: <b>{{ currentRelicLevel }}</b>
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
      <div class="cantina-energy-container">
        <div class="input-group input-group-sm">
          <span
            class="input-group-text c-help energy-text"
            title="Energy used on the cantina table"
            >Cantina Energy:</span
          >
          <span
            class="input-group-text c-help refresh-text"
            title="How many times you refresh the cantina energy using crystals per day"
            >Daily Refreshes:</span
          >
          <input
            class="form-control refresh-input"
            type="number"
            v-model.number="refreshes"
            min="0"
          />
          <span
            class="input-group-text c-help cantina-spent-text"
            title="How much of your daily energy used for farming other things (i.e. character shards)"
            >Daily Energy Used:</span
          >
          <input
            class="form-control cantina-spent-input"
            type="number"
            v-model.number="energy"
            min="0"
            :max="165 + refreshes * 120"
          />
        </div>
      </div>
      <RelicTable
        :relicList="relicList"
        :targetLevels="[{ level: currentRelicLevel, target: relicTarget }]"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapState } from "vuex";

import RelicTable from "./relicTable.vue";
import Timestamp from "../timestamp.vue";
import { UpdateItem } from "../../types/planner";
import { loadingState } from "../../types/loading";
import { Relic } from "../../types/relic";
import { setupEvents } from "../../utils";

export default defineComponent({
  name: "RelicPlannerComponent",
  components: { RelicTable, Timestamp },
  computed: {
    ...mapState("relic", ["relicConfig"]),
    ...mapState("unit", ["unit"]),
    ...mapGetters("relic", ["relicOptions", "totalDays"]),
    ...mapGetters(["someLoading"]),
    requestState(): loadingState {
      return this.someLoading(["relic", "unit"]);
    },
    currentRelicLevel(): number {
      return this.unit?.relic_tier < 0 ? 0 : this.unit.relic_tier;
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
    refreshes: {
      get(): number {
        return this.$store.state.relic.refreshes.cantina;
      },
      set(value: number) {
        this.$store.dispatch("relic/updateRefreshes", value);
      },
    },
    energy: {
      get(): number {
        return this.$store.state.relic.energy.cantina;
      },
      set(value: number) {
        this.$store.dispatch("relic/updateEnergy", value);
      },
    },
    relicList(): Relic[] {
      return Object.values(this.relicConfig);
    },
  },
  mounted() {
    setupEvents(this.$refs.relicSection as HTMLElement, "relicPlanner");
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

.cantina-energy-container {
  margin-bottom: 1rem;

  .energy-text {
    background: $dark;
    color: $light;
    width: 130px;
    display: block;
  }

  .refresh-text,
  .cantina-spent-text {
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
      .cantina-spent-input {
        border-radius: 0 0 0.2rem 0.2rem !important;
      }

      .refresh-text,
      .cantina-spent-text,
      .cantina-spent-input,
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

.time-estimate {
  text-align: center;

  ::v-deep(span) {
    font-weight: bold;
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

  a {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
