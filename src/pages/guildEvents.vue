<template>
  <div class="container swgoh-page mb-3">
    <Loading :state="requestState" message="Loading Guild Data" size="lg">
      <div class="collapse-header section-header mt-3 position-relative">
        <h3
          class="w-100"
          data-bs-toggle="collapse"
          href="#guildTerritoryWarSection"
        >
          <div class="d-inline">Territory War History</div>
        </h3>
        <MultiSelect
          class="select-columns"
          :options="twCols"
          storageKey="twTable"
          @checked="twSelectedColumns = $event"
          @click.stop=""
        />
      </div>
      <TerritoryWarTable
        id="guildTerritoryWarSection"
        ref="guildTerritoryWarSection"
        class="collapse"
        :selectedColumns="twSelectedColumns"
      />
      <div class="collapse-header section-header mt-3">
        <h3
          class="w-100"
          data-bs-toggle="collapse"
          href="#guildTerritoryBattleSection"
        >
          <div class="d-inline">Territory Battles History</div>
        </h3>
        <MultiSelect
          class="select-columns"
          :options="tbCols"
          storageKey="tbTable"
          @checked="tbSelectedColumns = $event"
          @click.stop=""
        />
      </div>
      <TerritoryBattleTable
        id="guildTerritoryBattleSection"
        ref="guildTerritoryBattleSection"
        class="collapse show"
        :selectedColumns="tbSelectedColumns"
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
import { initializeModules, setupEvents } from "../utils";

const dependencyModules = ["player", "guild"];

export default defineComponent({
  name: "GuildEventsPage",
  components: { TerritoryWarTable, TerritoryBattleTable },
  data() {
    return {
      sortDir: "asc",
      sortMethod: "date",
      tbSelectedColumns: [],
      twSelectedColumns: [],
    };
  },
  computed: {
    ...mapGetters(["someLoading"]),
    ...mapState("player", { playerRequestState: "requestState" }),
    requestState(): loadingState {
      return this.someLoading(dependencyModules);
    },
    tbCols(): { text: string; value: any }[] {
      const list = [
        {
          text: "Date",
          value: "date",
        },
        {
          text: "Type",
          value: "type",
        },
        {
          text: "Name",
          value: "name",
        },
        {
          text: "Stars",
          value: "stars",
        },
        {
          text: "GET1 Currency",
          value: "get1",
        },
        {
          text: "GET2 Currency",
          value: "get2",
        },
        {
          text: "Character Shards",
          value: "character",
        },
        {
          text: "Actions",
          value: "actions",
        },
      ];
      return list;
    },
    twCols(): { text: string; value: any }[] {
      const list = [
        {
          text: "Date",
          value: "date",
        },
        {
          text: "Win/Loss",
          value: "win_loss",
        },
        {
          text: "GET1 Currency",
          value: "get1",
        },
        {
          text: "GET2 Currency",
          value: "get2",
        },
        {
          text: "Zetas",
          value: "zetas",
        },
        {
          text: "Actions",
          value: "actions",
        },
      ];
      return list;
    },
  },
  methods: {
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
    requestState(newVal) {
      if (newVal === loadingState.ready) {
        this.initEvents();
      }
    },
  },
  async created() {
    await initializeModules(dependencyModules);
    if (this.requestState === loadingState.ready) {
      this.initEvents();
    }
  },
});
</script>

<style lang="scss" scoped>
</style>
