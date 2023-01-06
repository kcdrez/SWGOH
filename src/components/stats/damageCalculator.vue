<template>
  <div class="collapse-header section-header mt-3">
    <h3 class="w-100" data-bs-toggle="collapse" href="#damageCalculatorSection">
      <div class="d-inline">Damage Calculator</div>
    </h3>
  </div>
  <div
    id="damageCalculatorSection"
    ref="damageCalculatorSection"
    class="collapse"
  >
    <div class="container">
      <div class="row mt-2">
        <div class="col-md-6 col-sm-12">
          <h6>Select a Character to view their stats:</h6>
          <SearchInput
            placeholder="Select a Character"
            :list="player.units"
            :searchBy="['name', 'id', 'aliases']"
            v-model="selected"
          />
          <template v-if="selected">
            <div class="input-group input-group-sm">
              <span class="input-group-text">Offense:</span>
              <input
                class="form-control refresh-input"
                type="number"
                v-model.number="subject.offense"
                min="0"
              />
            </div>
            <div class="input-group input-group-sm">
              <span class="input-group-text">Crit Chance:</span>
              <input
                class="form-control refresh-input"
                type="number"
                v-model.number="subject.critChance"
                min="0"
              />
            </div>
            <div class="input-group input-group-sm">
              <span class="input-group-text">Crit Damage:</span>
              <input
                class="form-control refresh-input"
                type="number"
                v-model.number="subject.critDamage"
                min="0"
              />
            </div>
            <div class="average-damage">
              <div>Average Damage per Hit: {{ averageDamagePerHitUnit }}</div>
            </div>
          </template>
        </div>
        <div class="col-md-6 col-sm-12">
          <h6 class="select-compare-header">
            Select another Character to apply their mods and/or modify the
            values directly:
          </h6>
          <SearchInput
            placeholder="Select a Character"
            :list="player.units"
            :searchBy="['name', 'id', 'aliases']"
            @update:modelValue="selectMods($event)"
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
              v-model.number="target.offense"
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
              v-model.number="target.critChance"
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
              v-model.number="target.critDamage"
              min="0"
            />
          </div>
          <div class="average-damage">
            Average Damage per Hit: {{ averageDamagePerHit }}
          </div>
        </div>
      </div>
      <div class="row my-2">
        <div class="col justify-content-center d-flex">
          <Toggle
            v-model="physical"
            onLabel="Physical Damage"
            offLabel="Special Damage"
          />
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
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapState } from "vuex";

import { round2Decimals, setupEvents } from "utils";
import { Unit } from "types/unit";

interface dataModel {
  selected: null | Unit;
  subject: {
    offense: number;
    critChance: number;
    critDamage: number;
  };
  target: {
    offense: number;
    critChance: number;
    critDamage: number;
  };
  physical: boolean;
}

export default defineComponent({
  name: "DamageCalculator",
  data() {
    return {
      selected: null,
      subject: {
        offense: 0,
        critChance: 0,
        critDamage: 0,
      },
      target: {
        offense: 0,
        critChance: 0,
        critDamage: 0,
      },
      physical: true,
    } as dataModel;
  },
  computed: {
    ...mapState("player", ["player"]),
    ...mapGetters("player", ["unitData"]),
    averageDamagePerHit(): number {
      //see https://gaming-fans.com/2017/02/15/swgoh-a-look-at-offense-critical-damage-and-critical-chance/
      const critChance = this.target.critChance / 100;
      const critDamage = this.target.critDamage / 100;
      return Math.floor(
        this.target.offense * (critChance * (critDamage - 1) + 1)
      );
    },
    averageDamagePerHitUnit(): number {
      if (this.selected) {
        const offense = this.subject.offense;
        const critChance = this.subject.critChance / 100;
        const critDamage = this.subject.critDamage / 100;
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

        this.target.offense = this.selected.offense[type];
        this.target.critChance = this.selected.critChance[type];

        this.subject.offense = this.selected.offense[type];
        this.subject.critChance = this.selected.critChance[type];
      }
    },
    selected(newVal: Unit) {
      if (newVal) {
        window.localStorage.setItem("damageCalculatorUnit", newVal.id);

        const type = this.physical ? "physical" : "special";

        this.target.offense = newVal.offense[type];
        this.target.critChance = newVal.critChance[type];
        this.target.critDamage = newVal.critDamage;

        this.subject.offense = newVal.offense[type];
        this.subject.critChance = newVal.critChance[type];
        this.subject.critDamage = newVal.critDamage;
      }
    },
  },
  methods: {
    selectMods(unit: Unit | null) {
      if (!unit) return;

      const type = this.physical ? "physical" : "special";

      if (this.selected) {
        this.target.offense = round2Decimals(
          (this.selected.baseOffense[type] + unit.modOffense.amount) *
            (1 + unit.modOffense.percent)
        );
        this.target.critChance =
          this.selected.baseCritChance[type] + unit.modCritChance;
        this.target.critDamage =
          this.selected.baseCritDamage + unit.modCritDamage;
      }
    },
  },
  async created() {
    const unitId = window.localStorage.getItem("damageCalculatorUnit") ?? "";
    if (unitId) {
      this.selected = this.unitData(unitId) ?? null;
    }
  },
  mounted() {
    setupEvents(
      this.$refs?.damageCalculatorSection as any as HTMLElement,
      "damageCalculatorSection"
    );
  },
});
</script>

<style lang="scss" scoped>
@import "styles/variables.scss";

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
  margin: 0 33.33%;
  text-align: center;

  @media only screen and (max-width: 768px) {
    margin: unset;
  }
}

::v-deep(.toggle) {
  width: 130px;
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
.select-compare-header {
  @media only screen and (max-width: 768px) {
    margin-top: 0.5rem;
  }
}
</style>
