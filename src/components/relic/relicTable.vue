<template>
  <table class="table table-bordered table-dark table-sm table-striped">
    <thead>
      <tr class="text-center align-middle">
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
      </tr>
    </thead>
    <tbody>
      <tr v-for="mat in filteredRelics" :key="mat.id">
        <td class="text-center">
          <RelicIcon :item="mat" />
        </td>
        <td class="text-center align-middle">{{ mat.location.node }}</td>
        <td>
          <OwnedAmount :item="mat" :needed="amountNeeded(mat, targetLevels)" />
        </td>
        <td class="text-center align-middle">
          {{ timeEstimation(mat, targetLevels) }}
          Days
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { mapGetters, mapState } from "vuex";

import { Relic } from "../../types/relic";
import OwnedAmount from "./owned.vue";
import RelicIcon from "./relicIcon.vue";

export default defineComponent({
  name: "RelicTable",
  components: { OwnedAmount, RelicIcon },
  props: {
    relicList: {
      required: true,
      type: Object as PropType<Relic[]>,
    },
    targetLevels: {
      required: true,
      type: Array,
      validator: (arr: any[]) => {
        return arr.every((x) => {
          return "level" in x && "target" in x;
        });
      },
    },
  },
  data() {
    return {
      sortMethod: "",
      sortDir: "asc",
      searchName: "",
    };
  },
  computed: {
    ...mapGetters("relic", ["timeEstimation", "amountNeeded"]),
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
          } else if (this.sortMethod === "amount") {
            //need to pass an array to these functions
            const compareA = this.amountNeeded(a);
            const compareB = this.amountNeeded(b);
            if (this.sortDir === "asc") {
              return compareA - compareB;
            } else {
              return compareB - compareA;
            }
          } else if (this.sortMethod === "time") {
            //need to pass an array to these functions
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
        .filter((relic: Relic) => {
          const name = relic.name.toLowerCase().replace(/\s/g, "");
          const id = relic.id.toLowerCase().replace(/\s/g, "");
          const compare = this.searchName.toLowerCase().replace(/\s/g, "");
          return name.includes(compare) || id.includes(compare);
        });
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
  },
});
</script>
