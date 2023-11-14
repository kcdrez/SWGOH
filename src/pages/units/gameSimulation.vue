<template>
  <div class="swgoh-page">
    <div class="container">
      <div class="row">
        <div class="col">
          <div class="opponent-container">
            <div v-if="requestState === 'ERROR'" class="text-warning mt-2">
              An error occurred retrieving the opponent. Please check the ally
              code and try again. If the issue persists, it may be because your
              opponent does not have a swgoh.gg account and thus this tool
              cannot be used.
            </div>
            <div v-if="opponent" class="mt-3">
              Your opponent is:
              <a
                class="me-2 link-shadow"
                :href="`https://swgoh.gg/p/${opponent.allyCode}`"
                target="_blank"
                >{{ opponent.name }}</a
              >
              <button
                class="btn btn-sm btn-danger"
                title="Remove this opponent to add another one"
                @click="showDeleteOpponentConfirm = true"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
            <div v-else class="input-group input-group-sm new-opponent">
              <input
                class="form-control"
                type="text"
                placeholder="Opponent Ally Code"
                v-model="allyCode"
                @keypress.enter="fetchOpponent(allyCode)"
                @keypress="numbersOnly($event)"
              />
              <button
                class="btn btn-primary"
                type="button"
                @click="fetchOpponent(allyCode)"
                :disabled="allyCode.trim() === ''"
              >
                Find Opponent
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="row" v-if="opponent">
        <div class="col">
          <div>Your Team:</div>
          <UnitSearch
            :list="playerUnitList"
            @select="addToTeam('player', $event)"
          />
          <ul class="character-list">
            <li
              v-for="(character, index) in playerTeam"
              :key="'player_' + character.id"
              title="Remove this Character"
            >
              <span
                @click="removeCharacter('player', index)"
                class="character-element"
              >
                <i class="fa fa-times-circle me-2"></i>
                <span>{{ character.name }}</span>
              </span>
              <span
                class="float-end d-flex align-items-center"
                v-if="character.hasLeaderAbility"
              >
                <input
                  type="checkbox"
                  v-model="character.isLeader"
                  :id="'player_' + character.id"
                  class="me-2"
                  :disabled="disableLeader('player', character.id)"
                />
                <label :for="'player_' + character.id">Is Leader?</label>
              </span>
            </li>
          </ul>
        </div>
        <div class="col">
          <div>Opponent's Team:</div>
          <UnitSearch
            :list="opponentUnitList"
            @select="addToTeam('opponent', $event)"
          />
          <ul class="character-list">
            <li
              v-for="(character, index) in opponentTeam"
              :key="'opponent_' + character.id"
              title="Remove this Character"
            >
              <span
                @click="removeCharacter('opponent', index)"
                class="character-element"
              >
                <i class="fa fa-times-circle me-2"></i>
                <span>{{ character.name }}</span>
              </span>
              <span
                class="float-end d-flex align-items-center"
                v-if="character.hasLeaderAbility"
              >
                <input
                  type="checkbox"
                  v-model="character.isLeader"
                  :id="'opponent_' + character.id"
                  class="me-2"
                  :disabled="disableLeader('opponent', character.id)"
                />
                <label :for="'opponent_' + character.id">Is Leader?</label>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <template v-if="playerTeam.length > 0 && opponentTeam.length > 0">
        <div class="row">
          <div class="col">
            <div class="input-group input-group-sm">
              <input
                class="form-control form-control-sm"
                type="number"
                v-model.number="gameEngine.totalSimulations"
                min="1"
                max="10"
              />
              <button class="btn btn-sm btn-primary" @click="start()">
                Run the Simulations
              </button>
            </div>
          </div>
        </div>
        <div class="row" v-if="gameEngine.matchHistory.length > 0">
          <div class="col">
            <ul class="nav nav-tabs my-3" role="tablist">
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link active"
                  data-bs-toggle="tab"
                  data-bs-target="#simulationSummary"
                  type="button"
                  role="tab"
                >
                  Summary
                </button>
              </li>
              <li
                class="nav-item"
                role="presentation"
                v-for="(match, index) in gameEngine.matchHistory"
                :key="index"
              >
                <button
                  class="nav-link"
                  data-bs-toggle="tab"
                  :data-bs-target="`#match-${index}`"
                  type="button"
                  role="tab"
                >
                  Match {{ index + 1 }}
                </button>
              </li>
            </ul>
            <div class="tab-content">
              <div class="tab-pane fade show active" id="simulationSummary">
                <div>{{ player.name }} Wins: {{ gameEngine.playerWins }}</div>
                <div>
                  {{ opponent.name }} Wins: {{ gameEngine.opponentWins }}
                </div>
                <div>
                  Winrate:
                  {{ gameEngine.playerWinRate }}%
                </div>
              </div>
              <div
                class="tab-pane fade"
                :id="`match-${index}`"
                role="tabpanel"
                v-for="(match, index) in gameEngine.matchHistory"
                :key="index"
              >
                <template
                  v-for="(turn, turnIndex) in match"
                  :key="`match-${index}-turn-${turnIndex}`"
                >
                  <Popper arrow placement="right">
                    <h6 class="turn-label">{{ turn.label }}:</h6>
                    <template #content v-if="turn.character">
                      <div>
                        <div class="text-decoration-underline">
                          {{ turn.character?.name }}
                        </div>
                        <ul class="nav nav-tabs my-3" role="tablist">
                          <li class="nav-item" role="presentation">
                            <button
                              class="nav-link active"
                              data-bs-toggle="tab"
                              :data-bs-target="`#popover-match${index}_${turnIndex}-general`"
                              type="button"
                              role="tab"
                            >
                              General
                            </button>
                          </li>
                          <li class="nav-item" role="presentation">
                            <button
                              class="nav-link"
                              data-bs-toggle="tab"
                              :data-bs-target="`#popover-match${index}_${turnIndex}-stats`"
                              type="button"
                              role="tab"
                            >
                              Stats
                            </button>
                          </li>
                          <li class="nav-item" role="presentation">
                            <button
                              class="nav-link"
                              data-bs-toggle="tab"
                              :data-bs-target="`#popover-match${index}_${turnIndex}-statusEffects`"
                              type="button"
                              role="tab"
                            >
                              Status Effects
                            </button>
                          </li>
                          <li class="nav-item" role="presentation">
                            <button
                              class="nav-link"
                              data-bs-toggle="tab"
                              :data-bs-target="`#popover-match${index}_${turnIndex}-triggers`"
                              type="button"
                              role="tab"
                            >
                              Triggers
                            </button>
                          </li>
                          <li class="nav-item" role="presentation">
                            <button
                              class="nav-link"
                              data-bs-toggle="tab"
                              :data-bs-target="`#popover-match${index}_${turnIndex}-other`"
                              type="button"
                              role="tab"
                            >
                              Other Effects
                            </button>
                          </li>
                        </ul>
                        <div class="tab-content">
                          <div
                            class="tab-pane fade show active"
                            :id="`popover-match${index}_${turnIndex}-general`"
                          >
                            <div class="input-group input-group-sm">
                              <span class="input-group-text">Protection:</span>
                              <span class="input-group-text fill"
                                ><span
                                  :class="{
                                    'text-danger':
                                      (turn.characterLogData?.protection
                                        .current ?? 0) <
                                      (turn.characterLogData?.protection.max ??
                                        0),
                                  }"
                                  >{{
                                    turn.characterLogData?.protection.current
                                  }}</span
                                >
                                <span class="mx-1">/</span>
                                {{
                                  turn.characterLogData?.protection.max
                                }}</span
                              >
                            </div>
                            <div class="input-group input-group-sm mt-1">
                              <span class="input-group-text">Health:</span>
                              <span class="input-group-text fill"
                                ><span
                                  :class="{
                                    'text-warning':
                                      (turn.characterLogData?.health.current ??
                                        0) <
                                      (turn.characterLogData?.health.max ?? 0),
                                  }"
                                  >{{
                                    turn.characterLogData?.health.current
                                  }}</span
                                ><span class="mx-1">/</span>
                                {{ turn.characterLogData?.health.max }}</span
                              >
                            </div>
                            <div
                              v-for="ability in turn.characterLogData
                                ?.activeAbilities"
                              :key="ability.id"
                              class="mt-1"
                            >
                              <div v-if="ability.cooldown">
                                {{ ability.name }} - Cooldown:
                                {{ ability.turnsRemaining }}
                              </div>
                              <div v-else>{{ ability.name }} (Basic)</div>
                            </div>
                          </div>
                          <div
                            class="tab-pane fade stats"
                            :id="`popover-match${index}_${turnIndex}-stats`"
                          >
                            <div class="row">
                              <div class="col">
                                <u>General Stats:</u>
                                <div
                                  v-for="stat in turn.characterLogData?.general"
                                  :key="stat.label"
                                >
                                  <span class="me-1">{{ stat.label }}:</span>
                                  <span
                                    :class="{
                                      'text-success': stat.value > stat.base,
                                      'text-warning': stat.value < stat.base,
                                    }"
                                    :title="`Current ${stat.label}`"
                                    >{{ stat.value
                                    }}{{ stat.isPercent ? "%" : "" }}
                                  </span>
                                  <span
                                    class="ms-1"
                                    v-if="stat.value !== stat.base"
                                    :title="`Base ${stat.label}`"
                                    >({{ stat.base
                                    }}{{ stat.isPercent ? "%" : "" }})</span
                                  >
                                </div>
                              </div>
                              <div class="col">
                                <u>Physical Stats:</u>
                                <div
                                  v-for="stat in turn.characterLogData
                                    ?.physical"
                                  :key="stat.label"
                                >
                                  <span class="me-1">{{ stat.label }}:</span>
                                  <span
                                    :class="{
                                      'text-success': stat.value > stat.base,
                                      'text-warning': stat.value < stat.base,
                                    }"
                                    :title="`Current ${stat.label}`"
                                    >{{ stat.value
                                    }}{{ stat.isPercent ? "%" : "" }}
                                  </span>
                                  <span
                                    class="ms-1"
                                    v-if="stat.value !== stat.base"
                                    :title="`Base ${stat.label}`"
                                    >({{ stat.base
                                    }}{{ stat.isPercent ? "%" : "" }})</span
                                  >
                                </div>
                              </div>
                              <div class="col">
                                <u>Special Stats:</u>
                                <div
                                  v-for="stat in turn.characterLogData?.special"
                                  :key="stat.label"
                                >
                                  <span class="me-1">{{ stat.label }}:</span>
                                  <span
                                    :class="{
                                      'text-success': stat.value > stat.base,
                                      'text-warning': stat.value < stat.base,
                                    }"
                                    :title="`Current ${stat.label}`"
                                    >{{ stat.value
                                    }}{{ stat.isPercent ? "%" : "" }}
                                  </span>
                                  <span
                                    class="ms-1"
                                    v-if="stat.value !== stat.base"
                                    :title="`Base ${stat.label}`"
                                    >({{ stat.base
                                    }}{{ stat.isPercent ? "%" : "" }})</span
                                  >
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            class="tab-pane fade"
                            :id="`popover-match${index}_${turnIndex}-statusEffects`"
                          >
                            <div>Buffs:</div>
                            <template
                              v-if="turn.characterLogData?.buffs.length === 0"
                              >-</template
                            >
                            <template
                              v-for="buff in turn.characterLogData?.buffs"
                              :key="buff.name"
                            >
                              <img
                                class="statusEffect"
                                :src="turn.getStatusEffectImgSrc(buff)"
                                alt="images/statusEffects/Default.png"
                                :title="turn.getStatusEffectText(buff)"
                              />
                            </template>
                            <div>Debuffs:</div>
                            <template
                              v-if="turn.characterLogData?.debuffs.length === 0"
                              >-</template
                            >
                            <template
                              v-for="debuff in turn.characterLogData?.debuffs"
                              :key="debuff.name"
                            >
                              <img
                                class="statusEffect"
                                :src="turn.getStatusEffectImgSrc(debuff)"
                                alt="images/statusEffects/Default.png"
                                :title="turn.getStatusEffectText(debuff)"
                              />
                            </template>
                            <div>Other Status Effects:</div>
                            <template
                              v-if="
                                turn.characterLogData?.statusEffects.length ===
                                0
                              "
                              >-</template
                            >
                            <template
                              v-for="statusEffect in turn.characterLogData
                                ?.statusEffects"
                              :key="statusEffect.name"
                            >
                              <img
                                class="statusEffect"
                                :src="turn.getStatusEffectImgSrc(statusEffect)"
                                alt="images/statusEffects/Default.png"
                                :title="turn.getStatusEffectText(statusEffect)"
                              />
                            </template>
                          </div>
                          <div
                            class="tab-pane fade"
                            :id="`popover-match${index}_${turnIndex}-triggers`"
                          >
                            <Trigger
                              v-for="trigger in turn.characterLogData?.triggers"
                              :key="trigger.id"
                              :trigger="trigger"
                            />
                          </div>
                          <div
                            class="tab-pane fade"
                            :id="`popover-match${index}_${turnIndex}-other`"
                          >
                            <div>
                              {{
                                turn.characterLogData?.otherEffects.ignoreTaunt
                                  ? "Ignores Taunt"
                                  : "-"
                              }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </Popper>
                  <ul>
                    <li v-for="(log, index) in turn.logs" :key="index">
                      <div v-html="log"></div>
                    </li>
                    <li v-if="turn.endOfTurnLogs.length">- End of Turn -</li>
                    <li v-for="(log, index) in turn.endOfTurnLogs" :key="index">
                      <div v-html="log"></div>
                    </li>
                  </ul>
                  <ul v-if="turn.endOfTurnLogs.length"></ul>
                </template>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <Confirm
      :isOpen="showDeleteOpponentConfirm"
      title="Are you sure?"
      :text="`Are you sure you want to remove this opponent? You will lose all of their teams and match ups. This cannot be undone.`"
      @confirm="removeOpponent()"
      @cancel="showDeleteOpponentConfirm = false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapActions, mapGetters } from "vuex";

import { randomNumber, numbersOnly } from "utils";
import abilities from "types/abilities";
import { Character, format } from "types/gameEngine/characters";
import { gameEngine, Engine } from "types/gameEngine/gameEngine";
import { Unit } from "types/unit";
import UnitSearch from "components/units/unitSearch.vue";
import Trigger from "components/gameEngine/trigger.vue";

interface dataModel {
  gameEngine: Engine;
  playerTeam: Character[];
  opponentTeam: Character[];
  showDeleteOpponentConfirm: boolean;
  allyCode: string;
}

export default defineComponent({
  name: "GameSimulationPage",
  components: { UnitSearch, Trigger },
  data(): dataModel {
    return {
      gameEngine,
      playerTeam: [],
      opponentTeam: [],
      showDeleteOpponentConfirm: false,
      allyCode: "",
    };
  },
  computed: {
    ...mapState("opponents", {
      opponent: "player",
      opponentTeams: "teams",
      matches: "matches",
      requestState: "requestState",
    }),
    ...mapState("player", ["player"]),
    ...mapGetters("player", { getPlayerUnitData: "unitData" }),
    ...mapGetters("opponents", { getOpponentUnitData: "unitData" }),
    playerUnitList(): Unit[] {
      return this.player?.units.filter((unit: Unit) => {
        return (
          unit.id in abilities && !this.playerTeam.some((x) => x.id === unit.id)
        );
      });
    },
    opponentUnitList(): Unit[] {
      return this.opponent?.units.filter((unit: Unit) => {
        return (
          unit.id in abilities &&
          !this.opponentTeam.some((x) => x.id === unit.id)
        );
      });
    },
  },
  methods: {
    ...mapActions("opponents", {
      fetchOpponent: "fetchPlayer",
      deleteOpponentTeam: "deleteTeam",
      addOpponentTeam: "upsertTeam",
      saveOpponentTeams: "saveTeams",
      addMatch: "addMatch",
      deleteOpponent: "deleteOpponent",
      refreshMatches: "refreshMatches",
      removeMatch: "removeMatch",
    }),
    addToTeam(teamName: "player" | "opponent", unit: Unit) {
      if (unit instanceof Unit) {
        if (teamName === "player") {
          if (!this.playerTeam.some((x) => x.id === unit.id)) {
            this.playerTeam.push(new Character(unit, this.player.name));
          }
        } else {
          if (!this.opponentTeam.some((x) => x.id === unit.id)) {
            this.opponentTeam.push(new Character(unit, this.opponent.name));
          }
        }
        this.saveData();
      }
    },
    removeCharacter(teamName: "player" | "opponent", index: number) {
      if (teamName === "player") {
        this.playerTeam.splice(index, 1);
      } else {
        this.opponentTeam.splice(index, 1);
      }
      this.saveData();
    },
    saveData() {
      window.localStorage.setItem(
        "simulation",
        JSON.stringify({
          playerUnits: this.playerTeam.map((x) => x.id),
          opponentUnits: this.opponentTeam.map((x) => x.id),
        })
      );
    },
    start() {
      this.gameEngine.startSimulation(
        this.playerTeam as Character[],
        this.opponentTeam as Character[]
      );
    },
    removeOpponent() {
      this.deleteOpponent();
      this.showDeleteOpponentConfirm = false;
      this.opponentTeam = [];
      this.saveData();
    },
    numbersOnly,
    disableLeader(teamName: "player" | "opponent", characterId): boolean {
      if (teamName === "player") {
        return this.playerTeam.some((character) => {
          return character.isLeader && character.id !== characterId;
        });
      } else {
        return this.opponentTeam.some((character) => {
          return character.isLeader && character.id !== characterId;
        });
      }
    },
  },
  created() {
    const teamData = JSON.parse(
      window.localStorage.getItem("simulation") ?? "{}"
    );
    if (teamData?.playerUnits) {
      teamData.playerUnits.forEach((id) => {
        const unit: Unit = this.getPlayerUnitData(id);
        if (unit) {
          this.addToTeam("player", unit);
        }
      });
      teamData.opponentUnits.forEach((id) => {
        const unit: Unit = this.getOpponentUnitData(id);
        if (unit) {
          this.addToTeam("opponent", unit);
        }
      });
    }
  },
});
</script>

<style lang="scss" scoped>
@import "styles/variables.scss";

::v-deep(em) {
  color: $dark;
}
::v-deep(.damage) {
  color: $danger-dark-3;
}
::v-deep(.crit) {
  color: $warning;
}
::v-deep(.buff) {
  color: $success-dark-2;
  text-shadow: 0px 0px 3px $success-light-3;
}
::v-deep(.debuff) {
  color: $danger-dark-3;
  text-shadow: 0px 0px 3px $danger-light-2;
}
::v-deep(.statusEffect) {
  color: $primary-dark-3;
  text-shadow: 0px 0px 3px $primary-light-2;
}
::v-deep(.ability) {
  color: $secondary-dark-3;
  text-shadow: 0px 0px 3px $secondary-light-3;

  &:hover {
    color: $primary-dark-2;
    text-decoration: underline;
    cursor: help;
  }
}
::v-deep(.protection) {
  color: $gray-1;
  text-shadow: 0px 0px 3px $gray-9;
}
::v-deep(.health) {
  color: $success-light-2;
  text-shadow: 0px 0px 3px $gray-1;
}

.character-list {
  list-style-type: none;
  .character-element {
    cursor: pointer;

    &:hover {
      color: $danger-text-dark;
    }
  }
}

.input-group-text.fill {
  flex: 1 1 auto;
}
::v-deep(.popper) .stats .row {
  width: 700px;
}
.statusEffect {
  max-width: 30px;
}
.turn-label {
  cursor: pointer;
  color: $secondary-dark-3;
  text-shadow: 0px 0px 3px $secondary-light-3;

  &:hover {
    text-decoration: underline;
  }
}

.popper .tab-pane {
  max-height: 300px;
  overflow: scroll;
}
</style>
