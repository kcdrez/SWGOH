<template>
  <ExpandableSection
    :title="goal.name ?? goal.id"
    :idRef="storageKey"
    :options="expandOptions"
    class="mb-2"
  >
    <div class="total-progress-bar">
      <ProgressBar :percent="totalProgress(goal.list, 'requirement')" />
    </div>
    <SwgohTable :table="{ header, body }" />
  </ExpandableSection>
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
import { Ref, defineComponent, ref } from "vue";
import { mapActions } from "vuex";
import _ from "lodash";

import UnitSearch from "components/units/unitSearch.vue";
import Modal from "components/general/modal.vue";
import { getPercent, getUnit, totalProgress } from "types/unit";
import { Goal } from "types/goals";
import { setupColumnEvents, setupSorting, sortValues } from "utils";
import { iHeaderCell, iHeaderRow, iTableBody, iTableHead } from "types/general";
import { IPrerequisite, displayValue } from "types/shards";
import { iExpandOptions } from "types/general";

export default defineComponent({
  name: "GoalsTable",
  setup(props) {
    const { sortDir, sortMethod, sortBy, sortIcon } = setupSorting(
      props.storageKey
    );

    const selectedColumns: Ref<string[]> = ref([]);
    const { showCol } = setupColumnEvents(selectedColumns);

    return {
      sortDir,
      sortMethod,
      sortBy,
      sortIcon,
      selectedColumns,
      showCol,
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
      showAddUnitModal: false,
      deleteGoalModal: false,
    } as any;
  },
  computed: {
    sortedGoalList(): Goal[] {
      return this.goal.list.sort((a: IPrerequisite, b: IPrerequisite) => {
        if (this.sortMethod === "target") {
          const compareA = a.requirement?.value ?? 0;
          const compareB = b.requirement?.value ?? 0;

          return sortValues(compareA, compareB, this.sortDir, this.sortMethod);
        } else if (this.sortMethod === "percent") {
          return sortValues(
            getPercent(a, "recommended"),
            getPercent(b, "recommended"),
            this.sortDir,
            this.sortMethod
          );
        }
        return sortValues(a, b, this.sortDir, this.sortMethod);
      });
    },
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
            cells: [
              {
                label: "Unit Name",
                show: this.showCol("id"),
                sortMethodShow: true,
                icon: this.sortIcon("id"),
                value: "id",
                click: () => {
                  this.sortBy("id");
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
                show: this.showCol("percent"),
                sortMethodShow: true,
                icon: this.sortIcon("percent"),
                value: "progress",
                click: () => {
                  this.sortBy("percent");
                },
              },
              {
                label: "Actions",
                value: "actions",
                show: this.showCol("actions"),
              },
            ],
          },
        ],
      };
    },
    body(): iTableBody {
      return {
        classes: "align-middle text-center",
        rows: this.sortedGoalList.map((unit: IPrerequisite) => {
          return {
            cells: [
              {
                type: "unit",
                data: {
                  id: unit.id,
                  isLink: true,
                  hideImage: this.simpleView,
                },
                show: this.showCol("id"),
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
                show: this.showCol("percent"),
                type: "progress",
                data: getPercent(unit, "recommended"),
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
    cols(): iHeaderCell[] {
      return this.header.headers.reduce(
        (acc: iHeaderCell[], row: iHeaderRow) => {
          row.cells.forEach((cell) => acc.push(cell));
          return acc;
        },
        []
      );
    },
    expandOptions(): iExpandOptions {
      const options: iExpandOptions = {
        buttons: [],
        multiSelect: {
          options: this.cols,
          change: (newVal: string[]) => {
            this.selectedColumns = newVal;
          },
        },
        onShow: () => {
          const tableComponent = this.$refs[this.refName] as any;
          tableComponent?.refresh();
        },
      };

      if (this.goal.isEditing) {
        options.buttons?.push(
          ...[
            {
              classes: "fas fa-ban text-small mx-1",
              title: "Cancel Changes",
              click: () => {
                this.goal.isEditing = false;
              },
            },
            {
              classes: "fas fa-save text-small mx-1",
              title: "Save Changes",
              click: () => {
                this.goal.saveName();
              },
            },
          ]
        );
        options.input = {
          value: this.goal.tempName,
          change: (newVal: string) => {
            this.goal.tempName = newVal;
          },
          onEnter: () => {
            this.goal.saveName();
          },
        };
      } else {
        options.buttons?.push({
          classes: "fas fa-edit text-small mx-1",
          title: "Edit Name",
          click: () => {
            this.goal.isEditing = true;
          },
        });
      }

      options.buttons?.push(
        ...[
          {
            classes: "fas fa-plus text-small mx-1",
            title: "Add Unit",
            click: () => {
              this.showAddUnitModal = true;
            },
          },
          {
            classes: "fas fa-trash text-small mx-1",
            title: "Delete Goal",
            click: () => {
              this.deleteGoalModal = true;
            },
          },
        ]
      );

      return options;
    },
  },
  methods: {
    ...mapActions("player", ["removeGoal"]),
    totalProgress,
    getUnit,
  },
});
</script>

<style lang="scss" scoped>
@import "styles/variables.scss";

::v-deep(i.text-small) {
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
