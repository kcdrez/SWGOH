<template>
  <div class="container swgoh-page">
    <ExpandableSection
      class="mb-2"
      title="Goals Overview"
      :idRef="storageKey"
      :options="expandOptions"
    >
      <SwgohTable :table="{ header, body }" />
    </ExpandableSection>
  </div>
  <Modal :isOpen="showAddGoalModal">
    <template v-slot:header>Add New Goal</template>
    <template v-slot:body>
      <div class="input-group input-group-sm mb-2">
        <span class="input-group-text c-help energy-text">Name:</span>
        <input
          class="form-control refresh-input"
          type="text"
          v-model="newGoal.name"
        />
      </div>
      <div class="input-group input-group-sm">
        <UnitSearch
          @select="unitDetails.unit = $event"
          placeholder="Add Unit"
        />
        <select class="form-control" v-model="unitDetails.type">
          <option value="Relic">Relic</option>
          <option value="Gear">Gear</option>
          <option value="Stars">Stars</option>
          <option value="Power">Power</option>
        </select>
        <input
          class="form-control"
          type="number"
          v-model.number="unitDetails.value"
          min="1"
        />
        <button class="btn btn-primary" type="button" @click="addUnitToGoal">
          Add
        </button>
      </div>
      <ul class="mx-0 mt-2 mb-0">
        <li
          v-for="unit in newGoal.list"
          :key="unit.id"
          class="unit-list-item"
          title="Remove this unit"
          @click="newGoal.remove(unit.id)"
        >
          <i class="fa fa-times-circle me-2"></i>
          <span>
            {{ unitName(unit.id) }}
            ({{ unit.requirement.type }} {{ unit.requirement.value }})
          </span>
        </li>
      </ul>
    </template>
    <template v-slot:footer>
      <button
        type="button"
        class="btn btn-secondary"
        data-bs-dismiss="modal"
        @click="showAddGoalModal = false"
      >
        Close
      </button>
      <button
        type="button"
        class="btn btn-primary"
        @click="
          addGoal(newGoal);
          showAddGoalModal = false;
        "
        :disabled="!newGoal.name"
      >
        Add
      </button>
    </template>
  </Modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapActions, mapGetters } from "vuex";

import { round2Decimals, setupSorting, sortValues } from "utils";
import { totalProgress } from "types/unit";
import { Goal, iGoalPlayer } from "types/goals";
import GoalsTable from "components/shards/progress/goalsTable.vue";
import Modal from "components/general/modal.vue";
import { iTableBody, iTableHead } from "types/general";
import { iExpandOptions } from "types/general";
import UnitSearch from "components/units/unitSearch.vue";
import { loadingState } from "types/loading";

const storageKey = "guildGoalListPage";

export default defineComponent({
  name: "GuildGoalsPage",
  setup() {
    const { sortDir, sortMethod, sortBy, sortIcon, searchText } =
      setupSorting(storageKey);

    return {
      sortDir,
      sortMethod,
      sortBy,
      sortIcon,
      searchText,
    };
  },
  components: {
    GoalsTable,
    Modal,
    UnitSearch,
  },
  data() {
    return {
      storageKey,
      showAddGoalModal: false,
      newGoal: new Goal({ name: "", list: [] }, "guild"),
      unitDetails: {
        unit: null,
        type: "Relic",
        value: 1,
      },
      loading: loadingState.initial,
      players: [],
    } as any;
  },
  computed: {
    ...mapState("guild", ["goals"]),
    ...mapGetters("unit", ["unitName"]),
    header(): iTableHead {
      return {
        classes: "show-on-mobile",
        sortMethod: this.sortMethod,
        sortDir: this.sortDir,
        methodChange: (val: string) => {
          this.sortMethod = val;
        },
        directionChange: (val: "asc" | "desc") => {
          this.sortDir = val;
        },
        headers: [
          {
            cells: [
              {
                label: "Goal Name",
                show: true,
                sortMethodShow: true,
                icon: this.sortIcon("name"),
                input: {
                  type: "input",
                  classes: "mx-auto my-1 w-75",
                  placeholder: "Search by Name",
                  label: "Search",
                  value: this.searchText,
                  change: (val: string) => {
                    this.searchText = val;
                  },
                  click: () => {
                    this.sortBy("name");
                  },
                },
              },
              {
                label: "Progress",
                show: true,
                sortMethodShow: true,
                icon: this.sortIcon("totalProgress"),
                click: () => {
                  this.sortBy("totalProgress");
                },
              },
            ],
          },
        ],
      };
    },
    body(): iTableBody {
      return {
        classes: "align-middle text-center",
        rows: this.filteredGoalList.map((goal: Goal) => {
          return {
            cells: [
              {
                type: "link",
                data: {
                  name: "GuildGoalDetails",
                  params: {
                    goalName: goal.name.replace(/\s/g, "").toLowerCase(),
                  },
                },
                value: goal.name,
                show: true,
              },
              {
                show: this.loading !== loadingState.ready,
                type: "loading",
              },
              {
                show: this.loading === loadingState.ready,
                type: "progress",
                data: this.getTotalProgressForGoal(goal),
              },
            ],
          };
        }),
      };
    },
    filteredGoalList(): Goal[] {
      return this.goals
        .filter((goal: Goal) => {
          const name = goal?.name.toLowerCase().replace(/\s/g, "");
          const compare = this.searchText.toLowerCase().replace(/\s/g, "");
          return name.includes(compare);
        })
        .sort((a: Goal, b: Goal) => {
          if (this.sortMethod === "totalProgress") {
            return sortValues(
              totalProgress(a.list, "recommended"),
              totalProgress(b.list, "recommended"),
              this.sortDir,
              this.sortMethod
            );
          }
          return sortValues(a, b, this.sortDir, this.sortMethod);
        });
    },
    expandOptions(): iExpandOptions {
      return {
        buttons: [
          {
            classes: "fas fa-plus text-small mx-1 c-pointer",
            title: "Add Goal",
            click: () => {
              this.showAddGoalModal = true;
            },
          },
        ],
      };
    },
  },
  methods: {
    ...mapActions("guild", ["addGoal"]),
    ...mapActions("guild", ["fetchGuildUnitData"]),
    addUnitToGoal() {
      const { unit, type, value } = this.unitDetails;
      if (unit) {
        this.newGoal.addUnit(unit.id, type, value);
      }
    },
    getTotalProgressForGoal(goal: Goal): number {
      return round2Decimals(
        this.players.reduce((total: number, player: iGoalPlayer) => {
          const progress = totalProgress(
            goal.list,
            "requirement",
            player.units
          );
          total += progress;
          return total;
        }, 0) / this.players.length
      );
    },
  },
  async created() {
    this.loading = loadingState.loading;
    const unitIds = this.goals.reduce((acc: string[], goal: Goal) => {
      goal.list.forEach((unit) => {
        if (unit.id) {
          acc.push(unit.id);
        }
      });
      return acc;
    }, []);
    this.players = await this.fetchGuildUnitData({
      unitId: unitIds,
    });
    this.loading = loadingState.ready;
  },
});
</script>

<style lang="scss" scoped>
@import "styles/variables.scss";

.unit-list-item {
  cursor: pointer;
  list-style-type: none;

  &:hover {
    color: $danger-text-dark;
  }
}
</style>
