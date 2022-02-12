<template>
  <div :class="[size === 'sm' ? 'team-table-sm' : 'team-table-lg']">
    <div class="input-group input-group-sm rename-team" v-if="allowEdit">
      <input
        type="text"
        class="form-control"
        v-model="editTeamName"
        v-if="isEditing"
        ref="teamName"
        @keypress.enter="saveTeamName"
      />
      <span class="input-group-text flex-fill" v-else>{{ team.name }}</span>
      <button
        class="btn btn-primary"
        type="button"
        title="Edit team name"
        v-if="!isEditing"
        @click="editTeam"
      >
        <i class="fas fa-edit"></i>
      </button>
      <template v-if="isEditing">
        <button
          class="btn btn-warning"
          type="button"
          title="Cancel changes"
          @click="isEditing = false"
        >
          <i class="fas fa-ban"></i>
        </button>
        <button
          class="btn btn-success"
          type="button"
          @click="saveTeamName"
          :disabled="editTeamName.trim() === ''"
          title="Save name changes"
        >
          <i class="fas fa-save"></i>
        </button>
      </template>
      <button
        class="btn btn-danger"
        type="button"
        @click="$emit('deleteTeam')"
        title="Delete team"
      >
        <i class="fas fa-trash"></i>
      </button>
    </div>
    <div class="game-modes" v-if="showGameMode">
      <div>Select a game mode to apply Omicron abilities:</div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          :id="`any-${team.id}`"
          v-model="team.gameMode"
          value=""
          @change="saveTeam"
        />
        <label class="form-check-label" :for="`any-${team.id}`"> Any </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          :id="`tw-${team.id}`"
          v-model="team.gameMode"
          value="Territory Wars"
          @change="saveTeam"
        />
        <label class="form-check-label" :for="`tw-${team.id}`">
          Territory Wars
        </label>
      </div>
      <div class="form-check" v-if="size !== 'sm'">
        <input
          class="form-check-input"
          type="radio"
          :id="`tb-${team.id}`"
          v-model="team.gameMode"
          value="Territory Battles"
          @change="saveTeam"
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
          @change="saveTeam"
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
            <div class="sort-methods" v-if="allowEdit">
              <div class="input-group input-group-sm my-2">
                <span class="input-group-text">Sort By:</span>
                <select
                  class="form-control"
                  :value="team.sortMethod"
                  @input="sortBy($event.target.value)"
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
                  @input="sortDir($event.target.value)"
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
        <tr class="team-row" v-for="unit in sortTeamUnits" :key="unit.id">
          <div class="text-center">
            <router-link
              :to="{
                name: 'UnitPage',
                params: { unitId: unit.id },
              }"
              >{{ unitData(unit.id).name }}</router-link
            >
          </div>
          <div class="leader-container">
            <div class="form-check" v-if="allowEdit">
              <input
                class="form-check-input"
                type="checkbox"
                :id="`leader-${unit.id}`"
                v-model="unit.isLeader"
                :disabled="disableLeader(unit.id)"
                @change="speedBonusChange()"
              />
              <label class="form-check-label" :for="`leader-${unit.id}`"
                >Is Leader?</label
              >
            </div>
            <div v-else>Is Leader? {{ unit.isLeader ? "Yes" : "No" }}</div>
          </div>
          <div v-if="showMods">
            <div class="mods-list">
              <ul>
                <li>
                  Square:
                  {{ speedValueFromMod(unitData(unit.id).mods[0]) }}
                </li>
                <li>
                  Diamond:
                  {{ speedValueFromMod(unitData(unit.id).mods[2]) }}
                </li>
                <li>
                  Circle:
                  {{ speedValueFromMod(unitData(unit.id).mods[4]) }}
                </li>
              </ul>
              <ul>
                <li>
                  Arrow:
                  {{ speedValueFromMod(unitData(unit.id).mods[1]) }}
                </li>
                <li>
                  Triangle:
                  {{ speedValueFromMod(unitData(unit.id).mods[3]) }}
                </li>
                <li>
                  Cross:
                  {{ speedValueFromMod(unitData(unit.id).mods[5]) }}
                </li>
              </ul>
            </div>
            <div class="my-2 text-center">
              Speed Set:
              <span class="text-success" v-if="hasSpeedSet(unitData(unit.id))">
                Yes
              </span>
              <span class="text-white-50" v-else>No</span>
            </div>
          </div>
          <div
            class="text-center"
            v-if="unitData(unit.id).stats['5'] !== grandTotal(unit, team)"
          >
            Sub Total: {{ unitData(unit.id).stats["5"] }}
          </div>
          <div
            class="text-center"
            v-if="
              leaderSpeedBonus(team, unit, showGameMode) > 0 ||
              uniqueSpeedBonus(team, unit, showGameMode) > 0 ||
              speedBonusFromTeamMembers(team, unit, showGameMode) > 0
            "
          >
            <div v-if="leaderSpeedBonus(team, unit, showGameMode) > 0">
              Leader Bonus: {{ leaderSpeedBonus(team, unit, showGameMode) }}
            </div>
            <div v-if="uniqueSpeedBonus(team, unit, showGameMode) > 0">
              Unique Bonus: {{ uniqueSpeedBonus(team, unit, showGameMode) }}
            </div>
            <div v-if="speedBonusFromTeamMembers(team, unit, showGameMode) > 0">
              Other Bonuses:
              {{ speedBonusFromTeamMembers(team, unit, showGameMode) }}
            </div>
          </div>
          <div class="text-center">Total: {{ grandTotal(unit, team) }}</div>
          <div class="text-center">
            <button
              type="button"
              class="btn btn-danger btn-sm"
              title="Remove from this team"
              @click="$emit('removeUnit', unit)"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </tr>
        <tr v-if="team.units.length < 5 && allowEdit">
          <td class="text-center">
            <div class="add-unit-container">
              <div class="input-group input-group-sm">
                <SearchInput
                  :list="unitList"
                  @select="selected = $event"
                  @enterPress="add($event)"
                />
                <button
                  class="btn btn-sm btn-primary"
                  :disabled="!selected"
                  @click="add(selected)"
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
            <div class="c-pointer" @click="sortBy('leader')">
              Is Leader?
              <i class="fas mx-1" :class="sortIcon('leader')"></i>
            </div>
          </td>
          <td width="20%">
            <div class="c-pointer" @click="sortBy('name')">
              Unit
              <i class="fas mx-1" :class="sortIcon('name')"></i>
            </div>
            <input
              class="form-control form-control-sm mx-auto my-1 w-75"
              placeholder="Search"
              v-model="team.searchName"
            />
          </td>
          <td v-if="showOwner" width="10%">Owner</td>
          <td width="25%" v-if="showMods">Mods</td>
          <td width="10%">
            <div class="c-pointer" @click="sortBy('subtotal')">
              Sub Total
              <i class="fas mx-1" :class="sortIcon('subtotal')"></i>
            </div>
          </td>
          <td width="15%">Leader/Unique</td>
          <td width="10%">
            <div class="c-pointer" @click="sortBy('total')">
              Total
              <i class="fas mx-1" :class="sortIcon('total')"></i>
            </div>
          </td>
          <td width="10%">Actions</td>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="unit in sortTeamUnits"
          :key="unit.id"
          class="text-center align-middle"
        >
          <td class="text-left">
            <div
              class="form-check d-flex justify-content-center"
              v-if="allowEdit"
            >
              <input
                class="form-check-input"
                type="checkbox"
                v-model="unit.isLeader"
                :disabled="disableLeader(unit.id)"
                @change="speedBonusChange()"
              />
            </div>
            <div v-else :class="{ 'text-success': unit.isLeader }">
              {{ unit.isLeader ? "Yes" : "No" }}
            </div>
          </td>
          <td>
            <router-link
              :to="{
                name: 'UnitPage',
                params: { unitId: unit.id },
              }"
              >{{ unitData(unit.id).name }}</router-link
            >
          </td>
          <td v-if="showOwner">
            {{ unit.owner }}
          </td>
          <td v-if="showMods">
            <div class="mods-list">
              <ul>
                <li>
                  Square:
                  {{ speedValueFromMod(unitData(unit.id).mods[0]) }}
                </li>
                <li>
                  Diamond:
                  {{ speedValueFromMod(unitData(unit.id).mods[2]) }}
                </li>
                <li>
                  Circle:
                  {{ speedValueFromMod(unitData(unit.id).mods[4]) }}
                </li>
              </ul>
              <ul>
                <li>
                  Arrow:
                  {{ speedValueFromMod(unitData(unit.id).mods[1]) }}
                </li>
                <li>
                  Triangle:
                  {{ speedValueFromMod(unitData(unit.id).mods[3]) }}
                </li>
                <li>
                  Cross:
                  {{ speedValueFromMod(unitData(unit.id).mods[5]) }}
                </li>
              </ul>
            </div>
            <div class="my-2">
              Speed Set:
              <span class="text-success" v-if="hasSpeedSet(unitData(unit.id))"
                >Yes</span
              >
              <span class="text-white-50" v-else>No</span>
            </div>
          </td>
          <td>{{ unitData(unit.id).stats["5"] }}</td>
          <td>
            <div v-if="leaderSpeedBonus(team, unit, showGameMode) > 0">
              Leader Bonus: {{ leaderSpeedBonus(team, unit, showGameMode) }}
            </div>
            <div v-if="uniqueSpeedBonus(team, unit, showGameMode) > 0">
              Unique Bonus: {{ uniqueSpeedBonus(team, unit, showGameMode) }}
            </div>
            <div v-if="speedBonusFromTeamMembers(team, unit, showGameMode) > 0">
              Other Bonuses:
              {{ speedBonusFromTeamMembers(team, unit, showGameMode) }}
            </div>
          </td>
          <td>
            {{ grandTotal(unit, team, showGameMode) }}
          </td>
          <td>
            <button
              type="button"
              class="btn btn-danger btn-sm"
              title="Remove from this team"
              @click="$emit('removeUnit', unit)"
            >
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
        <tr v-if="team.units.length < 5 && allowEdit">
          <td colspan="7" class="text-center">
            <div class="add-unit-container">
              <div class="input-group input-group-sm">
                <SearchInput
                  :list="unitList"
                  @select="selected = $event"
                  @enterPress="add($event)"
                />
                <button
                  class="btn btn-sm btn-primary"
                  :disabled="!selected"
                  @click="add(selected)"
                >
                  Add Unit
                </button>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { defineComponent, PropType } from "vue";
import _ from "lodash";

import { unvue } from "../../utils";
import { SortType, Team, TeamMember } from "../../types/teams";
import { Unit } from "../../types/unit";

type dataModel = {
  editTeamName: string;
  isEditing: boolean;
  selected: null | Unit;
};

export default defineComponent({
  name: "TeamTable",
  props: {
    team: {
      required: true,
      type: Object as PropType<Team>,
    },
    unitList: {
      required: false,
      type: Object as PropType<Unit[]>,
    },
    size: {
      type: String,
      default: "lg",
      validator: (val: string) => {
        return ["sm", "lg"].includes(val);
      },
    },
    allowEdit: {
      type: Boolean,
      default: true,
    },
    showGameMode: {
      type: Boolean,
      default: true,
    },
    showOwner: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      editTeamName: unvue(this.team.name),
      isEditing: false,
      selected: null,
    } as dataModel;
  },
  computed: {
    ...mapGetters("player", ["unitData"]),
    ...mapGetters("teams", [
      "speedValueFromMod",
      "hasSpeedSet",
      "leaderSpeedBonus",
      "uniqueSpeedBonus",
      "speedBonusFromTeamMembers",
      "grandTotal",
    ]),
    sortTeamUnits(): TeamMember[] {
      return this.team.units.sort((a, b) => {
        if (this.team.sortMethod === "name") {
          const compareA: string = this.unitData(a.id).name.toLowerCase();
          const compareB: string = this.unitData(b.id).name.toLowerCase();
          if (this.team.sortDir === "asc") {
            return compareA > compareB ? 1 : -1;
          } else {
            return compareA > compareB ? -1 : 1;
          }
        } else if (this.team.sortMethod === "leader") {
          if (a.isLeader) {
            return this.team.sortDir === "asc" ? -1 : 1;
          } else if (b.isLeader) {
            return this.team.sortDir === "asc" ? 1 : -1;
          }
          return 0;
        } else if (this.team.sortMethod === "subtotal") {
          const compareA: number = this.unitData(a.id).stats["5"];
          const compareB: number = this.unitData(b.id).stats["5"];
          if (this.team.sortDir === "asc") {
            return compareA - compareB;
          } else {
            return compareB - compareA;
          }
        } else if (
          this.team.sortMethod === "total" ||
          this.team.sortMethod === undefined
        ) {
          const compareA: number = this.grandTotal(a, this.team);
          const compareB: number = this.grandTotal(b, this.team);
          if (this.team.sortDir === "asc") {
            return compareA - compareB;
          } else {
            return compareB - compareA;
          }
        }
        return 0;
      });
    },
    showMods(): boolean {
      return this.size === "lg";
    },
  },
  methods: {
    saveTeamName() {
      if (this.isEditing) {
        const newTeam: Team = unvue(this.team);
        newTeam.name = this.editTeamName;
        this.$emit("addTeam", newTeam);
      }
    },
    saveTeam() {
      this.$emit("addTeam", this.team);
    },
    editTeam() {
      this.$nextTick(() => {
        if (this.$refs.teamName) {
          (this.$refs.teamName as HTMLElement).focus();
        }
      });
    },
    sortIcon(type: SortType): string {
      if (
        this.team.sortMethod === type ||
        (this.team.sortMethod === undefined && type === "total")
      ) {
        return this.team.sortDir === "asc" ? "fa-sort-down" : "fa-sort-up";
      } else {
        return "fa-sort";
      }
    },
    sortBy(type: SortType): void {
      if (this.team.sortMethod === type) {
        this.team.sortDir = this.team.sortDir === "asc" ? "desc" : "asc";
      } else {
        this.team.sortDir = "asc";
      }
      this.team.sortMethod = type;
      this.saveTeam();
    },
    sortDir(direction: "asc" | "desc") {
      this.team.sortDir = direction;
      this.saveTeam();
    },
    disableLeader(unitId: string) {
      return this.team.units.some((unit) => {
        if (unit.isLeader) {
          if (unit.id !== unitId) {
            return true;
          }
        }
        return false;
      });
    },
    speedBonusChange: _.debounce(function fn(this: any) {
      this.$emit("saveTeams");
    }, 300),
    add(unit: Unit) {
      const exists = this.team.units.find((x) => x.id === unit.id);
      if (exists) {
        this.$toast(`${unit.name} is already added to ${this.team.name}.`, {
          positionY: "top",
          class: "toast-warning",
        });
      } else {
        this.$emit("addUnit", unit);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";

.mods-list {
  display: flex;
  justify-content: center;

  ul {
    margin: 0 1rem;
    padding: 0;
    list-style: none;
  }
}

@mixin columns2 {
  display: grid !important;
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

.team-table-lg {
  .rename-team {
    width: 50%;
    margin: 1rem 0;

    @media only screen and (max-width: 768px) {
      width: 100%;
    }
  }

  .game-modes {
    display: flex;
    justify-content: space-evenly;
  }
}
.team-table-sm {
  .rename-team {
    width: 100%;
    margin: 1rem 0;
  }
  .game-modes {
    display: grid !important;
    grid-template-columns: 1fr 1fr 1fr;
    grid-column-gap: 5px;

    *:not(.form-check) {
      grid-column: 1 / 4;
      text-align: center;
    }

    .form-check {
      //the first element is the text that spans all columns which is not .form-check
      &:nth-child(2) {
        justify-self: right;
      }
      &:nth-child(3) {
        justify-self: center;
      }
      &:nth-child(4) {
        justify-self: left;
      }

      &:last-of-type {
        justify-self: left;
      }
    }
  }
}
.game-modes {
  margin-bottom: 0.5rem;
  @media only screen and (max-width: 500px) {
    display: block !important;
  }

  @media only screen and (min-width: 501px) and (max-width: 991px) {
    @include columns2();
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
