<template>
  <div>
    <div class="collapse-header section-header">
      <h3>
        <div data-bs-toggle="collapse" :href="`#${storageKey}`">
          Farming Locations
        </div>
      </h3>
    </div>
    <table
      :id="storageKey"
      :ref="storageKey"
      class="table table-bordered table-dark table-sm table-striped mb-0 swgoh-table collapse"
    >
      <thead class="text-center sticky-header align-middle show-on-mobile">
        <tr class="sort-methods">
          <th class="show-on-moblie">
            <MultiSelect
              class="filter-mats"
              label="Filter Relic Mats"
              :options="filterRelicMatCols"
              :storageKey="storageKey + 'Filter'"
              @checked="filteredRelicMats = $event"
            />
          </th>
        </tr>
        <ColumnHeaders class="text-center align-middle" :headers="headers" />
      </thead>
      <tbody class="align-middle text-center">
        <tr v-for="location in filteredScavengerData" :key="location.id">
          <td>
            {{ locationName(location.id) }}
          </td>
          <td>
            <div class="container gear-container">
              <div
                class="row py-1"
                v-for="gear in location.gear"
                :key="gear.id"
              >
                <div class="col-lg-2 col-md-5 align-self-center">
                  <GearIcon :gear="gearData(gear.id)" showName />
                </div>
                <div class="col-lg-1 col-md-3 align-self-center">
                  <div
                    class="d-flex justify-content-center align-items-center"
                    v-if="gear.cost"
                  >
                    <img
                      class="currency-img"
                      :src="`./images/${location.currency}.png`"
                    />
                    <div class="text-small">{{ gear.cost }}</div>
                  </div>
                </div>
                <div
                  class="col-lg-2 col-md-4 d-flex justify-content-center align-items-center"
                >
                  <div v-if="gear.scavenger">
                    <div
                      v-for="scavenger in gear.scavenger"
                      :key="scavenger.id"
                    >
                      <RelicIcon :item="relicConfig[scavenger.id]" />
                      <div v-if="gear.cost && gear.amount">
                        <div class="text-small">
                          Amount Per Purchase:
                          {{ getScavengerMatAmount(scavenger, gear) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="col-lg-7 col-md-12 text-center-md text-center-sm text-left align-self-center"
                >
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
import { mapState } from "vuex";

import { Gear } from "types/gear";
import GearIcon from "components/gear/gearIcon.vue";
import RelicIcon from "components/relic/relicIcon.vue";
import { FarmingNode } from "types/shards";
import { setupEvents } from "utils";
import { scavengerFarming, scavengerCost } from "types/scavenger";
import { Relic } from "types/relic";
import { round2Decimals } from "utils";
import { iHeader } from "types/general";

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
      selectedColumns: [], //todo: figure out how to use the utils function
      filteredRelicMats: [],
      storageKey,
    } as dataModel;
  },
  computed: {
    ...mapState("shards", ["shardFarming"]),
    ...mapState("gear", ["gearList"]),
    ...mapState("relic", ["relicConfig"]),
    headers(): iHeader[] {
      return [
        {
          label: "Location",
          classes: "location-col",
          containerClass: "col-container",
          show: true,
        },
        {
          label: "Gear",
          classes: "gear-col",
          containerClass: "col-container",
          show: true,
          input: {
            type: "multiselect",
            classes: "filter-mats",
            placeholder: "Filter Relic Mats",
            options: [],
            click: (data: string[]) => {
              this.filteredRelicMats = data;
            },
          },
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
            gear: gear?.filter((gearEl) => {
              return this.filteredRelicMats.some((r) =>
                (gearEl?.scavenger ?? []).some((x) => x.id === r)
              );
            }),
            ...x,
          };
        })
        .filter((x) => !!x.gear && x.gear?.length > 0);
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
    getScavengerMatAmount(scavengerData: any, gearData: any) {
      return round2Decimals(
        (scavengerData.amount * gearData.amount) /
          (scavengerCost as any)[scavengerData.id]
      );
    },
  },
  mounted() {
    setupEvents(this.$refs[this.storageKey] as HTMLElement, this.storageKey);
  },
});
</script>

<style lang="scss" scoped>
@import "styles/variables.scss";

.sticky-header {
  top: 106px;
}
::v-deep(.gear-col, .location-col) {
  .col-container {
    display: flex;
    align-items: center;
    justify-content: center;

    @media only screen and (min-width: 1100px) {
      height: 40px;
    }
    @media only screen and (max-width: 1100px) {
      flex-wrap: wrap;
    }
  }
  &.location-col {
    width: 300px;
  }
}

::v-deep(.filter-mats) {
  @media only screen and (min-width: 1100px) {
    width: 275px;
    position: absolute;
    right: 0;
    margin-right: 1rem;
  }
  @media only screen and (max-width: 1100px) {
    width: 100%;
  }
}

.gear-container {
  .row {
    &:nth-of-type(2n + 1) {
      background-color: $gray-2 !important;
    }
    &:nth-of-type(2n) {
      background-color: $gray-1 !important;
    }
  }
}

.currency-img {
  max-width: 30px;
}
</style>
