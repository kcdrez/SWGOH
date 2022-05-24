<template>
  <div>
    <div class="collapse-header section-header extended-2">
      <h3>
        <div data-bs-toggle="collapse" :href="`#${storageKey}`">
          Farming Locations
        </div>
      </h3>
      <!-- <MultiSelect
        class="select-columns"
        :options="cols"
        :storageKey="storageKey + 'Columns'"
        @checked="selectedColumns = $event"
      /> -->
    </div>
    <table
      :id="storageKey"
      :ref="storageKey"
      class="table table-bordered table-dark table-sm table-striped mb-0 swgoh-table collapse"
    >
      <thead class="text-center sticky-header">
        <tr>
          <th width="300px">
            <div class="location-col">
              <div class="w-100">Location</div>
            </div>
          </th>
          <th width="300px">
            <div class="d-flex align-items-center gear-col">
              <div class="w-100">Gear</div>
              <MultiSelect
                class="filter-mats"
                label="Filter Relic Mats"
                :options="filterRelicMatCols"
                :storageKey="storageKey + 'Filter'"
                @checked="filteredRelicMats = $event"
              />
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="align-middle text-center">
        <tr v-for="location in filteredScavengerData" :key="location.id">
          <td>
            {{ locationName(location.id) }}
          </td>
          <td>
            <div class="container">
              <div
                class="row my-1"
                v-for="gear in location.gear"
                :key="gear.id"
              >
                <div class="col-1 align-self-center">
                  <GearIcon :gear="gearData(gear.id)" />
                </div>
                <div class="col-1 align-self-center">
                  <i class="fa fa-arrow-right" v-if="gear.scavenger"></i>
                </div>
                <div
                  class="col-2 align-self-center d-flex justify-content-evenly"
                >
                  <template v-if="gear.scavenger">
                    <RelicIcon
                      v-for="scavenger in gear.scavenger"
                      :key="scavenger"
                      :item="relicConfig[scavenger]"
                    />
                  </template>
                </div>
                <div class="col text-left align-self-center">
                  {{ gear.notes }}
                </div>
              </div>
            </div>
          </td>
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
import RelicIcon from "../relic/relicIcon.vue";
import { FarmingNode } from "../../types/shards";
import { setupEvents } from "../../utils";
import { scavengerFarming } from "../../types/scavenger";
import { Relic } from "../../types/relic";

const storageKey = "ScavengerFarmingTable";

interface dataModel {
  selectedColumns: string[];
  filteredRelicMats: string[];
  storageKey: string;
}

export default defineComponent({
  name: "ScavengerFarmingTable",
  components: { GearIcon, RelicIcon },
  data() {
    return {
      selectedColumns: [],
      filteredRelicMats: [],
      storageKey,
    } as dataModel;
  },
  computed: {
    ...mapState("shards", ["shardFarming"]),
    ...mapState("gear", ["gearList"]),
    ...mapState("relic", ["relicConfig"]),
    cols(): { text: string; value: any }[] {
      return [
        {
          text: "Name",
          value: "name",
        },
        {
          text: "Gear",
          value: "gear",
        },
      ];
    },
    filterRelicMatCols(): { text: string; value: any }[] {
      return [
        {
          text: "Carbonite Circuit Board",
          value: "carbonite_circuit_board",
        },
        {
          text: "Bronzium Wiring",
          value: "bronzium_wiring",
        },
        {
          text: "Chromium Transistor",
          value: "chromium_transistor",
        },
        {
          text: "Aurodium Heatsink",
          value: "aurodium_heatsink",
        },
        {
          text: "Electrium Conductor",
          value: "electrium_conductor",
        },
        {
          text: "Zinbiddle Card",
          value: "zinbiddle_card",
        },
        {
          text: "Impulse Detector",
          value: "impulse_detector",
        },
        {
          text: "Gyrda Keypad",
          value: "gyrda_keypad",
        },
      ];
    },
    filteredScavengerData(): any[] {
      return scavengerFarming
        .map(({ gear, ...x }) => {
          return {
            gear: gear.filter((gearEl) => {
              return this.filteredRelicMats.some((r) =>
                (gearEl?.scavenger ?? []).includes(r)
              );
              // return this.filteredRelicMats.includes(gearEl?.scavenger ?? "");
            }),
            ...x,
          };
        })
        .filter((x) => x.gear.length > 0);
    },
  },
  methods: {
    showCol(key: string): boolean {
      return this.selectedColumns.some((x) => x === key);
    },
    locationName(id: string): string {
      const match: FarmingNode | undefined = this.shardFarming.find(
        (x: FarmingNode) => x.id === id
      );
      return match ? match.label : id;
    },
    gearData(id: string): Gear | undefined {
      return this.gearList.find((gear: Gear) => gear.id === id);
    },
    relicData(id: string): Relic | undefined {
      return this.relicConfig[id];
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
.gear-col,
.location-col {
  height: 40px;
  display: flex;
  align-items: center;
}
.filter-mats {
  width: 275px;
  position: absolute;
  right: 0;
  margin-right: 1rem;
}
</style>
