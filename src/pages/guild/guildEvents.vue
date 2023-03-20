<template>
  <div class="container swgoh-page mb-3">
    <template v-if="$route.params.guildId">
      <div class="collapse-header section-header mt-3 extended-1">
        <h3
          class="w-100"
          data-bs-toggle="collapse"
          href="#guildTerritoryWarSection"
        >
          <div class="d-inline">Territory War History</div>
        </h3>
        <div class="toggles-container">
          <MultiSelect
            class="select-columns"
            :options="twCols"
            storageKey="twTable"
            @checked="twSelectedColumns = $event"
            @click.stop=""
          />
        </div>
      </div>
      <TerritoryWarTable
        id="guildTerritoryWarSection"
        ref="guildTerritoryWarSection"
        class="collapse"
        :selectedColumns="twSelectedColumns"
      />
      <div class="collapse-header section-header mt-3 extended-1">
        <h3
          class="w-100"
          data-bs-toggle="collapse"
          href="#guildTerritoryBattleSection"
        >
          <div class="d-inline">Territory Battles History</div>
        </h3>
        <div class="toggles-container">
          <MultiSelect
            class="select-columns"
            :options="tbCols"
            storageKey="tbTable"
            @checked="tbSelectedColumns = $event"
            @click.stop=""
          />
        </div>
      </div>
      <TerritoryBattleTable
        id="guildTerritoryBattleSection"
        ref="guildTerritoryBattleSection"
        class="collapse show"
        :selectedColumns="tbSelectedColumns"
      />
    </template>
    <div class="row" v-else>
      <div class="col">
        <div class="input-group input-group-sm">
          <span class="input-group-text">Enter a Guild Id:</span>
          <input class="form-control refresh-input" v-model="guildIdInput" />
          <button
            class="btn btn-primary"
            type="button"
            @click="
              $router.push({
                name: 'GuildEventsPage',
                params: { guildId: guildIdInput },
              })
            "
            :disabled="!guildIdInput"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";

import { loadingState } from "types/loading";
import TerritoryWarTable from "components/guild/territoryWarTable.vue";
import TerritoryBattleTable from "components/guild/territoryBattleTable.vue";
import { setupEvents } from "utils";

export default defineComponent({
  name: "GuildEventsPage",
  components: { TerritoryWarTable, TerritoryBattleTable },
  data() {
    return {
      sortDir: "asc",
      sortMethod: "date",
      tbSelectedColumns: [],
      twSelectedColumns: [],
      guildIdInput: "",
    };
  },
  computed: {
    ...mapState("player", { playerRequestState: "requestState" }),
    tbCols(): { label: string; value: any }[] {
      const list = [
        {
          label: "Date",
          value: "date",
        },
        {
          label: "Name",
          value: "name",
        },
        {
          label: "Stars",
          value: "stars",
        },
        {
          label: "GET1 Currency",
          value: "get1",
        },
        {
          label: "GET2 Currency",
          value: "get2",
        },
        {
          label: "GET3 Currency",
          value: "get3",
        },
        {
          label: "Character Shards",
          value: "character",
        },
        {
          label: "Actions",
          value: "actions",
        },
      ];
      return list;
    },
    twCols(): { label: string; value: any }[] {
      const list = [
        {
          label: "Date",
          value: "date",
        },
        {
          label: "Win/Loss",
          value: "win_loss",
        },
        {
          label: "GET1 Currency",
          value: "get1",
        },
        {
          label: "GET2 Currency",
          value: "get2",
        },
        // {
        //   label: "GET3 Currency",
        //   value: "get3",
        // },
        {
          label: "Zetas",
          value: "zetas",
        },
        {
          label: "Actions",
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
    this.initEvents();
  },
});
</script>

<style lang="scss" scoped>
.section-header {
  z-index: 10;
}
</style>
