<template>
  <UnitData :unit="unit" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapActions, mapGetters } from "vuex";

import UnitData from "../components/units/unitData.vue";
import { loadingState } from "../types/loading";

export default defineComponent({
  name: "UnitPage",
  components: { UnitData },
  computed: {
    ...mapState("unit", ["unit"]),
    ...mapState("planner", ["unitList"]),
    ...mapState("player", { playerRequestState: "requestState" }),
    ...mapGetters("shards", { shardPlannerList: "plannerList" }),
  },
  methods: {
    ...mapActions("unit", ["fetchUnit"]),
  },
  watch: {
    playerRequestState(newVal, oldVal) {
      if (newVal === loadingState.ready) {
        this.fetchUnit(this.$route.params.unitId);
      }
    },
    "$route.params.unitId": {
      handler(unitId) {
        if (unitId) {
          this.fetchUnit(unitId);
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
