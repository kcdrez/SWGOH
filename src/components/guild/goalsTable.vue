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
  <Modal :isOpen="editUnitModal.show">
    <template v-slot:header
      >Edit Unit ({{ unitName(editUnitModal.target.id) }})</template
    >
    <template v-slot:body>
      <div class="input-group input-group-sm mb-1">
        <span class="input-group-text">Target Type:</span>
        <select class="form-control" v-model="editUnitModal.target.type">
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
          v-model.number="editUnitModal.target.value"
          min="1"
        />
      </div>
    </template>
    <template v-slot:footer>
      <button
        type="button"
        class="btn btn-secondary"
        data-bs-dismiss="modal"
        @click="editUnitModal.show = false"
      >
        Close
      </button>
      <button
        type="button"
        class="btn btn-primary"
        @click="
          goal.editUnit(
            editUnitModal.target.id,
            editUnitModal.target.type,
            editUnitModal.target.value
          );
          editUnitModal.show = false;
        "
      >
        Save
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
import { mapActions, mapGetters, mapState } from "vuex";
import _ from "lodash";

import UnitSearch from "components/units/unitSearch.vue";
import Modal from "components/general/modal.vue";
import { getPercent, getUnit, totalProgress } from "types/unit";
import { Goal, iGoalPlayer } from "types/goals";
import { setupColumnEvents, setupSorting, sortValues } from "utils";
import {
  iHeaderCell,
  iTableBody,
  iTableCell,
  iTableHead,
  iTableRow,
} from "types/general";
import { IPrerequisite } from "types/shards";
import { iExpandOptions } from "types/general";
import { loadingState } from "types/loading";

export default defineComponent({
  name: "GuildGoalsTable",
  setup(props) {
    const { sortDir, sortMethod, sortBy, sortIcon, searchText } = setupSorting(
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
      searchText,
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
      editUnitModal: {
        show: false,
        target: {
          type: "Relic",
          value: 1,
          id: null,
        },
      },
      loading: loadingState.initial,
      players: [],
    } as any;
  },
  computed: {
    ...mapGetters("unit", ["unitName"]),
    ...mapState("guild", ["guildId"]),
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
          this.showCol("relic_tier"),
          this.showCol("gear_level"),
        ]
          .filter((x) => !!x)
          .length.toString();
      };

      const unitHeaders: iHeaderCell[] = this.goal.list.map(
        (unit: IPrerequisite) => {
          return {
            label: this.unitName(unit.id),
            input: {
              type: "link",
            },
            data: {
              name: "GuildUnitsPage",
              params: { guildId: this.guildId },
              query: { unitId: unit.id },
            },
            show:
              this.showCol("stars") ||
              this.showCol("relic") ||
              this.showCol("gear"),
            colspan: getColSpan(),
            containerClass: "d-flex justify-content-center",
            buttons: [
              {
                classes: "fas fa-trash text-small mx-1",
                title: "Remove Unit",
                click: () => {
                  this.goal.remove(unit.id);
                },
              },
              {
                classes: "fas fa-edit text-small mx-1",
                title: "Edit Unit",
                click: () => {
                  this.editUnitModal.target.id = unit.id;
                  this.editUnitModal.target.value = unit.requirement?.value;
                  this.editUnitModal.target.type = unit.requirement?.type;
                  this.editUnitModal.show = true;
                },
              },
            ],
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
            click: () => {
              this.sortBy("stars-" + unit.id);
            },
          });
          acc.push({
            label: "Gear Level",
            show: this.showCol("gear_level"),
            icon: this.sortIcon("gear_level" + unit.id),
            click: () => {
              this.sortBy("gear_level-" + unit.id);
            },
          });
          acc.push({
            label: "Relic Level",
            show: this.showCol("relic_tier"),
            icon: this.sortIcon("relic_tier-" + unit.id),
            click: () => {
              this.sortBy("relic_tier-" + unit.id);
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
                click: () => {
                  this.sortBy("player");
                },
                rowspan: "2",
                input: {
                  type: "input",
                  classes: "mx-auto my-1 w-75",
                  placeholder: "Search by Player",
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
              ...unitHeaders,
              {
                label: "Progress",
                show: this.showCol("progress"),
                sortMethodShow: true,
                icon: this.sortIcon("progress"),
                click: () => {
                  this.sortBy("progress");
                },
                rowspan: "2",
              },
            ],
          },
          {
            cells: [...headerCells],
          },
        ],
      };
    },
    body(): iTableBody {
      const rows: iTableRow[] = this.filteredPlayers.map(
        (player: iGoalPlayer) => {
          const unitCells: iTableCell[] = this.goal.list.reduce(
            (acc: iTableCell[], unit: IPrerequisite) => {
              const match = player.units.find((u) => u.base_id === unit.id);

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
                show: this.showCol("gear_level"),
                type: "unitLevel",
                data: {
                  classes: "justify-content-center",
                  type: "Gear",
                  value: match?.gear_level ?? 0,
                },
              });
              acc.push({
                show: this.showCol("relic_tier"),
                type: "unitLevel",
                data: {
                  classes: "justify-content-center",
                  type: "Relic",
                  value: match?.relic_tier ?? -1,
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
              {
                show: this.showCol("progress"),
                type: "progress",
                data: totalProgress(
                  this.goal.list,
                  "requirement",
                  player.units
                ),
              },
            ],
          };
        }
      );

      return {
        classes: "align-middle text-center",
        rows,
      };
    },
    cols(): iHeaderCell[] {
      return [
        {
          label: "Player",
          value: "player",
        },
        {
          label: "Stars",
          value: "stars",
        },
        {
          label: "Gear Level",
          value: "gear_level",
        },
        {
          label: "Relic Level",
          value: "relic_tier",
        },
        {
          label: "Progress",
          value: "progress",
        },
      ];
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
    filteredPlayers(): iGoalPlayer[] {
      return this.players
        .filter((player: iGoalPlayer) => {
          const name = player.name.toLowerCase().replace(/\s/g, "");
          const compare = this.searchText.toLowerCase().replace(/\s/g, "");
          return name.includes(compare);
        })
        .sort((a: iGoalPlayer, b: iGoalPlayer) => {
          if (this.sortMethod === "player") {
            return sortValues(a.name, b.name, this.sortDir, this.sortMethod);
          } else if (this.sortMethod === "progress") {
            const progressA = totalProgress(
              this.goal.list,
              "recommended",
              a.units
            );
            const progressB = totalProgress(
              this.goal.list,
              "recommended",
              b.units
            );
            return sortValues(
              progressA,
              progressB,
              this.sortDir,
              this.sortMethod
            );
          } else {
            const [method, unitId] = this.sortMethod.split("-");

            const matchA = a.units.find((x) => x.base_id === unitId);
            const matchB = b.units.find((x) => x.base_id === unitId);

            const valueA = matchA ? matchA[method] : 0;
            const valueB = matchB ? matchB[method] : 0;

            return sortValues(valueA, valueB, this.sortDir, this.sortMethod);
          }
        });
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
</style>
