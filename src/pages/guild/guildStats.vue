<template>
  <div class="container swgoh-page">
    <div class="row" v-if="fetchGuildId">
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
              <SwgohTable :table="{ header, body }" />
            </div>
          </div>
        </Loading>
      </div>
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
                name: 'GuildStats',
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
import _ from "lodash";
import { defineComponent } from "vue";
import { mapActions, mapState } from "vuex";

import { loadingState } from "types/loading";
import { apiClient } from "../../api/api-client";
import { maxRelicLevel } from "types/relic";
import { iHeaderCell, iTableBody, iTableHead } from "types/general";

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
  guildIdInput: string;
}

const storageKey = "GuildStats";

export default defineComponent({
  name: "GuildStats",
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
      guildIdInput: "",
    } as dataModel;
  },
  computed: {
    ...mapState("guild", ["guildId"]),
    fetchGuildId() {
      return this.guildId || this.$route.params.guildId;
    },
    header(): iTableHead {
      const relicLevelHeader: iHeaderCell = {
        label: "Relic Level",
        show: true,
      };
      const unitHeader: iHeaderCell = {
        label: "Unit",
        show: true,
      };
      const playerHeader: iHeaderCell = {
        label: "Player",
        show: true,
      };

      if (this.viewMode === "Level") {
        return {
          headers: [
            {
              cells: [relicLevelHeader, unitHeader, playerHeader],
            },
          ],
        };
      } else if (this.viewMode === "Player") {
        return {
          headers: [
            {
              cells: [playerHeader, unitHeader, relicLevelHeader],
            },
          ],
        };
      } else if (this.viewMode === "Unit") {
        return {
          headers: [
            {
              cells: [unitHeader, relicLevelHeader, playerHeader],
            },
          ],
        };
      } else {
        return {
          headers: [],
        };
      }
    },
    body(): iTableBody {
      if (this.viewMode === "Player") {
        return Object.entries(this.unitsByPlayer).reduce(
          (acc: any, val: any) => {
            const [playerName, units] = val;

            acc.rows.push({
              cells: [
                {
                  rowspan: units.length + 1,
                  show: true,
                  data: {
                    message: playerName,
                    classes: "sticky-name",
                  },
                },
              ],
            });
            units.forEach((unit: any) => {
              acc.rows.push({
                cells: [
                  {
                    show: true,
                    data: unit.name,
                  },
                  {
                    show: true,
                    type: "unitLevel",
                    data: {
                      type: "Relic",
                      unitId: unit.id,
                      value: unit.relicLevel,
                      classes: "d-inline-block",
                    },
                  },
                ],
              });
            });
            return acc;
          },
          {
            classes: "align-middle text-center",
            rows: [],
          }
        );
      } else if (this.viewMode === "Unit") {
        return Object.entries(this.unitsByName).reduce(
          (acc: any, val: any) => {
            const [unitName, units] = val;

            acc.rows.push({
              cells: [
                {
                  rowspan: units.length + 1,
                  show: true,
                  data: {
                    message: unitName,
                    classes: "sticky-name",
                  },
                },
              ],
            });
            units.forEach((unit: any) => {
              acc.rows.push({
                cells: [
                  {
                    show: true,
                    data: unit.owner,
                  },
                  {
                    show: true,
                    type: "unitLevel",
                    data: {
                      type: "Relic",
                      unitId: unit.id,
                      value: unit.relicLevel,
                      classes: "d-inline-block",
                    },
                  },
                ],
              });
            });
            return acc;
          },
          {
            classes: "align-middle text-center",
            rows: [],
          }
        );
      } else if (this.viewMode === "Level") {
        return Object.entries(this.unitsByLevel).reduce(
          (acc: any, val: any) => {
            const [level, units] = val;

            acc.rows.push({
              cells: [
                {
                  show: true,
                  type: "unitLevel",
                  data: {
                    type: "Relic",
                    value: level,
                    classes: "sticky-name",
                  },
                },
              ],
            });
            units.forEach((unit: any) => {
              acc.rows.push({
                cells: [
                  {
                    show: true,
                    data: unit.name,
                  },
                  {
                    show: true,
                    data: unit.owner,
                  },
                ],
              });
            });
            return acc;
          },
          {
            classes: "align-middle text-center",
            rows: [],
          }
        );
      } else {
        return {
          rows: [],
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
    if (this.fetchGuildId) {
      this.loading = loadingState.loading;
      this.gp = await apiClient.fetchGuildStats(this.fetchGuildId);
      this.loading = loadingState.ready;
    }
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
