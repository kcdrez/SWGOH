<template>
  <div class="collapse-header section-header mt-3 extended-1">
    <h3 class="w-100" data-bs-toggle="collapse" href="#shipCalculatorSection">
      <div class="d-inline">Ship Stat Calculator</div>
    </h3>
  </div>
  <div id="shipCalculatorSection" ref="shipCalculatorSection" class="collapse">
    <div class="container">
      <div class="row mt-2">
        <div class="col">
          <h6>Select a Ship to view their stats:</h6>
          <SearchInput
            placeholder="Select a Ship"
            :list="shipsList"
            :searchBy="['name', 'id', 'aliases']"
            v-model="selected"
          />
        </div>
        <div class="col"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapState } from "vuex";

import { setupEvents } from "../../utils";
import { Unit } from "../../types/unit";

interface dataModel {
  selected: null | Unit;
}

export default defineComponent({
  name: "ShipCalculator",
  data() {
    return {
      selected: null,
    } as dataModel;
  },
  computed: {
    ...mapState("player", ["player"]),
    ...mapGetters("player", ["unitData", "shipsList"]),
  },
  watch: {
    selected(newVal: Unit) {
      if (newVal) {
        window.localStorage.setItem("shipCalculatorUnit", newVal.id);
      }
    },
  },
  methods: {},
  async created() {
    const unitId = window.localStorage.getItem("shipCalculatorUnit") ?? "";
    if (unitId) {
      this.selected = this.unitData(unitId) ?? null;
    }
  },
  mounted() {
    setupEvents(
      this.$refs?.shipCalculatorSection as any as HTMLElement,
      "shipCalculatorSection"
    );
  },
});
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";

.input-group {
  margin-top: 0.5rem;

  .input-group-text {
    &:first-child {
      width: 150px;
    }
    &.value {
      flex: 1 1 auto;
    }
  }
}
</style>
