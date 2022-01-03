<template>
  <div>
    <div v-if="unit">
      <!-- <div v-if="unit.relic_level > 1">
        Relic Level: {{ unit.relic_level + 1 }}
      </div> -->
      <h1>
        Gear Needed to get {{ unit.name }} from Gear Level
        {{ currentGearLevel }} to 13:
      </h1>
      <div class="input-group input-group-sm w-25">
        <span class="input-group-text label-count"
          >Standard Energy Refreshes:</span
        >
        <input
          class="form-control"
          type="number"
          v-model.number="refreshes.standard"
          min="0"
        />
      </div>
      <div class="input-group input-group-sm my-2 w-25">
        <span class="input-group-text label-count"
          >Fleet Energy Refreshes:</span
        >
        <input
          class="form-control"
          type="number"
          v-model.number="refreshes.fleet"
          min="0"
        />
      </div>
      <table class="table table-bordered table-dark table-sm table-striped">
        <thead>
          <tr>
            <th width="15%">Image</th>
            <th width="20%">Salvage Name</th>
            <th width="20%">Locations</th>
            <th width="20%">Amount</th>
            <th width="10%">Est. Time</th>
            <th width="15%">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="salvage in fullSalvageList" :key="salvage.base_id">
            <td><img :src="salvage.image" class="d-block m-auto" /></td>
            <td>{{ salvage.name }}</td>
            <td>
              <ul class="m-0">
                <li
                  v-for="(l, index) in gearLocation(salvage.lookupMissionList)"
                  :key="index"
                >
                  {{ l }}
                </li>
              </ul>
            </td>
            <td>
              <Salvage :salvage="salvage" />
            </td>
            <td>{{ timeEstimation(salvage) }} Days</td>
            <td>
              <div class="btn-group btn-group-sm" role="group">
                <button type="button" class="btn btn-primary">Left</button>
                <button type="button" class="btn btn-secondary">Middle</button>
                <button type="button" class="btn btn-info">Right</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>Loading unit page</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapActions, mapGetters } from "vuex";
import { UnitData, PlayerUnit, UnitGear, Gear } from "../api/interfaces";
import moment from "moment";
import { unvue } from "../utils";
import Salvage from "../components/salvage.vue";

export default defineComponent({
  name: "UnitPage",
  components: { Salvage },
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
        standard: 0,
        fleet: 0,
        cantina: 0,
        character: 0,
      },
    };
  },
  computed: {
    ...mapState({
      fullUnitData: "unit",
      player: "player",
      gearList: "gearList",
      gearLocations: "gearLocations",
    }),
    ...mapGetters(["gearLocation", "gearOwnedCount"]),
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
          gear.ingredients.forEach(({ gear, amount }: any) => {
            const gearData = { ...this.findGearData(gear), amount };
            const exists = list.find(
              (x: any) => x.base_id === gearData.base_id
            );
            if (exists) {
              exists.amount += amount;
            } else {
              list.push(gearData);
            }
          });
        });
      });
      return list;
    },
    currentGearLevel(): number | null {
      if (this.unit) {
        return (
          this.unit?.gear_level +
          this.unit.gear.filter((x) => x.is_obtained).length / 10
        );
      } else {
        return null;
      }
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
        (1 + this.refreshes.character);
      this.date = moment().add(this.days, "days").format("MM/DD/YYYY");
    },
    findGearData(id: string) {
      return this.gearList.find((el: any) => el.base_id === id);
    },
    timeEstimation(gear: Gear): number {
      const owned: number = this.gearOwnedCount(gear);
      const remaining = gear.amount - owned;

      if (remaining > 0) {
        let energy = 100;
        let totalDays = 0;

        gear.lookupMissionList.forEach((mission) => {
          const {
            campaignId,
            campaignNodeDifficulty,
            campaignMapId,
            campaignMissionId,
            campaignNodeId,
          } = mission.missionIdentifier;

          if (["C01SP", "C01D", "C01L"].includes(campaignId)) {
            let missionEnergy = 0;
            const node = Number(campaignMissionId.replace(/\D/g, ""));

            if (node <= 4) {
              missionEnergy = 6;
            } else if (node >= 6) {
              missionEnergy = 8;
            } else if (node >= 9) {
              missionEnergy = 10;
            }

            if (campaignNodeDifficulty === 5) {
              missionEnergy *= 2;
            }

            if (missionEnergy < energy) {
              const droprate = 0.2;
              const refreshes = ["C01D", "C01L"].includes(campaignId)
                ? this.refreshes.standard
                : this.refreshes.fleet;
              const extraEnergy = ["C01D", "C01L"].includes(campaignId)
                ? 135
                : 45;
              const totalEnergy = 240 + extraEnergy + 120 * refreshes;

              const chancesPerDay = totalEnergy / missionEnergy;
              const piecesPerDay = chancesPerDay * droprate;
              totalDays = remaining / piecesPerDay;
              energy = missionEnergy;
            }
          } else if (campaignMapId === "CHALLENGES") {
            energy = 0;
            totalDays = remaining / (60 / 7);
          }
        });
        return totalDays;
      } else {
        return 0;
      }
    },
  },
  created() {
    this.fetchUnit(this.$route.params.unitId);
  },
  watch: {
    unit(newVal: PlayerUnit) {
      this.fetchUnit(newVal.base_id);
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
