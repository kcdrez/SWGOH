<template>
  <div class="collapse show" id="gearSection">
    <Loading :state="requestState" size="md" message="Loading Gear Data">
      <h3 class="gear-header">
        Gear Needed to get {{ unit.name }} from Gear Level
        {{ currentGearLevel }} to
        <select v-model.number="gearTarget">
          <option v-for="num in gearOptions" :value="num" :key="num">
            Gear {{ num }}
          </option>
        </select>
        :
      </h3>
      <h3>
        It will take approximately {{ totalDays }} days to get to Gear Level
        {{ gearTarget }}.
      </h3>
      <div class="input-group input-group-sm w-50">
        <span
          class="input-group-text c-help energy-text"
          title="Energy used on Light and Dark side tables"
          >Standard Energy:</span
        >
        <span
          class="input-group-text c-help"
          title="How many times you refresh the energy using crystals"
          >Daily Refreshes:</span
        >
        <input
          class="form-control"
          type="number"
          v-model.number="refreshes.standard"
          min="0"
        />
        <span
          class="input-group-text c-help"
          title="How much of your daily energy used for farming other things (i.e. character shards)"
          >Daily Energy Used:</span
        >
        <input
          class="form-control"
          type="number"
          v-model.number="energy.standard"
          min="0"
          :max="145 + refreshes.standard * 120 + 135"
        />
      </div>
      <div class="input-group input-group-sm my-2 w-50">
        <span
          class="input-group-text c-help energy-text"
          title="Energy used on fleet/ship nodes"
          >Fleet Energy:</span
        >
        <span
          class="input-group-text c-help"
          title="How many times you refresh the energy using crystals"
          >Daily Refreshes:</span
        >
        <input
          class="form-control"
          type="number"
          v-model.number="refreshes.fleet"
          min="0"
        />
        <span
          class="input-group-text c-help"
          title="How much of your daily energy used for farming other things (e.g. character shards)"
          >Daily Energy Used:</span
        >
        <input
          class="form-control"
          type="number"
          v-model.number="energy.fleet"
          min="0"
          :max="145 + refreshes.fleet * 120 + 45"
        />
      </div>
      <table class="table table-bordered table-dark table-sm table-striped">
        <thead>
          <tr class="text-center">
            <th width="20%">
              <div class="c-pointer" @click="sortBy('name')">
                Salvage Name
                <i class="fas mx-1" :class="sortIcon('name')"></i>
              </div>
              <input
                class="form-control form-control-sm mx-auto my-1 w-75"
                placeholder="Search"
                v-model="searchName"
              />
            </th>
            <th width="20%" class="c-pointer" @click="sortBy('location')">
              Locations
              <i class="fas mx-1" :class="sortIcon('location')"></i>
            </th>
            <th width="20%" class="c-pointer" @click="sortBy('amount')">
              Amount
              <i class="fas mx-1" :class="sortIcon('amount')"></i>
            </th>
            <th width="10%" class="c-pointer" @click="sortBy('time')">
              Est. Time
              <i class="fas mx-1" :class="sortIcon('time')"></i>
            </th>
            <!-- <th width="15%">Actions</th> -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="salvage in filteredSalvageList" :key="salvage.base_id">
            <td class="text-center">
              <GearIcon :gear="salvage" />
            </td>
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
            <td class="text-center">{{ timeEstimation(salvage) }} Days</td>
            <!-- <td>
              <div class="btn-group btn-group-sm" role="group">
                <button type="button" class="btn btn-primary">Left</button>
                <button type="button" class="btn btn-secondary">Middle</button>
                <button type="button" class="btn btn-info">Right</button>
              </div>
            </td> -->
          </tr>
        </tbody>
      </table>
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
} from "../../api/interfaces";
import moment from "moment";
import { unvue } from "../../utils";
import Salvage from "./salvage.vue";
import GearIcon from "./gearIcon.vue";
import Loading from "../loading.vue";

export default defineComponent({
  name: "GearPlannerComponent",
  components: { Salvage, GearIcon, Loading },
  data() {
    return {
      refreshes: {
        standard: 0,
        fleet: 0,
        cantina: 0,
      },
      energy: {
        standard: 0,
        fleet: 0,
        cantina: 0,
      },
      gearTarget: 13,
      sortMethod: "name",
      sortDir: "asc",
      searchName: "",
    };
  },
  computed: {
    ...mapState("gear", ["gearList", "gearLocations", "requestState"]),
    ...mapState("unit", ["unit"]),
    ...mapGetters("gear", ["gearLocation", "gearOwnedCount", "findGearData"]),
    ...mapGetters("unit", ["currentGearLevel"]),
    fullGearListByLevel(): any[] {
      if (this.unit) {
        const { gear_level, gear } = this.unit;
        const futureGear =
          this.unit?.unitTierList.filter((x: any) => x.tier >= gear_level) ||
          [];

        return futureGear.map((gear: any) => {
          return {
            tier: gear.tier,
            gear: gear.equipmentSetList
              .map((id: string, index: number) => {
                let alreadyEquipped = false;
                if (gear.tier === this.unit?.gear_level) {
                  alreadyEquipped = this.unit?.gear[index].is_obtained || false;
                }

                if (alreadyEquipped) {
                  return null;
                } else {
                  return this.findGearData(id);
                }
              })
              .filter((x: any) => !!x),
          };
        });
      } else {
        return [];
      }
    },
    fullSalvageList(): Gear[] {
      let list: Gear[] = [];
      this.fullGearListByLevel.forEach((tier: any) => {
        if (tier.tier + 1 <= this.gearTarget) {
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
        }
      });

      return list.sort((a: Gear, b: Gear) => {
        if (this.sortMethod === "name") {
          const compareA = a.name.toLowerCase();
          const compareB = b.name.toLowerCase();
          if (this.sortDir === "asc") {
            return compareA > compareB ? 1 : -1;
          } else {
            return compareA > compareB ? -1 : 1;
          }
        } else if (this.sortMethod === "locations") {
          const locationsA = this.gearLocation(a.lookupMissionList);
          const locationsB = this.gearLocation(b.lookupMissionList);
          if (this.sortDir === "asc") {
            return locationsA[0] > locationsB[0] ? 1 : -1;
          } else {
            return locationsA[0] < locationsB[0] ? -1 : 1;
          }
        } else if (this.sortMethod === "amount") {
          if (this.sortDir === "asc") {
            return a.amount - b.amount;
          } else {
            return b.amount - a.amount;
          }
        } else if (this.sortMethod === "time") {
          const compareA = this.timeEstimation(a);
          const compareB = this.timeEstimation(b);
          if (this.sortDir === "asc") {
            return compareA - compareB;
          } else {
            return compareB - compareA;
          }
        }
        return 0;
      });
    },
    filteredSalvageList(): Gear[] {
      return this.fullSalvageList.filter((gear) => {
        const name = gear.name.toLowerCase().replace(/\s/g, "");
        const compare = this.searchName.toLowerCase().replace(/\s/g, "");
        return name.includes(compare);
      });
    },
    totalDays(): number {
      let totalStandard = 0;
      let totalFleet = 0;
      let totalChallenges = 0;
      this.fullSalvageList.forEach((gear: Gear) => {
        const isChallenge = gear.lookupMissionList.some(
          (x: Mission) => x.missionIdentifier.campaignMapId === "CHALLENGES"
        );
        const isFleet = gear.lookupMissionList.some(
          (x: Mission) => x.missionIdentifier.campaignId === "C01SP"
        );
        if (isChallenge) {
          totalChallenges = Math.max(
            this.timeEstimation(gear),
            totalChallenges
          );
        } else if (isFleet) {
          totalFleet += this.timeEstimation(gear);
        } else {
          totalStandard += this.timeEstimation(gear);
        }
      });
      return Math.max(totalStandard, totalFleet, totalChallenges);
    },
    gearOptions(): number[] {
      const list = [];
      for (let i = (this.unit?.gear_level || 0) + 1; i <= 13; i++) {
        list.push(i);
      }
      return list;
    },
  },
  methods: {
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
            let missionEnergy = 1;
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
              const dropRate = 0.2;
              const refreshes = ["C01D", "C01L"].includes(campaignId)
                ? this.refreshes.standard
                : this.refreshes.fleet;
              const extraEnergy = ["C01D", "C01L"].includes(campaignId)
                ? 135
                : 45;
              const otherEnergy = ["C01D", "C01L"].includes(campaignId)
                ? this.energy.standard
                : this.energy.fleet;
              const totalEnergy =
                240 + extraEnergy + 120 * refreshes - otherEnergy;

              const chancesPerDay = totalEnergy / missionEnergy;
              const piecesPerDay = chancesPerDay * dropRate;
              totalDays = remaining / piecesPerDay;
              energy = missionEnergy;
            }
          } else if (campaignMapId === "CHALLENGES") {
            energy = 0;
            totalDays = remaining / (60 / 7);
          }
        });
        return Math.round(totalDays);
      } else {
        return 0;
      }
    },
    sortBy(type: string): void {
      if (this.sortMethod === type) {
        this.sortDir = this.sortDir === "asc" ? "desc" : "asc";
      } else {
        this.sortDir = "asc";
      }
      this.sortMethod = type;
    },
    sortIcon(type: string): string {
      if (this.sortMethod === type) {
        return this.sortDir === "asc" ? "fa-sort-down" : "fa-sort-up";
      } else {
        return "fa-sort";
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.gear-header {
  select {
    width: 115px;
    font-size: 1.25rem;
  }
}

table {
  thead {
    tr {
      vertical-align: top;
    }
  }
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

.energy-text {
  width: 130px;
  display: block;
}
</style>
