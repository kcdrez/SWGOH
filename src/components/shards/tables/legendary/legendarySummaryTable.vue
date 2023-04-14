<template>
  <SwgohTable :table="table" />
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { mapState } from "vuex";

import { setupSorting } from "utils";
import { totalProgress, getPrerequisites, Unit } from "types/unit";
import { NodeCharacter } from "types/shards";
import { iTable } from "types/general";

export default defineComponent({
  name: "LegendarySummaryTable",
  setup(props) {
    const { sortDir, sortMethod, sortBy, sortIcon, searchText } = setupSorting(
      props.storageKey
    );

    return {
      sortDir,
      sortMethod,
      sortBy,
      sortIcon,
      searchText,
    };
  },
  props: {
    unitList: {
      type: Array as PropType<(Unit | NodeCharacter)[]>,
      required: true,
    },
    storageKey: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState("shards", ["shardFarming"]),
    table(): iTable {
      return {
        header: {
          classes: "show-on-mobile",
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
                  label: "Unit Name",
                  show: true,
                  sortMethodShow: true,
                  maxWidth: "50%",
                  icon: this.sortIcon("name"),
                  value: "name",
                  input: {
                    type: "input",
                    classes: "mx-auto my-1 w-75",
                    placeholder: "Search by Name",
                    label: "Search",
                    value: this.searchText,
                    change: (val: string) => {
                      this.searchText = val;
                    },
                    click: () => {
                      this.sortBy("name");
                    },
                  },
                },
                {
                  label: "Progress",
                  show: true,
                  maxWidth: "50%",
                  icon: this.sortIcon("progress"),
                  sortMethodShow: true,
                  value: "progress",
                  click: () => {
                    this.sortBy("progress");
                  },
                },
              ],
            },
          ],
        },
        body: {
          classes: "align-middle text-center",
          rows: this.filteredUnitList.map((unit: Unit | NodeCharacter) => {
            return {
              cells: [
                {
                  type: "unit",
                  show: true,
                  data: {
                    unit,
                    isLink: true,
                    hideImage: true,
                  },
                },
                {
                  type: "progress",
                  data: this.totalProgress(unit.id ?? "", "requirement"),
                  show: true,
                },
              ],
            };
          }),
        },
      };
    },
    filteredUnitList() {
      return this.unitList
        .filter((unit: Unit | NodeCharacter) => {
          const val = "name" in unit ? unit.name : unit.id;
          const name = val.toLowerCase().replace(/\s/g, "");
          const compare = this.searchText.toLowerCase().replace(/\s/g, "");
          return name.includes(compare);
        })
        .sort((a: Unit | NodeCharacter, b: Unit | NodeCharacter) => {
          if (this.sortMethod === "name") {
            const valA = "name" in a ? a.name : a.id;
            const valB = "name" in b ? b.name : b.id;
            const compareA = valA.toLowerCase();
            const compareB = valB.toLowerCase();
            if (this.sortDir === "asc") {
              return compareA > compareB ? 1 : -1;
            } else {
              return compareA > compareB ? -1 : 1;
            }
          } else if (this.sortMethod === "progress") {
            const progressA = this.totalProgress(a.id ?? "", "requirement");
            const progressB = this.totalProgress(b.id ?? "", "requirement");
            if (this.sortDir === "asc") {
              return progressA - progressB;
            } else {
              return progressB - progressA;
            }
          }
          return 0;
        });
    },
  },
  methods: {
    totalProgress(
      unitId: string,
      prerequisiteType: "requirement" | "recommended"
    ): number {
      return totalProgress(getPrerequisites(unitId), prerequisiteType);
    },
  },
});
</script>
