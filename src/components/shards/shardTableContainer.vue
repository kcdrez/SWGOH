<template>
  <div class="mb-3 shard-table-container">
    <NodesTable
      class="my-2 standard-nodes"
      :nodeTableNames="['Light Side', 'Dark Side']"
      label="Light & Dark Side Battles"
      idRef="standardNodes"
      type="standard"
    />
    <NodesTable
      class="my-2 fleet-nodes"
      :nodeTableNames="['Fleet']"
      label="Fleet Battles"
      idRef="fleetNodes"
      type="standard"
    />
    <NodesTable
      class="my-2 cantina-nodes"
      :nodeTableNames="['Cantina']"
      label="Cantina Battles"
      idRef="cantinaNodes"
      type="standard"
    />
    <NodesTable
      class="my-2 tb-nodes"
      :nodeTableNames="['Territory Battles']"
      label="Territory Battle Units"
      idRef="territoryBattles"
      type="TB"
    />
    <NodesTable
      class="my-2 raids-table"
      :nodeTableNames="['Raids']"
      label="Raid Units"
      idRef="raidUnits"
      type="raid"
    />
    <NodesTable
      class="my-2 proving-grounds-nodes"
      :nodeTableNames="[
        'Proving Grounds',
        'Galactic Bounties I',
        'Galactic Bounties II',
        'Assault Battles',
      ]"
      label="Special Events"
      idRef="specialEvents"
      type="special"
    />
    <NodesTable
      class="my-2 guild-events"
      :nodeTableNames="[
        'Guild Events Store (Mk 1)',
        'Guild Events Store (Mk 2)',
        'Guild Events Store (Mk 3)',
      ]"
      label="Guild Events Store"
      idRef="guildEventsStore"
      type="store"
      :currencyTypes="['get1', 'get2', 'get3']"
    />
    <NodesTable
      class="my-2 cantina-store"
      :nodeTableNames="['Cantina Battles Store']"
      label="Cantina Store"
      idRef="cantinaStore"
      type="store"
      :currencyTypes="['cantinaBattleCurrency']"
    />
    <NodesTable
      class="my-2 guild-store"
      :nodeTableNames="['Guild Store']"
      label="Guild Store"
      idRef="guildStore"
      type="store"
      :currencyTypes="['guildStoreCurrency']"
    />
    <NodesTable
      class="my-2 squad-arena"
      :nodeTableNames="['Squad Arena Store']"
      label="Squad Arena Store"
      idRef="squadArena"
      type="store"
      :currencyTypes="['squadArenaCurrency']"
    />
    <NodesTable
      class="my-2 galactic-war"
      :nodeTableNames="['Galactic War Store']"
      label="Galactic War Store"
      idRef="galacticWar"
      type="store"
      :currencyTypes="['galacticWarCurrency']"
    />
    <NodesTable
      class="my-2 fleet-arena"
      :nodeTableNames="['Fleet Arena Store']"
      label="Fleet Arena Store"
      idRef="fleetArena"
      type="store"
      :currencyTypes="['fleetArenaCurrency']"
    />
    <NodesTable
      class="my-2 shard-store"
      :nodeTableNames="['Shard Store']"
      label="Shard Shop Currency Store"
      idRef="shardStore"
      type="store"
      :currencyTypes="['shardCurrency']"
    />
    <NodesTable
      class="my-2 conquest-units"
      :nodeTableNames="['Conquest']"
      label="Conquest Units"
      idRef="conquestUnits"
      type="standard"
    />
    <NodesTable
      class="my-2 legendary-table"
      :nodeTableNames="['Legendary Events']"
      label="Legendary Units"
      idRef="legendaryUnits"
      type="legendary"
    />
    <NodesTable
      class="my-2 gl-table"
      :nodeTableNames="['Galactic Legends']"
      label="Galactic Legends"
      idRef="glUnits"
      type="gl"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import NodesTable from "./tables/nodesTable.vue";

export default defineComponent({
  name: "ShardTableContainer",
  components: {
    NodesTable,
  },
});
</script>

<style lang="scss" scoped>
@import "styles/variables.scss";

.shard-table-container {
  ::v-deep(.standard-nodes .section-header) {
    z-index: 20;
  }
  ::v-deep(.fleet-nodes .section-header) {
    z-index: 19;
  }
  ::v-deep(.cantina-nodes .section-header) {
    z-index: 18;
  }
  ::v-deep(.tb-table .section-header) {
    z-index: 17;
  }
  ::v-deep(.raids-table .section-header) {
    z-index: 16;
  }
  ::v-deep(.assault-battles-nodes .section-header) {
    z-index: 15;
  }
  ::v-deep(.proving-grounds-nodes .section-header) {
    z-index: 14;
  }
  ::v-deep(.cantina-store .section-header) {
    z-index: 13;
  }
  ::v-deep(.guild-store .section-header) {
    z-index: 12;
  }
  ::v-deep(.squad-arena .section-header) {
    z-index: 11;
  }
  ::v-deep(.galactic-war .section-header) {
    z-index: 10;
  }
  ::v-deep(.fleet-arena .section-header) {
    z-index: 9;
  }
  ::v-deep(.guild-events .section-header) {
    z-index: 8;
  }
  ::v-deep(.shard-store .section-header) {
    z-index: 7;
  }
  ::v-deep(.legendary-table .section-header) {
    z-index: 6;
  }
  ::v-deep(.gl-table .section-header) {
    z-index: 5;
  }
}
</style>
