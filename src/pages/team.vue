<template>
  <div class="container teams-page">
    <Error :state="requestState" :message="`Unable to find player data.`" />
    <Loading :state="requestState" message="Loading Player Data" size="lg">
      <LastUpdated />
      <div class="input-group input-group-sm new-team">
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
        <div class="input-group input-group-sm rename-team">
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
        <div class="game-modes">
          <div>Select a game mode to apply Omicron abilities:</div>
          <div class="form-check">
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
          <div class="form-check">
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
        <table
          class="table table-bordered table-dark table-sm table-striped show-on-mobile"
        >
          <thead>
            <tr>
              <th>
                <div class="text-center">Team List</div>
                <div class="sort-methods">
                  <div class="input-group input-group-sm my-2">
                    <span class="input-group-text">Sort By:</span>
                    <select
                      class="form-control"
                      :value="team.sortMethod"
                      @input="sortBy(team, $event.target.value)"
                    >
                      <option value="leader">Leader</option>
                      <option value="name">Name</option>
                      <option value="subTotal">Sub Total</option>
                      <option value="total">Total</option>
                    </select>
                  </div>
                  <div class="input-group input-group-sm my-2">
                    <span class="input-group-text">Sort Direction:</span>
                    <select
                      class="form-control"
                      :value="team.sortDir"
                      @input="sortDir(team, $event.target.value)"
                    >
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="team-row"
              v-for="unit in sortTeamUnits(team)"
              :key="unit.id"
            >
              <div class="text-center">
                <router-link
                  :to="{ name: 'UnitPage', params: { unitId: unit.id } }"
                  >{{ unitData(unit.id).name }}</router-link
                >
              </div>
              <div class="leader-container">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :id="`leader-${unit.id}`"
                    v-model="unit.isLeader"
                    :disabled="disableLeader(team, unit.id)"
                    @change="speedBonusChange()"
                  />
                  <label class="form-check-label" :for="`leader-${unit.id}`"
                    >Is Leader?</label
                  >
                </div>
              </div>
              <div>
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
                <div class="my-2 text-center">
                  Speed Set:
                  {{ hasSpeedSet(unitData(unit.id)) ? "Yes" : "No" }}
                </div>
              </div>
              <div
                class="text-center"
                v-if="unitData(unit.id).stats['5'] !== grandTotal(team, unit)"
              >
                Sub Total: {{ unitData(unit.id).stats["5"] }}
              </div>
              <div
                class="text-center"
                v-if="
                  leaderSpeedBonus(team, unit) > 0 ||
                  uniqueSpeedBonus(team, unit) > 0 ||
                  speedBonusFromTeamMembers(team, unit) > 0
                "
              >
                <div v-if="leaderSpeedBonus(team, unit) > 0">
                  Leader Bonus: {{ leaderSpeedBonus(team, unit) }}
                </div>
                <div v-if="uniqueSpeedBonus(team, unit) > 0">
                  Unique Bonus: {{ uniqueSpeedBonus(team, unit) }}
                </div>
                <div v-if="speedBonusFromTeamMembers(team, unit) > 0">
                  Other Bonuses:
                  {{ speedBonusFromTeamMembers(team, unit) }}
                </div>
              </div>
              <div class="text-center">Total: {{ grandTotal(team, unit) }}</div>
              <div class="text-center">
                <button
                  type="button"
                  class="btn btn-danger btn-sm"
                  title="Remove from this team"
                  @click="removeUnit({ teamId: team.id, unit })"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </tr>
            <tr v-if="team.units.length < 5">
              <td class="text-center">
                <div class="add-unit-container">
                  <div class="input-group input-group-sm">
                    <SearchInput
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
        <table
          class="table table-bordered table-dark table-sm table-striped show-on-desktop"
        >
          <thead>
            <tr class="text-center align-middle">
              <td width="10%">
                <div class="c-pointer" @click="sortBy(team, 'leader')">
                  Is Leader?
                  <i class="fas mx-1" :class="sortIcon(team, 'leader')"></i>
                </div>
              </td>
              <td width="20%">
                <div class="c-pointer" @click="sortBy(team, 'name')">
                  Unit
                  <i class="fas mx-1" :class="sortIcon(team, 'name')"></i>
                </div>
                <input
                  class="form-control form-control-sm mx-auto my-1 w-75"
                  placeholder="Search"
                  v-model="team.searchName"
                />
              </td>
              <td width="25%">Mods</td>
              <td width="10%">
                <div class="c-pointer" @click="sortBy(team, 'subtotal')">
                  Sub Total
                  <i class="fas mx-1" :class="sortIcon(team, 'subtotal')"></i>
                </div>
              </td>
              <td width="15%">Leader/Unique</td>
              <td width="10%">
                <div class="c-pointer" @click="sortBy(team, 'total')">
                  Total
                  <i class="fas mx-1" :class="sortIcon(team, 'total')"></i>
                </div>
              </td>
              <td width="10%">Actions</td>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="unit in sortTeamUnits(team)"
              :key="unit.id"
              class="text-center"
            >
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
                <div v-if="leaderSpeedBonus(team, unit) > 0">
                  Leader Bonus: {{ leaderSpeedBonus(team, unit) }}
                </div>
                <div v-if="uniqueSpeedBonus(team, unit) > 0">
                  Unique Bonus: {{ uniqueSpeedBonus(team, unit) }}
                </div>
                <div v-if="speedBonusFromTeamMembers(team, unit) > 0">
                  Other Bonuses:
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
import { SortType, Team, TeamMember } from "../types/teams";
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
    ...mapState("teams", ["teams"]),
    ...mapGetters("teams", [
      "speedValueFromMod",
      "hasSpeedSet",
      "leaderSpeedBonus",
      "uniqueSpeedBonus",
      "speedBonusFromTeamMembers",
    ]),
    ...mapGetters(["someLoading"]),
    requestState(): loadingState {
      return this.someLoading(["player", "teams"]);
    },
  },
  methods: {
    ...mapActions("teams", [
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
        this.leaderSpeedBonus(team, unit) +
        this.uniqueSpeedBonus(team, unit) +
        this.speedBonusFromTeamMembers(team, unit)
      );
    },
    sortIcon(team: Team, type: SortType): string {
      if (
        team.sortMethod === type ||
        (team.sortMethod === undefined && type === "total")
      ) {
        return team.sortDir === "asc" ? "fa-sort-down" : "fa-sort-up";
      } else {
        return "fa-sort";
      }
    },
    sortBy(team: Team, type: SortType): void {
      if (team.sortMethod === type) {
        team.sortDir = team.sortDir === "asc" ? "desc" : "asc";
      } else {
        team.sortDir = "asc";
      }
      team.sortMethod = type;
      this.saveTeam(team);
    },
    sortDir(team: Team, direction: "asc" | "desc") {
      team.sortDir = direction;
      this.saveTeam(team);
    },
    sortTeamUnits(team: Team): TeamMember[] {
      return team.units.sort((a, b) => {
        if (team.sortMethod === "name") {
          const compareA: string = this.unitData(a.id).name.toLowerCase();
          const compareB: string = this.unitData(b.id).name.toLowerCase();
          if (team.sortDir === "asc") {
            return compareA > compareB ? 1 : -1;
          } else {
            return compareA > compareB ? -1 : 1;
          }
        } else if (team.sortMethod === "leader") {
          if (a.isLeader) {
            return team.sortDir === "asc" ? -1 : 1;
          } else if (b.isLeader) {
            return team.sortDir === "asc" ? 1 : -1;
          }
          return 0;
        } else if (team.sortMethod === "subtotal") {
          const compareA: number = this.unitData(a.id).stats["5"];
          const compareB: number = this.unitData(b.id).stats["5"];
          if (team.sortDir === "asc") {
            return compareA - compareB;
          } else {
            return compareB - compareA;
          }
        } else if (
          team.sortMethod === "total" ||
          team.sortMethod === undefined
        ) {
          const compareA: number = this.grandTotal(team, a);
          const compareB: number = this.grandTotal(team, b);
          if (team.sortDir === "asc") {
            return compareA - compareB;
          } else {
            return compareB - compareA;
          }
        }
        return 0;
      });
    },
  },
});
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";

.teams-page {
  max-width: 90%;
}

.show-on-desktop {
  .add-unit-container {
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

.new-team,
.rename-team {
  width: 50%;
  margin: 1rem 0;

  @media only screen and (max-width: 768px) {
    width: 100%;
  }
}

.game-modes {
  display: flex;
  margin-bottom: 0.5rem;
  justify-content: space-evenly;

  @media only screen and (max-width: 500px) {
    display: block;
  }

  @media only screen and (min-width: 501px) and (max-width: 991px) {
    display: grid;
    grid-template-columns: 1fr 1fr;

    *:not(.form-check) {
      grid-column: 1 / 3;
      text-align: center;
    }

    .form-check {
      min-width: 141px;

      &:nth-child(2n) {
        justify-self: right;
        margin-right: 1rem;
      }

      &:nth-child(2n + 1) {
        justify-self: left;
        margin-left: 1rem;
      }
    }
  }
}

.sort-methods {
  @media only screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

.team-row {
  > * {
    padding: 0.5rem 1rem;

    &:not(:last-child) {
      border-bottom: solid $gray-5 1px;
    }
  }

  .leader-container {
    display: flex;

    .form-check {
      margin: auto;
    }
  }
}

.show-on-mobile {
  tr:not(:last-child) {
    border-bottom: black solid 3px;
  }

  .add-unit-container {
    margin: 0.5rem;

    ::v-deep(.search-input) {
      width: calc(100% - 75px);
    }
    button {
      min-width: 75px;
    }
  }
}
</style>
