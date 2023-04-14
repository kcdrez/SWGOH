<template>
  <div class="container swgoh-page mb-3">
    <template v-if="$route.params.guildId">
      <ExpandableSection
        title="Territory War History"
        idRef="guildTerritoryWarSection"
        class="mb-3"
        :options="expandOptionsTW"
      >
        <TerritoryWarTable :selectedColumns="twSelectedColumns" />
      </ExpandableSection>
      <ExpandableSection
        title="Territory Battles History"
        idRef="guildTerritoryBattleSection"
        :options="expandOptionsTB"
      >
        <TerritoryBattleTable :selectedColumns="tbSelectedColumns" />
      </ExpandableSection>
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

import TerritoryWarTable from "components/guild/territoryWarTable.vue";
import TerritoryBattleTable from "components/guild/territoryBattleTable.vue";
import { iExpandOptions } from "types/general";

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
    } as any;
  },
  computed: {
    ...mapState("player", { playerRequestState: "requestState" }),
    expandOptionsTW(): iExpandOptions {
      return {
        multiSelect: {
          options: [
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
            {
              label: "Zetas",
              value: "zetas",
            },
            {
              label: "Actions",
              value: "actions",
            },
          ],
          change: (newVal: string[]) => {
            this.twSelectedColumns = newVal;
          },
        },
      };
    },
    expandOptionsTB(): iExpandOptions {
      return {
        multiSelect: {
          options: [
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
          ],
          change: (newVal: string[]) => {
            this.tbSelectedColumns = newVal;
          },
        },
      };
    },
  },
});
</script>

<style lang="scss" scoped>
.section-header {
  z-index: 10;
}
</style>
