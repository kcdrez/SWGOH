<template>
  <nav class="navbar navbar-expand-lg navbar-light border-bottom border-dark">
    <div class="container-fluid">
      <router-link :to="{ name: 'home' }" class="navbar-brand"
        >Home</router-link
      >
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbar-toggler"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbar-toggler">
        <ul class="navbar-nav me-auto" v-if="player">
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              role="button"
              data-bs-toggle="dropdown"
            >
              Character Progression
            </a>
            <ul class="dropdown-menu">
              <li>
                <router-link
                  class="dropdown-item"
                  :to="{ name: 'StarProgressionPage' }"
                  >Character Farming</router-link
                >
              </li>
              <li>
                <router-link
                  class="dropdown-item"
                  :to="{ name: 'GeneralPlannerPage' }"
                  >General Planner</router-link
                >
              </li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              role="button"
              data-bs-toggle="dropdown"
            >
              Team Building
            </a>
            <ul class="dropdown-menu">
              <li>
                <router-link class="dropdown-item" :to="{ name: 'TeamPage' }"
                  >Team Management</router-link
                >
              </li>
              <li>
                <router-link class="dropdown-item" :to="{ name: 'MatchUpPage' }"
                  >Versus</router-link
                >
              </li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              role="button"
              data-bs-toggle="dropdown"
            >
              Guild
            </a>
            <ul class="dropdown-menu">
              <li>
                <router-link
                  class="dropdown-item"
                  :to="{ name: 'GuildEventsPage' }"
                  >Guild Event History</router-link
                >
              </li>
              <li>
                <router-link
                  class="dropdown-item"
                  :to="{ name: 'GuildUnitsPage' }"
                  >Guild Units Status</router-link
                >
              </li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              role="button"
              data-bs-toggle="dropdown"
            >
              Misc. Tools
            </a>
            <ul class="dropdown-menu">
              <li>
                <router-link
                  class="dropdown-item"
                  :to="{ name: 'DamageCalculatorPage' }"
                  >Damage Calculator</router-link
                >
              </li>
              <li>
                <router-link class="dropdown-item" :to="{ name: 'GLChecklist' }"
                  >GL Checklist</router-link
                >
              </li>
            </ul>
          </li>
        </ul>
        <ul class="navbar-nav">
          <li class="mr-1" v-if="player">
            <div class="navbar-text">
              <LastUpdated />
            </div>
          </li>
          <li class="nav-item dropdown profile-dropdown">
            <a
              class="nav-link dropdown-toggle"
              role="button"
              data-bs-toggle="dropdown"
            >
              {{ player?.name || "Profile" }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li @click="resetPlayer" v-if="player">
                <div class="dropdown-item">Logout</div>
              </li>
              <li>
                <div class="dropdown-item versions">
                  <div>Version</div>
                  <div class="client">C: {{ version }}</div>
                  <!-- <div>S: server version</div> -->
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { mapActions, mapState } from "vuex";
import LastUpdated from "./lastUpdated.vue";

import config from "../../package.json";

export default {
  name: "NavBar",
  components: { LastUpdated },
  data() {
    return {
      version: config.version,
    };
  },
  computed: {
    ...mapState("player", ["player"]),
  },
  methods: {
    ...mapActions("player", ["resetPlayer"]),
  },
};
</script>

<style lang="scss" scoped>
nav {
  position: sticky;
  top: 0;
  z-index: 1000;
}

.profile-dropdown {
  @media only screen and (min-width: 990px) {
    display: flex;
  }
  .versions {
    &:hover {
      background: none !important;
    }
    .client,
    .server {
      font-size: 0.75rem;
      margin-left: 0.5rem;
    }
  }
}
</style>
