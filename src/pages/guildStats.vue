<template>
  <div class="container swgoh-page">
    <div class="row">
      <div class="col">
        <Loading
          :state="loading"
          message="Loading Guild Data"
          size="lg"
          displayText="Please wait...This may take a few minutes."
        >
          <div
            class="row border-bottom py-2 m-0 text-center bg-dark guild-header"
          >
            <div class="col">
              <div class="h3 m-0">{{ gp.total.toLocaleString() }}</div>
              <div class="h4 m-0">Galactic Power</div>
            </div>
          </div>
          <div
            class="row border-bottom py-2 m-0 text-center bg-dark guild-header"
          >
            <div class="col">
              <div class="h3 m-0">Total Light Side Characters</div>
              <div class="h4 m-0">
                {{ gp.characters.lightSide.toLocaleString() }}
              </div>
            </div>
            <div class="col">
              <div class="h3 m-0">Total Dark Side Characters</div>
              <div class="h4 m-0">
                {{ gp.characters.darkSide.toLocaleString() }}
              </div>
            </div>
          </div>
          <div
            class="row border-bottom py-2 m-0 text-center bg-dark guild-header"
          >
            <div class="col">
              <div class="h3 m-0">Total Light Side Ships</div>
              <div class="h4 m-0">
                {{ gp.ships.lightSide.toLocaleString() }}
              </div>
            </div>
            <div class="col">
              <div class="h3 m-0">Total Dark Side Ships</div>
              <div class="h4 m-0">{{ gp.ships.darkSide.toLocaleString() }}</div>
            </div>
          </div>
        </Loading>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import { defineComponent } from "vue";
import { mapActions, mapState } from "vuex";

import { Unit } from "types/unit";
import { getUnit } from "types/unit";
import { AbilityStat } from "types/teams";
import { loadingState } from "types/loading";
import TWPlayerList from "components/guild/twPlayerList.vue";
import { apiClient } from "../api/api-client";

interface dataModel {
  gp: {
    ships: {
      lightSide: number;
      darkSide: number;
      neutral: number;
    };
    characters: {
      lightSide: number;
      darkSide: number;
      neutral: number;
    };
    total: number;
  };
  loading: loadingState;
  storageKey: string;
}

const storageKey = "GuildStats";

export default defineComponent({
  name: "GuildStats",
  components: { TWPlayerList },
  data() {
    return {
      gp: {
        ships: {
          lightSide: 0,
          darkSide: 0,
          neutral: 0,
        },
        characters: {
          lightSide: 0,
          darkSide: 0,
          neutral: 0,
        },
        total: 0,
      },
      loading: loadingState.initial,
      storageKey,
    } as dataModel;
  },
  computed: {
    ...mapState("guild", ["guildId"]),
  },
  methods: {
    ...mapActions("guild", ["fetchGuildUnitData"]),
  },
  async created() {
    this.loading = loadingState.loading;
    this.gp = await apiClient.fetchGuildStats(this.guildId);
    this.loading = loadingState.ready;
  },
});
</script>

<style lang="scss" scoped></style>
