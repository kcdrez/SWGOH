<template>
  <div class="container swgoh-page mb-3">
    <Loading :state="requestState" message="Loading Unit Data" size="lg">
      <div class="damage-calculator-container">
        <div class="input-group input-group-sm">
          <span
            class="input-group-text c-help energy-text"
            title="Energy used on Light and Dark side tables"
            >Offense:</span
          >
          <input
            class="form-control refresh-input"
            type="number"
            v-model.number="offense"
            min="0"
          />
        </div>
        <div class="input-group input-group-sm">
          <span
            class="input-group-text c-help energy-text"
            title="Energy used on Light and Dark side tables"
            >Crit Chance:</span
          >
          <input
            class="form-control refresh-input"
            type="number"
            v-model.number="critChance"
            min="0"
          />
        </div>
        <div class="input-group input-group-sm">
          <span
            class="input-group-text c-help energy-text"
            title="Energy used on Light and Dark side tables"
            >Crit Damage:</span
          >
          <input
            class="form-control refresh-input"
            type="number"
            v-model.number="critDamage"
            min="0"
          />
        </div>
        <div>Average Damage per Hit: {{ averageDamagePerHit }}</div>
      </div>
    </Loading>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

import { initializeModules } from "../utils";
import { loadingState } from "../types/loading";

const dependencyModules = ["player", "guild"];

export default defineComponent({
  name: "DamageCalculatorPage",
  data() {
    return {
      offense: 0,
      critChance: 0,
      critDamage: 0,
    };
  },
  computed: {
    ...mapGetters(["someLoading"]),
    requestState(): loadingState {
      return this.someLoading(dependencyModules);
    },
    averageDamagePerHit(): number {
      //see https://gaming-fans.com/2017/02/15/swgoh-a-look-at-offense-critical-damage-and-critical-chance/
      const critChance = this.critChance / 100;
      const critDamage = this.critDamage / 100;
      return this.offense * (critChance * (critDamage - 1) + 1);
    },
  },
  async created() {
    await initializeModules(dependencyModules);
  },
});
</script>

<style lang="scss" scoped>
.damage-calculator-container {
  max-width: 300px;
  margin-top: 1rem;
}
</style>
