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
      </div>
      <div class="row mt-2" v-if="selected">
        <div class="col" v-for="pilot in crew" :key="pilot.id">
          <div class="text-center">{{ pilot.name }}</div>
          <div class="input-group input-group-sm mt-0">
            <span class="input-group-text">Stars:</span>
            <span class="input-group-text">Current:</span>
            <input
              class="form-control refresh-input"
              type="number"
              v-model.number="pilot.current.stars"
              min="0"
              max="7"
            />
            <span class="input-group-text">Projected:</span>
            <input
              class="form-control refresh-input"
              type="number"
              v-model.number="pilot.projected.stars"
              min="0"
              max="7"
            />
          </div>
          <div class="input-group input-group-sm">
            <span class="input-group-text">Level:</span>
            <span class="input-group-text">Current:</span>
            <input
              class="form-control refresh-input"
              type="number"
              v-model.number="pilot.current.level"
              min="0"
              max="85"
            />
            <span class="input-group-text">Projected:</span>
            <input
              class="form-control refresh-input"
              type="number"
              v-model.number="pilot.projected.level"
              min="0"
              max="85"
            />
          </div>
          <div class="input-group input-group-sm">
            <span class="input-group-text">Gear Level:</span>
            <span class="input-group-text">Current:</span>
            <input
              class="form-control refresh-input"
              type="number"
              v-model.number="pilot.current.gearLevel"
              min="0"
              :max="maxGearLevel"
            />
            <span class="input-group-text">Projected:</span>
            <input
              class="form-control refresh-input"
              type="number"
              v-model.number="pilot.projected.gearLevel"
              min="0"
              :max="maxGearLevel"
            />
          </div>
          <div class="input-group input-group-sm">
            <span class="input-group-text">Gear Pieces:</span>
            <span class="input-group-text">Current:</span>
            <input
              class="form-control refresh-input"
              type="number"
              v-model.number="pilot.current.gearPieces"
              min="0"
              max="6"
            />
            <span class="input-group-text">Projected:</span>
            <input
              class="form-control refresh-input"
              type="number"
              v-model.number="pilot.projected.gearPieces"
              min="0"
              max="6"
            />
          </div>
          <div class="input-group input-group-sm">
            <span class="input-group-text">Relic Level:</span>
            <span class="input-group-text">Current:</span>
            <input
              class="form-control refresh-input"
              type="number"
              v-model.number="pilot.current.relicLevel"
              min="0"
              :max="maxRelicLevel"
            />
            <span class="input-group-text">Projected:</span>
            <input
              class="form-control refresh-input"
              type="number"
              v-model.number="pilot.projected.relicLevel"
              min="0"
              :max="maxRelicLevel"
            />
          </div>
          <div class="mt-2">
            <div class="text-center">Mods</div>
            <div v-for="(mod, index) in pilot.mods" :key="mod.id">
              <div class="input-group input-group-sm mt-1">
                <span class="input-group-text">Mod {{ index + 1 }}</span>
                <input
                  class="form-control refresh-input"
                  type="number"
                  v-model.number="mod.level.current"
                  min="0"
                  max="15"
                />
                <input
                  class="form-control refresh-input"
                  type="number"
                  v-model.number="mod.level.projected"
                  min="0"
                  max="15"
                />
                <input
                  class="form-control refresh-input"
                  type="number"
                  v-model.number="mod.pips.current"
                  min="0"
                  max="6"
                />
                <input
                  class="form-control refresh-input"
                  type="number"
                  v-model.number="mod.pips.projected"
                  min="0"
                  max="6"
                />
              </div>
            </div>
          </div>
          <div class="mt-2">
            <div class="text-center">Abilities</div>
            <div v-for="(ability, index) in pilot.abilities" :key="ability.id">
              <div class="input-group input-group-sm mt-1">
                <span class="input-group-text">Ability {{ index + 1 }}</span>
                <span class="input-group-text">Current:</span>
                <input
                  class="form-control refresh-input"
                  type="number"
                  v-model.number="ability.current"
                  min="0"
                  :max="ability.max"
                />
                <span class="input-group-text">Projected:</span>
                <input
                  class="form-control refresh-input"
                  type="number"
                  v-model.number="ability.projected"
                  min="0"
                  :max="ability.max"
                />
              </div>
            </div>
          </div>
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
import { maxGearLevel } from "../../types/gear";
import { maxRelicLevel } from "../../types/relic";

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
        this.crew = newVal.crew.map((crewMember) => {
          const unit: Unit = this.unitData(crewMember.unitId);
          console.log(unit.mods);
          return {
            id: unit?.id ?? null,
            name: unit?.name ?? "",
            current: {
              stars: unit?.stars ?? 0,
              level: unit?.level ?? 0,
              gearLevel: unit?.gearLevel ?? 0,
              gearPieces:
                unit?.currentLevelGear.filter((gear) => gear.is_obtained)
                  .length ?? 0,
              relicLevel: unit?.relicLevel ?? 0,
            },
            projected: {
              stars: unit?.stars ?? 0,
              level: unit?.level ?? 0,
              gearLevel: unit?.gearLevel ?? 0,
              gearPieces:
                unit?.currentLevelGear.filter((gear) => gear.is_obtained)
                  .length ?? 0,
              relicLevel: unit?.relicLevel ?? 0,
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
              };
            }),
          };
        });
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
      width: 100px;
    }
    &.value {
      flex: 1 1 auto;
    }
  }
}
</style>
