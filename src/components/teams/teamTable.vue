<template>
  <div :class="[size === 'sm' ? 'team-table-sm' : 'team-table-lg']">
    <div class="input-group input-group-sm rename-team">
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
        />
        <label class="form-check-label" :for="`gac-${team.id}`">
          Grand Arena
        </label>
      </div>
    </div>
    <MultiSelect
      class="select-columns"
      :options="cols"
      storageKey="teamsTable"
      @checked="selectedColumns = $event"
    />
    <SwgohTable :table="{ header, body }" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, Ref, toRefs } from "vue";

import { SortType, Team, TeamMember } from "types/teams";
import { Unit } from "types/unit";
import { iHeaderCell, iTableBody, iTableHead, iTableRow } from "types/general";
import { setupColumnEvents, setupSorting } from "utils";

type dataModel = {
  editTeamName: string;
  isEditing: boolean;
  selected: null | Unit;
  selectedColumns: string[];
};

const storageKey = "teamTable";

export default defineComponent({
  name: "TeamTable",
  setup() {
    const { sortDir } = setupSorting(storageKey);
    const selectedColumns: Ref<string[]> = ref([]);
    const { showCol } = setupColumnEvents(selectedColumns);

    return {
      sortDir,
      showCol,
      selectedColumns,
    };
  },
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
    showGameMode: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      editTeamName: this.team.name || "",
      isEditing: false,
      selected: null,
    } as dataModel;
  },
  computed: {
    showMods(): boolean {
      return this.size === "lg" && this.showCol("mods");
    },
    header(): iTableHead {
      return {
        classes: "sticky-header show-on-mobile",
        headers: [
          {
            cells: [
              {
                label: "Name",
                value: "name",
                show: this.showCol("name"),
                sortMethodShow: true,
                icon: this.sortIcon("name"),
                click: () => {
                  this.sortBy("name");
                },
              },
              {
                label: "Is Leader?",
                value: "isLeader",
                show: this.showCol("isLeader"),
                sortMethodShow: true,
                icon: this.sortIcon("isLeader"),
                click: () => {
                  this.sortBy("isLeader");
                },
              },
              {
                label: "images/mod_square.png",
                classes: "mod-col",
                sortMethodShow: this.size === "lg",
                show: this.showMods,
                icon: this.sortIcon("square"),
                click: () => {
                  this.sortBy("square");
                },
                input: {
                  type: "image",
                },
              },
              {
                label: "images/mod_diamond.png",
                classes: "mod-col",
                sortMethodShow: this.size === "lg",
                show: this.showMods,
                icon: this.sortIcon("diamond"),
                click: () => {
                  this.sortBy("diamond");
                },
                input: {
                  type: "image",
                },
              },
              {
                label: "images/mod_circle.png",
                classes: "mod-col",
                sortMethodShow: this.size === "lg",
                show: this.showMods,
                icon: this.sortIcon("circle"),
                click: () => {
                  this.sortBy("circle");
                },
                input: {
                  type: "image",
                },
              },
              {
                label: "images/mod_arrow.png",
                classes: "mod-col",
                sortMethodShow: this.size === "lg",
                show: this.showMods,
                icon: this.sortIcon("arrow"),
                click: () => {
                  this.sortBy("arrow");
                },
                input: {
                  type: "image",
                },
              },
              {
                label: "images/mod_triangle.png",
                classes: "mod-col",
                sortMethodShow: this.size === "lg",
                show: this.showMods,
                icon: this.sortIcon("triangle"),
                click: () => {
                  this.sortBy("triangle");
                },
                input: {
                  type: "image",
                },
              },
              {
                label: "images/mod_cross.png",
                classes: "mod-col",
                sortMethodShow: this.size === "lg",
                show: this.showMods,
                icon: this.sortIcon("cross"),
                click: () => {
                  this.sortBy("cross");
                },
                input: {
                  type: "image",
                },
              },
              {
                label: "Has Speed Set?",
                sortMethodShow: this.size === "lg",
                show: this.showMods,
                icon: this.sortIcon("speedSet"),
                click: () => {
                  this.sortBy("speedSet");
                },
              },
              {
                label: "Mods",
                value: this.showMods ? "mods" : null,
              },
              {
                label: "Sub Total",
                value: "subTotal",
                show: this.showCol("subTotal"),
                sortMethodShow: true,
                icon: this.sortIcon("subTotal"),
                click: () => {
                  this.sortBy("subTotal");
                },
              },
              {
                label: "Bonuses",
                value: "bonuses",
                show: this.showCol("bonuses"),
                sortMethodShow: true,
              },
              {
                label: "Total",
                value: "total",
                show: this.showCol("total"),
                sortMethodShow: true,
                icon: this.sortIcon("total"),
                click: () => {
                  this.sortBy("total");
                },
              },
              {
                label: "Actions",
                show: this.showCol("actions"),
              },
            ],
          },
        ],
      };
    },
    body(): iTableBody {
      const rows: iTableRow[] = this.team.fullUnitList.map(
        (unit: TeamMember) => {
          let bonuses = "";
          const leaderBonus = this.team.leaderSpeedBonus(
            unit,
            this.showGameMode
          );
          const uniqueBonus = this.team.uniqueSpeedBonus(
            unit,
            this.showGameMode
          );
          const otherBonus = this.team.speedBonusFromTeamMembers(
            unit,
            this.showGameMode
          );
          bonuses +=
            leaderBonus > 0
              ? `
            <div>Leader Bonus: ${leaderBonus}</div>
          `
              : "";
          bonuses +=
            uniqueBonus > 0
              ? `
            <div>Unique Bonus: ${uniqueBonus}</div>
          `
              : "";
          bonuses +=
            otherBonus > 0
              ? `
            <div>Other Bonus: ${otherBonus}</div>
          `
              : "";
          return {
            cells: [
              {
                show: this.showCol("name"),
                type: "link",
                data: { name: "UnitPage", params: { unitId: unit.id } },
                value: unit.name,
              },
              {
                show: this.showCol("isLeader"),
                type: "checkbox",
                label: "Is Leader?",
                data: {
                  value: unit.id,
                  checked: unit.isLeader,
                  disabled: this.disableLeader(unit.id),
                },
                change: (unitId: any) => {
                  unit.isLeader = !unit.isLeader;
                },
              },
              {
                show: this.showMods,
                type: "mod",
                data: {
                  id: unit.id,
                  shape: "square",
                },
              },
              {
                show: this.showMods,
                type: "mod",
                data: {
                  id: unit.id,
                  shape: "diamond",
                },
              },
              {
                show: this.showMods,
                type: "mod",
                data: {
                  id: unit.id,
                  shape: "circle",
                },
              },
              {
                show: this.showMods,
                type: "mod",
                data: {
                  id: unit.id,
                  shape: "arrow",
                },
              },
              {
                show: this.showMods,
                type: "mod",
                data: {
                  id: unit.id,
                  shape: "triangle",
                },
              },
              {
                show: this.showMods,
                type: "mod",
                data: {
                  id: unit.id,
                  shape: "cross",
                },
              },
              {
                show: this.showMods,
                label: "Has Speed Set?",
                type: "html",
                data: unit.hasSpeedSet
                  ? `<span class="text-success">Yes</span>`
                  : `<span class="text-white-50">No</span>`,
              },
              {
                show: this.showCol("subTotal"),
                data: unit.speed,
                label: "Subtotal:",
              },
              {
                show: this.showCol("bonuses"),
                classes: this.hasBonuses(unit) ? "" : "hide-sm",
                label: "Bonuses:",
                data: bonuses,
                type: "html",
              },
              {
                show: this.showCol("total"),
                data: this.team.grandTotal(unit, true),
                label: "Grand Total:",
              },
              {
                show: this.showCol("actions"),
                type: "buttons",
                data: {
                  buttons: [
                    {
                      click: () => {
                        this.team.removeUnit(unit);
                      },
                      icon: "fas fa-trash",
                      classes: "btn btn-danger btn-sm",
                      title: "Remove this unit from this team",
                    },
                  ],
                },
              },
            ],
          };
        }
      );
      if (this.team.units.length < 5) {
        rows.push({
          cells: [
            {
              colspan: "100%",
              show: true,
              type: "unitSearch",
              click: (unit: any) => {
                this.team.addUnit(unit);
              },
              data: {
                list: this.unitList,
              },
            },
          ],
        });
      }

      return {
        classes: "align-middle text-center",
        rows,
      };
    },
    cols(): iHeaderCell[] {
      return this.header.headers.reduce((acc: iHeaderCell[], row) => {
        row.cells.forEach((cell) => acc.push(cell));
        return acc;
      }, []);
    },
  },
  methods: {
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
    },
    saveTeamName() {
      if (this.isEditing) {
        this.team.name = this.editTeamName;
        this.isEditing = false;
      }
    },
    editTeam() {
      this.isEditing = true;
      this.$nextTick(() => {
        if (this.$refs.teamName) {
          (this.$refs.teamName as HTMLElement).focus();
        }
      });
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
    hasBonuses(unit: TeamMember): boolean {
      return (
        this.team.leaderSpeedBonus(unit, this.showGameMode) > 0 &&
        this.team.uniqueSpeedBonus(unit, this.showGameMode) > 0 &&
        this.team.speedBonusFromTeamMembers(unit, this.showGameMode) > 0
      );
    },
  },
});
</script>

<style lang="scss" scoped>
@import "styles/variables.scss";

::v-deep(th) {
  &.mod-col {
    padding: 0.15rem;

    img {
      max-width: 30px;
    }
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

.is-leader {
  display: flex;
  justify-content: center;
  margin-bottom: 0;

  @media only screen and (max-width: 768px) {
    display: inline;
    padding-left: 0;

    input {
      float: none;
      margin-left: 0.5rem;
    }
  }
}

.add-unit-container {
  width: fit-content;
  margin: auto;
}
</style>
