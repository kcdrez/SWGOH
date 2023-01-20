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
              :options="header.headers"
              :storageKey="storageKey + 'PlayerColumns'"
              @checked="selectedColumns = $event"
            />
          </div>
        </div>
        <div id="player-data" class="collapse" ref="playerData">
          <SwgohTable :table="{ header, body }" />
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
import { iTableBody, iTableHead } from "types/general";

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
    header(): iTableHead {
      return {
        classes: "sticky-header show-on-mobile",
        sortMethod: this.sortMethod,
        sortDir: this.sortDir,
        methodChange: (val: string) => {
          this.sortMethod = val;
        },
        directionChange: (val: "asc" | "desc") => {
          this.sortDir = val;
        },
        headers: [
          {
            cells: [
              {
                label: "Ally Code",
                show: this.showCol("allyCode"),
                icon: this.sortIcon("allyCode"),
                value: "allyCode",
                click: () => {
                  this.sortBy("allyCode");
                },
              },
              {
                label: "Player Name",
                show: this.showCol("name"),
                icon: this.sortIcon("name"),
                value: "name",
                click: () => {
                  this.sortBy("name");
                },
              },
              {
                label: "Stars",
                show: this.showCol("stars"),
                icon: this.sortIcon("stars"),
                value: "stars",
                click: () => {
                  this.sortBy("stars");
                },
              },
              {
                label: "Gear Level",
                show: this.showCol("gearLevel"),
                icon: this.sortIcon("gearLevel"),
                value: "gearLevel",
                click: () => {
                  this.sortBy("gearLevel");
                },
              },
              {
                label: "Relic Level",
                show: this.showCol("relicLevel"),
                icon: this.sortIcon("relicLevel"),
                value: "relicLevel",
                click: () => {
                  this.sortBy("relicLevel");
                },
              },
              {
                label: "Zetas",
                show: this.showCol("zetas"),
                icon: this.sortIcon("zetas"),
                value: "zetas",
                click: () => {
                  this.sortBy("zetas");
                },
              },
              {
                label: "Omicrons",
                show: this.showCol("omicrons"),
                icon: this.sortIcon("omicrons"),
                value: "omicrons",
                click: () => {
                  this.sortBy("omicrons");
                },
              },
              {
                label: "Speed",
                show: this.showCol("speed"),
                icon: this.sortIcon("speed"),
                value: "speed",
                click: () => {
                  this.sortBy("speed");
                },
              },
              {
                label: "Speed (Mods)",
                show: this.showCol("speedMods"),
                icon: this.sortIcon("speedMods"),
                value: "speedMods",
                click: () => {
                  this.sortBy("speedMods");
                },
              },
              {
                label: "Physical Offense",
                show: this.showCol("physicalOffense"),
                icon: this.sortIcon("physicalOffense"),
                value: "physicalOffense",
                click: () => {
                  this.sortBy("physicalOffense");
                },
              },
              {
                label: "Special Offense",
                show: this.showCol("specialOffense"),
                icon: this.sortIcon("specialOffense"),
                value: "specialOffense",
                click: () => {
                  this.sortBy("specialOffense");
                },
              },
              {
                label: "Protection",
                show: this.showCol("protection"),
                icon: this.sortIcon("protection"),
                value: "protection",
                click: () => {
                  this.sortBy("protection");
                },
              },
              {
                label: "Health",
                show: this.showCol("health"),
                icon: this.sortIcon("health"),
                value: "health",
                click: () => {
                  this.sortBy("health");
                },
              },
              {
                label: "Tenacity",
                show: this.showCol("tenacity"),
                icon: this.sortIcon("tenacity"),
                value: "tenacity",
                click: () => {
                  this.sortBy("tenacity");
                },
              },
              {
                label: "Potency",
                show: this.showCol("potency"),
                icon: this.sortIcon("potency"),
                value: "potency",
                click: () => {
                  this.sortBy("potency");
                },
              },
              {
                label: "Physical Crit Chance",
                show: this.showCol("physicalCrit"),
                icon: this.sortIcon("physicalCrit"),
                value: "physicalCrit",
                click: () => {
                  this.sortBy("physicalCrit");
                },
              },
              {
                label: "Special Crit Chance",
                show: this.showCol("specialCrit"),
                icon: this.sortIcon("specialCrit"),
                value: "specialCrit",
                click: () => {
                  this.sortBy("specialCrit");
                },
              },
              {
                label: "Crit Damage",
                show: this.showCol("critDamage"),
                icon: this.sortIcon("critDamage"),
                value: "critDamage",
                click: () => {
                  this.sortBy("critDamage");
                },
              },
              {
                label: "Armor",
                show: this.showCol("armor"),
                icon: this.sortIcon("armor"),
                value: "armor",
                click: () => {
                  this.sortBy("armor");
                },
              },
              {
                label: "Resistance",
                show: this.showCol("resistance"),
                icon: this.sortIcon("resistance"),
                value: "resistance",
                click: () => {
                  this.sortBy("resistance");
                },
              },
              {
                label: "Has Ult?",
                show: this.showCol("ultimate"),
                icon: this.sortIcon("ultimate"),
                value: "ultimate",
                click: () => {
                  this.sortBy("ultimate");
                },
              },
            ],
          },
        ],
      };
    },
    body(): iTableBody {
      return {
        classes: "align-middle text-center",
        rows: this.players.map((player: any) => {
          return {
            cells: [
              {
                show: this.showCol("allyCode"),
                data: player.allyCode,
                label: "Ally Code:",
              },
              {
                show: this.showCol("name"),
                data: player.name,
                label: "Player Name:",
              },
              {
                show: this.showCol("stars"),
                data: player.stars,
                label: "Stars:",
              },
              {
                show: this.showCol("gearLevel"),
                data: player.gearLevel,
                label: "Gear Level:",
              },
              {
                show: this.showCol("relicLevel"),
                data: player.relicLevel,
                label: "Relic Level:",
              },
              {
                show: this.showCol("zetas"),
                data: player.zetas,
                label: "Zetas:",
              },
              {
                show: this.showCol("omicrons"),
                data: player.omicrons,
                label: "Omicrons:",
              },
              {
                show: this.showCol("speed"),
                data: player.speed,
                label: "Speed:",
              },
              {
                show: this.showCol("speedMods"),
                data: player.speedMod,
                label: "Speed (Mods):",
              },
              {
                show: this.showCol("physicalOffense"),
                data: player.physicalOffense,
                label: "Physical Offense:",
              },
              {
                show: this.showCol("specialOffense"),
                data: player.specialOffense,
                label: "Special Offense:",
              },
              {
                show: this.showCol("protection"),
                data: player.protection,
                label: "Protection:",
              },
              {
                show: this.showCol("health"),
                data: player.health,
                label: "Health:",
              },
              {
                show: this.showCol("tenacity"),
                data: player.tenacity,
                label: "Tenacity:",
              },
              {
                show: this.showCol("potency"),
                data: player.potency,
                label: "Potency:",
              },
              {
                show: this.showCol("physicalCrit"),
                data: player.physicalCrit,
                label: "Physical Crit Chance:",
              },
              {
                show: this.showCol("specialCrit"),
                data: player.specialCrit,
                label: "Special Crit Chance:",
              },
              {
                show: this.showCol("critDamage"),
                data: player.critDamage,
                label: "Crit Damage:",
              },
              {
                show: this.showCol("armor"),
                data: player.armor,
                label: "Armor:",
              },
              {
                show: this.showCol("resistance"),
                data: player.resistance,
                label: "Resistance:",
              },
              {
                show: this.showCol("ultimate"),
                data: player.ultimate ? "Yes" : "No",
                label: "Has Ult:",
              },
            ],
          };
        }),
      };
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
