<template>
  <div class="container teams-page">
    <Error :state="requestState" :message="`Unable to find player data.`" />
    <Loading :state="requestState" message="Loading Player Data" size="lg">
      <LastUpdated />
      <div v-if="opponent">Your opponent is: {{ opponent.name }}</div>
      <div v-else class="input-group input-group-sm new-team">
        <input
          class="form-control"
          type="text"
          placeholder="Opponent Ally Code"
          v-model="allyCode"
          @keypress.enter="fetchPlayer(allyCode)"
          @keypress="$filters.numbersOnly($event)"
        />
        <button
          class="btn btn-primary"
          type="button"
          @click="fetchPlayer(allyCode)"
          :disabled="allyCode.trim() === ''"
        >
          Find Opponent
        </button>
      </div>
      <Loading
        :state="opponentRequestState"
        message="Loading Opponent Data"
        size="lg"
      >
        <hr class="w-100 border-dark border" />

        <div class="container">
          <div class="row">
            <div class="col">
              <TeamTable
                v-for="team in teams"
                :key="team.id"
                :team="team"
                @delete="confirmDeleteTeam(team)"
                size="sm"
              />
            </div>
            <div class="col">
              <TeamTable
                v-for="team in opponentTeams"
                :key="team.id"
                :team="team"
                @delete="confirmDeleteTeam(team)"
                size="sm"
              />
            </div>
          </div>
        </div>
        <Confirm
          :isOpen="deleteTarget !== null"
          title="Are you sure?"
          :text="`Are you sure you want to delete this team (${
            deleteTarget ? deleteTarget.name : ''
          })? This cannot be undone.`"
          @confirm="
            deleteTeam(deleteTarget);
            deleteTarget = null;
          "
          @cancel="cancelDelete"
        />
      </Loading>
    </Loading>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapActions, mapGetters } from "vuex";

import { Team } from "../types/teams";
import { loadingState } from "../types/loading";
import TeamTable from "../components/teams/teamTable.vue";

type dataModel = {
  allyCode: string;
  deleteTarget: null | Team;
};

export default defineComponent({
  name: "MatchUpPage",
  components: { TeamTable },
  data() {
    return {
      allyCode: "",
      deleteTarget: null,
    } as dataModel;
  },
  computed: {
    ...mapState("player", ["player"]),
    ...mapState("opponents", {
      opponent: "player",
      opponentRequestState: "requestState",
      opponentTeams: "teams",
    }),
    ...mapState("teams", ["teams"]),
    ...mapGetters(["someLoading"]),
    requestState(): loadingState {
      return this.someLoading(["player", "teams"]);
    },
  },
  methods: {
    ...mapActions("teams", ["deleteTeam", "removeUnit"]),
    ...mapActions("opponents", ["fetchPlayer"]),
    confirmDeleteTeam(team: Team) {
      this.deleteTarget = team;
    },
    cancelDelete() {
      this.deleteTarget = null;
    },
  },
});
</script>

<style lang="scss" scoped>
.teams-page {
  max-width: 90%;

  .container {
    margin: 0;
    padding: 0;
  }
}

.new-team {
  width: 50%;
  margin: 1rem 0;

  @media only screen and (max-width: 768px) {
    width: 100%;
  }
}
</style>
