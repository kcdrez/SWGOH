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
import {
  round2Decimals,
  setupColumnEvents,
  setupSorting,
  sortValues,
} from "utils";
import { iHeaderCell, iHeaderRow, iTableBody, iTableHead } from "types/general";
import { iExpandOptions } from "types/general";
import { Gear } from "types/gear";
import gearMapping from "types/gearMapping";

export default defineComponent({
  name: "TimelineGearTable",
  setup(props) {
    const storageKey = "TimelineGearTable" + props.goal.id;
    const { sortDir, sortMethod, sortBy, sortIcon, searchText } =
      setupSorting(storageKey);

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
      searchText,
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
                show: this.showCol("name"),
                sortMethodShow: true,
                icon: this.sortIcon("name"),
                value: "name",
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
                label: "Locations",
                maxWidth: "150px",
                show: this.showCol("locations"),
                sortMethodShow: true,
                value: "locations",
              },
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
              {
                label: "Required By",
                maxWidth: "125px",
                show: this.showCol("neededBy"),
                value: "neededBy",
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
                show: this.showCol("name"),
              },
              {
                show: this.showCol("locations"),
                zeroState: {
                  message: "No known farmable locations.",
                  show: gear.locations.length <= 0,
                },
                type: "buttonToggle",
                data: {
                  buttonClasses: "btn btn-sm btn-info m-auto d-block",
                  message: "Show/Hide Locations",
                  type: "list",
                  id: `locations-${gear.id}`,
                  listData: {
                    classes: "m-0 text-left text-center-sm no-bullets-sm",
                    elements: gear.locationLabels,
                  },
                },
              },
              {
                show: this.showCol("subTotal"),
                label: "Sub Total Needed:",
                data: gear.totalAmount,
              },
              {
                show: this.showCol("owned"),
                label: "Owned:",
                type: "gearOwned",
                data: gear,
              },
              {
                show: this.showCol("remaining"),
                label: "Remaining:",
                data: gear.remaining,
              },
              {
                show: this.showCol("total"),
                label: "Total Purchase:",
                data: {
                  label: this.amountToPurchase(gear).total,
                  popover: {
                    header: {
                      message: "Gear Amount per Day",
                      classes: "border-bottom mb-1",
                    },
                    hover: true,
                    arrow: true,
                    placement: "left",
                    list: this.amountToPurchase(gear).list.map((x) => {
                      return {
                        id: x.key,
                        type: "text",
                        label: `${x.label}: ${round2Decimals(x.total)}`,
                      };
                    }),
                    // list: unit.gearLevels.map((tier) => {
                    //   return {
                    //     type: "gearText",
                    //     level: tier.level,
                    //     amount: tier.amount,
                    //     id: tier.level,
                    //   };
                    // }),
                    // footer: {
                    //   classes: "border-top mt-1",
                    //   show: unit.gearLevels.length > 1,
                    //   message: `Total: ${unit.totalAmount}`,
                    // },
                  },
                },
              },
              {
                show: this.showCol("neededBy"),
                classes: "text-left text-center-sm",
                label: "Needed By:",
                type: "list",
                data: {
                  classes: "mb-0 no-bullets-sm",
                  list: gear.neededBy.map((unit) => {
                    return {
                      id: unit.id,
                      popover: {
                        header: {
                          message: unit.name,
                          classes: "border-bottom mb-1",
                        },
                        hover: true,
                        arrow: true,
                        placement: "left",
                        list: unit.gearLevels.map((tier) => {
                          return {
                            type: "gearText",
                            level: tier.level,
                            amount: tier.amount,
                            id: tier.level,
                          };
                        }),
                        footer: {
                          classes: "border-top mt-1",
                          show: unit.gearLevels.length > 1,
                          message: `Total: ${unit.totalAmount}`,
                        },
                      },
                      type: "link",
                      data: { name: "UnitPage", params: { unitId: unit.id } },
                      message: unit.name,
                    };
                  }),
                },
              },
              {
                show: this.showCol("actions"),
                type: "buttons",
                data: {
                  buttons: [
                    {
                      click: () => {
                        gear.irrelevant = true;
                      },
                      icon: "fas fa-toilet",
                      classes: "btn btn-warning text-dark",
                      title:
                        "Mark this salvage as irrelevant, removing it from the planner estimation",
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
        .filter((gear: Gear) => {
          if (gear.irrelevant) {
            return false;
          }

          const name = gear.name.toLowerCase().replace(/\s/g, "");
          const compare = this.searchText.toLowerCase().replace(/\s/g, "");
          return name.includes(compare);
        })
        .sort((a: Gear, b: Gear) => {
          const sortMethod =
            this.sortMethod === "subTotal" ? "totalAmount" : this.sortMethod;
          if (sortMethod === "total") {
            const valueA = this.amountToPurchase(a).total;
            const valueB = this.amountToPurchase(b).total;

            return sortValues(valueA, valueB, this.sortDir, sortMethod);
          }
          return sortValues(a, b, this.sortDir, sortMethod);
        });
    },
  },
  methods: {
    amountToPurchase(gear: Gear): any {
      const list: any[] = [
        {
          key: "assaultBattles",
          label: "Assault Battles",
          total: 0,
        },
        {
          key: "conquest",
          label: "Conquest",
          total: 0,
        },
        {
          key: "gc",
          label: "Galactic Challenges",
          total: 0,
        },
        {
          key: "gac",
          label: "Grand Arena (GAC)",
          total: 0,
        },
        {
          key: "tw",
          label: "Territory Wars",
          total: 0,
        },
        {
          key: "tb",
          label: "Territory Battles",
          total: 0,
        },
        {
          key: "daily",
          label: "Daily Rewards",
          total: 0,
        },
        {
          key: "challenges",
          label: "Daily Challenges",
          total: 0,
        },
      ];
      let grandTotal = 0;
      const gearData: object = gearMapping.aquisition[gear.id];
      if (gearData) {
        Object.entries(gearData).forEach((x: any) => {
          const [key, value] = x;
          const match = list.find((x) => x.key === key);
          if (!match) {
            console.warn("Unknown type to determine amountToPurchase");
            return {
              total: 0,
              list,
            };
          }

          if (key === "assaultBattles") {
            const { ct1: ct1Amount, ct0: ct0Amount } = value;
            const { ct1: ct1Completed } = this.goal.settings.assaultBattles;
            const amount = (ct1Amount ?? 0) * ct1Completed + (ct0Amount ?? 0);
            match.total += amount;
            grandTotal += amount;
          } else if (key === "conquest") {
            const { difficulty, box } = this.goal.settings?.conquest;
            if (difficulty in value && box in value[difficulty]) {
              const amount = value[difficulty][box] ?? 0;
              match.total += amount;
              grandTotal += amount;
            }
          } else if (key === "gc") {
            const { box } = this.goal.settings?.gc ?? {};
            if (box && value && box in value) {
              const amount = value[box] ?? 0;
              match.total += amount;
              grandTotal += amount;
            }
          } else if (key === "gac") {
            const { rank } = this.goal.settings?.gac ?? {};
            if (rank && value.rank && rank in value.rank) {
              const amount = value.rank[rank] ?? 0;
              match.total += amount;
              grandTotal += amount;
            }
          } else {
            match.total += value;
            grandTotal += value;
          }
        });
      }

      return {
        total: Math.max(
          gear.remaining - Math.round(grandTotal * this.goal.daysRemaining),
          0
        ),
        list: list.filter((x) => x.total > 0),
      };
    },
  },
});
</script>

<style lang="scss" scoped></style>
