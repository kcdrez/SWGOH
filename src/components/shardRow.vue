<template>
  <div>
    <div class="input-group">
      <!-- <div class="input-group-prepend">
        <span class="input-group-text" id="">First and last name</span>
      </div> -->
      <input type="text" class="form-control" placeholder="Unit Name" v-model="unit">
      <input type="text" class="form-control" placeholder="Current Shards" v-model="shards">
      <input type="text" class="form-control" placeholder="Refreshes per Day" v-model="refreshes">
      <input type="text" class="form-control" placeholder="Drop Rate" v-model="dropRate">
      <div class="input-group-append">
        <button class="btn btn-outline-secondary" type="button" @click="calculate">Button</button>
      </div>
    </div>
    <div v-if="date">{{date}} ({{days}} Days from today)</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import { UnitData, PlayerUnit, UnitGear, Gear } from "../api/interfaces";
import moment from 'moment';

export default defineComponent({
  name: "ShardCalculatorRow",
  data() {
    return {
      unit: '',
      shards: 0,
      dropRate: 1,
      refreshes: 0,
      days: 0,
      date: ""
    };
  },
  computed: {
    ...mapState(["player", "gearList"]),
    unit(): PlayerUnit | null {
      const match: UnitData = this.player?.units.find((u: UnitData) => {
        return u.data.base_id === this.$route.params.unitId;
      });
      if (match) {
        return match.data;
      } else {
        return null;
      }
    },
  },
  methods: {
    gearName(gear: UnitGear): string {
      const match = this.gearList.find((g: Gear) => g.base_id === gear.base_id);
      if (match) {
        return match.name;
      } else {
        return "Unknown";
      }
    },
    calculate() {
      let remainingShards = 330;
      const stars = Number(this.unit?.rarity);

      remainingShards -= stars >=7 ? 100 : 0;
      remainingShards -= stars >=6 ? 85 : 0;
      remainingShards -= stars >=5 ? 65 : 0;
      remainingShards -= stars >=4 ? 30 : 0;
      remainingShards -= stars >=3 ? 25 : 0;
      remainingShards -= stars >=2 ? 15 : 0;
      remainingShards -= stars >=1 ? 10 : 0;

      this.days = (remainingShards - this.shards) / (2 * this.dropRate) / (1 + this.refreshes);
      this.date = moment().add(this.days, 'days').format('MM/DD/YYYY');
    }
  }
});
</script>
