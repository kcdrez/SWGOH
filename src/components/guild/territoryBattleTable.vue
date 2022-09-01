<template>
  <div>
    <table
      class="table table-bordered table-dark table-sm table-striped"
      :class="[accessLevel < 3 ? 'mb-3' : 'mb-0']"
    >
      <thead class="sticky-header">
        <tr class="text-center align-middle">
          <th v-if="showCol('date')">
            <div class="c-pointer" @click="sortBy('date')">
              Completion Date
              <i class="fas mx-1" :class="sortIcon('date')"></i>
            </div>
          </th>
          <th v-if="showCol('type')" class="c-pointer" @click="sortBy('type')">
            Battle Type
            <i class="fas mx-1" :class="sortIcon('type')"></i>
          </th>
          <th v-if="showCol('name')" class="c-pointer" @click="sortBy('name')">
            Name
            <i class="fas mx-1" :class="sortIcon('name')"></i>
          </th>
          <th
            v-if="showCol('stars')"
            class="c-pointer"
            @click="sortBy('stars')"
          >
            Stars
            <i class="fas mx-1" :class="sortIcon('stars')"></i>
          </th>
          <th v-if="showCol('get1')" class="c-pointer" @click="sortBy('get1')">
            GET1 Currency
            <i class="fas mx-1" :class="sortIcon('get1')"></i>
          </th>
          <th v-if="showCol('get2')" class="c-pointer" @click="sortBy('get2')">
            GET2 Currency
            <i class="fas mx-1" :class="sortIcon('get2')"></i>
          </th>
          <th
            v-if="showCol('character')"
            class="c-pointer"
            @click="sortBy('character')"
          >
            Character Shards
            <i class="fas mx-1" :class="sortIcon('character')"></i>
          </th>
          <th v-if="showCol('actions')">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="event in filteredEvents"
          :key="event.id"
          class="text-center align-middle"
        >
          <td v-if="showCol('date')">
            <span class="row-label">Date:</span>
            {{ $filters.formatDate(event.date) }}
          </td>
          <td v-if="showCol('type')">{{ event.type }} Side</td>
          <td v-if="showCol('name')">
            <span class="row-label">Battle Type:</span>{{ event.name }}
          </td>
          <td v-if="showCol('stars')">
            <span class="row-label">Stars:</span>{{ event.stars }}
          </td>
          <td v-if="showCol('get1')">
            <span class="row-label">GET1:</span>{{ event.get1 }}
          </td>
          <td v-if="showCol('get2')">
            <span class="row-label">GET2:</span>{{ event.get2 }}
          </td>
          <td v-if="showCol('character')">
            <span class="row-label character-shards-label"
              >Character Shards:</span
            >
            {{ event.characterShards.count }} ({{
              unitName(event.characterShards.id)
            }})
          </td>
          <td v-if="showCol('actions')">
            <div class="btn-group btn-group-sm">
              <button
                type="button"
                class="btn btn-danger"
                title="Remove event"
                @click="removeEvent(event.id)"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="text-center align-middle">
          <td
            rowspan="2"
            v-if="territoryBattleEvents.length > 0"
            class="category-header"
            :class="{ 'd-none': avgColSpan <= -1 }"
          >
            Average
          </td>
          <template v-if="tbEvents('Light').length > 0">
            <td :colspan="avgColSpan" :class="{ 'd-none': avgColSpan <= 0 }">
              Light Side<span class="hide-lg"> Averages</span>
            </td>
            <td v-if="showCol('stars')">
              <span class="row-label">Stars: </span>{{ tbAvgStars("Light") }}
            </td>
            <td v-if="showCol('get1')">
              <span class="row-label">GET1:</span>
              {{ tbAvgCurrency("Light", "get1") }}
            </td>
            <td v-if="showCol('get2')">
              <span class="row-label">GET2:</span>
              {{ tbAvgCurrency("Light", "get2") }}
            </td>
            <td v-if="showCol('character')">
              <span class="row-label character-shards-label">
                Character Shards:
              </span>
              {{ tbAvgShards("Light") }}
            </td>
            <td class="hidden-sm" v-if="showCol('actions')"></td>
          </template>
        </tr>
        <tr class="text-center align-middle" v-if="tbEvents('Dark').length > 0">
          <td :colspan="avgColSpan" :class="{ 'd-none': avgColSpan <= 0 }">
            Dark Side<span class="hide-lg"> Averages</span>
          </td>
          <td v-if="showCol('stars')">
            <span class="row-label">Stars:</span>
            {{ tbAvgStars("Dark") }}
          </td>
          <td v-if="showCol('get1')">
            <span class="row-label">GET1:</span>
            {{ tbAvgCurrency("Dark", "get1") }}
          </td>
          <td v-if="showCol('get2')">
            <span class="row-label">GET2:</span>
            {{ tbAvgCurrency("Dark", "get2") }}
          </td>
          <td v-if="showCol('character')">
            <span class="row-label character-shards-label">
              Character Shards:
            </span>
            {{ tbAvgShards("Dark") }}
          </td>
          <td class="hidden-sm" v-if="showCol('actions')"></td>
        </tr>
        <tr v-if="territoryBattleEvents.length === 0">
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
          <th colspan="5">Add New Event</th>
        </tr>
        <tr>
          <th width="20%">Date</th>
          <th width="20%">Type</th>
          <th width="20%">Stars</th>
          <th width="20%">Character Shards</th>
          <th width="20%">Actions</th>
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
            <span class="row-label">Type:</span>
            <select
              class="form-control form-control-sm"
              v-model="newEvent.name"
              @keypress.enter="addNewEvent"
            >
              <option value="Separatist Might">Separatist Might</option>
              <option value="Republic Offensive">Republic Offensive</option>
              <option value="Rebel Assault">Rebel Assault</option>
              <option value="Imperial Retaliation">Imperial Retaliation</option>
            </select>
          </td>
          <td class="flex-sm">
            <span class="row-label">Stars:</span>
            <input
              class="form-control form-control-sm"
              type="number"
              v-model="newEvent.stars"
              @keypress.enter="addNewEvent"
              min="0"
              :max="maxStars"
            />
          </td>
          <td class="flex-sm">
            <span class="row-label">Character Shards:</span>
            <input
              class="form-control form-control-sm"
              type="number"
              v-model="newEvent.characterShards"
              @keypress.enter="addNewEvent"
              min="0"
              max="50"
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
import { mapState, mapActions, mapGetters } from "vuex";

import { unvue } from "utils";
import { TerritoryBattleEvent } from "types/guild";

export default defineComponent({
  name: "TerritoryBattleTable",
  props: {
    selectedColumns: {
      type: Array,
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
      sortDir: "asc",
      sortMethod: "date",
      newEvent: {
        date: moment().format("YYYY-MM-DD"),
        stars: 0,
        characterShards: 0,
        name: "",
      },
    } as any;
  },
  computed: {
    ...mapState("guild", ["territoryBattleEvents", "accessLevel"]),
    ...mapGetters("guild", [
      "tbEvents",
      "tbAvgStars",
      "tbAvgCurrency",
      "tbAvgShards",
    ]),
    ...mapGetters("unit", ["unitName"]),
    maxStars(): number {
      switch (this.newEvent.name) {
        case "Republic Offensive":
          return 36;
        case "Separatist Might":
        default:
          return 33;
        case "Rebel Assault":
          return 45;
        case "Imperial Retaliation":
          return 48;
      }
    },
    filteredEvents(): TerritoryBattleEvent[] {
      return this.territoryBattleEvents
      .filter((e: TerritoryBattleEvent) => {
        return moment(e.date).isAfter(moment().subtract(6, "months"))
      })
      .sort(
        (a: TerritoryBattleEvent, b: TerritoryBattleEvent) => {
          if (this.sortMethod === "date") {
            if (this.sortDir === "asc") {
              return moment(a.date).isBefore(b.date) ? 1 : -1;
            } else {
              return moment(b.date).isBefore(a.date) ? 1 : -1;
            }
          } else if (this.sortMethod === "type") {
            const compareA = a.type.toLowerCase();
            const compareB = b.type.toLowerCase();
            if (compareA === compareB) {
              return 0;
            } else if (this.sortDir === "asc") {
              return compareA > compareB ? 1 : -1;
            } else {
              return compareA > compareB ? -1 : 1;
            }
          } else if (this.sortMethod === "name") {
            const compareA = a.name.toLowerCase();
            const compareB = b.name.toLowerCase();
            if (compareA === compareB) {
              return 0;
            } else if (this.sortDir === "asc") {
              return compareA > compareB ? 1 : -1;
            } else {
              return compareA > compareB ? -1 : 1;
            }
          } else if (this.sortMethod === "get1") {
            if (a.get1 === b.get1) {
              return 0;
            } else if (this.sortDir === "asc") {
              return a.get1 > b.get1 ? 1 : -1;
            } else {
              return a.get1 > b.get1 ? -1 : 1;
            }
          } else if (this.sortMethod === "get2") {
            if (a.get2 === b.get2) {
              return 0;
            } else if (this.sortDir === "asc") {
              return a.get2 > b.get2 ? 1 : -1;
            } else {
              return a.get2 > b.get2 ? -1 : 1;
            }
          } else if (this.sortMethod === "stars") {
            if (a.stars === b.stars) {
              return 0;
            } else if (this.sortDir === "asc") {
              return a.stars > b.stars ? 1 : -1;
            } else {
              return a.stars > b.stars ? -1 : 1;
            }
          } else if (this.sortMethod === "character") {
            if (a.characterShards.count === b.characterShards.count) {
              return 0;
            } else if (this.sortDir === "asc") {
              return a.characterShards.count > b.characterShards.count ? 1 : -1;
            } else {
              return a.characterShards.count > b.characterShards.count ? -1 : 1;
            }
          }

          return 0;
        }
      );
    },
    addNewDisabled(): boolean {
      return (
        !this.newEvent.date ||
        !this.newEvent.stars ||
        this.newEvent.characterShards === null ||
        this.newEvent.characterShards === undefined ||
        this.newEvent.characterShards < 0 ||
        typeof this.newEvent.characterShards === "string" ||
        !this.newEvent.name
      );
    },
    avgColSpan(): number {
      const cols = ["date", "type", "name"];
      if (cols.every((x) => this.showCol(x))) {
        return 2;
      } else if (cols.filter((x) => this.showCol(x)).length === 2) {
        return 1;
      } else if (cols.filter((x) => this.showCol(x)).length === 1) {
        return 0;
      } else {
        return -1;
      }
    },
  },
  methods: {
    ...mapActions("guild", [
      "addTerritoryBattleEvent",
      "removeTerritoryBattleEvent",
    ]),
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
    async addNewEvent() {
      if (!this.addNewDisabled) {
        await this.addTerritoryBattleEvent(unvue(this.newEvent));
      }
      this.$toast(
        `Territory Battle event added successfully`,
        {
          positionY: "top",
          class: "toast-success",
        }
      );
    },
    async removeEvent(id: string) {
      await this.removeTerritoryBattleEvent(id);
      this.$toast(
        `Territory Battle event removed successfully`,
        {
          positionY: "top",
          class: "toast-success",
        }
      );
    },
    showCol(key: string): boolean {
      return this.selectedColumns.some((x: any) => x === key);
    },
  },
  watch: {
    "newEvent.name"(_newVal) {
      if (this.newEvent.stars > this.maxStars) {
        this.newEvent.stars = this.maxStars;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.character-shards-label {
  @media only screen and (max-width: 768px) {
    display: block;
  }
}
.sticky-header {
  top: 105px;
}
</style>
