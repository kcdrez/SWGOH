<template>
  <div
    class="section-header collapse-header extended-1 align-items-center d-flex justify-content-center"
  >
    <h3
      data-bs-toggle="collapse"
      :href="`#${storageKey}`"
      v-if="!goal.isEditing"
    >
      {{ goal.name ?? goal.id }}
    </h3>
    <div class="align-items-center d-flex justify-content-center">
      <template v-if="goal.isEditing">
        <input
          type="text"
          v-model="goal.tempName"
          @keypress.enter="goal.saveName()"
          class="form-control form-control-sm"
        />
        <i
          class="fas fa-ban text-small mx-1"
          title="Cancel Changes"
          @click="goal.isEditing = false"
        ></i>
        <i
          class="fas fa-save text-small mx-1"
          title="Save Changes"
          @click="goal.saveName()"
        ></i>
      </template>
      <template v-else>
        <i
          class="fas fa-edit text-small mx-1"
          title="Edit Name"
          @click="goal.isEditing = true"
        ></i>
      </template>
      <i
        class="fas fa-plus text-small mx-1"
        title="Add Unit"
        @click="showAddUnitModal = true"
      ></i>
      <i
        class="fas fa-trash text-small mx-1"
        title="Delete Goal"
        @click="deleteGoalModal = true"
      ></i>
    </div>
    <div class="toggles-container">
      <MultiSelect
        class="select-columns"
        :options="cols"
        :storageKey="storageKey + 'Columns'"
        @checked="selectedColumns = $event"
      />
    </div>
  </div>
  <div :id="`${storageKey}`" :ref="`${storageKey}`" class="collapse">
    <div class="total-progress-bar">
      <ProgressBar :percent="totalProgress(goal.list, 'requirement')" />
    </div>
    <table
      class="table table-bordered table-dark table-sm table-striped swgoh-table"
    >
      <thead class="sticky-header show-on-mobile">
        <tr class="text-center align-middle">
          <th v-if="showCol('name')">
            <div class="c-pointer" @click="sortBy('name')">
              <span>Unit Name</span>
              <i class="fas mx-2" :class="sortIcon('name')"></i>
            </div>
            <!-- <input
              class="form-control form-control-sm mx-auto my-1 w-75"
              placeholder="Search"
              v-model="searchText"
            /> -->
          </th>
          <th
            v-if="showCol('current')"
            @click="sortBy('current')"
            class="c-pointer"
          >
            <span>Current Level</span>
            <i class="fas mx-2" :class="sortIcon('current')"></i>
          </th>
          <th
            v-if="showCol('target')"
            @click="sortBy('target')"
            class="c-pointer"
          >
            <span>Target Level</span>
            <i class="fas mx-2" :class="sortIcon('target')"></i>
          </th>
          <th
            v-if="showCol('progress')"
            @click="sortBy('progress')"
            class="c-pointer"
          >
            <span>Progress</span>
            <i class="fas mx-2" :class="sortIcon('progress')"></i>
          </th>
          <th v-if="showCol('actions')">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in goal.list"
          :key="goal.id"
          class="text-center align-middle"
        >
          <td v-if="showCol('name')">
            <UnitIcon :unit="getUnit(item.id)" isLink :hideImage="simpleView" />
          </td>
          <td v-if="showCol('current')">
            <span class="row-label">Current Level:</span>
            <RequirementIcon
              class="justify-content-center"
              :type="item.requirement?.type"
              :unitId="item.id"
              currentLevel
            />
          </td>
          <td v-if="showCol('target')">
            <span class="row-label">Target Level:</span>
            <RequirementIcon
              class="justify-content-center"
              :value="item.requirement?.value"
              :type="item.requirement?.type"
              :unitId="item.id"
            />
          </td>
          <td v-if="showCol('progress')">
            <ProgressBar :percent="getPercent(item, 'recommended')" />
          </td>
          <td v-if="showCol('actions')">
            <div class="btn-group btn-group-sm text-center" role="group">
              <button class="btn btn-danger" @click="goal.remove(item.id)">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <Modal :isOpen="showAddUnitModal">
    <template v-slot:header>Add New Unit</template>
    <template v-slot:body>
      <div class="input-group input-group-sm mb-1">
        <span class="input-group-text">Unit Name:</span>
        <UnitSearch @select="searchUnit = $event" placeholder="Find Unit" />
      </div>
      <div class="input-group input-group-sm mb-1">
        <span class="input-group-text">Target Type:</span>
        <select class="form-control" v-model="targetType">
          <option value="Relic">Relic</option>
          <option value="Gear">Gear</option>
          <option value="Stars">Stars</option>
          <option value="Power">Power</option>
        </select>
      </div>
      <div class="input-group input-group-sm">
        <span class="input-group-text">Target Value:</span>
        <input
          class="form-control"
          type="number"
          v-model.number="targetValue"
          min="1"
        />
      </div>
    </template>
    <template v-slot:footer>
      <button
        type="button"
        class="btn btn-secondary"
        data-bs-dismiss="modal"
        @click="showAddUnitModal = false"
      >
        Close
      </button>
      <button
        type="button"
        class="btn btn-primary"
        @click="
          goal.addUnit(searchUnit.id, targetType, targetValue);
          showAddUnitModal = false;
        "
        :disabled="!searchUnit || !targetType || !targetValue"
      >
        Add
      </button>
    </template>
  </Modal>
  <Confirm
    :isOpen="deleteGoalModal"
    title="Are you sure?"
    :text="`Are you sure you want to delete this Goal?`"
    @confirm="
      deleteGoalModal = false;
      removeGoal(goal.id);
    "
    @cancel="deleteGoalModal = false"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions } from "vuex";
import _ from "lodash";

import UnitSearch from "components/units/unitSearch.vue";
import RequirementIcon from "components/shards/tables/legendary/requirementIcon.vue";
import UnitIcon from "components/units/unitIcon.vue";
import Modal from "components/modal.vue";
import { getPercent, getUnit, totalProgress } from "types/unit";
import { Goal } from "types/goals";
import { setupEvents, setupSorting } from "utils";

export default defineComponent({
  name: "GoalsTable",
  setup(props) {
    const { sortDir, sortMethod, searchText, sortBy, sortIcon } = setupSorting(
      props.storageKey
    );

    return {
      sortDir,
      sortMethod,
      searchText,
      sortBy,
      sortIcon,
    };
  },
  components: {
    UnitSearch,
    RequirementIcon,
    UnitIcon,
    Modal,
  },
  props: {
    goal: {
      type: Object as () => Goal,
      required: true,
    },
    simpleView: {
      type: Boolean,
      default: false,
    },
    storageKey: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      searchUnit: null,
      targetType: "Relic",
      targetValue: 1,
      selectedColumns: [],
      showAddUnitModal: false,
      deleteGoalModal: false,
    } as any;
  },
  computed: {
    cols() {
      return [
        {
          text: "Name",
          value: "name",
        },
        {
          text: "Current Level",
          value: "current",
        },
        {
          text: "Target Level",
          value: "target",
        },
        {
          text: "Progress",
          value: "progress",
        },
        {
          text: "Actions",
          value: "actions",
        },
      ];
    },
  },
  methods: {
    ...mapActions("player", ["removeGoal"]),
    totalProgress,
    getUnit,
    getPercent,
    showCol(key: string): boolean {
      return this.selectedColumns.some((x: string) => x === key);
    },
  },
  mounted() {
    setupEvents(
      this.$refs[`${this.storageKey}`] as HTMLElement,
      `${this.storageKey}`
    );
  },
});
</script>

<style lang="scss" scoped>
@import "styles/variables.scss";

.sticky-header {
  top: 105px;
}

.section-header {
  input {
    max-width: 200px;
  }

  i {
    cursor: pointer;

    &:hover {
      transform: scale(1.5);

      &.fa-edit,
      &.fa-plus {
        color: $primary;
      }
      &.fa-ban {
        color: $warning;
      }
      &.fa-save {
        color: $success;
      }
      &.fa-trash {
        color: $danger;
      }
    }
  }
}
.total-progress-bar {
  display: flex;
  margin: 0.5rem;
  justify-content: center;

  .progress {
    flex-basis: 33.33%;

    @media only screen and (max-width: 768px) {
      flex-basis: 100%;
    }
  }
}
</style>
