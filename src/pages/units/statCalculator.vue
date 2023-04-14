<template>
  <div class="swgoh-page container my-2">
    <DamageCalculator class="mb-3" />
    <SurvivabilityCalculator class="mb-3" />
    <ShipCalculator />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import DamageCalculator from "components/stats/damageCalculator.vue";
import SurvivabilityCalculator from "components/stats/survivabilityCalculator.vue";
import ShipCalculator from "components/stats/shipCalculator.vue";

export default defineComponent({
  name: "StatCalculatorPage",
  components: { DamageCalculator, SurvivabilityCalculator, ShipCalculator },
});
</script>

<style lang="scss" scoped></style>
