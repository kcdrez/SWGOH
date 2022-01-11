<template>
  <div>
    <div class="input-group">
      <div class="input-group-prepend">
        <span class="input-group-text">Unit Name</span>
      </div>
      <input type="text" class="form-control" v-model="unit" />
    </div>
    <div class="input-group">
      <div class="input-group-prepend">
        <span class="input-group-text">Current Shard Count</span>
      </div>
      <input type="number" class="form-control" v-model="shards" />
    </div>
    <div class="input-group">
      <div class="input-group-prepend">
        <span class="input-group-text">Refreshes per Day</span>
      </div>
      <input type="number" class="form-control" v-model="refreshes" />
    </div>
    <div class="input-group">
      <div class="input-group-prepend">
        <span class="input-group-text">Drop Rate</span>
      </div>
      <input type="number" class="form-control" v-model="dropRate" />
    </div>
    <button
      class="btn btn-outline-secondary"
      type="button"
      @click="findUnitMatch"
    >
      Calculate
    </button>
    <div v-if="matches.length > 1">
      Did you mean:
      <span
        v-for="unit in matches"
        :key="unit.index"
        @click="calculate(unit)"
        class="did-you-mean-link"
        >{{ unit.name }}</span
      >
    </div>
    <div v-if="date">{{ date }} ({{ days }} Days from today)</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
// import { Unit, UnitData, PlayerUnit, UnitGear, Gear } from "../types/unit";
import moment from "moment";
import { CombinedUnit } from "../types/unit";

interface dataModel {
  unit: string;
  shards: number;
  dropRate: number;
  refreshes: number;
  days: number;
  date: string;
  matches: CombinedUnit[];
}

export default defineComponent({
  name: "ShardCalculatorRow",
  data() {
    return {
      unit: "",
      shards: 0,
      dropRate: 1,
      refreshes: 0,
      days: 0,
      date: "",
      matches: [],
    } as dataModel;
  },
  computed: {
    ...mapState("player", ["player"]),
  },
  methods: {
    findUnitMatch() {
      // const bestMatches = stringSimilarity.findBestMatch(
      //   this.unit.replace(/[^a-zA-Z0-9]/g, "").toLowerCase(),
      //   this.player?.units.map((unit: UnitData) =>
      //     unit.data.base_id.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()
      //   ) || []
      // );
      // this.matches = bestMatches.ratings
      //   .map(({ rating }: any, index: number) => {
      //     const { data } = this.player?.units[index];
      //     return { rating, ...data };
      //   })
      //   .filter((x: any) => x.rating > 0.4)
      //   .sort((a: PlayerUnit, b: PlayerUnit) => {
      //     return a.name > b.name ? 1 : -1;
      //   });

      this.matches = (
        this.player?.units.filter((unit: CombinedUnit) => {
          const sanitizedName = unit.name
            .replace(/[^a-zA-Z0-9]/g, "")
            .toLowerCase();
          const findName = this.unit.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
          return sanitizedName.includes(findName);
        }) || []
      ).sort((a: CombinedUnit, b: CombinedUnit) => {
        return a.name > b.name ? 1 : -1;
      });

      if (this.matches.length === 1) {
        this.calculate(this.matches[0]);
      }
    },
    calculate(unit: CombinedUnit) {
      let remainingShards = 330;

      // const matches = this.player?.units.filter((unit: Unit) => {});
      const stars = Number(unit.stars);

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
        (1 + this.refreshes);
      this.date = moment().add(this.days, "days").format("MM/DD/YYYY");
    },
  },
});
</script>

<style lang="scss" scoped>
.did-you-mean-link {
  margin: 0 5px;
  cursor: pointer;
  color: #0d6efd;

  &:hover {
    color: #0a58ca;
  }
}
</style>
