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
        Summary:
        <div>Total Energy: {{ totalEnergy }}</div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <RelicCalculatorTable
          v-for="table in calculator.tableData"
          :key="table.id"
          :plannerData="table"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";

import RelicCalculatorTable from "../components/relic/calculator/relicCalculatorTable.vue";
import { maxRelicLevel } from "../types/relic";
import { RelicPlanner } from "../types/relicPlanner";

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
              !match &&
              (data.farmingNodeData.location.includes("lightside") ||
                data.farmingNodeData.location.includes("darkside"))
            ) {
              acc.push({
                amount: data.totalEnergy,
                nodeId: data.farmingNodeData.location,
              });
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
            if (
              !match && //instead of checking match, use the max of the two
              (data.farmingNodeData.location.includes("lightside") ||
                data.farmingNodeData.location.includes("darkside"))
            ) {
              acc.push({
                amount: data.totalEnergy,
                nodeId: data.farmingNodeData.location,
              });
            }
            return acc;
          },
          []
        )
        .reduce((total: number, el: { amount: number; nodeId: string }) => {
          return total + el.amount;
        }, 0);
    },
  },
});
</script>

<style lang="scss" scoped>
.scavenger-page {
  ::v-deep(.carbonite-circuit-board .section-header) {
    z-index: 18;
  }
  ::v-deep(.bronzium-wiring .section-header) {
    z-index: 17;
  }
  ::v-deep(.chromium-transistor .section-header) {
    z-index: 16;
  }
  ::v-deep(.aurodium-heatsink .section-header) {
    z-index: 15;
  }
  ::v-deep(.electrium-conductor .section-header) {
    z-index: 14;
  }
  ::v-deep(.zinbiddle-card .section-header) {
    z-index: 13;
  }
  ::v-deep(.gyrda-keypad .section-header) {
    z-index: 12;
  }
}
</style>
