<template>
  <div>
    <SwgohTable
      :table="{ header, body }"
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
import { mapState, mapActions } from "vuex";

import { setupColumnEvents, setupSorting, sortValues, unvue } from "utils";
import { iRaidEvent } from "types/guild";
import { iTableBody, iTableHead } from "types/general";

const storageKey = "raidEventsTable";

export default defineComponent({
  name: "RaidEventsTable",
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
        score: 10,
        type: "Krayt",
      },
    } as any;
  },
  computed: {
    ...mapState("guild", ["raidEvents", "accessLevel"]),
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
              },
              {
                label: "Score",
                show: this.showCol("score"),
                sortMethodShow: true,
                icon: this.sortIcon("score"),
                value: "score",
                click: () => {
                  this.sortBy("score");
                },
              },
              {
                label: "Raid1 Currency",
                show: this.showCol("raid1"),
                sortMethodShow: true,
                icon: this.sortIcon("raid1"),
                value: "raid1",
                click: () => {
                  this.sortBy("raid1");
                },
              },
              {
                label: "Raid2 Currency",
                show: this.showCol("raid2"),
                sortMethodShow: true,
                icon: this.sortIcon("raid2"),
                value: "raid2",
                click: () => {
                  this.sortBy("raid2");
                },
              },
              {
                label: "Raid3 Currency",
                show: this.showCol("raid3"),
                sortMethodShow: true,
                icon: this.sortIcon("raid3"),
                value: "raid3",
                click: () => {
                  this.sortBy("raid3");
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
        rows: this.filteredEvents.map((event: iRaidEvent) => {
          return {
            cells: [
              {
                show: this.showCol("date"),
                label: "Date:",
                data: this.$filters.formatDate(event.date),
                colspan: this.showCol("name") ? "1" : "2",
              },
              {
                show: this.showCol("name"),
                label: "Raid Type:",
                data: event.type,
              },
              {
                show: this.showCol("score"),
                label: "Score:",
                data: event.score,
                colspan:
                  this.showCol("date") || this.showCol("name") ? "1" : "2",
              },
              {
                show: this.showCol("raid1"),
                label: "Raid1:",
                data: event.currencies.raid1,
              },
              {
                show: this.showCol("raid2"),
                label: "Raid2:",
                data: event.currencies.raid2,
              },
              {
                show: this.showCol("raid3"),
                label: "Raid3:",
                data: event.currencies.raid3,
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
                label: "Score",
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
                  min: "2023-05-10",
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
                  value: this.newEvent.type,
                  options: [
                    {
                      value: "Krayt",
                      label: "Krayt Dragon (KDR)",
                    },
                  ],
                },
                enter: (val: string) => {
                  this.newEvent.type = val;
                  this.addNewEvent();
                },
                change: (val: string) => {
                  this.newEvent.type = val;
                },
              },
              {
                show: true,
                classes: "flex-sm",
                label: "Score:",
                type: "select",
                data: {
                  value: this.newEvent.score,
                  options: [
                    {
                      label: "10mil",
                      value: 10,
                    },
                    {
                      label: "17mil",
                      value: 17,
                    },
                    {
                      label: "25mil",
                      value: 25,
                    },
                    {
                      label: "90mil",
                      value: 90,
                    },
                    {
                      label: "130mil",
                      value: 130,
                    },
                    {
                      label: "265mil",
                      value: 265,
                    },
                    {
                      label: "416mil",
                      value: 416,
                    },
                    {
                      label: "520mil",
                      value: 520,
                    },
                  ],
                },
                enter: (val: number) => {
                  this.newEvent.score = Number(val);
                  this.addNewEvent();
                },
                change: (val: number) => {
                  this.newEvent.score = Number(val);
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
    filteredEvents(): iRaidEvent[] {
      return this.raidEvents.sort((a: iRaidEvent, b: iRaidEvent) => {
        return sortValues(a, b, this.sortDir, this.sortMethod);
      });
    },
    addNewDisabled(): boolean {
      console.log(this.newEvent);
      return !this.newEvent.date || !this.newEvent.score || !this.newEvent.type;
    },
  },
  methods: {
    ...mapActions("guild", ["addRaidEvent", "removeRaidEvent"]),
    async addNewEvent() {
      if (!this.addNewDisabled) {
        await this.addRaidEvent(unvue(this.newEvent));
        this.$toast(`Raid event added successfully`, {
          positionY: "top",
          class: "toast-success",
        });
      }
    },
    async removeEvent(id: string) {
      await this.removeRaidEvent(id);
      this.$toast(`Raid event removed successfully`, {
        positionY: "top",
        class: "toast-success",
      });
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
