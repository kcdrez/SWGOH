<template>
  <div class="energy-spent-container">
    <div
      class="standard-energy-container"
      :class="{
        'group-three': showCantina && showFleet,
        'group-two': showCantina || showFleet,
        'group-one': !showCantina && !showFleet,
      }"
      v-if="showStandard"
    >
      <div class="input-group input-group-sm">
        <span
          class="input-group-text c-help energy-text"
          title="Energy used on Light and Dark side tables"
          >Standard:</span
        >
        <span
          class="input-group-text c-help refresh-text"
          title="How many times you refresh the energy using crystals per day"
          >Daily Refreshes:</span
        >
        <input
          class="form-control refresh-input"
          type="number"
          v-model.number="standardRefreshes"
          min="0"
        />
        <span
          class="input-group-text c-help energy-spent-text"
          title="How much of your daily energy used for farming other things (i.e. character shards)"
          >Daily Energy Used:</span
        >
        <input
          class="form-control energy-spent-input"
          type="number"
          v-model.number="standardEnergy"
          min="0"
          :max="145 + standardRefreshes * 120 + 135"
        />
      </div>
    </div>
    <div
      class="fleet-energy-container"
      :class="{
        'group-three': showCantina && showStandard,
        'group-two': showCantina || showStandard,
        'group-one': !showCantina && !showStandard,
      }"
      v-if="showFleet"
    >
      <div class="input-group input-group-sm">
        <span
          class="input-group-text c-help energy-text"
          title="Energy used on fleet/ship nodes"
          >Fleet:</span
        >
        <span
          class="input-group-text c-help refresh-text"
          title="How many times you refresh the fleet energy using crystals per day"
          >Daily Refreshes:</span
        >
        <input
          class="form-control refresh-input"
          type="number"
          v-model.number="fleetRefreshes"
          min="0"
        />
        <span
          class="input-group-text c-help energy-spent-text"
          title="How much of your daily energy used for farming other things (e.g. character shards)"
          >Daily Energy Used:</span
        >
        <input
          class="form-control energy-spent-input"
          type="number"
          v-model.number="fleetEnergy"
          min="0"
          :max="145 + fleetRefreshes * 120 + 45"
        />
      </div>
    </div>
    <div
      class="cantina-energy-container"
      :class="{
        'group-three': showStandard && showFleet,
        'group-two': showStandard || showFleet,
        'group-one': !showStandard && !showFleet,
      }"
      v-if="showCantina"
    >
      <div class="input-group input-group-sm">
        <span
          class="input-group-text c-help energy-text"
          title="Energy used on the cantina table"
          >Cantina:</span
        >
        <span
          class="input-group-text c-help refresh-text"
          title="How many times you refresh the cantina energy using crystals per day"
          >Daily Refreshes:</span
        >
        <input
          class="form-control refresh-input"
          type="number"
          v-model.number="cantinaRefreshes"
          min="0"
        />
        <span
          class="input-group-text c-help energy-spent-text"
          title="How much of your daily energy used for farming other things (i.e. character shards)"
          >Daily Energy Used:</span
        >
        <input
          class="form-control energy-spent-input"
          type="number"
          v-model.number="cantinaEnergy"
          min="0"
          :max="165 + cantinaRefreshes * 120"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "EnergySpentComponent",
  props: {
    showStandard: {
      type: Boolean,
      default: false,
    },
    showFleet: {
      type: Boolean,
      default: false,
    },
    showCantina: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    cantinaRefreshes: {
      get(): number {
        return this.$store.state.relic.refreshes.cantina;
      },
      set(value: number) {
        this.$store.dispatch("relic/updateRefreshes", value);
      },
    },
    cantinaEnergy: {
      get(): number {
        return this.$store.state.relic.energy.cantina;
      },
      set(value: number) {
        this.$store.dispatch("relic/updateEnergy", value);
      },
    },
    standardRefreshes: {
      get(): number {
        return this.$store.state.gear.refreshes.standard ?? 0;
      },
      set(value: number) {
        this.$store.dispatch("gear/updateRefreshes", {
          value,
          type: "standard",
        });
      },
    },
    standardEnergy: {
      get(): number {
        return this.$store.state.gear.energy.standard ?? 0;
      },
      set(value: number) {
        this.$store.dispatch("gear/updateEnergy", {
          value,
          type: "standard",
        });
      },
    },
    fleetRefreshes: {
      get(): number {
        return this.$store.state.gear.refreshes.fleet ?? 0;
      },
      set(value: number) {
        this.$store.dispatch("gear/updateRefreshes", {
          value,
          type: "fleet",
        });
      },
    },
    fleetEnergy: {
      get(): number {
        return this.$store.state.gear.energy.fleet ?? 0;
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
// cantina broken if just one other one

@import "../styles/variables.scss";

.energy-spent-container {
  display: flex;
  flex-wrap: wrap;
}

.standard-energy-container,
.fleet-energy-container,
.cantina-energy-container {
  margin-bottom: 1rem;

  &.group-one {
    margin-left: auto;
    margin-right: auto;
  }

  .energy-text {
    background: $dark;
    color: $light;
    width: 100px;
    display: block;
  }

  .refresh-text,
  .energy-spent-text {
    background: $gray-4;
    color: $light;
  }

  @media only screen and (max-width: 1299px) {
    margin-left: auto;
    margin-right: auto;
  }

  @media only screen and (max-width: 600px) {
    flex-basis: 100%;

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
.standard-energy-container,
.fleet-energy-container {
  &.group-three,
  &.group-two {
    @media only screen and (min-width: 1300px) {
      flex-grow: 1;
      flex-basis: 30%;
    }
  }
}

.standard-energy-container {
  &.group-two {
    @media only screen and (min-width: 1300px) {
      margin-right: 1rem;
      margin-left: 4%;
    }
  }
}

.fleet-energy-container {
  &.group-two {
    @media only screen and (min-width: 1300px) {
      margin-left: 1rem;
      margin-right: 4%;
    }
  }
}

.cantina-energy-container {
  &.group-two {
    @media only screen and (min-width: 1300px) {
      margin-left: 1rem;
    }
  }
  &.group-three {
    @media only screen and (min-width: 1300px) {
      flex-basis: 50%;
      margin-left: auto;
      margin-right: auto;
    }
  }
}
</style>
