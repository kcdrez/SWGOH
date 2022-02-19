<template>
  <div class="container swgoh-page mb-3">
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
      <TerritoryWarTable
        id="guildTerritoryWarSection"
        ref="guildTerritoryWarSection"
        class="collapse"
      />
      <div class="collapse-header section-header mt-3">
        <h3
          class="w-100"
          data-bs-toggle="collapse"
          href="#guildTerritoryBattleSection"
        >
          <div class="d-inline">Territory Battles History</div>
        </h3>
      </div>
      <TerritoryBattleTable
        id="guildTerritoryBattleSection"
        ref="guildTerritoryBattleSection"
        class="collapse show"
      />
    </Loading>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters, mapState } from "vuex";

import { loadingState } from "../types/loading";
import TerritoryWarTable from "../components/guild/territoryWarTable.vue";
import TerritoryBattleTable from "../components/guild/territoryBattleTable.vue";
import { setupEvents } from "../utils";

export default defineComponent({
  name: "GuildEventsPage",
  components: { TerritoryWarTable, TerritoryBattleTable },
  data() {
    return {
      sortDir: "asc",
      sortMethod: "date",
    };
  },
  computed: {
    ...mapGetters(["someLoading"]),
    ...mapState("player", { playerRequestState: "requestState" }),
    requestState(): loadingState {
      return this.someLoading(["player", "guild"]);
    },
  },
  methods: {
    ...mapActions("guild", ["initialize"]),
    initEvents() {
      this.$nextTick(() => {
        setupEvents(
          (this.$refs?.guildTerritoryWarSection as any)?.$el as HTMLElement,
          "guildTerritoryWarSection"
        );
        setupEvents(
          (this.$refs?.guildTerritoryBattleSection as any)?.$el as HTMLElement,
          "guildTerritoryBattleSection"
        );
      });
    },
  },
  watch: {
    playerRequestState(newVal) {
      if (newVal === loadingState.ready) {
        this.initialize();
      }
    },
    requestState(newVal) {
      if (newVal === loadingState.ready) {
        this.initEvents();
      }
    },
  },
  async created() {
    if (this.playerRequestState === loadingState.ready) {
      this.initialize();
    }
    if (this.requestState === loadingState.ready) {
      this.initEvents();
    }
  },
});
</script>

<style lang="scss" scoped></style>
