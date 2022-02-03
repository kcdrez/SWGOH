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
            @keypress.enter="updateTeam(team)"
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
        <table class="table table-bordered table-dark table-sm table-striped">
          <thead>
            <tr class="text-center">
              <td width="10%">Unit</td>
              <td width="7%">Square</td>
              <td width="7%">Arrow</td>
              <td width="7%">Diamond</td>
              <td width="7%">Triangle</td>
              <td width="7%">Circle</td>
              <td width="7%">Cross</td>
              <td width="10%">Speed Set Bonus?</td>
              <td width="10%">Sub Total</td>
              <td width="10%">Leader/Unique</td>
              <td width="10%">Total</td>
              <td width="8%">Actions</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="unit in team.units" :key="unit.id" class="text-center">
              <td>{{ unitData(unit.id).name }}</td>
              <td>{{ speedValueFromMod(unitData(unit.id).mods[0]) }}</td>
              <td>{{ speedValueFromMod(unitData(unit.id).mods[1]) }}</td>
              <td>{{ speedValueFromMod(unitData(unit.id).mods[2]) }}</td>
              <td>{{ speedValueFromMod(unitData(unit.id).mods[3]) }}</td>
              <td>{{ speedValueFromMod(unitData(unit.id).mods[4]) }}</td>
              <td>{{ speedValueFromMod(unitData(unit.id).mods[5]) }}</td>
              <td>{{ hasSpeedSet(unitData(unit.id)) ? "Yes" : "No" }}</td>
              <td>{{ unitData(unit.id).stats["5"] }}</td>
              <td>
                <input
                  type="number"
                  class="form-control form-control-sm"
                  v-model="unit.speedBonus"
                  @change="speedBonusChange(unit)"
                  min="0"
                />
              </td>
              <td>
                {{ unitData(unit.id).stats["5"] + (unit.speedBonus || 0) }}
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
            <tr>
              <td colspan="12" class="text-center">
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

import { Unit } from "../types/unit";
import { Team } from "../types/speed";
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
      newTeamName: "",
      editTeamTarget: null,
      deleteTarget: null,
    } as dataModel;
  },
  computed: {
    ...mapState("player", ["player"]),
    ...mapGetters("player", ["unitData"]),
    ...mapState("speed", ["teams"]),
    ...mapGetters("speed", ["speedValueFromMod", "hasSpeedSet"]),
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
    speedBonusChange() {
      //todo debouncer
      this.saveTeams();
    },
    editTeam(team: Team) {
      this.editTeamTarget = unvue(team);
      this.$nextTick(() => {
        if (this.$refs[`team-${team.id}`]) {
          (this.$refs[`team-${team.id}`] as HTMLElement[])[0].focus();
        }
      });
    },
    saveTeam() {
      this.addTeam(this.editTeamTarget);
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

    .search-input {
      width: calc(100% - 100px);

      ::v-deep(input) {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
    }
    button {
      width: 100px;
    }
  }
}
</style>
