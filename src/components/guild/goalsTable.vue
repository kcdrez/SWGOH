<template>
  <ExpandableSection
    :title="goal.name ?? goal.id"
    :idRef="storageKey"
    :options="expandOptions"
    class="mb-2"
  >
    <Loading
      :state="loading"
      message="Loading Guild's Unit Data"
      size="lg"
      displayText="Please wait...This may take a few minutes."
    >
      <SwgohTable :table="{ header, body }" />
    </Loading>
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
import { mapActions, mapGetters } from "vuex";
import _ from "lodash";

import UnitSearch from "components/units/unitSearch.vue";
import Modal from "components/general/modal.vue";
import { getPercent, getUnit, totalProgress } from "types/unit";
import { Goal } from "types/goals";
import { setupColumnEvents, setupSorting, sortValues } from "utils";
import {
  iHeaderCell,
  iHeaderRow,
  iTableBody,
  iTableCell,
  iTableHead,
  iTableRow,
} from "types/general";
import { IPrerequisite, IPrerequisiteItem } from "types/shards";
import { iExpandOptions } from "types/general";
import { loadingState } from "types/loading";

export default defineComponent({
  name: "GuildGoalsTable",
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
      loading: loadingState.initial,
      players: [],
    } as any;
  },
  computed: {
    ...mapGetters("unit", ["unitName"]),
    ...mapGetters("guild", ["guildId"]),
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
        } else if (this.sortMethod === "current") {
          const unitA = getUnit(a.id ?? "");
          const unitB = getUnit(b.id ?? "");
          if (
            a.requirement?.type === "Relic" &&
            b.requirement?.type === "Relic"
          ) {
            return sortValues(
              unitA?.relicLevel,
              unitB?.relicLevel,
              this.sortDir,
              this.sortMethod
            );
          } else if (a.requirement?.type === "Relic") {
            return sortValues(
              unitA?.relicLevel,
              0,
              this.sortDir,
              this.sortMethod
            );
          } else if (b.requirement?.type === "Relic") {
            return sortValues(
              0,
              unitB?.relicLevel,
              this.sortDir,
              this.sortMethod
            );
          } else if (
            a.requirement?.type === "Gear" &&
            b.requirement?.type === "Gear"
          ) {
            return sortValues(
              unitA?.gearLevel,
              unitB?.gearLevel,
              this.sortDir,
              this.sortMethod
            );
          } else {
            console.warn(
              "Unknown requirement type sorting",
              a.requirement?.type,
              b.requirement?.type
            );
          }
        }
        return sortValues(a, b, this.sortDir, this.sortMethod);
      });
    },
    header(): iTableHead {
      const getColSpan = () => {
        return [
          this.showCol("stars"),
          this.showCol("relic"),
          this.showCol("gear"),
        ]
          .filter((x) => !!x)
          .length.toString();
      };

      const unitHeaders: iHeaderCell[] = this.goal.list.map(
        (unit: IPrerequisite) => {
          return {
            label: this.unitName(unit.id)?.name ?? unit.id,
            show:
              this.showCol("stars") ||
              this.showCol("relic") ||
              this.showCol("gear"),
            colspan: getColSpan(),
          };
        },
        []
      );
      const headerCells: iHeaderCell[] = this.goal.list.reduce(
        (acc: iHeaderCell[], unit: IPrerequisite) => {
          acc.push({
            label: "Stars",
            show: this.showCol("stars"),
            icon: this.sortIcon("stars-" + unit.id),
            value: "stars",
            click: () => {
              this.sortBy("stars-" + unit.id);
            },
          });
          acc.push({
            label: "Gear Level",
            show: this.showCol("gear"),
            icon: this.sortIcon("gear-" + unit.id),
            value: "gear",
            click: () => {
              this.sortBy("gear-" + unit.id);
            },
          });
          acc.push({
            label: "Relic Level",
            show: this.showCol("relic"),
            icon: this.sortIcon("relic-" + unit.id),
            value: "relic",
            click: () => {
              this.sortBy("relic-" + unit.id);
            },
          });
          return acc;
        },
        []
      );

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
                label: "Player Name",
                show: this.showCol("player"),
                icon: this.sortIcon("player"),
                value: "player",
                click: () => {
                  this.sortBy("player");
                },
                rowspan: "2",
              },
              ...unitHeaders,
            ],
          },
          {
            cells: [...headerCells],
          },
        ],
      };
    },
    body(): iTableBody {
      const rows: iTableRow[] = this.players.map((player) => {
        const unitCells: iTableCell[] = this.goal.list.reduce(
          (acc: iTableCell[], unit: any) => {
            const match = player.units.find((u) => u.base_id === unit.id);
            const relicLevel = match?.relic_tier > 0 ? match?.relic_tier : 0;

            acc.push({
              show: this.showCol("stars"),
              type: "unitLevel",
              data: {
                classes: "justify-content-center",
                type: "Stars",
                value: match?.stars ?? 0,
              },
            });
            acc.push({
              show: this.showCol("gear"),
              type: "unitLevel",
              data: {
                classes: "justify-content-center",
                type: "Gear",
                value: match?.gear_level ?? 0,
              },
            });
            acc.push({
              show: this.showCol("relic"),
              type: "unitLevel",
              data: {
                classes: "justify-content-center",
                type: "Relic",
                value: relicLevel,
                unitId: unit.id,
              },
            });
            return acc;
          },
          []
        );
        return {
          cells: [
            {
              label: "Player",
              show: this.showCol("player"),
              data: player.name,
            },
            ...unitCells,
          ],
        };
      });

      return {
        classes: "align-middle text-center",
        rows,
      };
    },
    cols(): iHeaderCell[] {
      return this.header.headers.reduce(
        (acc: iHeaderCell[], row: iHeaderRow) => {
          row.cells.forEach((cell) => {
            if (acc.every((x) => x.value !== cell.value)) {
              acc.push(cell);
            }
          });
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
    ...mapActions("guild", ["fetchGuildUnitData"]),
    totalProgress,
    getUnit,
  },
  async created() {
    this.loading = loadingState.loading;
    this.players = await this.fetchGuildUnitData({
      unitId: this.goal.list.map((x) => x.id),
    });
    this.loading = loadingState.ready;
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
