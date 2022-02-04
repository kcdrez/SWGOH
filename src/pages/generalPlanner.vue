<template>
  <Loading :state="requestState" message="Loading Planner Data" size="lg">
    <div class="container general-planner-page">
      <UnitSection />
      <GearSection />
      <RelicSection />
    </div>
  </Loading>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

import UnitSection from "../components/generalPlanner/unitSection.vue";
import GearSection from "../components/generalPlanner/gearSection.vue";
import RelicSection from "../components/generalPlanner/relicSection.vue";
import { loadingState } from "../types/loading";

export default defineComponent({
  name: "GeneralPlannerPage",
  components: { UnitSection, GearSection, RelicSection },
  computed: {
    ...mapGetters(["someLoading"]),
    requestState(): loadingState {
      return this.someLoading(["planner", "unit", "gear", "relic", "planner"]);
    },
  },
});
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";

.general-planner-page {
  max-width: 90%;
}
</style>
