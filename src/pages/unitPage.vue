<template>
  <div class="container unit-page">
    <Error
      :state="requestState"
      :message="`Unable to find a unit with the ID of ${$route.params.unitId}.`"
    />
    <Loading :state="requestState" message="Loading Unit Data" size="lg">
      <img
        class="d-block m-auto"
        :src="`https://game-assets.swgoh.gg/${unit?.thumbnailName}.png`"
      />
      <button
        class="btn btn-secondary text-dark mx-auto my-2 d-block"
        @click="add()"
      >
        Add to General Planner
      </button>
      <div class="collapse-header section-header">
        <h3 class="w-100" data-bs-toggle="collapse" href="#gearSection">
          <div class="d-inline">Gear Planner</div>
        </h3>
        <i
          class="far fa-question-circle show-help"
          title="Click to view the assumptions this calculator makes"
          data-bs-toggle="modal"
          data-bs-target="#gearAssumptionsModal"
        ></i>
      </div>
      <GearPlanner id="gearSection" class="collapse" />
      <div class="collapse-header section-header mt-3">
        <h3 class="w-100" data-bs-toggle="collapse" href="#relicSection">
          <div class="d-inline">Relic Planner</div>
        </h3>
      </div>
      <RelicPlanner id="relicSection" class="collapse" />
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
                will be used in calculation).
              </li>
              <li>
                For gear obtained from Daily Challenges, it is assumed that an
                average of 60 per week is obtained.
              </li>
              <li>
                The time estimation is based solely on getting gear from node
                farming and does not account for gear obtained in any other
                method (TW, TB, GAC, stores, etc.). A future version of this
                tool may account for some of these things.
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
  font-size: 1.5rem;
  position: relative;
  left: calc(-50% + 100px);

  &:hover {
    color: $primary-light-2;
  }
}
</style>
