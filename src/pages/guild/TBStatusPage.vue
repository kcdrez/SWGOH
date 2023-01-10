<template>
  <div class="swgoh-page container my-3">
    <div class="input-group input-group-sm">
      <span class="input-group-text">Map:</span>
      <select class="form-control" v-model="map">
        <option v-for="map in mapOptions" :key="map.value" :value="map.value">
          {{ map.label }}
        </option>
      </select>
    </div>
    <div class="input-group input-group-sm" v-if="showPhase">
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
    <div class="input-group input-group-sm" v-if="showPosition">
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
    <div class="input-group input-group-sm" v-if="showMission">
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
    <div class="input-group input-group-sm" v-if="showTeams">
      <span class="input-group-text">Team:</span>
      <select class="form-control" v-model="team">
        <option
          v-for="team in teamOptions"
          :key="team.value"
          :value="team.value"
        >
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
          <th colspan="100%">{{ missionText }}</th>
        </tr>
        <ColumnHeaders class="text-center align-middle" :headers="headers" />
      </thead>
      <tbody class="align-middle text-center">
        <template v-for="unit in teamUnits" :key="unit.id">
          <tr>
            <td>{{ unitName(unit.id) }}</td>
            <td v-if="showStats">
              <span class="row-label">Stats:</span>
              <div class="stat-container">
                <div v-for="stat in unit.stats" :key="stat.key">
                  <b class="text-capitalize">{{ stat.label }}:</b>
                  <div>{{ getStat(unit, stat.key) }}</div>
                  <div :class="statClass(unit, stat.key)">
                    Actual:
                    {{ unitMap[unit.id] ? unitMap[unit.id][stat.key] : 0 }}
                  </div>
                </div>
              </div>
            </td>
            <td v-if="showLevels">
              <div class="d-flex justify-content-center align-items-center">
                <div class="mx-2">Current Level:</div>
                <RequirementIcon
                  :type="unit.type"
                  :unitId="unit.id"
                  currentLevel
                />
              </div>
              <div class="d-flex justify-content-center align-items-center">
                <div class="mx-2">Requirement Level:</div>
                <RequirementIcon
                  :value="unit.level"
                  :type="unit.type"
                  :unitId="unit.id"
                />
              </div>
              <div>
                <div
                  class="text-center"
                  :class="{
                    'text-success': levelStatus(unit.id, unit.level, unit.type),
                    'text-danger': !levelStatus(unit.id, unit.level, unit.type),
                  }"
                >
                  {{
                    levelStatus(unit.id, unit.level, unit.type)
                      ? "Ready"
                      : "Not Ready"
                  }}
                </div>
              </div>
            </td>
            <td>
              <span class="row-label">Zetas:</span>
              <div>
                <div
                  v-for="ability in zetaAbilities(unit.id, unit.zetas)"
                  :key="ability.id"
                  class="d-flex justify-content-center"
                >
                  <b class="text-capitalize mx-2">{{ ability.name }}:</b>
                  <div
                    :class="{
                      'text-success': ability.isZeta,
                      'text-danger': !ability.isZeta,
                    }"
                  >
                    {{ ability.isZeta ? "Ready" : "Not Ready" }}
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

import { Unit } from "types/unit";
import { tbRecommended } from "types/guild";
import RequirementIcon from "components/shards/tables/legendary/requirementIcon.vue";
import { iHeader } from "types/general";

interface dataModel {
  map: "LSRepublicOffensive" | "DSSeparatistMight" | "";
  phase: "phase1" | "phase2" | "phase3" | "phase4" | "";
  position: "bottom" | "middle" | "top" | "";
  mission: "special" | "";
  team: any;
}

const storageKey = "TBStatusPage";

export default defineComponent({
  name: "TBStatusPage",
  components: { RequirementIcon },
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
    headers(): iHeader[] {
      return [
        {
          label: "Name",
          show: true,
          maxWidth: "20%",
        },
        {
          label: "Stats",
          show: this.showStats,
          maxWidth: "60%",
        },
        {
          label: "Level",
          show: this.showLevels,
          maxWidth: "20%",
        },
        {
          label: "Zetas",
          show: true,
        },
      ];
    },
    mapOptions() {
      return tbRecommended.map((x) => {
        return {
          value: x.id,
          label: x.label,
        };
      });
    },
    phaseOptions() {
      try {
        const map: any = tbRecommended.find((x: any) => x.id === this.map);
        return (map?.phases ?? []).map((x: any) => {
          return {
            value: x.id,
            label: x.label,
          };
        });
      } catch (err) {
        return [];
      }
    },
    positionOptions() {
      try {
        const map: any = tbRecommended.find((x: any) => x.id === this.map);
        const phase: any = map.phases.find((x: any) => x.id === this.phase);
        return (phase?.positions ?? []).map((x: any) => {
          return {
            value: x.id,
            label: x.label,
          };
        });
      } catch (err) {
        return [];
      }
    },
    missionOptions() {
      try {
        const map: any = tbRecommended.find((x: any) => x.id === this.map);
        const phase: any = map.phases.find((x: any) => x.id === this.phase);
        const position: any = phase.positions.find(
          (x: any) => x.id === this.position
        );
        return (position?.missions ?? []).map((x: any) => {
          return {
            value: x.id,
            label: x.label,
          };
        });
      } catch (err) {
        return [];
      }
    },
    teamOptions(): any[] {
      try {
        const map: any = tbRecommended.find((x: any) => x.id === this.map);
        const phase: any = map.phases.find((x: any) => x.id === this.phase);
        const position: any = phase.positions.find(
          (x: any) => x.id === this.position
        );
        const mission: any = position.missions.find(
          (x: any) => x.id === this.mission
        );
        return (mission?.teams ?? []).map((x: any) => {
          return {
            value: x.id,
            label: x.label,
          };
        });
      } catch (err) {
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
    showStats(): boolean {
      if (this.team) {
        const map: any = tbRecommended.find((x: any) => x.id === this.map);
        const phase: any = map.phases.find((x: any) => x.id === this.phase);
        const position: any = phase.positions.find(
          (x: any) => x.id === this.position
        );
        const mission: any = position.missions.find(
          (x: any) => x.id === this.mission
        );
        const team: any = mission.teams.find((x: any) => x.id === this.team);
        return team.units.every((unit: any) => !!unit.stats);
      }
      return false;
    },
    showLevels(): boolean {
      if (this.team) {
        const map: any = tbRecommended.find((x: any) => x.id === this.map);
        const phase: any = map.phases.find((x: any) => x.id === this.phase);
        const position: any = phase.positions.find(
          (x: any) => x.id === this.position
        );
        const mission: any = position.missions.find(
          (x: any) => x.id === this.mission
        );
        const team: any = mission.teams.find((x: any) => x.id === this.team);
        return team.units.every((unit: any) => !!unit.level);
      }
      return false;
    },
    missionText(): string {
      const map: any = tbRecommended.find((x: any) => x.id === this.map);
      const phase: any = map.phases.find((x: any) => x.id === this.phase);
      const position: any = phase.positions.find(
        (x: any) => x.id === this.position
      );
      const mission: any = position.missions.find(
        (x: any) => x.id === this.mission
      );
      return mission?.label ?? "";
    },
    selected(): any {
      if (this.showMission && this.map) {
        try {
          const map: any = tbRecommended.find((x: any) => x.id === this.map);
          const phase: any = map.phases.find((x: any) => x.id === this.phase);
          const position: any = phase.positions.find(
            (x: any) => x.id === this.position
          );
          const mission: any = position.missions.find(
            (x: any) => x.id === this.mission
          );
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
      const unitIds = this.teamUnits.map((x: any) => x.id);
      const ownedUnits = this.player.units.filter((unit: Unit) =>
        unitIds.includes(unit.id)
      );
      return ownedUnits.reduce((map: any, unit: Unit) => {
        map[unit.id] = unit;
        return map;
      }, {});
    },
  },
  watch: {
    map() {
      this.phase =
        this.phaseOptions.length === 1 ? this.phaseOptions[0].value : "";
      this.position = "";
      this.mission = "";
      this.team = "";

      this.save();
    },
    phase() {
      this.position =
        this.positionOptions.length === 1 ? this.positionOptions[0].value : "";
      this.mission = "";
      this.team = "";

      this.save();
    },
    position() {
      this.mission =
        this.missionOptions.length === 1 ? this.missionOptions[0].value : "";
      this.team = "";

      this.save();
    },
    mission() {
      this.team =
        this.teamOptions.length === 1 ? this.teamOptions[0].value : "";

      this.save();
    },
    team() {
      this.save();
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
      try {
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
      } catch (err) {
        return "text-danger";
      }
    },
    levelStatus(unitId: string, minimumLevel: number, type: string): boolean {
      const unit: Unit = this.unitData(unitId);
      if (!unit) {
        return false;
      } else if (type === "Relic") {
        return unit.relicLevel >= minimumLevel;
      } else if (type === "Gear") {
        return unit.gearLevel >= minimumLevel;
      } else {
        return false;
      }
    },
    zetaAbilities(unitId: string, zetaIds: string[] = []) {
      const unit: Unit = this.unitData(unitId);
      return zetaIds.map((abilityId) => {
        const match = unit.abilities.find(
          (ability) => ability.id === abilityId
        );
        if (match) {
          return {
            id: abilityId,
            name: match.name,
            isZeta: match.has_zeta_learned,
          };
        } else {
          return {
            id: abilityId,
            name: abilityId,
            isZeta: false,
          };
        }
      });
    },
    save() {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({
          map: this.map,
          phase: this.phase,
          position: this.position,
          mission: this.mission,
          team: this.team,
        })
      );
    },
  },
  created() {
    const storageData = JSON.parse(
      window.localStorage.getItem(storageKey) || "{}"
    );

    this.map = storageData?.map ?? "";
    this.phase = storageData?.phase ?? "";
    this.position = storageData?.position ?? "";
    this.mission = storageData?.mission ?? "";
    this.team = storageData?.team ?? "";
  },
});
</script>

<style lang="scss" scoped>
.stat-container {
  max-width: 100%;
  flex-wrap: wrap;
  display: flex;

  & > * {
    margin: 0.25rem 0.5rem;
    padding: 0 0.5rem;
    flex-basis: 200px;
    min-width: 200px;

    &:not(:last-child) {
      border-right: 1px solid white;
    }
  }
}
.input-group {
  width: 25%;

  @media only screen and (max-width: 1200px) {
    width: 50%;
  }
  @media only screen and (max-width: 600px) {
    width: 100%;
  }

  .input-group-text {
    &:first-child {
      width: 75px;
    }
  }
}
</style>
