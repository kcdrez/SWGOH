<template>
  <Loading :state="loading ? 'LOADING' : 'READY'" size="md">
    <SwgohTable :table="{ header, body }" />
  </Loading>
</template>

<script lang="ts">
import { defineComponent, toRefs } from "vue";

import { Unit } from "types/unit";
import { estimatedTime } from "types/shards";
import { setupColumnEvents, setupSorting, sortValues } from "utils";
import { iTableBody, iTableHead } from "types/general";

export default defineComponent({
  name: "ShardTable",
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
    showPriority: {
      type: Boolean,
      default: false,
    },
    showActions: {
      type: Boolean,
      default: false,
    },
    nodeTableNames: {
      type: Array as () => string[],
      default: () => {
        return [];
      },
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
                maxWidth: "750px",
                value: "name",
                input: {
                  label: "Search",
                  type: "input",
                  classes: "mx-auto my-1 w-75",
                  placeholder: "Search by Name",
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
                sortMethodShow: false,
                value: "locations",
              },
              {
                label: "Shards Owned",
                show: this.showCol("ownedShards"),
                sortMethodShow: true,
                icon: this.sortIcon("ownedShards"),
                value: "ownedShards",
                click: () => {
                  this.sortBy("ownedShards");
                },
              },
              {
                label: "Shards Remaining",
                show: this.showCol("remainingShards"),
                sortMethodShow: true,
                icon: this.sortIcon("remainingShards"),
                value: "remainingShards",
                click: () => {
                  this.sortBy("remainingShards");
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
                label: "Node Attempts per Day",
                show: this.showCol("attempts"),
              },
              {
                label: "Est. Time",
                show: this.showUnitName && this.showCol("estimatedTime"),
                sortMethodShow: true,
                icon: this.sortIcon("estimatedTime"),
                value: "estimatedTime",
                click: () => {
                  this.sortBy("estimatedTime");
                },
              },
              {
                label: "Priority",
                show: this.showCol("priority") && this.showPriority,
                sortMethodShow: this.showPriority,
                icon: this.sortIcon("priority"),
                maxWidth: "150px",
                value: "priority",
                click: () => {
                  this.sortBy("priority");
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
                classes: "text-left text-center-sm farming-locations",
                zeroState: {
                  show: unit.locations.length <= 0,
                  message: "No known farmable locations.",
                },
                label: "Farming Locations:",
                type: "list",
                data: {
                  list: unit.locations.map((location, index) => {
                    return {
                      id: index,
                      message: location,
                    };
                  }),
                  classes: "m-0",
                },
              },
              {
                show: this.showCol("ownedShards"),
                type: "shardsOwned",
                data: { unit },
              },
              {
                show: this.showCol("remainingShards"),
                label: "Shards Remaining:",
                data: unit.remainingShards,
              },
              {
                show: this.showCol("progress"),
                type: "progress",
                data: unit.shardPercent,
                classes: "progress-cell",
              },
              {
                classes: "nodes-per-day",
                show: this.showCol("attempts"),
                label: "Node Attempts per Day:",
                type: "nodes",
                data: { unit },
              },
              {
                show: this.showUnitName && this.showCol("estimatedTime"),
                label: "Completion Date:",
                type: "time",
                data: {
                  timestamp: unit.estimatedTime,
                  classes: "d-inline",
                },
              },
              {
                show: this.showPriority && this.showCol("priority"),
                type: "priority",
                data: {
                  unit,
                  nodeTableNames: this.nodeTableNames,
                  classes: "priority-input",
                },
              },
              {
                show: this.showCol("actions") && this.showActions,
                type: "buttons",
                data: {
                  buttons: [
                    {
                      click: () => {
                        unit.tracking = true;
                      },
                      icon: "fas fa-heart",
                      classes: "btn btn-success",
                      hide: !unit.tracking,
                      title: "Add to active farming list",
                    },
                    {
                      click: () => {
                        unit.tracking = false;
                      },
                      icon: "fas fa-trash",
                      classes: "btn btn-danger",
                      hide: !unit.tracking,
                      title: "Remove from active farming list",
                    },
                  ],
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
          if (this.sortMethod === "progress") {
            return sortValues(
              a.shardPercent,
              b.shardPercent,
              this.sortDir,
              this.sortMethod
            );
          } else if (this.sortMethod === "priority") {
            return sortValues(
              a.tablePriority(this.nodeTableNames),
              b.tablePriority(this.nodeTableNames),
              this.sortDir,
              this.sortMethod
            );
          }
          return sortValues(a, b, this.sortDir, this.sortMethod);
        });
    },
  },
  methods: {
    refresh() {
      this.loading = true;
      estimatedTime(this.units, this.nodeTableNames);
      this.loading = false;
    },
  },
  created() {
    if (this.loadOnCreation) {
      this.refresh();
    }
  },
});
</script>

<style lang="scss" scoped>
::v-deep(.progress-cell) {
  min-width: 125px;
}
</style>
