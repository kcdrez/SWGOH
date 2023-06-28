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
              <span class="float-end d-flex align-items-center">
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
              <span class="float-end d-flex align-items-center">
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
                v-model.number="simulation.count"
                min="1"
                max="1000"
              />
              <button class="btn btn-sm btn-primary" @click="start()">
                Run the Simulations
              </button>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div>Team 1 Wins: {{ simulation.playerWins }}</div>
            <div>Team 2 Wins: {{ simulation.opponentWins }}</div>
            <ol>
              <li v-for="(log, index) in logs" :key="index">
                <span v-html="log"></span>
              </li>
            </ol>
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
import { mapState, mapActions } from "vuex";
import { v4 as uuid } from "uuid";

import { Team } from "types/teams";
import TeamTable from "components/teams/teamTable.vue";
import MatchTable from "components/teams/matchTable.vue";
import { randomNumber, unvue, numbersOnly } from "utils";
import { random } from "lodash";
import abilities from "types/abilities";
import { Character, iStatusEffect, iAbility } from "types/characters";
import { Unit } from "types/unit";
import UnitSearch from "components/units/unitSearch.vue";
import characterList from "types/_tempCharacterData";

interface dataModel {
  simulation: {
    count: number;
    playerWins: number;
    opponentWins: number;
  };
  playerTeam: Character[];
  opponentTeam: Character[];
  logs: string[];
  showDeleteOpponentConfirm: boolean;
  allyCode: string;
}

export default defineComponent({
  name: "GameSimulationPage",
  components: { UnitSearch },
  data(): dataModel {
    return {
      simulation: {
        count: 1,
        playerWins: 0,
        opponentWins: 0,
      },
      playerTeam: [],
      opponentTeam: [],
      logs: [],
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
    playerUnitList(): Unit[] {
      return this.player?.units.filter((unit: Unit) => {
        return (
          characterList.some((c) => c.id === unit.id) &&
          !this.playerTeam.some((x) => x.id === unit.id)
        );
      });
    },
    opponentUnitList(): Unit[] {
      return this.opponent?.units.filter((unit: Unit) => {
        return (
          characterList.some((c) => c.id === unit.id) &&
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
      }
    },
    removeCharacter(teamName: "player" | "opponent", index: number) {
      if (teamName === "player") {
        this.playerTeam.splice(index, 1);
      } else {
        this.opponentTeam.splice(index, 1);
      }
    },
    initializeMatch() {
      [...this.playerTeam, ...this.opponentTeam].forEach((x) => x.initialize());
    },
    reset() {
      this.playerTeam.forEach((x) =>
        x.reset(
          this.playerTeam as Character[],
          this.opponentTeam as Character[]
        )
      );
      this.opponentTeam.forEach((x) =>
        x.reset(
          this.opponentTeam as Character[],
          this.playerTeam as Character[]
        )
      );
    },
    start() {
      this.logs = [];
      this.simulation.playerWins = 0;
      this.simulation.opponentWins = 0;
      this.simulation.count = Math.min(this.simulation.count, 100);
      for (let i = 0; i < this.simulation.count; i++) {
        this.reset();
        this.initializeMatch();
        let j = 0;
        do {
          j++;

          this.nextTurn(j);
          const playerLost = this.playerTeam.every((x) => x.health <= 0);
          const opponentList = this.opponentTeam.every((x) => x.health <= 0);
          if (playerLost || opponentList || j > 100) {
            const winner = playerLost ? this.opponent : this.player;
            this.logs.push(`Match ends: ${winner.name} is the winner!`);
            if (playerLost) {
              this.simulation.opponentWins++;
            } else {
              this.simulation.playerWins++;
            }
            break;
          }
        } while (true);
      }
      this.reset();
    },
    nextTurn(turnNumber: number) {
      const allChars: Character[] = [
        ...this.playerTeam,
        ...this.opponentTeam,
      ] as Character[];

      const { character, tmAmount } = allChars.reduce(
        (acc: { tmAmount: number; character: null | Character }, char) => {
          if (!char?.isDead) {
            if (!acc.character) {
              acc.character = char;
            } else {
              const results = acc.character.compareTm(char);
              acc.character = results.character;
              acc.tmAmount = results.amount;
            }
          }

          return acc;
        },
        { tmAmount: 0, character: null }
      );

      if (character !== null) {
        allChars.forEach((char) => {
          if (!char.isDead) {
            char.changeTurnMeter((tmAmount / character.speed) * char.speed);
          }
        });

        this.logs.push(`Turn ${turnNumber}`);
        this.logs.push(...character.takeAction());
      }
    },
    removeOpponent() {
      this.deleteOpponent();
      this.showDeleteOpponentConfirm = false;
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
  color: $success-dark-1;
}
::v-deep(.buff),
::v-deep(.debuff) {
  color: $primary-text-dark;
}
::v-deep(.ability) {
  color: $warning-dark-1;
}
::v-deep(.protection) {
  color: $gray-7;
}
::v-deep(.health) {
  color: $success-text-light;
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
</style>
