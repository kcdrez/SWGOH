<template>
  <div class="mb-3 shard-table-container">
    <NodesTable
      class="my-2 standard-nodes"
      :nodeTableNames="['Light Side', 'Dark Side']"
      label="Light & Dark Side Battles"
      idRef="standardNodes"
    />
    <NodesTable
      class="my-2 fleet-nodes"
      :nodeTableNames="['Fleet']"
      label="Fleet Battles"
      idRef="fleetNodes"
    />
    <NodesTable
      class="my-2 cantina-nodes"
      :nodeTableNames="['Cantina']"
      label="Cantina Battles"
      idRef="cantinaNodes"
    />
    <TbTableContainer class="my-2 tb-table" />
    <RaidsTable class="my-2 raids-table" />
    <SpecialEventsTable class="my-2 proving-grounds-nodes" />
    <CantinaStoreTable class="my-2 cantina-store" />
    <GuildStoreTable class="my-2 guild-store" />
    <GuildEventsTable class="my-2 guild-events" />
    <SquadArenaTable class="my-2 squad-arena" />
    <GalacticWarTable class="my-2 galactic-war" />
    <FleetArenaTable class="my-2 fleet-arena" />
    <ShardStoreTable class="my-2 shard-store" />
    <LegendaryTable class="my-2 legendary-table" />
    <GLTable class="my-2 gl-table" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import NodesTable from "./tables/nodesTable.vue";
import TbTableContainer from "./tables/tbTableContainer.vue";
import RaidsTable from "./tables/raidsTable.vue";
import SpecialEventsTable from "./tables/specialEvents.vue";
import ConquestTable from "./tables/conquestTable.vue";
import CantinaStoreTable from "./tables/cantinaStoreTable.vue";
import GuildStoreTable from "./tables/guildStoreTable.vue";
import SquadArenaTable from "./tables/squadArenaTable.vue";
import GalacticWarTable from "./tables/galacticWarTable.vue";
import FleetArenaTable from "./tables/fleetArenaTable.vue";
import GuildEventsTable from "./tables/guildEventsTable.vue";
import ShardStoreTable from "./tables/shardStoreTable.vue";
import LegendaryTable from "./tables/legendary/legendaryTable.vue";
import GLTable from "./tables/legendary/glTable.vue";

export default defineComponent({
  name: "ShardTableContainer",
  components: {
    NodesTable,
    TbTableContainer,
    SpecialEventsTable,
    RaidsTable,
    ConquestTable,
    CantinaStoreTable,
    GuildStoreTable,
    SquadArenaTable,
    GalacticWarTable,
    FleetArenaTable,
    GuildEventsTable,
    ShardStoreTable,
    LegendaryTable,
    GLTable,
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

::v-deep(thead.sticky-header) {
  top: 106px !important;
}
</style>
