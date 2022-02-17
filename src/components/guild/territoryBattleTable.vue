<template>
  <div>
    <table
      class="table table-bordered table-dark table-sm table-striped show-on-desktop"
    >
      <thead class="sticky-header">
        <tr class="text-center align-middle">
          <th width="15%">
            <div class="c-pointer" @click="sortBy('date')">
              Completion Date
              <i class="fas mx-1" :class="sortIcon('date')"></i>
            </div>
          </th>
          <th width="10%" class="c-pointer" @click="sortBy('type')">
            Battle Type
            <i class="fas mx-1" :class="sortIcon('type')"></i>
          </th>
          <th width="15%" class="c-pointer" @click="sortBy('name')">
            Name
            <i class="fas mx-1" :class="sortIcon('name')"></i>
          </th>
          <th width="10%" class="c-pointer" @click="sortBy('stars')">
            Stars
            <i class="fas mx-1" :class="sortIcon('stars')"></i>
          </th>
          <th width="15%" class="c-pointer" @click="sortBy('get1')">
            GET1 Currency
            <i class="fas mx-1" :class="sortIcon('get1')"></i>
          </th>
          <th width="15%" class="c-pointer" @click="sortBy('get2')">
            GET2 Currency
            <i class="fas mx-1" :class="sortIcon('get2')"></i>
          </th>
          <th width="20%" class="c-pointer" @click="sortBy('character')">
            Character Shards
            <i class="fas mx-1" :class="sortIcon('character')"></i>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="event in eventList"
          :key="event.id"
          class="text-center align-middle"
        >
          <td>{{ $filters.formatDate(event.date) }}</td>
          <td>{{ event.type }}</td>
          <td>{{ event.name }}</td>
          <td>{{ event.stars }}</td>
          <td>{{ event.GET1 }}</td>
          <td>{{ event.GET2 }}</td>
          <td>
            {{ event.characterShards.count }} ({{
              unitName(event.characterShards.id)
            }})
          </td>
        </tr>
        <tr class="text-center align-middle average-row">
          <td rowspan="2">Average</td>
          <td colspan="2">Light</td>
          <td>{{ averageStarsLight }}</td>
          <td>{{ averageGet1Light }}</td>
          <td>{{ averageGet2Light }}</td>
          <td>{{ averageShardsLight }}</td>
        </tr>
        <tr class="text-center align-middle average-row2">
          <td colspan="2">Dark</td>
          <td>{{ averageStarsDark }}</td>
          <td>{{ averageGet1Dark }}</td>
          <td>{{ averageGet2Dark }}</td>
          <td>{{ averageShardsDark }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import moment from "moment";
import { defineComponent } from "vue";
import { mapState, mapActions, mapGetters } from "vuex";

export default defineComponent({
  name: "TerritoryBattleTable",
  data() {
    return {
      sortDir: "asc",
      sortMethod: "date",
    };
  },
  computed: {
    ...mapGetters("unit", ["unitName"]),
    averageStarsLight(): number {
      const total = this.eventList.reduce((total, e) => {
        return e.type === "Light" ? total + e.stars : total;
      }, 0);
      return total / this.eventList.filter((e) => e.type === "Light").length;
    },
    averageStarsDark(): number {
      const total = this.eventList.reduce((total, e) => {
        return e.type === "Dark" ? total + e.stars : total;
      }, 0);
      return total / this.eventList.filter((e) => e.type === "Dark").length;
    },
    averageGet1Light(): number {
      const total = this.eventList.reduce((total, e) => {
        return e.type === "Light" ? total + e.GET1 : total;
      }, 0);
      return total / this.eventList.filter((e) => e.type === "Dark").length;
    },
    averageGet1Dark(): number {
      const total = this.eventList.reduce((total, e) => {
        return e.type === "Dark" ? total + e.GET1 : total;
      }, 0);
      return total / this.eventList.filter((e) => e.type === "Dark").length;
    },
    averageGet2Light(): number {
      const total = this.eventList.reduce((total, e) => {
        return e.type === "Light" ? total + e.GET2 : total;
      }, 0);
      return total / this.eventList.filter((e) => e.type === "Light").length;
    },
    averageGet2Dark(): number {
      const total = this.eventList.reduce((total, e) => {
        return e.type === "Dark" ? total + e.GET2 : total;
      }, 0);
      return total / this.eventList.filter((e) => e.type === "Dark").length;
    },
    averageShardsLight(): number {
      const total = this.eventList.reduce((total, e) => {
        return e.type === "Light" ? total + e.characterShards.count : total;
      }, 0);
      return total / this.eventList.filter((e) => e.type === "Light").length;
    },
    averageShardsDark(): number {
      const total = this.eventList.reduce((total, e) => {
        return e.type === "Dark" ? total + e.characterShards.count : total;
      }, 0);
      return total / this.eventList.filter((e) => e.type === "Dark").length;
    },
    eventList(): any[] {
      return [
        {
          id: "someId",
          date: moment(),
          type: "Light",
          name: "Republic Offensive",
          stars: 11,
          GET1: 4300,
          GET2: 4050,
          characterShards: { id: "KIADIMUNDI", count: 2 },
        },
        {
          id: "someId2",
          date: moment(),
          type: "Dark",
          name: "Separatist Might",
          stars: 11,
          GET1: 4300,
          GET2: 4050,
          characterShards: { id: "WATTAMBOR", count: 25 },
        },
      ];
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

<style lang="scss" scoped></style>
