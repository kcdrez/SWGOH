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
        :options="header.headers"
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
      <TableHeader :header="header" />
      <TableBody :body="body" />
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
import Modal from "components/general/modal.vue";
import { getPercent, getUnit, totalProgress } from "types/unit";
import { Goal } from "types/goals";
import { setupEvents, setupSorting } from "utils";
import { iTableBody, iTableHead } from "types/general";
import { IPrerequisite } from "types/shards";

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
    header(): iTableHead {
      return {
        classes: "sticky-header show-on-mobile",
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
            label: "Unit Name",
            show: this.showCol("name"),
            sortMethodShow: true,
            icon: this.sortIcon("name"),
            value: "name",
            click: () => {
              this.sortBy("name");
            },
          },
          {
            label: "Current Level",
            show: this.showCol("current"),
            sortMethodShow: true,
            icon: this.sortIcon("current"),
            value: "current",
            click: () => {
              this.sortBy("current");
            },
          },
          {
            label: "Target Level",
            show: this.showCol("target"),
            sortMethodShow: true,
            icon: this.sortIcon("target"),
            value: "target",
            click: () => {
              this.sortBy("target");
            },
          },
          {
            label: "Progress",
            show: this.showCol("progress"),
            sortMethodShow: true,
            icon: this.sortIcon("progress"),
            value: "progress",
            click: () => {
              this.sortBy("progress");
            },
          },
          {
            label: "Actions",
            value: "actions",
            show: this.showCol("actions"),
          },
        ],
      };
    },
    body(): iTableBody {
      return {
        classes: "align-middle text-center",
        rows: this.goal.list.map((unit: IPrerequisite) => {
          return {
            cells: [
              {
                type: "unit",
                data: {
                  id: unit.id,
                  isLink: true,
                  hideImage: this.simpleView,
                },
                show: this.showCol("name"),
              },
              {
                show: this.showCol("current"),
                label: "Current Level:",
                type: "unitLevel",
                data: {
                  classes: "justify-content-center",
                  type: unit.requirement?.type,
                  unitId: unit.id,
                },
              },
              {
                show: this.showCol("target"),
                label: "Target Level:",
                type: "unitLevel",
                data: {
                  classes: "d-flex justify-content-center",
                  type: unit.requirement?.type,
                  unitId: unit.id,
                  value: unit.requirement?.value,
                },
              },
              {
                show: this.showCol("progress"),
                type: "progress",
                data: this.getPercent(unit, "recommended"),
              },
              {
                show: this.showCol("actions"),
                type: "buttons",
                data: {
                  buttons: [
                    {
                      click: () => {
                        this.goal.remove(unit.id);
                      },
                      icon: "fas fa-trash",
                      classes: "btn btn-danger",
                    },
                  ],
                },
              },
            ],
          };
        }),
      };
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
