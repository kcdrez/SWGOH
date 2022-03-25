<template>
  <div class="container swgoh-page mb-3">
    <Loading :state="requestState" message="Loading Guild Data" size="lg">
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
          <div class="collapse-header section-header">
            <h3>
              <div data-bs-toggle="collapse" href="#player-data">
                Player Data
              </div>
            </h3>
            <MultiSelect
              class="select-columns"
              :options="playerCols"
              :storageKey="storageKey + 'PlayerColumns'"
              @checked="selectedColumns = $event"
            />
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
                    <i
                      class="fas mx-2"
                      :class="sortIcon('physicalOffense')"
                    ></i>
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
                  <td v-if="showCol('allyCode')">{{ player.allyCode }}</td>
                  <td v-if="showCol('name')">{{ player.name }}</td>
                  <td v-if="showCol('gearLevel')">{{ player.gearLevel }}</td>
                  <td v-if="showCol('relicLevel')">{{ player.relicLevel }}</td>
                  <td v-if="showCol('zetas')">{{ player.zetas }}</td>
                  <td v-if="showCol('omicrons')">{{ player.omicrons }}</td>
                  <td v-if="showCol('speed')">{{ player.speed }}</td>
                  <td v-if="showCol('speed')">{{ player.speedMod }}</td>
                  <td v-if="showCol('physicalOffense')">
                    {{ player.physicalOffense }}
                  </td>
                  <td v-if="showCol('specialOffense')">
                    {{ player.specialOffense }}
                  </td>
                  <td v-if="showCol('protection')">{{ player.protection }}</td>
                  <td v-if="showCol('health')">{{ player.health }}</td>
                  <td v-if="showCol('tenacity')">{{ player.tenacity }}%</td>
                  <td v-if="showCol('potency')">{{ player.potency }}%</td>
                  <td v-if="showCol('physicalCrit')">
                    {{ player.physicalCrit }}%
                  </td>
                  <td v-if="showCol('specialCrit')">
                    {{ player.specialCrit }}%
                  </td>
                  <td v-if="showCol('critDamage')">{{ player.critDamage }}</td>
                  <td v-if="showCol('armor')">{{ player.armor }}</td>
                  <td v-if="showCol('resistance')">{{ player.resistance }}</td>
                  <td v-if="showCol('ultimate')">
                    {{ player.ultimate ? "Yes" : "No" }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </Loading>
    </Loading>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters, mapState } from "vuex";
import { writeFile, utils } from "xlsx";
import _ from "lodash";

import { loadingState } from "../types/loading";
import { initializeModules, setupEvents, unvue } from "../utils";
import { Unit } from "../types/unit";
import { IGuildUnitMap, tUnitOwnedKeys } from "../types/guild";
import UnitSearch from "../components/units/unitSearch.vue";

const dependencyModules = ["player", "guild"];
const storageKey = "guildUnits";

interface dataModel {
  sortDir: "asc" | "desc";
  sortMethod: tUnitOwnedKeys;
  selected: null | Unit;
  data: IGuildUnitMap | null;
  loading: loadingState;
  selectedColumns: string[];
  storageKey: string;
  initialize: boolean;
}

export default defineComponent({
  name: "GuildUnitsPage",
  components: { UnitSearch },
  data() {
    return {
      sortDir: "asc",
      sortMethod: "name",
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
          const compareA = a[this.sortMethod];
          const compareB = b[this.sortMethod];
          if (this.sortDir === "asc") {
            return compareA > compareB ? 1 : -1;
          } else {
            return compareA > compareB ? -1 : 1;
          }
        }
      });
    },
    requestState(): loadingState {
      return this.someLoading(dependencyModules);
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
    sortDir() {
      this.saveSortData();
    },
    sortMethod() {
      this.saveSortData();
    },
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
    sortBy(type: tUnitOwnedKeys): void {
      if (this.sortMethod === type) {
        this.sortDir = this.sortDir === "asc" ? "desc" : "asc";
      } else {
        this.sortDir = "asc";
      }
      this.sortMethod = type;
    },
    sortIcon(type: string): string {
      if (this.sortMethod === type) {
        return this.sortDir === "asc" ? "fa-sort-down" : "fa-sort-up";
      } else {
        return "fa-sort";
      }
    },
    saveSortData() {
      window.localStorage.setItem(
        this.storageKey,
        JSON.stringify({
          sortDir: this.sortDir,
          sortMethod: this.sortMethod,
        })
      );
    },
    showCol(key: string): boolean {
      return this.selectedColumns.some((x) => x === key);
    },
  },
  async created() {
    await initializeModules(dependencyModules);
    const storageData = JSON.parse(
      window.localStorage.getItem(this.storageKey) || "{}"
    );
    this.sortDir = storageData.sortDir ?? "asc";
    this.sortMethod = storageData.sortMethod ?? "name";
  },
});
</script>

<style lang="scss" scoped></style>
