<template>
  <div class="collapse show" id="gearSection">
    <Loading :state="requestState" size="md" message="Loading Gear Data">
      <h3 class="gear-header">
        Relic Mats Needed to get {{ unit.name }} from Relic Level
        {{ currentRelicLevel }} to
        <select v-model.number="gearTarget">
          <option v-for="num in relicOptions" :value="num" :key="num">
            Relic {{ num }}
          </option>
        </select>
        :
      </h3>
      <h3>
        It will take approximately {{ totalDays }} days to get to Relic Level
        {{ relicTarget }}.
      </h3>
      <div class="input-group input-group-sm w-50">
        <span
          class="input-group-text c-help energy-text"
          title="Energy used on Light and Dark side tables"
          >Cantina Energy:</span
        >
        <span
          class="input-group-text c-help"
          title="How many times you refresh the energy using crystals"
          >Daily Refreshes:</span
        >
        <input
          class="form-control"
          type="number"
          v-model.number="refreshes.cantina"
          min="0"
        />
        <span
          class="input-group-text c-help"
          title="How much of your daily cantina energy used for farming other things (i.e. character shards)"
          >Daily Energy Used:</span
        >
        <input
          class="form-control"
          type="number"
          v-model.number="energy.cantina"
          min="0"
          :max="165 + refreshes.cantina * 120"
        />
      </div>
      <table class="table table-bordered table-dark table-sm table-striped">
        <thead>
          <tr class="text-center">
            <th width="20%">
              <div class="c-pointer" @click="sortBy('name')">
                Mat Name
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
          <tr v-for="mat in relicMatList" :key="mat.base_id">
            <td class="text-center">
              <RelicIcon :mat="mat" />
            </td>
            <td>
              <ul class="m-0">
                <li
                  v-for="(l, index) in gearLocation(mat.lookupMissionList)"
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
import { Gear, Mission } from "../../types/gear";
import moment from "moment";
import { unvue } from "../../utils";
import Salvage from "./salvage.vue";
import GearIcon from "./gearIcon.vue";
import Loading from "../loading.vue";

export default defineComponent({
  name: "RelicPlannerComponent",
  components: { Salvage, GearIcon, Loading },
  data() {
    return {
      refreshes: {
        cantina: 0,
      },
      energy: {
        cantina: 0,
      },
      relicTarget: 13,
      sortMethod: "name",
      sortDir: "asc",
      searchName: "",
      relicMatConfig: {
        //https://docs.google.com/spreadsheets/d/10ReT0Q_4yYGd_fU45Clv7XYs23a96xpWgIxLVrg9Eqg/edit#gid=769217271
        white: {
          dropRate: 1.37,
          amount: {
            1: 0,
            2: 15,
            3: 20,
            4: 20,
            5: 20,
            6: 20,
            7: 20,
            8: 20,
            9: 30,
          },
        },
        green: {
          dropRate: 0.93,
          amount: {
            1: 0,
            2: 0,
            3: 15,
            4: 25,
            5: 25,
            6: 25,
            7: 25,
            8: 25,
            9: 30,
          },
        },
        blue: {
          dropRate: 0.66,
          amount: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 15,
            6: 25,
            7: 35,
            8: 45,
            9: 55,
          },
        },
      },
    };
  },
  computed: {
    ...mapState("gear", ["gearList", "gearLocations", "requestState"]),
    ...mapState("unit", ["unit"]),
    ...mapGetters("gear", ["gearLocation", "gearOwnedCount", "findGearData"]),
    ...mapGetters("unit", ["currentGearLevel"]),
    totalDays(): number {
      return 0; //todo
    },
    relicOptions(): number[] {
      const list = [];
      for (let i = (this.unit?.relic_tier || 1) + 1; i <= 9; i++) {
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
