<template>
  <div>
    <div class="collapse-header section-header">
      <h3>
        <div data-bs-toggle="collapse" href="#shardSection">Shard Planner</div>
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
                v-model="simpleView.legendary"
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
              :simpleView="simpleView.legendary"
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
                v-model="simpleView.gl"
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
              :simpleView="simpleView.gl"
              nodeKey="galactic_legends"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapGetters } from "vuex";

import ShardTable from "./tables/shardTable.vue";
import StoreTable from "./tables/storeTable.vue";
import TerritoryBattleShardTable from "./tables/territoryBattleShardTable.vue";
import LegendaryRequirementsTable from "./tables/legendary/legendaryRequirementsTable.vue";
import EnergySpent from "../energySpent.vue";
import { loadingState } from "../../types/loading";
import { setupEvents } from "../../utils";
import Timestamp from "../timestamp.vue";
import {
  FarmingNode,
  estimatedTime as nodeEstimatedTime,
} from "../../types/shards";
import { estimatedTime as shopEstimatedTime } from "../../types/currency";
import { Unit } from "../../types/unit";
import { estimatedTime as tbEstimatedTime } from "../../types/guild";

const storageKey = "shardPlanner";

export default defineComponent({
  name: "ShardPlannerComponent",
  components: {
    ShardTable,
    StoreTable,
    TerritoryBattleShardTable,
    LegendaryRequirementsTable,
    Timestamp,
    EnergySpent,
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
      simpleView: JSON.parse(
        window.localStorage.getItem(storageKey) ||
          '{ "legendary": true, "gl": true }'
      ),
    };
  },
  computed: {
    ...mapState("unit", ["unit"]),
    ...mapGetters(["someLoading"]),
    ...mapState(["collapseSections"]),
    ...mapGetters("shards", ["unitFarmingList"]),
    requestState(): loadingState {
      return this.someLoading(["unit"]);
    },
    cols(): any {
      return {
        shards: [
          {
            text: "Locations",
            value: "locations",
          },
          {
            text: "Owned Shards",
            value: "owned",
          },
          {
            text: "Shards Remaining",
            value: "remaining",
          },
          {
            text: "Progress",
            value: "progress",
          },
          {
            text: "Attempts",
            value: "attempts",
          },
          {
            text: "Actions",
            value: "actions",
          },
        ],
        store: [
          {
            text: "Owned Shards",
            value: "owned",
          },
          {
            text: "Shards Remaining",
            value: "remaining",
          },
          {
            text: "Progress",
            value: "progress",
          },
          {
            text: "Currency Owned",
            value: "wallet",
          },
          {
            text: "Daily Currency",
            value: "dailyCurrency",
          },
          {
            text: "Remaining Currency",
            value: "remainingCurrency",
          },
        ],
        tb: [
          {
            text: "Locations",
            value: "locations",
          },
          {
            text: "Owned Shards",
            value: "owned",
          },
          {
            text: "Shards Remaining",
            value: "remaining",
          },
          {
            text: "Progress",
            value: "progress",
          },
        ],
        legendary: [
          {
            text: "Name",
            value: "name",
          },
          {
            text: "Current Level",
            value: "current",
          },
          {
            text: "Requirements",
            value: "requirements",
          },
          {
            text: "Recommended",
            value: "recommended",
          },
          {
            text: "Progress",
            value: "progress",
          },
        ],
        gl: [
          {
            text: "Name",
            value: "name",
          },
          {
            text: "Current Level",
            value: "current",
          },
          {
            text: "Requirements",
            value: "requirements",
          },
          {
            text: "Progress",
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
      return this.tables.includes("Legendary Events");
    },
    showGLTable(): boolean {
      return this.tables.includes("Galactic Legends");
    },
    shardTimeUnlock(): number {
      const unitList = this.unitFarmingList.filter((el: Unit) => {
        const elTables: string[] = el.whereToFarm.map((x) => x.table);
        return this.tables.some((tableName) => elTables.includes(tableName));
      });

      let days = [];
      if (this.showNodeTable) {
        days.push(nodeEstimatedTime(unitList, this.tables, this.unit));
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
  },
  watch: {
    simpleView: {
      handler(newVal) {
        window.localStorage.setItem(storageKey, JSON.stringify(newVal));
      },
      deep: true,
    },
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
@import "../../styles/variables.scss";

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
</style>
