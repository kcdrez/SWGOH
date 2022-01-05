<template>
  <nav class="navbar navbar-expand-lg navbar-light border-bottom border-dark">
    <div class="container-fluid">
      <router-link :to="{ name: 'home' }" class="navbar-brand"
        >Home</router-link
      >
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbar-toggler"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbar-toggler">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <a
              class="nav-link"
              title="Click to change player details"
              href="#"
              @click="resetPlayer"
              >{{ player?.data.name }}</a
            >
          </li>
          <li>
            <!-- <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              role="button"
              data-bs-toggle="dropdown"
            >
              Units
            </a>
            <ul class="dropdown-menu">
              <li>
                <router-link class="dropdown-item" to="/unit/DARTHMALAK"
                  >Malak (Debug)</router-link
                >
              </li>
            </ul>
          </li> -->
          </li>
        </ul>
      </div>
      <div class="navbar-text">
        <small>Version: {{ version }}</small>
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
    ...mapState(["player"]),
  },
  methods: {
    ...mapActions(["resetPlayer"]),
  },
};
</script>

<style lang="scss" scoped>
nav {
  position: sticky;
  top: 0;
  z-index: 5;
}
</style>
