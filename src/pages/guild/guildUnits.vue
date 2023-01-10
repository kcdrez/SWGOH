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
              <ColumnHeaders
                class="text-center align-middle"
                :headers="headers"
              />
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
import { mapActions, mapGetters } from "vuex";
import { writeFile, utils } from "xlsx";
import _ from "lodash";

import { loadingState } from "types/loading";
import { setupEvents, setupSorting, unvue } from "utils";
import { Unit } from "types/unit";
import { IGuildUnitMap } from "types/guild";
import UnitSearch from "components/units/unitSearch.vue";
import { iHeader } from "types/general";

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
    const { sortDir, sortMethod, sortBy, sortIcon } = setupSorting(storageKey);

    return {
      sortDir,
      sortMethod,
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
    headers(): iHeader[] {
      return [
        {
          label: "Ally Code",
          show: this.showCol("allyCode"),
          icon: this.sortIcon("allyCode"),
          click: () => {
            this.sortBy("allyCode");
          },
        },
        {
          label: "Player Name",
          show: this.showCol("name"),
          icon: this.sortIcon("name"),
          click: () => {
            this.sortBy("name");
          },
        },
        {
          label: "Stars",
          show: this.showCol("stars"),
          icon: this.sortIcon("stars"),
          click: () => {
            this.sortBy("stars");
          },
        },
        {
          label: "Gear Level",
          show: this.showCol("gearLevel"),
          icon: this.sortIcon("gearLevel"),
          click: () => {
            this.sortBy("gearLevel");
          },
        },
        {
          label: "Relic Level",
          show: this.showCol("relicLevel"),
          icon: this.sortIcon("relicLevel"),
          click: () => {
            this.sortBy("relicLevel");
          },
        },
        {
          label: "Zetas",
          show: this.showCol("zetas"),
          icon: this.sortIcon("zetas"),
          click: () => {
            this.sortBy("zetas");
          },
        },
        {
          label: "Omicrons",
          show: this.showCol("omicrons"),
          icon: this.sortIcon("omicrons"),
          click: () => {
            this.sortBy("omicrons");
          },
        },
        {
          label: "Speed",
          show: this.showCol("speed"),
          icon: this.sortIcon("speed"),
          click: () => {
            this.sortBy("speed");
          },
        },
        {
          label: "Speed (Mods)",
          show: this.showCol("speedMods"),
          icon: this.sortIcon("speedMods"),
          click: () => {
            this.sortBy("speedMods");
          },
        },
        {
          label: "Physical Offense",
          show: this.showCol("physicalOffense"),
          icon: this.sortIcon("physicalOffense"),
          click: () => {
            this.sortBy("physicalOffense");
          },
        },
        {
          label: "Special Offense",
          show: this.showCol("specialOffense"),
          icon: this.sortIcon("specialOffense"),
          click: () => {
            this.sortBy("specialOffense");
          },
        },
        {
          label: "Protection",
          show: this.showCol("protection"),
          icon: this.sortIcon("protection"),
          click: () => {
            this.sortBy("protection");
          },
        },
        {
          label: "Health",
          show: this.showCol("health"),
          icon: this.sortIcon("health"),
          click: () => {
            this.sortBy("health");
          },
        },
        {
          label: "Tenacity",
          show: this.showCol("tenacity"),
          icon: this.sortIcon("tenacity"),
          click: () => {
            this.sortBy("tenacity");
          },
        },
        {
          label: "Potency",
          show: this.showCol("potency"),
          icon: this.sortIcon("potency"),
          click: () => {
            this.sortBy("potency");
          },
        },
        {
          label: "Physical Crit Chance",
          show: this.showCol("physicalCrit"),
          icon: this.sortIcon("physicalCrit"),
          click: () => {
            this.sortBy("physicalCrit");
          },
        },
        {
          label: "Special Crit Chance",
          show: this.showCol("specialCrit"),
          icon: this.sortIcon("specialCrit"),
          click: () => {
            this.sortBy("specialCrit");
          },
        },
        {
          label: "Crit Damage",
          show: this.showCol("critDamage"),
          icon: this.sortIcon("critDamage"),
          click: () => {
            this.sortBy("critDamage");
          },
        },
        {
          label: "Armor",
          show: this.showCol("armor"),
          icon: this.sortIcon("armor"),
          click: () => {
            this.sortBy("armor");
          },
        },
        {
          label: "Resistance",
          show: this.showCol("resistance"),
          icon: this.sortIcon("resistance"),
          click: () => {
            this.sortBy("resistance");
          },
        },
        {
          label: "Has Ult?",
          show: this.showCol("ultimate"),
          icon: this.sortIcon("ultimate"),
          click: () => {
            this.sortBy("ultimate");
          },
        },
      ];
    },
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
