<template>
  <div class="container swgoh-page">
    <div v-if="fullUnitList.length === 0">
      You have no units in the General Planner.
    </div>
    <div class="input-group input-group-sm my-2 search-units-input-group">
      <UnitSearch @select="selected = $event" />
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
      <UnitSection class="unit-section" />
      <GearSection class="gear-section" />
      <RelicSection class="relic-section" />
    </template>
    <ShardSection class="shard-section" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters, mapState } from "vuex";

import UnitSection from "../components/generalPlanner/unitSection.vue";
import GearSection from "../components/generalPlanner/gearSection.vue";
import RelicSection from "../components/generalPlanner/relicSection.vue";
import ShardSection from "../components/generalPlanner/shardSection.vue";
import UnitSearch from "../components/units/unitSearch.vue";
import { Unit } from "../types/unit";

interface dataModel {
  selected: Unit | null;
}

export default defineComponent({
  name: "GeneralPlannerPage",
  components: {
    UnitSection,
    GearSection,
    RelicSection,
    ShardSection,
    UnitSearch,
  },
  data() {
    return {
      selected: null,
    } as dataModel;
  },
  computed: {
    ...mapGetters("planner", ["fullUnitList"]),
    ...mapState("unit", ["unitList"]),
    ...mapGetters("shards", ["plannerList"]),
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
});
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";

.swgoh-page {
  ::v-deep(.unit-section .section-header) {
    z-index: 9;
  }
  ::v-deep(.gear-section .section-header) {
    z-index: 8;
  }
  ::v-deep(.relic-section .section-header) {
    z-index: 7;
  }
  ::v-deep(.shard-section .section-header) {
    z-index: 6;
  }
}

::v-deep(thead.sticky-header) {
  top: 106px !important;
}

::v-deep(.search-units-input-group) {
  @media only screen and (max-width: 775px) {
    button,
    > div {
      width: 100%;
    }

    input {
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
      border-top-right-radius: 0.2rem !important;
      border-top-left-radius: 0.2rem !important;
      position: relative;
      right: 1px;
    }
    button:first-of-type {
      border-radius: 0px;
    }
    button:not(:first-of-type) {
      border-top-left-radius: 0px;
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0.2rem !important;
      border-bottom-left-radius: 0.2rem !important;
    }

    // .input-group {
    //   display: block;

    //   * {
    //     width: 100%;
    //   }

    //   .energy-text {
    //     border-radius: 0.2rem 0.2rem 0 0 !important;
    //   }
    //   .energy-spent-input {
    //     border-radius: 0 0 0.2rem 0.2rem !important;
    //   }

    //   .refresh-text,
    //   .energy-spent-text,
    //   .energy-spent-input,
    //   input {
    //     display: block;
    //     border-top: none;
    //     text-align: center;
    //     //everything except the first element is off so the following is used to compensate :shrug:
    //     position: relative;
    //     left: 1px;
    //   }
    // }
  }
}
</style>
