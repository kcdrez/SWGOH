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
              <div class="h5 m-0">Total Galactic Power</div>
            </div>
          </div>
          <div
            class="row border-bottom py-2 m-0 text-center bg-dark guild-header"
          >
            <div class="col">
              <div class="h3 m-0">
                {{ gp.characters.lightSide.toLocaleString() }}
              </div>
              <div class="h5 m-0">Total Light Side Characters</div>
            </div>
            <div class="col">
              <div class="h3 m-0">
                {{ gp.characters.darkSide.toLocaleString() }}
              </div>
              <div class="h5 m-0">Total Dark Side Characters</div>
            </div>
          </div>
          <div
            class="row border-bottom py-2 m-0 text-center bg-dark guild-header"
          >
            <div class="col">
              <div class="h3 m-0">
                {{ gp.ships.lightSide.toLocaleString() }}
              </div>
              <div class="h5 m-0">Total Light Side Ships</div>
            </div>
            <div class="col">
              <div class="h3 m-0">{{ gp.ships.darkSide.toLocaleString() }}</div>
              <div class="h5 m-0">Total Dark Side Ships</div>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col-6 offset-3">
              <div class="input-group input-group-sm">
                <span class="input-group-text">Minimum Relic Level:</span>
                <select class="form-control" v-model.number="minimumLevel">
                  <option
                    v-for="(el, index) in maxRelicLevel + 1"
                    :key="index"
                    :value="index"
                  >
                    {{ index }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col-6 offset-3">
              <div class="input-group input-group-sm">
                <span class="input-group-text">View Mode:</span>
                <select class="form-control" v-model="viewMode">
                  <option v-for="mode in modes" :key="mode" :value="mode">
                    {{ mode }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col">
              <table
                class="table table-bordered table-dark table-sm table-striped mb-0 swgoh-table text-center"
                v-if="viewMode === 'Player'"
              >
                <TableHeader :header="header" />
                <tbody class="align-middle">
                  <template
                    v-for="(units, playerName) in unitsByPlayer"
                    :key="playerName"
                  >
                    <tr>
                      <td :rowspan="units.length + 1">
                        <span>{{ playerName }}</span>
                      </td>
                    </tr>
                    <tr v-for="unit in units" :key="playerName + unit.id">
                      <td>{{ unit.name }}</td>
                      <td>
                        <RelicLevelIcon
                          :relicLevel="unit.relicLevel"
                          :alignment="unit.alignment"
                          class="d-inline-block"
                        />
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
              <table
                class="table table-bordered table-dark table-sm table-striped mb-0 swgoh-table text-center"
                v-if="viewMode === 'Unit'"
              >
                <TableHeader :header="header" />
                <tbody class="align-middle">
                  <template
                    v-for="(units, unitName) in unitsByName"
                    :key="unitName"
                  >
                    <tr>
                      <td :rowspan="units.length + 1">
                        <span>{{ unitName }}</span>
                      </td>
                    </tr>
                    <tr v-for="unit in units" :key="unitName + unit.owner">
                      <td>
                        <RelicLevelIcon
                          :relicLevel="unit.relicLevel"
                          :alignment="unit.alignment"
                          class="d-inline-block"
                        />
                      </td>
                      <td>{{ unit.owner }}</td>
                    </tr>
                  </template>
                </tbody>
              </table>
              <table
                class="table table-bordered table-dark table-sm table-striped mb-0 swgoh-table text-center"
                v-if="viewMode === 'Level'"
              >
                <TableHeader :header="header" />
                <tbody class="align-middle">
                  <template v-for="(units, level) in unitsByLevel" :key="level">
                    <tr>
                      <td :rowspan="units.length + 1">
                        <span>
                          <RelicLevelIcon
                            :relicLevel="level"
                            class="d-inline-block"
                          />
                        </span>
                      </td>
                    </tr>
                    <tr
                      v-for="unit in units"
                      :key="level + unit.owner + unit.id"
                    >
                      <td>{{ unit.name }}</td>
                      <td>{{ unit.owner }}</td>
                    </tr>
                  </template>
                </tbody>
              </table>
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
import { apiClient } from "../../api/api-client";
import { maxRelicLevel } from "types/relic";
import RelicLevelIcon from "components/units/relicLevelIcon.vue";
import { iHeader, iTableHead } from "types/general";

interface dataModel {
  maxRelicLevel: number;
  modes: string[];
  minimumLevel: number;
  viewMode: string;
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
    units: any[];
  };
  loading: loadingState;
  storageKey: string;
}

const storageKey = "GuildStats";

export default defineComponent({
  name: "GuildStats",
  components: { RelicLevelIcon },
  data() {
    return {
      maxRelicLevel,
      modes: ["Player", "Unit", "Level"],
      minimumLevel: 1,
      viewMode: "Player",
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
        units: [],
      },
      loading: loadingState.initial,
      storageKey,
    } as dataModel;
  },
  computed: {
    ...mapState("guild", ["guildId"]),
    header(): iTableHead {
      const relicLevelHeader: iHeader = {
        label: "Relic Level",
        show: true,
        sortMethodShow: true,
      };
      const unitHeader: iHeader = {
        label: "Unit",
        show: true,
        sortMethodShow: true,
      };
      const playerHeader: iHeader = {
        label: "Player",
        show: true,
        sortMethodShow: true,
      };

      if (this.viewMode === "Level") {
        return {
          headers: [relicLevelHeader, unitHeader, playerHeader],
        };
      } else if (this.viewMode === "Player") {
        return {
          headers: [playerHeader, unitHeader, relicLevelHeader],
        };
      } else if (this.viewMode === "Unit") {
        return {
          headers: [unitHeader, relicLevelHeader, playerHeader],
        };
      } else {
        return {
          headers: [],
        };
      }
    },
    unitsByPlayer() {
      return this.gp.units.reduce((acc, unit) => {
        if (unit.relicLevel >= this.minimumLevel) {
          if (unit.owner in acc) {
            acc[unit.owner].push(unit);
          } else {
            acc[unit.owner] = [unit];
          }
        }
        return acc;
      }, {});
    },
    unitsByName() {
      return this.gp.units.reduce((acc, unit) => {
        if (unit.relicLevel >= this.minimumLevel) {
          if (unit.name in acc) {
            acc[unit.name].push(unit);
          } else {
            acc[unit.name] = [unit];
          }
        }
        return acc;
      }, {});
    },
    unitsByLevel() {
      return this.gp.units.reduce((acc, unit) => {
        if (unit.relicLevel >= this.minimumLevel) {
          if (unit.relicLevel in acc) {
            acc[unit.relicLevel].push(unit);
          } else {
            acc[unit.relicLevel] = [unit];
          }
        }
        return acc;
      }, {});
    },
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

<style lang="scss" scoped>
tr {
  td:first-child {
    vertical-align: top;
    span {
      position: sticky;
      top: 65px;
    }
  }
}
</style>
