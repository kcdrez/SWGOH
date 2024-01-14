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
                    <template #content>
                      <div>
                        <div
                          class="input-group input-group-sm"
                          v-for="(character, index) in turn.characterList"
                          :key="index"
                        >
                          <span class="input-group-text character-name"
                            >{{ character.name }} ({{ character.owner }})</span
                          >
                          <span class="input-group-text fill turn-meter">
                            <ProgressBar
                              :percent="character.turnMeter"
                              class="w-100"
                            />
                          </span>
                        </div>
                      </div>
                    </template>
                  </Popper>
                  <ul>
                    <li v-for="(log, index) in turn.logs" :key="index">
                      <Log :log="log" />
                    </li>
                    <li v-if="turn.endOfTurnLogs.length">- End of Turn -</li>
                    <li v-for="(log, index) in turn.endOfTurnLogs" :key="index">
                      <Log :log="log" />
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
import { Character } from "types/gameEngine/characters/index";
import { gameEngine, Engine } from "types/gameEngine/gameEngine";
import { Unit } from "types/unit";
import UnitSearch from "components/units/unitSearch.vue";
import Trigger from "components/gameEngine/triggers/trigger.vue";
import Log from "components/gameEngine/log.vue";
import characterList from "types/gameEngine/characterScripts";

interface dataModel {
  gameEngine: Engine;
  playerTeam: Character[];
  opponentTeam: Character[];
  showDeleteOpponentConfirm: boolean;
  allyCode: string;
}

export default defineComponent({
  name: "GameSimulationPage",
  components: { UnitSearch, Trigger, Log },
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
          unit.id in characterList &&
          !this.playerTeam.some((x) => x.id === unit.id)
        );
      });
    },
    opponentUnitList(): Unit[] {
      return this.opponent?.units.filter((unit: Unit) => {
        return (
          unit.id in characterList &&
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
.turn-label {
  cursor: pointer;
  color: $secondary-dark-3;
  text-shadow: 0px 0px 3px $secondary-light-3;

  &:hover {
    text-decoration: underline;
  }
}
.character-name {
  max-width: 150px;
  width: 150px;
  white-space: unset;
}
.turn-meter {
  width: 150px;
}
</style>
