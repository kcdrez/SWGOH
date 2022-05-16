<template>
  <div>
    <div class="collapse-header section-header extended-2">
      <h3>
        <div data-bs-toggle="collapse" :href="`#${scavengerId}`">
          {{ label }}
        </div>
      </h3>
      <MultiSelect
        class="select-columns"
        :options="cols"
        :storageKey="storageKey"
        @checked="selectedColumns = $event"
      />
    </div>
    <table
      :id="scavengerId"
      :ref="storageKey"
      class="table table-bordered table-dark table-sm table-striped mb-0 swgoh-table collapse"
    >
      <thead class="text-center sticky-header">
        <tr>
          <th width="100px" v-if="showCol('icon')">Icon</th>
          <th width="300px" v-if="showCol('name')">Name</th>
          <th width="100px" v-if="showCol('amount')">Amount</th>
          <th width="100px" v-if="showCol('priority')">Priority</th>
          <th width="300px" v-if="showCol('locations')">
            Best Farming Locations
          </th>
          <th width="300px" v-if="showCol('notes')">Notes</th>
        </tr>
      </thead>
      <tbody class="align-middle">
        <tr v-for="gear in list" :key="gear.data.id">
          <td v-if="showCol('icon')">
            <GearIcon :gear="gear.data" />
          </td>
          <td v-if="showCol('name')">{{ gear.data.name }}</td>
          <td v-if="showCol('amount')">{{ gear.scavenger.count }}</td>
          <td v-if="showCol('priority')">{{ gear.scavenger.priority }}</td>
          <td v-if="showCol('locations')">
            <div v-if="gear.scavenger.nodes.length <= 0" class="text-center">
              No known farmable locations.
            </div>
            <ul class="m-0" v-else>
              <li
                v-for="(l, index) in locationLabels(gear.scavenger.nodes)"
                :key="index"
              >
                {{ l }}
              </li>
            </ul>
          </td>
          <td v-if="showCol('notes')">{{ gear.scavenger.notes }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapGetters } from "vuex";

import { Gear, IScavenger } from "../../types/gear";
import GearIcon from "./gearIcon.vue";
import { FarmingNode } from "../../types/shards";
import { setupEvents } from "../../utils";

type tScavenger = { data: Gear; scavenger: IScavenger };
const storageKey = "scavengerTable";

export default defineComponent({
  name: "ScavengerTable",
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
      selectedColumns: [],
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
          return (a.scavenger?.priority ?? 0) > (b.scavenger?.priority ?? 0);
        });
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
          text: "Priority",
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
