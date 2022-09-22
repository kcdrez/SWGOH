<template>
  <div class="container swgoh-page mb-3">
    <UnitSearch @select="selectUnit($event)" />
    <Loading
      :state="loading"
      message="Loading Guild's Unit Data"
      size="lg"
      displayText="Please wait...This may take a few minutes."
    >
      <template v-if="data">
        <button class="btn btn-sm btn-primary my-3" @click="downloadXlsx()">
          Download as XLSX
        </button>
        <div class="collapse-header section-header extended-1">
          <h3>
            <div data-bs-toggle="collapse" href="#player-data">Player Data</div>
          </h3>
          <div class="toggles-container">
            <MultiSelect
              class="select-columns"
              :options="playerCols"
              :storageKey="storageKey + 'PlayerColumns'"
              @checked="selectedColumns = $event"
            />
          </div>
        </div>
        <div id="player-data" class="collapse" ref="playerData">
          <table
            class="table table-bordered table-dark table-sm table-striped swgoh-table"
          >
            <thead class="sticky-header show-on-mobile">
              <tr class="text-center align-middle">
                <th
                  v-if="showCol('allyCode')"
                  @click="sortBy('allyCode')"
                  class="c-pointer"
                >
                  <span>Ally Code</span>
                  <i class="fas mx-2" :class="sortIcon('allyCode')"></i>
                </th>
                <th
                  v-if="showCol('name')"
                  @click="sortBy('name')"
                  class="c-pointer"
                >
                  <span>Player Name</span>
                  <i class="fas mx-2" :class="sortIcon('name')"></i>
                </th>
                <th
                  v-if="showCol('stars')"
                  @click="sortBy('stars')"
                  class="c-pointer"
                >
                  <span>Stars</span>
                  <i class="fas mx-2" :class="sortIcon('gearstarsLevel')"></i>
                </th>
                <th
                  v-if="showCol('gearLevel')"
                  @click="sortBy('gearLevel')"
                  class="c-pointer"
                >
                  <span>Gear Level</span>
                  <i class="fas mx-2" :class="sortIcon('gearLevel')"></i>
                </th>
                <th
                  v-if="showCol('relicLevel')"
                  @click="sortBy('relicLevel')"
                  class="c-pointer"
                >
                  <span>Relic Level</span>
                  <i class="fas mx-2" :class="sortIcon('relicLevel')"></i>
                </th>
                <th
                  v-if="showCol('zetas')"
                  @click="sortBy('zetas')"
                  class="c-pointer"
                >
                  <span>Zetas</span>
                  <i class="fas mx-2" :class="sortIcon('allyCode')"></i>
                </th>
                <th
                  v-if="showCol('omicrons')"
                  @click="sortBy('omicrons')"
                  class="c-pointer"
                >
                  <span>Omicrons</span>
                  <i class="fas mx-2" :class="sortIcon('omicrons')"></i>
                </th>
                <th
                  v-if="showCol('speed')"
                  @click="sortBy('speed')"
                  class="c-pointer"
                >
                  <span>Speed</span>
                  <i class="fas mx-2" :class="sortIcon('speed')"></i>
                </th>
                <th
                  v-if="showCol('speed')"
                  @click="sortBy('speedMod')"
                  class="c-pointer"
                >
                  <span>Speed (Mods)</span>
                  <i class="fas mx-2" :class="sortIcon('speedMod')"></i>
                </th>
                <th
                  v-if="showCol('physicalOffense')"
                  @click="sortBy('physicalOffense')"
                  class="c-pointer"
                >
                  <span>Physical Offense</span>
                  <i class="fas mx-2" :class="sortIcon('physicalOffense')"></i>
                </th>
                <th
                  v-if="showCol('specialOffense')"
                  @click="sortBy('specialOffense')"
                  class="c-pointer"
                >
                  <span>Special Offense</span>
                  <i class="fas mx-2" :class="sortIcon('specialOffense')"></i>
                </th>
                <th
                  v-if="showCol('protection')"
                  @click="sortBy('protection')"
                  class="c-pointer"
                >
                  <span>Protection</span>
                  <i class="fas mx-2" :class="sortIcon('protection')"></i>
                </th>
                <th
                  v-if="showCol('health')"
                  @click="sortBy('health')"
                  class="c-pointer"
                >
                  <span>Health</span>
                  <i class="fas mx-2" :class="sortIcon('health')"></i>
                </th>
                <th
                  v-if="showCol('tenacity')"
                  @click="sortBy('tenacity')"
                  class="c-pointer"
                >
                  <span>Tenacity</span>
                  <i class="fas mx-2" :class="sortIcon('tenacity')"></i>
                </th>
                <th
                  v-if="showCol('potency')"
                  @click="sortBy('potency')"
                  class="c-pointer"
                >
                  <span>Potency</span>
                  <i class="fas mx-2" :class="sortIcon('potency')"></i>
                </th>
                <th
                  v-if="showCol('physicalCrit')"
                  @click="sortBy('physicalCrit')"
                  class="c-pointer"
                >
                  <span>Physical Crit Chance</span>
                  <i class="fas mx-2" :class="sortIcon('physicalCrit')"></i>
                </th>
                <th
                  v-if="showCol('specialCrit')"
                  @click="sortBy('specialCrit')"
                  class="c-pointer"
                >
                  <span>Special Crit Chance</span>
                  <i class="fas mx-2" :class="sortIcon('specialCrit')"></i>
                </th>
                <th
                  v-if="showCol('critDamage')"
                  @click="sortBy('critDamage')"
                  class="c-pointer"
                >
                  <span>Crit Damage</span>
                  <i class="fas mx-2" :class="sortIcon('critDamage')"></i>
                </th>
                <th
                  v-if="showCol('armor')"
                  @click="sortBy('armor')"
                  class="c-pointer"
                >
                  <span>Armor</span>
                  <i class="fas mx-2" :class="sortIcon('armor')"></i>
                </th>
                <th
                  v-if="showCol('resistance')"
                  @click="sortBy('resistance')"
                  class="c-pointer"
                >
                  <span>Resistance</span>
                  <i class="fas mx-2" :class="sortIcon('resistance')"></i>
                </th>
                <th
                  v-if="showCol('ultimate')"
                  @click="sortBy('ultimate')"
                  class="c-pointer"
                >
                  <span>Has Ult?</span>
                  <i class="fas mx-2" :class="sortIcon('ultimate')"></i>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="text-center align-middle"
                v-for="player in players"
                :key="player.allyCode"
              >
                <td v-if="showCol('allyCode')">
                  <span class="row-label">Ally Code:</span>
                  {{ player.allyCode }}
                </td>
                <td v-if="showCol('name')">
                  <span class="row-label">Player Name:</span> {{ player.name }}
                </td>
                <td v-if="showCol('stars')">
                  <span class="row-label">Stars:</span> {{ player.stars }}
                </td>
                <td v-if="showCol('gearLevel')">
                  <span class="row-label">Gear Level:</span>
                  {{ player.gearLevel }}
                </td>
                <td v-if="showCol('relicLevel')">
                  <span class="row-label">Relic Level:</span>
                  {{ player.relicLevel }}
                </td>
                <td v-if="showCol('zetas')">
                  <span class="row-label">Zetas:</span> {{ player.zetas }}
                </td>
                <td v-if="showCol('omicrons')">
                  <span class="row-label">Omicrons:</span> {{ player.omicrons }}
                </td>
                <td v-if="showCol('speed')">
                  <span class="row-label">Speed:</span> {{ player.speed }}
                </td>
                <td v-if="showCol('speed')">
                  <span class="row-label">Speed (Mods):</span>
                  {{ player.speedMod }}
                </td>
                <td v-if="showCol('physicalOffense')">
                  <span class="row-label">Physical Offense:</span>
                  {{ player.physicalOffense }}
                </td>
                <td v-if="showCol('specialOffense')">
                  <span class="row-label">Special Offense:</span>
                  {{ player.specialOffense }}
                </td>
                <td v-if="showCol('protection')">
                  <span class="row-label">Protection:</span>
                  {{ player.protection }}
                </td>
                <td v-if="showCol('health')">
                  <span class="row-label">Health:</span> {{ player.health }}
                </td>
                <td v-if="showCol('tenacity')">
                  <span class="row-label">Tenacity:</span>
                  {{ player.tenacity }}%
                </td>
                <td v-if="showCol('potency')">
                  <span class="row-label">Potency:</span> {{ player.potency }}%
                </td>
                <td v-if="showCol('physicalCrit')">
                  <span class="row-label">Physical Crit Chance:</span>
                  {{ player.physicalCrit }}%
                </td>
                <td v-if="showCol('specialCrit')">
                  <span class="row-label">Special Crit Chance:</span>
                  {{ player.specialCrit }}%
                </td>
                <td v-if="showCol('critDamage')">
                  <span class="row-label">Crit Damage:</span>
                  {{ player.critDamage }}
                </td>
                <td v-if="showCol('armor')">
                  <span class="row-label">Armor:</span> {{ player.armor }}
                </td>
                <td v-if="showCol('resistance')">
                  <span class="row-label">Resistance:</span>
                  {{ player.resistance }}
                </td>
                <td v-if="showCol('ultimate')">
                  <span class="row-label">Has Ult?:</span>
                  {{ player.ultimate ? "Yes" : "No" }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </Loading>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters, mapState } from "vuex";
import { writeFile, utils } from "xlsx";
import _ from "lodash";

import { loadingState } from "types/loading";
import { setupEvents, setupSorting, unvue } from "utils";
import { Unit } from "types/unit";
import { IGuildUnitMap, tUnitOwnedKeys } from "types/guild";
import UnitSearch from "components/units/unitSearch.vue";

const storageKey = "guildUnits";

interface dataModel {
  selected: null | Unit;
  data: IGuildUnitMap | null;
  loading: loadingState;
  selectedColumns: string[];
  storageKey: string;
  initialize: boolean;
}

export default defineComponent({
  name: "GuildUnitsPage",
  setup() {
    const { sortDir, sortMethod, searchText, sortBy, sortIcon } =
      setupSorting(storageKey);

    return {
      sortDir,
      sortMethod,
      searchText,
      sortBy,
      sortIcon,
    };
  },
  components: { UnitSearch },
  data() {
    return {
      selected: null,
      data: null,
      loading: loadingState.initial,
      selectedColumns: [],
      storageKey,
      initialize: false,
    } as dataModel;
  },
  computed: {
    ...mapGetters(["someLoading"]),
    players(): any[] {
      return (this.data?.owned ?? []).sort((a, b) => {
        if (this.sortMethod === "name") {
          const compareA = a.name.toLowerCase();
          const compareB = b.name.toLowerCase();
          if (this.sortDir === "asc") {
            return compareA > compareB ? 1 : -1;
          } else {
            return compareA > compareB ? -1 : 1;
          }
        } else {
          const compareA = (a as any)[this.sortMethod];
          const compareB = (b as any)[this.sortMethod];
          if (this.sortDir === "asc") {
            return compareA > compareB ? 1 : -1;
          } else {
            return compareA > compareB ? -1 : 1;
          }
        }
      });
    },
    loadingUnitState(): loadingState {
      return this.loading ? loadingState.loading : loadingState.ready;
    },
    playerCols(): { text: string; value: any }[] {
      const list = [
        {
          text: "Ally Code",
          value: "allyCode",
        },
        {
          text: "Player Name",
          value: "name",
        },
        {
          text: "Stars",
          value: "stars",
        },
        {
          text: "Gear Level",
          value: "gearLevel",
        },
        {
          text: "Relic Level",
          value: "relicLevel",
        },
        {
          text: "Zetas",
          value: "zetas",
        },
        {
          text: "Omicrons",
          value: "omicrons",
        },
        {
          text: "Speed",
          value: "speed",
        },
        {
          text: "Physical Offense",
          value: "physicalOffense",
        },
        {
          text: "Special Offense",
          value: "specialOffense",
        },
        {
          text: "Protection",
          value: "protection",
        },
        {
          text: "Health",
          value: "health",
        },
        {
          text: "Tenacity",
          value: "tenacity",
        },
        {
          text: "potency",
          value: "potency",
        },
        {
          text: "Physical Crit Chance",
          value: "physicalCrit",
        },
        {
          text: "Special Crit Chance",
          value: "specialCrit",
        },
        {
          text: "Crit Damage",
          value: "critDamage",
        },
        {
          text: "Armor",
          value: "armor",
        },
        {
          text: "Resistance",
          value: "resistance",
        },
        {
          text: "Has Ult?",
          value: "ultimate",
        },
      ];
      return list;
    },
  },
  watch: {
    initialize(newVal, oldVal) {
      if (newVal && !oldVal) {
        this.$nextTick(() => {
          setupEvents(
            this.$refs.playerData as HTMLElement,
            storageKey + "Collapse",
            true
          );
        });
      }
    },
  },
  methods: {
    ...mapActions("guild", ["fetchGuildUnitData"]),
    selectUnit: _.debounce(async function (this: any, unit: null | Unit) {
      if (unit && unit.id) {
        this.loading = loadingState.loading;
        this.data = await this.fetchGuildUnitData(unit.id);
        this.loading = loadingState.ready;
        this.initialize = true;
      }
    }, 500),
    downloadXlsx(): void {
      const rows = unvue(this.data?.owned ?? []);
      const wb = utils.book_new();
      const ws = utils.json_to_sheet(
        rows.map((row: any) => {
          Object.keys(row).forEach((key) => {
            if (!this.selectedColumns.find((col) => col === key)) {
              delete row[key];
            }
          });
          return row;
        })
      );

      utils.book_append_sheet(wb, ws, "Players");

      const fileName = this.selected?.id;
      writeFile(wb, fileName + ".xlsx");
    },
    showCol(key: string): boolean {
      return this.selectedColumns.some((x) => x === key);
    },
  },
});
</script>

<style lang="scss" scoped></style>
