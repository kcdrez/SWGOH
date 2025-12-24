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
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#needs"
                type="button"
                role="tab"
              >
                Guild Needs
              </button>
            </li>
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
            </div>
            <div class="tab-pane fade" id="needs" role="tabpanel">
              <div
                class="btn-group btn-group-sm text-center mt-1 d-block"
                role="group"
              >
                <button class="btn btn-primary" @click="generateGuildNeeds()">
                  Generate Report
                </button>
                <button
                  @click="copyResults"
                  v-if="results"
                  class="btn btn-secondary"
                >
                  Copy Results
                </button>
              </div>
              <h3>Ignore Phase Rules</h3>
              <div class="row mb-2 small">
                <div class="col-2">Phase</div>
                <div class="col">Ignored Sides</div>
              </div>
              <div
                v-for="toggle in ignoreToggles"
                :key="toggle.phase"
                class="row align-items-center mb-2"
              >
                <!-- Phase label -->
                <div class="col-2 fw-bold">Phase {{ toggle.phase }}</div>

                <!-- Checkboxes -->
                <div class="col">
                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="toggle.darkside"
                      :id="`ignore-${toggle.phase}-dark`"
                    />
                    <label
                      class="form-check-label"
                      :for="`ignore-${toggle.phase}-dark`"
                    >
                      Dark
                    </label>
                  </div>

                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="toggle.lightside"
                      :id="`ignore-${toggle.phase}-light`"
                    />
                    <label
                      class="form-check-label"
                      :for="`ignore-${toggle.phase}-light`"
                    >
                      Light
                    </label>
                  </div>

                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="toggle.mixed"
                      :id="`ignore-${toggle.phase}-mixed`"
                    />
                    <label
                      class="form-check-label"
                      :for="`ignore-${toggle.phase}-mixed`"
                    >
                      Mixed
                    </label>
                  </div>
                </div>
              </div>
              <hr />
              <h3>Demotion Rules</h3>
              <!-- Header -->
              <div class="row mb-2 small">
                <div class="col-2">Phase</div>
                <div class="col-2">Owned</div>
                <div class="col">Sides</div>
                <div class="col-auto"></div>
              </div>

              <!-- Rules -->
              <div
                v-for="(rule, i) in demotionToggles"
                :key="i"
                class="row align-items-center mb-2"
              >
                <!-- Phase -->
                <div class="col-2">
                  <select
                    class="form-control form-control-sm"
                    v-model.number="rule.phase"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="zeffo">Zeffo</option>
                    <option value="mandalore">Mandalore</option>
                  </select>
                </div>

                <!-- Owned threshold -->
                <div class="col-2">
                  <div class="input-group input-group-sm">
                    <span class="input-group-text">≥</span>
                    <input
                      type="number"
                      class="form-control"
                      v-model.number="rule.ownedAtLeast"
                      min="0"
                    />
                  </div>
                </div>

                <!-- Sides -->
                <div class="col">
                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value="darkside"
                      v-model="rule.sides"
                      :id="`demote-${i}-dark`"
                    />
                    <label class="form-check-label" :for="`demote-${i}-dark`">
                      Dark
                    </label>
                  </div>

                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value="lightside"
                      v-model="rule.sides"
                      :id="`demote-${i}-light`"
                    />
                    <label class="form-check-label" :for="`demote-${i}-light`">
                      Light
                    </label>
                  </div>

                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value="mixed"
                      v-model="rule.sides"
                      :id="`demote-${i}-mixed`"
                    />
                    <label class="form-check-label" :for="`demote-${i}-mixed`">
                      Mixed
                    </label>
                  </div>

                  <small
                    v-if="!rule.sides || rule.sides.length === 0"
                    class="text-muted ms-2"
                  >
                    (All sides)
                  </small>
                </div>

                <!-- Remove -->
                <div class="col-auto">
                  <button
                    class="btn btn-sm btn-danger"
                    title="Remove rule"
                    @click="demotionToggles.splice(i, 1)"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <!-- Add Rule -->
              <div class="mt-3">
                <button
                  class="btn btn-sm btn-primary"
                  @click="
                    demotionToggles.push({
                      phase: 1,
                      ownedAtLeast: 1,
                      sides: [],
                    })
                  "
                >
                  + Add rule
                </button>
              </div>

              <pre>{{ results }}</pre>
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
import { getUnit } from "types/unit";
import moment from "moment";

interface dataModel {
  loading: loadingState;
  excludePlayers: string[];
  results: string;
  ignoreToggles: IgnoreToggle[];
  demotionToggles: DemotionToggle[];
}

type NeedResult = {
  id: string;
  name?: string;
  phase: PlatoonData["phase"];
  amount: number;
  difficulty: number;
  eligibleCount: number;
  sides: Side[];
  relicRequired: number;
};

type AggregatedRequirement = PlatoonCharacter & {
  sides: Set<Side>;
};

type Side = "darkside" | "lightside" | "mixed";

type PlayerUnit = {
  base_id: string;
  relic_tier: number;
  gear_level: number;
  name: string;
};

type Player = {
  id: string;
  units: PlayerUnit[];
  name: string;
};

type IgnoreRule = {
  phase: number | "zeffo" | "mandalore";
  sides?: Side[]; // if omitted → ignore entire phase
};

type DemotionRule = {
  phase: number | "zeffo" | "mandalore";
  sides: Side[];
  ownedAtLeast: number;
};

type DemotionToggle = {
  phase: PlatoonData["phase"];
  ownedAtLeast: number;
  sides: Side[];
};

const ruleApplies = (result: NeedResult, rule: DemotionRule): boolean => {
  // Phase match
  if (result.phase !== rule.phase) {
    return false;
  }

  // Side match (if specified)
  if (rule.sides && !rule.sides.some((s) => result.sides.includes(s))) {
    return false;
  }

  // Owned threshold
  return result.eligibleCount >= rule.ownedAtLeast;
};

const applyDemotions = (
  results: {
    hard: NeedResult[];
    soft: NeedResult[];
    nice: NeedResult[];
  },
  rules: DemotionRule[]
) => {
  for (const rule of rules) {
    // HARD → SOFT
    for (let i = results.hard.length - 1; i >= 0; i--) {
      const item = results.hard[i];
      if (ruleApplies(item, rule)) {
        results.hard.splice(i, 1);
        results.soft.push(item);
      }
    }

    // SOFT → NICE
    for (let i = results.soft.length - 1; i >= 0; i--) {
      const item = results.soft[i];
      if (ruleApplies(item, rule)) {
        results.soft.splice(i, 1);
        results.nice.push(item);
      }
    }

    // NICE → REMOVED
    for (let i = results.nice.length - 1; i >= 0; i--) {
      const item = results.nice[i];
      if (ruleApplies(item, rule)) {
        results.nice.splice(i, 1);
      }
    }
  }
};

const shouldIgnoreSide = (
  phase: PlatoonData["phase"],
  side: Side,
  rules: IgnoreRule[]
): boolean => {
  for (const rule of rules) {
    if (rule.phase !== phase) continue;

    // Ignore entire phase
    if (!rule.sides) {
      return true;
    }

    if (rule.sides.includes(side)) {
      return true;
    }
  }

  return false;
};

const formatResults = (results: {
  hard: NeedResult[];
  soft: NeedResult[];
  nice: NeedResult[];
}) => {
  const lines: string[] = [
    `Last Updated ${moment().format("DD MMM YYYY")}`,
    "",
  ];

  const formatSection = (
    title: string,
    subtitle: string,
    items: NeedResult[]
  ) => {
    if (items.length === 0) return;
    lines.push(`** ${title} **`);
    lines.push(`${subtitle}`);
    for (const r of items) {
      lines.push(`- ${r.name ?? r.id} R${r.relicRequired}`);
    }
    lines.push(""); // extra newline between sections
  };

  formatSection(
    "Hard Need",
    "(We have a deficit of these characters and our star goals are struggling as a result)",
    results.hard
  );
  formatSection(
    "Soft Need",
    "(We have enough of these characters right now, but if someone leaves the guild or is on LOA then we may struggle to meet our star goals)",
    results.soft
  );
  formatSection(
    "Nice to Have",
    "(We have some extra coverage on these, but having some more backups wouldn't hurt)",
    results.nice
  );

  return lines.join("\n");
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers / non-secure contexts
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const success = document.execCommand("copy");
    document.body.removeChild(textarea);

    return success;
  }
};

type IgnoreToggle = {
  phase: PlatoonData["phase"];
  darkside: boolean;
  lightside: boolean;
  mixed: boolean;
};

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
      results: "",
      ignoreToggles: [
        { phase: 1, darkside: false, lightside: false, mixed: false },
        { phase: 2, darkside: false, lightside: false, mixed: false },
        { phase: 3, darkside: false, lightside: false, mixed: false },
        { phase: 4, darkside: true, lightside: false, mixed: false },
        { phase: 5, darkside: true, lightside: true, mixed: true },
        { phase: 6, darkside: true, lightside: true, mixed: true },
        { phase: "zeffo", darkside: false, lightside: false, mixed: false },
        { phase: "mandalore", darkside: false, lightside: false, mixed: false },
      ] as IgnoreToggle[],
      demotionToggles: [
        // {
        //   phase: 1,
        //   ownedAtLeast: 3,
        //   sides: ["darkside", "lightside"],
        // },
        // {
        //   phase: 3,
        //   ownedAtLeast: 2,
        //   sides: [],
        // },
        // {
        //   phase: 3,
        //   ownedAtLeast: 5,
        //   sides: [],
        // },
        // {
        //   phase: "zeffo",
        //   ownedAtLeast: 1,
        //   sides: [],
        // },
        {
          phase: 4,
          ownedAtLeast: 3,
          sides: ["mixed", "lightside"],
        },
      ] as DemotionToggle[],
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
    ignoreRules(): IgnoreRule[] {
      const rules: IgnoreRule[] = [];

      for (const toggle of this.ignoreToggles) {
        const sides: Side[] = [];

        if (toggle.darkside) sides.push("darkside");
        if (toggle.lightside) sides.push("lightside");
        if (toggle.mixed) sides.push("mixed");

        if (sides.length === 0) continue;

        // All sides checked → ignore entire phase
        if (sides.length === 3) {
          rules.push({ phase: toggle.phase });
        } else {
          rules.push({ phase: toggle.phase, sides });
        }
      }

      return rules;
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
    generateGuildNeeds() {
      const results = {
        hard: [] as NeedResult[],
        soft: [] as NeedResult[],
        nice: [] as NeedResult[],
      };

      for (const phase of platoonData) {
        const { characters } = phase;

        /**
         * Phase + requirement filtering
         */
        if (characters.requirement.type !== "Relic") {
          continue;
        }

        const relicRequired = characters.requirement.amount;

        /**
         * Build eligible relic counts (with +2 offset)
         */
        const relicCountByUnit = new Map<string, number>();

        const excluded = new Set(this.excludePlayers);

        for (const player of this.players as Player[]) {
          if (excluded.has(player.id)) continue;

          for (const unit of player.units) {
            if (unit.relic_tier >= relicRequired) {
              // Count eligible units
              relicCountByUnit.set(
                unit.base_id,
                (relicCountByUnit.get(unit.base_id) ?? 0) + 1
              );
            }
          }
        }

        /**
         * Aggregate requirements per unit across sides
         */
        const aggregatedRequirements = new Map<string, AggregatedRequirement>();

        const collect = (side: Side, list?: PlatoonCharacter[]) => {
          if (!list) return;

          if (shouldIgnoreSide(phase.phase, side, this.ignoreRules)) {
            return;
          }

          for (const character of list) {
            const existing = aggregatedRequirements.get(character.id);

            if (existing) {
              existing.amount += character.amount;
              existing.sides.add(side);
            } else {
              aggregatedRequirements.set(character.id, {
                ...character,
                sides: new Set([side]),
              });
            }
          }
        };

        collect("darkside", characters.darkside);
        collect("lightside", characters.lightside);
        collect("mixed", characters.mixed);

        /**
         * Classify needs
         */
        for (const aggregated of aggregatedRequirements.values()) {
          const eligibleCount = relicCountByUnit.get(aggregated.id) ?? 0;

          const result: NeedResult = {
            id: aggregated.id,
            name: getUnit(aggregated.id)?.name ?? "unknown name",
            phase: phase.phase,
            amount: aggregated.amount,
            difficulty: aggregated.difficulty,
            eligibleCount,
            sides: Array.from(aggregated.sides),
            relicRequired,
          };

          if (eligibleCount === 0) {
            results.hard.push(result);
          } else if (eligibleCount < aggregated.amount) {
            if (aggregated.amount > 1) {
              results.soft.push(result);
            } else {
              results.hard.push(result);
            }
          } else if (eligibleCount === aggregated.amount) {
            if (aggregated.amount > 1) {
              results.nice.push(result);
            } else {
              results.soft.push(result);
            }
          } else if (eligibleCount + 1 === aggregated.amount) {
            results.soft.push(result);
          }
        }
      }
      applyDemotions(results, this.demotionToggles);

      this.results = formatResults(results);
    },
    async copyResults() {
      const success = await copyToClipboard(this.results);
      if (success) {
        this.$toast(`Contents Copied`, {
          positionY: "top",
          class: "toast-success",
        });
      }
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
