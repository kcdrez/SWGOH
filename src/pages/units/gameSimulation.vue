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
        <div class="row" v-if="logs.length > 0">
          <div class="col">
            <div>{{ player.name }} Wins: {{ simulation.playerWins }}</div>
            <div>{{ opponent.name }} Wins: {{ simulation.opponentWins }}</div>
            <div>
              Winrate:
              {{
                round(
                  simulation.playerWins /
                    (simulation.playerWins + simulation.opponentWins),
                  2
                ) * 100
              }}%
            </div>
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
import { mapState, mapActions, mapGetters } from "vuex";

import { randomNumber, numbersOnly, round } from "utils";
import abilities from "types/abilities";
import { Character, format } from "types/gameEngine/characters";
import { Engine } from "types/gameEngine/gameEngine";
import { Unit } from "types/unit";
import UnitSearch from "components/units/unitSearch.vue";

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
      const maxRoundCount = 1000; //to prevent infinite loops
      this.logs = [];
      this.simulation.playerWins = 0;
      this.simulation.opponentWins = 0;
      this.simulation.count = Math.min(this.simulation.count, 100);
      for (let i = 0; i < this.simulation.count; i++) {
        const match = new Engine(
          this.playerTeam as Character[],
          this.opponentTeam as Character[]
        );
        const { playerWins } = match.start(maxRoundCount);
        match.logs.push(
          `Match ends: ${
            playerWins ? this.player.name : this.opponent.name
          } is the winner!`
        );
        this.logs = match.logs;

        if (playerWins) {
          this.simulation.playerWins++;
        } else {
          this.simulation.opponentWins++;
        }
      }
    },
    removeOpponent() {
      this.deleteOpponent();
      this.showDeleteOpponentConfirm = false;
      this.opponentTeam = [];
      this.saveData();
    },
    numbersOnly,
    round,
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
