<template>
  <div class="collapse-header section-header mt-3">
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
      </div>
      <template v-if="selected">
        <div class="row mt-2">
          <div class="col-lg-6 col-md-12">
            <div v-for="(pilot, index) in crew" :key="pilot.id">
              <hr v-if="index > 0" />
              <h3 class="text-center">Crew: {{ pilot.name }}</h3>
              <div class="input-group input-group-sm">
                <span class="input-group-text">Gear Level:</span>
                <span class="input-group-text">Current:</span>
                <select
                  class="form-control"
                  v-model.number="pilot.current.gearLevel"
                >
                  <option
                    v-for="index in maxGearLevel"
                    :key="index"
                    :value="index"
                  >
                    {{ index }}
                  </option>
                </select>
                <span class="input-group-text">Projected:</span>
                <select
                  class="form-control"
                  v-model.number="pilot.projected.gearLevel"
                >
                  <option
                    v-for="index in maxGearLevel"
                    :key="index"
                    :value="index"
                  >
                    {{ index }}
                  </option>
                </select>
              </div>
              <div class="input-group input-group-sm">
                <span class="input-group-text">Gear Pieces:</span>
                <span class="input-group-text">Current:</span>
                <select
                  class="form-control"
                  v-model.number="pilot.current.gearPieces"
                >
                  <option v-for="(el, index) in 7" :key="index" :value="index">
                    {{ index }}
                  </option>
                </select>
                <span class="input-group-text">Projected:</span>
                <select
                  class="form-control"
                  v-model.number="pilot.projected.gearPieces"
                >
                  <option v-for="(el, index) in 7" :key="index" :value="index">
                    {{ index }}
                  </option>
                </select>
              </div>
              <div class="input-group input-group-sm">
                <span class="input-group-text">Relic Level:</span>
                <span class="input-group-text">Current:</span>
                <select
                  class="form-control"
                  v-model.number="pilot.current.relicLevel"
                >
                  <option
                    v-for="(el, index) in maxRelicLevel + 1"
                    :key="index"
                    :value="index"
                  >
                    {{ index }}
                  </option>
                </select>
                <span class="input-group-text">Projected:</span>
                <select
                  class="form-control"
                  v-model.number="pilot.projected.relicLevel"
                >
                  <option
                    v-for="(el, index) in maxRelicLevel + 1"
                    :key="index"
                    :value="index"
                  >
                    {{ index }}
                  </option>
                </select>
              </div>
              <div class="mt-2">
                <div class="text-center">Mods</div>
                <div v-for="mod in pilot.mods" :key="mod.id">
                  <div class="input-group input-group-sm mt-1">
                    <span class="input-group-text">{{ modLabel(mod) }}:</span>
                    <span class="input-group-text">Current Pips:</span>
                    <select
                      class="form-control"
                      v-model.number="mod.pips.current"
                    >
                      <option v-for="index in 6" :key="index" :value="index">
                        {{ index }}
                      </option>
                    </select>
                    <span class="input-group-text">Projected Pips:</span>
                    <select
                      class="form-control"
                      v-model.number="mod.pips.projected"
                    >
                      <option v-for="index in 6" :key="index" :value="index">
                        {{ index }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="mt-2">
                <div class="text-center">Abilities</div>
                <div v-for="ability in pilot.abilities" :key="ability.id">
                  <div class="input-group input-group-sm mt-1">
                    <span class="input-group-text"> {{ ability.name }}</span>
                    <span class="input-group-text">Current Level:</span>
                    <select
                      class="form-control"
                      v-model.number="ability.current"
                    >
                      <option
                        v-for="index in ability.max"
                        :key="index"
                        :value="index"
                      >
                        {{ index }}
                      </option>
                    </select>
                    <span class="input-group-text">Projected Level:</span>
                    <select
                      class="form-control"
                      v-model.number="ability.projected"
                    >
                      <option
                        v-for="index in ability.max"
                        :key="index"
                        :value="index"
                      >
                        {{ index }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6 col-md-12">
            <table
              class="table table-bordered table-dark table-sm table-striped swgoh-table output-table"
            >
              <TableHeader :header="header" />
              <TableBody :body="body" />
            </table>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapState } from "vuex";

import { round2Decimals, setupEvents } from "utils";
import { Mod, Unit } from "types/unit";
import { maxGearLevel } from "types/gear";
import { maxRelicLevel } from "types/relic";
import {
  abilityMap,
  crewLevelMap,
  crewStarsMap,
  gearLevelMap,
  modsMap,
  multiplierMap,
  relicLevelMap,
} from "types/pilots";
import { iTableBody, iTableHead } from "types/general";

interface Crew {
  stars: number;
  level: number;
  gearLevel: number;
  gearPieces: number;
  relicLevel: number;
}

interface dataModel {
  selected: null | Unit;
  crew: {
    id: string;
    name: string;
    current: Crew;
    projected: Crew;
    abilities: any[];
    mods: any[];
  }[];
  stars: {
    current: number;
    projected: number;
  };
  maxGearLevel: number;
  maxRelicLevel: number;
}

export default defineComponent({
  name: "ShipCalculator",
  data() {
    return {
      selected: null,
      crew: [],
      maxGearLevel,
      maxRelicLevel,
      stars: {
        current: 1,
        projected: 1,
      },
    } as dataModel;
  },
  computed: {
    ...mapState("player", ["player"]),
    ...mapGetters("player", ["unitData", "shipsList"]),
    header(): iTableHead {
      return {
        headers: [
          {
            label: "",
            show: true,
          },
          {
            label: "Current",
            show: true,
          },
          {
            label: "Projected",
            show: true,
          },
          {
            label: "Difference",
            show: true,
          },
        ],
      };
    },
    body(): iTableBody {
      return {
        classes: "align-middle text-center",
        rows: this.stats.map((stat: any) => {
          let statText = "";
          statText += stat.projected - stat.current > 0 ? "+" : "";
          statText += stat.projected + stat.current;
          statText +=
            stat.projected - stat.current !== 0
              ? ` ${round2Decimals(
                  ((stat.projected - stat.current) / stat.current) * 100
                )} `
              : "";

          return {
            cells: [
              {
                show: true,
                data: stat.label,
              },
              {
                show: true,
                data: stat.current,
              },
              {
                show: true,
                data: stat.projected,
              },
              {
                show: true,
                classes: {
                  "text-danger": stat.projected - stat.current < 0,
                  "text-success": stat.projected - stat.current > 0,
                },
                data: statText,
              },
            ],
          };
        }),
      };
    },
    stats(): any {
      const baseSpeed = this.selected?.statMultipliers?.baseSpeed ?? 0;
      const baseProtection =
        this.selected?.statMultipliers?.baseProtection ?? 0;
      const baseHealth = this.selected?.statMultipliers?.baseHealth ?? 0;
      const baseDamage = this.selected?.statMultipliers?.baseDamage ?? 0;
      const baseCrit = this.selected?.statMultipliers?.baseCrit ?? 0;
      const baseSpecialDamage =
        this.selected?.statMultipliers?.baseSpecialDamage ?? 0;
      const baseSpecialCrit =
        this.selected?.statMultipliers?.baseSpecialCrit ?? 0;
      const basePotency = this.selected?.statMultipliers?.basePotency ?? 0;
      const baseTenacity = this.selected?.statMultipliers?.baseTenacity ?? 0;

      const shipMultiplier = {
        current: (multiplierMap as any)[this.stars.current],
        projected: (multiplierMap as any)[this.stars.projected],
      };

      const crewTotal = this.crew.reduce(
        (acc, pilot) => {
          const starsRating = {
            current: (crewStarsMap as any)[pilot.current.stars],
            projected: (crewStarsMap as any)[pilot.projected.stars],
          };
          const levelRating = {
            current: (crewLevelMap as any)[pilot.current.level],
            projected: (crewLevelMap as any)[pilot.projected.level],
          };
          const gearRating = {
            current: (gearLevelMap as any)[pilot.current.gearLevel].cumulative,
            projected: (gearLevelMap as any)[pilot.projected.gearLevel]
              .cumulative,
          };
          const partialGearRating = {
            current:
              (gearLevelMap as any)[pilot.current.gearLevel].perPiece *
              pilot.current.gearPieces,
            projected:
              (gearLevelMap as any)[pilot.projected.gearLevel].perPiece *
              pilot.projected.gearPieces,
          };
          const relicRating = {
            current:
              (relicLevelMap as any)[pilot.current.relicLevel].rating +
              (relicLevelMap as any)[pilot.current.relicLevel].multiplier *
                pilot.current.level,
            projected:
              (relicLevelMap as any)[pilot.projected.relicLevel].rating +
              (relicLevelMap as any)[pilot.projected.relicLevel].multiplier *
                pilot.projected.level,
          };
          const abilityRating = pilot.abilities.reduce(
            (acc, ability) => {
              acc.current += (abilityMap as any)[ability.current];
              acc.projected += (abilityMap as any)[ability.projected];
              return acc;
            },
            {
              current: 0,
              projected: 0,
            }
          );

          const modsRating = pilot.mods.reduce(
            (acc, mod) => {
              acc.current += (modsMap as any)[mod.level.current][
                mod.pips.current
              ];
              acc.projected += (modsMap as any)[mod.level.projected][
                mod.pips.projected
              ];
              return acc;
            },
            {
              current: 0,
              projected: 0,
            }
          );

          acc.current +=
            starsRating.current +
            levelRating.current +
            gearRating.current +
            partialGearRating.current +
            relicRating.current +
            abilityRating.current +
            modsRating.current;

          acc.projected +=
            starsRating.projected +
            levelRating.projected +
            gearRating.projected +
            partialGearRating.projected +
            relicRating.projected +
            abilityRating.projected +
            modsRating.projected;

          return acc;
        },
        { current: 0, projected: 0 }
      );

      return {
        speed: {
          current:
            Math.floor(
              crewTotal.current *
                shipMultiplier.current *
                (this.selected?.statMultipliers?.speed ?? 1)
            ) + baseSpeed,
          projected:
            Math.floor(
              crewTotal.projected *
                shipMultiplier.projected *
                (this.selected?.statMultipliers?.speed ?? 1)
            ) + baseSpeed,
          label: "Speed",
        },
        protection: {
          current: Math.floor(
            crewTotal.current *
              shipMultiplier.current *
              (this.selected?.statMultipliers?.protection ?? 1) +
              baseProtection
          ),
          projected: Math.floor(
            crewTotal.projected *
              shipMultiplier.projected *
              (this.selected?.statMultipliers?.protection ?? 1) +
              baseProtection
          ),
          label: "Protection",
        },
        health: {
          current: Math.floor(
            crewTotal.current *
              shipMultiplier.current *
              (this.selected?.statMultipliers?.health ?? 1) +
              baseHealth
          ),
          projected: Math.floor(
            crewTotal.projected *
              shipMultiplier.projected *
              (this.selected?.statMultipliers?.health ?? 1) +
              baseHealth
          ),
          label: "Health",
        },
        damage: {
          current: Math.floor(
            crewTotal.current *
              shipMultiplier.current *
              (this.selected?.statMultipliers?.physicalDamage ?? 1) +
              baseDamage
          ),
          projected: Math.floor(
            crewTotal.projected *
              shipMultiplier.projected *
              (this.selected?.statMultipliers?.physicalDamage ?? 1) +
              baseDamage
          ),
          label: "Physical Damage",
        },
        critChance: {
          current: Math.floor(
            crewTotal.current *
              shipMultiplier.current *
              (this.selected?.statMultipliers?.critRating ?? 1) +
              baseCrit
          ),
          projected: Math.floor(
            crewTotal.projected *
              shipMultiplier.projected *
              (this.selected?.statMultipliers?.critRating ?? 1) +
              baseCrit
          ),
          label: "Physical Crit Chance",
        },
        specialDamage: {
          current: Math.floor(
            crewTotal.current *
              shipMultiplier.current *
              (this.selected?.statMultipliers?.specialDamage ?? 1) +
              baseSpecialDamage
          ),
          projected: Math.floor(
            crewTotal.projected *
              shipMultiplier.projected *
              (this.selected?.statMultipliers?.specialDamage ?? 1) +
              baseSpecialDamage
          ),
          label: "Special Damage",
        },
        specialCrit: {
          current: Math.floor(
            crewTotal.current *
              shipMultiplier.current *
              (this.selected?.statMultipliers?.specialCritRating ?? 1) +
              baseSpecialCrit
          ),
          projected: Math.floor(
            crewTotal.projected *
              shipMultiplier.projected *
              (this.selected?.statMultipliers?.specialCritRating ?? 1) +
              baseSpecialCrit
          ),
          label: "Special Crit Chance",
        },
        potency: {
          current: Math.floor(
            crewTotal.current *
              shipMultiplier.current *
              (this.selected?.statMultipliers?.potency ?? 1) +
              basePotency
          ),
          projected: Math.floor(
            crewTotal.projected *
              shipMultiplier.projected *
              (this.selected?.statMultipliers?.potency ?? 1) +
              basePotency
          ),
          label: "Potency",
        },
        tenacity: {
          current: Math.floor(
            crewTotal.current *
              shipMultiplier.current *
              (this.selected?.statMultipliers?.tenacity ?? 1) +
              baseTenacity
          ),
          projected: Math.floor(
            crewTotal.projected *
              shipMultiplier.projected *
              (this.selected?.statMultipliers?.tenacity ?? 1) +
              baseTenacity
          ),
          label: "Tenacity",
        },
      };
    },
  },
  watch: {
    selected(newVal: Unit) {
      if (newVal) {
        window.localStorage.setItem("shipCalculatorUnit", newVal.id);

        this.stars.current = newVal.stars ?? 1;
        this.stars.projected = newVal.stars ?? 1;

        this.crew = newVal.crew.map((crewMember) => {
          const unit: Unit = this.unitData(crewMember.unitId);
          const gearLevel = unit?.gearLevel ?? 0;
          const relicLevel =
            gearLevel < maxGearLevel ? 0 : unit?.relicLevel ?? 0;
          const gearPieces =
            gearLevel >= maxGearLevel
              ? 0
              : unit?.currentLevelGear.filter((gear) => gear.is_obtained)
                  .length ?? 0;

          return {
            id: unit?.id ?? null,
            name: unit?.name ?? "",
            current: {
              stars: unit?.stars ?? 0,
              level: unit?.level ?? 0,
              gearLevel,
              gearPieces,
              relicLevel,
            },
            projected: {
              stars: unit?.stars ?? 0,
              level: unit?.level ?? 0,
              gearLevel,
              gearPieces,
              relicLevel,
            },
            abilities: unit.abilities.map((ability) => {
              return {
                name: ability.name,
                id: ability.id,
                current: ability.ability_tier,
                projected: ability.ability_tier,
                max: ability.tier_max,
              };
            }),
            mods: unit.mods.map((mod) => {
              return {
                id: mod.id,
                level: {
                  current: mod.level,
                  projected: mod.level,
                },
                pips: {
                  current: mod.pips,
                  projected: mod.pips,
                },
                slot: mod.slot,
              };
            }),
          };
        });
      }
    },
  },
  methods: {
    round2Decimals,
    modLabel(mod: Mod) {
      type tMap = {
        [key: number]: string;
      };
      const modLabelMap: tMap = {
        1: "Square",
        2: "Arrow",
        3: "Diamond",
        4: "Triangle",
        5: "Circle",
        6: "Cross",
      };
      return modLabelMap[mod.slot] ?? "Unknown";
    },
  },
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
@import "styles/variables.scss";

.container {
  max-width: unset;
  padding: 0;
}
.input-group {
  margin-top: 0.5rem;

  .input-group-text {
    &:first-child {
      width: 150px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: inline-block;
    }
    &.value {
      flex: 1 1 auto;
    }
  }
}

.output-table {
  position: sticky;
  top: 105px;
  z-index: 9;
}

hr {
  height: 2px;
  color: black;
  opacity: 100;
}

table {
  @media only screen and (max-width: 992px) {
    margin-top: 0.5rem;
  }
}
</style>
