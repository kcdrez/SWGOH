<template>
  <div>
    <table
      class="table table-bordered table-dark table-sm table-striped"
      :class="[accessLevel < 3 ? 'mb-3' : 'mb-0']"
    >
      <TableHeader :header="header" />
      <TableBody :body="body" />
      <tfoot>
        <tr
          class="text-center align-middle"
          v-if="territoryWarEvents.length > 0"
        >
          <td class="category-header" v-if="showCol('date')">Average</td>
          <td v-if="showCol('win_loss')">
            <span class="row-label">Win Rate: </span>
            {{ averageWinRate }}%
          </td>
          <td v-if="showCol('get1')">
            <span class="row-label">Avg GET1: </span>
            {{ averageGet1 }}
          </td>
          <td v-if="showCol('get2')">
            <span class="row-label">Avg GET2: </span>
            {{ averageGet2 }}
          </td>
          <!-- <td v-if="showCol('get3')">
            <span class="row-label">Avg GET3: </span>
            {{ averageGet3 }}
          </td> -->
          <td v-if="showCol('zetas')">
            <span class="row-label">Avg Zetas: </span>
            {{ averageZetas }}
          </td>
          <td class="hidden-sm" v-if="showCol('actions')"></td>
        </tr>
        <tr v-else>
          <td colspan="100%" class="text-center">
            There are no events recorded for this guild.
          </td>
        </tr>
      </tfoot>
    </table>
    <table
      class="table table-bordered table-dark table-sm table-striped"
      v-if="accessLevel >= 3"
    >
      <thead class="text-center align-middle">
        <tr>
          <th colspan="6">Add New Event</th>
        </tr>
        <tr>
          <th width="25%">Date</th>
          <th width="25%">Win/Loss</th>
          <th width="25%">Event GP Range</th>
          <th width="25%">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="row-label text-center">Add New Event</td>
          <td class="flex-sm">
            <span class="row-label">Date:</span>
            <input
              class="form-control form-control-sm"
              type="date"
              v-model="newEvent.date"
              @keypress.enter="addNewEvent"
            />
          </td>
          <td class="flex-sm">
            <span class="row-label">Win/Loss:</span>
            <select
              class="form-control form-control-sm"
              v-model="newEvent.win"
              @keypress.enter="addNewEvent"
            >
              <option :value="true">Win</option>
              <option :value="false">Loss</option>
            </select>
          </td>
          <td class="flex-sm">
            <select
              class="form-control form-control-sm"
              v-model="newEvent.guildGP"
              @keypress.enter="addNewEvent"
            >
              <option v-for="option in gpOptions" :value="option.value">
                {{ option.label }}
              </option>
            </select>
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
import { defineComponent, toRefs } from "vue";
import { mapActions, mapState } from "vuex";

import { ITerritoryWarEvent } from "types/guild";
import { round2Decimals, setupColumnEvents, setupSorting, unvue } from "utils";
import { iTableBody, iTableHead } from "types/general";

const storageKey = "territoryWarTable";

export default defineComponent({
  name: "TerritoryWarTable",
  setup(props) {
    const { sortDir, sortMethod, sortBy, sortIcon } = setupSorting(storageKey);
    const list = toRefs(props).selectedColumns;
    const { showCol } = setupColumnEvents(list);

    return {
      sortDir,
      sortMethod,
      sortBy,
      sortIcon,
      showCol,
    };
  },
  props: {
    selectedColumns: {
      type: Array as () => string[],
      validator: (arr: string[]) => {
        return arr.every((x) => {
          return typeof x === "string";
        });
      },
      required: true,
    },
  },
  data() {
    return {
      newEvent: {
        date: moment().format("YYYY-MM-DD"),
        win: true,
        guildGP: 200,
      },
    } as any;
  },
  computed: {
    ...mapState("guild", ["territoryWarEvents", "accessLevel"]),
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
            label: "Completion Date",
            show: this.showCol("date"),
            sortMethodShow: true,
            icon: this.sortIcon("date"),
            click: () => {
              this.sortBy("date");
            },
          },
          {
            label: "Win/Loss",
            show: this.showCol("win_loss"),
            sortMethodShow: true,
            icon: this.sortIcon("win_loss"),
            click: () => {
              this.sortBy("win_loss");
            },
          },
          {
            label: "GET1 Currency",
            show: this.showCol("get1"),
            sortMethodShow: true,
            icon: this.sortIcon("get1"),
            click: () => {
              this.sortBy("get1");
            },
          },
          {
            label: "GET2 Currency",
            show: this.showCol("get2"),
            sortMethodShow: true,
            icon: this.sortIcon("get2"),
            click: () => {
              this.sortBy("get2");
            },
          },
          {
            label: "GET3 Currency",
            show: false, //this.showCol("get3"),
            sortMethodShow: false,
            icon: this.sortIcon("get3"),
            click: () => {
              this.sortBy("get3");
            },
          },
          {
            label: "Zetas",
            show: this.showCol("zetas"),
            sortMethodShow: true,
            icon: this.sortIcon("zetas"),
            click: () => {
              this.sortBy("zetas");
            },
          },
          {
            label: "Actions",
            show: this.showCol("actions"),
          },
        ],
      };
    },
    body(): iTableBody {
      return {
        classes: "align-middle text-center",
        rows: this.filteredEvents.map((event: ITerritoryWarEvent) => {
          return {
            cells: [
              {
                show: this.showCol("date"),
                label: "Date:",
                data: this.$filters.formatDate(event.date),
              },
              {
                show: this.showCol("win_loss"),
                data: event.win ? "Win" : "Loss",
              },
              {
                show: this.showCol("get1"),
                label: "GET1:",
                data: event.currencies.get1,
              },
              {
                show: this.showCol("get2"),
                label: "GET2:",
                data: event.currencies.get2,
              },
              {
                show: false,
                label: "GET3:",
                data: event.currencies.get3,
              },
              {
                show: this.showCol("zetas"),
                label: "Zetas:",
                data: event.abilityMats.zetas,
              },
              {
                show: this.showCol("actions"),
                type: "buttons",
                data: [
                  {
                    click: () => {
                      this.removeEvent(event.id);
                    },
                    icon: "fas fa-trash",
                    classes: "btn btn-danger",
                    title: "Remove Event",
                  },
                ],
              },
            ],
          };
        }),
      };
    },
    filteredEvents(): ITerritoryWarEvent[] {
      return this.territoryWarEvents
        .filter((e: ITerritoryWarEvent) => {
          return moment(e.date).isAfter(moment().subtract(6, "months"));
        })
        .sort((a: ITerritoryWarEvent, b: ITerritoryWarEvent) => {
          if (this.sortMethod === "date") {
            if (this.sortDir === "asc") {
              return moment(a.date).isBefore(b.date) ? 1 : -1;
            } else {
              return moment(b.date).isBefore(a.date) ? 1 : -1;
            }
          } else if (this.sortMethod === "win_loss") {
            if (a.win && b.win) {
              return 0;
            } else if (this.sortDir === "asc") {
              return a.win ? 1 : -1;
            } else {
              return b.win ? 1 : -1;
            }
          } else if (this.sortMethod === "get1") {
            if (a.currencies.get1 === b.currencies.get1) {
              return 0;
            } else if (this.sortDir === "asc") {
              return a.currencies.get1 > b.currencies.get1 ? 1 : -1;
            } else {
              return a.currencies.get1 > b.currencies.get1 ? -1 : 1;
            }
          } else if (this.sortMethod === "get2") {
            if (a.currencies.get2 === b.currencies.get2) {
              return 0;
            } else if (this.sortDir === "asc") {
              return a.currencies.get2 > b.currencies.get2 ? 1 : -1;
            } else {
              return a.currencies.get2 > b.currencies.get2 ? -1 : 1;
            }
          } else if (this.sortMethod === "get3") {
            if (a.currencies.get3 === b.currencies.get3) {
              return 0;
            } else if (this.sortDir === "asc") {
              return a.currencies.get3 > b.currencies.get3 ? 1 : -1;
            } else {
              return a.currencies.get3 > b.currencies.get3 ? -1 : 1;
            }
          } else if (this.sortMethod === "zetas") {
            if (a.abilityMats.zetas === b.abilityMats.zetas) {
              return 0;
            } else if (this.sortDir === "asc") {
              return a.abilityMats.zetas > b.abilityMats.zetas ? 1 : -1;
            } else {
              return a.abilityMats.zetas > b.abilityMats.zetas ? -1 : 1;
            }
          }
          return 0;
        });
    },
    averageWinRate(): number {
      const num =
        (this.filteredEvents.filter((e: ITerritoryWarEvent) => e.win).length /
          this.filteredEvents.length) *
        100;
      return round2Decimals(num);
    },
    averageGet1(): number {
      const total = this.filteredEvents.reduce(
        (total: number, e: ITerritoryWarEvent) => {
          return total + e.currencies.get1;
        },
        0
      );
      return round2Decimals(total / this.filteredEvents.length);
    },
    averageGet2(): number {
      const total = this.filteredEvents.reduce(
        (total: number, e: ITerritoryWarEvent) => {
          return total + e.currencies.get2;
        },
        0
      );
      return round2Decimals(total / this.filteredEvents.length);
    },
    averageGet3(): number {
      const total = this.filteredEvents.reduce(
        (total: number, e: ITerritoryWarEvent) => {
          return total + e.currencies.get3;
        },
        0
      );
      return round2Decimals(total / this.filteredEvents.length);
    },
    averageZetas(): number {
      const total = this.filteredEvents.reduce(
        (total: number, e: ITerritoryWarEvent) => {
          return total + e.abilityMats.zetas;
        },
        0
      );
      return round2Decimals(total / this.filteredEvents.length);
    },
    addNewDisabled(): boolean {
      return !this.newEvent.date || !this.newEvent.guildGP;
    },
    gpOptions() {
      return [
        {
          label: "380m+",
          value: 380,
        },
        {
          label: "360m-379m",
          value: 360,
        },
        {
          label: "340m-359m",
          value: 340,
        },
        {
          label: "320m-339m",
          value: 320,
        },
        {
          label: "300m-319m",
          value: 300,
        },
        {
          label: "280m-299m",
          value: 280,
        },
        {
          label: "260m-279m",
          value: 260,
        },
        {
          label: "240m-259m",
          value: 240,
        },
        {
          label: "220m-239m",
          value: 220,
        },
        {
          label: "200m-219m",
          value: 200,
        },
        {
          label: "170m-199m",
          value: 170,
        },
        {
          label: "140m-169m",
          value: 140,
        },
        {
          label: "120m-1399m",
          value: 120,
        },
        {
          label: "100m-119m",
          value: 100,
        },
        {
          label: "80m-99m",
          value: 80,
        },
        {
          label: "60m-79m",
          value: 60,
        },
        {
          label: "50-59m",
          value: 50,
        },
        {
          label: "40m-49m",
          value: 40,
        },
        {
          label: "30m-39m",
          value: 30,
        },
        {
          label: "20m-29m",
          value: 20,
        },
        {
          label: "10m-19m",
          value: 10,
        },
        {
          label: "5m-9m",
          value: 5,
        },
        {
          label: "1-4m",
          value: 0,
        },
      ];
    },
  },
  methods: {
    ...mapActions("guild", ["addTerritoryWarEvent", "removeTerritoryWarEvent"]),
    async addNewEvent() {
      if (!this.addNewDisabled) {
        await this.addTerritoryWarEvent(unvue(this.newEvent));
      }
      this.$toast(`Territory War event added successfully`, {
        positionY: "top",
        class: "toast-success",
      });
    },
    async removeEvent(id: string) {
      await this.removeTerritoryWarEvent(id);
      this.$toast(`Territory War event removed successfully`, {
        positionY: "top",
        class: "toast-success",
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.sticky-header {
  top: 105px;
}
</style>
