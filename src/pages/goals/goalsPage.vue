<template>
  <div class="container swgoh-page">
    <div class="mb-2">
      <div
        class="collapse-header section-header align-items-center d-flex justify-content-center"
      >
        <h3 data-bs-toggle="collapse" :href="`#${storageKey}`">Goal List</h3>
        <i
          class="fas fa-plus text-small mx-1"
          title="Add Goal"
          @click="showAddGoalModal = true"
        ></i>
      </div>
      <div :id="`${storageKey}`" class="collapse" :ref="`${storageKey}`">
        <table
          class="table table-bordered table-dark table-sm table-striped swgoh-table"
        >
          <thead>
            <tr class="text-center align-middle">
              <th>
                <span>Goal Name</span>
              </th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in player.goalList" :key="item.id">
              <td class="align-middle text-center">
                <router-link
                  :to="{
                    name: 'GoalDetails',
                    params: {
                      goalName: item.name.replace(/\s/g, '').toLowerCase(),
                    },
                  }"
                  >{{ item.name }}</router-link
                >
              </td>
              <td class="align-middle text-center">
                <ProgressBar
                  :percent="totalProgress(item.list, 'requirement')"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
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

import { setupEvents } from "utils";
import { totalProgress } from "types/unit";
import { Goal } from "types/goals";
import GoalsTable from "components/shards/progress/goalsTable.vue";
import Modal from "components/modal.vue";

const storageKey = "goalListPage";

export default defineComponent({
  name: "GoalsPage",
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
  },
  methods: {
    ...mapActions("player", ["addGoal"]),
    totalProgress,
  },
  mounted() {
    setupEvents(this.$refs[`${storageKey}`] as HTMLElement, `${storageKey}`);
  },
});
</script>

<style lang="scss" scoped>
@import "styles/variables.scss";
.section-header {
  z-index: 1;

  i {
    cursor: pointer;

    &:hover {
      transform: scale(1.5);

      &.fa-plus {
        color: $primary;
      }
    }
  }
}
</style>
