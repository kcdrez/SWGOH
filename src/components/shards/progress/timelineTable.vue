<template>
  <ExpandableSection
    title="Timeline Planner"
    :idRef="storageKey"
    :options="expandOptions"
    class="my-2"
  >
    <SwgohTable :table="{ header, body }" />
  </ExpandableSection>
  <Modal :isOpen="showEditModal">
    <template v-slot:header>Edit Goal Settings</template>
    <template v-slot:body>
      <div class="input-group input-group-sm mb-2">
        <span class="input-group-text">Estimated Completion Date:</span>
        <span class="input-group-text form-control"
          >{{ daysFromNow(daysRemaining) }} ({{ daysRemaining }} days)</span
        >
      </div>
      <hr />
      <div class="input-group input-group-sm mb-2">
        <span class="input-group-text">Start Date:</span>
        <input
          class="form-control"
          type="date"
          v-model="editSettings.startDate"
        />
      </div>
      <div class="input-group input-group-sm mb-2">
        <span class="input-group-text">Start Percent:</span>
        <input
          class="form-control"
          type="number"
          v-model.number="editSettings.startPercent"
          min="0"
          max="100"
        />
      </div>
      <div class="input-group input-group-sm">
        <span
          class="input-group-text c-help"
          title="The number of Assault Battles you can complete challenge level 3 on consistently"
          >Assault Battles (CT3):</span
        >
        <input
          class="form-control"
          type="number"
          v-model.number="editSettings.assaultBattles"
          min="0"
          max="6"
        />
      </div>
    </template>
    <template v-slot:footer>
      <button
        type="button"
        class="btn btn-secondary"
        data-bs-dismiss="modal"
        @click="showEditModal = false"
      >
        Close
      </button>
      <button
        type="button"
        class="btn btn-primary"
        @click="save()"
        :disabled="!editSettings.startDate || editSettings.startPercent < 0"
      >
        Save
      </button>
    </template>
  </Modal>
</template>

<script lang="ts">
import { Ref, defineComponent, ref } from "vue";
import { mapActions } from "vuex";
import _ from "lodash";
import moment from "moment";

import UnitSearch from "components/units/unitSearch.vue";
import Modal from "components/general/modal.vue";
import { Unit, getPercent, getUnit, totalProgress } from "types/unit";
import { Goal } from "types/goals";
import {
  daysFromNow,
  setupColumnEvents,
  setupSorting,
  sortValues,
} from "utils";
import { iHeaderCell, iHeaderRow, iTableBody, iTableHead } from "types/general";
import {
  IPrerequisite,
  IPrerequisiteItem,
  isRelicRequirement,
} from "types/shards";
import { iExpandOptions } from "types/general";
import { Gear } from "types/gear";
import gearMapping from "types/gearMapping";
import { Relic } from "types/relic";

export default defineComponent({
  name: "TimelineTable",
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
  components: { Modal },
  props: {
    // relicList: {
    //   type: Object as () => Relic,
    //   required: true,
    // },
    // simpleView: {
    //   type: Boolean,
    //   default: false,
    // },
    goal: {
      type: Object as () => Goal,
      required: true,
    },
    storageKey: {
      type: String,
      required: true,
    },
    units: {
      type: Array as () => Unit[],
      required: true,
    },
    gearTargets: {
      type: Object,
      default: () => {
        return {};
      },
    },
    progress: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      startDate: this.goal.settings?.startDate ?? moment().format("YYYY-MM-DD"),
      startPercent: this.goal.settings?.startPercent ?? 0,
      assaultBattles: this.goal.settings?.assaultBattles ?? 0,
      showEditModal: false,
      editSettings: {
        startDate:
          this.goal.settings?.startDate ?? moment().format("YYYY-MM-DD"),
        startPercent: this.goal.settings?.startPercent ?? 0,
        assaultBattles: this.goal.settings?.assaultBattles ?? 0,
      },
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
            cells: [
              {
                label: "Gear Name",
                show: this.showCol("id"),
                sortMethodShow: true,
                icon: this.sortIcon("id"),
                value: "id",
                click: () => {
                  this.sortBy("id");
                },
              },
              // {
              //   label: "id",
              //   show: this.showCol("id"),
              //   value: "id",
              // },
              {
                label: "Amount Needed",
                show: this.showCol("subTotal"),
                sortMethodShow: true,
                icon: this.sortIcon("subTotal"),
                value: "subTotal",
                click: () => {
                  this.sortBy("subTotal");
                },
              },
              {
                label: "Owned",
                show: this.showCol("owned"),
                sortMethodShow: true,
                icon: this.sortIcon("owned"),
                value: "owned",
                click: () => {
                  this.sortBy("owned");
                },
              },
              {
                label: "Remaining",
                show: this.showCol("remaining"),
                sortMethodShow: true,
                icon: this.sortIcon("remaining"),
                value: "remaining",
                click: () => {
                  this.sortBy("remaining");
                },
              },
              {
                label: "Total Purchase",
                title:
                  "The total amount of gear needed to purchase or farm from any available locations to hit the target date",
                show: this.showCol("total"),
                sortMethodShow: true,
                icon: this.sortIcon("total"),
                value: "total",
                click: () => {
                  this.sortBy("total");
                },
              },
              // {
              //   label: "Actions",
              //   value: "actions",
              //   show: this.showCol("actions"),
              // },
            ],
          },
        ],
      };
    },
    body(): iTableBody {
      return {
        classes: "align-middle text-center",
        rows: this.fullGearList.map((gear: Gear) => {
          return {
            cells: [
              {
                type: "gear",
                data: {
                  gear,
                  showName: true,
                },
                show: this.showCol("id"),
              },
              // {
              //   data: gear.id,
              //   show: this.showCol("id"),
              // },
              {
                show: this.showCol("subTotal"),
                label: "Sub Total Needed:",
                data: gear.totalAmount,
              },
              {
                show: this.showCol("owned"),
                label: "Owned:",
                type: "number",
                data: {
                  value: gear.owned,
                },
                change: (val: number) => {
                  gear.owned = val;
                },
              },
              {
                show: this.showCol("remaining"),
                label: "Remaining:",
                data: gear.remaining,
              },
              {
                show: this.showCol("total"),
                label: "Total Purchase:",
                data: Math.max(
                  gear.remaining -
                    Math.round(
                      this.gearAmountPerDay(gear.id) * this.daysRemaining
                    ),
                  0
                ),
              },
              // {
              //   show: this.showCol("actions"),
              //   type: "buttons",
              //   data: {
              //     buttons: [
              //       {
              //         click: () => {
              //           this.goal.remove(unit.id);
              //         },
              //         icon: "fas fa-trash",
              //         classes: "btn btn-danger",
              //       },
              //     ],
              //   },
              // },
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
        buttons: [
          {
            classes: "fas fa-cog text-small mx-1",
            title: "Edit Settings",
            click: () => {
              this.showEditModal = true;
            },
          },
        ],
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

      return options;
    },
    fullGearList(): Gear[] {
      const list: Gear[] = [];
      this.units.forEach((unit: Unit) => {
        const gearTarget: number = this.gearTargets[unit.id] ?? unit.gearTarget;
        unit.fullSalvageList(gearTarget).forEach((gear: Gear) => {
          const match = list.find((x) => x.id === gear.id);
          if (match) {
            match.neededBy.push(...gear.neededBy);
            match.totalAmount += gear.totalAmount;
          } else {
            list.push(gear);
          }
        });
      });

      return list
        .filter((gear: Gear) => !gear.irrelevant)
        .sort((a: Gear, b: Gear) => {
          const sortMethod =
            this.sortMethod === "subTotal" ? "totalAmount" : this.sortMethod;
          if (this.sortMethod === "subTotal") {
            return sortValues(a, b, this.sortDir, "totalAmount");
          } else if (this.sortMethod === "total") {
          }
          return sortValues(a, b, this.sortDir, this.sortMethod);
        });
    },
    daysRemaining(): number {
      const today = moment();
      const start = moment(this.startDate);
      const percentPerDay =
        (this.progress - this.startPercent) / today.diff(start, "days");
      const percentRemaining = 100 - this.progress;
      return Math.round(percentRemaining / percentPerDay);
    },
  },
  methods: {
    totalProgress,
    getUnit,
    daysFromNow,
    gearAmountPerDay(gearId: string): number {
      const gearData: object = gearMapping.aquisition[gearId];
      if (gearData) {
        return Object.entries(gearData).reduce((total: number, x: any[]) => {
          const [key, value] = x;
          if (key === "assaultBattles") {
            return total + value * this.assaultBattles;
          } else {
            return total + value;
          }
        }, 0);
      } else {
        return 0;
      }
    },
    save() {
      this.goal.saveSettings(this.editSettings);
    },
  },
  watch: {
    goal: {
      handler(newGoal: Goal) {
        this.startDate = newGoal.settings.startDate;
        this.startPercent = newGoal.settings.startPercent;
        this.assaultBattles = newGoal.settings.assaultBattles;
      },
      deep: true,
    },
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

hr {
  opacity: 1;
}
</style>
