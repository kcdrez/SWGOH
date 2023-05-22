<template>
  <ExpandableSection
    title="Relic Timeline"
    :idRef="storageKey"
    :options="expandOptions"
    class="my-2"
  >
    <SwgohTable :table="{ header, body: relicBody }" />
  </ExpandableSection>
</template>

<script lang="ts">
import { Ref, defineComponent, ref } from "vue";
import _ from "lodash";
import moment from "moment";

import { Unit, getUnit } from "types/unit";
import { Goal } from "types/goals";
import { setupColumnEvents, setupSorting, sortValues } from "utils";
import { iHeaderCell, iHeaderRow, iTableBody, iTableHead } from "types/general";
import { iExpandOptions } from "types/general";
import {
  acquisition as relicAquisition,
  relicConfig,
} from "types/relicMapping";
import { Relic } from "types/relic";

export default defineComponent({
  name: "TimelineRelicTable",
  setup(props) {
    const storageKey = "TimelineRelicTable" + props.goal.id;
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
    relicBody(): iTableBody {
      return {
        classes: "align-middle text-center",
        rows: this.fullRelicList.map((relic: Relic) => {
          return {
            cells: [
              {
                type: "relic",
                data: relic,
                show: this.showCol("id"),
              },
              {
                show: this.showCol("subTotal"),
                label: "Sub Total Needed:",
                data: relic.amountNeeded(this.relicTargetLevels),
              },
              {
                show: this.showCol("owned"),
                label: "Owned:",
                type: "number",
                data: {
                  value: relic.owned,
                },
                change: (val: number) => {
                  relic.owned = val;
                },
              },
              {
                show: this.showCol("remaining"),
                label: "Remaining:",
                data: relic.remaining(this.relicTargetLevels),
              },
              {
                show: this.showCol("total"),
                label: "Total Purchase:",
                data: this.amountToPurchase(relic),
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
    fullRelicList(): Relic[] {
      const relicList: Relic[] = Object.values(relicConfig);
      const neededList: Relic[] = [];
      relicList.forEach((relic) => relic.resetNeeded());
      this.prerequisites.list.forEach((unit: Unit) => {
        const _unit = getUnit(unit.id);
        if (_unit && _unit.relicLevel < _unit.relicTarget) {
          relicList.forEach((relic: Relic) => {
            const target =
              this.prerequisites.relicTargets[_unit.id] ?? _unit.relicTarget;
            const amount = relic.amountNeeded([
              { target, level: unit.relicLevel },
            ]);
            const exists = neededList.find((x) => x.id == relic.id);
            if (amount > 0) {
              if (exists) {
                exists.addNeededBy({
                  name: _unit.name,
                  id: _unit.id,
                  amount,
                });
              } else {
                relic.addNeededBy({
                  name: _unit.name,
                  id: _unit.id,
                  amount,
                });
                neededList.push(relic);
              }
            }
          });
        }
      });
      return neededList.sort((a: Relic, b: Relic) => {
        // const sortMethod =
        //   this.sortMethod === "subTotal" ? "totalAmount" : this.sortMethod;
        // if (sortMethod === "total") {
        //   const valueA = Math.max(
        //     a.remaining -
        //       Math.round(this.gearAmountPerDay(a.id) * this.daysRemaining),
        //     0
        //   );
        //   const valueB = Math.max(
        //     b.remaining -
        //       Math.round(this.gearAmountPerDay(b.id) * this.daysRemaining),
        //     0
        //   );
        //   return sortValues(valueA, valueB, this.sortDir, sortMethod);
        // }
        return sortValues(a, b, this.sortDir, this.sortMethod);
      });
    },
    relicTargetLevels(): any[] {
      const list: any[] = [];
      this.prerequisites.list.forEach((unit: Unit) => {
        const target =
          this.prerequisites.relicTargets[unit.id] ?? unit.relicTarget;
        list.push({ level: unit.relicLevel, target });
      });
      return list;
    },
  },
  methods: {
    amountToPurchase(relic: Relic): number {
      const remaining = relic.remaining(this.relicTargetLevels);
      let amountPerDay = 0;

      const relicData: object = relicAquisition[relic.id];
      if (relicData) {
        amountPerDay = Object.entries(relicData).reduce(
          (total: number, x: any[]) => {
            const [key, value] = x;
            if (key === "assaultBattles") {
              const { ct2: ct2Amount, ct3: ct3Amount } = value;
              const { ct2: ct2Completed, ct3: ct3Completed } =
                this.goal.settings.assaultBattles;
              return (
                total + ct2Amount * ct2Completed + ct3Amount * ct3Completed
              );
            } else if (key === "conquest") {
              const { difficulty, box } = this.goal.settings?.conquest;
              if (difficulty in value && box in value[difficulty]) {
                return total + (value[difficulty][box] ?? 0);
              } else {
                return total;
              }
            } else {
              return total + value;
            }
          },
          0
        );
      }

      return Math.max(
        remaining - Math.round(amountPerDay * this.goal.daysRemaining),
        0
      );
    },
  },
});
</script>

<style lang="scss" scoped></style>
