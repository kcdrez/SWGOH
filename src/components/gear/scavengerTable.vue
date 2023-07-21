<template>
  <ExpandableSection
    :title="label"
    :idRef="storageKey"
    :options="expandOptions"
  >
    <table
      class="table table-bordered table-dark table-sm table-striped mb-0 swgoh-table"
    >
      <TableHeader :header="header" />
      <TableBody :body="body" />
    </table>
  </ExpandableSection>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from "vue";
import { mapState, mapGetters } from "vuex";

import { Gear, IScavenger } from "types/gear";
import { FarmingNode } from "types/shards";
import { setupColumnEvents, setupSorting, sortValues } from "utils";
import {
  iExpandOptions,
  iHeaderCell,
  iHeaderRow,
  iTableBody,
  iTableHead,
} from "types/general";
import TableHeader from "components/general/table/tableHeader.vue";
import TableBody from "components/general/table/tableBody.vue";

type tScavenger = { data: Gear; scavenger: IScavenger };
const storageKey = "scavengerTable";

export default defineComponent({
  name: "ScavengerTable",
  components: {
    TableHeader,
    TableBody,
  },
  setup(props) {
    const { sortDir, sortMethod, searchText, sortBy, sortIcon } = setupSorting(
      `${storageKey}-${props.scavengerId}`
    );
    const selectedColumns: Ref<string[]> = ref([]);
    const { showCol } = setupColumnEvents(selectedColumns);

    return {
      sortDir,
      sortMethod,
      searchText,
      sortBy,
      sortIcon,
      showCol,
      selectedColumns,
    };
  },
  props: {
    scavengerId: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState("gear", ["gearList"]),
    ...mapState("player", ["player"]),
    ...mapState("shards", ["shardFarming"]),
    ...mapGetters("planner", ["fullUnitList"]),
    header(): iTableHead {
      return {
        classes: "text-center sticky-header align-middle show-on-mobile",
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
                maxWidth: "100px",
                value: "icon",
              },
              {
                label: "Name",
                show: this.showCol("name"),
                maxWidth: "300px",
                icon: this.sortIcon("name"),
                value: "name",
                click: () => {
                  this.sortBy("name");
                },
              },
              {
                label: "Amount",
                show: this.showCol("amount"),
                maxWidth: "100px",
                icon: this.sortIcon("amount"),
                value: "amount",
                click: () => {
                  this.sortBy("amount");
                },
              },
              {
                label: "Efficiency Rating",
                show: this.showCol("priority"),
                maxWidth: "100px",
                icon: this.sortIcon("priority"),
                value: "priority",
                click: () => {
                  this.sortBy("priority");
                },
              },
              {
                label: "Best Farming Locations",
                show: this.showCol("locations"),
                maxWidth: "300px",
                icon: this.sortIcon("locations"),
                value: "locations",
                click: () => {
                  this.sortBy("locations");
                },
              },
              {
                label: "Notes",
                value: "notes",
                show: this.showCol("notes"),
                maxWidth: "300px",
              },
            ],
          },
        ],
      };
    },
    body(): iTableBody {
      return {
        classes: "align-middle text-center",
        rows: this.list.map((gear: tScavenger) => {
          return {
            cells: [
              {
                show: this.showCol("icon"),
                type: "gear",
                data: {
                  gear: gear.data,
                },
              },
              {
                show: this.showCol("name"),
                data: gear.data.name,
              },
              {
                show: this.showCol("amount"),
                label: "Amount:",
                data: gear.scavenger.count,
              },
              {
                show: this.showCol("priority"),
                label: "Efficiency Rating:",
                data: gear.scavenger.priority,
              },
              {
                show: this.showCol("locations"),
                label: "Locations:",
                type: "list",
                zeroState: {
                  show: (gear.scavenger.nodes ?? []).length <= 0,
                  message: "No known farmable locations.",
                },
                data: {
                  classes: "m-0 no-bullets-sm text-left text-center-sm",
                  list: this.locationLabels(gear.scavenger.nodes ?? []).map(
                    (x) => {
                      return {
                        id: x,
                        message: x,
                      };
                    }
                  ),
                },
              },
              {
                show: this.showCol("notes"),
                classes: gear.scavenger?.notes ? "" : "hidden-sm",
                data: gear.scavenger?.notes ?? "",
              },
            ],
          };
        }),
      };
    },
    cols(): { label: string; value: string }[] {
      return this.header.headers.reduce(
        (acc: { label: string; value: string }[], row: iHeaderRow) => {
          row.cells.forEach((cell: iHeaderCell) =>
            acc.push({ label: cell.label, value: cell.value })
          );
          return acc;
        },
        []
      );
    },
    list(): tScavenger[] {
      return this.gearList
        .reduce((acc: tScavenger[], gear: Gear) => {
          const match = gear.scavenger.find(
            (x: IScavenger) => x.id === this.scavengerId
          );
          if (match && match.priority) {
            acc.push({
              data: gear,
              scavenger: match,
            });
          }
          return acc;
        }, [])
        .sort((a: tScavenger, b: tScavenger) => {
          if (this.sortMethod === "name") {
            return sortValues(a.data, b.data, this.sortDir, this.sortMethod);
          } else if (this.sortMethod === "amount") {
            return sortValues(
              a.scavenger.count,
              b.scavenger.count,
              this.sortDir,
              this.sortMethod
            );
          } else if (this.sortMethod === "priority") {
            return sortValues(
              a.scavenger.priority ?? 0,
              b.scavenger.priority ?? 0,
              this.sortDir,
              this.sortMethod
            );
          } else if (this.sortMethod === "locations") {
            const stores = [
              "guild_store",
              "squad_arena_store",
              "guild_events_store1",
              "guild_events_store2",
              "challenges_tac",
              "challenges_agi",
              "challenges_str",
            ];

            for (let i = 0; i < stores.length; i++) {
              const storeStatus = checkStore(stores[i], a, b);

              if (storeStatus === 1 || storeStatus === 2) {
                return sortValues(
                  storeStatus === 1,
                  false,
                  this.sortDir,
                  this.sortMethod
                );
              } else if (storeStatus === 0) {
                return 1;
              }
            }
            return sortValues(
              a.scavenger.nodes ?? [],
              b.scavenger.nodes ?? [],
              this.sortDir,
              this.sortMethod
            );
          }
          return 0;
        });

      function checkStore(
        storeId: string,
        a: tScavenger,
        b: tScavenger
      ): number {
        const hasStoreA = a.scavenger.nodes?.some((x) => x === storeId);
        const hasStoreB = b.scavenger.nodes?.some((x) => x === storeId);

        if (hasStoreA && hasStoreB) {
          return 0;
        } else if (hasStoreA) {
          return 1;
        } else if (hasStoreB) {
          return 2;
        } else {
          return -1;
        }
      }
    },
    storageKey() {
      return `${storageKey}-${this.scavengerId}`;
    },
    expandOptions(): iExpandOptions {
      return {
        multiSelect: {
          options: this.cols,
          change: (newVal: string[]) => {
            this.selectedColumns = newVal;
          },
        },
      };
    },
  },
  methods: {
    locationLabels(locationIds: string[]) {
      return locationIds.map((location) => {
        const [locationId, gearId] = location.split(" > ");
        let label = "";
        if (locationId) {
          const match: FarmingNode | undefined = this.shardFarming.find(
            (x: FarmingNode) => x.id === locationId
          );
          label = match ? match.label : locationId;
        }
        if (gearId) {
          const match: Gear | undefined = this.gearList.find(
            (x: Gear) => x.id === gearId
          );
          label += ` > ${match ? match.name : gearId}`;
        }
        return label;
      });
    },
  },
});
</script>

<style lang="scss" scoped></style>
