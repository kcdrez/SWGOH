<template>
  <div class="container swgoh-page" v-if="unit">
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
    <GearPlanner :unit="unit" />
    <RelicPlanner class="mt-3" :unit="unit" />
    <ShardPlanner class="mt-3" :unit="unit" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { mapState, mapActions, mapGetters } from "vuex";

import GearPlanner from "../gear/gearPlanner.vue";
import RelicPlanner from "../relic/relicPlanner.vue";
import ShardPlanner from "../shards/shardPlanner.vue";
import UnitIcon from "../units/unitIcon.vue";
import { Unit } from "../../types/unit";

export default defineComponent({
  name: "UnitData",
  components: { GearPlanner, RelicPlanner, ShardPlanner, UnitIcon },
  props: {
    unit: {
      type: Object as PropType<Unit>,
      required: true,
    },
  },
  computed: {
    ...mapState("planner", ["unitList"]),
    ...mapGetters("shards", { shardPlannerList: "plannerList" }),
  },
  methods: {
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
});
</script>

<style lang="scss" scoped></style>
