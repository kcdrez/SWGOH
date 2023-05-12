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
import { setupColumnEvents, setupSorting, sortValues } from "utils";
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
                show: this.showCol("shardPercent"),
                sortMethodShow: true,
                icon: this.sortIcon("shardPercent"),
                value: "shardPercent",
                click: () => {
                  this.sortBy("shardPercent");
                },
              },
              {
                label: "Est. Time",
                show: this.showUnitName && this.showCol("estimatedTime"),
                sortMethodShow: this.showUnitName,
                icon: this.sortIcon("estimatedTime"),
                value: "estimatedTime",
                click: () => {
                  this.sortBy("estimatedTime");
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
                show: this.showCol("ownedShards"),
                type: "shardsOwned",
                data: { unit },
              },
              {
                show: this.showCol("remainingShards"),
                label: "Remaining Shards:",
                data: unit.remainingShards,
              },
              {
                show: this.showCol("shardPercent"),
                type: "progress",
                data: unit.shardPercent,
              },
              {
                show: this.showUnitName && this.showCol("estimatedTime"),
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
          if (this.sortMethod === "estimatedTime") {
            return sortValues(
              this.estimatedTime(a),
              this.estimatedTime(b),
              this.sortDir,
              this.sortMethod
            );
          }
          return sortValues(a, b, this.sortDir, this.sortMethod);
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
