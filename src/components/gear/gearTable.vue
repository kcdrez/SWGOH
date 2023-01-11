<template>
  <div>
    <table
      class="table table-bordered table-dark table-sm table-striped mb-0 swgoh-table"
      v-if="gearList.length > 0"
    >
      <TableHeader :header="header" />
      <tbody>
        <tr v-if="filteredSalvageList.length === 0">
          <td colspan="100%" class="empty-search">
            There are no gear pieces that meet that search criteria.
          </td>
        </tr>
        <tr
          class="align-middle text-center"
          v-for="salvage in filteredSalvageList"
          :key="salvage.id"
        >
          <td v-if="showCol('icon')">
            <GearIcon :gear="salvage" />
          </td>
          <td v-if="showCol('name')">
            {{ salvage.name }}
          </td>
          <td v-if="showCol('mark')" :class="{ 'hidden-sm': !!salvage.mark }">
            {{ salvage.mark }}
          </td>
          <td v-if="showCol('locations')">
            <div v-if="salvage.locations.length <= 0" class="text-center">
              No known farmable locations.
            </div>
            <template v-else>
              <button
                class="btn btn-sm btn-info m-auto d-block"
                data-bs-toggle="collapse"
                :href="`#locations-${salvage.id}`"
              >
                Show/Hide Locations
              </button>
              <ul
                class="m-0 collapse text-left text-center-sm no-bullets-sm"
                :id="`locations-${salvage.id}`"
              >
                <li v-for="(l, index) in salvage.locationLabels" :key="index">
                  {{ l }}
                </li>
              </ul>
            </template>
          </td>
          <td v-if="showCol('owned')">
            <OwnedAmount :salvage="salvage" />
          </td>
          <td v-if="showCol('needed')">
            <span class="row-label">Amount Needed:</span>
            {{ salvage.totalAmount }}
          </td>
          <td v-if="showCol('progress')">
            <ProgressBar :percent="salvage.percent" />
          </td>
          <td
            v-if="showRequiredByUnit && showCol('required')"
            class="text-left text-center-sm"
          >
            <span class="row-label">Needed By:</span>
            <ul class="mb-0 no-bullets-sm">
              <li v-for="unit in salvage.neededBy" :key="unit.id">
                <Popper hover arrow placement="left">
                  <router-link
                    :to="{ name: 'UnitPage', params: { unitId: unit.id } }"
                    >{{ unit.name }}</router-link
                  >
                  <template #content>
                    <div class="border-bottom mb-1">{{ unit.name }}</div>
                    <div v-for="tier in unit.gearLevels" :key="tier.level">
                      <GearText :level="tier.level" />:
                      <span class="ml-1">{{ tier.amount }}</span>
                    </div>
                    <div
                      class="border-top mt-1"
                      v-if="unit.gearLevels.length > 1"
                    >
                      Total: {{ unit.totalAmount }}
                    </div>
                  </template>
                </Popper>
              </li>
            </ul>
          </td>
          <td v-if="showCol('time')">
            <span class="row-label">Completion Date:</span>
            <Timestamp
              :timeLength="salvage.timeEstimation"
              displayClasses="d-inline"
            />
          </td>
          <td v-if="showCol('actions')">
            <div
              class="btn-group btn-group-sm d-block text-center"
              role="group"
            >
              <button
                type="button"
                class="btn btn-warning text-dark"
                title="Mark this salvage as irrelevant, removing it from the planner estimation"
                @click="salvage.irrelevant = true"
              >
                <i class="fas fa-toilet"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="text-center">
      There are no gear requirements for these units. This is either because you
      already own all the gear and can immediately upgrade to the target level
      or all the units are already at the target gear level.
    </div>
    <table
      class="table table-bordered table-dark table-sm table-striped"
      v-if="irrelevantGear.length > 0"
    >
      <thead
        class="c-pointer sticky-header"
        data-bs-toggle="collapse"
        href="#irrelevantSection"
        title="Show/Hide irrelevant pieces"
      >
        <tr>
          <th :colspan="showRequiredByUnit ? '6' : '5'" class="text-center">
            Irrelevant Pieces
          </th>
        </tr>
      </thead>
      <tbody id="irrelevantSection" class="collapse">
        <tr v-for="salvage in irrelevantGear" :key="salvage.id">
          <td :colspan="showRequiredByUnit ? '5' : '4'" class="text-center">
            <GearIcon :gear="salvage" />
            {{ salvage.name }}
          </td>
          <td class="align-middle">
            <div
              class="btn-group btn-group-sm d-block text-center"
              role="group"
            >
              <button
                type="button"
                class="btn btn-success"
                title="Mark this salvage as relevant, moving it back into the planner estimation"
                @click="salvage.irrelevant = false"
              >
                <i class="fas fa-heart"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <Confirm
      :isOpen="showResetConfirm"
      title="Are you sure?"
      :text="`Are you sure you want to reset all the gear and set the owned quantity to zero?`"
      @confirm="reset()"
      @cancel="showResetConfirm = false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs } from "vue";
import { mapActions, mapState } from "vuex";

import { Gear } from "types/gear";
import OwnedAmount from "components/gear/gearOwned.vue";
import GearIcon from "components/gear/gearIcon.vue";
import Timestamp from "components/general/timestamp.vue";
import GearText from "components/gear/gearText.vue";
import { setupColumnEvents, setupSorting } from "utils";
import { iTableHead } from "types/general";

export default defineComponent({
  name: "GearTable",
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
  components: { OwnedAmount, GearIcon, GearText, Timestamp },
  props: {
    gearList: {
      required: true,
      type: Object as PropType<Gear[]>,
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
      showResetConfirm: false,
    };
  },
  computed: {
    ...mapState("gear", { allGear: "gearList" }),
    filteredSalvageList(): Gear[] {
      return this.gearList
        .filter((gear: Gear) => {
          if (gear.irrelevant) {
            return false;
          }
          const name = gear.name.toLowerCase().replace(/\s/g, "");
          const compare = this.searchText.toLowerCase().replace(/\s/g, "");
          return name.includes(compare);
        })
        .sort((a: Gear, b: Gear) => {
          if (this.sortMethod === "name") {
            const compareA = a.name.toLowerCase();
            const compareB = b.name.toLowerCase();
            if (this.sortDir === "asc") {
              return compareA > compareB ? 1 : -1;
            } else {
              return compareA > compareB ? -1 : 1;
            }
          } else if (this.sortMethod === "mark") {
            if (this.sortDir === "asc") {
              return a.markLevel - b.markLevel;
            } else {
              return b.markLevel - a.markLevel;
            }
          } else if (this.sortMethod === "locations") {
            if (this.sortDir === "asc") {
              return a.locations[0] > b.locations[0] ? 1 : -1;
            } else {
              return a.locations[0] < b.locations[0] ? -1 : 1;
            }
          } else if (this.sortMethod === "progress") {
            if (this.sortDir === "asc") {
              return a.progress - b.progress;
            } else {
              return b.progress - a.progress;
            }
          } else if (this.sortMethod === "time") {
            const compareA =
              a.timeEstimation === 0 ? Infinity : a.timeEstimation;
            const compareB =
              b.timeEstimation === 0 ? Infinity : b.timeEstimation;

            if (this.sortDir === "asc") {
              return compareA > compareB ? 1 : -1;
            } else {
              return compareA > compareB ? -1 : 1;
            }
          } else if (this.sortMethod === "owned") {
            if (this.sortDir === "asc") {
              return a.owned - b.owned;
            } else {
              return b.owned - a.owned;
            }
          } else if (this.sortMethod === "needed") {
            if (this.sortDir === "asc") {
              return a.totalAmount - b.totalAmount;
            } else {
              return b.totalAmount - a.totalAmount;
            }
          } else if (this.sortMethod === "required") {
            if (this.sortDir === "asc") {
              return a.neededBy[0] > b.neededBy[0] ? 1 : -1;
            } else {
              return a.neededBy[0] < b.neededBy[0] ? -1 : 1;
            }
          }
          return 0;
        });
    },
    irrelevantGear(): Gear[] {
      return this.gearList.filter((gear: Gear) => {
        return gear.irrelevant;
      });
    },
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
            label: "Icon",
            show: this.showCol("icon"),
          },
          {
            label: "Name",
            show: this.showCol("name"),
            sortMethodShow: true,
            maxWidth: "300px",
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
            icon: this.sortIcon("name"),
          },
          {
            label: "Mark",
            show: this.showCol("mark"),
            sortMethodShow: true,
            icon: this.sortIcon("mark"),
            click: () => {
              this.sortBy("mark");
            },
          },
          {
            label: "Locations",
            maxWidth: "150px",
            show: this.showCol("locations"),
            sortMethodShow: true,
            icon: this.sortIcon("locations"),
            click: () => {
              this.sortBy("locations");
            },
          },
          {
            label: "Owned",
            maxWidth: "125px",
            show: this.showCol("owned"),
            sortMethodShow: true,
            icon: this.sortIcon("owned"),
            title: "Amount of gear owned",
            input: {
              type: "button",
              placeholder: "Reset",
              classes: "btn btn-sm btn-primary",
              click: () => {
                this.showResetConfirm = true;
              },
            },
            click: () => {
              this.sortBy("owned");
            },
          },
          {
            label: "Needed",
            maxWidth: "125px",
            show: this.showCol("needed"),
            sortMethodShow: true,
            icon: this.sortIcon("needed"),
            title: "Amount of gear needed for all characters being tracked",
            click: () => {
              this.sortBy("needed");
            },
          },
          {
            label: "Progress",
            maxWidth: "145px",
            show: this.showCol("progress"),
            sortMethodShow: true,
            icon: this.sortIcon("progress"),
            click: () => {
              this.sortBy("progress");
            },
          },
          {
            label: "Required By",
            maxWidth: "125px",
            show: this.showRequiredByUnit && this.showCol("required"),
            sortMethodShow: this.showRequiredByUnit,
          },
          {
            label: "Est. Time",
            maxWidth: "125px",
            show: this.showCol("time"),
            sortMethodShow: true,
            icon: this.sortIcon("time"),
            click: () => {
              this.sortBy("time");
            },
          },
          {
            label: "Actions",
            show: this.showCol("actions"),
          },
        ],
      };
    },
  },
  methods: {
    ...mapActions("gear", ["saveOwnedCount"]),
    getGear(id: string): Gear | undefined {
      return this.allGear.find((x: Gear) => x.id === id);
    },
    reset() {
      this.filteredSalvageList.forEach((gear: Gear) => {
        gear.owned = 0;
      });
      this.showResetConfirm = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.empty-search {
  font-size: 1.5rem;
  text-align: center;
}
</style>
