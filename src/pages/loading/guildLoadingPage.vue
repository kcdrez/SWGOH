<template>
  <div class="container swgoh-page">
    <div v-if="$route.params.guildId">
      <Loading :state="loading" size="lg">
        <template v-slot:error>{{ errorLoading }}</template>
        <router-view :key="$route.fullPath" />
      </Loading>
    </div>
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
                name: $route.name ?? undefined,
                params: { guildId: guildIdInput },
              })
            "
            :disabled="!guildIdInput"
          >
            Search
          </button>
        </div>
        You can find the guild's ID by going to
        <a href="https://swgoh.gg/g/">SWGOH.GG</a> and searching for the guild
        you are looking for. Once you are on the guild's page, the ID will be in
        the URL: https://swgoh.gg/g/{guild_id_will_be_here}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import { defineComponent } from "vue";
import { mapActions, mapGetters, mapState } from "vuex";

import { loadingState } from "types/loading";
import { apiClient } from "../../api/api-client";
import { maxRelicLevel } from "types/relic";
import { iHeaderCell, iTableBody, iTableHead } from "types/general";

interface dataModel {
  guildIdInput: string;
  loading: loadingState;
}

export default defineComponent({
  name: "GuildLoadingPage",
  props: {
    dependencyModules: {
      type: Array as () => string[],
      required: true,
    },
    loadAsync: {
      type: Boolean,
      default: true,
    },
    errorLoading: {
      type: String,
      default: "Error loading data",
    },
    preloadFunctions: {
      type: Array as () => Function[],
      default: null,
    },
  },
  data(): dataModel {
    return {
      guildIdInput: "",
      loading: loadingState.initial,
    };
  },
  computed: {
    ...mapState("player", ["requestState"]),
    ...mapGetters(["someLoading"]),
    loadingState() {
      const loadingArray = [this.loading];
      const hasError = loadingArray.some((x) => x === loadingState.error);
      const hasLoading = loadingArray.some((x) => x === loadingState.loading);

      if (hasError) {
        return loadingState.error;
      } else if (hasLoading) {
        return loadingState.loading;
      } else {
        return this.someLoading(this.dependencyModules);
      }
    },
  },
  methods: {
    ...mapActions("guild", ["fetchGuildUnitData"]),
  },
  async created() {
    const { guildId } = this.$route.params;
    if (typeof guildId === "string" && this.preloadFunctions) {
      this.loading = loadingState.loading;
      if (!this.loadAsync) {
        for (let i = 0; i < this.preloadFunctions.length; i++) {
          const functionName = this.preloadFunctions[i];
          await functionName(guildId);
        }
      } else {
        await Promise.all(
          this.preloadFunctions.map((functionName) => functionName(guildId))
        );
      }
    }
    this.loading = loadingState.ready;
  },
});
</script>

<style lang="scss" scoped>
::v-deep(tr) {
  td:first-child {
    vertical-align: top;
    .sticky-name {
      position: sticky;
      top: 65px;
    }
  }
}
</style>
