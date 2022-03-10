<template>
  <div class="mb-3">
    <StandardNodesTable class="my-2 meow" />
    <FleetNodesTable class="my-2" />
    <CantinaNodesTable class="my-2" />
    <TbTableContainer class="my-2" />
    <RaidsTable class="my-2" />
    <CantinaStoreTable class="my-2" />
    <GuildStoreTable class="my-2" />
    <SquadArenaTable class="my-2" />
    <GalacticWarTable class="my-2" />
    <FleetArenaTable class="my-2" />
    <GuildEventsTable class="my-2" />
    <ShardStoreTable class="my-2" />
    <LegendaryTable class="my-2" />
    <GLTable class="my-2" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import StandardNodesTable from "./tables/standardNodesTable.vue";
import FleetNodesTable from "./tables/fleetNodesTable.vue";
import CantinaNodesTable from "./tables/cantinaNodesTable.vue";
import TbTableContainer from "./tables/tbTableContainer.vue";
import RaidsTable from "./tables/raidsTable.vue";
import ConquestTable from "./tables/conquestTable.vue";
import CantinaStoreTable from "./tables/cantinaStoreTable.vue";
import GuildStoreTable from "./tables/guildStoreTable.vue";
import SquadArenaTable from "./tables/squadArenaTable.vue";
import GalacticWarTable from "./tables/galacticWarTable.vue";
import FleetArenaTable from "./tables/fleetArenaTable.vue";
import GuildEventsTable from "./tables/guildEventsTable.vue";
import ShardStoreTable from "./tables/shardStoreTable.vue";
import LegendaryTable from "./tables/legendaryTable.vue";
import GLTable from "./tables/glTable.vue";

export default defineComponent({
  name: "ShardTableContainer",
  components: {
    StandardNodesTable,
    FleetNodesTable,
    CantinaNodesTable,
    TbTableContainer,
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
@import "../../styles/variables.scss";

::v-deep {
  .section-header {
    border-bottom: 1px solid $light;
    position: sticky;
    top: 56px;
    height: 50px;
    z-index: 5;
  }
  thead.sticky-header {
    top: 106px !important;
  }
}
</style>
