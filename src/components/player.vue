<template>
  <div>
    <SearchInput :list="unitList" @select="selectUnit($event)" />
    <div v-if="selected" class="text-center my-3">
      <UnitIcon :unit="selected" size="lg" isLink />
      <div class="btn-group btn-group-sm text-center mt-1" role="group">
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

import { Unit, UnitBasic } from "../types/unit";
import UnitIcon from "./units/unitIcon.vue";

interface dataModel {
  selected: null | Unit | UnitBasic;
}

export default defineComponent({
  name: "Player",
  components: { UnitIcon },
  computed: {
    ...mapState("unit", ["unitList"]),

    ...mapState("planner", { generalPlannerUnitList: "unitList" }),
    ...mapGetters("shards", { shardPlannerList: "plannerList" }),
    ...mapGetters("player", ["unitData"]),
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
    selectUnit(unit: UnitBasic | null) {
      if (!unit) {
        return;
      }
      const playerUnit = this.unitData(unit?.id || "");
      if (playerUnit) {
        this.selected = playerUnit;
      } else {
        this.selected = unit;
      }
    },
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