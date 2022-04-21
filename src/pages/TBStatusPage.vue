<template>
  <div class="swgoh-page container my-3">
    <div class="input-group input-group-sm w-25">
      <span class="input-group-text">Map:</span>
      <select class="form-control" v-model="map">
        <option v-for="map in mapOptions" :key="map.value" :value="map.value">
          {{ map.label }}
        </option>
      </select>
    </div>
    <div class="input-group input-group-sm w-25" v-if="showPhase">
      <span class="input-group-text">Phase:</span>
      <select class="form-control" v-model="phase">
        <option
          v-for="phase in phaseOptions"
          :key="phase.value"
          :value="phase.value"
        >
          {{ phase.label }}
        </option>
      </select>
    </div>
    <div class="input-group input-group-sm w-25" v-if="showPosition">
      <span class="input-group-text">Position:</span>
      <select class="form-control" v-model="position">
        <option
          v-for="position in positionOptions"
          :key="position.value"
          :value="position.value"
        >
          {{ position.label }}
        </option>
      </select>
    </div>
    <div class="input-group input-group-sm w-25" v-if="showMission">
      <span class="input-group-text">Mission:</span>
      <select class="form-control" v-model="mission">
        <option
          v-for="mission in missionOptions"
          :key="mission.value"
          :value="mission.value"
        >
          {{ mission.label }}
        </option>
      </select>
    </div>
    <div class="input-group input-group-sm w-25" v-if="showTeams">
      <span class="input-group-text">Team:</span>
      <select class="form-control" v-model="team">
        <option v-for="team in teamOptions" :key="team.id" :value="team.id">
          {{ team.label }}
        </option>
      </select>
    </div>
    <table
      class="table table-bordered table-dark table-sm table-striped swgoh-table"
      v-if="teamUnits.length > 0"
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
        <template v-for="unit in teamUnits" :key="unit.id">
          <tr>
            <td>{{ unitName(unit.id) }}</td>
            <td>
              <div class="stat-container d-flex">
                <div v-for="stat in unit.stats" :key="stat.key" class="">
                  <b class="text-capitalize">{{ stat.label }}:</b>
                  <div>{{ getStat(unit, stat.key) }}</div>
                  <div :class="statClass(unit, stat.key)">
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

interface dataModel {
  map: "LSRepublicOffensive" | "DSSeparatistMight" | "";
  phase: "phase1" | "phase2" | "phase3" | "phase4" | "";
  position: "bottom" | "middle" | "top" | "";
  mission: "special" | "";
  team: any;
}

export default defineComponent({
  name: "TBStatusPage",
  data() {
    return {
      map: "",
      phase: "",
      position: "",
      mission: "",
      team: null,
    } as dataModel;
  },
  computed: {
    ...mapGetters(["someLoading"]),
    ...mapState("player", ["player"]),
    ...mapGetters("player", ["unitData"]),
    ...mapGetters("unit", ["unitName"]),
    mapOptions() {
      return [
        {
          value: "LSRepublicOffensive",
          label: "Republic Offensive",
        },
      ];
    },
    phaseOptions() {
      return [
        {
          value: "phase3",
          label: "Phase 3",
        },
      ];
    },
    positionOptions() {
      return [
        {
          value: "bottom",
          label: "Bottom",
        },
      ];
    },
    missionOptions() {
      return [
        {
          value: "special",
          label: "Special (KAM)",
        },
      ];
    },
    teamOptions(): any[] {
      if (this.selected) {
        return this.selected.teams.map(({ id, label }: any) => {
          return {
            id,
            label,
          };
        });
      } else {
        return [];
      }
    },
    teamUnits(): any[] {
      if (this.team && this.selected) {
        const match = this.selected?.teams.find(
          (team: any) => team.id === this.team
        );
        if (match) {
          return match.units;
        }
      }
      return [];
    },
    showPhase(): boolean {
      return this.map !== "";
    },
    showPosition(): boolean {
      return this.showPhase && this.phase !== "";
    },
    showMission(): boolean {
      return this.showPosition && this.position !== "";
    },
    showTeams(): boolean {
      return (this.selected?.teams ?? []).length > 0;
    },
    selected(): any {
      if (this.showMission && this.map) {
        try {
          const map: any = tbRecommended[this.map];
          const phase = map[this.phase];
          const position = phase[this.position];
          const mission = position[this.mission];
          return mission;
        } catch (err) {
          console.error(err);
          return null;
        }
      } else {
        return null;
      }
    },
    teams(): any[] {
      return this.selected?.teams ?? [];
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
});
</script>

<style lang="scss" scoped>
.stat-container {
  & > * {
    margin: 0 0.5rem;
    padding: 0 0.5rem;
    flex-basis: 200px;

    &:not(:last-child) {
      border-right: 1px solid white;
    }
  }
}
</style>
