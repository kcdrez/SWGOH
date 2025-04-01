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
          <div>
            <MultiSelect
              class="select-columns"
              :options="playerOptions"
              storageKey="platoonsExcludePlayers"
              label="Exclude Players"
              @checked="excludePlayers = $event"
            />
          </div>
          <ul class="nav nav-tabs nav-justified" role="tablist">
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
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#zeffo"
                type="button"
                role="tab"
              >
                Zeffo
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#mandalore"
                type="button"
                role="tab"
              >
                Mandalore
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#linchpins"
                type="button"
                role="tab"
              >
                Linchpins
              </button>
            </li>
            <!-- <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#playerPlatoons"
                type="button"
                role="tab"
              >
                Players Overview
              </button>
            </li> -->
          </ul>
          <div class="tab-content">
            <div class="tab-pane fade show active" id="phase1" role="tabpanel">
              <PlatoonsTable :phase="1" :excludedPlayers="excludePlayers" />
            </div>
            <div class="tab-pane fade" id="phase2" role="tabpanel">
              <PlatoonsTable :phase="2" :excludedPlayers="excludePlayers" />
            </div>
            <div class="tab-pane fade" id="phase3" role="tabpanel">
              <PlatoonsTable :phase="3" :excludedPlayers="excludePlayers" />
            </div>
            <div class="tab-pane fade" id="phase4" role="tabpanel">
              <PlatoonsTable :phase="4" :excludedPlayers="excludePlayers" />
            </div>
            <div class="tab-pane fade" id="phase5" role="tabpanel">
              <PlatoonsTable :phase="5" :excludedPlayers="excludePlayers" />
            </div>
            <div class="tab-pane fade" id="phase6" role="tabpanel">
              <PlatoonsTable :phase="6" :excludedPlayers="excludePlayers" />
            </div>
            <div class="tab-pane fade" id="zeffo" role="tabpanel">
              <PlatoonsTable phase="zeffo" :excludedPlayers="excludePlayers" />
            </div>
            <div class="tab-pane fade" id="mandalore" role="tabpanel">
              <PlatoonsTable
                phase="mandalore"
                :excludedPlayers="excludePlayers"
              />
            </div>
            <div class="tab-pane fade" id="linchpins" role="tabpanel">
              <LinchpinTable :playerData="playerData" />
              <!-- <SwgohTable
                :table="{ header: linchpinHeader, body: linchpinBody }"
              /> -->
            </div>
            <!-- <div class="tab-pane fade" id="playerPlatoons" role="tabpanel">
              <SwgohTable :table="{ header, body }" />
            </div> -->
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

import { loadingState } from "types/loading";
import { iTableBody, iTableHead } from "types/general";
import {
  platoonData,
  PlatoonCharacter,
  PlatoonData,
} from "resources/tbPlatoons";
import { setupSorting, sortValues } from "utils";
import { iGoalPlayer, iGoalUnit } from "types/goals";
import PlatoonsTable from "components/guild/platoonsTable.vue";
import LinchpinTable from "components/guild/linchpinTable.vue";

interface dataModel {
  loading: loadingState;
  excludePlayers: string[];
}

const storageKey = "TBPlatoons";

export default defineComponent({
  name: "TBPlatoons",
  components: {
    PlatoonsTable,
    LinchpinTable,
  },
  setup(_props) {
    const { sortDir, sortMethod, sortBy, sortIcon, searchText } =
      setupSorting(storageKey);

    return {
      sortDir,
      sortMethod,
      sortBy,
      sortIcon,
      searchText,
    };
  },
  data() {
    return {
      loading: loadingState.initial,
      excludePlayers: [],
    } as dataModel;
  },
  computed: {
    ...mapState("guild", ["guildId", "players"]),
    fetchGuildId(): string {
      return this.guildId || this.$route.params.guildId;
    },
    header(): iTableHead {
      return {
        headers: [
          {
            cells: [
              {
                label: "Player",
                show: true,
                icon: this.sortIcon("player"),
                input: {
                  type: "input",
                  classes: "mx-auto my-1 w-75",
                  placeholder: "Search",
                  change: (val: string) => {
                    this.searchText = val;
                  },
                  value: this.searchText,
                  click: () => {
                    this.sortBy("player");
                  },
                },
              },
              {
                label: "Phase 1",
                show: true,
                icon: this.sortIcon("phase1"),
                click: () => {
                  this.sortBy("phase1");
                },
              },
              {
                label: "Phase 2",
                show: true,
                icon: this.sortIcon("phase2"),
                click: () => {
                  this.sortBy("phase2");
                },
              },
              {
                label: "Phase 3",
                show: true,
                icon: this.sortIcon("phase3"),
                click: () => {
                  this.sortBy("phase3");
                },
              },
              {
                label: "Phase 4",
                show: true,
                icon: this.sortIcon("phase4"),
                click: () => {
                  this.sortBy("phase4");
                },
              },
              {
                label: "Phase 5",
                show: true,
                icon: this.sortIcon("phase5"),
                click: () => {
                  this.sortBy("phase5");
                },
              },
              {
                label: "Phase 6",
                show: true,
                icon: this.sortIcon("phase6"),
                click: () => {
                  this.sortBy("phase6");
                },
              },
              {
                label: "Total",
                show: true,
                icon: this.sortIcon("total"),
                click: () => {
                  this.sortBy("total");
                },
              },
            ],
          },
        ],
      };
    },
    body(): iTableBody {
      const filteredData = this.playerData.filter((player) => {
        const name = player.name.toLowerCase().replace(/\s/g, "");
        const compare = this.searchText.toLowerCase().replace(/\s/g, "");
        return name.includes(compare);
      });

      return {
        classes: "align-middle text-center",
        rows: filteredData.map((player: any) => {
          return {
            cells: [
              {
                show: true,
                data: player.name,
              },
              {
                show: true,
                label: "Phase 1 Platoons:",
                data: {
                  classes: "c-pointer",
                  label: player.phaseMapping.phase1.length,
                  popover: {
                    hover: true,
                    arrow: true,
                    placement: "right",
                    list: player.phaseMapping.phase1.map((x: any) => {
                      return { type: "text", label: x.name, id: x.id };
                    }),
                  },
                },
              },
              {
                show: true,
                label: "Phase 2 Platoons:",
                data: {
                  classes: "c-pointer",
                  label: player.phaseMapping.phase2.length,
                  popover: {
                    hover: true,
                    arrow: true,
                    placement: "right",
                    list: player.phaseMapping.phase2.map((x: any) => {
                      return { type: "text", label: x.name, id: x.id };
                    }),
                  },
                },
              },
              {
                show: true,
                label: "Phase 3 Platoons:",
                data: {
                  classes: "c-pointer",
                  label: player.phaseMapping.phase3.length,
                  popover: {
                    hover: true,
                    arrow: true,
                    placement: "right",
                    list: player.phaseMapping.phase3.map((x: any) => {
                      return { type: "text", label: x.name, id: x.id };
                    }),
                  },
                },
              },
              {
                show: true,
                label: "Phase 4 Platoons:",
                data: {
                  classes: "c-pointer",
                  label: player.phaseMapping.phase4.length,
                  popover: {
                    hover: true,
                    arrow: true,
                    placement: "right",
                    list: player.phaseMapping.phase4.map((x: any) => {
                      return { type: "text", label: x.name, id: x.id };
                    }),
                  },
                },
              },
              {
                show: true,
                label: "Phase 5 Platoons:",
                data: {
                  classes: "c-pointer",
                  label: player.phaseMapping.phase5.length,
                  popover: {
                    hover: true,
                    arrow: true,
                    placement: "right",
                    list: player.phaseMapping.phase5.map((x: any) => {
                      return { type: "text", label: x.name, id: x.id };
                    }),
                  },
                },
              },
              {
                show: true,
                label: "Phase 6 Platoons:",
                data: {
                  classes: "c-pointer",
                  label: player.phaseMapping.phase6.length,
                  popover: {
                    hover: true,
                    arrow: true,
                    placement: "right",
                    list: player.phaseMapping.phase6.map((x: any) => {
                      return { type: "text", label: x.name, id: x.id };
                    }),
                  },
                },
              },
              {
                show: true,
                label: "Total Platoons:",
                data: {
                  classes: "",
                  message: player.phaseMapping.total,
                },
              },
            ],
          };
        }),
      };
    },
    playerData(): { name: string; units: iGoalUnit[]; phaseMapping: any }[] {
      return this.players
        .map((player: iGoalPlayer) => {
          return {
            name: player.name,
            units: player.units,
            phaseMapping: this.phaseAvailablePlatoons(player),
          };
        })
        .sort((a: any, b: any) => {
          if (this.sortMethod === "player") {
            return sortValues(a.name, b.name, this.sortDir, this.sortMethod);
          } else {
            if (this.sortMethod === "total") {
              return sortValues(
                a.phaseMapping.total,
                b.phaseMapping.total,
                this.sortDir,
                this.sortMethod
              );
            } else if (this.sortMethod in a.phaseMapping) {
              return sortValues(
                a.phaseMapping[this.sortMethod].length,
                b.phaseMapping[this.sortMethod].length,
                this.sortDir,
                this.sortMethod
              );
            }
          }
          return 0;
        });
    },
    playerOptions(): any[] {
      return this.players
        .map((player: iGoalPlayer) => {
          return {
            label: player.name,
            value: player.name,
          };
        })
        .sort((a, b) => {
          return sortValues(a.label, b.label, "asc");
        });
    },
  },
  methods: {
    ...mapActions("guild", ["fetchGuildUnitData"]),
    phaseAvailablePlatoons(player: iGoalPlayer) {
      const phaseData = {
        phase1: [],
        phase2: [],
        phase3: [],
        phase4: [],
        phase5: [],
        phase6: [],
        phasezeffo: [],
        phasemandalore: [],
        total: 0,
      };

      platoonData.forEach((phase) => {
        processData(phase.characters?.darkside ?? [], phase);
        processData(phase.characters?.mixed ?? [], phase);
        processData(phase.characters?.lightside ?? [], phase);
        processData(phase.ships?.darkside ?? [], phase);
        processData(phase.ships?.mixed ?? [], phase);
        processData(phase.ships?.lightside ?? [], phase);

        phaseData[`phase${phase.phase}`].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      });

      function processData(
        characterList: PlatoonCharacter[],
        phase: PlatoonData
      ) {
        characterList.forEach((character) => {
          const match = player.units.find((x) => x.base_id === character.id);
          if (match) {
            const exists = phaseData[`phase${phase.phase}`].some(
              (x) => x.base_id === match.base_id
            );
            if (!exists) {
              const { requirement } = phase.characters;
              if (requirement.type === "Relic") {
                if (match.relic_tier >= requirement.amount) {
                  phaseData[`phase${phase.phase}`].push(match);
                  phaseData.total++;
                }
              } else if (requirement.type === "Stars") {
                if (match.stars >= requirement.amount) {
                  phaseData[`phase${phase.phase}`].push(match);
                  phaseData.total++;
                }
              }
            }
          }
        });
      }
      return phaseData;
    },
  },
  async created() {
    try {
      this.loading = loadingState.loading;
      await this.fetchGuildUnitData({
        guildId: this.fetchGuildId,
      });
      this.loading = loadingState.ready;
    } catch (err) {
      this.loading = loadingState.error;
      console.error(err);
    }
  },
});
</script>

<style lang="scss" scoped>
:deep(.popper) {
  overflow: scroll;
  max-height: 300px;
}
</style>
