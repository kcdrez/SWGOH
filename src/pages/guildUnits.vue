<template>
  <div class="container swgoh-page mb-3">
    <Loading :state="requestState" message="Loading Guild Data" size="lg">
      <SearchInput :list="unitList" @select="selectUnit($event)" />
      <Loading :state="loading" message="Loading Guild's Unit Data" size="lg">
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
                  <th v-if="showCol('allyCode')">Ally Code</th>
                  <th v-if="showCol('name')">Player Name</th>
                  <th v-if="showCol('gearLevel')">Gear Level</th>
                  <th v-if="showCol('relicLevel')">Relic Level</th>
                  <th v-if="showCol('zetas')">Zetas</th>
                  <th v-if="showCol('omicrons')">Omicrons</th>
                  <th v-if="showCol('speed')">Speed</th>
                  <th v-if="showCol('physicalOffense')">Physical Offense</th>
                  <th v-if="showCol('specialOffense')">Special Offense</th>
                  <th v-if="showCol('protection')">Protection</th>
                  <th v-if="showCol('health')">Health</th>
                  <th v-if="showCol('tenacity')">Tenacity</th>
                  <th v-if="showCol('potency')">Potency</th>
                  <th v-if="showCol('physicalCrit')">Physical Crit Chance</th>
                  <th v-if="showCol('specialCrit')">Special Crit Chance</th>
                  <th v-if="showCol('critDamage')">Crit Damage</th>
                  <th v-if="showCol('armor')">Armor</th>
                  <th v-if="showCol('resistance')">Resistance</th>
                  <th v-if="showCol('ult')">Has Ult?</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  class="text-center align-middle"
                  v-for="player in data.owned"
                  :key="player.allyCode"
                >
                  <td v-if="showCol('allyCode')">{{ player.allyCode }}</td>
                  <td v-if="showCol('name')">{{ player.name }}</td>
                  <td v-if="showCol('gearLevel')">{{ player.gearLevel }}</td>
                  <td v-if="showCol('relicLevel')">{{ player.relicLevel }}</td>
                  <td v-if="showCol('zetas')">{{ player.zetas }}</td>
                  <td v-if="showCol('omicrons')">{{ player.omicrons }}</td>
                  <td v-if="showCol('speed')">{{ player.speed }}</td>
                  <td v-if="showCol('physicalOffense')">
                    {{ player.offensePhysical }}
                  </td>
                  <td v-if="showCol('specialOffense')">
                    {{ player.offenseSpecial }}
                  </td>
                  <td v-if="showCol('protection')">{{ player.protection }}</td>
                  <td v-if="showCol('health')">{{ player.health }}</td>
                  <td v-if="showCol('tenacity')">{{ player.tenacity }}%</td>
                  <td v-if="showCol('potency')">{{ player.potency }}%</td>
                  <td v-if="showCol('physicalCrit')">
                    {{ player.critChancePhysical }}%
                  </td>
                  <td v-if="showCol('specialCrit')">
                    {{ player.critChanceSpecial }}%
                  </td>
                  <td v-if="showCol('critDamage')">{{ player.critDamage }}</td>
                  <td v-if="showCol('armor')">{{ player.armor }}</td>
                  <td v-if="showCol('resistance')">{{ player.resistance }}</td>
                  <td v-if="showCol('ult')">
                    {{ player.ultimate ? "Yes" : "No" }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- <div class="collapse-header section-header mt-3">
          <h3>
            <div data-bs-toggle="collapse" href="#guild-data">Guild Data</div>
          </h3>
          <MultiSelect
            class="select-columns"
            :options="guildCols"
            :storageKey="storageKey + 'GuildColumns'"
            @checked="selectedColumns = $event"
          />
        </div>
        <div id="guild-data" class="collapse" ref="playerData">
          <table
            class="table table-bordered table-dark table-sm table-striped swgoh-table"
          >
            <thead class="sticky-header show-on-mobile">
              <tr class="text-center align-middle">
              </tr>
            </thead>
            <tbody>
              <tr
                class="text-center align-middle"
                v-for="player in data.owned"
                :key="player.allyCode"
              >
              </tr>
            </tbody>
          </table>
        </div> -->
        </template>
      </Loading>
    </Loading>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters, mapState } from "vuex";
import { writeFile, utils } from "xlsx";

import { loadingState } from "../types/loading";
import { initializeModules, setupEvents, unvue } from "../utils";
import { Unit } from "../types/unit";

const dependencyModules = ["player", "guild"];
const storageKey = "guildUnits";

interface dataModel {
  sortDir: "asc" | "desc";
  sortMethod: string;
  selected: null | Unit;
  data: any;
  loading: loadingState;
  selectedColumns: string[];
  storageKey: string;
  initialize: boolean;
}

export default defineComponent({
  name: "GuildUnitsPage",
  components: {},
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
    ...mapState("unit", ["unitList"]),
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
          value: "ult",
        },
      ];
      return list;
    },
    guildCols(): { text: string; value: any }[] {
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
          value: "ult",
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
  },
  methods: {
    ...mapActions("guild", ["fetchGuildUnitData"]),
    async selectUnit(unit: null | Unit) {
      if (unit && unit.id) {
        this.loading = loadingState.loading;
        this.data = await this.fetchGuildUnitData(unit.id);
        this.loading = loadingState.ready;
      }

      if (!this.initialize) {
        this.initialize = true;

        this.$nextTick(() => {
          setupEvents(
            this.$refs.playerData as HTMLElement,
            storageKey + "Collapse"
          );
        });
      }
    },
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
    sortBy(type: string): void {
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
  mounted() {},
});
</script>

<style lang="scss" scoped></style>
