<template>
  <div class="collapse show" id="relicSection">
    <Loading :state="requestState" size="md" message="Loading Gear Data">
      <h3 class="gear-header">
        Relic Mats Needed to get {{ unit.name }} from Relic Level
        {{ currentRelicLevel }} to
        <select v-model.number="relicTarget">
          <option v-for="num in relicOptions" :value="num" :key="num">
            Relic {{ num }}
          </option>
        </select>
        :
      </h3>
      <h3>
        It will take approximately {{ totalDays }} days to get to Relic Level
        {{ relicTarget }}.
      </h3>
      <div class="input-group input-group-sm w-50 mb-3">
        <span
          class="input-group-text c-help energy-text"
          title="Energy used on Light and Dark side tables"
          >Cantina Energy:</span
        >
        <span
          class="input-group-text c-help"
          title="How many times you refresh the energy using crystals"
          >Daily Refreshes:</span
        >
        <input
          class="form-control"
          type="number"
          v-model.number="refreshes.cantina"
          min="0"
        />
        <span
          class="input-group-text c-help"
          title="How much of your daily cantina energy used for farming other things (i.e. character shards)"
          >Daily Energy Used:</span
        >
        <input
          class="form-control"
          type="number"
          v-model.number="energy.cantina"
          min="0"
          :max="165 + refreshes.cantina * 120"
        />
      </div>
      <table class="table table-bordered table-dark table-sm table-striped">
        <thead>
          <tr class="text-center">
            <th width="20%">
              <div class="c-pointer" @click="sortBy('name')">
                Mat Name
                <i class="fas mx-1" :class="sortIcon('name')"></i>
              </div>
              <input
                class="form-control form-control-sm mx-auto my-1 w-75"
                placeholder="Search"
                v-model="searchName"
              />
            </th>
            <th width="20%" class="c-pointer" @click="sortBy('location')">
              Locations
              <i class="fas mx-1" :class="sortIcon('location')"></i>
            </th>
            <th width="20%" class="c-pointer" @click="sortBy('amount')">
              Amount
              <i class="fas mx-1" :class="sortIcon('amount')"></i>
            </th>
            <th width="10%" class="c-pointer" @click="sortBy('time')">
              Est. Time
              <i class="fas mx-1" :class="sortIcon('time')"></i>
            </th>
            <!-- <th width="15%">Actions</th> -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="mat in filteredRelics" :key="mat.id">
            <td class="text-center">
              <RelicIcon :item="mat" />
            </td>
            <td class="text-center align-middle">{{ mat.location.node }}</td>
            <td>
              <OwnedAmount :item="mat" :needed="amountNeeded(mat)" />
            </td>
            <td class="text-center align-middle">
              {{ timeEstimation(mat) }} Days
            </td>
            <!-- <td>
              <div class="btn-group btn-group-sm" role="group">
                <button type="button" class="btn btn-primary">Left</button>
                <button type="button" class="btn btn-secondary">Middle</button>
                <button type="button" class="btn btn-info">Right</button>
              </div>
            </td> -->
          </tr>
        </tbody>
      </table>
    </Loading>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";

import { Relic } from "../../types/relic";
import OwnedAmount from "./owned.vue";
import RelicIcon from "./relicIcon.vue";
import Loading from "../loading.vue";

export default defineComponent({
  name: "RelicPlannerComponent",
  components: { OwnedAmount, RelicIcon, Loading },
  data() {
    return {
      refreshes: {
        cantina: 0,
      },
      energy: {
        cantina: 0,
      },
      relicTarget: 7,
      sortMethod: "",
      sortDir: "asc",
      searchName: "",
    };
  },
  computed: {
    ...mapState("unit", ["unit"]),
    ...mapState("relic", ["requestState", "ownedRelics", "relicConfig"]),
    totalDays(): number {
      return (Object.values(this.relicConfig) as Array<Relic>).reduce(
        (acc, el) => {
          return acc + this.timeEstimation(el);
        },
        0
      );
    },
    relicOptions(): number[] {
      const list = [];
      for (let i = this.currentRelicLevel; i <= 9; i++) {
        list.push(i);
      }
      return list;
    },
    currentRelicLevel(): number {
      return this.unit?.relic_tier || 1;
    },
    filteredRelics(): Relic[] {
      const list: Relic[] = Object.values(this.relicConfig);
      return list
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
          } else if (this.sortMethod === "amount") {
            const compareA = this.amountNeeded(a);
            const compareB = this.amountNeeded(b);
            if (this.sortDir === "asc") {
              return compareA - compareB;
            } else {
              return compareB - compareA;
            }
          } else if (this.sortMethod === "time") {
            const compareA = this.timeEstimation(a);
            const compareB = this.timeEstimation(b);
            if (this.sortDir === "asc") {
              return compareA - compareB;
            } else {
              return compareB - compareA;
            }
          }
          return 0;
        })
        .filter((relic) => {
          const name = relic.name.toLowerCase().replace(/\s/g, "");
          const id = relic.id.toLowerCase().replace(/\s/g, "");
          const compare = this.searchName.toLowerCase().replace(/\s/g, "");
          return name.includes(compare) || id.includes(compare);
        });
    },
  },
  methods: {
    timeEstimation(mat: Relic): number {
      const owned: number = this.ownedRelics[mat.id] || 0;
      const totalAmount: number = this.amountNeeded(mat);
      const remaining: number = totalAmount - owned;

      if (remaining > 0) {
        const totalEnergy =
          120 + 45 + 120 * this.refreshes.cantina - this.energy.cantina;
        const triesPerDay = totalEnergy / mat.location.energy;
        const amountPerDay = triesPerDay * mat.dropRate;
        return Math.round(remaining / amountPerDay);
      } else {
        return 0;
      }
    },
    amountNeeded(mat: Relic): number {
      const amountMap = mat.amount;
      let amount = 0;
      for (let i = this.currentRelicLevel; i <= this.relicTarget; i++) {
        const key = i.toString();
        if (i in amountMap) {
          amount += amountMap[key];
        }
      }
      return amount;
    },
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
  },
});
</script>

<style lang="scss" scoped>
.gear-header {
  select {
    width: 115px;
    font-size: 1.25rem;
  }
}

table {
  thead {
    tr {
      vertical-align: top;
    }
  }
}

.collapse-header {
  text-shadow: 2px 2px 2px black;

  a {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}

.energy-text {
  width: 130px;
  display: block;
}
</style>
