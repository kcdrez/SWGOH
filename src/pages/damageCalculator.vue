<template>
  <div class="container swgoh-page mb-3">
    <Loading :state="requestState" message="Loading Unit Data" size="lg">
      <div class="damage-calculator-container">
        <div class="container">
          <div class="row">
            <div class="col">
              <div class="input-group input-group-sm add-unit-container"></div>
              <Toggle
                v-model="physical"
                onLabel="Physical"
                offLabel="Special"
              />
            </div>
          </div>
          <div class="row mt-2">
            <div class="col">
              <h6>Select a Character to view their stats:</h6>
              <SearchInput
                placeholder="Select a Character"
                :list="player.units"
                @select="selectUnit($event)"
              />
              <template v-if="selected">
                <div class="input-group input-group-sm">
                  <span class="input-group-text">Offense:</span>
                  <span class="input-group-text value">{{
                    physical
                      ? selected.offense.physical
                      : selected.offense.special
                  }}</span>
                </div>
                <div class="input-group input-group-sm">
                  <span class="input-group-text">Crit Chance:</span>
                  <span class="input-group-text value">{{
                    physical
                      ? selected.critChance.physical
                      : selected.critChance.special
                  }}</span>
                </div>
                <div class="input-group input-group-sm">
                  <span class="input-group-text">Crit Damage:</span>
                  <span class="input-group-text value">{{
                    selected.critDamage
                  }}</span>
                </div>
                <div class="average-damage">
                  <div>
                    Average Damage per Hit: {{ averageDamagePerHitUnit }}
                  </div>
                </div>
              </template>
            </div>
            <div class="col">
              <h6>
                Select a Character to apply their mods to the other character or
                modify them directly:
              </h6>
              <SearchInput
                placeholder="Select a Character"
                :list="player.units"
                @select="selectMods($event)"
              />
              <div class="input-group input-group-sm">
                <span
                  class="input-group-text c-help energy-text"
                  title="Energy used on Light and Dark side tables"
                  >Offense:</span
                >
                <input
                  class="form-control refresh-input"
                  type="number"
                  v-model.number="offense"
                  min="0"
                />
              </div>
              <div class="input-group input-group-sm">
                <span
                  class="input-group-text c-help energy-text"
                  title="Energy used on Light and Dark side tables"
                  >Crit Chance:</span
                >
                <input
                  class="form-control refresh-input"
                  type="number"
                  v-model.number="critChance"
                  min="0"
                />
              </div>
              <div class="input-group input-group-sm">
                <span
                  class="input-group-text c-help energy-text"
                  title="Energy used on Light and Dark side tables"
                  >Crit Damage:</span
                >
                <input
                  class="form-control refresh-input"
                  type="number"
                  v-model.number="critDamage"
                  min="0"
                />
              </div>
              <div class="average-damage">
                Average Damage per Hit: {{ averageDamagePerHit }}
              </div>
            </div>
          </div>
          <div class="row" v-if="selected">
            <div class="col difference-container">
              <div
                class="rounded text-dark"
                :class="{
                  'bg-danger': averageDamagePerHit < averageDamagePerHitUnit,
                  'bg-success': averageDamagePerHit > averageDamagePerHitUnit,
                  'bg-warning': averageDamagePerHit === averageDamagePerHitUnit,
                }"
              >
                Difference:
                <span>{{ difference }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Loading>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapState } from "vuex";

import { initializeModules, randomNumber, round2Decimals } from "../utils";
import { loadingState } from "../types/loading";
import { Unit } from "../types/unit";

const dependencyModules = ["player", "guild"];

interface dataModel {
  selected: null | Unit;
  offense: number;
  critChance: number;
  critDamage: number;
  physical: boolean;
}

export default defineComponent({
  name: "DamageCalculatorPage",
  data() {
    return {
      selected: null,
      offense: 0,
      offensePercent: 0,
      critChance: 0,
      critDamage: 0,
      physical: true,
    } as dataModel;
  },
  computed: {
    ...mapGetters(["someLoading"]),
    ...mapState("player", ["player"]),
    ...mapGetters("player", ["unitData"]),
    requestState(): loadingState {
      return this.someLoading(dependencyModules);
    },
    averageDamagePerHit(): number {
      //see https://gaming-fans.com/2017/02/15/swgoh-a-look-at-offense-critical-damage-and-critical-chance/
      const critChance = this.critChance / 100;
      const critDamage = this.critDamage / 100;
      return Math.floor(this.offense * (critChance * (critDamage - 1) + 1));
    },
    averageDamagePerHitUnit(): number {
      if (this.selected) {
        const type = this.physical ? "physical" : "special";

        const offense = this.selected.offense[type];
        const critChance = this.selected.critChance[type] / 100;
        const critDamage = this.selected.critDamage / 100;
        return Math.floor(offense * (critChance * (critDamage - 1) + 1));
      } else {
        return 0;
      }
    },
    difference(): number {
      return this.averageDamagePerHit - this.averageDamagePerHitUnit;
    },
  },
  watch: {
    physical(newVal) {
      if (this.selected) {
        const type = newVal ? "physical" : "special";

        this.offense = this.selected.offense[type];
        this.critChance = this.selected.critChance[type];
      }
    },
    selected(newVal: Unit) {
      window.localStorage.setItem("damageCalculatorUnit", newVal.id);
    },
  },
  methods: {
    selectUnit(unit: Unit | null) {
      if (!unit) {
        return;
      }
      const type = this.physical ? "physical" : "special";

      this.selected = unit;
      this.offense = this.selected.offense[type];
      this.critChance = this.selected.critChance[type];
      this.critDamage = this.selected.critDamage;
    },
    selectMods(unit: Unit | null) {
      if (!unit) return;
      const type = this.physical ? "physical" : "special";

      if (this.selected) {
        this.offense = round2Decimals(
          (this.selected.baseOffense[type] + unit.modOffense.amount) *
            (1 + unit.modOffense.percent)
        );
        this.critChance =
          this.selected.baseCritChance[type] + unit.modCritChance;
        this.critDamage = this.selected.baseCritDamage + unit.modCritDamage;
      }
    },
  },
  async created() {
    await initializeModules(dependencyModules);
    const unitId = window.localStorage.getItem("damageCalculatorUnit") ?? "";
    if (unitId) {
      this.selectUnit(this.unitData(unitId));
    }
  },
});
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";

.damage-calculator-container {
  margin-top: 1rem;
}
.input-group {
  margin-top: 0.5rem;

  .input-group-text {
    &:first-child {
      width: 100px;
    }
    &.value {
      flex: 1 1 auto;
    }
  }
}
.average-damage {
  text-align: center;
  border-radius: 5px;
  background-color: $dark;
  margin-top: 0.5rem;
}
.difference-container {
  margin: 0.5rem 33.33%;
  text-align: center;
}

::v-deep(.toggle) {
  width: 80px;
  justify-content: unset;

  &.toggle-on {
    .toggle-label {
      margin-left: 0.5rem;
    }
  }
  &.toggle-off {
    .toggle-label {
      margin-left: 1.5rem;
    }
  }
}
</style>
