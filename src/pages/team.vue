<template>
  <div class="container speed-clocking-page">
    <Error :state="requestState" :message="`Unable to find player data.`" />
    <Loading :state="requestState" message="Loading Player Data" size="lg">
      <div class="input-group input-group-sm w-50 my-3">
        <input
          type="text"
          class="form-control"
          placeholder="Team Name"
          v-model="newTeamName"
          @keypress.enter="addNewTeam"
        />
        <button
          class="btn btn-primary"
          type="button"
          @click="addNewTeam"
          :disabled="newTeamName.trim() === ''"
        >
          Add New Team
        </button>
      </div>
      <template v-for="team in teams" :key="team.id">
        <hr class="w-100 border-dark border" />
        <div class="input-group input-group-sm w-50 my-3">
          <input
            type="text"
            class="form-control"
            v-model="editTeamTarget.name"
            v-if="editTeamTarget && editTeamTarget.id === team.id"
            :ref="`team-${team.id}`"
            @keypress.enter="saveTeam"
          />
          <span class="input-group-text flex-fill" v-else>{{ team.name }}</span>
          <button
            class="btn btn-primary"
            type="button"
            title="Edit team name"
            v-if="!editTeamTarget"
            @click="editTeam(team)"
          >
            <i class="fas fa-edit"></i>
          </button>
          <template v-if="editTeamTarget && editTeamTarget.id === team.id">
            <button
              class="btn btn-warning"
              type="button"
              title="Cancel changes"
              @click="editTeamTarget = null"
            >
              <i class="fas fa-ban"></i>
            </button>
            <button
              class="btn btn-success"
              type="button"
              @click="saveTeam"
              :disabled="team.name.trim() === ''"
              title="Save name changes"
            >
              <i class="fas fa-save"></i>
            </button>
          </template>
          <button
            class="btn btn-danger"
            type="button"
            @click="confirmDeleteTeam(team)"
            title="Delete team"
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>
        <div class="d-flex mb-2 justify-content-evenly">
          <div>Select a game mode to apply Omicron abilities:</div>
          <div class="form-check mr-2">
            <input
              class="form-check-input"
              type="radio"
              :id="`any-${team.id}`"
              v-model="team.gameMode"
              value=""
              @change="saveTeam(team)"
            />
            <label class="form-check-label" :for="`any-${team.id}`">
              Any
            </label>
          </div>
          <div class="form-check mr-2">
            <input
              class="form-check-input"
              type="radio"
              :id="`tw-${team.id}`"
              v-model="team.gameMode"
              value="Territory Wars"
              @change="saveTeam(team)"
            />
            <label class="form-check-label" :for="`tw-${team.id}`">
              Territory Wars
            </label>
          </div>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              :id="`tb-${team.id}`"
              v-model="team.gameMode"
              value="Territory Battles"
              @change="saveTeam(team)"
            />
            <label class="form-check-label" :for="`tb-${team.id}`">
              Territory Battles
            </label>
          </div>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              :id="`gac-${team.id}`"
              v-model="team.gameMode"
              value="Grand Arena"
              @change="saveTeam(team)"
            />
            <label class="form-check-label" :for="`gac-${team.id}`">
              Grand Arena
            </label>
          </div>
        </div>
        <table class="table table-bordered table-dark table-sm table-striped">
          <thead>
            <tr class="text-center">
              <td width="10%">Is Leader?</td>
              <td width="20%">Unit</td>
              <td width="25%">Mods</td>
              <td width="10%">Sub Total</td>
              <td width="15%">Leader/Unique</td>
              <td width="10%">Total</td>
              <td width="10%">Actions</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="unit in team.units" :key="unit.id" class="text-center">
              <td class="text-left">
                <div class="form-check d-flex justify-content-center">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="unit.isLeader"
                    :disabled="disableLeader(team, unit.id)"
                    @change="speedBonusChange()"
                  />
                </div>
              </td>
              <td>
                <router-link
                  :to="{ name: 'UnitPage', params: { unitId: unit.id } }"
                  >{{ unitData(unit.id).name }}</router-link
                >
              </td>
              <td>
                <div class="mods-list">
                  <ul>
                    <li>
                      Square: {{ speedValueFromMod(unitData(unit.id).mods[0]) }}
                    </li>
                    <li>
                      Diamond:
                      {{ speedValueFromMod(unitData(unit.id).mods[2]) }}
                    </li>
                    <li>
                      Circle: {{ speedValueFromMod(unitData(unit.id).mods[4]) }}
                    </li>
                  </ul>
                  <ul>
                    <li>
                      Arrow: {{ speedValueFromMod(unitData(unit.id).mods[1]) }}
                    </li>
                    <li>
                      Triangle:
                      {{ speedValueFromMod(unitData(unit.id).mods[3]) }}
                    </li>
                    <li>
                      Cross: {{ speedValueFromMod(unitData(unit.id).mods[5]) }}
                    </li>
                  </ul>
                </div>
                <div class="my-2">
                  Speed Set:
                  {{ hasSpeedSet(unitData(unit.id)) ? "Yes" : "No" }}
                </div>
              </td>
              <td>{{ unitData(unit.id).stats["5"] }}</td>
              <td>
                <input
                  type="number"
                  class="form-control form-control-sm"
                  v-model="unit.speedBonus"
                  @change="speedBonusChange()"
                  min="0"
                />
                <div>Leader Bonus: {{ leaderSpeedBonus(team, unit) }}</div>
                <div>Unique Bonus: {{ uniqueSpeedBonus(team, unit) }}</div>
                <div>
                  Team Members Uniques:
                  {{ speedBonusFromTeamMembers(team, unit) }}
                </div>
              </td>
              <td>
                {{ grandTotal(team, unit) }}
              </td>
              <td>
                <button
                  type="button"
                  class="btn btn-danger btn-sm"
                  title="Remove from this team"
                  @click="removeUnit({ teamId: team.id, unit })"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr v-if="team.units.length < 5">
              <td colspan="7" class="text-center">
                <div class="add-unit-container">
                  <div class="input-group input-group-sm">
                    <SearchInput
                      class="search-input"
                      :list="player.units"
                      @select="selected = $event"
                      @enterPress="add(team, $event)"
                    />
                    <button
                      class="btn btn-sm btn-primary"
                      :disabled="!selected"
                      @click="add(team, selected)"
                    >
                      Add Unit
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
      <Confirm
        :isOpen="deleteTarget !== null"
        title="Are you sure?"
        :text="`Are you sure you want to delete this team (${
          deleteTarget ? deleteTarget.name : ''
        })? This cannot be undone.`"
        @confirm="
          deleteTeam(deleteTarget);
          deleteTarget = null;
        "
        @cancel="cancelDelete"
      />
    </Loading>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapActions, mapGetters } from "vuex";
import { v4 as uuid } from "uuid";
import _ from "lodash";

import { Unit } from "../types/unit";
import { Team, TeamMember } from "../types/speed";
import { unvue } from "../utils";
import { loadingState } from "../types/loading";

type dataModel = {
  selected: null | Unit;
  newTeamName: string;
  editTeamTarget: null | Team;
  deleteTarget: null | Team;
};

export default defineComponent({
  name: "TeamPage",
  data() {
    return {
      selected: null,
      newTeamName: "abc",
      editTeamTarget: null,
      deleteTarget: null,
    } as dataModel;
  },
  computed: {
    ...mapState("player", ["player"]),
    ...mapGetters("player", ["unitData"]),
    ...mapState("speed", ["teams"]),
    ...mapGetters("speed", [
      "speedValueFromMod",
      "hasSpeedSet",
      "leaderSpeedBonus",
      "uniqueSpeedBonus",
      "speedBonusFromTeamMembers",
    ]),
    ...mapGetters(["someLoading"]),
    requestState(): loadingState {
      return this.someLoading(["player", "speed"]);
    },
  },
  methods: {
    ...mapActions("speed", [
      "addTeam",
      "addUnit",
      "saveTeams",
      "deleteTeam",
      "removeUnit",
    ]),
    addNewTeam() {
      if (this.newTeamName.trim() !== "") {
        this.addTeam({
          id: uuid(),
          name: this.newTeamName,
          units: [],
        });
        this.newTeamName = "";
      }
    },
    add(team: Team, unit: Unit) {
      const exists = team.units.find((x) => x.id === unit.id);
      if (exists) {
        this.$toast(`${unit.name} is already added to ${team.name}.`, {
          positionY: "top",
          class: "toast-warning",
        });
      } else {
        this.addUnit({ teamId: team.id, unit });
      }
    },
    speedBonusChange: _.debounce(function fn(this: any) {
      this.saveTeams();
    }, 300),
    disableLeader(team: Team, unitId: string) {
      return team.units.some((unit) => {
        if (unit.isLeader) {
          if (unit.id !== unitId) {
            return true;
          }
        }
        return false;
      });
    },
    editTeam(team: Team) {
      this.editTeamTarget = unvue(team);
      this.$nextTick(() => {
        if (this.$refs[`team-${team.id}`]) {
          (this.$refs[`team-${team.id}`] as HTMLElement[])[0].focus();
        }
      });
    },
    saveTeam(team?: Team) {
      if (!team) {
        team = unvue(this.editTeamTarget);
      }
      this.addTeam(team);
      this.editTeamTarget = null;
    },
    confirmDeleteTeam(team: Team) {
      this.deleteTarget = team;
    },
    cancelDelete() {
      this.deleteTarget = null;
      this.editTeamTarget = null;
    },
    removeUnitFromTeam(team: Team, unit: Unit) {
      this.removeUnit({ teamId: team.id, unit });
    },
    grandTotal(team: Team, unit: TeamMember) {
      return (
        this.unitData(unit.id).stats["5"] +
        (unit.speedBonus || 0) +
        this.leaderSpeedBonus(team, unit) +
        this.uniqueSpeedBonus(team, unit) +
        this.speedBonusFromTeamMembers(team, unit)
      );
    },
  },
});
</script>

<style lang="scss" scoped>
.speed-clocking-page {
  max-width: 90%;
}

.add-unit-container {
  width: 25%;
  display: inline-block;
  vertical-align: middle;
  margin: 0.5rem 0;

  .input-group {
    width: 100%;
    margin: auto;

    ::v-deep(.search-input) {
      width: calc(100% - 100px);
    }
    button {
      width: 100px;
    }
  }
}

.mods-list {
  display: flex;
  justify-content: center;

  ul {
    margin: 0 1rem;
    padding: 0;
    list-style: none;
  }
}
</style>
