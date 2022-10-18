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
            <div class="col">
              <div class="h3 m-0">{{ activePlayers.length }}</div>
              <div class="h4 m-0">Active Members</div>
            </div>
          </div>
          <div class="row py-2 m-0 sticky-header text-center bg-dark gl-header">
            <div class="col col-header">
              <div class="h3 m-0">Galactic Legends</div>
              <MultiSelect
                class="select-columns"
                :options="glColumns"
                :storageKey="storageKey + 'glColumns'"
                @checked="glSelectedColumns = $event"
              />
            </div>
          </div>
          <div class="row border-bottom py-2 m-0 text-center bg-dark gl-list">
            <template v-for="unit in glList" :key="unit.id">
              <div class="col" v-if="showCol(unit.id)">
                <div class="h4 m-0">{{ unitCount(unit.id) }}</div>
                <div class="h5 m-0">{{ unit.name }}</div>
              </div>
            </template>
          </div>
          <div class="row py-2 m-0 text-center bg-dark cap-ship-header">
            <div class="col col-header">
              <div class="h3 m-0">Capital Ships</div>
              <MultiSelect
                class="select-columns"
                :options="capShipColumns"
                :storageKey="storageKey + 'capShipColumns'"
                @checked="capShipSelectedColumns = $event"
              />
            </div>
          </div>
          <div class="row py-2 m-0 text-center bg-dark cap-ship-list">
            <template v-for="unit in capShipList" :key="unit.id">
              <div class="col" v-if="showCol(unit.id)">
                <div class="h4 m-0">{{ unitCount(unit.id) }}</div>
                <div class="h5 m-0">{{ unit.name }}</div>
              </div>
            </template>
          </div>
          <TWPlayerList
            :storageKey="`${storageKey}_playerList`"
            :players="players"
            :units="[...glList, ...capShipList]"
            :playersJoined="playersJoined"
            :selectedColumns="[...glSelectedColumns, ...capShipSelectedColumns]"
            @joined="playersJoined = $event"
          />
        </Loading>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapState } from "vuex";

import { Unit } from "types/unit";
import { AbilityStat } from "types/teams";
import { setupSorting } from "utils";
import { loadingState } from "types/loading";
import TWPlayerList from "components/guild/twPlayerList.vue";

interface dataModel {
  players: any[];
  loading: loadingState;
  playersJoined: string[];
  storageKey: string;
  glSelectedColumns: string[];
  capShipSelectedColumns: string[];
}

const storageKey = "twPlanner";

export default defineComponent({
  name: "TWPlanner",
  components: { TWPlayerList },
  data() {
    return {
      loading: loadingState.initial,
      players: [],
      playersJoined: [],
      storageKey,
      glSelectedColumns: [],
      capShipSelectedColumns: [],
    } as dataModel;
  },
  computed: {
    ...mapState("unit", ["unitList"]),
    ...mapState("teams", ["abilityStatsData"]),
    activePlayers(): any[] {
      return this.players.filter((player: any) => {
        return this.playersJoined.includes(player.allyCode);
      });
    },
    twUnits(): Unit[] {
      return this.unitList.filter((unit: Unit) => {
        if (unit.id in this.abilityStatsData) {
          if (this.hasTWOmicron(unit.id)) {
            return true;
          }
        }
        return unit.isGL || unit.isCapitalShip;
      });
    },
    glList(): Unit[] {
      return this.unitList.filter((unit: Unit) => unit.isGL);
    },
    glColumns(): { text: string; value: string }[] {
      return this.glList.map((x: Unit) => {
        return {
          text: x.name,
          value: x.id,
        };
      });
    },
    capShipList(): Unit[] {
      return this.unitList.filter((unit: Unit) => unit.isCapitalShip);
    },
    capShipColumns(): { text: string; value: string }[] {
      return this.capShipList.map((x: Unit) => {
        return {
          text: x.name,
          value: x.id,
        };
      });
    },
    // selectedColumns() {}
    // unitCount(): any {
    //   return this.twUnits.map((unit: Unit) => {
    //     const { owned, omicronCount } = this.activePlayers.reduce(
    //       (total: { owned: number; omicronCount: number }, player: any) => {
    //         const match = player.units.find((x: any) => x.base_id === unit.id);
    //         if (match) {
    //           total.owned++;
    //           if (match.omicron_abilities.length > 0) {
    //             total.omicronCount++;
    //           }
    //         }
    //         return total;
    //       },
    //       { owned: 0, omicronCount: 0 }
    //     );
    //     return {
    //       id: unit.id,
    //       name: unit.name,
    //       owned,
    //       omicronCount,
    //     };
    //   });
    // },
    totalGP(): number {
      return this.activePlayers.reduce((total: number, player: any) => {
        return total + player.totalGP;
      }, 0);
    },
  },
  watch: {
    playersJoined(newVal) {
      window.localStorage.setItem(storageKey, JSON.stringify(newVal));
    },
  },
  methods: {
    ...mapActions("guild", ["fetchGuildUnitData"]),
    showCol(key: string): boolean {
      return [...this.glSelectedColumns, ...this.capShipSelectedColumns].some(
        (x) => x === key
      );
    },
    hasTWOmicron(unitId: string) {
      if (this.abilityStatsData[unitId]) {
        const { leader, unique }: AbilityStat = this.abilityStatsData[unitId];
        const hasTWLeader = (leader ?? []).some((ability) => {
          return ability.omicron?.mode === "Territory Wars";
        });
        const hasTWUnique = (unique ?? []).some((ability) => {
          return ability.omicron?.mode === "Territory Wars";
        });
        return hasTWLeader || hasTWUnique;
      } else {
        return false;
      }
    },
    unitCount(unitId: string): number {
      return this.activePlayers.reduce((total: number, player: any) => {
        if (player.units.some((x: any) => x.base_id === unitId)) {
          total += 1;
        }
        return total;
      }, 0);
    },
  },
  async created() {
    const ids: string[] = this.twUnits.map((unit: Unit) => unit.id);
    this.loading = loadingState.loading;
    this.players = await this.fetchGuildUnitData(ids);
    this.playersJoined = JSON.parse(
      window.localStorage.getItem(storageKey) || "[]"
    );
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
}
.gl-list {
  top: 105px;
}
.cap-ship-header {
  top: 199px;
}
.cap-ship-list {
  top: 248px;
}
</style>
