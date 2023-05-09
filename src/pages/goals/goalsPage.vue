<template>
  <div class="container swgoh-page">
    <ExpandableSection
      class="mb-2"
      title="Goal List"
      :idRef="storageKey"
      :options="expandOptions"
    >
      <SwgohTable :table="{ header, body }" />
    </ExpandableSection>
    <div class="mb-2">
      <template v-for="item in player.goalList" :key="item.id">
        <GoalsTable
          :goal="item"
          :storageKey="storageKey + item.id + 'Table'"
          :simpleView="true"
        />
      </template>
    </div>
  </div>
  <Modal :isOpen="showAddGoalModal">
    <template v-slot:header>Add New Goal</template>
    <template v-slot:body>
      <div class="input-group input-group-sm">
        <span class="input-group-text c-help energy-text">Name:</span>
        <input
          class="form-control refresh-input"
          type="text"
          v-model="newGoal.name"
        />
      </div>
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
          addGoal({ name: newGoal.name, list: newGoal.list });
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
import { mapState, mapActions } from "vuex";

import { setupSorting, sortValues } from "utils";
import { totalProgress } from "types/unit";
import { Goal } from "types/goals";
import GoalsTable from "components/shards/progress/goalsTable.vue";
import Modal from "components/general/modal.vue";
import { iTableBody, iTableHead } from "types/general";
import { iExpandOptions } from "types/general";

const storageKey = "goalListPage";

export default defineComponent({
  name: "GoalsPage",
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
  },
  data() {
    return {
      storageKey,
      showAddGoalModal: false,
      newGoal: new Goal({ name: "", list: [] }),
    } as any;
  },
  computed: {
    ...mapState("player", ["player"]),
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
                  name: "GoalDetails",
                  params: {
                    goalName: goal.name.replace(/\s/g, "").toLowerCase(),
                  },
                },
                value: goal.name,
                show: true,
              },
              {
                show: true,
                type: "progress",
                data: totalProgress(goal.list, "requirement"),
              },
            ],
          };
        }),
      };
    },
    filteredGoalList() {
      return this.player.goalList
        .filter((goal: Goal) => {
          const name = goal.name.toLowerCase().replace(/\s/g, "");
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
    ...mapActions("player", ["addGoal"]),
  },
});
</script>

<style lang="scss" scoped></style>
