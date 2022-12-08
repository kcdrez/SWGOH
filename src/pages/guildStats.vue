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
              <div class="h3 m-0">{{ totalGP.toLocaleString() }}</div>
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

interface dataModel {
  players: any[];
  loading: loadingState;
  storageKey: string;
}

const storageKey = "GuildStats";

export default defineComponent({
  name: "GuildStats",
  components: { TWPlayerList },
  data() {
    return {
      loading: loadingState.initial,
      players: [],
      storageKey,
    } as dataModel;
  },
  computed: {
    ...mapState("unit", ["unitList"]),
    ...mapState("teams", ["abilityStatsData"]),
    totalGP(): number {
      return this.players.reduce((total: number, player: any) => {
        return total + player.totalGP;
      }, 0);
    },
    gp(): any {
      return this.players.reduce(
        (acc, player) => {
          player.units.forEach((unit: any) => {
            const match = getUnit(unit.base_id);
            if (match) {
              if (match.isShip) {
                if (match.alignment === "Light Side") {
                  acc.ships.lightSide += unit.power;
                } else if (match.alignment === "Dark Side") {
                  acc.ships.darkSide += unit.power;
                } else {
                  acc.ships.neutral += unit.power;
                }
              } else {
                if (match.alignment === "Light Side") {
                  acc.characters.lightSide += unit.power;
                } else if (match.alignment === "Dark Side") {
                  acc.characters.darkSide += unit.power;
                } else {
                  acc.characters.neutral += unit.power;
                }
              }
            }
          });
          return acc;
        },
        {
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
        }
      );
    },
  },
  watch: {
    playersJoined(newVal) {
      window.localStorage.setItem(storageKey, JSON.stringify(newVal));
    },
  },
  methods: {
    ...mapActions("guild", ["fetchGuildUnitData"]),
  },
  async created() {
    this.loading = loadingState.loading;
    this.players = await this.fetchGuildUnitData();
    this.loading = loadingState.ready;
  },
});
</script>

<style lang="scss" scoped>
.gl-header,
.gl-list,
.cap-ship-header,
.cap-ship-list {
  position: sticky;
}
.gl-header {
  top: 56px;
  z-index: 11;
}
.gl-list {
  top: 105px;
}
.cap-ship-header {
  top: 199px;
  z-index: 10;
}
.cap-ship-list {
  top: 248px;
}
</style>
