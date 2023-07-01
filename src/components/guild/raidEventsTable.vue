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
    <div id="my-chart-id"><canvas id="my-canvas"></canvas></div>
  </div>
</template>

<script lang="ts">
import moment from "moment";
import { defineComponent, toRefs } from "vue";
import { mapState, mapActions } from "vuex";
// const { Chart } = await import("chart.js");
import Chart from "chart.js/auto";
// import { Bar } from "vue-chartjs";

// import {
//   Chart as ChartJS,
//   Title,
//   Tooltip,
//   Legend,
//   BarElement,
//   CategoryScale,
//   LinearScale,
// } from "chart.js";

// ChartJS.register(
//   Title,
//   Tooltip,
//   Legend,
//   BarElement,
//   CategoryScale,
//   LinearScale
// );

import { setupColumnEvents, setupSorting, sortValues, unvue } from "utils";
import { iRaidEvent } from "types/guild";
import { iTableBody, iTableHead } from "types/general";

const storageKey = "raidEventsTable";

export default defineComponent({
  name: "RaidEventsTable",
  // components: { Bar },
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
        score: 0,
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
                show: this.showCol("type"),
                sortMethodShow: true,
                icon: this.sortIcon("type"),
                value: "type",
                click: () => {
                  this.sortBy("type");
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
              },
              {
                show: this.showCol("type"),
                label: "Raid Type:",
                data: event?.type ?? "Unknown",
              },
              {
                show: this.showCol("score"),
                label: "Score:",
                data: new Intl.NumberFormat().format(event?.score ?? 0),
              },
              {
                show: this.showCol("raid1"),
                label: "Raid1:",
                data: event.currencies?.raid1 ?? 0,
              },
              {
                show: this.showCol("raid2"),
                label: "Raid2:",
                data: event.currencies?.raid2 ?? 0,
              },
              {
                show: this.showCol("raid3"),
                label: "Raid3:",
                data: event.currencies?.raid3 ?? 0,
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
                type: "number",
                data: {
                  value: this.newEvent.score,
                  min: 0,
                  max: 520000000,
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
      return this.raidEvents
        .filter((raidEvent: iRaidEvent) => {
          return moment(raidEvent.date).isAfter(moment().subtract(6, "months"));
        })
        .sort((a: iRaidEvent, b: iRaidEvent) => {
          return sortValues(a, b, this.sortDir, this.sortMethod);
        });
    },
    addNewDisabled(): boolean {
      return !this.newEvent.date || !this.newEvent.score || !this.newEvent.type;
    },
    chartData() {
      return {
        labels: this.raidEvents.map((event) =>
          this.$filters.formatDate(event.date, "DD-MMM 'YY")
        ),
        data: this.raidEvents.map((event) => event.score),
      };
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
  mounted() {
    new Chart(document.getElementById("my-canvas") as any, {
      type: "line",
      data: {
        labels: this.chartData.labels,
        datasets: [
          {
            label: "Krayt Dragon Raid",
            data: this.chartData.data,
            // borderColor: "red",
          },
        ],
      },
      options: {
        scales: {
          y: {
            title: {
              text: "Raid Score",
              display: true,
              color: "black",
              font: {
                size: 18,
              },
            },
            ticks: {
              color: "black",
              font: {
                size: 14,
              },
            },
          },
          x: {
            title: {
              text: "Date",
              display: true,
              color: "black",
              font: {
                size: 18,
              },
            },
            ticks: {
              color: "black",
              font: {
                size: 14,
              },
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: "black",
              font: {
                size: 20,
              },
            },
          },
        },
      },
    });
  },
});
</script>

<style lang="scss" scoped>
@import "styles/variables.scss";

canvas {
  background-color: $light;
}
::v-deep(.character-shards-label) {
  @media only screen and (max-width: 768px) {
    display: block;
  }
}
</style>
