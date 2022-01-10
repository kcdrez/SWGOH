<template>
  <div class="container unit-page">
    <Loading
      :state="unit ? 'READY' : 'LOADING'"
      message="Loading Unit Data"
      size="lg"
    >
      <img
        class="d-block m-auto"
        :src="`https://game-assets.swgoh.gg/${unit?.thumbnailName}.png`"
      />
      <h1 class="collapse-header">
        <a data-bs-toggle="collapse" href="#gearSection">Gear Planner</a>
      </h1>
      <GearPlanner />
      <h1 class="collapse-header">
        <a data-bs-toggle="collapse" href="#relicSection">Relic Planner</a>
      </h1>
      <div class="collapse" id="relicSection">
        This feature is currently in development.
      </div>
    </Loading>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapActions, mapGetters } from "vuex";
import {
  UnitData,
  PlayerUnit,
  UnitGear,
  Gear,
  Mission,
} from "../api/interfaces";
import moment from "moment";
import { unvue } from "../utils";
import GearPlanner from "../components/gear/gearPlanner.vue";
import Loading from "../components/loading.vue";

export default defineComponent({
  name: "UnitPage",
  components: { GearPlanner, Loading },
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
  },
  methods: {
    ...mapActions("unit", ["fetchUnit"]),
    calculate() {
      let remainingShards = 330;
      const stars = Number(this.unit?.rarity);

      remainingShards -= stars >= 7 ? 100 : 0;
      remainingShards -= stars >= 6 ? 85 : 0;
      remainingShards -= stars >= 5 ? 65 : 0;
      remainingShards -= stars >= 4 ? 30 : 0;
      remainingShards -= stars >= 3 ? 25 : 0;
      remainingShards -= stars >= 2 ? 15 : 0;
      remainingShards -= stars >= 1 ? 10 : 0;

      this.days =
        (remainingShards - this.shards) /
        (2 * this.dropRate) /
        (1 + this.refreshes.character);
      this.date = moment().add(this.days, "days").format("MM/DD/YYYY");
    },
  },
  created() {
    this.fetchUnit(this.$route.params.unitId);
  },
});
</script>

<style lang="scss" scoped>
.unit-page {
  max-width: 90%;
}

.collapse-header {
  text-shadow: 2px 2px 2px black;

  a {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
