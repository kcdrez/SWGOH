<template>
  <div class="container unit-page">
    <Error
      :state="requestState"
      :message="`Unable to find a unit with the ID of ${$route.params.unitId}.`"
    />
    <Loading :state="requestState" message="Loading Unit Data" size="lg">
      <LastUpdated />
      <img class="d-block m-auto" :src="unit?.image" />
      <button
        class="btn btn-secondary text-dark mx-auto my-2 d-block"
        @click="add()"
      >
        Add to General Planner
      </button>
      <GearPlanner />
      <RelicPlanner />
    </Loading>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapActions, mapGetters } from "vuex";

import GearPlanner from "../components/gear/gearPlanner.vue";
import RelicPlanner from "../components/relic/relicPlanner.vue";
import { loadingState } from "../types/loading";

export default defineComponent({
  name: "UnitPage",
  components: { GearPlanner, RelicPlanner },
  data() {
    return {
      shards: 0,
      dropRate: 1,
      days: 0,
      date: "",
      editing: {
        owned: false,
      },
      refreshes: {
        character: 0,
      },
    };
  },
  computed: {
    ...mapState("unit", ["unit"]),
    ...mapState("planner", ["unitList"]),
    ...mapState("player", { playerRequestState: "requestState" }),
    ...mapGetters(["someLoading"]),
    requestState(): loadingState {
      return this.someLoading(["unit", "planner"]);
    },
  },
  methods: {
    ...mapActions("unit", ["fetchUnit"]),
    ...mapActions("planner", ["addUnit"]),
    add(): void {
      if (this.unitList.find((x: string) => x === this.unit.id)) {
        this.$toast(
          `${this.unit.name} is already added to the General Planner`,
          {
            positionY: "top",
            class: "toast-warning",
          }
        );
      } else {
        this.addUnit(this.unit.id);
        this.$toast(
          `${this.unit.name} successfully added to the General Planner`,
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
  },
  async created() {
    if (this.playerRequestState === loadingState.ready) {
      await this.fetchUnit(this.$route.params.unitId);
    }
  },
});
</script>

<style lang="scss" scoped>
.unit-page {
  max-width: 90%;
}
</style>
