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
            :list="player.units"
            :searchBy="['name', 'id', 'aliases']"
            v-model="selected"
          />
          <div class="input-group input-group-sm">
            <span
              class="input-group-text c-help"
              title="The amount of Protection the unit has without mods"
              >Base Protection:</span
            >
            <input
              class="form-control refresh-input"
              type="number"
              v-model.number="baseProtection"
              min="0"
            />
          </div>
          <div class="input-group input-group-sm">
            <span
              class="input-group-text c-help"
              title="The amount of Health the unit has without mods"
              >Base Health:</span
            >
            <input
              class="form-control refresh-input"
              type="number"
              v-model.number="baseHealth"
              min="1"
            />
          </div>
          <div class="input-group input-group-sm">
            <span
              class="input-group-text c-help"
              title="The amount of Amor (Physical) the unit has without mods. Enter a whole number representing a percent (e.g. a 10% increase enter '10')"
              >Base Armor:</span
            >
            <input
              class="form-control refresh-input"
              type="number"
              v-model.number="baseArmor"
              min="0"
              max="99"
            />
          </div>
          <div class="input-group input-group-sm">
            <span
              class="input-group-text c-help"
              title="The amount of Protection the unit receives from other effects (such as unique abilities)"
              >Bonus Protection:</span
            >
            <span
              class="input-group-text c-help"
              title="Enter a whole number representing a percent (e.g. a 10% increase enter '10')"
              >Percent:</span
            >
            <input
              class="form-control refresh-input"
              type="number"
              v-model.number="bonusProtection.percent"
              min="0"
            />
            <span
              class="input-group-text c-help"
              title="Enter a whole number that is a static amount (e.g. Geo Brood Alpha adds 15,000 to all Geos)"
              >Flat:</span
            >
            <input
              class="form-control refresh-input"
              type="number"
              v-model.number="bonusProtection.flat"
              min="0"
            />
          </div>
          <div class="input-group input-group-sm">
            <span
              class="input-group-text c-help"
              title="The amount of Health the unit receives from other effects (such as unique abilities)"
              >Bonus Health:</span
            >
            <span
              class="input-group-text c-help"
              title="Enter a whole number representing a percent (e.g. a 10% increase enter '10')"
              >Percent:</span
            >
            <input
              class="form-control refresh-input"
              type="number"
              v-model.number="bonusHealth.percent"
              min="0"
            />
            <span
              class="input-group-text c-help"
              title="Enter a whole number that is a static amount (e.g. Geo Brood Alpha adds 15,000 to all Geos)"
              >Flat:</span
            >
            <input
              class="form-control refresh-input"
              type="number"
              v-model.number="bonusHealth.flat"
              min="0"
            />
          </div>
          <div class="input-group input-group-sm">
            <span
              class="input-group-text c-help"
              title="The amount of Defense the unit receives from other effects (such as unique abilities). Enter a whole number representing a percent (e.g. a 10% increase enter '10')"
              >Bonus Defense:</span
            >
            <span
              class="input-group-text c-help"
              title="Enter a whole number representing a percent (e.g. a 10% increase enter '10')"
              >Percent:</span
            >
            <input
              class="form-control refresh-input"
              type="number"
              v-model.number="bonusDefense.percent"
              min="0"
            />
            <span
              class="input-group-text c-help"
              title="Enter a whole number that is a static amount (e.g. Clone Wars Chewy adds 50 Defense to all allies with his leadership)"
              >Flat:</span
            >
            <input
              class="form-control refresh-input"
              type="number"
              v-model.number="bonusDefense.flat"
              min="0"
            />
          </div>
        </div>
        <div class="col">
          <table class="table table-bordered table-dark table-sm table-striped">
            <thead>
              <tr class="text-center align-middle">
                <th>
                  <div class="input-group input-group-sm">
                    <span class="input-group-text">Sort By:</span>
                    <select class="form-control" v-model="sortMethod">
                      <option value="total">Total Survivability</option>
                      <option value="sets">Sets</option>
                      <option value="primaries">Primaries</option>
                    </select>
                  </div>
                  <div class="input-group input-group-sm my-1">
                    <span class="input-group-text">Sort Direction:</span>
                    <select class="form-control" v-model="sortDir">
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                  </div>
                  <div class="input-group input-group-sm my-1">
                    <span class="input-group-text">Primary Stat Count:</span>
                    <select class="form-control" v-model="primaryCount">
                      <option :value="3">3</option>
                      <option :value="4">4</option>
                    </select>
                  </div>
                </th>
                <th>Total Survivability</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, index) in rows"
                :key="index"
                class="align-middle text-center"
              >
                <td>
                  <div>{{ row.sets.label }}</div>
                  <div>{{ row.primaries.label }}</div>
                </td>
                <td>
                  <div
                    class="rounded text-dark"
                    :class="{
                      'bg-danger': row.minimum,
                      'bg-success': row.maximum,
                      'bg-info': !row.minimum && !row.maximum,
                    }"
                  >
                    {{ row.value }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
    ...mapGetters("player", ["unitData"]),
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
      this.$refs?.survivabilityCalculatorSection as any as HTMLElement,
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
