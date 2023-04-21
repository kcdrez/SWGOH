<template>
  <ExpandableSection
    title="7 Star Unlock Planner"
    :idRef="storageKey"
    v-if="unit.stars < 7"
  >
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
      <ExpandableSection
        class="legendary-container"
        title="Unlock Status"
        idRef="prerequisite-legendary-table"
        :options="legendaryExpandOptions"
        v-if="showLegendaryTable"
      >
        <LegendaryRequirementsTable
          class="mt-2"
          :unit="unit"
          :selectedColumns="selectedColumns.legendary"
          :storageKey="storageKey + 'Legendary'"
          :simpleView="simpleViewLegendary"
          nodeKey="legendary" />
        <GearSection
          class="gear-section"
          :units="prerequisites.list"
          :gearTargets="prerequisites.gearTargets"
          :hideOnEmpty="true" />
        <RelicSection
          class="relic-section"
          :units="prerequisites.list"
          :relicTargets="prerequisites.relicTargets"
          :hideOnEmpty="true"
      /></ExpandableSection>
      <ExpandableSection
        class="gl-container"
        title="Unlock Status"
        idRef="prerequisite-gl-table"
        :options="glExpandOptions"
        v-if="showGLTable"
      >
        <LegendaryRequirementsTable
          class="mt-2"
          :unit="unit"
          :selectedColumns="selectedColumns.gl"
          :storageKey="storageKey + 'GL'"
          :simpleView="simpleViewGl"
          nodeKey="galactic_legends" />
        <GearSection
          class="gear-section"
          :units="prerequisites.list"
          :gearTargets="prerequisites.gearTargets"
          :hideOnEmpty="true" />
        <RelicSection
          class="relic-section"
          :units="prerequisites.list"
          :relicTargets="prerequisites.relicTargets"
          :hideOnEmpty="true"
      /></ExpandableSection>
      <div v-if="unitUsages.length > 0">
        <h5 class="text-center">
          This unit is required for the following Legendary/GL events:
        </h5>
        <SwgohTable :table="{ header, body }" />
      </div>
    </template>
  </ExpandableSection>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapGetters } from "vuex";

import ShardTable from "./tables/shardTable.vue";
import StoreTable from "./tables/storeTable.vue";
import TerritoryBattleShardTable from "./tables/territoryBattleShardTable.vue";
import LegendaryRequirementsTable from "./tables/legendary/legendaryRequirementsTable.vue";
import GearSection from "components/generalPlanner/gearSection.vue";
import RelicSection from "components/generalPlanner/relicSection.vue";
import { loadingState } from "types/loading";
import { setupEvents, setupSimpleView } from "utils";
import Timestamp from "../general/timestamp.vue";
import {
  FarmingNode,
  estimatedTime as nodeEstimatedTime,
  isRequired,
  IPrerequisite,
} from "types/shards";
import { estimatedTime as shopEstimatedTime } from "types/currency";
import { Unit, getUnit, getPercent, getPrerequisites } from "types/unit";
import { estimatedTime as tbEstimatedTime } from "types/guild";
import { iExpandOptions, iTableBody, iTableHead } from "types/general";
import { maxGearLevel } from "types/gear";

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
    GearSection,
    RelicSection,
  },
  props: {
    unit: {
      type: Object as () => Unit,
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
    } as any;
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
            cells: [
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

      let days: number[] = [];
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
    prerequisites(): { list: Unit[]; relicTargets: any; gearTargets: any } {
      return getPrerequisites(this.unit.id).reduce(
        (
          acc: { list: Unit[]; relicTargets: any; gearTargets: any },
          x: IPrerequisite
        ) => {
          const match = getUnit(x?.id ?? "");
          if (match && !match.isShip) {
            match.relicTarget = x.requirement?.value ?? 0;
            acc.list.push(match);
            if (x.requirement?.type === "Relic") {
              acc.relicTargets[match.id] = x.requirement.value;
              acc.gearTargets[match.id] = maxGearLevel;
            } else if (x.requirement?.type === "Gear") {
              acc.gearTargets[match.id] = x.requirement.value;
            } else {
              acc.relicTargets[match.id] = 0;
              acc.gearTargets[match.id] = 0;
            }
          }
          return acc;
        },
        { list: [], relicTargets: {}, gearTargets: {} }
      );
    },
    legendaryExpandOptions(): iExpandOptions {
      return {
        multiSelect: {
          options: this.cols.legendary,
          change: (newVal: string[]) => {
            this.selectedColumns.legendary = newVal;
          },
        },
        toggle: {
          onLabel: "Simple",
          offLabel: "Advanced",
          change: (val: boolean) => {
            this.simpleViewLegendary = val;
          },
          value: this.simpleViewLegendary,
        },
      };
    },
    glExpandOptions(): iExpandOptions {
      return {
        multiSelect: {
          options: this.cols.gl,
          change: (newVal: string[]) => {
            this.selectedColumns.gl = newVal;
          },
        },
        toggle: {
          onLabel: "Simple",
          offLabel: "Advanced",
          change: (val: boolean) => {
            this.simpleViewGl = val;
          },
          value: this.simpleViewGl,
        },
      };
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

.legendary-container,
.gl-container {
  ::v-deep(.section-header) {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f2f2f2;
    position: sticky;
    top: 56px;
    height: 50px;
    z-index: 5;
    h3 {
      width: 100%;
      font-size: 1.25rem;
    }
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
