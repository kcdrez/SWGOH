<template>
  <div class="container swgoh-page mb-3">
    <Loading :state="requestState" message="Loading Unit Data" size="lg">
    </Loading>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapState } from "vuex";

import { initializeModules, round2Decimals } from "../utils";
import { loadingState } from "../types/loading";
import { Unit } from "../types/unit";

const dependencyModules = ["player", "guild"];

export default defineComponent({
  name: "TBStatusPage",
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["someLoading"]),
    ...mapState("player", ["player"]),
    ...mapGetters("player", ["unitData"]),
    requestState(): loadingState {
      return this.someLoading(dependencyModules);
    },
  },
  methods: {},
  async created() {},
});
</script>

<style lang="scss" scoped></style>
