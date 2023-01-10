<template>
  <Loading :state="loading ? 'LOADING' : 'READY'" size="md">
    <table
      class="table table-bordered table-dark table-sm table-striped swgoh-table"
    >
      <thead class="sticky-header show-on-mobile">
        <tr class="sort-methods" v-if="showUnitName">
          <th class="show-on-mobile">
            <SortMethods
              :sortByOptions="sortByOptions"
              :sortMethod="sortMethod"
              :sortDir="sortDir"
              showSearch
              @methodChange="sortMethod = $event"
              @directionChange="sortDir = $event"
              @searchChange="searchText = $event"
            />
          </th>
        </tr>
        <ColumnHeaders
          class="text-center align-middle"
          :headers="headers"
          @searchChange="searchText = $event"
        />
      </thead>
      <tbody>
        <tr
          v-for="unit in filteredUnitList"
          :key="unit.id"
          class="text-center align-middle"
        >
          <td v-if="showUnitName && showCol('name')">
            <UnitIcon :unit="unit" isLink :hideImage="simpleView" />
          </td>
          <td v-if="showCol('owned')">
            <div class="input-group input-group-sm">
              <span class="input-group-text row-label">Shards Owned:</span>
              <ShardsOwned :unit="unit" class="shards-owned" />
            </div>
          </td>
          <td v-if="showCol('remaining')">
            <span class="row-label">Shards Remaining:</span>
            {{ unit.remainingShards }}
          </td>
          <td v-if="showCol('progress')">
            <ProgressBar :percent="unit.shardPercent" />
          </td>
          <td v-if="showCol('wallet')">
            <template v-for="currency in currencyTypes" :key="currency">
              <div
                class="input-group input-group-sm"
                v-if="unit.currencyTypes.includes(currency)"
              >
                <span class="input-group-text row-label flex">
                  Wallet
                  <img
                    class="currency-img"
                    :src="`./images/${currency}.png`"
                    v-if="['get1', 'get2', 'get3'].includes(currency)"
                  />
                </span>
                <Wallet :currencyType="currency" class="wallet-input" />
              </div>
            </template>
          </td>
          <td v-if="showCol('dailyCurrency')">
            <template v-for="currency in currencyTypes" :key="currency">
              <template v-if="unit.currencyTypes.includes(currency)">
                <div class="input-group input-group-sm">
                  <span class="input-group-text row-label">
                    Daily Currency:
                    <img
                      class="currency-img"
                      :src="`./images/${currency}.png`"
                      v-if="['get1', 'get2', 'get3'].includes(currency)"
                    />
                  </span>
                  <DailyCurrency
                    :currencyType="currency"
                    :allowEdit="!['get1', 'get2', 'get3'].includes(currency)"
                  />
                </div>
              </template>
            </template>
          </td>
          <td v-if="showCol('remainingCurrency')">
            <template v-for="currency in currencyTypes" :key="currency">
              <template v-if="unit.currencyTypes.includes(currency)">
                <span class="row-label me-1">Remaining Currency:</span>
                <img class="currency-img" :src="`./images/${currency}.png`" />
                {{ remainingCurrency(unit, currency) }}
              </template>
            </template>
          </td>
          <td v-if="showUnitName && showCol('time')">
            <span class="row-label">Completion Date: </span>
            <Timestamp
              :timeLength="unit.estimatedTime"
              displayClasses="d-inline"
            />
          </td>
          <td v-if="showCol('priority')">
            <div class="input-group input-group-sm">
              <span class="input-group-text row-label">Priority:</span>
              <ShardPriority
                :unit="unit"
                :nodeTableNames="nodeTableNames"
                class="priority-input"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </Loading>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs } from "vue";

import ShardsOwned from "../shardsOwned.vue";
import UnitIcon from "components/units/unitIcon.vue";
import NodesPerDay from "../nodesPerDay.vue";
import ShardPriority from "../shardPriority.vue";
import Timestamp from "components/timestamp.vue";
import Wallet from "../wallet.vue";
import DailyCurrency from "../dailyCurrency.vue";
import { Unit, unitsByPriority } from "types/unit";
import { mapState } from "vuex";
import { CurrencyTypeConfig, estimatedTime } from "types/currency";
import { setupColumnEvents, setupSorting } from "utils";
import { iHeader } from "types/general";

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
  components: {
    ShardsOwned,
    UnitIcon,
    NodesPerDay,
    Timestamp,
    ShardPriority,
    Wallet,
    DailyCurrency,
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
      type: Array as PropType<CurrencyTypeConfig[]>,
      required: true,
      validator: (arr: any[]) => {
        return arr.every((x) => {
          return typeof x === "string";
        });
      },
    },
    nodeTableNames: {
      type: Array as PropType<string[]>,
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
      sortByOptions: [
        {
          value: "name",
          label: "Name",
          show: this.showUnitName,
        },
        {
          value: "location",
          label: "Location",
        },
        {
          value: "progress",
          label: "Progress",
        },
        {
          value: "time",
          label: "Time Remaining",
        },
      ],
    };
  },
  computed: {
    ...mapState("currency", ["wallet", "dailyCurrency"]),
    headers(): iHeader[] {
      return [
        {
          label: "Unit Name",
          show: this.showUnitName && this.showCol("name"),
          input: {
            type: "input",
            classes: "mx-auto my-1 w-75",
            placeholder: "Search",
          },
          icon: this.sortIcon("name"),
          click: () => {
            this.sortBy("name");
          },
        },
        {
          label: "Shards Owned",
          show: this.showCol("owned"),
          icon: this.sortIcon("owned"),
          click: () => {
            this.sortBy("owned");
          },
        },
        {
          label: "Shards Remaining",
          show: this.showCol("remaining"),
          icon: this.sortIcon("remaining"),
          click: () => {
            this.sortBy("remaining");
          },
        },
        {
          label: "Progress",
          show: this.showCol("progress"),
          icon: this.sortIcon("progress"),
          click: () => {
            this.sortBy("progress");
          },
        },
        {
          label: "Currency Owned",
          show: this.showCol("wallet"),
          icon: this.sortIcon("wallet"),
          click: () => {
            this.sortBy("wallet");
          },
        },
        {
          label: "Daily Currency Obtained",
          show: this.showUnitName && this.showCol("dailyCurrency"),
          icon: this.sortIcon("dailyCurrency"),
          click: () => {
            this.sortBy("dailyCurrency");
          },
        },
        {
          label: "Remaining Currency",
          show: this.showCol("remainingCurreny"),
          icon: this.sortIcon("remainingCurreny"),
          click: () => {
            this.sortBy("remainingCurreny");
          },
        },
        {
          label: "Est. Time",
          show: this.showCol("time"),
          icon: this.sortIcon("time"),
          click: () => {
            this.sortBy("time");
          },
        },
        {
          label: "Priority",
          show: this.showCol("priority"),
          icon: this.sortIcon("priority"),
          maxWidth: "150px",
          click: () => {
            this.sortBy("priority");
          },
        },
      ];
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
          } else if (this.sortMethod === "time") {
            if (this.sortDir === "asc") {
              return a.estimatedTime > b.estimatedTime ? 1 : -1;
            } else {
              return a.estimatedTime > b.estimatedTime ? -1 : 1;
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
          } else if (this.sortMethod === "wallet") {
            for (let i = 0; i <= this.currencyTypes.length; i++) {
              const currency = (this.currencyTypes as CurrencyTypeConfig[])[i];
              const includesA = a.currencyTypes.includes(currency);
              const includesB = a.currencyTypes.includes(currency);

              if (includesA && includesB) {
                return 0;
              } else if (includesA) {
                return this.sortDir === "asc" ? 1 : -1;
              } else if (includesB) {
                return this.sortDir === "asc" ? -1 : 1;
              }
            }
          } else if (this.sortMethod === "dailyCurrency") {
            let amountA = 0;
            let amountB = 0;
            for (let i = 0; i <= this.currencyTypes.length; i++) {
              const currency = (this.currencyTypes as CurrencyTypeConfig[])[i];
              const includesA = a.currencyTypes.includes(currency);
              const includesB = b.currencyTypes.includes(currency);
              // const amount = this.dailyCurrency[currency];

              if (includesA && includesB) {
                amountA = this.dailyCurrency[currency];
                amountB = this.dailyCurrency[currency];
              } else if (includesA) {
                amountA = this.dailyCurrency[currency];
              } else if (includesB) {
                amountB = this.dailyCurrency[currency];
              }
            }

            if (amountA > amountB) {
              return this.sortDir === "asc" ? 1 : -1;
            } else if (amountB > amountA) {
              return this.sortDir === "asc" ? -1 : 1;
            }
          } else if (this.sortMethod === "remainingCurrency") {
            for (let i = 0; i <= this.currencyTypes.length; i++) {
              const currency = (this.currencyTypes as CurrencyTypeConfig[])[i];
              const remainingA = this.remainingCurrency(a, currency);
              const remainingB = this.remainingCurrency(b, currency);

              if (remainingA > remainingB) {
                return this.sortDir === "asc" ? 1 : -1;
              } else if (remainingB > remainingA) {
                return this.sortDir === "asc" ? -1 : 1;
              }
            }
          } else if (this.sortMethod === "priority") {
            const priorityA = a.tablePriority(this.nodeTableNames);
            const priorityB = b.tablePriority(this.nodeTableNames);

            if (priorityA <= 0) {
              return this.sortDir === "asc" ? 1 : -1;
            } else if (priorityB <= 0) {
              return this.sortDir === "asc" ? -1 : 1;
            } else if (this.sortDir === "asc") {
              return priorityA > priorityB ? 1 : -1;
            } else {
              return priorityA > priorityB ? -1 : 1;
            }
          }
          return 0;
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
.currency-img {
  max-width: 30px;
}
</style>
