<template>
  <div>
    <SwgohTable
      :table="{ header, body }"
      class="mb-0"
      v-if="gearList.length > 0"
    />
    <div v-else class="text-center">
      There are no gear requirements for these units. This is either because you
      already own all the gear and can immediately upgrade to the target level
      or all the units are already at the target gear level.
    </div>
    <SwgohTable :table="irrelevantTable" v-if="irrelevantGear.length > 0" />
    <Confirm
      :isOpen="showResetConfirm"
      title="Are you sure?"
      :text="`Are you sure you want to reset all the gear and set the owned quantity to zero?`"
      @confirm="reset()"
      @cancel="showResetConfirm = false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from "vue";
import { mapActions, mapState } from "vuex";

import { Gear } from "types/gear";
import GearIcon from "components/gear/gearIcon.vue";
import { setupColumnEvents, setupSorting, sortValues } from "utils";
import { iTable, iTableBody, iTableHead } from "types/general";

export default defineComponent({
  name: "GearTable",
  setup(props) {
    const { sortDir, sortMethod, searchText, sortBy, sortIcon } = setupSorting(
      props.storageKey
    );
    const list = toRefs(props).selectedColumns;
    const { showCol } = setupColumnEvents(list);

    return {
      sortDir,
      sortMethod,
      searchText,
      sortBy,
      sortIcon,
      showCol,
    };
  },
  components: { GearIcon },
  props: {
    gearList: {
      required: true,
      type: Array as () => Gear[],
    },
    showRequiredByUnit: {
      type: Boolean,
      default: false,
    },
    selectedColumns: {
      type: Array as () => string[],
      validator: (arr: string[]) => {
        return arr.every((x) => {
          return typeof x === "string";
        });
      },
      required: true,
    },
    storageKey: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showResetConfirm: false,
    };
  },
  computed: {
    ...mapState("gear", { allGear: "gearList" }),
    filteredSalvageList(): Gear[] {
      return this.gearList
        .filter((gear: Gear) => {
          if (gear.irrelevant) {
            return false;
          }
          const name = gear.name.toLowerCase().replace(/\s/g, "");
          const compare = this.searchText.toLowerCase().replace(/\s/g, "");
          return name.includes(compare);
        })
        .sort((a: Gear, b: Gear) => {
          if (this.sortMethod === "timeEstimate") {
            const compareA =
              a.timeEstimation === 0 ? Infinity : a.timeEstimation;
            const compareB =
              b.timeEstimation === 0 ? Infinity : b.timeEstimation;
            return sortValues(
              compareA,
              compareB,
              this.sortDir,
              this.sortMethod
            );
          }
          return sortValues(a, b, this.sortDir, this.sortMethod);
        });
    },
    irrelevantGear(): Gear[] {
      return this.gearList.filter((gear: Gear) => {
        return gear.irrelevant;
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
                label: "Icon",
                show: this.showCol("icon"),
              },
              {
                label: "Name",
                show: this.showCol("name"),
                sortMethodShow: true,
                maxWidth: "300px",
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
                icon: this.sortIcon("name"),
              },
              {
                label: "Mark",
                show: this.showCol("markLevel"),
                sortMethodShow: true,
                icon: this.sortIcon("markLevel"),
                value: "markLevel",
                click: () => {
                  this.sortBy("markLevel");
                },
              },
              {
                label: "Locations",
                maxWidth: "150px",
                show: this.showCol("locations"),
                sortMethodShow: true,
              },
              {
                label: "Owned",
                maxWidth: "125px",
                show: this.showCol("owned"),
                sortMethodShow: true,
                icon: this.sortIcon("owned"),
                value: "owned",
                title: "Amount of gear owned",
                input: {
                  type: "button",
                  label: "Reset",
                  classes: "btn btn-sm btn-primary w-100",
                  click: () => {
                    this.showResetConfirm = true;
                  },
                },
                click: () => {
                  this.sortBy("owned");
                },
              },
              {
                label: "Needed",
                maxWidth: "125px",
                show: this.showCol("totalAmount"),
                sortMethodShow: true,
                icon: this.sortIcon("totalAmount"),
                value: "totalAmount",
                title: "Amount of gear needed for all characters being tracked",
                click: () => {
                  this.sortBy("totalAmount");
                },
              },
              {
                label: "Progress",
                maxWidth: "145px",
                show: this.showCol("progress"),
                sortMethodShow: true,
                icon: this.sortIcon("progress"),
                value: "progress",
                click: () => {
                  this.sortBy("progress");
                },
              },
              {
                label: "Required By",
                maxWidth: "125px",
                show: this.showRequiredByUnit && this.showCol("neededBy"),
              },
              {
                label: "Est. Time",
                maxWidth: "125px",
                show: this.showCol("timeEstimate"),
                sortMethodShow: true,
                icon: this.sortIcon("timeEstimate"),
                value: "timeEstimate",
                click: () => {
                  this.sortBy("timeEstimate");
                },
              },
              {
                label: "Actions",
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
        zeroState: {
          message: "There are no gear pieces that meet that search criteria.",
          show: this.filteredSalvageList.length === 0,
        },
        rows: this.filteredSalvageList.map((gear: Gear) => {
          return {
            cells: [
              {
                type: "gear",
                data: {
                  gear,
                },
                show: this.showCol("icon"),
              },
              {
                data: gear.name,
                show: this.showCol("name"),
              },
              {
                show: this.showCol("markLevel"),
                data: gear.mark,
                classes: !!gear.mark ? "hidden-sm" : "",
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
                show: this.showCol("owned"),
                type: "gearOwned",
                data: gear,
              },
              {
                show: this.showCol("totalAmount"),
                label: "Amount Needed:",
                data: gear.totalAmount,
              },
              {
                type: "progress",
                show: this.showCol("progress"),
                data: gear.percent,
              },
              {
                show: this.showRequiredByUnit && this.showCol("neededBy"),
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
                        containerClasses: "border-0 m-0",
                      },
                      type: "link",
                      data: { name: "UnitPage", params: { unitId: unit.id } },
                      message: unit.name,
                    };
                  }),
                },
              },
              {
                type: "time",
                label: "Completion Date:",
                data: {
                  timestamp: gear.timeEstimation,
                },
                show: this.showCol("timeEstimate"),
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
    irrelevantTable(): iTable {
      return {
        header: {
          classes: "c-pointer sticky-header",
          title: "Show/Hide irrelevant pieces",
          headers: [
            {
              cells: [
                {
                  colspan: this.showRequiredByUnit ? "6" : "5",
                  label: "Irrelevant Pieces",
                  show: true,
                },
              ],
            },
          ],
          collapseTarget: "irrelevantSection",
        },
        body: {
          id: "irrelevantSection",
          classes: "collapse text-center align-middle",
          rows: this.irrelevantGear.map((gear) => {
            return {
              cells: [
                {
                  colspan: this.showRequiredByUnit ? "5" : "4",
                  type: "gear",
                  data: { gear, showName: true },
                  show: true,
                },
                {
                  type: "buttons",
                  data: {
                    buttons: [
                      {
                        classes: "btn btn-success",
                        title:
                          "Mark this salvage as relevant, moving it back into the planner estimation",
                        icon: "fas fa-heart",
                        click: () => {
                          gear.irrelevant = false;
                        },
                      },
                    ],
                  },
                  show: true,
                },
              ],
            };
          }),
        },
      };
    },
  },
  methods: {
    ...mapActions("gear", ["saveOwnedCount"]),
    getGear(id: string): Gear | undefined {
      return this.allGear.find((x: Gear) => x.id === id);
    },
    reset() {
      this.filteredSalvageList.forEach((gear: Gear) => {
        gear.owned = 0;
      });
      this.showResetConfirm = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.empty-search {
  font-size: 1.5rem;
  text-align: center;
}
</style>
