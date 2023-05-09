<template>
  <div>
    <SwgohTable
      :table="{ header, body, footer }"
      :class="[accessLevel < 3 ? 'mb-3' : 'mb-0']"
    />
    <SwgohTable
      :table="{ header: addNewHeader, body: addNewBody }"
      v-if="accessLevel >= 3"
    />
  </div>
</template>

<script lang="ts">
import moment from "moment";
import { defineComponent, toRefs } from "vue";
import { mapState, mapActions, mapGetters } from "vuex";

import { setupColumnEvents, setupSorting, sortValues, unvue } from "utils";
import { TerritoryBattleEvent } from "types/guild";
import { iTableBody, iTableHead } from "types/general";

const storageKey = "territoryBattleTable";

export default defineComponent({
  name: "TerritoryBattleTable",
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
                label: "Completion Date",
                show: this.showCol("date"),
                sortMethodShow: true,
                icon: this.sortIcon("date"),
                value: "date",
                click: () => {
                  this.sortBy("date");
                },
                colspan: this.showCol("name") ? "1" : "2",
              },
              {
                show: !this.showCol("date") && !this.showCol("name"),
              },
              {
                label: "Name",
                show: this.showCol("name"),
                sortMethodShow: true,
                icon: this.sortIcon("name"),
                value: "name",
                click: () => {
                  this.sortBy("name");
                },
                colspan: this.showCol("date") ? "1" : "2",
              },
              {
                label: "Stars",
                show: this.showCol("stars"),
                sortMethodShow: true,
                icon: this.sortIcon("stars"),
                value: "stars",
                click: () => {
                  this.sortBy("stars");
                },
                colspan:
                  this.showCol("date") || this.showCol("name") ? "1" : "2",
              },
              {
                label: "GET1 Currency",
                show: this.showCol("get1"),
                sortMethodShow: true,
                icon: this.sortIcon("get1"),
                value: "get1",
                click: () => {
                  this.sortBy("get1");
                },
              },
              {
                label: "GET2 Currency",
                show: this.showCol("get2"),
                sortMethodShow: true,
                icon: this.sortIcon("get2"),
                value: "get2",
                click: () => {
                  this.sortBy("get2");
                },
              },
              {
                label: "GET3 Currency",
                show: this.showCol("get3"),
                sortMethodShow: true,
                icon: this.sortIcon("get3"),
                value: "get3",
                click: () => {
                  this.sortBy("get3");
                },
              },
              {
                label: "Character Shards",
                show: this.showCol("character"),
                sortMethodShow: true,
                icon: this.sortIcon("character"),
                value: "character",
                click: () => {
                  this.sortBy("character");
                },
              },
              {
                label: "Actions",
                show: this.showCol("actions"),
              },
            ],
          },
        ],
      };
    },
    body(): iTableBody {
      return {
        classes: "align-middle text-center",
        rows: this.filteredEvents.map((event: TerritoryBattleEvent) => {
          return {
            cells: [
              {
                show: this.showCol("date"),
                label: "Date:",
                data: this.$filters.formatDate(event.date),
                colspan: this.showCol("name") ? "1" : "2",
              },
              {
                show: !this.showCol("date") && !this.showCol("name"),
                data: "",
              },
              {
                show: this.showCol("name"),
                label: "Battle Type:",
                data: event.name,
                colspan: this.showCol("date") ? "1" : "2",
              },
              {
                show: this.showCol("stars"),
                label: "Stars:",
                data: event.stars,
                colspan:
                  this.showCol("date") || this.showCol("name") ? "1" : "2",
              },
              {
                show: this.showCol("get1"),
                label: "GET1:",
                data: event.get1,
              },
              {
                show: this.showCol("get2"),
                label: "GET2:",
                data: event.get2,
              },
              {
                show: this.showCol("get3"),
                label: "GET3:",
                data: event.get3,
              },
              {
                show: this.showCol("character"),
                label: "Character Shards:",
                data: `${event.characterShards.count} (${this.unitName(
                  event.characterShards.id
                )})`,
                labelClasses: "character-shards-label",
              },
              {
                show: this.showCol("actions"),
                type: "buttons",
                data: {
                  buttons: [
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
              },
            ],
          };
        }),
      };
    },
    footer(): iTableBody {
      return {
        classes: "align-middle text-center",
        zeroState: {
          show: this.territoryBattleEvents.length === 0,
          message: "There are no events recorded for this guild.",
        },
        rows: [
          {
            cells: [
              {
                data: "Average",
                show: this.territoryBattleEvents.length > 0,
                classes: `category-header ${
                  this.avgColSpan <= -1 ? "d-none" : ""
                }`,
                rowspan: "3",
              },
              {
                data: 'Light Side<span class="hide-lg"> Averages</span>',
                type: "html",
                show: true,
              },
              {
                label: "Stars:",
                data: this.tbAvgStars("Light"),
                show: this.showCol("stars"),
              },
              {
                show: this.showCol("get1"),
                data: this.tbAvgCurrency("Light", "get1"),
                label: "GET1:",
              },
              {
                show: this.showCol("get2"),
                data: this.tbAvgCurrency("Light", "get2"),
                label: "GET2:",
              },
              {
                show: this.showCol("get3"),
                data: this.tbAvgCurrency("Light", "get3"),
                label: "GET3:",
              },
              {
                show: this.showCol("character"),
                data: this.tbAvgShards("Light"),
                label: "Character Shards:",
                labelClasses: "character-shards-label",
                colspan: this.showCol("actions") ? "2" : "1",
              },
              {
                show: !this.showCol("character"),
                data: "",
              },
            ],
          },
          {
            cells: [
              {
                data: 'Dark Side<span class="hide-lg"> Averages</span>',
                type: "html",
                show: true,
              },
              {
                label: "Stars:",
                data: this.tbAvgStars("Dark"),
                show: this.showCol("stars"),
              },
              {
                show: this.showCol("get1"),
                data: this.tbAvgCurrency("Dark", "get1"),
                label: "GET1:",
              },
              {
                show: this.showCol("get2"),
                data: this.tbAvgCurrency("Dark", "get2"),
                label: "GET2:",
              },
              {
                show: this.showCol("get3"),
                data: this.tbAvgCurrency("Dark", "get3"),
                label: "GET3:",
              },
              {
                show: this.showCol("character"),
                data: this.tbAvgShards("Dark"),
                label: "Character Shards:",
                labelClasses: "character-shards-label",
                colspan: this.showCol("actions") ? "2" : "1",
              },
              {
                show: !this.showCol("character"),
                data: "",
              },
            ],
          },
          {
            cells: [
              {
                data: 'Rise of the Empire<span class="hide-lg"> Averages</span>',
                type: "html",
                show: true,
              },
              {
                label: "Stars:",
                data: this.tbAvgStars("ROTE"),
                show: this.showCol("stars"),
              },
              {
                show: this.showCol("get1"),
                data: this.tbAvgCurrency("ROTE", "get1"),
                label: "GET1:",
              },
              {
                show: this.showCol("get2"),
                data: this.tbAvgCurrency("ROTE", "get2"),
                label: "GET2:",
              },
              {
                show: this.showCol("get3"),
                data: this.tbAvgCurrency("ROTE", "get3"),
                label: "GET3:",
              },
              {
                show: this.showCol("character"),
                data: this.tbAvgShards("ROTE"),
                label: "Character Shards:",
                labelClasses: "character-shards-label",
                colspan: this.showCol("actions") ? "2" : "1",
              },
              {
                show: !this.showCol("character"),
                data: "",
              },
            ],
          },
        ],
      };
    },
    addNewHeader(): iTableHead {
      return {
        headers: [
          {
            cells: [
              {
                label: "Add New Event",
                colspan: "5",
              },
            ],
          },
          {
            cells: [
              {
                show: true,
                label: "Date",
                maxWidth: "20%",
              },
              {
                show: true,
                label: "Type",
                maxWidth: "20%",
              },
              {
                show: true,
                label: "Stars",
                maxWidth: "20%",
              },
              {
                show: true,
                label: "Character Shards",
                maxWidth: "20%",
              },
              {
                show: true,
                label: "Actions",
                maxWidth: "20%",
              },
            ],
          },
        ],
      };
    },
    addNewBody(): iTableBody {
      return {
        classes: "align-middle text-center",
        rows: [
          {
            cells: [
              {
                classes: "row-label",
                show: true,
                label: "Add New Event",
                data: "",
              },
              {
                show: true,
                classes: "flex-sm",
                label: "Date:",
                type: "date",
                data: {
                  value: this.newEvent.date,
                },
                enter: (val: any) => {
                  this.newEvent.date = val;
                  this.addNewEvent();
                },
                change: (val: any) => {
                  this.newEvent.date = val;
                },
              },
              {
                show: true,
                classes: "flex-sm",
                label: "Type:",
                type: "select",
                data: {
                  value: this.newEvent.name,
                  options: [
                    {
                      value: "Separatist Might",
                      label: "Separatist Might",
                    },
                    {
                      value: "Republic Offensive",
                      label: "Republic Offensive",
                    },
                    {
                      value: "Rebel Assault",
                      label: "Rebel Assault",
                    },
                    {
                      value: "Imperial Retaliation",
                      label: "Imperial Retaliation",
                    },
                    {
                      value: "Rise of the Empire",
                      label: "Rise of the Empire",
                    },
                  ],
                },
                enter: (val: any) => {
                  this.newEvent.name = val;
                  this.addNewEvent();
                },
                change: (val: any) => {
                  this.newEvent.name = val;
                },
              },
              {
                show: true,
                classes: "flex-sm",
                label: "Stars:",
                type: "number",
                data: {
                  value: this.newEvent.stars,
                  min: 0,
                  max: this.maxStars,
                },
                enter: (val: any) => {
                  this.newEvent.stars = val;
                  this.addNewEvent();
                },
                change: (val: any) => {
                  this.newEvent.stars = val;
                },
              },
              {
                show: true,
                classes: "flex-sm",
                label: "Character Shards:",
                type: "number",
                enter: (val: any) => {
                  this.newEvent.characterShards = val;
                  this.addNewEvent();
                },
                change: (val: any) => {
                  this.newEvent.characterShards = val;
                },
                data: {
                  min: 0,
                  max: 50,
                  value: this.newEvent.characterShards,
                },
              },
              {
                type: "buttons",
                show: true,
                data: {
                  buttons: [
                    {
                      click: () => {
                        this.addNewEvent();
                      },
                      disabled: this.addNewDisabled,
                      classes: "btn btn-sm btn-primary w-100",
                      label: "Add New Event",
                    },
                  ],
                  groupClasses: "w-100",
                },
              },
            ],
          },
        ],
      };
    },
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
        case "Rise of the Empire":
          return 54;
      }
    },
    filteredEvents(): TerritoryBattleEvent[] {
      return this.tbEvents().sort(
        (a: TerritoryBattleEvent, b: TerritoryBattleEvent) => {
          if (this.sortMethod === "character") {
            return sortValues(
              a.characterShards.count,
              b.characterShards.count,
              this.sortDir,
              this.sortMethod
            );
          }
          return sortValues(a, b, this.sortDir, this.sortMethod);
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
    async addNewEvent() {
      if (!this.addNewDisabled) {
        await this.addTerritoryBattleEvent(unvue(this.newEvent));
        this.$toast(`Territory Battle event added successfully`, {
          positionY: "top",
          class: "toast-success",
        });
      }
    },
    async removeEvent(id: string) {
      await this.removeTerritoryBattleEvent(id);
      this.$toast(`Territory Battle event removed successfully`, {
        positionY: "top",
        class: "toast-success",
      });
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
::v-deep(.character-shards-label) {
  @media only screen and (max-width: 768px) {
    display: block;
  }
}
</style>
