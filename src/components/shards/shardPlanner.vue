<template>
  <div>
    <div class="collapse-header section-header">
      <h3>
        <div data-bs-toggle="collapse" href="#shardSection">
          7 Star Unlock Planner
        </div>
      </h3>
    </div>
    <div id="shardSection" class="collapse" ref="shardSection">
      <h5 v-if="unit.whereToFarm.length === 0" class="my-1 text-center">
        This unit is not currently farmable.
      </h5>
      <template v-else>
        <div class="shard-header">
          <div class="current-level">
            Current Star Level:
            <span v-if="unit.stars <= 0" class="ms-1">0</span>
            <img
              v-for="index in unit.stars || 0"
              :key="index"
              src="images/star.png"
            />
          </div>
        </div>
        <Timestamp
          class="time-estimate"
          label="Estimated completion:"
          :timeLength="shardTimeUnlock"
          displayClasses="d-inline"
          v-if="unit.stars < 7"
        />
        <template v-if="showNodeTable">
          <MultiSelect
            class="select-columns"
            :options="cols.shards"
            :storageKey="storageKey + 'ShardColumns'"
            @checked="selectedColumns.shards = $event"
          />
          <ShardTable
            :units="[unit]"
            :selectedColumns="selectedColumns.shards"
            showActions
            loadOnCreation
            :storageKey="storageKey + 'ShardTable'"
          />
        </template>
        <template v-if="showShopTable">
          <MultiSelect
            class="select-columns"
            :options="cols.store"
            :storageKey="storageKey + 'StoreColumns'"
            @checked="selectedColumns.store = $event"
          />
          <StoreTable
            :units="[unit]"
            :selectedColumns="selectedColumns.store"
            :currencyTypes="unit.currencyTypes"
            :storageKey="storageKey + 'StoreTable'"
            loadOnCreation
          />
        </template>
        <template v-if="showTBTable">
          <MultiSelect
            class="select-columns"
            :options="cols.tb"
            :storageKey="storageKey + 'TBColumns'"
            @checked="selectedColumns.tb = $event"
          />
          <TerritoryBattleShardTable
            :units="[unit]"
            :selectedColumns="selectedColumns.tb"
            :storageKey="storageKey + 'TBTable'"
            loadOnCreation
          />
        </template>
        <div class="legendary-container" v-if="showLegendaryTable">
          <div class="collapse-header section-header">
            <h5 class="w-100">
              <div
                data-bs-toggle="collapse"
                href="#prerequisite-legendary-table"
              >
                Unlock Status
              </div>
            </h5>
            <div class="simple-view-container">
              <Toggle
                v-model="simpleViewLegendary"
                onLabel="Simple"
                offLabel="Advanced"
              />
            </div>
            <MultiSelect
              class="select-columns"
              :options="cols.legendary"
              :storageKey="storageKey + 'LegendaryColumns'"
              @checked="selectedColumns.legendary = $event"
            />
          </div>
          <div
            id="prerequisite-legendary-table"
            class="collapse"
            ref="prerequisiteLegendaryTable"
          >
            <LegendaryRequirementsTable
              class="mt-2"
              :unit="unit"
              :selectedColumns="selectedColumns.legendary"
              :storageKey="storageKey + 'Legendary'"
              :simpleView="simpleViewLegendary"
              nodeKey="legendary"
            />
          </div>
        </div>
        <div class="gl-container" v-if="showGLTable">
          <div class="collapse-header section-header">
            <h5 class="w-100">
              <div data-bs-toggle="collapse" href="#prerequisite-gl-table">
                Unlock Status
              </div>
            </h5>
            <div class="simple-view-container">
              <Toggle
                v-model="simpleViewGl"
                onLabel="Simple"
                offLabel="Advanced"
              />
            </div>
            <MultiSelect
              class="select-columns"
              :options="cols.gl"
              :storageKey="storageKey + 'GLColumns'"
              @checked="selectedColumns.gl = $event"
            />
          </div>
          <div
            id="prerequisite-gl-table"
            class="collapse"
            ref="prerequisiteGLTable"
          >
            <LegendaryRequirementsTable
              class="mt-2"
              :unit="unit"
              :selectedColumns="selectedColumns.gl"
              :storageKey="storageKey + 'GL'"
              :simpleView="simpleViewGl"
              nodeKey="galactic_legends"
            />
          </div>
        </div>
        <div v-if="unitUsages.length > 0">
          <h5 class="text-center">
            This unit is required for the following Legendary/GL events:
          </h5>
          <table
            class="table table-bordered table-dark table-sm table-striped swgoh-table"
          >
            <TableHeader :header="header" />
            <TableBody :body="body" />
          </table>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { mapState, mapGetters } from "vuex";

import ShardTable from "./tables/shardTable.vue";
import StoreTable from "./tables/storeTable.vue";
import TerritoryBattleShardTable from "./tables/territoryBattleShardTable.vue";
import LegendaryRequirementsTable from "./tables/legendary/legendaryRequirementsTable.vue";
import { loadingState } from "types/loading";
import { setupEvents, setupSimpleView } from "utils";
import Timestamp from "../general/timestamp.vue";
import {
  FarmingNode,
  estimatedTime as nodeEstimatedTime,
  isRequired,
} from "types/shards";
import { estimatedTime as shopEstimatedTime } from "types/currency";
import { Unit, getUnit, getPercent } from "types/unit";
import { estimatedTime as tbEstimatedTime } from "types/guild";
import { iTableBody, iTableHead } from "types/general";

const storageKey = "shardPlanner";

export default defineComponent({
  name: "ShardPlannerComponent",
  setup() {
    const { simpleView: simpleViewGl } = setupSimpleView(storageKey + "GL");
    const { simpleView: simpleViewLegendary } = setupSimpleView(
      storageKey + "Legendary"
    );
    return { simpleViewGl, simpleViewLegendary };
  },
  components: {
    ShardTable,
    StoreTable,
    TerritoryBattleShardTable,
    LegendaryRequirementsTable,
    Timestamp,
  },
  props: {
    unit: {
      type: Object as PropType<Unit>,
      required: true,
    },
  },
  data() {
    return {
      selectedColumns: {
        shards: [],
        store: [],
        tb: [],
        legendary: [],
        gl: [],
      },
      storageKey,
    };
  },
  computed: {
    ...mapGetters("player", ["unitData"]),
    ...mapGetters(["someLoading"]),
    ...mapState(["collapseSections"]),
    ...mapGetters("shards", ["unitFarmingList"]),
    ...mapState("shards", ["shardFarming"]),
    requestState(): loadingState {
      return this.someLoading(["unit"]);
    },
    header(): iTableHead {
      return {
        headers: [
          {
            label: "Unit Name",
            show: true,
            sortMethodShow: true,
          },
          {
            label: "Requirement",
            show: true,
            sortMethodShow: true,
          },
          {
            label: "Progress",
            show: true,
            sortMethodShow: true,
          },
        ],
      };
    },
    body(): iTableBody {
      return {
        classes: "align-middle text-center",
        rows: this.unitUsages.map((unit: any) => {
          return {
            cells: [
              {
                show: true,
                type: "unitRequirement",
                data: {
                  parentUnit: this.unit,
                  childUnit: unit,
                  isLink: true,
                  hideImage: true,
                },
              },
              {
                show: true,
                type: "unitLevel",
                data: {
                  classes: "justify-content-center",
                  type: !!unit.requirement
                    ? unit.requirement.type
                    : unit.recommended.type,
                  unitId: unit.id,
                  value: !!unit.requirement
                    ? unit.requirement.value
                    : unit.recommended.value,
                },
              },
              {
                show: true,
                type: "progress",
                data: !!unit.requirement
                  ? getPercent(unit, "requirement")
                  : getPercent(unit, "recommended"),
              },
            ],
          };
        }),
      };
    },
    cols(): any {
      return {
        shards: [
          {
            label: "Locations",
            value: "locations",
          },
          {
            label: "Owned Shards",
            value: "owned",
          },
          {
            label: "Shards Remaining",
            value: "remaining",
          },
          {
            label: "Progress",
            value: "progress",
          },
          {
            label: "Attempts",
            value: "attempts",
          },
          {
            label: "Actions",
            value: "actions",
          },
        ],
        store: [
          {
            label: "Owned Shards",
            value: "owned",
          },
          {
            label: "Shards Remaining",
            value: "remaining",
          },
          {
            label: "Progress",
            value: "progress",
          },
          {
            label: "Currency Owned",
            value: "wallet",
          },
          {
            label: "Daily Currency",
            value: "dailyCurrency",
          },
          {
            label: "Remaining Currency",
            value: "remainingCurrency",
          },
        ],
        tb: [
          {
            label: "Locations",
            value: "locations",
          },
          {
            label: "Owned Shards",
            value: "owned",
          },
          {
            label: "Shards Remaining",
            value: "remaining",
          },
          {
            label: "Progress",
            value: "progress",
          },
        ],
        legendary: [
          {
            label: "Name",
            value: "name",
          },
          {
            label: "Current Level",
            value: "current",
          },
          {
            label: "Requirements",
            value: "requirements",
          },
          {
            label: "Recommended",
            value: "recommended",
          },
          {
            label: "Progress",
            value: "progress",
          },
        ],
        gl: [
          {
            label: "Name",
            value: "name",
          },
          {
            label: "Current Level",
            value: "current",
          },
          {
            label: "Requirements",
            value: "requirements",
          },
          {
            label: "Progress",
            value: "progress",
          },
        ],
      };
    },
    tables(): string[] {
      return this.unit.whereToFarm.map((x: FarmingNode) => x.table);
    },
    showNodeTable(): boolean {
      return (
        this.tables.some((x) =>
          ["Light Side", "Dark Side", "Fleet", "Cantina"].includes(x)
        ) && this.unit.stars < 7
      );
    },
    showTBTable(): boolean {
      return this.tables.includes("Territory Battles") && this.unit.stars < 7;
    },
    showShopTable(): boolean {
      return (
        this.tables.some((x) =>
          [
            "Cantina Battles Store",
            "Fleet Arena Store",
            "Galactic War Store",
            "Guild Events Store (Mk 1)",
            "Guild Events Store (Mk 2)",
            "Guild Store",
            "Shard Store",
            "Squad Arena Store",
          ].includes(x)
        ) && this.unit.stars < 7
      );
    },
    showLegendaryTable(): boolean {
      return this.tables.includes("Legendary Events") && this.unit.stars < 7;
    },
    showGLTable(): boolean {
      return this.tables.includes("Galactic Legends") && this.unit.stars < 7;
    },
    shardTimeUnlock(): number {
      const unitList = this.unitFarmingList.filter((el: Unit) => {
        const elTables: string[] = el.whereToFarm.map((x) => x.table);
        return this.tables.some((tableName) => elTables.includes(tableName));
      });

      let days = [];
      if (this.showNodeTable) {
        days.push(nodeEstimatedTime(unitList, this.tables));
      }
      if (this.showTBTable) {
        days.push(tbEstimatedTime(this.unit));
      }
      if (this.showShopTable) {
        days.push(
          shopEstimatedTime(
            this.unit,
            this.unit.currencyTypes,
            this.tables,
            unitList
          )
        );
      }

      return Math.min(...days);
    },
    unitUsages(): any[] {
      return isRequired(this.unit).filter((unit: any) => {
        const match: Unit | undefined = this.unitData(unit.requirementId);
        return match ? match.stars < 7 : true;
      });
    },
  },
  methods: {
    getUnit,
    getPercent,
  },
  mounted() {
    setupEvents(
      this.$refs.shardSection as HTMLElement,
      storageKey + "Collapse"
    );
    setupEvents(
      this.$refs.prerequisiteLegendaryTable as HTMLElement,
      storageKey + "LegendaryCollapse"
    );
    setupEvents(
      this.$refs.prerequisiteGLTable as HTMLElement,
      storageKey + "GLCollapse"
    );
  },
});
</script>

<style lang="scss" scoped>
@import "styles/variables.scss";

.shard-header,
.time-estimate {
  font-size: 1.25rem;
  margin: 0.25rem 0;
}

.shard-header {
  select {
    width: 115px;
  }

  @media only screen and (min-width: 600px) and (max-width: 1200px) {
    display: flex;
    justify-content: space-around;
  }

  @media only screen and (min-width: 1200px) {
    display: flex;
    justify-content: center;

    .current-level {
      margin: 0 2rem;
    }
  }

  @media only screen and (max-width: 600px) {
    text-align: center;
  }
}

.time-estimate {
  text-align: center;

  ::v-deep(span) {
    font-weight: bold;
  }
}

.standard-energy-container,
.fleet-energy-container {
  margin-bottom: 1rem;

  .energy-text {
    background: $dark;
    color: $light;
    width: 130px;
    display: block;
  }

  .refresh-text,
  .energy-spent-text {
    background: $gray-4;
    color: $light;
  }

  @media only screen and (min-width: 1300px) {
    width: 48%;
    display: inline-block;
  }

  @media only screen and (max-width: 680px) {
    .input-group {
      display: block;

      * {
        width: 100%;
      }

      .energy-text {
        border-radius: 0.2rem 0.2rem 0 0 !important;
      }
      .energy-spent-input {
        border-radius: 0 0 0.2rem 0.2rem !important;
      }

      .refresh-text,
      .energy-spent-text,
      .energy-spent-input,
      input {
        display: block;
        border-top: none;
        text-align: center;
        //everything except the first element is off so the following is used to compensate :shrug:
        position: relative;
        left: 1px;
      }
    }
  }
}

.standard-energy-container {
  @media only screen and (min-width: 1300px) {
    margin-right: 1rem;
  }
}

.fleet-energy-container {
  @media only screen and (min-width: 1300px) {
    margin-left: 1rem;
  }
}

// .section-header.shard-section-header {
//   text-shadow: 2px 2px 2px black;
//   display: flex;
//   align-items: center;

//   a {
//     text-decoration: none;
//     &:hover {
//       text-decoration: underline;
//     }
//   }
// }

.legendary-container,
.gl-container {
  .section-header {
    display: flex;
    align-items: center;
    border-bottom: 1px solid $light;
    position: sticky;
    top: 56px;
    height: 50px;
    z-index: 5;
  }
}

.current-level {
  display: flex;
  align-items: center;
  justify-content: center;

  img:first-child {
    margin-left: 1rem;
  }
}

.requirement-container {
  display: flex;
  justify-content: center;
  align-items: center;

  > * {
    margin: 0 0.25rem;
  }
}
</style>
