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
          <ul class="nav nav-tabs" role="tablist">
            <li class="nav-item" role="presentation">
              <button
                class="nav-link active"
                data-bs-toggle="tab"
                data-bs-target="#phase1"
                type="button"
                role="tab"
              >
                Phase 1
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#phase2"
                type="button"
                role="tab"
              >
                Phase 2
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#phase3"
                type="button"
                role="tab"
              >
                Phase 3
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#phase4"
                type="button"
                role="tab"
              >
                Phase 4
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#phase5"
                type="button"
                role="tab"
              >
                Phase 5
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#phase6"
                type="button"
                role="tab"
              >
                Phase 6
              </button>
            </li>
          </ul>
          <div class="tab-content">
            <div class="tab-pane fade show active" id="phase1" role="tabpanel">
              <SwgohTable :table="{ header, body: getTableBody(1) }" />
            </div>
            <div class="tab-pane fade" id="phase2" role="tabpanel">
              <SwgohTable :table="{ header, body: getTableBody(2) }" />
            </div>
            <div class="tab-pane fade" id="phase3" role="tabpanel">
              <SwgohTable :table="{ header, body: getTableBody(3) }" />
            </div>
            <div class="tab-pane fade" id="phase4" role="tabpanel">
              <SwgohTable :table="{ header, body: getTableBody(4) }" />
            </div>
            <div class="tab-pane fade" id="phase5" role="tabpanel">
              Phase 5 Platoons Under construction
            </div>
            <div class="tab-pane fade" id="phase6" role="tabpanel">
              Phase 6 Platoons Under construction
            </div>
          </div>
        </Loading>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import { defineComponent, Ref, ref } from "vue";
import { mapActions, mapState } from "vuex";

import { loadingState } from "types/loading";
import { apiClient } from "../../api/api-client";
import { maxRelicLevel } from "types/relic";
import { iHeaderCell, iTableBody, iTableCell, iTableHead } from "types/general";
import platoonData from "resources/tbPlatoons";
import { setupColumnEvents, setupSorting, sortValues } from "utils";
import { iGoalPlayer } from "types/goals";

interface dataModel {
  loading: loadingState;
}

const storageKey = "TBPlatoons";

export default defineComponent({
  name: "TBPlatoons",
  setup(_props) {
    const { sortDir, sortMethod, sortBy, sortIcon, searchText } =
      setupSorting(storageKey);

    const selectedColumns: Ref<string[]> = ref([]);
    const { showCol } = setupColumnEvents(selectedColumns);

    return {
      sortDir,
      sortMethod,
      sortBy,
      sortIcon,
      selectedColumns,
      showCol,
      searchText,
    };
  },
  data() {
    return {
      loading: loadingState.initial,
    } as dataModel;
  },
  computed: {
    ...mapState("guild", ["guildId", "players"]),
    fetchGuildId(): string {
      return this.guildId || this.$route.params.guildId;
    },
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
                label: "Unit",
                show: true, //this.showCol("unit"),
                icon: this.sortIcon("unit"),
                input: {
                  type: "input",
                  classes: "mx-auto my-1 w-75",
                  placeholder: "Search",
                  change: (val: string) => {
                    this.searchText = val;
                  },
                  value: this.searchText,
                  click: () => {
                    this.sortBy("unit");
                  },
                },
              },
              {
                label: "Requirements",
                show: true, //this.showCol("requirements"),
                icon: this.sortIcon("total"),
                click: () => {
                  this.sortBy("total");
                },
              },
              {
                label: "Players",
                show: true, //this.showCol("requirements"),
              },
              {
                label: "Coverage",
                show: true, //this.showCol("requirements"),
                icon: this.sortIcon("coverage"),
                click: () => {
                  this.sortBy("coverage");
                },
              },
              {
                label: "Redundancy",
                show: true, //this.showCol("requirements"),
                icon: this.sortIcon("redundancy"),
                click: () => {
                  this.sortBy("redundancy");
                },
              },
              {
                label: "Difficulty",
                show: true, //this.showCol("requirements"),
                icon: this.sortIcon("difficulty"),
                click: () => {
                  this.sortBy("difficulty");
                },
              },
            ],
          },
        ],
      };
    },
  },
  methods: {
    ...mapActions("guild", ["fetchGuildUnitData"]),
    getTableBody(phase: number): iTableBody {
      const phaseData = platoonData.find((x) => x.phase === phase);
      if (phaseData) {
        const characterList = [
          ...phaseData.characters.darkside.map((x) => {
            return { ...x, alignment: "Dark Side" };
          }),
          ...phaseData.characters.mixed.map((x) => {
            return { ...x, alignment: "Mixed" };
          }),
          ...phaseData.characters.lightside.map((x) => {
            return { ...x, alignment: "Light Side" };
          }),
        ];
        const shipsList = [
          ...phaseData.ships.darkside.map((x) => {
            return { ...x, alignment: "Dark Side", isShip: true };
          }),
          ...phaseData.ships.mixed.map((x) => {
            return { ...x, alignment: "Mixed", isShip: true };
          }),
          ...phaseData.ships.lightside.map((x) => {
            return { ...x, alignment: "Light Side", isShip: true };
          }),
        ];
        const fullList = [...characterList, ...shipsList]
          .reduce((acc: any[], char: any) => {
            const exists: any = acc.find((x: any) => x.id === char.id);
            if (exists) {
              exists[char.alignment] = exists[char.alignment] ?? 0;
              exists[char.alignment] += char.amount;
              exists.total += char.amount;
            } else {
              const requirement = char.isShip
                ? phaseData.ships.requirement
                : phaseData.characters.requirement;
              const playerList = this.getPlayerList(char.id, requirement);

              acc.push({
                ...char,
                [char.alignment]: char.amount,
                total: char.amount,
                players: playerList.map((x) => x.name),
                requirement,
              });
            }
            return acc;
          }, [])
          .sort((a, b) => {
            if (this.sortMethod === "coverage") {
              return sortValues(
                a.players.length,
                b.players.length,
                this.sortDir,
                this.sortMethod
              );
            } else if (this.sortMethod === "redundancy") {
              return sortValues(
                Math.max(a.players.length - a.total, 0),
                Math.max(b.players.length - b.total, 0),
                this.sortDir,
                this.sortMethod
              );
            }
            return sortValues(a, b, this.sortDir, this.sortMethod);
          });
        return {
          classes: "align-middle text-center",
          rows: fullList.map((char) => {
            return {
              cells: [
                {
                  show: true,
                  type: "unit",
                  classes: "align-middle",
                  data: {
                    id: char.id,
                    isLink: false,
                    type: char.requirement.type,
                    level: char.requirement.amount,
                  },
                },
                {
                  show: true,
                  type: "list",
                  data: {
                    classes: "text-left",
                    list: [
                      {
                        message: `Dark Side: ${char["Dark Side"]}`,
                        hidden: !char["Dark Side"],
                      },
                      {
                        message: `Mixed: ${char["Mixed"]}`,
                        hidden: !char["Mixed"],
                      },
                      {
                        message: `Light Side: ${char["Light Side"]}`,
                        hidden: !char["Light Side"],
                      },
                      { message: `Total: ${char.total}` },
                    ],
                  },
                },
                {
                  show: true,
                  type: "list",
                  data: {
                    classes: "mb-0 text-left player-list",
                    list: char.players.map((x) => {
                      return { message: x, id: x };
                    }),
                  },
                },
                {
                  show: true,
                  data: {
                    message: `Completed: ${char.players.length}`,
                    classes:
                      char.players.length < char.total
                        ? "text-danger"
                        : "text-success",
                  },
                },
                {
                  show: true,
                  data: {
                    classes:
                      char.players.length < char.total + 3
                        ? "text-warning"
                        : "text-success",

                    message: `Redundant Coverage: ${Math.max(
                      char.players.length - char.total,
                      0
                    )}`,
                  },
                },
                {
                  show: true,
                  data: {
                    message: char.difficulty,
                  },
                },
              ],
            };
          }),
        };
      } else {
        return { rows: [] };
      }
    },
    getPlayerList(
      unitId: string,
      requirement: { amount: number; type: string }
    ) {
      return this.players
        .reduce((list: iGoalPlayer[], player: iGoalPlayer) => {
          const match = player.units.find((x) => x.base_id === unitId);
          if (match) {
            if (requirement.type === "Stars") {
              if (match.stars >= requirement.amount) {
                list.push(player);
              }
            } else if (requirement.type === "Relic") {
              if (match.relic_tier >= requirement.amount) {
                list.push(player);
              }
            }
          }
          return list;
        }, [])
        .sort((a, b) => a.name.localeCompare(b.name));
    },
  },
  async created() {
    this.loading = loadingState.loading;
    await this.fetchGuildUnitData({
      guildId: this.fetchGuildId,
      unitId: platoonData.reduce((ids: string[], el) => {
        el.characters.darkside.forEach((c) => {
          const exists = ids.some((i) => i === c.id);
          if (!exists) {
            ids.push(c.id);
          }
        });
        el.ships.darkside.forEach((c) => {
          const exists = ids.some((i) => i === c.id);
          if (!exists) {
            ids.push(c.id);
          }
        });
        el.characters.mixed.forEach((c) => {
          const exists = ids.some((i) => i === c.id);
          if (!exists) {
            ids.push(c.id);
          }
        });
        el.ships.mixed.forEach((c) => {
          const exists = ids.some((i) => i === c.id);
          if (!exists) {
            ids.push(c.id);
          }
        });
        el.characters.lightside.forEach((c) => {
          const exists = ids.some((i) => i === c.id);
          if (!exists) {
            ids.push(c.id);
          }
        });
        el.ships.lightside.forEach((c) => {
          const exists = ids.some((i) => i === c.id);
          if (!exists) {
            ids.push(c.id);
          }
        });
        return ids;
      }, []),
    });
    this.loading = loadingState.ready;
  },
});
</script>

<style lang="scss" scoped>
:deep(.player-list) {
  overflow: scroll;
  max-height: 300px;
}
</style>
