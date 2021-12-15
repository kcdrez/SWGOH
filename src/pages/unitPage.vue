<template>
  <div>
    <div v-if="unit">
      <!-- <div v-if="unit.relic_level > 1">
        Relic Level: {{ unit.relic_level + 1 }}
      </div> -->
      <h1>Gear Needed to get {{ unit.name }} to Gear 13:</h1>
      <table class="table table-bordered table-dark table-sm table-striped">
        <thead>
          <tr>
            <th>Image</th>
            <th>Salvage Name</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="salvage in fullSalvageList" :key="salvage.base_id">
            <td><img :src="salvage.image" class="d-block m-auto" /></td>
            <td>{{ salvage.name }}</td>
            <td>{{ salvage.amount }}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>Loading unit page</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapActions } from "vuex";
import { UnitData, PlayerUnit, UnitGear, Gear } from "../api/interfaces";
import moment from "moment";
import { unvue } from "../utils";

export default defineComponent({
  name: "UnitPage",
  data() {
    return {
      shards: 0,
      dropRate: 1,
      refreshes: 0,
      days: 0,
      date: "",
    };
  },
  computed: {
    ...mapState({
      fullUnitData: "unit",
      player: "player",
      gearList: "gearList",
      gearLocations: "gearLocations",
    }),
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
    fullGearListByLevel(): any[] {
      if (this.unit) {
        const { gear_level } = this.unit;
        const futureGear =
          this.fullUnitData?.unitTierList.filter(
            (x: any) => x.tier >= gear_level
          ) || [];

        return futureGear.map((gear: any) => {
          return {
            tier: gear.tier,
            gear: gear.equipmentSetList.map((id: string) => {
              return this.findGearData(id);
            }),
          };
        });
      } else {
        return [];
      }
    },
    fullSalvageList(): any[] {
      let list: any[] = [];
      this.fullGearListByLevel.forEach((tier: any) => {
        tier.gear.forEach((gear: any) => {
          gear.ingredients.forEach((i: any) => {
            const gearData = { ...this.findGearData(i.gear), amount: i.amount };
            const exists = list.find(
              (x: any) => x.base_id === gearData.base_id
            );
            if (exists) {
              exists.amount += gearData.amount;
            } else {
              list.push(gearData);
            }
          });
        });
      });
      return list;
    },
  },
  methods: {
    ...mapActions(["fetchUnit"]),
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
    findGearData(id: string) {
      return this.gearList.find((el: any) => el.base_id === id);
    },
  },
  watch: {
    async unit(newVal: PlayerUnit) {
      if (newVal) {
        await this.fetchUnit(newVal.base_id);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
td {
  img {
    max-width: 40px;
  }
}
</style>
