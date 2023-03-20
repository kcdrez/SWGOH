<template>
  <div class="swgoh-page container my-2 scavenger-page">
    <div class="row">
      <div class="col">
        <div class="input-group input-group-sm">
          <span class="input-group-text">Timeline (days):</span>
          <input
            class="form-control"
            v-model.number="calculator.timeline"
            type="number"
            placeholder="Enter time in days"
          />
        </div>
        <div class="input-group input-group-sm">
          <span class="input-group-text">Relic Level:</span>
          <select v-model.number="calculator.relicTarget" class="form-control">
            <option v-for="num in maxRelicLevel" :value="num" :key="num">
              Relic {{ num }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <table class="table table-bordered table-dark table-sm table-striped">
          <thead class="text-center align-middle">
            <tr>
              <th colspan="2">Total Daily Expenses</th>
            </tr>
          </thead>
          <tbody class="text-center align-middle">
            <tr>
              <td
                :title="`Total amount of standard energy needed to spend each day to achieve a Relic ${calculator.relicTarget} every ${calculator.timeline} days`"
              >
                Total Daily Standard Energy
                <img src="../../images/standard_energy.png" />
              </td>
              <td>{{ totalEnergy }}</td>
            </tr>
            <tr>
              <td
                :title="`Total amount of standard energy refreshes needed each day to achieve a Relic ${calculator.relicTarget} every ${calculator.timeline} days`"
              >
                Standard Energy Refreshes Daily
              </td>
              <td>{{ refreshes.standard }}</td>
            </tr>
            <tr>
              <td
                :title="`Total amount of standard energy available to spend on other projets each day (e.g. character shards)`"
              >
                Standard Energy Remainder Daily
              </td>
              <td>{{ energyRemaining.standard }}</td>
            </tr>
            <tr>
              <td
                :title="`Total amount of fleet energy needed to spend each day to achieve a Relic ${calculator.relicTarget} every ${calculator.timeline} days`"
              >
                Total Fleet Energy Daily
                <img src="../../images/ship_energy.png" />
              </td>
              <td>{{ totalFleetEnergy }}</td>
            </tr>
            <tr>
              <td
                :title="`Total amount of fleet energy refreshes needed each day to achieve a Relic ${calculator.relicTarget} every ${calculator.timeline} days`"
              >
                Fleet Energy Refreshes Daily
              </td>
              <td>{{ refreshes.fleet }}</td>
            </tr>
            <tr>
              <td
                :title="`Total amount of fleet energy available to spend on other projets each day (e.g. character shards)`"
              >
                Fleet Energy Remainder Daily
              </td>
              <td>{{ energyRemaining.fleet }}</td>
            </tr>
            <tr>
              <td
                :title="`Total amount of crystals needed to spend for energy refreshes every day to achieve a Relic ${calculator.relicTarget} every ${calculator.timeline} days`"
              >
                Daily Crystals Spent
                <img src="../../images/crystals.png" />
              </td>
              <td>{{ crystalsSpent }}</td>
            </tr>
            <tr>
              <td
                :title="`Total amount of guild store currency needed to spend on gear every day to achieve a Relic ${calculator.relicTarget} every ${calculator.timeline} days`"
              >
                Daily Guild Store Currency Spent
                <img src="../../images/guildStoreCurrency.png" />
              </td>
              <td>{{ currencySpent.guild_store }}</td>
            </tr>
            <tr>
              <td
                :title="`Total amount of Squad Arena Store Currency needed to spend on gear every day to achieve a Relic ${calculator.relicTarget} every ${calculator.timeline} days`"
              >
                Daily Squad Arena Currency Spent
                <img src="../../images/squadArenaCurrency.png" />
              </td>
              <td>{{ currencySpent.squad_arena_store }}</td>
            </tr>
            <tr>
              <td
                :title="`Total amount of Guild Events Mk 1 currency needed to spend on gear every day to achieve a Relic ${calculator.relicTarget} every ${calculator.timeline} days`"
              >
                Daily Guild Events (I) Currency Spent
                <img src="../../images/get1.png" />
              </td>
              <td>{{ currencySpent.guild_events_store1 }}</td>
            </tr>
            <tr>
              <td
                :title="`Total amount of Guild Events Mk 2 needed to spend on gear every day to achieve a Relic ${calculator.relicTarget} every ${calculator.timeline} days`"
              >
                Daily Guild Events (II) Currency Spent
                <img src="../../images/get2.png" />
              </td>
              <td>{{ currencySpent.guild_events_store2 }}</td>
            </tr>
            <tr>
              <td
                :title="`Total amount of Guild Events Mk 3 needed to spend on gear every day to achieve a Relic ${calculator.relicTarget} every ${calculator.timeline} days`"
              >
                Daily Guild Events (III) Currency Spent
                <img src="../../images/get3.png" />
              </td>
              <td>{{ currencySpent.guild_events_store3 }}</td>
            </tr>
            <tr>
              <td
                :title="`Total amount of Shard Shop Currency needed to spend on gear every day to achieve a Relic ${calculator.relicTarget} every ${calculator.timeline} days`"
              >
                Daily Shard Shop Currency Spent
                <img src="../../images/shardCurrency.png" />
              </td>
              <td>{{ currencySpent.shard_store }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <RelicCalculatorTable
          v-for="table in calculator.tableData"
          :key="table.id"
          :plannerData="table"
          class="mb-2"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";

import RelicCalculatorTable from "components/relic/calculator/relicCalculatorTable.vue";
import { maxRelicLevel } from "types/relic";
import { RelicPlanner } from "types/relicPlanner";

export default defineComponent({
  name: "RelicCalculatorPage",
  components: { RelicCalculatorTable },
  data() {
    return { maxRelicLevel };
  },
  computed: {
    ...mapState("relic", ["calculator"]),
    totalEnergy(): number {
      return this.calculator.tableData
        .reduce(
          (acc: { amount: number; nodeId: string }[], data: RelicPlanner) => {
            const match = acc.find(
              (x) => x.nodeId === data.farmingNodeData.location
            );
            if (
              data.farmingNodeData.location.includes("lightside") ||
              data.farmingNodeData.location.includes("darkside")
            ) {
              if (match) {
                match.amount = Math.ceil(
                  Math.max(data.totalEnergy, match.amount)
                );
              } else {
                acc.push({
                  amount: Math.ceil(data.totalEnergy),
                  nodeId: data.farmingNodeData.location,
                });
              }
            }
            return acc;
          },
          []
        )
        .reduce((total: number, el: { amount: number; nodeId: string }) => {
          return total + el.amount;
        }, 0);
    },
    totalFleetEnergy(): number {
      return this.calculator.tableData
        .reduce(
          (acc: { amount: number; nodeId: string }[], data: RelicPlanner) => {
            const match = acc.find(
              (x) => x.nodeId === data.farmingNodeData.location
            );
            if (data.farmingNodeData.location.includes("fleet")) {
              if (match) {
                match.amount = Math.max(data.totalEnergy, match.amount);
              } else {
                acc.push({
                  amount: data.totalEnergy,
                  nodeId: data.farmingNodeData.location,
                });
              }
            }
            return acc;
          },
          []
        )
        .reduce((total: number, el: { amount: number; nodeId: string }) => {
          return total + el.amount;
        }, 0);
    },
    refreshes(): { standard: number; fleet: number; cantina: number } {
      const standard = Math.ceil(
        Math.ceil(Math.max(this.totalEnergy - 375, 0) * 120) / 120 / 120
      );
      const fleet = Math.ceil(
        Math.ceil(Math.max(this.totalFleetEnergy - 375, 0) * 120) / 120 / 120
      );

      return {
        standard,
        fleet,
        cantina: 0,
      };
    },
    energyRemaining(): { standard: number; fleet: number; cantina: number } {
      const standard = Math.ceil(
        Math.max(375 + this.refreshes.standard * 120 - this.totalEnergy, 0)
      );
      const fleet = Math.ceil(
        Math.max(375 + this.refreshes.fleet * 120 - this.totalEnergy, 0)
      );

      return {
        standard,
        fleet,
        cantina: 0,
      };
    },
    currencySpent(): {
      guild_store: number;
      squad_arena_store: number;
      guild_events_store1: number;
      guild_events_store2: number;
      guild_events_store3: number;
      shard_store: number;
    } {
      return this.calculator.tableData.reduce(
        (acc: any, data: RelicPlanner) => {
          data.storeGear.forEach((store) => {
            acc[store.location] += store.totalCurrency;
          });
          return acc;
        },
        {
          guild_store: 0,
          squad_arena_store: 0,
          guild_events_store1: 0,
          guild_events_store2: 0,
          guild_events_store3: 0,
          shard_store: 0,
        }
      );
    },
    crystalsSpent(): number {
      type tMap = {
        [key: number]: number;
      };

      const energyMap: tMap = {
        0: 0,
        1: 50,
        2: 100,
        3: 150,
        4: 250,
        5: 350,
        6: 450,
        7: 650,
        8: 850,
        9: 1050,
        10: 1450,
        11: 1850,
        12: 2250,
        13: 3050,
        14: 3850,
        15: 4650,
      };
      const cantinaEnergyMap: tMap = {
        0: 0,
        1: 100,
        2: 200,
        3: 300,
        4: 500,
        5: 700,
        6: 1100,
        7: 1500,
        8: 2300,
        9: 3100,
        10: 3900,
        11: 5500,
        12: 7100,
        13: 10300,
        14: 13500,
      };
      const standard =
        this.refreshes.standard in energyMap
          ? energyMap[this.refreshes.standard]
          : Infinity;
      const fleet =
        this.refreshes.fleet in energyMap
          ? energyMap[this.refreshes.fleet]
          : Infinity;
      const cantina =
        this.refreshes.cantina in cantinaEnergyMap
          ? cantinaEnergyMap[this.refreshes.cantina]
          : Infinity;

      return standard + fleet + cantina;
    },
  },
});
</script>

<style lang="scss" scoped>
td {
  img {
    max-width: 30px;
  }
}
</style>
