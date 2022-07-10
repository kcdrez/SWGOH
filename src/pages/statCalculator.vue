<template>
  <div class="swgoh-page container my-2">
    <DamageCalculator />
    <SurvivabilityCalculator />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import DamageCalculator from "../components/stats/damageCalculator.vue";
import SurvivabilityCalculator from "../components/stats/survivabilityCalculator.vue";

export default defineComponent({
  name: "StatCalculatorPage",
  components: { DamageCalculator, SurvivabilityCalculator },
});
</script>

<style lang="scss" scoped>
</style>
