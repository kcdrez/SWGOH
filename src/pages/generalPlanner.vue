<template>
  <Loading :state="requestState" message="Loading Planner Data" size="lg">
    <div class="container general-planner-page">
      <LastUpdated />
      <div v-if="fullUnitList.length === 0">
        You have no units in the General Planner.
      </div>
      <div class="input-group input-group-sm my-2">
        <SearchInput
          :list="unitList"
          @select="selected = $event"
          @enterPress="add($event)"
        />
        <button
          class="btn btn-sm btn-primary"
          :disabled="!selected"
          @click="add(selected)"
        >
          Add Unit
        </button>
      </div>
      <template v-if="fullUnitList.length > 0">
        <UnitSection />
        <GearSection />
        <RelicSection />
      </template>
    </div>
  </Loading>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters, mapState } from "vuex";

import UnitSection from "../components/generalPlanner/unitSection.vue";
import GearSection from "../components/generalPlanner/gearSection.vue";
import RelicSection from "../components/generalPlanner/relicSection.vue";
import { loadingState } from "../types/loading";
import { Unit } from "../types/unit";

interface dataModel {
  selected: Unit | null;
}

export default defineComponent({
  name: "GeneralPlannerPage",
  components: { UnitSection, GearSection, RelicSection },
  data() {
    return {
      selected: null,
    } as dataModel;
  },
  computed: {
    ...mapGetters(["someLoading"]),
    ...mapGetters("planner", ["fullUnitList"]),
    ...mapState("unit", ["unitList"]),
    requestState(): loadingState {
      return this.someLoading(["planner", "unit", "gear", "relic"]);
    },
  },
  methods: {
    ...mapActions("planner", ["addUnit"]),
    add(unit: Unit): void {
      if (this.fullUnitList.find((x: Unit) => x.id === unit.id)) {
        this.$toast(`${unit.name} is already added to the General Planner`, {
          positionY: "top",
          class: "toast-warning",
        });
      } else {
        this.addUnit(unit.id);
        this.$toast(`${unit.name} successfully added to the General Planner`, {
          positionY: "top",
          class: "toast-success",
        });
      }
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
