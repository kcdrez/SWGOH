<template>
  <div class="collapse">
    <Loading :state="requestState" size="md" message="Loading Gear Data">
      <template v-if="unit.gear_level < maxGearLevel">
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
        <h3>{{ unit.name }} is already at gear level {{ maxGearLevel }}.</h3>
      </template>
    </Loading>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapGetters } from "vuex";

import Loading from "../loading.vue";
import { UpdateItem } from "../../types/planner";
import GearTable from "./gearTable.vue";

export default defineComponent({
  name: "GearPlannerComponent",
  components: { Loading, GearTable },
  computed: {
    ...mapState("gear", ["requestState", "maxGearLevel"]),
    ...mapState("unit", ["unit"]),
    ...mapGetters("gear", ["gearOptions", "fullSalvageList", "totalDays"]),
    ...mapGetters("unit", ["currentGearLevel"]),
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
});
</script>

<style lang="scss" scoped>
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

  a {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}

.energy-text {
  width: 130px;
  display: block;
}
</style>
