<template>
  <Loading :state="loading ? 'LOADING' : 'READY'" size="md">
    <SwgohTable :table="{ header, body }" />
  </Loading>
</template>

<script lang="ts">
import { defineComponent, toRefs } from "vue";
import { mapActions } from "vuex";

import { Unit, unitsByPriority } from "types/unit";
import { estimatedTime } from "types/guild";
import { setupColumnEvents, setupSorting } from "utils";
import { iTableBody, iTableHead } from "types/general";

export default defineComponent({
  name: "TerritoryBattleShardTable",
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
    units: {
      required: true,
      type: Array as () => Unit[],
    },
    showUnitName: {
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
    simpleView: {
      type: Boolean,
      default: false,
    },
    storageKey: {
      type: String,
      required: true,
    },
    loadOnCreation: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: true,
    };
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
                label: "Unit Name",
                show: this.showUnitName && this.showCol("name"),
                sortMethodShow: this.showUnitName,
                value: "name",
                input: {
                  type: "input",
                  classes: "mx-auto my-1 w-75",
                  placeholder: "Search by Name",
                  value: this.searchText,
                  label: "Search",
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
                label: "Locations",
                show: this.showCol("locations"),
              },
              {
                label: "Shards Owned",
                show: this.showCol("owned"),
                sortMethodShow: true,
                icon: this.sortIcon("owned"),
                value: "owned",
                click: () => {
                  this.sortBy("owned");
                },
              },
              {
                label: "Shards Remaining",
                show: this.showCol("remaining"),
                sortMethodShow: true,
                icon: this.sortIcon("remaining"),
                value: "remaining",
                click: () => {
                  this.sortBy("remaining");
                },
              },
              {
                label: "Progress",
                show: this.showCol("progress"),
                sortMethodShow: true,
                icon: this.sortIcon("progress"),
                value: "progress",
                click: () => {
                  this.sortBy("progress");
                },
              },
              {
                label: "Est. Time",
                show: this.showUnitName && this.showCol("time"),
                sortMethodShow: this.showUnitName,
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
        rows: this.filteredUnitList.map((unit: Unit) => {
          return {
            cells: [
              {
                show: this.showUnitName && this.showCol("name"),
                type: "unit",
                data: {
                  unit,
                  isLink: true,
                  hideImage: this.simpleView,
                },
              },
              {
                show: this.showCol("locations"),
                classes: "farming-locations text-left text-center-sm",
                type: "list",
                zeroState: {
                  message: "No known farmable locations.",
                  show: unit.locations.length <= 0,
                },
                data: {
                  classes: "m-0",
                  list: unit.locations.map((l) => {
                    return { id: l, message: l };
                  }),
                },
                label: "Farming Locations:",
              },
              {
                show: this.showCol("owned"),
                type: "shardsOwned",
                data: { unit },
              },
              {
                show: this.showCol("remaining"),
                label: "Remaining Shards:",
                data: unit.remainingShards,
              },
              {
                show: this.showCol("progress"),
                type: "progress",
                data: unit.shardPercent,
              },
              {
                show: this.showUnitName && this.showCol("time"),
                type: "time",
                data: {
                  timestamp: estimatedTime(unit),
                  classes: "d-inline",
                },
              },
            ],
          };
        }),
      };
    },
    filteredUnitList(): Unit[] {
      return this.units
        .filter((unit: Unit) => {
          const name = unit.name.toLowerCase().replace(/\s/g, "");
          const compare = this.searchText.toLowerCase().replace(/\s/g, "");
          return name.includes(compare);
        })
        .sort((a: Unit, b: Unit) => {
          if (this.sortMethod === "name") {
            const compareA = a.name.toLowerCase();
            const compareB = b.name.toLowerCase();
            if (this.sortDir === "asc") {
              return compareA > compareB ? 1 : -1;
            } else {
              return compareA > compareB ? -1 : 1;
            }
          } else if (this.sortMethod === "progress") {
            if (this.sortDir === "asc") {
              return a.shardPercent > b.shardPercent ? 1 : -1;
            } else {
              return a.shardPercent > b.shardPercent ? -1 : 1;
            }
          } else if (this.sortMethod === "owned") {
            if (this.sortDir === "asc") {
              return a.ownedShards > b.ownedShards ? 1 : -1;
            } else {
              return a.ownedShards > b.ownedShards ? -1 : 1;
            }
          } else if (this.sortMethod === "remaining") {
            if (this.sortDir === "asc") {
              return a.remainingShards > b.remainingShards ? 1 : -1;
            } else {
              return a.remainingShards > b.remainingShards ? -1 : 1;
            }
          } else if (this.sortMethod === "time") {
            if (this.sortDir === "asc") {
              return this.estimatedTime(a) > this.estimatedTime(b) ? 1 : -1;
            } else {
              return this.estimatedTime(a) > this.estimatedTime(b) ? -1 : 1;
            }
          }
          return 0;
        });
    },
    orderedPriorityList(): Unit[] {
      return unitsByPriority(this.units, []);
    },
  },
  methods: {
    ...mapActions("guild", ["initialize"]),
    estimatedTime,
    refresh() {
      this.loading = true;
      this.orderedPriorityList.forEach((unit) => {
        unit.estimatedTime = this.estimatedTime(unit);
      });
      this.loading = false;
    },
  },
  async created() {
    await this.initialize();
    if (this.loadOnCreation) {
      this.refresh();
    }
  },
});
</script>

<style lang="scss" scoped></style>
