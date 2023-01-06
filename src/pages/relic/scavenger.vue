<template>
  <div class="swgoh-page container my-2 scavenger-page">
    <div class="row">
      <div class="col">
        <ScavengerTable
          scavengerId="carbonite_circuit_board"
          label="Carbonite Circuit Boards"
          class="mb-2 carbonite-circuit-board"
        />
        <ScavengerTable
          scavengerId="bronzium_wiring"
          label="Bronzium Wiring"
          class="mb-2 bronzium-wiring"
        />
        <ScavengerTable
          scavengerId="chromium_transistor"
          label="Chromium Transistors"
          class="mb-2 chromium-transistor"
        />
        <ScavengerTable
          scavengerId="aurodium_heatsink"
          label="Aurodium Heatsink"
          class="mb-2 aurodium-heatsink"
        />
        <ScavengerTable
          scavengerId="electrium_conductor"
          label="Electrium Conductors"
          class="mb-2 electrium-conductor"
        />
        <ScavengerTable
          scavengerId="zinbiddle_card"
          label="Zinbiddle Cards"
          class="mb-2 zinbiddle-card"
        />
        <ScavengerTable
          scavengerId="impulse_detector"
          label="Impulse Detectors"
          class="mb-2 impulse-detector"
        />
        <ScavengerTable
          scavengerId="gyrda_keypad"
          label="Gyrda Keypads"
          class="mb-2 gyrda-keypad"
        />
        <ScavengerFarmingTable />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import ScavengerTable from "components/gear/scavengerTable.vue";
import ScavengerFarmingTable from "components/gear/scavengerFarmingTable.vue";

export default defineComponent({
  name: "ScavengerPage",
  components: { ScavengerTable, ScavengerFarmingTable },
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
