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
        <ul class="navbar-nav me-auto">
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              role="button"
              data-bs-toggle="dropdown"
            >
              Planning
            </a>
            <ul class="dropdown-menu">
              <li>
                <router-link
                  class="dropdown-item"
                  :to="{ name: 'GeneralPlannerPage' }"
                  >General Planner</router-link
                >
              </li>
              <li>
                <router-link class="dropdown-item" :to="{ name: 'TeamPage' }"
                  >Teams</router-link
                >
              </li>
              <li>
                <router-link class="dropdown-item" :to="{ name: 'MatchUpPage' }"
                  >Match Up</router-link
                >
              </li>
            </ul>
          </li>
        </ul>
        <div class="d-flex">
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
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import config from "../../package.json";
import { mapActions, mapState } from "vuex";

export default {
  name: "NavBar",
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
  z-index: 5;
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
</style>
