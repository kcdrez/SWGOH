<template>
  <div>
    <SearchInput :list="unitList" @select="selected = $event" />
    <div v-if="selected" class="text-center mb-3">
      <!-- <img class="d-block mx-auto my-1" :src="selected?.image" /> -->
      <UnitIcon :unit="selected" size="lg" />
      <div class="btn-group btn-group-sm text-center" role="group">
        <button
          class="btn btn-primary text-dark"
          @click="
            $router.push({ name: 'UnitPage', params: { unitId: selected.id } })
          "
        >
          View Details
        </button>
        <button class="btn btn-success text-dark" @click="addToGeneralPlanner">
          Add to General Planner
        </button>
        <button class="btn btn-secondary text-dark" @click="addToShardPlanner">
          Add to Shard Planner
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters, mapState } from "vuex";

import { Unit } from "../types/unit";
import UnitIcon from "./units/unitIcon.vue";

interface dataModel {
  selected: null | Unit;
}

export default defineComponent({
  name: "Player",
  components: { UnitIcon },
  computed: {
    ...mapState("unit", ["unitList"]),
    ...mapState("planner", { generalPlannerUnitList: "unitList" }),
    ...mapGetters("shards", { shardPlannerList: "plannerList" }),
  },
  data() {
    return {
      selected: null,
    } as dataModel;
  },
  methods: {
    ...mapActions("planner", {
      addUnitToGeneralPlanner: "addUnit",
    }),
    ...mapActions("shards", {
      addUnitToShardPlanner: "addUnit",
    }),
    addToGeneralPlanner(): void {
      if (
        this.generalPlannerUnitList.find((x: string) => x === this.selected?.id)
      ) {
        this.$toast(
          `${this.selected?.name} is already added to the General Planner`,
          {
            positionY: "top",
            class: "toast-warning",
          }
        );
      } else {
        this.addUnitToGeneralPlanner(this.selected?.id);
        this.$toast(
          `${this.selected?.name} successfully added to the General Planner`,
          {
            positionY: "top",
            class: "toast-success",
          }
        );
      }
    },
    addToShardPlanner(): void {
      if (this.shardPlannerList.find((x: string) => x === this.selected?.id)) {
        this.$toast(
          `${this.selected?.name} is already added to the Shard Planner`,
          {
            positionY: "top",
            class: "toast-warning",
          }
        );
      } else {
        this.addUnitToShardPlanner(this.selected?.id);
        this.$toast(
          `${this.selected?.name} successfully added to the Shard Planner`,
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

<style lang="scss" scoped>
.btn-group {
  @media only screen and (max-width: 600px) {
    display: block;

    * {
      width: 100%;
      display: block;

      &:not(:first-child) {
        position: relative;
        margin-left: 0px;
        margin-top: -1px;
      }
      &:first-child {
        border-radius: 0.2rem 0.2rem 0 0 !important;
      }
      &:last-child {
        border-radius: 0 0 0.2rem 0.2rem !important;
      }
    }
  }
}
</style>