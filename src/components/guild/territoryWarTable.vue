<template>
  <div>
    <table
      class="table table-bordered table-dark table-sm table-striped mb-0 show-on-desktop"
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
          <td>{{ event.get1 }}</td>
          <td>{{ event.get2 }}</td>
          <td>{{ event.zetas }}</td>
        </tr>
        <tr
          class="text-center align-middle average-row"
          v-if="territoryWarEvents.length > 0"
        >
          <td>Average</td>
          <td>{{ averageWinRate }}%</td>
          <td>{{ averageGet1 }}</td>
          <td>{{ averageGet1 }}</td>
          <td>{{ averageZetas }}</td>
        </tr>
        <tr v-else>
          <td colspan="5" class="text-center">
            There are no events recorded for this guild.
          </td>
        </tr>
      </tbody>
    </table>
    <table
      class="table table-bordered table-dark table-sm table-striped show-on-desktop"
      v-if="accessLevel >= 3"
    >
      <thead class="text-center align-middle">
        <tr>
          <th colspan="6">Add New Event</th>
        </tr>
        <tr>
          <th width="16.6%">Date</th>
          <th width="16.6%">Win/Loss</th>
          <th width="16.6%">GET1 Currency</th>
          <th width="16.6%">GET2 Currency</th>
          <th width="16.6%">Zetas</th>
          <th width="16.6%">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <input
              class="form-control form-control-sm"
              type="date"
              v-model="newEvent.date"
              @keypress.enter="addNewEvent"
            />
          </td>
          <td>
            <select
              class="form-control form-control-sm"
              v-model="newEvent.win"
              @keypress.enter="addNewEvent"
              min="0"
            >
              <option :value="true">Win</option>
              <option :value="false">Loss</option>
            </select>
          </td>
          <td>
            <input
              class="form-control form-control-sm"
              type="number"
              v-model="newEvent.get1"
              @keypress.enter="addNewEvent"
              min="0"
              step="25"
            />
          </td>
          <td>
            <input
              class="form-control form-control-sm"
              type="number"
              v-model="newEvent.get2"
              @keypress.enter="addNewEvent"
              min="0"
              step="25"
            />
          </td>
          <td>
            <input
              class="form-control form-control-sm"
              type="number"
              v-model="newEvent.zetas"
              @keypress.enter="addNewEvent"
              min="0"
            />
          </td>
          <td>
            <button
              class="btn btn-sm btn-primary w-100"
              @click="addNewEvent"
              :disabled="addNewDisabled"
            >
              Add New Event
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import moment from "moment";
import { defineComponent } from "vue";
import { mapActions, mapState } from "vuex";

import { TerritoryWarEvent } from "../../types/guild";
import { round2Decimals, unvue } from "../../utils";

export default defineComponent({
  name: "TerritoryWarTable",
  data() {
    return {
      sortDir: "asc",
      sortMethod: "date",
      newEvent: {
        date: moment().format("YYYY-MM-DD"),
        win: true,
        get1: 0,
        get2: 0,
        zetas: 0,
      },
    };
  },
  computed: {
    ...mapState("guild", ["territoryWarEvents", "accessLevel"]),
    averageWinRate(): number {
      const num =
        (this.territoryWarEvents.filter((e: TerritoryWarEvent) => e.win)
          .length /
          this.territoryWarEvents.length) *
        100;
      return round2Decimals(num);
    },
    averageGet1(): number {
      const total = this.territoryWarEvents.reduce(
        (total: number, e: TerritoryWarEvent) => {
          return total + e.get1;
        },
        0
      );
      return round2Decimals(total / this.territoryWarEvents.length);
    },
    averageGet2(): number {
      const total = this.territoryWarEvents.reduce(
        (total: number, e: TerritoryWarEvent) => {
          return total + e.get2;
        },
        0
      );
      return round2Decimals(total / this.territoryWarEvents.length);
    },
    averageZetas(): number {
      const total = this.territoryWarEvents.reduce(
        (total: number, e: TerritoryWarEvent) => {
          return total + e.zetas;
        },
        0
      );
      return round2Decimals(total / this.territoryWarEvents.length);
    },
    addNewDisabled(): boolean {
      return (
        !this.newEvent.date ||
        !this.newEvent.get1 ||
        !this.newEvent.get2 ||
        !this.newEvent.zetas
      );
    },
  },
  methods: {
    ...mapActions("guild", ["addTerritoryWarEvent"]),
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
    addNewEvent() {
      if (!this.addNewDisabled) {
        this.addTerritoryWarEvent(unvue(this.newEvent));
      }
    },
  },
});
</script>