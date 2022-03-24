<template>
  <div>
    <table
      class="table table-bordered table-dark table-sm table-striped swgoh-table"
    >
      <thead class="sticky-header show-on-mobile">
        <tr class="sort-methods" v-if="showUnitName">
          <th class="show-on-mobile">
            <div class="input-group input-group-sm my-2">
              <span class="input-group-text">Sort By:</span>
              <select
                class="form-control"
                @change="sortMethod = $event.target.value"
              >
                <option value="name" v-if="showUnitName">Name</option>
                <option value="location">Location</option>
                <option value="progress">Progress</option>
                <option value="time">Time Remaining</option>
              </select>
            </div>
            <div class="input-group input-group-sm my-2">
              <span class="input-group-text">Sort Direction:</span>
              <select
                class="form-control"
                @change="sortDir = $event.target.value"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
            <div class="input-group input-group-sm my-2">
              <span class="input-group-text">Search:</span>
              <input
                class="form-control"
                v-model="searchText"
                placeholder="Search by name"
              />
            </div>
          </th>
        </tr>
        <tr class="text-center align-middle">
          <th v-if="showUnitName && showCol('name')">
            <div class="c-pointer" @click="sortBy('name')">
              Unit Name
              <i class="fas mx-1" :class="sortIcon('name')"></i>
            </div>
            <input
              class="form-control form-control-sm mx-auto my-1 w-75"
              placeholder="Search"
              v-model="searchText"
            />
          </th>
          <th
            class="c-pointer"
            v-if="showCol('owned')"
            @click="sortBy('owned')"
          >
            <span>Shards Owned</span>
            <i class="fas mx-2" :class="sortIcon('owned')"></i>
          </th>
          <th
            class="c-pointer"
            v-if="showCol('remaining')"
            @click="sortBy('remaining')"
          >
            <span>Shards Remaining</span>
            <i class="fas mx-2" :class="sortIcon('remaining')"></i>
          </th>
          <th
            v-if="showCol('progress')"
            class="c-pointer"
            @click="sortBy('progress')"
          >
            Progress
            <i class="fas mx-1" :class="sortIcon('progress')"></i>
          </th>
          <th
            v-if="showCol('wallet')"
            class="c-pointer"
            @click="sortBy('wallet')"
          >
            <span>Currency Owned</span>
            <i class="fas mx-2" :class="sortIcon('wallet')"></i>
          </th>
          <th
            v-if="showCol('dailyCurrency')"
            @click="sortBy('dailyCurrency')"
            class="c-pointer"
          >
            <span>Daily Currency Obtained</span>
            <i class="fas mx-2" :class="sortIcon('dailyCurrency')"></i>
          </th>
          <th
            v-if="showCol('remainingCurrency')"
            class="c-pointer"
            @click="sortBy('remainingCurrency')"
          >
            Remaining Currency
            <i class="fas mx-1" :class="sortIcon('remainingCurrency')"></i>
          </th>
          <th
            class="c-pointer"
            @click="sortBy('time')"
            v-if="showUnitName && showCol('time')"
          >
            Est. Time
            <i class="fas mx-1" :class="sortIcon('time')"></i>
          </th>
          <th
            v-if="showCol('priority')"
            width="150px"
            class="c-pointer"
            @click="sortBy('priority')"
          >
            <span>Priority</span>
            <i class="fas mx-2" :class="sortIcon('priority')"></i>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="unit in filteredUnitList" :key="unit.id">
          <td
            class="text-center align-middle"
            v-if="showUnitName && showCol('name')"
          >
            <UnitIcon :unit="unit" isLink :hideImage="simpleView" />
          </td>
          <td class="align-middle" v-if="showCol('owned')">
            <div class="input-group input-group-sm">
              <span class="input-group-text row-label">Shards Owned:</span>
              <ShardsOwned :unit="unit" class="shards-owned" />
            </div>
          </td>
          <td class="align-middle text-center" v-if="showCol('remaining')">
            <span class="row-label">Shards Remaining:</span>
            {{ unit.remainingShards }}
          </td>
          <td class="align-middle" v-if="showCol('progress')">
            <ProgressBar :percent="unit.shardPercent" />
          </td>
          <td class="align-middle" v-if="showCol('wallet')">
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
                    v-if="['get1', 'get2'].includes(currency)"
                  />
                </span>
                <Wallet :currencyType="currency" class="wallet-input" />
              </div>
            </template>
          </td>
          <td class="align-middle text-center" v-if="showCol('dailyCurrency')">
            <template v-for="currency in currencyTypes" :key="currency">
              <template v-if="unit.currencyTypes.includes(currency)">
                <div class="input-group input-group-sm">
                  <span class="input-group-text row-label">
                    Daily Currency:
                    <img
                      class="currency-img"
                      :src="`./images/${currency}.png`"
                      v-if="['get1', 'get2'].includes(currency)"
                    />
                  </span>
                  <DailyCurrency
                    class="d-inline"
                    :currencyType="currency"
                    :allowEdit="!['get1', 'get2'].includes(currency)"
                  />
                </div>
              </template>
            </template>
          </td>
          <td
            class="align-middle text-center"
            v-if="showCol('remainingCurrency')"
          >
            <template v-for="currency in currencyTypes" :key="currency">
              <template v-if="unit.currencyTypes.includes(currency)">
                <span class="row-label me-1">Remaining Currency:</span>
                <img class="currency-img" :src="`./images/${currency}.png`" />
                {{ remainingCurrency(unit, currency) }}
              </template>
            </template>
          </td>
          <td
            class="text-center align-middle"
            v-if="showUnitName && showCol('time')"
          >
            <span class="row-label">Completion Date: </span>
            <Timestamp
              :timeLength="estimatedTime(unit)"
              displayClasses="d-inline"
            />
          </td>
          <td class="align-middle" v-if="showCol('priority')">
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
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import ShardsOwned from "../shardsOwned.vue";
import UnitIcon from "../../units/unitIcon.vue";
import NodesPerDay from "../nodesPerDay.vue";
import ShardPriority from "../shardPriority.vue";
import Timestamp from "../../timestamp.vue";
import Wallet from "../wallet.vue";
import DailyCurrency from "../dailyCurrency.vue";
import { Unit } from "../../../types/unit";
import { mapState } from "vuex";
import { CurrencyTypeConfig, estimatedTime } from "../../../types/currency";

export default defineComponent({
  name: "StoreTable",
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
      type: Object as PropType<Unit[]>,
    },
    showUnitName: {
      type: Boolean,
      default: false,
    },
    selectedColumns: {
      type: Array,
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
      type: Array,
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
  },
  data() {
    return {
      sortDir: "desc",
      sortMethod: "progress",
      searchText: "",
    };
  },
  computed: {
    ...mapState("currency", ["wallet", "dailyCurrency"]),
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
              return this.estimatedTime(a) > this.estimatedTime(b) ? 1 : -1;
            } else {
              return this.estimatedTime(a) > this.estimatedTime(b) ? -1 : 1;
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
  },
  watch: {
    sortDir() {
      this.saveSortData();
    },
    sortMethod() {
      this.saveSortData();
    },
  },
  methods: {
    sortBy(type: string): void {
      if (this.sortMethod === type) {
        this.sortDir = this.sortDir === "asc" ? "desc" : "asc";
      } else {
        this.sortDir = "asc";
      }
      this.sortMethod = type;
    },
    sortIcon(type: string): string {
      if (this.sortMethod === type) {
        return this.sortDir === "asc" ? "fa-sort-down" : "fa-sort-up";
      } else {
        return "fa-sort";
      }
    },
    showCol(key: string): boolean {
      return this.selectedColumns.some((x) => x === key);
    },
    saveSortData() {
      window.localStorage.setItem(
        this.storageKey,
        JSON.stringify({
          sortDir: this.sortDir,
          sortMethod: this.sortMethod,
        })
      );
    },
    estimatedTime(unit: Unit) {
      return estimatedTime(
        unit,
        this.currencyTypes as CurrencyTypeConfig[],
        this.nodeTableNames,
        this.units
      );
    },
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
  },
  created() {
    const storageData = JSON.parse(
      window.localStorage.getItem(this.storageKey) || "{}"
    );
    this.sortDir = storageData.sortDir ?? "asc";
    this.sortMethod = storageData.sortMethod ?? "name";
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
