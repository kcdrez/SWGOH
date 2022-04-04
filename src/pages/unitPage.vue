<template>
  <div class="container swgoh-page">
    <UnitIcon :unit="unit" size="lg" class="text-center mt-3">
      <div class="btn-group btn-group-sm d-block text-center my-2" role="group">
        <button class="btn btn-primary" @click="addToGeneralPlanner()">
          Add to General Planner
        </button>
        <button
          class="btn btn-secondary text-dark"
          @click="addToShardPlanner()"
        >
          Add to Shard Planner
        </button>
      </div>
    </UnitIcon>
    <GearPlanner />
    <RelicPlanner />
    <ShardPlanner />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapActions, mapGetters } from "vuex";

import GearPlanner from "../components/gear/gearPlanner.vue";
import RelicPlanner from "../components/relic/relicPlanner.vue";
import ShardPlanner from "../components/shards/shardPlanner.vue";
import UnitIcon from "../components/units/unitIcon.vue";
import { loadingState } from "../types/loading";

export default defineComponent({
  name: "UnitPage",
  components: { GearPlanner, RelicPlanner, ShardPlanner, UnitIcon },
  computed: {
    ...mapState("unit", ["unit"]),
    ...mapState("planner", ["unitList"]),
    ...mapState("player", { playerRequestState: "requestState" }),
    ...mapGetters("shards", { shardPlannerList: "plannerList" }),
  },
  methods: {
    ...mapActions("unit", ["fetchUnit"]),
    ...mapActions("planner", {
      addUnitToGeneralPlanner: "addUnit",
    }),
    ...mapActions("shards", {
      addUnitToShardPlanner: "addUnit",
    }),
    addToGeneralPlanner(): void {
      if (this.unitList.find((x: string) => x === this.unit.id)) {
        this.$toast(
          `${this.unit.name} is already added to the General Planner`,
          {
            positionY: "top",
            class: "toast-warning",
          }
        );
      } else {
        this.addUnitToGeneralPlanner(this.unit.id);
        this.$toast(
          `${this.unit.name} successfully added to the General Planner`,
          {
            positionY: "top",
            class: "toast-success",
          }
        );
      }
    },
    addToShardPlanner(): void {
      if (this.shardPlannerList.find((x: string) => x === this.unit.id)) {
        this.$toast(`${this.unit.name} is already added to the Shard Planner`, {
          positionY: "top",
          class: "toast-warning",
        });
      } else {
        this.addUnitToShardPlanner(this.unit.id);
        this.$toast(
          `${this.unit.name} successfully added to the Shard Planner`,
          {
            positionY: "top",
            class: "toast-success",
          }
        );
      }
    },
  },
  watch: {
    async playerRequestState(newVal) {
      if (newVal === loadingState.ready) {
        await this.fetchUnit(this.$route.params.unitId);
      }
    },
    "$route.params.unitId": {
      async handler(unitId) {
        if (unitId) {
          await this.fetchUnit(unitId);
        }
      },
      deep: true,
    },
  },
  async created() {
    await this.fetchUnit(this.$route.params.unitId);
  },
});
</script>

<style lang="scss" scoped></style>
