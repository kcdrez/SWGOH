<template>
  <div class="container guild-events-page">
    <Loading :state="requestState" message="Loading Guild Data" size="lg">
      <div class="collapse-header section-header mt-3">
        <h3
          class="w-100"
          data-bs-toggle="collapse"
          href="#guildTerritoryWarSection"
        >
          <div class="d-inline">Territory War</div>
        </h3>
      </div>
      <div id="guildTerritoryWarSection" class="collapse">
        <table
          class="table table-bordered table-dark table-sm table-striped show-on-desktop"
        >
          <thead class="sticky-header">
            <tr class="text-center align-middle">
              <th width="20%">
                <div class="c-pointer" @click="sortBy('date')">
                  Completion Date
                  <i class="fas mx-1" :class="sortIcon('date')"></i>
                </div>
              </th>
              <th width="20%" class="c-pointer" @click="sortBy('wins')">
                Win/Loss
                <i class="fas mx-1" :class="sortIcon('wins')"></i>
              </th>
              <th width="20%" class="c-pointer" @click="sortBy('get1')">
                GET1 Currency
                <i class="fas mx-1" :class="sortIcon('get1')"></i>
              </th>
              <th width="20%" class="c-pointer" @click="sortBy('get2')">
                GET2 Currency
                <i class="fas mx-1" :class="sortIcon('get2')"></i>
              </th>
              <th width="20%" class="c-pointer" @click="sortBy('zetas')">
                Zetas
                <i class="fas mx-1" :class="sortIcon('zetas')"></i>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="event in territoryWarEvents"
              :key="event.id"
              class="text-center align-middle"
            >
              <td>{{ $filters.formatDate(event.date) }}</td>
              <td>{{ event.win ? "Win" : "Loss" }}</td>
              <td>{{ event.GET1 }}</td>
              <td>{{ event.GET2 }}</td>
              <td>{{ event.zetas }}</td>
            </tr>
            <tr class="text-center align-middle">
              <td>Average</td>
              <td>{{ averageWinRate }}%</td>
              <td>{{ averageGet1 }}</td>
              <td>{{ averageGet1 }}</td>
              <td>{{ averageZetas }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Loading>
  </div>
</template>

<script lang="ts">
import moment from "moment";
import { defineComponent } from "vue";
import { mapState, mapActions, mapGetters } from "vuex";

import { loadingState } from "../types/loading";

export default defineComponent({
  name: "GuildEventsPage",
  data() {
    return {
      sortDir: "asc",
      sortMethod: "date",
    };
  },
  computed: {
    ...mapGetters(["someLoading"]),
    requestState(): loadingState {
      return this.someLoading(["player"]);
    },
    averageWinRate(): number {
      return (
        (this.territoryWarEvents.filter((e) => e.win).length /
          this.territoryWarEvents.length) *
        100
      );
    },
    averageGet1(): number {
      const total = this.territoryWarEvents.reduce((total, e) => {
        return total + e.GET1;
      }, 0);
      return total / this.territoryWarEvents.length;
    },
    averageGet2(): number {
      const total = this.territoryWarEvents.reduce((total, e) => {
        return total + e.GET2;
      }, 0);
      return total / this.territoryWarEvents.length;
    },
    averageZetas(): number {
      const total = this.territoryWarEvents.reduce((total, e) => {
        return total + e.zetas;
      }, 0);
      return total / this.territoryWarEvents.length;
    },
    territoryWarEvents(): any[] {
      return [
        {
          id: "someId",
          date: moment(),
          win: true,
          GET1: 500,
          GET2: 650,
          zetas: 3,
        },
        {
          id: "someId2",
          date: moment(),
          win: false,
          GET1: 400,
          GET2: 450,
          zetas: 2,
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

<style lang="scss" scoped>
.guild-events-page {
  max-width: 90%;
}
</style>
