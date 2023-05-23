<template>
  <ExpandableSection
    title="Gear Timeline"
    :idRef="storageKey"
    :options="expandOptions"
    class="my-2"
  >
    <SwgohTable :table="{ header, body: gearBody }" />
  </ExpandableSection>
</template>

<script lang="ts">
import { Ref, defineComponent, ref } from "vue";
import _ from "lodash";
import moment from "moment";

import { Unit } from "types/unit";
import { Goal } from "types/goals";
import { setupColumnEvents, setupSorting, sortValues } from "utils";
import { iHeaderCell, iHeaderRow, iTableBody, iTableHead } from "types/general";
import { iExpandOptions } from "types/general";
import { Gear } from "types/gear";
import gearMapping from "types/gearMapping";

export default defineComponent({
  name: "TimelineGearTable",
  setup(props) {
    const storageKey = "TimelineGearTable" + props.goal.id;
    const { sortDir, sortMethod, sortBy, sortIcon } = setupSorting(storageKey);

    const selectedColumns: Ref<string[]> = ref([]);
    const { showCol } = setupColumnEvents(selectedColumns);

    return {
      sortDir,
      sortMethod,
      sortBy,
      sortIcon,
      selectedColumns,
      showCol,
      storageKey,
    };
  },
  props: {
    goal: {
      type: Object as () => Goal,
      required: true,
    },
    prerequisites: {
      required: true,
      type: Object as () => {
        list: Unit[];
        relicTargets: Object;
        gearTargets: Object;
      },
    },
  },
  data() {
    return {} as any;
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
    gearBody(): iTableBody {
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
                data: this.amountToPurchase(gear),
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
        multiSelect: {
          options: this.cols,
          change: (newVal: string[]) => {
            this.selectedColumns = newVal;
          },
        },
        header: { classes: "text-medium" },
        onShow: () => {
          const tableComponent = this.$refs[this.refName] as any;
          tableComponent?.refresh();
        },
      };

      return options;
    },
    fullGearList(): Gear[] {
      const list: Gear[] = [];
      this.prerequisites.list.forEach((unit: Unit) => {
        const gearTarget: number =
          this.prerequisites.gearTargets[unit.id] ?? unit.gearTarget;
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
          if (sortMethod === "total") {
            const valueA = this.amountToPurchase(a);
            const valueB = this.amountToPurchase(b);

            return sortValues(valueA, valueB, this.sortDir, sortMethod);
          }
          return sortValues(a, b, this.sortDir, sortMethod);
        });
    },
  },
  methods: {
    amountToPurchase(gear: Gear): number {
      let amountPerDay = 0;
      const gearData: object = gearMapping.aquisition[gear.id];
      if (gearData) {
        amountPerDay = Object.entries(gearData).reduce(
          (total: number, x: any[]) => {
            const [key, value] = x;
            if (key === "assaultBattles") {
              const { ct1: ct1Amount, ct0: ct0Amount } = value;
              const { ct1: ct1Completed } = this.goal.settings.assaultBattles;
              return total + (ct1Amount ?? 0) * ct1Completed + (ct0Amount ?? 0);
            } else if (key === "conquest") {
              const { difficulty, box } = this.goal.settings?.conquest;
              if (difficulty in value && box in value[difficulty]) {
                return total + (value[difficulty][box] ?? 0);
              }
            } else if (key === "gc") {
              const { box } = this.goal.settings?.gc ?? {};
              if (box && value.box && box in value.box) {
                return total + (value.box[box] ?? 0);
              }
            } else if (key === "gac") {
              const { rank } = this.goal.settings?.gac ?? {};
              if (rank && value.rank && rank in value.rank) {
                return total + (value.rank[rank] ?? 0);
              }
            } else {
              return total + value;
            }
            return total;
          },
          0
        );
      }

      return Math.max(
        gear.remaining - Math.round(amountPerDay * this.goal.daysRemaining),
        0
      );
    },
  },
});
</script>

<style lang="scss" scoped></style>
