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
      <TableHeader :header="header" />
      <tbody class="align-middle text-center">
        <tr v-for="location in filteredScavengerData" :key="location.id">
          <td class="align-top">
            <span class="sticky-name">
              {{ locationName(location.id) }}
              <img
                v-if="location.currency"
                class="currency-img d-block m-auto"
                :src="`./images/${location.currency}.png`"
              />
            </span>
          </td>
          <td>
            <div class="container gear-container">
              <div
                class="row py-1"
                v-for="gear in location.gear"
                :key="gear.id"
              >
                <div class="col-lg-2 col-md-5 align-self-center">
                  <template v-if="gearData(gear.id)">
                    <GearIcon :gear="gearData(gear.id)" showName />
                  </template>
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
                    <div>{{ gear.cost }}</div>
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
                        <div class="">
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
import { defineComponent, ref, Ref } from "vue";
import { mapState } from "vuex";

import { Gear } from "types/gear";
import { IScavenger } from "types/scavenger";
import GearIcon from "components/gear/gearIcon.vue";
import RelicIcon from "components/relic/relicIcon.vue";
import { FarmingNode } from "types/shards";
import { setupEvents } from "utils";
import { scavengerFarming, scavengerCost } from "types/scavenger";
import { Relic } from "types/relic";
import { round2Decimals } from "utils";
import { iTableHead } from "types/general";
import TableHeader from "components/general/tableHeader.vue";
import relicMapping from "types/relicMapping";

const storageKey = "ScavengerFarmingTable";

export default defineComponent({
  name: "ScavengerFarmingTable",
  setup(_props) {
    const selectedColumns: Ref<string[]> = ref([]);

    return { selectedColumns };
  },
  components: { GearIcon, RelicIcon, TableHeader },
  data() {
    return { storageKey };
  },
  computed: {
    ...mapState("shards", ["shardFarming"]),
    ...mapState("gear", ["gearList"]),
    ...mapState("relic", ["relicConfig"]),
    header(): iTableHead {
      return {
        classes: "text-center sticky-header align-middle show-on-mobile",
        headers: [
          {
            cells: [
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
                sortMethodShow: true,
                input: {
                  type: "multiselect",
                  placeholder: "Filter Relic Mats",
                  options: Object.values(relicMapping).reduce(
                    (acc: { label: string; value: string }[], x: Relic) => {
                      if (x.location.node === "Jawa Scavenger") {
                        acc.push({
                          label: x.name,
                          value: x.id,
                        });
                      }
                      return acc;
                    },
                    []
                  ),
                  storageKey: storageKey + "FilterRelicMats",
                  click: (data: string[]) => {
                    this.selectedColumns = data;
                  },
                },
              },
            ],
          },
        ],
      };
    },
    filteredScavengerData(): IScavenger[] {
      return scavengerFarming
        .map(({ gear, ...x }) => {
          return {
            gear: gear?.filter((gearEl) => {
              return this.selectedColumns.some((r) =>
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
.sticky-name {
  position: sticky;
  top: 155px;
}
</style>
