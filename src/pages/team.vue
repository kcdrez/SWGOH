<template>
  <div class="container swgoh-page">
    <Error :state="requestState" :message="`Unable to find player data.`" />
    <Loading :state="requestState" message="Loading Player Data" size="lg">
      <LastUpdated />
      <div class="input-group input-group-sm new-team">
        <input
          type="text"
          class="form-control"
          placeholder="Team Name"
          v-model="newTeamName"
          @keypress.enter="addNewTeam"
        />
        <button
          class="btn btn-primary"
          type="button"
          @click="addNewTeam"
          :disabled="newTeamName.trim() === ''"
        >
          Add New Team
        </button>
      </div>
      <TeamTable
        v-for="team in teams"
        :key="team.id"
        :team="team"
        :unitList="player.units"
        @deleteTeam="confirmDeleteTeam(team)"
        size="lg"
      />
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapActions, mapGetters } from "vuex";
import { v4 as uuid } from "uuid";

import { Team } from "../types/teams";
import { loadingState } from "../types/loading";
import TeamTable from "../components/teams/teamTable.vue";

const dependencyModules = ["player", "teams"];

type dataModel = {
  newTeamName: string;
  deleteTarget: null | Team;
};

export default defineComponent({
  name: "TeamPage",
  components: { TeamTable },
  data() {
    return {
      newTeamName: "",
      deleteTarget: null,
    } as dataModel;
  },
  computed: {
    ...mapState("teams", ["teams"]),
    ...mapState("player", ["player"]),
    ...mapGetters(["someLoading"]),
    requestState(): loadingState {
      return this.someLoading(dependencyModules);
    },
  },
  methods: {
    ...mapActions("teams", [
      "upsertTeam",
      "deleteTeam",
      "saveTeams",
      "addUnit",
      "removeUnit",
    ]),
    addNewTeam() {
      if (this.newTeamName.trim() !== "") {
        this.upsertTeam({
          id: uuid(),
          name: this.newTeamName,
          units: [],
        });
        this.newTeamName = "";
      }
    },
    confirmDeleteTeam(team: Team) {
      this.deleteTarget = team;
    },
    cancelDelete() {
      this.deleteTarget = null;
    },
  },
  created() {
    dependencyModules.forEach((moduleName) => {
      this.$store.dispatch(`${moduleName}/initialize`);
    });
  },
});
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";

.mods-list {
  display: flex;
  justify-content: center;

  ul {
    margin: 0 1rem;
    padding: 0;
    list-style: none;
  }
}

.new-team,
.rename-team {
  width: 50%;
  margin: 1rem 0;

  @media only screen and (max-width: 768px) {
    width: 100%;
  }
}

.game-modes {
  display: flex;
  margin-bottom: 0.5rem;
  justify-content: space-evenly;

  @media only screen and (max-width: 500px) {
    display: block;
  }

  @media only screen and (min-width: 501px) and (max-width: 991px) {
    display: grid;
    grid-template-columns: 1fr 1fr;

    *:not(.form-check) {
      grid-column: 1 / 3;
      text-align: center;
    }

    .form-check {
      min-width: 141px;

      &:nth-child(2n) {
        justify-self: right;
        margin-right: 1rem;
      }

      &:nth-child(2n + 1) {
        justify-self: left;
        margin-left: 1rem;
      }
    }
  }
}

.sort-methods {
  @media only screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

.team-row {
  > * {
    padding: 0.5rem 1rem;

    &:not(:last-child) {
      border-bottom: solid $gray-5 1px;
    }
  }

  .leader-container {
    display: flex;

    .form-check {
      margin: auto;
    }
  }
}
</style>
