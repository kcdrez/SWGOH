<template>
  <div class="collapse-header section-header mt-3 extended-1">
    <h3
      class="w-100"
      data-bs-toggle="collapse"
      href="#survivabilityCalculatorSection"
    >
      <div class="d-inline">Survivability Calculator</div>
    </h3>
  </div>
  <div
    id="survivabilityCalculatorSection"
    ref="survivabilityCalculatorSection"
    class="collapse"
  >
    <div class="container">
      <div class="row mt-2">
        <div class="col">
          <h6>Select a Character to view their stats:</h6>
          <SearchInput
            placeholder="Select a Character"
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
  baseProtection: number;
  baseHealth: number;
  baseArmor: number;
  bonusProtection: {
    flat: number;
    percent: number;
  };
  bonusHealth: {
    flat: number;
    percent: number;
  };
  bonusDefense: {
    flat: number;
    percent: number;
  };
  sortMethod: "total" | "sets" | "primaries";
  sortDir: "asc" | "desc";
  primaryCount: number;
}

export default defineComponent({
  name: "SurvivabilityCalculator",
  data() {
    return {
      selected: null,
      baseProtection: 0,
      baseHealth: 0,
      baseArmor: 0,
      bonusProtection: {
        flat: 0,
        percent: 0,
      },
      bonusHealth: {
        flat: 0,
        percent: 0,
      },
      bonusDefense: {
        flat: 0,
        percent: 0,
      },
      sortMethod: "total",
      sortDir: "desc",
      primaryCount: 3,
      sixDotMods: 0,
    } as dataModel;
  },
  computed: {
    ...mapState("player", ["player"]),
    ...mapGetters("player", ["unitData"]),
    rows(): {
      value: number;
      maximum?: boolean;
      minimum?: boolean;
      sets: { health?: number; defense?: number; label: string };
      primaries: {
        health?: number;
        defense?: number;
        protection?: number;
        label: string;
      };
    }[] {
      const primaries4 = [
        this.calculateSurvivability({ health: 3 }, { health: 4 }),
        this.calculateSurvivability(
          { health: 3 },
          { health: 3, protection: 1 }
        ),
        this.calculateSurvivability({ health: 3 }, { health: 3, defense: 1 }),
        this.calculateSurvivability(
          { health: 3 },
          { health: 2, protection: 2 }
        ),
        this.calculateSurvivability({ health: 3 }, { health: 2, defense: 2 }),
        this.calculateSurvivability(
          { health: 3 },
          { health: 2, protection: 1, defense: 1 }
        ),
        this.calculateSurvivability(
          { health: 3 },
          { health: 1, protection: 2, defense: 1 }
        ),
        this.calculateSurvivability(
          { health: 3 },
          { health: 1, protection: 1, defense: 2 }
        ),
        this.calculateSurvivability(
          { health: 3 },
          { health: 1, protection: 3 }
        ),
        this.calculateSurvivability({ health: 3 }, { health: 1, defense: 3 }),

        this.calculateSurvivability({ health: 3 }, { protection: 4 }),
        this.calculateSurvivability(
          { health: 3 },
          { protection: 3, defense: 1 }
        ),
        this.calculateSurvivability(
          { health: 3 },
          { protection: 2, defense: 2 }
        ),
        this.calculateSurvivability(
          { health: 3 },
          { protection: 1, defense: 3 }
        ),

        this.calculateSurvivability({ health: 3 }, { defense: 4 }),

        this.calculateSurvivability({ health: 2, defense: 1 }, { health: 4 }),
        this.calculateSurvivability(
          { health: 2, defense: 1 },
          { health: 3, protection: 1 }
        ),
        this.calculateSurvivability(
          { health: 2, defense: 1 },
          { health: 3, defense: 1 }
        ),
        this.calculateSurvivability(
          { health: 2, defense: 1 },
          { health: 2, protection: 2 }
        ),
        this.calculateSurvivability(
          { health: 2, defense: 1 },
          { health: 2, defense: 2 }
        ),
        this.calculateSurvivability(
          { health: 2, defense: 1 },
          { health: 2, protection: 1, defense: 1 }
        ),
        this.calculateSurvivability(
          { health: 2, defense: 1 },
          { health: 1, protection: 2, defense: 1 }
        ),
        this.calculateSurvivability(
          { health: 2, defense: 1 },
          { health: 1, protection: 1, defense: 2 }
        ),
        this.calculateSurvivability(
          { health: 2, defense: 1 },
          { health: 1, protection: 3 }
        ),
        this.calculateSurvivability(
          { health: 2, defense: 1 },
          { health: 1, defense: 3 }
        ),

        this.calculateSurvivability(
          { health: 2, defense: 1 },
          { protection: 4 }
        ),
        this.calculateSurvivability(
          { health: 2, defense: 1 },
          { protection: 3, defense: 1 }
        ),
        this.calculateSurvivability(
          { health: 2, defense: 1 },
          { protection: 2, defense: 2 }
        ),
        this.calculateSurvivability(
          { health: 2, defense: 1 },
          { protection: 1, defense: 3 }
        ),

        this.calculateSurvivability({ health: 2, defense: 1 }, { defense: 4 }),

        this.calculateSurvivability({ health: 1, defense: 2 }, { health: 4 }),
        this.calculateSurvivability(
          { health: 1, defense: 2 },
          { health: 3, protection: 1 }
        ),
        this.calculateSurvivability(
          { health: 1, defense: 2 },
          { health: 3, defense: 1 }
        ),
        this.calculateSurvivability(
          { health: 1, defense: 2 },
          { health: 2, protection: 2 }
        ),
        this.calculateSurvivability(
          { health: 1, defense: 2 },
          { health: 2, defense: 2 }
        ),
        this.calculateSurvivability(
          { health: 1, defense: 2 },
          { health: 2, protection: 1, defense: 1 }
        ),
        this.calculateSurvivability(
          { health: 1, defense: 2 },
          { health: 1, protection: 2, defense: 1 }
        ),
        this.calculateSurvivability(
          { health: 1, defense: 2 },
          { health: 1, protection: 1, defense: 2 }
        ),
        this.calculateSurvivability(
          { health: 1, defense: 2 },
          { health: 1, protection: 3 }
        ),
        this.calculateSurvivability(
          { health: 1, defense: 2 },
          { health: 1, defense: 3 }
        ),

        this.calculateSurvivability(
          { health: 1, defense: 2 },
          { protection: 4 }
        ),
        this.calculateSurvivability(
          { health: 1, defense: 2 },
          { protection: 3, defense: 1 }
        ),
        this.calculateSurvivability(
          { health: 1, defense: 2 },
          { protection: 2, defense: 2 }
        ),
        this.calculateSurvivability(
          { health: 1, defense: 2 },
          { protection: 1, defense: 3 }
        ),

        this.calculateSurvivability({ health: 1, defense: 2 }, { defense: 4 }),

        this.calculateSurvivability({ defense: 3 }, { health: 4 }),
        this.calculateSurvivability(
          { defense: 3 },
          { health: 3, protection: 1 }
        ),
        this.calculateSurvivability({ defense: 3 }, { health: 3, defense: 1 }),
        this.calculateSurvivability(
          { defense: 3 },
          { health: 2, protection: 2 }
        ),
        this.calculateSurvivability({ defense: 3 }, { health: 2, defense: 2 }),
        this.calculateSurvivability(
          { defense: 3 },
          { health: 2, protection: 1, defense: 1 }
        ),
        this.calculateSurvivability(
          { defense: 3 },
          { health: 1, protection: 2, defense: 1 }
        ),
        this.calculateSurvivability(
          { defense: 3 },
          { health: 1, protection: 1, defense: 2 }
        ),
        this.calculateSurvivability(
          { defense: 3 },
          { health: 1, protection: 3 }
        ),
        this.calculateSurvivability({ defense: 3 }, { health: 1, defense: 3 }),

        this.calculateSurvivability({ defense: 3 }, { protection: 4 }),
        this.calculateSurvivability(
          { defense: 3 },
          { protection: 3, defense: 1 }
        ),
        this.calculateSurvivability(
          { defense: 3 },
          { protection: 2, defense: 2 }
        ),
        this.calculateSurvivability(
          { defense: 3 },
          { protection: 1, defense: 3 }
        ),

        this.calculateSurvivability({ defense: 3 }, { defense: 4 }),
      ];

      const primaries3 = [
        this.calculateSurvivability({ health: 3 }, { health: 3 }),
        this.calculateSurvivability(
          { health: 3 },
          { health: 2, protection: 1 }
        ),
        this.calculateSurvivability({ health: 3 }, { health: 2, defense: 1 }),
        this.calculateSurvivability(
          { health: 3 },
          { health: 1, protection: 2 }
        ),
        this.calculateSurvivability({ health: 3 }, { health: 1, defense: 2 }),
        this.calculateSurvivability(
          { health: 3 },
          { health: 1, protection: 1, defense: 1 }
        ),
        this.calculateSurvivability({ health: 3 }, { protection: 3 }),
        this.calculateSurvivability(
          { health: 3 },
          { protection: 2, defense: 1 }
        ),
        this.calculateSurvivability(
          { health: 3 },
          { protection: 1, defense: 2 }
        ),
        this.calculateSurvivability({ health: 3 }, { defense: 3 }),

        this.calculateSurvivability({ health: 2, defense: 1 }, { health: 3 }),
        this.calculateSurvivability(
          { health: 2, defense: 1 },
          { health: 2, protection: 1 }
        ),
        this.calculateSurvivability(
          { health: 2, defense: 1 },
          { health: 2, defense: 1 }
        ),
        this.calculateSurvivability(
          { health: 2, defense: 1 },
          { health: 1, protection: 2 }
        ),
        this.calculateSurvivability(
          { health: 2, defense: 1 },
          { health: 1, defense: 2 }
        ),
        this.calculateSurvivability(
          { health: 2, defense: 1 },
          { health: 1, protection: 1, defense: 1 }
        ),
        this.calculateSurvivability(
          { health: 2, defense: 1 },
          { protection: 3 }
        ),
        this.calculateSurvivability(
          { health: 2, defense: 1 },
          { protection: 2, defense: 1 }
        ),
        this.calculateSurvivability(
          { health: 2, defense: 1 },
          { protection: 1, defense: 2 }
        ),
        this.calculateSurvivability({ health: 2, defense: 1 }, { defense: 3 }),

        this.calculateSurvivability({ health: 1, defense: 2 }, { health: 3 }),
        this.calculateSurvivability(
          { health: 1, defense: 2 },
          { health: 2, protection: 1 }
        ),
        this.calculateSurvivability(
          { health: 1, defense: 2 },
          { health: 2, defense: 1 }
        ),
        this.calculateSurvivability(
          { health: 1, defense: 2 },
          { health: 1, protection: 2 }
        ),
        this.calculateSurvivability(
          { health: 1, defense: 2 },
          { health: 1, defense: 2 }
        ),
        this.calculateSurvivability(
          { health: 1, defense: 2 },
          { health: 1, protection: 1, defense: 1 }
        ),
        this.calculateSurvivability(
          { health: 1, defense: 2 },
          { protection: 3 }
        ),
        this.calculateSurvivability(
          { health: 1, defense: 2 },
          { protection: 2, defense: 1 }
        ),
        this.calculateSurvivability(
          { health: 1, defense: 2 },
          { protection: 1, defense: 2 }
        ),
        this.calculateSurvivability({ health: 1, defense: 2 }, { defense: 3 }),

        this.calculateSurvivability({ defense: 3 }, { health: 3 }),
        this.calculateSurvivability(
          { defense: 3 },
          { health: 2, protection: 1 }
        ),
        this.calculateSurvivability({ defense: 3 }, { health: 2, defense: 1 }),
        this.calculateSurvivability(
          { defense: 3 },
          { health: 1, protection: 2 }
        ),
        this.calculateSurvivability({ defense: 3 }, { health: 1, defense: 2 }),
        this.calculateSurvivability(
          { defense: 3 },
          { health: 1, protection: 1, defense: 1 }
        ),
        this.calculateSurvivability({ defense: 3 }, { protection: 3 }),
        this.calculateSurvivability(
          { defense: 3 },
          { protection: 2, defense: 1 }
        ),
        this.calculateSurvivability(
          { defense: 3 },
          { protection: 1, defense: 2 }
        ),
        this.calculateSurvivability({ defense: 3 }, { defense: 3 }),
      ];
      const primariesList = (
        this.primaryCount === 3 ? primaries3 : primaries4
      ).sort((a, b) => {
        if (this.sortMethod === "total") {
          if (this.sortDir === "asc") {
            return a.value - b.value;
          } else {
            return b.value - a.value;
          }
        } else if (this.sortMethod === "sets") {
          if (this.sortDir === "asc") {
            return (a.sets.health ?? 0) - (b.sets.health ?? 0);
          } else {
            return (b.sets.health ?? 0) - (a.sets.health ?? 0);
          }
        } else if (this.sortMethod === "primaries") {
          const healthA = a.primaries.health ?? 0;
          const healthB = b.primaries.health ?? 0;

          if (this.sortDir === "asc") {
            if (healthA === healthB) {
              return (a.primaries.defense ?? 0) - (b.primaries.defense ?? 0);
            } else {
              return (a.primaries.health ?? 0) - (b.primaries.health ?? 0);
            }
          } else {
            if (healthA === healthB) {
              return (b.primaries.defense ?? 0) - (a.primaries.defense ?? 0);
            } else {
              return (b.primaries.health ?? 0) - (a.primaries.health ?? 0);
            }
          }
        } else {
          return 0;
        }
      });

      const maxValue = Math.max(...primariesList.map((x) => x.value));
      const minValue = Math.min(...primariesList.map((x) => x.value));

      const { minIndexes, maxIndexes } = primariesList.reduce(
        (
          acc: {
            maxIndexes: number[];
            minIndexes: number[];
            maxValue: number;
            minValue: number;
          },
          el,
          index
        ) => {
          if (el.value >= acc.maxValue) {
            acc.maxIndexes.push(index);
            acc.maxValue = el.value;
          }
          if (el.value <= acc.minValue) {
            acc.minIndexes.push(index);
            acc.minValue = el.value;
          }
          return acc;
        },
        { maxIndexes: [], minIndexes: [], maxValue, minValue }
      );

      maxIndexes.forEach((i) => (primariesList[i].maximum = true));
      minIndexes.forEach((i) => (primariesList[i].minimum = true));

      return primariesList;
    },
  },
  watch: {
    selected(newVal: Unit) {
      if (newVal) {
        window.localStorage.setItem("survivabilityCalculatorUnit", newVal.id);

        const { health, protection, defense } = newVal.bonusStats;
        this.baseProtection = newVal.baseProtection;
        this.baseHealth = newVal.baseHealth;
        this.baseArmor = newVal.baseArmor;
        this.bonusHealth.percent = health.percent * 100;
        this.bonusHealth.flat = health.flat;
        this.bonusProtection.percent = protection.percent * 100;
        this.bonusProtection.flat = protection.flat;
        this.bonusDefense.percent = defense.percent * 100;
        this.bonusDefense.flat = defense.flat;
      }
    },
  },
  methods: {
    calculateSurvivability(
      sets: { health?: number; defense?: number },
      primaries: { health?: number; defense?: number; protection?: number }
    ): {
      value: number;
      maximum?: boolean;
      minimum?: boolean;
      sets: { health?: number; defense?: number; label: string };
      primaries: {
        health?: number;
        defense?: number;
        protection?: number;
        label: string;
      };
    } {
      const defense =
        (637.5 * this.baseArmor) / (100 - this.baseArmor) +
        this.bonusDefense.flat;

      const healthPercent =
        1 + (sets?.health ?? 0) * 0.1 + (primaries?.health ?? 0) * 0.16;
      const protectionPercent = 1 + (primaries?.protection ?? 0) * 0.24;
      const defensePercent =
        1 + (sets?.defense ?? 0) * 0.25 + ((primaries?.defense ?? 0) + 1) * 0.2;

      const value = Math.round(
        (this.baseHealth *
          healthPercent *
          ((100 + this.bonusHealth.percent) / 100) +
          this.bonusHealth.flat +
          this.baseProtection *
            protectionPercent *
            ((100 + this.bonusProtection.percent) / 100) +
          this.bonusProtection.flat) /
          (1 -
            (defense *
              defensePercent *
              ((100 + this.bonusDefense.percent) / 100) *
              100) /
              (defense *
                defensePercent *
                ((100 + this.bonusDefense.percent) / 100) +
                637.5) /
              100)
      );

      const setsStrings = [];
      if (sets.health) {
        setsStrings.push(`${sets.health} Health`);
      }
      if (sets.defense) {
        setsStrings.push(`${sets.defense} Defense`);
      }

      const primaryStrings = [];
      if (primaries.health) {
        primaryStrings.push(`${primaries.health} Health`);
      }
      if (primaries.defense) {
        primaryStrings.push(`${primaries.defense} Defense`);
      }
      if (primaries.protection) {
        primaryStrings.push(`${primaries.protection} Protection`);
      }

      return {
        sets: { ...sets, label: setsStrings.join(", ") + " Sets" },
        primaries: {
          ...primaries,
          label: primaryStrings.join(", ") + " Primaries",
        },
        value,
        maximum: false,
        minimum: false,
      };
    },
  },
  async created() {
    const unitId =
      window.localStorage.getItem("survivabilityCalculatorUnit") ?? "";
    if (unitId) {
      this.selected = this.unitData(unitId) ?? null;
    }
  },
  mounted() {
    setupEvents(
      this.$refs?.survivabilityCalculatorSection as any as HTMLElement,
      "survivabilityCalculatorSection"
    );
  },
});
</script>

<style lang="scss" scoped>
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
