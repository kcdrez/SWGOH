<template>
  <div class="container teams-page swgoh-page">
    <div class="opponent-container">
      <div v-if="opponent">
        Your opponent is: {{ opponent.name }}
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
          @keypress="$filters.numbersOnly($event)"
        />
        <button
          class="btn btn-primary"
          type="button"
          @click="fetchOpponent(allyCode)"
          :disabled="allyCode.trim() === ''"
        >
          Find Opponent
        </button>
        <button
          class="btn btn-sm btn-info"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#learnMore"
        >
          Learn More
        </button>
      </div>
      <div id="learnMore" class="collapse">
        <div>
          In this tool, you can add an ally code of an opponent. Most often this
          will be for GAC but can also be used for Squad Arena or Territory
          Wars.
        </div>
        <div>
          After entering an ally code, you will be able to see all of their
          units and create a team. Then you will be able to use your teams and
          create a match up.
        </div>
        <div>
          The tool will then create a view of each unit's speed and order them
          from fastest to slowest. This will apply all unique abilities,
          leadership abilities (even from omicron abilities).
        </div>
        <div>
          This will give a sense of the initial turn order of each unit.
        </div>
        <div>
          There are a few assumptions that this version of the tool makes:
          <ul>
            <li>
              Omicron Abilities are always applied if the game mode is selected,
              even if the unit doesn't have it applied. A future version of the
              tool will make adjustments accordingly.
            </li>
            <li>
              All units' sub total speed is based on currently applied gear
              level and mods. The mods in the GAC or TW may be different and
              there is no way for the tool to know this.
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="team-list-container">
      <h3 class="text-center">Team Management</h3>
      <div class="container">
        <div class="row">
          <div class="col">
            <h5 class="text-center">Your Teams</h5>
            <div class="input-group input-group-sm new-team">
              <input
                type="text"
                class="form-control"
                placeholder="Team Name"
                v-model="newPlayerTeamName"
              />
              <button
                class="btn btn-primary"
                type="button"
                @click="addTeam('player')"
                :disabled="newPlayerTeamName.trim() === ''"
              >
                Add New Team
              </button>
            </div>
            <TeamTable
              v-for="team in playerTeams"
              :key="team.id"
              :team="team"
              :unitList="player.units"
              :showGameMode="false"
              @deleteTeam="confirmDeleteTeam(team, 'player')"
              size="sm"
            />
          </div>
          <div class="col">
            <h5 class="text-center">Opponent's Teams</h5>
            <div class="input-group input-group-sm new-team">
              <input
                type="text"
                class="form-control"
                placeholder="Team Name"
                v-model="newOpponentTeamName"
                @keypress.enter="addTeam('opponent')"
              />
              <button
                class="btn btn-primary"
                type="button"
                @click="addTeam('opponent')"
                :disabled="newOpponentTeamName.trim() === ''"
              >
                Add New Team
              </button>
            </div>
            <TeamTable
              v-for="team in opponentTeams"
              :key="team.id"
              :team="team"
              :unitList="opponent.units"
              :showGameMode="false"
              @deleteTeam="confirmDeleteTeam(team, 'opponent')"
              size="sm"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="match-up-container mb-3">
      <h3 class="text-center">Match Ups</h3>
      <div class="container">
        <div class="row text-center add-match-container">
          <div class="col">
            <div>Player Team</div>
            <SearchInput
              :list="playerTeams"
              @update:modelValue="newMatchup.playerTeam = $event"
            />
          </div>
          <div class="col">
            <div>Opponent Team</div>
            <SearchInput
              :list="opponentTeams"
              @update:modelValue="newMatchup.opponentTeam = $event"
            />
          </div>
          <div class="col d-flex justify-content-center align-items-end">
            <button
              class="btn btn-sm btn-primary"
              @click="addMatch(newMatchup)"
              :disabled="!newMatchup.playerTeam || !newMatchup.opponentTeam"
            >
              Add Matchup
            </button>
          </div>
        </div>
        <div class="row my-3" v-if="matches.length === 0">
          <div class="col">
            There are no matches to view. Create some teams above and create a
            match to view how the units' speed compares to one another.
          </div>
        </div>
        <template v-for="matchup in matches" :key="matchup.id">
          <div class="row text-center match-container">
            <div class="col text-large">
              {{ matchup.name }}
              <button
                class="btn btn-sm btn-danger"
                title="Delete this match up"
                @click="deleteMatchTarget = matchup"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <MatchTable :match="matchup" />
            </div>
          </div>
        </template>
      </div>
    </div>
    <Confirm
      :isOpen="deleteTarget.team !== null"
      title="Are you sure?"
      :text="`Are you sure you want to delete this team (${
        deleteTarget.team ? deleteTarget.team.name : ''
      })? It will also remove all matches that use this team. This cannot be undone.`"
      @confirm="deleteTeam()"
      @cancel="cancelDeleteTeam"
    />
    <Confirm
      :isOpen="showDeleteOpponentConfirm"
      title="Are you sure?"
      :text="`Are you sure you want to remove this opponent? You will lose all of their teams and match ups. This cannot be undone.`"
      @confirm="removeOpponent()"
      @cancel="cancelDeleteOpponent"
    />
    <Confirm
      :isOpen="deleteMatchTarget !== null"
      title="Are you sure?"
      :text="`Are you sure you want to remove this match (${
        deleteMatchTarget ? deleteMatchTarget.name : ''
      })? This cannot be undone.`"
      @confirm="
        removeMatch({ matchId: deleteMatchTarget?.id });
        deleteMatchTarget = null;
      "
      @cancel="deleteMatchTarget = null"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapActions } from "vuex";
import { v4 as uuid } from "uuid";

import { Match, MatchPayload, Team } from "../types/teams";
import TeamTable from "../components/teams/teamTable.vue";
import MatchTable from "../components/teams/matchTable.vue";

type dataModel = {
  allyCode: string;
  deleteTarget: { team: null | Team; type: "player" | "opponent" | "" };
  newPlayerTeamName: string;
  newOpponentTeamName: string;
  newMatchup: MatchPayload;
  showDeleteOpponentConfirm: boolean;
  deleteMatchTarget: null | Match;
};

export default defineComponent({
  name: "MatchUpPage",
  components: { TeamTable, MatchTable },
  data() {
    return {
      allyCode: "",
      deleteTarget: { team: null, type: "" },
      newPlayerTeamName: "",
      newOpponentTeamName: "",
      newMatchup: {
        playerTeam: null,
        opponentTeam: null,
      },
      showDeleteOpponentConfirm: false,
      deleteMatchTarget: null,
    } as dataModel;
  },
  computed: {
    ...mapState("player", ["player"]),
    ...mapState("opponents", {
      opponent: "player",
      opponentTeams: "teams",
      matches: "matches",
    }),
    ...mapState("teams", {
      playerTeams: "teams",
    }),
  },
  methods: {
    ...mapActions("teams", {
      deletePlayerTeam: "deleteTeam",
      addPlayerTeam: "upsertTeam",
      savePlayerTeams: "saveTeams",
    }),
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
    confirmDeleteTeam(team: Team, type: "player" | "opponent") {
      this.deleteTarget.team = team;
      this.deleteTarget.type = type;
    },
    cancelDeleteTeam() {
      this.deleteTarget.team = null;
      this.deleteTarget.type = "";
    },
    deleteTeam() {
      if (this.deleteTarget.type === "player") {
        this.deletePlayerTeam(this.deleteTarget.team);
      } else {
        this.deleteOpponentTeam(this.deleteTarget.team);
      }
      this.deleteTarget.team = null;
      this.deleteTarget.type = "";
    },
    addTeam(playerType: "player" | "opponent") {
      if (playerType === "player") {
        if (this.newPlayerTeamName.trim() !== "") {
          this.addPlayerTeam({
            id: uuid(),
            name: this.newPlayerTeamName,
            units: [],
          });
          this.newPlayerTeamName = "";
        }
      } else if (playerType === "opponent") {
        if (this.newOpponentTeamName.trim() !== "") {
          this.addOpponentTeam(
            new Team(
              {
                id: uuid(),
                name: this.newOpponentTeamName,
                units: [],
              },
              this.opponent.id
            )
          );
          this.newOpponentTeamName = "";
        }
      }
    },
    removeOpponent() {
      this.deleteOpponent();
      this.showDeleteOpponentConfirm = false;
    },
    cancelDeleteOpponent() {
      this.showDeleteOpponentConfirm = false;
    },
    saveTeam(type: "player" | "opponent", team: Team) {
      if (type === "player") {
        this.refreshMatches({ playerTeamId: team.id });
        this.savePlayerTeams();
      } else {
        this.refreshMatches({ opponentTeamId: team.id });
        this.saveOpponentTeams();
      }
    },
  },
});
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";

.teams-page {
  .container {
    margin: 0;
    padding: 0;
    max-width: 100%;
  }
}

.opponent-container {
  border-bottom: 2px solid black;
  padding-bottom: 1rem;
}

.team-list-container {
  border-bottom: 2px solid black;
  padding-top: 1rem;
}
.match-up-container {
  padding-top: 1rem;
}

.new-opponent {
  width: 50%;
  margin: 1rem 0;

  @media only screen and (max-width: 768px) {
    width: 100%;
  }
}

.add-match-container,
.match-container + * {
  border-bottom: $gray-2 solid 2px;
  padding-bottom: 0.5rem;
}
</style>
