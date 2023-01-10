<template>
  <div v-if="prerequisites">
    <div class="mb-2 d-flex justify-content-center" v-if="unit.stars < 7">
      <h5 class="text-center mb-0">Total Progress:</h5>
      <div class="total-progress-bar">
        <ProgressBar :percent="totalProgress('requirement')" />
      </div>
    </div>
    <div
      v-if="
        totalProgress('requirement') === 100 && nodeKey === 'galactic_legends'
      "
      class="container mb-3"
    >
      <div class="row">
        <div class="col-md-6 col-sm-12">
          <div class="input-group input-group-sm mb-1" v-if="unit.stars < 7">
            <span class="input-group-text">Shards Owned:</span>
            <ShardsOwned :unit="unit" class="form-control" />
          </div>
          <template v-else>
            <div class="input-group input-group-sm mb-1">
              <span class="input-group-text">Tier 4 Completed:</span>
              <span class="input-group-text tier-toggle">
                <Toggle
                  class="toggle-gl-tier"
                  v-model="unit.glTier4"
                  onLabel="Complete"
                  offLabel="Incomplete"
                />
              </span>
            </div>
            <div class="input-group input-group-sm mb-1">
              <span class="input-group-text">Tier 5 Completed:</span>
              <span class="input-group-text tier-toggle">
                <Toggle
                  class="toggle-gl-tier"
                  v-model="unit.glTier5"
                  onLabel="Complete"
                  offLabel="Incomplete"
                />
              </span>
            </div>
          </template>
          <div class="input-group input-group-sm mb-1">
            <span class="input-group-text">Ultimate Ability Mats:</span>
            <input
              class="form-control"
              v-model.number="unit.glUltMats"
              type="number"
            />
          </div>
          <div class="input-group input-group-sm mb-1">
            <span class="input-group-text">Owned Tickets:</span>
            <input
              class="form-control"
              type="number"
              v-model.number="unit.glOwnedTickets"
              min="0"
            />
          </div>
          <EnergySpent showStandard />
        </div>
        <div class="col-md-6 col-sm-12">
          <div class="input-group input-group-sm mb-1">
            <span class="input-group-text">Remaining GL Tickets:</span>
            <span class="input-group-text flex-fill">{{
              unit.totalGLTicketsNeeded
            }}</span>
          </div>
          <div class="input-group input-group-sm mb-1">
            <span class="input-group-text">Estimated 7 Star:</span>
            <span class="input-group-text flex-fill">
              <Timestamp :timeLength="estimatedUnlock.time" />
              <span class="mx-1">&bull;</span>
              {{ estimatedUnlock.energy }} Energy
            </span>
          </div>
          <div class="input-group input-group-sm mb-1">
            <span class="input-group-text">Estimated Ultimate:</span>
            <span class="input-group-text flex-fill">
              <Timestamp :timeLength="estimatedTotal.time" />
              <span class="mx-1">&bull;</span>
              {{ estimatedTotal.energy }} Energy
            </span>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else-if="
        totalProgress('requirement') === 100 &&
        unit.isCapitalShip &&
        unit.stars < 7
      "
      class="container mb-3"
    >
      <div class="row">
        <div class="col-md-6 col-sm-12">
          <div class="input-group input-group-sm mb-1">
            <span class="input-group-text">Shards Owned:</span>
            <ShardsOwned :unit="unit" class="form-control" />
          </div>
          <div class="input-group input-group-sm">
            <span class="input-group-text">Event Refreshes:</span>
            <input
              type="number"
              class="form-control"
              v-model="unit.capitalShipRefreshes"
              min="0"
            />
          </div>
        </div>
        <div class="col-md-6 col-sm-12">
          <Timestamp
            :timeLength="estimatedTotal.time"
            label="Estimated 7 Star Completion:"
          />
        </div>
      </div>
    </div>
    <table
      v-else
      class="table table-bordered table-dark table-sm table-striped swgoh-table"
    >
      <thead class="sticky-header show-on-mobile">
        <ColumnHeaders
          class="text-center align-middle"
          :headers="headers"
          @searchChange="searchText = $event"
        />
      </thead>
      <tbody>
        <LegendaryRequirementRow
          :prerequisites="prerequisites"
          :selectedColumns="selectedColumns"
          :simpleView="simpleView"
          :showRecommended="showRecommended"
          :unitId="unit.id"
        />
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from "vue";
import { mapState, mapGetters } from "vuex";
import _ from "lodash";

import ShardsOwned from "components/shards/shardsOwned.vue";
import Timestamp from "components/timestamp.vue";
import EnergySpent from "components/energySpent.vue";
import LegendaryRequirementRow from "./legendaryRequirementsRow.vue";
import {
  Unit,
  getPercent,
  getUnit,
  totalProgress,
  getPrerequisites,
} from "types/unit";
import { displayValue, IPrerequisite } from "types/shards";
import { isGearRequirement, isRelicRequirement } from "types/shards";
import { setupSorting, setupColumnEvents } from "utils";
import { iHeader } from "types/general";

export default defineComponent({
  name: "LegendaryRequirementsTable",
  components: {
    ShardsOwned,
    Timestamp,
    EnergySpent,
    LegendaryRequirementRow,
  },
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
  props: {
    unit: {
      type: Object as () => Unit,
      required: true,
    },
    selectedColumns: {
      type: Array as () => string[],
      validator: (arr: any[]) => {
        return arr.every((x) => {
          return typeof x === "string";
        });
      },
      required: true,
    },
    simpleView: {
      type: Boolean,
      default: false,
    },
    storageKey: {
      type: String,
      required: true,
    },
    nodeKey: {
      type: String,
      default: "legendary",
    },
  },
  computed: {
    ...mapState("shards", ["shardFarming"]),
    ...mapState("player", ["player"]),
    ...mapGetters("player", ["unitData"]),
    ...mapState("unit", ["unitList"]),
    headers(): iHeader[] {
      return [
        {
          label: "Unit Name",
          show: this.showCol("name"),
          maxWidth: "750px",
          input: {
            type: "input",
            classes: "mx-auto my-1 w-75",
            placeholder: "Search",
          },
          icon: this.sortIcon("name"),
          click: () => {
            this.sortBy("name");
          },
        },
        {
          label: "Current Level",
          show: this.showCol("current"),
          icon: this.sortIcon("current"),
          click: () => {
            this.sortBy("current");
          },
        },
        {
          label: "Requirements",
          show: this.showCol("requirements"),
          icon: this.sortIcon("requirements"),
          click: () => {
            this.sortBy("requirements");
          },
        },
        {
          label: "Recommended",
          show: this.showCol("recommended") && this.showRecommended,
          icon: this.sortIcon("stars"),
          click: () => {
            this.sortBy("stars");
          },
        },
        {
          label: "Progress",
          show: this.showCol("progress"),
          icon: this.sortIcon("progress"),
          click: () => {
            this.sortBy("progress");
          },
        },
      ];
    },
    prerequisites(): IPrerequisite[] {
      return getPrerequisites(this.unit.id ?? "")
        .filter((p) => {
          const unit: Unit | undefined = getUnit(p?.id || "");
          if (unit) {
            const name = unit.name.toLowerCase().replace(/\s/g, "");
            const compare = this.searchText.toLowerCase().replace(/\s/g, "");
            return name.includes(compare);
          } else {
            return false;
          }
        })
        .sort((a, b) => {
          const unitA: Unit | undefined = getUnit(a?.id ?? "");
          const unitB: Unit | undefined = getUnit(b?.id ?? "");
          if (unitA && unitB) {
            if (this.sortMethod === "name") {
              const compareA = unitA.name.toLowerCase();
              const compareB = unitB.name.toLowerCase();
              if (this.sortDir === "asc") {
                return compareA > compareB ? 1 : -1;
              } else {
                return compareA > compareB ? -1 : 1;
              }
            } else if (this.sortMethod === "current") {
              const isRelicA = isRelicRequirement(
                a.requirement?.type || "",
                null,
                unitA.relicLevel
              );
              const isRelicB = isRelicRequirement(
                b.requirement?.type || "",
                null,
                unitB.relicLevel
              );
              const isGearA = isGearRequirement(
                a.requirement?.type || "",
                null,
                unitA.relicLevel
              );
              const isGearB = isGearRequirement(
                b.requirement?.type || "",
                null,
                unitB.relicLevel
              );
              const isStarsA = a.requirement?.type === "Stars";
              const isStarsB = b.requirement?.type === "Stars";
              const isPowerA = a.requirement?.type === "Power";
              const isPowerB = b.requirement?.type === "Power";
              const valueA = displayValue(
                a.requirement?.type || "",
                null,
                unitA.relicLevel,
                unitA.gearLevel,
                unitA.stars
              );
              const valueB = displayValue(
                b.requirement?.type || "",
                null,
                unitB.relicLevel,
                unitB.gearLevel,
                unitB.stars
              );

              if (isStarsA || isStarsB) {
                if (isStarsA && isStarsB) {
                  if (this.sortDir === "asc") {
                    return valueA > valueB ? 1 : -1;
                  } else {
                    return valueA > valueB ? -1 : 1;
                  }
                } else if (this.sortDir === "asc") {
                  return isStarsA ? 1 : -1;
                } else {
                  return isStarsA ? -1 : 1;
                }
              } else if (isPowerA || isPowerB) {
                if (isPowerA && isPowerB) {
                  if (this.sortDir === "asc") {
                    return valueA > valueB ? 1 : -1;
                  } else {
                    return valueA > valueB ? -1 : 1;
                  }
                } else if (this.sortDir === "asc") {
                  return isPowerA ? 1 : -1;
                } else {
                  return isPowerB ? -1 : 1;
                }
              } else if (isRelicA === isRelicB || isGearA === isGearB) {
                if (this.sortDir === "asc") {
                  return valueA > valueB ? 1 : -1;
                } else {
                  return valueA > valueB ? -1 : 1;
                }
              } else if (isRelicA || isRelicB) {
                if (this.sortDir === "asc") {
                  return isRelicA ? 1 : -1;
                } else {
                  return isRelicA ? -1 : 1;
                }
              } else if (isGearA || isGearB) {
                if (this.sortDir === "asc") {
                  return isGearA ? 1 : -1;
                } else {
                  return isGearA ? -1 : 1;
                }
              } else if (!isGearA && !isGearB) {
                if (this.sortDir === "asc") {
                  return a.requirement?.type === "Stars" ? 1 : -1;
                } else {
                  return a.requirement?.type === "Stars" ? -1 : 1;
                }
              } else if (
                a.requirement?.type === "Power" ||
                b.requirement?.type === "Power"
              ) {
                if (this.sortDir === "asc") {
                  return a.requirement?.type === "Power" ? 1 : -1;
                } else {
                  return a.requirement?.type === "Power" ? -1 : 1;
                }
              }
            } else if (this.sortMethod === "requirements") {
              const typeA = a.requirement?.type ?? "";
              const typeB = b.requirement?.type ?? "";
              if (typeA === typeB) {
                const valueA = a.requirement?.value ?? 0;
                const valueB = b.requirement?.value ?? 0;
                if (this.sortDir === "asc") {
                  return valueA > valueB ? 1 : -1;
                } else {
                  return valueA > valueB ? -1 : 1;
                }
              } else {
                if (this.sortDir === "asc") {
                  return typeA > typeB ? 1 : -1;
                } else {
                  return typeA > typeB ? -1 : 1;
                }
              }
            } else if (this.sortMethod === "recommended") {
              const typeA = a.recommended?.type ?? "";
              const typeB = b.recommended?.type ?? "";
              if (typeA === typeB) {
                const valueA = a.recommended?.value ?? 0;
                const valueB = b.recommended?.value ?? 0;
                if (this.sortDir === "asc") {
                  return valueA > valueB ? 1 : -1;
                } else {
                  return valueA > valueB ? -1 : 1;
                }
              } else {
                if (this.sortDir === "asc") {
                  return typeA > typeB ? 1 : -1;
                } else {
                  return typeA > typeB ? -1 : 1;
                }
              }
            } else if (this.sortMethod === "progress") {
              const percentA = getPercent(a, "requirement");
              const percentB = getPercent(b, "requirement");
              if (this.sortDir === "asc") {
                return percentA > percentB ? 1 : -1;
              } else {
                return percentA > percentB ? -1 : 1;
              }
            }
          }
          return 0;
        });
    },
    showRecommended(): boolean {
      return this.nodeKey === "legendary";
    },
    estimatedUnlock() {
      if (this.unit.isGL) {
        const energyDropRate = 0.05; //5% drop rate per energy according to reddit
        const refreshes = this.$store.state.gear.refreshes.standard ?? 0;
        const energySpent = this.$store.state.gear.energy.standard ?? 0;
        const ticketsPerDay =
          (375 - energySpent + 120 * refreshes) * energyDropRate;

        return {
          time: Math.ceil(this.unit.glTicketsForUnlock / ticketsPerDay),
          energy: this.unit.glTicketsForUnlock / energyDropRate,
        };
      } else if (this.unit.isCapitalShip) {
        return {
          time: Math.ceil(
            (this.unit.remainingShards /
              (10 * (this.unit.capitalShipRefreshes + 1))) *
              (30.5 / this.unit.capitalShipEventFrequency)
          ),
          energy: 0,
        };
      } else {
        return { time: 0, energy: 0 };
      }
    },
    estimatedTotal() {
      if (this.unit.isGL) {
        const energyDropRate = 0.05; //5% drop rate per energy according to reddit
        const refreshes = this.$store.state.gear.refreshes.standard ?? 0;
        const energySpent = this.$store.state.gear.energy.standard ?? 0;
        const ticketsPerDay =
          (375 - energySpent + 120 * refreshes) * energyDropRate;

        return {
          time: Math.ceil(this.unit.totalGLTicketsNeeded / ticketsPerDay),
          energy: this.unit.totalGLTicketsNeeded / energyDropRate,
        };
      } else if (this.unit.isCapitalShip) {
        return {
          time: Math.ceil(
            (this.unit.remainingShards /
              (10 * (this.unit.capitalShipRefreshes + 1))) *
              (30.5 / this.unit.capitalShipEventFrequency)
          ),
          energy: 0,
        };
      } else {
        return {
          time: 0,
          energy: 0,
        };
      }
    },
  },
  methods: {
    totalProgress(prerequisiteType: "requirement" | "recommended") {
      return totalProgress(this.prerequisites, prerequisiteType);
    },
  },
});
</script>

<style lang="scss" scoped>
@import "styles/variables.scss";

.sticky-header {
  top: 105px;
}
.unit-list-tags {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  .unit-icon {
    margin: 0.25rem;
    flex-basis: 25%; //will be 3 per row due to margin
  }
}
.percent-container {
  display: grid;
  grid-template-columns: 2fr 5fr;
  align-items: center;
}
.total-progress-bar {
  flex-basis: 25%;
  margin: 0 0.5rem;
}
::v-deep(.tier-toggle) {
  width: 120px;
  flex: 1 1 auto;
  justify-content: center;

  .toggle {
    width: 100px;
    justify-content: unset;

    &.toggle-on {
      .toggle-label {
        margin-right: 0.5rem;
        width: 100%;
      }
    }
    &.toggle-off {
      background: $dark;
      color: $light;
      border-color: $gray-2;

      .toggle-label {
        margin-left: 1.75rem;
      }
    }
  }
}
</style>
