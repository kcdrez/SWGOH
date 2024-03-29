<template>
  <ExpandableSection
    title="Survivability Calculator"
    idRef="survivabilityCalculatorSection"
  >
    <div class="container">
      <div class="row mt-2">
        <div class="col-lg-6 col-md-12">
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
        <div class="col-lg-6 col-md-12">
          <SwgohTable :table="{ header, body }" />
        </div>
      </div>
    </div>
  </ExpandableSection>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapState } from "vuex";

import { Unit } from "types/unit";
import { iTableBody, iTableHead } from "types/general";
import { sortValues } from "utils";

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
    header(): iTableHead {
      return {
        classes: "show-on-mobile",
        sortMethod: this.sortMethod,
        sortDir: this.sortDir,
        methodChange: (val: "total" | "sets" | "primaries") => {
          this.sortMethod = val;
        },
        directionChange: (val: "asc" | "desc") => {
          this.sortDir = val;
        },
        headers: [
          {
            cells: [
              {
                label: "Sets",
                sortMethodShow: true,
                value: "sets",
              },
              {
                label: "Primaries",
                show: true,
                sortMethodShow: true,
                value: "primaries",
                input: {
                  type: "list",
                  label: "Primary Stat Count",
                  value: this.primaryCount,
                  change: (val: any) => {
                    this.primaryCount = val;
                  },
                  options: [
                    {
                      label: "3",
                      value: 3,
                    },
                    {
                      label: "4",
                      value: 4,
                    },
                  ],
                },
              },
              {
                label: "Total Survivability",
                show: true,
                sortMethodShow: true,
                value: "total",
              },
            ],
          },
        ],
      };
    },
    body(): iTableBody {
      return {
        classes: "align-middle text-center",
        rows: this.rows.map((row) => {
          let classes = "rounded text-dark";
          classes += row.minimum ? " bg-danger" : "";
          classes += row.maximum ? " bg-success" : "";
          classes += !row.minimum && !row.maximum ? " bg-info" : "";

          return {
            cells: [
              {
                show: true,
                data: `${row.sets.label}<br>${row.primaries.label}`,
                type: "html",
              },
              {
                show: true,
                type: "html",
                data: `<div class="${classes}">
                    ${row.value}
                  </div>`,
              },
            ],
          };
        }),
      };
    },
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
          return sortValues(a.value, b.value, this.sortDir, this.sortMethod);
        } else if (this.sortMethod === "sets") {
          return sortValues(
            a.sets.health ?? 0,
            b.sets.health ?? 0,
            this.sortDir,
            this.sortMethod
          );
        } else if (this.sortMethod === "primaries") {
          return sortValues(
            a.primaries.health ?? 0,
            b.primaries.health ?? 0,
            this.sortDir,
            this.sortMethod
          );
        }
        return sortValues(a, b, this.sortDir, this.sortMethod);
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

      const setsStrings: string[] = [];
      if (sets.health) {
        setsStrings.push(`${sets.health} Health`);
      }
      if (sets.defense) {
        setsStrings.push(`${sets.defense} Defense`);
      }

      const primaryStrings: string[] = [];
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
});
</script>

<style lang="scss" scoped>
.container {
  max-width: unset;
  padding: 0;
}
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
table {
  @media only screen and (max-width: 992px) {
    margin-top: 0.5rem;
  }
}
</style>
