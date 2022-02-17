<template>
  <div class="container swgoh-page">
    <Loading :state="requestState" message="Loading Guild Data" size="lg">
      <div class="collapse-header section-header mt-3">
        <h3
          class="w-100"
          data-bs-toggle="collapse"
          href="#guildTerritoryWarSection"
        >
          <div class="d-inline">Territory War History</div>
        </h3>
      </div>
      <TerritorWarTable id="guildTerritoryWarSection" class="collapse" />
      <div class="collapse-header section-header mt-3">
        <h3
          class="w-100"
          data-bs-toggle="collapse"
          href="#guildTerritoryBattleSection"
        >
          <div class="d-inline">Territory Battles History</div>
        </h3>
      </div>
      <TerritoryBattleTable id="guildTerritoryBattleSection" class="collapse" />
    </Loading>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

import { loadingState } from "../types/loading";
import TerritorWarTable from "../components/guild/territoryWarTable.vue";
import TerritoryBattleTable from "../components/guild/territoryBattleTable.vue";

export default defineComponent({
  name: "GuildEventsPage",
  components: { TerritorWarTable, TerritoryBattleTable },
  data() {
    return {
      sortDir: "asc",
      sortMethod: "date",
    };
  },
  computed: {
    ...mapGetters(["someLoading"]),
    requestState(): loadingState {
      return this.someLoading(["player"]);
    },
  },
  methods: {},
});
</script>

<style lang="scss" scoped>
</style>
