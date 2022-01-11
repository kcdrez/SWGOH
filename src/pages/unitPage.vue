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
        <i
          class="far fa-question-circle show-help"
          title="Click to view the assumptions this calculator makes"
          data-bs-toggle="modal"
          data-bs-target="#gearAssumptionsModal"
        ></i>
      </h1>
      <GearPlanner />
      <h1 class="collapse-header">
        <a data-bs-toggle="collapse" href="#relicSection">Relic Planner</a>
      </h1>
      <div class="collapse" id="relicSection">
        This feature is currently in development.
      </div>
    </Loading>
    <div class="modal fade" id="gearAssumptionsModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Gear Calculator Assumptions</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <ul>
              <li>
                Assumes the cheapest (by energy) node is farmed (e.g. if salvage
                is obtainable in both Normal and Hard nodes, the Normal node
                will be used in calculation)
              </li>
              <li>
                For gear obtained from Daily Challenges, it is assumed that an
                average of 60 per week is obtained.
              </li>
            </ul>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapActions } from "vuex";
import moment from "moment";
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
@import "../styles/variables.scss";

.unit-page {
  max-width: 90%;
}

.collapse-header {
  text-shadow: 2px 2px 2px black;
  display: flex;
  align-items: center;

  a {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}

.show-help {
  cursor: pointer;
  color: $primary-light-1;
  margin: 0 0.5rem;
  font-size: 1.5rem;
}
</style>
