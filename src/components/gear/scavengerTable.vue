<template>
  <div>
    <div class="collapse-header section-header extended-1">
      <h3>
        <div data-bs-toggle="collapse" :href="`#${scavengerId}`">
          {{ label }}
        </div>
      </h3>
      <MultiSelect
        class="select-columns"
        :options="cols"
        :storageKey="storageKey + 'Columns'"
        @checked="selectedColumns = $event"
      />
    </div>
    <table
      :id="scavengerId"
      :ref="storageKey"
      class="table table-bordered table-dark table-sm table-striped mb-0 swgoh-table collapse"
    >
      <thead class="text-center sticky-header align-middle">
        <tr>
          <th width="100px" v-if="showCol('icon')">Icon</th>
          <th
            width="300px"
            v-if="showCol('name')"
            @click="sortBy('name')"
            class="c-pointer"
          >
            Name
            <i class="fas mx-1" :class="sortIcon('name')"></i>
          </th>
          <th
            width="100px"
            v-if="showCol('amount')"
            @click="sortBy('amount')"
            class="c-pointer"
          >
            Amount
            <i class="fas mx-1" :class="sortIcon('amount')"></i>
          </th>
          <th
            width="100px"
            v-if="showCol('priority')"
            @click="sortBy('priority')"
            class="c-pointer"
          >
            Efficiency Rating
            <i class="fas mx-1" :class="sortIcon('priority')"></i>
          </th>
          <th
            width="300px"
            v-if="showCol('locations')"
            @click="sortBy('locations')"
            class="c-pointer"
          >
            Best Farming Locations
            <i class="fas mx-1" :class="sortIcon('locations')"></i>
          </th>
          <th width="300px" v-if="showCol('notes')">Notes</th>
        </tr>
      </thead>
      <tbody class="align-middle text-center-sm">
        <tr v-for="gear in list" :key="gear.data.id">
          <td v-if="showCol('icon')">
            <GearIcon :gear="gear.data" />
          </td>
          <td v-if="showCol('name')">{{ gear.data.name }}</td>
          <td v-if="showCol('amount')">
            <span class="row-label">Amount:</span>
            {{ gear.scavenger.count }}
          </td>
          <td v-if="showCol('priority')">
            <span class="row-label">Efficiency Rating:</span>
            {{ gear.scavenger.priority }}
          </td>
          <td v-if="showCol('locations')">
            <span class="row-label">Locations:</span>
            <div v-if="gear.scavenger.nodes.length <= 0" class="text-center">
              No known farmable locations.
            </div>
            <ul class="m-0 no-bullets-sm" v-else>
              <li
                v-for="(l, index) in locationLabels(
                  gear?.scavenger?.nodes ?? []
                )"
                :key="index"
              >
                {{ l }}
              </li>
            </ul>
          </td>
          <td
            v-if="showCol('notes')"
            :class="{ 'hidden-sm': !gear.scavenger.notes }"
          >
            {{ gear.scavenger.notes }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from "vue";
import { mapState, mapGetters } from "vuex";

import { Gear, IScavenger } from "types/gear";
import GearIcon from "components/gear/gearIcon.vue";
import { FarmingNode } from "types/shards";
import { setupEvents, setupSorting } from "utils";

type tScavenger = { data: Gear; scavenger: IScavenger };
const storageKey = "scavengerTable";

export default defineComponent({
  name: "ScavengerTable",
  setup(props) {
    const { sortDir, sortMethod, searchText, sortBy, sortIcon } = setupSorting(
      `${storageKey}-${props.scavengerId}`
    );

    return {
      sortDir,
      sortMethod,
      searchText,
      sortBy,
      sortIcon,
    };
  },
  components: { GearIcon },
  props: {
    scavengerId: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      selectedColumns: [], //todo: figure out how to use utils function
    };
  },
  computed: {
    ...mapState("gear", ["gearList"]),
    ...mapState("player", ["player"]),
    ...mapState("shards", ["shardFarming"]),
    ...mapGetters("planner", ["fullUnitList"]),
    list(): tScavenger[] {
      return this.gearList
        .reduce((acc: any[], gear: Gear) => {
          const match = gear.scavenger.find(
            (x: any) => x.id === this.scavengerId
          );
          if (match && match.priority) {
            acc.push({
              data: gear,
              scavenger: match,
            });
          }
          return acc;
        }, [])
        .sort((a: tScavenger, b: tScavenger) => {
          // return (a.scavenger?.priority ?? 0) > (b.scavenger?.priority ?? 0);
          if (this.sortMethod === "name") {
            const compareA = a.data.name.toLowerCase();
            const compareB = b.data.name.toLowerCase();
            if (this.sortDir === "asc") {
              return compareA > compareB ? 1 : -1;
            } else {
              return compareA > compareB ? -1 : 1;
            }
          } else if (this.sortMethod === "amount") {
            if (this.sortDir === "asc") {
              return a.scavenger.count > b.scavenger.count ? 1 : -1;
            } else {
              return a.scavenger.count > b.scavenger.count ? -1 : 1;
            }
          } else if (this.sortMethod === "priority") {
            if (this.sortDir === "asc") {
              return (a.scavenger.priority ?? 0) > (b.scavenger.priority ?? 0)
                ? 1
                : -1;
            } else {
              return (a.scavenger.priority ?? 0) > (b.scavenger.priority ?? 0)
                ? -1
                : 1;
            }
          } else if (this.sortMethod === "locations") {
            const stores = [
              "guild_store",
              "squad_arena_store",
              "guild_events_store1",
              "guild_events_store2",
              "challenges_tac",
              "challenges_agi",
              "challenges_str",
            ];

            for (let i = 0; i < stores.length; i++) {
              const storeStatus = checkStore(stores[i], a, b);

              if (storeStatus === 1 || storeStatus === 2) {
                if (this.sortDir === "asc") {
                  return storeStatus === 1 ? -1 : 1;
                } else {
                  return storeStatus === 1 ? 1 : -1;
                }
              } else if (storeStatus === 0) {
                return 1;
              }
            }
            if (this.sortDir === "asc") {
              return (a.scavenger.nodes ?? []).length >
                (b.scavenger.nodes ?? []).length
                ? 1
                : -1;
            } else {
              return (a.scavenger.nodes ?? []).length >
                (b.scavenger.nodes ?? []).length
                ? -1
                : 1;
            }
          }
          return 0;
        });

      function checkStore(
        storeId: string,
        a: tScavenger,
        b: tScavenger
      ): number {
        const hasStoreA = a.scavenger.nodes?.some((x) => x === storeId);
        const hasStoreB = b.scavenger.nodes?.some((x) => x === storeId);

        if (hasStoreA && hasStoreB) {
          return 0;
        } else if (hasStoreA) {
          return 1;
        } else if (hasStoreB) {
          return 2;
        } else {
          return -1;
        }
      }
    },
    cols(): { text: string; value: any }[] {
      const list = [
        {
          text: "Icon",
          value: "icon",
        },
        {
          text: "Name",
          value: "name",
        },
        {
          text: "Amount",
          value: "amount",
        },
        {
          text: "Efficiency Rating",
          value: "priority",
        },
        {
          text: "Best Locations",
          value: "locations",
        },
        {
          text: "Notes",
          value: "notes",
        },
      ];
      return list;
    },
    storageKey() {
      return `${storageKey}-${this.scavengerId}`;
    },
  },
  methods: {
    locationLabels(locationIds: string[]) {
      return locationIds.map((location) => {
        const [locationId, gearId] = location.split(" > ");
        let label = "";
        if (locationId) {
          const match: FarmingNode | undefined = this.shardFarming.find(
            (x: FarmingNode) => x.id === locationId
          );
          label = match ? match.label : locationId;
        }
        if (gearId) {
          const match: Gear | undefined = this.gearList.find(
            (x: Gear) => x.id === gearId
          );
          label += ` > ${match ? match.name : gearId}`;
        }
        return label;
      });
    },
    showCol(key: string): boolean {
      return this.selectedColumns.some((x) => x === key);
    },
  },
  mounted() {
    setupEvents(this.$refs[this.storageKey] as HTMLElement, this.storageKey);
  },
});
</script>

<style lang="scss" scoped>
.sticky-header {
  top: 106px;
}
</style>
