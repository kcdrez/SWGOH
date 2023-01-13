<template>
  <div class="match-table-component">
    <div class="game-modes">
      <div>Select a game mode to apply Omicron abilities:</div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          :id="`any-${match.id}`"
          v-model="match.gameMode"
          value=""
        />
        <label class="form-check-label" :for="`any-${match.id}`"> Any </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          :id="`tw-${match.id}`"
          v-model="match.gameMode"
          value="Territory Wars"
        />
        <label class="form-check-label" :for="`tw-${match.id}`">
          Territory Wars
        </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          :id="`tb-${match.id}`"
          v-model="match.gameMode"
          value="Territory Battles"
        />
        <label class="form-check-label" :for="`tb-${match.id}`">
          Territory Battles
        </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          :id="`gac-${match.id}`"
          v-model="match.gameMode"
          value="Grand Arena"
        />
        <label class="form-check-label" :for="`gac-${match.id}`">
          Grand Arena
        </label>
      </div>
    </div>
    <MultiSelect
      class="select-columns"
      :options="header.headers"
      storageKey="matchTable"
      label="Show/Hide Columns"
      @checked="selectedColumns = $event"
    />
    <table
      class="table table-bordered table-dark table-sm table-striped swgoh-table"
    >
      <TableHeader :header="header" />
      <TableBody :body="body" />
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, Ref } from "vue";

import { Match, TeamMember } from "types/teams";
import MultiSelect from "components/general/multiSelect.vue";
import { setupColumnEvents } from "utils";
import { iTableBody, iTableHead } from "types/general";

export default defineComponent({
  name: "MatchTable",
  setup() {
    const selectedColumns: Ref<string[]> = ref([]);
    const { showCol } = setupColumnEvents(selectedColumns);

    return {
      selectedColumns,
      showCol,
    };
  },
  components: { MultiSelect },
  props: {
    match: {
      required: true,
      type: Object as PropType<Match>,
    },
  },
  computed: {
    header(): iTableHead {
      return {
        classes: "show-on-mobile",
        sortMethod: this.match.sortMethod,
        sortDir: this.match.sortDir,
        methodChange: (val: any) => {
          this.match.sortMethod = val;
        },
        directionChange: (val: "asc" | "desc") => {
          this.match.sortDir = val;
        },
        headers: [
          {
            label: "Name",
            show: this.showCol("name"),
            sortMethodShow: true,
            icon: this.match.sortIcon("name"),
            value: "name",
            click: () => {
              this.match.sortMethod = "name";
            },
          },
          {
            label: "Is Leader?",
            show: this.showCol("isLeader"),
            sortMethodShow: true,
            icon: this.match.sortIcon("isLeader"),
            value: "isLeader",
            click: () => {
              this.match.sortMethod = "isLeader";
            },
          },
          {
            label: "Owner",
            show: this.showCol("owner"),
            sortMethodShow: true,
            value: "owner",
          },
          {
            label: "Sub Total",
            show: this.showCol("subTotal"),
            icon: this.match.sortIcon("subTotal"),
            value: "subTotal",
            sortMethodShow: true,
            click: () => {
              this.match.sortMethod = "subTotal";
            },
          },
          {
            label: "Bonuses",
            show: this.showCol("bonuses"),
            value: "bonuses",
            sortMethodShow: true,
          },
          {
            label: "Total",
            show: this.showCol("total"),
            icon: this.match.sortIcon("total"),
            value: "total",
            sortMethodShow: true,
            click: () => {
              this.match.sortMethod = "total";
            },
          },
        ],
      };
    },
    body(): iTableBody {
      return {
        classes: "align-middle text-center",
        rows: this.match.fullUnitList.map((unit: TeamMember) => {
          let bonuses = "";
          const leaderBonus = this.match.leaderSpeedBonus(unit, true);
          const uniqueBonus = this.match.uniqueSpeedBonus(unit, true);
          const otherBonus = this.match.speedBonusFromTeamMembers(unit, true);
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
                label: "Is Leader?",
                data: `<div class="d-inline ${
                  unit.isLeader ? "text-success" : ""
                }">
                  ${unit.isLeader ? "Yes" : "No"}
                  </div>`,
                type: "html",
              },
              {
                show: this.showCol("owner"),
                data: unit.ownerName,
                label: "Owner:",
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
                data: this.match.grandTotal(unit, true),
                label: "Grand Total:",
              },
            ],
          };
        }),
      };
    },
  },
  methods: {
    hasBonuses(unit: TeamMember): boolean {
      return (
        this.match.leaderSpeedBonus(unit, true) > 0 &&
        this.match.uniqueSpeedBonus(unit, true) > 0 &&
        this.match.speedBonusFromTeamMembers(unit, true) > 0
      );
    },
  },
});
</script>

<style lang="scss" scoped>
@import "styles/variables.scss";

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

.match-table-component {
  .game-modes {
    display: flex;
    justify-content: space-evenly;
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
</style>
