<template>
  <div class="swgoh-page container my-2">
    <div class="row">
      <div class="col">
        <ScavengerTable
          scavengerId="carbonite_circuit_board"
          label="Carbonite Circuit Boards"
          class="mb-2"
        />
        <ScavengerTable
          scavengerId="bronzium_wiring"
          label="Bronzium Wiring"
          class="mb-2"
        />
        <ScavengerTable
          scavengerId="chromium_transistor"
          label="Chromium Transistors"
          class="mb-2"
        />
        <ScavengerTable
          scavengerId="aurodium_heatsink"
          label="Aurodium Heatsink"
          class="mb-2"
        />
        <ScavengerTable
          scavengerId="electrium_conductor"
          label="Electrium Conductors"
          class="mb-2"
        />
        <ScavengerTable
          scavengerId="zinbiddle_card"
          label="Zinbiddle Cards"
          class="mb-2"
        />
        <ScavengerTable
          scavengerId="impulse_detector"
          label="Impulse Detectors"
          class="mb-2"
        />
        <ScavengerTable
          scavengerId="gyrda_keypad"
          label="Gyrda Keypads"
          class="mb-2"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import ScavengerTable from "../components/gear/scavengerTable.vue";

export default defineComponent({
  name: "ScavengerPage",
  components: { ScavengerTable },
});
</script>

<style lang="scss" scoped></style>
