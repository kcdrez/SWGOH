<template>
  <div class="container swgoh-page mb-3">
    <template v-if="$route.params.guildId">
      <div class="input-group input-group-sm">
        <span class="input-group-text">Select a Unit to view Guild Data:</span>
        <UnitSearch @select="selectUnit($event)" />
      </div>
      <Loading
        :state="loading"
        message="Loading Guild's Unit Data"
        size="lg"
        displayText="Please wait...This may take a few minutes."
      >
        <template v-if="data">
          <ExpandableSection
            title="Player Data"
            idRef="guildPlayerData"
            :options="expandOptions"
            class="mt-2"
          >
            <SwgohTable :table="{ header, body }" />
          </ExpandableSection>
        </template>
      </Loading>
    </template>
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
                name: 'GuildUnitsPage',
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
import { Ref, defineComponent, ref } from "vue";
import { mapActions, mapGetters } from "vuex";
import { writeFile, utils } from "xlsx";
import _ from "lodash";

import { loadingState } from "types/loading";
import { setupColumnEvents, setupSorting, unvue } from "utils";
import { Unit } from "types/unit";
import { IGuildUnitMap, IUnitOwned } from "types/guild";
import UnitSearch from "components/units/unitSearch.vue";
import { iHeaderCell, iHeaderRow, iTableBody, iTableHead } from "types/general";
import { iExpandOptions } from "types/general";

const storageKey = "guildUnits";

interface dataModel {
  selected: null | Unit;
  data: IGuildUnitMap | null;
  loading: loadingState;
  selectedColumns: string[];
  storageKey: string;
  unit: null | Unit;
  guildIdInput: string;
}

export default defineComponent({
  name: "GuildUnitsPage",
  setup() {
    const { sortDir, sortMethod, sortBy, sortIcon } = setupSorting(storageKey);

    const selectedColumns: Ref<string[]> = ref([]);
    const { showCol } = setupColumnEvents(selectedColumns);

    return {
      sortDir,
      sortMethod,
      sortBy,
      sortIcon,
      showCol,
      selectedColumns,
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
      unit: null,
      guildIdInput: "",
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
                show: this.showCol("gearLevel") && !this.unit?.isShip,
                icon: this.sortIcon("gearLevel"),
                value: "gearLevel",
                showOption: !this.unit?.isShip,
                click: () => {
                  this.sortBy("gearLevel");
                },
              },
              {
                label: "Relic Level",
                show: this.showCol("relicLevel") && !this.unit?.isShip,
                icon: this.sortIcon("relicLevel"),
                value: "relicLevel",
                showOption: !this.unit?.isShip,
                click: () => {
                  this.sortBy("relicLevel");
                },
              },
              {
                label: "Zetas",
                show: this.showCol("zetas") && !this.unit?.isShip,
                icon: this.sortIcon("zetas"),
                value: "zetas",
                showOption: !this.unit?.isShip,
                click: () => {
                  this.sortBy("zetas");
                },
              },
              {
                label: "Omicrons",
                show:
                  this.showCol("omicrons") &&
                  this.unit?.hasOmicronAbilities("Territory Wars"),
                icon: this.sortIcon("omicrons"),
                value: "omicrons",
                showOption: this.unit?.hasOmicronAbilities("Territory Wars"),
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
                show: this.showCol("speedMods") && !this.unit?.isShip,
                showOption: !this.unit?.isShip,
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
                show: this.showCol("ultimate") && (this.unit?.isGL ?? false),
                showOption: this.unit?.isGL,
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
        rows: this.players.map((player: IUnitOwned) => {
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
                data: player?.stars ?? "-",
                label: "Stars:",
              },
              {
                show: this.showCol("gearLevel") && (!this.unit?.isShip ?? true),
                data: player?.gearLevel ?? "-",
                label: "Gear Level:",
              },
              {
                show:
                  this.showCol("relicLevel") && (!this.unit?.isShip ?? true),
                data: player?.relicLevel ?? "-",
                label: "Relic Level:",
              },
              {
                show: this.showCol("zetas") && (!this.unit?.isShip ?? true),
                data: player?.zetas ?? "-",
                label: "Zetas:",
              },
              {
                show:
                  this.showCol("omicrons") &&
                  (this.unit?.hasOmicronAbilities("Territory Wars") ?? false),
                data: player?.omicrons ?? "-",
                label: "Omicrons:",
              },
              {
                show: this.showCol("speed"),
                data: player?.speed ?? "-",
                label: "Speed:",
              },
              {
                show: this.showCol("speedMods") && (!this.unit?.isShip ?? true),
                data: player?.speedMod ?? "-",
                label: "Speed (Mods):",
              },
              {
                show: this.showCol("physicalOffense"),
                data: player.physicalOffense ?? "-",
                label: "Physical Offense:",
              },
              {
                show: this.showCol("specialOffense"),
                data: player?.specialOffense ?? "-",
                label: "Special Offense:",
              },
              {
                show: this.showCol("protection"),
                data: player?.protection ?? "-",
                label: "Protection:",
              },
              {
                show: this.showCol("health"),
                data: player?.health ?? "-",
                label: "Health:",
              },
              {
                show: this.showCol("tenacity"),
                data: player?.tenacity ?? "-",
                label: "Tenacity:",
              },
              {
                show: this.showCol("potency"),
                data: player?.potency ?? "-",
                label: "Potency:",
              },
              {
                show: this.showCol("physicalCrit"),
                data: player?.physicalCrit ?? "-",
                label: "Physical Crit Chance:",
              },
              {
                show: this.showCol("specialCrit"),
                data: player?.specialCrit ?? "-",
                label: "Special Crit Chance:",
              },
              {
                show: this.showCol("critDamage"),
                data: player?.critDamage ?? "-",
                label: "Crit Damage:",
              },
              {
                show: this.showCol("armor"),
                data: player?.armor ?? "-",
                label: "Armor:",
              },
              {
                show: this.showCol("resistance"),
                data: player?.resistance ?? "-",
                label: "Resistance:",
              },
              {
                show: this.showCol("ultimate") && (this.unit?.isGL ?? false),
                data: player?.ultimate ? "Yes" : "No",
                label: "Has Ult:",
              },
            ],
          };
        }),
      };
    },
    cols(): { label: string; value: string }[] {
      return this.header.headers.reduce(
        (acc: { label: string; value: string }[], row: iHeaderRow) => {
          row.cells.forEach((cell: iHeaderCell) =>
            acc.push({ label: cell.label, value: cell.value })
          );
          return acc;
        },
        []
      );
    },
    players(): IUnitOwned[] {
      const list: IUnitOwned[] = [
        ...(this.data?.owned ?? []),
        ...(this.data?.unowned ?? []),
      ];

      return list.sort((a, b) => {
        if (this.sortMethod === "name") {
          const compareA = a.name.toLowerCase();
          const compareB = b.name.toLowerCase();
          if (this.sortDir === "asc") {
            return compareA > compareB ? 1 : -1;
          } else {
            return compareA > compareB ? -1 : 1;
          }
        } else {
          const compareA = (a as IUnitOwned)[this.sortMethod];
          const compareB = (b as IUnitOwned)[this.sortMethod];
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
    expandOptions(): iExpandOptions {
      return {
        multiSelect: {
          options: this.cols,
          change: (newVal: string[]) => {
            this.selectedColumns = newVal;
          },
        },
        buttons: [
          {
            classes:
              "fas fa-download mx-2 c-pointer p-1 border rounded bg-primary",
            title: "Download data as an xlsx file",
            click: () => {
              this.downloadXlsx();
            },
          },
        ],
      };
    },
  },
  methods: {
    ...mapActions("guild", ["fetchGuildUnitData"]),
    selectUnit: _.debounce(async function (this: any, unit: null | Unit) {
      if (unit && unit.id) {
        this.loading = loadingState.loading;
        this.unit = unit;
        this.data = await this.fetchGuildUnitData({
          unitId: unit.id,
          guildId: this.$route.params.guildId,
        });
        this.loading = loadingState.ready;
      }
    }, 500),
    downloadXlsx(): void {
      const rows: IUnitOwned[] = unvue(this.players);
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

      const fileName = this.unit?.id;
      writeFile(wb, fileName + ".xlsx");
    },
  },
});
</script>

<style lang="scss" scoped></style>
