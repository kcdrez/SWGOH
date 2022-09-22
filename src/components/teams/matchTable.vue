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
      :options="cols"
      storageKey="matchTable"
      label="Show/Hide Columns"
      @checked="selectedColumns = $event"
    />
    <table
      class="table table-bordered table-dark table-sm table-striped swgoh-table"
    >
      <thead>
        <tr class="text-center align-middle">
          <th v-if="showCol('name')">
            <div class="c-pointer" @click="sortBy('name')">
              Name
              <i class="fas mx-1" :class="sortIcon('name')"></i>
            </div>
          </th>
          <th v-if="showCol('leader')">
            <div class="c-pointer" @click="sortBy('leader')">
              Is Leader?
              <i class="fas mx-1" :class="sortIcon('leader')"></i>
            </div>
          </th>
          <th v-if="showCol('owner')">Owner</th>
          <th v-if="showCol('subTotal')">
            <div class="c-pointer" @click="sortBy('subtotal')">
              Sub Total
              <i class="fas mx-1" :class="sortIcon('subtotal')"></i>
            </div>
          </th>
          <th v-if="showCol('bonuses')">Bonuses</th>
          <th v-if="showCol('total')">
            <div class="c-pointer" @click="sortBy('total')">
              Total
              <i class="fas mx-1" :class="sortIcon('total')"></i>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="unit in match.fullUnitList"
          :key="unit.id"
          class="text-center align-middle"
        >
          <td v-if="showCol('name')">
            <router-link
              :to="{
                name: 'UnitPage',
                params: { unitId: unit.id },
              }"
              >{{ unit.name }}</router-link
            >
          </td>
          <td v-if="showCol('leader')" class="text-center">
            <span class="row-label mx-1">Is Leader?</span>
            <div :class="{ 'text-success': unit.isLeader }" class="d-inline">
              {{ unit.isLeader ? "Yes" : "No" }}
            </div>
          </td>
          <td v-if="showCol('owner')">
            <span class="row-label">Owner: </span>
            {{ unit.owner }}
          </td>
          <td v-if="showCol('subTotal')">
            <span class="row-label">Subtotal:</span>
            {{ unit.speed }}
          </td>
          <td
            v-if="showCol('bonuses')"
            :class="{ 'hide-sm': !hasBonuses(unit) }"
          >
            <span class="row-label">Bonuses:</span>
            <div v-if="match.leaderSpeedBonus(unit, true) > 0">
              Leader Bonus:
              {{ match.leaderSpeedBonus(unit, true) }}
            </div>
            <div v-if="match.uniqueSpeedBonus(unit, true) > 0">
              Unique Bonus:
              {{ match.uniqueSpeedBonus(unit, true) }}
            </div>
            <div v-if="match.speedBonusFromTeamMembers(unit, true) > 0">
              Other Bonuses:
              {{ match.speedBonusFromTeamMembers(unit, true) }}
            </div>
          </td>
          <td v-if="showCol('total')">
            <span class="row-label">Grand Total:</span>
            {{ match.grandTotal(unit, true) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import { Match, SortType, TeamMember } from "types/teams";
import MultiSelect from "components/multiSelect.vue";
import ModIcon from "components/units/modIcon.vue";
import { setupSorting } from "utils";

type dataModel = {
  selectedColumns: string[];
};

const storageKey = "matchTable";

export default defineComponent({
  name: "MatchTable",
  setup() {
    const { sortDir, sortMethod, searchText, sortBy, sortIcon } =
      setupSorting(storageKey);

    return {
      sortDir,
      sortMethod,
      searchText,
      sortBy,
      sortIcon,
    };
  },
  components: { MultiSelect, ModIcon },
  props: {
    match: {
      required: true,
      type: Object as PropType<Match>,
    },
  },
  data() {
    return {
      selectedColumns: [],
    } as dataModel;
  },
  computed: {
    cols(): { text: string; value: any }[] {
      const list = [
        {
          text: "Name",
          value: "name",
        },
        {
          text: "Is Leader",
          value: "leader",
        },
        {
          text: "Owner",
          value: "owner",
        },
        {
          text: "Sub Total",
          value: "subTotal",
        },
        {
          text: "Bonuses",
          value: "bonuses",
        },
        {
          text: "Total",
          value: "total",
        },
        {
          text: "Actions",
          value: "actions",
        },
      ];
      return list;
    },
  },
  methods: {
    showCol(key: string): boolean {
      return this.selectedColumns.some((x) => x === key);
    },
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
