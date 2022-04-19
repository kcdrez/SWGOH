<template>
  <div class="swgoh-page container my-3">
    <table
      class="table table-bordered table-dark table-sm table-striped swgoh-table"
    >
      <thead class="align-middle text-center">
        <tr>
          <th colspan="100%">KAM Mission</th>
        </tr>
        <tr>
          <th>Name</th>
          <th>Stats</th>
        </tr>
      </thead>
      <tbody class="align-middle text-center">
        <template v-for="unit in teams[0].units" :key="unit.id">
          <tr>
            <td>{{ unitName(unit.id) }}</td>
            <td>
              <div class="container stat-container">
                <div v-for="stat in unit.stats" :key="stat.key" class="row">
                  <b class="text-capitalize col">{{ stat.key }}:</b>
                  <div class="col">{{ getStat(unit, stat.key) }}</div>
                  <div :class="statClass(unit, stat.key)" class="col">
                    Actual: {{ unitMap[unit.id][stat.key] }}
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapState } from "vuex";

import { initializeModules, round2Decimals } from "../utils";
import { loadingState } from "../types/loading";
import { Unit } from "../types/unit";
import { tbRecommended } from "../types/guild";

const dependencyModules = ["player", "guild"];

interface dataModel {
  map: "LSRepublicOffensive" | "DSSeparatistMight";
  phase: "phase1" | "phase2" | "phase3" | "phase4";
  position: "bottom" | "middle" | "top";
  mission: "special";
}

export default defineComponent({
  name: "TBStatusPage",
  data() {
    return {
      map: "LSRepublicOffensive",
      phase: "phase3",
      position: "bottom",
      mission: "special",
    } as dataModel;
  },
  computed: {
    ...mapGetters(["someLoading"]),
    ...mapState("player", ["player"]),
    ...mapGetters("player", ["unitData"]),
    ...mapGetters("unit", ["unitName"]),
    selected(): any {
      const map: any = tbRecommended[this.map];
      const phase = map[this.phase];
      const position = phase[this.position];
      const mission = position[this.mission];
      return mission;
    },
    teams(): any {
      return this.selected.teams;
    },
    unitMap(): any {
      const unitIds = this.teams[0].units.map((x: any) => x.id);
      const ownedUnits = this.player.units.filter((unit: Unit) =>
        unitIds.includes(unit.id)
      );
      return ownedUnits.reduce((map: any, unit: Unit) => {
        map[unit.id] = unit;
        return map;
      }, {});
    },
  },
  methods: {
    getStat(unit: any, stat: string): string {
      const match = unit.stats.find((x: any) => x.key === stat);
      if (match) {
        const { min, max } = match;
        const arr = [];
        if (min) {
          arr.push("Minimum: " + min);
        }
        if (max) {
          arr.push("Maximum: " + max);
        }
        return arr.join(", ");
      } else {
        return "";
      }
    },
    statClass(unit: any, stat: string): string {
      const match = this.unitMap[unit.id];
      const statValues = unit.stats.find((x: any) => x.key === stat);
      const unitStatValue = match[stat];

      if (!statValues) {
        return "";
      } else if (statValues.min > unitStatValue) {
        return "text-danger";
      } else if (statValues.max < unitStatValue) {
        return "text-warning";
      } else {
        return "text-success";
      }
    },
  },
  async created() {
    console.log(this.selected);
  },
});
</script>

<style lang="scss" scoped>
.stat-container {
  .row {
    &:not(:last-of-type) {
      border-bottom: 1px solid white;
    }
  }
}
</style>
