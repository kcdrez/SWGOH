<template>
  <Loading :state="loading ? 'LOADING' : 'READY'" size="md">
    <SwgohTable :table="{ header, body }" />
  </Loading>
</template>

<script lang="ts">
import { defineComponent, toRefs } from "vue";

import { Unit, unitsByPriority } from "types/unit";
import { mapState } from "vuex";
import { CurrencyTypeConfig, estimatedTime } from "types/currency";
import { setupColumnEvents, setupSorting, sortValues } from "utils";
import { iTableBody, iTableHead } from "types/general";

export default defineComponent({
  name: "StoreTable",
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
      validator: (arr: any[]) => {
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
    currencyTypes: {
      type: Array as () => CurrencyTypeConfig[],
      required: true,
      validator: (arr: any[]) => {
        return arr.every((x) => {
          return typeof x === "string";
        });
      },
    },
    nodeTableNames: {
      type: Array as () => string[],
      default: () => {
        return [];
      },
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
    ...mapState("currency", ["wallet", "dailyCurrency"]),
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
                  placeholder: "Search",
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
                label: "Currency Owned",
                show: this.showCol("wallet"),
                sortMethodShow: true,
                icon: this.sortIcon("wallet"),
                value: "wallet",
                click: () => {
                  this.sortBy("wallet");
                },
              },
              {
                label: "Daily Currency Obtained",
                show: this.showUnitName && this.showCol("dailyCurrency"),
                sortMethodShow: this.showUnitName,
                icon: this.sortIcon("dailyCurrency"),
                value: "dailyCurrency",
                click: () => {
                  this.sortBy("dailyCurrency");
                },
              },
              {
                label: "Remaining Currency",
                show: this.showCol("remainingCurrency"),
                sortMethodShow: true,
                icon: this.sortIcon("remainingCurrency"),
                value: "remainingCurrency",
                click: () => {
                  this.sortBy("remainingCurrency");
                },
              },
              {
                label: "Est. Time",
                show: this.showCol("estimatedTime"),
                sortMethodShow: true,
                icon: this.sortIcon("estimatedTime"),
                value: "estimatedTime",
                click: () => {
                  this.sortBy("estimatedTime");
                },
              },
              {
                label: "Priority",
                show: this.showCol("priority"),
                sortMethodShow: true,
                icon: this.sortIcon("priority"),
                maxWidth: "150px",
                value: "priority",
                click: () => {
                  this.sortBy("priority");
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
                  isLink: true,
                  unit,
                  hideImage: this.simpleView,
                },
              },
              {
                show: this.showCol("ownedShards"),
                type: "shardsOwned",
                data: { unit },
              },
              {
                show: this.showCol("remainingShards"),
                label: "Shards Remaining",
                data: unit.remainingShards,
              },
              {
                show: this.showCol("shardPercent"),
                type: "progress",
                data: unit.shardPercent,
              },
              {
                show: this.showCol("wallet"),
                type: "currencyList",
                data: {
                  currencyTypes: this.currencyTypes,
                  unit,
                },
              },
              {
                show: this.showCol("dailyCurrency"),
                type: "dailyCurrency",
                data: {
                  unit,
                  currencyTypes: this.currencyTypes,
                },
              },
              {
                show: this.showCol("remainingCurrency"),
                type: "remainingCurrency",
                data: {
                  currencyTypes: this.currencyTypes,
                  unit,
                },
              },
              {
                show: this.showUnitName && this.showCol("estimatedTime"),
                type: "time",
                label: "Completion Date:",
                data: {
                  timestamp: unit.estimatedTime,
                  classes: "d-inline",
                },
              },
              {
                show: this.showCol("priority"),
                type: "priority",
                label: "Priority:",
                data: {
                  unit,
                  nodeTableNames: this.nodeTableNames,
                  classes: "priority-input",
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
          if (this.sortMethod === "wallet") {
            for (let i = 0; i <= this.currencyTypes.length; i++) {
              const currency = this.currencyTypes[i];
              const includesA = a.currencyTypes.includes(currency);
              const includesB = a.currencyTypes.includes(currency);

              if (includesA || includesB) {
                return sortValues(
                  includesA,
                  includesB,
                  this.sortDir,
                  this.sortMethod
                );
              }
            }
          } else if (this.sortMethod === "dailyCurrency") {
            let amountA = 0;
            let amountB = 0;
            for (let i = 0; i <= this.currencyTypes.length; i++) {
              const currency = (this.currencyTypes as CurrencyTypeConfig[])[i];
              const includesA = a.currencyTypes.includes(currency);
              const includesB = b.currencyTypes.includes(currency);

              if (includesA && includesB) {
                amountA = this.dailyCurrency[currency];
                amountB = this.dailyCurrency[currency];
              } else if (includesA) {
                amountA = this.dailyCurrency[currency];
              } else if (includesB) {
                amountB = this.dailyCurrency[currency];
              }
            }

            return sortValues(amountA, amountB, this.sortDir, this.sortMethod);
          } else if (this.sortMethod === "remainingCurrency") {
            for (let i = 0; i <= this.currencyTypes.length; i++) {
              const currency = (this.currencyTypes as CurrencyTypeConfig[])[i];
              const remainingA = this.remainingCurrency(a, currency);
              const remainingB = this.remainingCurrency(b, currency);

              if (remainingA !== remainingB) {
                return sortValues(
                  remainingA,
                  remainingB,
                  this.sortDir,
                  this.sortMethod
                );
              }
            }
          } else if (this.sortMethod === "priority") {
            const priorityA = a.tablePriority(this.nodeTableNames);
            const priorityB = b.tablePriority(this.nodeTableNames);
            return sortValues(
              priorityA,
              priorityB,
              this.sortDir,
              this.sortMethod
            );
          }
          return sortValues(a, b, this.sortDir, this.sortMethod);
        });
    },
    orderedPriorityList(): Unit[] {
      return unitsByPriority(this.units, this.nodeTableNames);
    },
  },
  methods: {
    remainingCurrency(unit: Unit, currencyType: CurrencyTypeConfig) {
      const location = unit.whereToFarm.find(
        (l) => l.currencyType === currencyType
      );
      if (location) {
        const currentWallet = this.wallet[currencyType] ?? 0;
        const character = location.characters.find((c) => c.id === unit.id);
        let costPerShard = 0;
        if (character && character.shardCount && character.cost) {
          costPerShard = character.cost / character.shardCount;
        }
        const totalCost = unit.remainingShards * costPerShard;
        return Math.max(currentWallet - totalCost, 0);
      } else {
        return 0;
      }
    },
    refresh() {
      this.loading = true;
      this.orderedPriorityList.forEach((unit) => {
        unit.estimatedTime = estimatedTime(
          unit,
          this.currencyTypes as CurrencyTypeConfig[],
          this.nodeTableNames,
          this.units
        );
      });
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
.select-columns {
  width: 200px;
  margin-left: auto;
  margin-bottom: 0.25rem;
}
</style>
