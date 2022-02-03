<template>
  <Loading :state="requestState" size="md" message="Loading Gear Data">
    <h3 class="gear-header">
      Relic Mats Needed to get {{ unit.name }} from Relic Level
      {{ currentRelicLevel }} to
      <select v-model.number="relicTarget">
        <option
          v-for="num in relicOptions(unit.relic_tier)"
          :value="num"
          :key="num"
        >
          Relic {{ num }}
        </option>
      </select>
      :
    </h3>
    <h3>
      It will take approximately
      {{ totalDays(unit) }} day{{ totalDays(unit) === 1 ? "" : "s" }} to get to
      Relic Level {{ relicTarget }}.
    </h3>
    <div class="input-group input-group-sm w-50 mb-3">
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
        v-model.number="refreshes"
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
        v-model.number="energy"
        min="0"
        :max="165 + refreshes * 120"
      />
    </div>
    <RelicTable
      :relicList="relicList"
      :targetLevels="[{ level: currentRelicLevel, target: relicTarget }]"
    />
  </Loading>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapState } from "vuex";

import Loading from "../loading.vue";
import RelicTable from "./relicTable.vue";
import { UpdateItem } from "../../types/planner";
import { loadingState } from "../../types/loading";
import { Relic } from "../../types/relic";

export default defineComponent({
  name: "RelicPlannerComponent",
  components: { Loading, RelicTable },
  computed: {
    ...mapState("relic", ["relicConfig"]),
    ...mapState("unit", ["unit"]),
    ...mapGetters("relic", ["relicOptions", "totalDays"]),
    ...mapGetters(["someLoading"]),
    requestState(): loadingState {
      return this.someLoading(["relic", "unit"]);
    },
    currentRelicLevel(): number {
      return this.unit?.relic_tier < 0 ? 0 : this.unit.relic_tier;
    },
    relicTarget: {
      get(): number {
        return this.$store.getters["planner/relicTarget"](this.unit.id);
      },
      set(value: number) {
        const payload: UpdateItem = {
          type: "relic",
          value,
          unitId: this.unit.id,
        };
        this.$store.dispatch("planner/updatePlannerTarget", payload);
      },
    },
    refreshes: {
      get(): number {
        return this.$store.state.relic.refreshes.cantina;
      },
      set(value: number) {
        this.$store.dispatch("relic/updateRefreshes", value);
      },
    },
    energy: {
      get(): number {
        return this.$store.state.relic.energy.cantina;
      },
      set(value: number) {
        this.$store.dispatch("relic/updateEnergy", value);
      },
    },
    relicList(): Relic[] {
      return Object.values(this.relicConfig);
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
