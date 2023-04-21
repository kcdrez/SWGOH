<template>
  <div>
    <SwgohTable :table="{ header, body }" v-if="relicList.length > 0" />
    <div v-else class="text-center">
      There are no relic requirements for these units. This is either because
      you already own all the relic materials and can immediately upgrade to the
      target level or all the units are already at the target relic level.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from "vue";
import { mapState } from "vuex";

import { Relic } from "types/relic";
import {
  daysFromNow,
  pluralText,
  setupColumnEvents,
  setupSorting,
} from "utils";
import { iTableBody, iTableHead } from "types/general";

export default defineComponent({
  name: "RelicTable",
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
  props: {
    relicList: {
      required: true,
      type: Array as () => Relic[],
    },
    targetLevels: {
      required: true,
      type: Array as () => { level: number; target: number }[],
      validator: (arr: any[]) => {
        return arr.every((x) => {
          return "level" in x && "target" in x;
        });
      },
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
  computed: {
    ...mapState("relic", ["ownedRelics"]),
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
                label: "Mat Name",
                show: this.showCol("name"),
                icon: this.sortIcon("name"),
                sortMethodShow: true,
                value: "name",
                input: {
                  type: "input",
                  classes: "mx-auto my-1 w-75",
                  placeholder: "Search",
                  value: this.searchText,
                  label: "Search by Name",
                  change: (val: string) => {
                    this.searchText = val;
                  },
                  click: () => {
                    this.sortBy("name");
                  },
                },
              },
              {
                label: "Rarity",
                show: this.showCol("rarity"),
                sortMethodShow: true,
                icon: this.sortIcon("rarity"),
                value: "rarity",
                click: () => {
                  this.sortBy("rarity");
                },
              },
              {
                label: "Locations",
                show: this.showCol("locations"),
                sortMethodShow: true,
                icon: this.sortIcon("locations"),
                value: "locations",
                click: () => {
                  this.sortBy("locations");
                },
              },
              {
                label: "Amount Owned",
                show: this.showCol("owned"),
                sortMethodShow: true,
                icon: this.sortIcon("owned"),
                maxWidth: "160px",
                value: "owned",
                click: () => {
                  this.sortBy("owned");
                },
              },
              {
                label: "Amount Needed",
                show: this.showCol("needed"),
                sortMethodShow: true,
                icon: this.sortIcon("needed"),
                value: "needed",
                click: () => {
                  this.sortBy("needed");
                },
              },
              {
                label: "Progress",
                show: this.showCol("progress"),
                sortMethodShow: true,
                icon: this.sortIcon("progress"),
                maxWidth: "145px",
                value: "progress",
                click: () => {
                  this.sortBy("progress");
                },
              },
              {
                label: "Required By",
                show: this.showRequiredByUnit && this.showCol("required"),
              },
              {
                label: "Est. Time",
                show: this.showCol("time"),
                sortMethodShow: true,
                icon: this.sortIcon("time"),
                value: "time",
                click: () => {
                  this.sortBy("time");
                },
              },
            ],
          },
        ],
      };
    },
    body(): iTableBody {
      return {
        classes: "align-middle text-center",
        rows: this.filteredRelics.map((relic: Relic) => {
          return {
            cells: [
              {
                show: this.showCol("icon"),
                type: "relic",
                data: relic,
              },
              {
                show: this.showCol("name"),
                data: relic.name,
              },
              {
                show: this.showCol("rarity"),
                data: relic.rarity,
                label: "Rarity:",
              },
              {
                show: this.showCol("locations"),
                data: relic.location.node,
                label: "Location:",
              },
              {
                show: this.showCol("owned"),
                type: "relicOwned",
                data: {
                  item: relic,
                  needed: relic.amountNeeded(this.targetLevels),
                },
              },
              {
                show: this.showCol("needed"),
                data: relic.amountNeeded(this.targetLevels),
                label: "Amount Needed:",
              },
              {
                show: this.showCol("progress"),
                data: relic.percent(this.targetLevels),
                type: "progress",
              },
              {
                show: this.showRequiredByUnit && this.showCol("required"),
                type: "list",
                classes: "text-center-sm",
                label: "Required By:",
                data: {
                  classes: "mb-0 no-bullets-sm text-left text-center-sm",
                  list: relic.neededBy?.map((unit) => {
                    return {
                      id: unit.id,
                      popover: {
                        hover: true,
                        arrow: true,
                        placement: "left",
                        header: {
                          classes: "border-bottom mb-1",
                          message: unit.name,
                        },
                        body: {
                          message: unit.amount,
                          classes: "text-left",
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
                show: this.showCol("time"),
                label: "Completion Date:",
                type: "time",
                data: {
                  timestamp: relic.timeEstimation(this.targetLevels),
                  display: pluralText(
                    relic.timeEstimation(this.targetLevels),
                    "day"
                  ),
                  title: daysFromNow(relic.timeEstimation(this.targetLevels)),
                  classes: "d-inline",
                },
              },
            ],
          };
        }),
      };
    },
    filteredRelics(): Relic[] {
      return (this.relicList as Relic[])
        .sort((a: Relic, b: Relic) => {
          if (this.sortMethod === "name") {
            const compareA = a.name.toLowerCase();
            const compareB = b.name.toLowerCase();
            if (this.sortDir === "asc") {
              return compareA > compareB ? 1 : -1;
            } else {
              return compareA > compareB ? -1 : 1;
            }
          } else if (this.sortMethod === "locations") {
            const compareA = a.location.node.toLowerCase();
            const compareB = b.location.node.toLowerCase();
            if (this.sortDir === "asc") {
              return compareA > compareB ? 1 : -1;
            } else {
              return compareA > compareB ? -1 : 1;
            }
          } else if (this.sortMethod === "rarity") {
            if (this.sortDir === "asc") {
              return a.rarity - b.rarity;
            } else {
              return b.rarity - a.rarity;
            }
          } else if (this.sortMethod === "owned") {
            if (this.sortDir === "asc") {
              return a.owned - b.owned;
            } else {
              return b.owned - a.owned;
            }
          } else if (this.sortMethod === "needed") {
            if (this.sortDir === "asc") {
              return (
                a.amountNeeded(this.targetLevels) -
                b.amountNeeded(this.targetLevels)
              );
            } else {
              return (
                b.amountNeeded(this.targetLevels) -
                a.amountNeeded(this.targetLevels)
              );
            }
          } else if (this.sortMethod === "progress") {
            const amountNeededA = a.amountNeeded(this.targetLevels);
            const amountNeededB = b.amountNeeded(this.targetLevels);

            if (amountNeededA === 0 && amountNeededB === 0) {
              return 0;
            } else if (amountNeededA === 0) {
              return this.sortDir === "asc" ? 1 : -1;
            } else if (amountNeededB === 0) {
              return this.sortDir === "asc" ? -1 : 1;
            }

            if (this.sortDir === "asc") {
              return (
                a.progress(this.targetLevels) - b.progress(this.targetLevels)
              );
            } else {
              return (
                b.progress(this.targetLevels) - a.progress(this.targetLevels)
              );
            }
          } else if (this.sortMethod === "time") {
            if (this.sortDir === "asc") {
              return (
                a.timeEstimation(this.targetLevels) -
                b.timeEstimation(this.targetLevels)
              );
            } else {
              return (
                b.timeEstimation(this.targetLevels) -
                a.timeEstimation(this.targetLevels)
              );
            }
          }
          return 0;
        })
        .filter((relic: Relic) => {
          const name = relic.name.toLowerCase().replace(/\s/g, "");
          const id = relic.id.toLowerCase().replace(/\s/g, "");
          const compare = this.searchText.toLowerCase().replace(/\s/g, "");
          return name.includes(compare) || id.includes(compare);
        });
    },
  },
});
</script>

<style lang="scss" scoped></style>
