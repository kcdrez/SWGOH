<template>
  <Loading :state="requestState" message="Loading Planner Data" size="lg">
    <div class="container swgoh-page">
      <div v-if="fullUnitList.length === 0">
        You have no units in the General Planner.
      </div>
      <div class="input-group input-group-sm my-2">
        <SearchInput :list="unitList" @select="selected = $event" />
        <button
          class="btn btn-sm btn-primary"
          :disabled="!selected"
          @click="addToGeneral(selected)"
        >
          Add Unit to General Planner
        </button>
        <button
          class="btn btn-sm btn-secondary"
          :disabled="!selected"
          @click="addToShardPlanner(selected)"
        >
          Add Unit to Shard Planner
        </button>
      </div>
      <template v-if="fullUnitList.length > 0">
        <UnitSection />
        <GearSection />
        <RelicSection />
        <ShardSection />
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
import ShardSection from "../components/generalPlanner/shardSection.vue";
import { loadingState } from "../types/loading";
import { Unit } from "../types/unit";
import { initializeModules } from "../utils";

const dependencyModules = ["planner", "unit", "gear", "relic", "shards"];

interface dataModel {
  selected: Unit | null;
}

export default defineComponent({
  name: "GeneralPlannerPage",
  components: { UnitSection, GearSection, RelicSection, ShardSection },
  data() {
    return {
      selected: null,
    } as dataModel;
  },
  computed: {
    ...mapGetters(["someLoading"]),
    ...mapGetters("planner", ["fullUnitList"]),
    ...mapState("unit", ["unitList"]),
    ...mapGetters("shards", ["plannerList"]),
    requestState(): loadingState {
      return this.someLoading(dependencyModules);
    },
  },
  methods: {
    ...mapActions("planner", { addUnitToGeneral: "addUnit" }),
    ...mapActions("shards", { addUnitToShard: "addUnit" }),
    addToGeneral(unit: Unit): void {
      if (this.fullUnitList.find((x: Unit) => x.id === unit.id)) {
        this.$toast(`${unit.name} is already added to the General Planner`, {
          positionY: "top",
          class: "toast-warning",
        });
      } else {
        this.addUnitToGeneral(unit.id);
        this.$toast(`${unit.name} successfully added to the General Planner`, {
          positionY: "top",
          class: "toast-success",
        });
      }
    },
    addToShardPlanner(unit: Unit): void {
      if (this.plannerList.find((x: Unit) => x.id === unit.id)) {
        this.$toast(`${unit.name} is already added to the Shard Planner`, {
          positionY: "top",
          class: "toast-warning",
        });
      } else {
        this.addUnitToShard(unit.id);
        this.$toast(`${unit.name} successfully added to the Shard Planner`, {
          positionY: "top",
          class: "toast-success",
        });
      }
    },
  },
  async created() {
    await initializeModules(dependencyModules);
  },
});
</script>

<style lang="scss" scoped></style>
