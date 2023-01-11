<template>
  <div class="mb-2">
    <div class="collapse-header section-header">
      <h3 class="w-100" data-bs-toggle="collapse" :href="`#${storageKey}`">
        <div class="d-inline">{{ header }}</div>
      </h3>
    </div>
    <div :id="`${storageKey}`" class="collapse" :ref="`${storageKey}`">
      <table
        class="table table-bordered table-dark table-sm table-striped swgoh-table"
      >
        <TableHeader :header="headerData" />
        <tbody>
          <tr v-for="unit in filteredUnitList" :key="unit.id">
            <td class="align-middle text-center">
              <UnitIcon :unit="unit" isLink hideImage />
            </td>
            <td class="align-middle text-center">
              <ProgressBar
                :percent="totalProgress(unit.id ?? '', 'requirement')"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs } from "vue";
import { mapState } from "vuex";

import { setupEvents, setupSorting } from "utils";
import { totalProgress, getPrerequisites, Unit } from "types/unit";
import { NodeCharacter } from "types/shards";
import UnitIcon from "components/units/unitIcon.vue";
import { iTableHead } from "types/general";

const storageKey = "LegendarySummaryTable";
export default defineComponent({
  name: "LegendarySummaryTable",
  setup() {
    const { sortDir, sortMethod, sortBy, sortIcon, searchText } =
      setupSorting(storageKey);

    return {
      sortDir,
      sortMethod,
      sortBy,
      sortIcon,
      searchText,
    };
  },
  components: { UnitIcon },
  props: {
    unitList: {
      type: Array as PropType<(Unit | NodeCharacter)[]>,
      required: true,
    },
    header: {
      type: String,
      default: "Summary",
    },
    storageKey: {
      type: String,
      required: true,
    },
    nodeKey: {
      type: String,
      default: null,
    },
  },
  computed: {
    ...mapState("shards", ["shardFarming"]),
    headerData(): iTableHead {
      return {
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
            label: "Unit Name",
            show: true,
            sortMethodShow: true,
            maxWidth: "50%",
            icon: this.sortIcon("name"),
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
            click: () => {
              this.sortBy("progress");
            },
          },
        ],
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
  mounted() {
    this.$nextTick(() => {
      setupEvents(
        this.$refs[`${this.storageKey}`] as HTMLElement,
        `${this.storageKey}`
      );
    });
  },
});
</script>
