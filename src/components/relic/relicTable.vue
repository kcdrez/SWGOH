<template>
  <table
    class="table table-bordered table-dark table-sm table-striped swgoh-table"
  >
    <thead class="sticky-header show-on-mobile">
      <tr class="sort-methods">
        <th class="show-on-mobile">
          <SortMethods
            :sortByOptions="sortByOptions"
            :sortMethod="sortMethod"
            :sortDir="sortDir"
            showSearch
            @methodChange="sortMethod = $event"
            @directionChange="sortDir = $event"
            @searchChange="searchText = $event"
          />
        </th>
      </tr>
      <ColumnHeaders
        class="text-center align-middle"
        :headers="headers"
        @searchChange="searchText = $event"
      />
    </thead>
    <tbody>
      <tr v-for="mat in filteredRelics" :key="mat.id">
        <td class="text-center align-middle" v-if="showCol('icon')">
          <RelicIcon :item="mat" />
        </td>
        <td class="align-middle text-center" v-if="showCol('name')">
          {{ mat.name }}
        </td>
        <td class="align-middle text-center" v-if="showCol('rarity')">
          <span class="row-label">Rarity:</span>
          {{ mat.rarity }}
        </td>
        <td class="text-center align-middle" v-if="showCol('locations')">
          <span class="row-label">Location:</span>
          {{ mat.location.node }}
        </td>
        <td class="text-center align-middle" v-if="showCol('owned')">
          <OwnedAmount :item="mat" :needed="mat.amountNeeded(targetLevels)" />
        </td>
        <td class="align-middle text-center" v-if="showCol('needed')">
          <span class="row-label">Amount Needed:</span>
          {{ mat.amountNeeded(targetLevels) }}
        </td>
        <td class="align-middle" v-if="showCol('progress')">
          <ProgressBar :percent="mat.percent(targetLevels)" class="mt-2" />
        </td>
        <td
          class="align-middle text-center-sm"
          v-if="showRequiredByUnit && showCol('required')"
        >
          <span class="row-label">Required By:</span>
          <ul class="mb-0 no-bullets-sm">
            <li v-for="unit in mat.neededBy" :key="unit.id">
              <Popper hover arrow placement="left">
                <router-link
                  :to="{ name: 'UnitPage', params: { unitId: unit.id } }"
                  >{{ unit.name }}</router-link
                >
                <template #content>
                  <div class="border-bottom mb-1">{{ unit.name }}</div>
                  <div>
                    {{ unit.amount }}
                  </div>
                </template>
              </Popper>
            </li>
          </ul>
        </td>
        <td class="text-center align-middle" v-if="showCol('time')">
          <span class="row-label">Completion Date:</span>
          <Timestamp
            :timeLength="mat.timeEstimation(targetLevels)"
            :displayText="
              $filters.pluralText(mat.timeEstimation(targetLevels), 'day')
            "
            :title="$filters.daysFromNow(mat.timeEstimation(targetLevels))"
            displayClasses="d-inline"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs } from "vue";
import { mapState } from "vuex";

import { Relic } from "types/relic";
import OwnedAmount from "components/relic/relicOwned.vue";
import RelicIcon from "components/relic/relicIcon.vue";
import Timestamp from "components/timestamp.vue";
import { setupColumnEvents, setupSorting } from "utils";
import { iHeader } from "types/general";

export default defineComponent({
  name: "RelicTable",
  setup(props) {
    const { sortDir, sortMethod, searchText, sortBy, sortIcon } = setupSorting(
      props.storageKey
    );
    const list = toRefs(props).selectedColumns;
    const { showCol } = setupColumnEvents(list);

    return {
      sortDir,
      sortMethod,
      searchText,
      sortBy,
      sortIcon,
      showCol,
    };
  },
  components: { OwnedAmount, RelicIcon, Timestamp },
  props: {
    relicList: {
      required: true,
      type: Object as PropType<Relic[]>,
    },
    targetLevels: {
      required: true,
      type: Array as PropType<{ level: number; target: number }[]>,
      validator: (arr: any[]) => {
        return arr.every((x) => {
          return "level" in x && "target" in x;
        });
      },
    },
    showRequiredByUnit: {
      type: Boolean,
      default: false,
    },
    selectedColumns: {
      type: Array as () => string[],
      validator: (arr: string[]) => {
        return arr.every((x) => {
          return typeof x === "string";
        });
      },
      required: true,
    },
    storageKey: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      sortByOptions: [
        {
          value: "name",
          label: "Name",
        },
        {
          value: "rarity",
          label: "Rarity",
        },
        {
          value: "location",
          label: "Location",
        },
        {
          value: "owned",
          label: "Amount Owned",
        },
        {
          value: "needed",
          label: "Amount Needed",
        },
        {
          value: "progress",
          label: "Progress",
        },
        {
          value: "time",
          label: "Time Remaining",
        },
      ],
    };
  },
  computed: {
    ...mapState("relic", ["ownedRelics"]),
    headers(): iHeader[] {
      return [
        {
          label: "Icon",
          show: this.showCol("icon"),
        },
        {
          label: "Mat Name",
          show: this.showCol("name"),
          icon: this.sortIcon("name"),
          input: {
            type: "input",
            classes: "mx-auto my-1 w-75",
            placeholder: "Search",
          },
          click: () => {
            this.sortBy("name");
          },
        },
        {
          label: "Rarity",
          show: this.showCol("rarity"),
          icon: this.sortIcon("rarity"),
          click: () => {
            this.sortBy("rarity");
          },
        },
        {
          label: "Locations",
          show: this.showCol("locations"),
          icon: this.sortIcon("locations"),
          click: () => {
            this.sortBy("locations");
          },
        },
        {
          label: "Amount Owned",
          show: this.showCol("owned"),
          icon: this.sortIcon("owned"),
          maxWidth: "160px",
          click: () => {
            this.sortBy("owned");
          },
        },
        {
          label: "Amount Needed",
          show: this.showCol("needed"),
          icon: this.sortIcon("needed"),
          click: () => {
            this.sortBy("needed");
          },
        },
        {
          label: "Progress",
          show: this.showCol("progress"),
          icon: this.sortIcon("progress"),
          maxWidth: "145px",
          click: () => {
            this.sortBy("progress");
          },
        },
        {
          label: "Required By",
          show: this.showRequiredByUnit && this.showCol("required"),
        },
        {
          label: "Est. Time",
          show: this.showCol("time"),
          icon: this.sortIcon("time"),
          click: () => {
            this.sortBy("time");
          },
        },
      ];
    },
    filteredRelics(): Relic[] {
      return (this.relicList as Relic[])
        .sort((a: Relic, b: Relic) => {
          if (this.sortMethod === "name") {
            const compareA = a.name.toLowerCase();
            const compareB = b.name.toLowerCase();
            if (this.sortDir === "asc") {
              return compareA > compareB ? 1 : -1;
            } else {
              return compareA > compareB ? -1 : 1;
            }
          } else if (this.sortMethod === "location") {
            const compareA = a.location.node.toLowerCase();
            const compareB = b.location.node.toLowerCase();
            if (this.sortDir === "asc") {
              return compareA > compareB ? 1 : -1;
            } else {
              return compareA > compareB ? -1 : 1;
            }
          } else if (this.sortMethod === "rarity") {
            if (this.sortDir === "asc") {
              return a.rarity - b.rarity;
            } else {
              return b.rarity - a.rarity;
            }
          } else if (this.sortMethod === "owned") {
            if (this.sortDir === "asc") {
              return a.owned - b.owned;
            } else {
              return b.owned - a.owned;
            }
          } else if (this.sortMethod === "needed") {
            if (this.sortDir === "asc") {
              return (
                a.amountNeeded(this.targetLevels) -
                b.amountNeeded(this.targetLevels)
              );
            } else {
              return (
                b.amountNeeded(this.targetLevels) -
                a.amountNeeded(this.targetLevels)
              );
            }
          } else if (this.sortMethod === "progress") {
            const amountNeededA = a.amountNeeded(this.targetLevels);
            const amountNeededB = b.amountNeeded(this.targetLevels);

            if (amountNeededA === 0 && amountNeededB === 0) {
              return 0;
            } else if (amountNeededA === 0) {
              return this.sortDir === "asc" ? 1 : -1;
            } else if (amountNeededB === 0) {
              return this.sortDir === "asc" ? -1 : 1;
            }

            if (this.sortDir === "asc") {
              return (
                a.progress(this.targetLevels) - b.progress(this.targetLevels)
              );
            } else {
              return (
                b.progress(this.targetLevels) - a.progress(this.targetLevels)
              );
            }
          } else if (this.sortMethod === "time") {
            if (this.sortDir === "asc") {
              return (
                a.timeEstimation(this.targetLevels) -
                b.timeEstimation(this.targetLevels)
              );
            } else {
              return (
                b.timeEstimation(this.targetLevels) -
                a.timeEstimation(this.targetLevels)
              );
            }
          }
          return 0;
        })
        .filter((relic: Relic) => {
          const name = relic.name.toLowerCase().replace(/\s/g, "");
          const id = relic.id.toLowerCase().replace(/\s/g, "");
          const compare = this.searchText.toLowerCase().replace(/\s/g, "");
          return name.includes(compare) || id.includes(compare);
        });
    },
  },
});
</script>

<style lang="scss" scoped></style>
