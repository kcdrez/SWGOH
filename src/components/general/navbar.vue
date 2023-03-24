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
          <template v-for="item in navItems">
            <li class="nav-item dropdown" v-if="item.show">
              <a
                class="nav-link dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
              >
                {{ item.label }}
              </a>
              <ul class="dropdown-menu">
                <template v-for="child in item.children">
                  <li v-if="child.show">
                    <router-link class="dropdown-item" :to="child.to">{{
                      child.label
                    }}</router-link>
                  </li>
                </template>
              </ul>
            </li>
          </template>
        </ul>
        <div class="d-flex">
          <div class="input-group input-group-sm">
            <UnitSearch @select="searchUnit = $event" placeholder="Find Unit" />
            <button class="btn btn-primary" type="button" @click="search">
              Search
            </button>
          </div>
        </div>
        <ul class="navbar-nav">
          <li class="nav-item dropdown profile-dropdown">
            <a
              class="nav-link dropdown-toggle"
              role="button"
              data-bs-toggle="dropdown"
            >
              {{ player?.name || "Profile" }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li @click="resetPlayer" v-if="isLoggedIn" class="c-pointer">
                <div class="dropdown-item">Logout</div>
              </li>
              <li>
                <div class="dropdown-item versions">
                  <div>Version</div>
                  <div class="client">C: {{ version }}</div>
                  <!-- <div>S: server version</div> -->
                </div>
              </li>
              <li v-if="isLoggedIn">
                <div class="dropdown-item last-updated-container">
                  <LastUpdated class="p-0 navbar-text" />
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
import { defineComponent } from "vue";
import { mapActions, mapState } from "vuex";

import LastUpdated from "./lastUpdated.vue";
import config from "../../../package.json";
import UnitSearch from "../units/unitSearch.vue";
import { Unit } from "types/unit";

interface dataModel {
  version: string;
  searchUnit: null | Unit;
}

export default defineComponent({
  name: "NavBar",
  components: { LastUpdated, UnitSearch },
  data() {
    return {
      version: config.version,
      searchUnit: null,
    } as dataModel;
  },
  computed: {
    ...mapState("player", ["player"]),
    isLoggedIn(): boolean {
      return !!this.player;
    },
    navItems(): any[] {
      const characterMenu = [
        {
          label: "Character Farming",
          to: { name: "CharacterFarmingPage" },
          show: this.isLoggedIn,
        },
        {
          label: "General Planner",
          to: { name: "GeneralPlannerPage" },
          show: this.isLoggedIn,
        },
        {
          label: "GL/Legendary Checklist",
          to: { name: "GLChecklist" },
          show: this.isLoggedIn,
        },
        {
          label: "Goals List",
          to: { name: "GoalsPage" },
          show: this.isLoggedIn,
        },
      ];
      const teamMenu = [
        {
          label: "Team Management",
          to: { name: "TeamPage" },
          show: this.isLoggedIn,
        },
        {
          label: "Versus",
          to: { name: "MatchUpPage" },
          show: this.isLoggedIn,
        },
      ];
      const guildMenu = [
        {
          label: "Guild Stats",
          to: {
            name: "GuildStats",
            params: this.isLoggedIn ? { guildId: this.player.guild_id } : {},
          },
          show: true,
        },
        {
          label: "TW Planner",
          to: { name: "TWPlannerPage" },
          show: this.isLoggedIn,
        },
        {
          label: "Guild Event History",
          to: {
            name: "GuildEventsPage",
            params: this.isLoggedIn ? { guildId: this.player.guild_id } : {},
          },
          show: true,
        },
        {
          label: "Guild Unit Stats",
          to: {
            name: "GuildUnitsPage",
            params: this.isLoggedIn ? { guildId: this.player.guild_id } : {},
          },
          show: true,
        },
      ];
      const miscMenu = [
        {
          label: "Stat Calculator",
          to: { name: "StatCalculatorPage" },
          show: this.isLoggedIn,
        },
        {
          label: "TB Status",
          to: { name: "TBStatusPage" },
          show: this.isLoggedIn,
        },
        {
          label: "Relic Scavenger",
          to: { name: "ScavengerPage" },
          show: true,
        },
        {
          label: "Relic Planner",
          to: { name: "RelicCalculator" },
          show: true,
        },
        {
          label: "Unit Search",
          to: { name: "UnitSearchPage" },
          show: true,
        },
      ];

      return [
        {
          label: "Character Progression",
          children: characterMenu,
          show: this.showMenu(characterMenu),
        },
        {
          label: "Team Building",
          children: teamMenu,
          show: this.showMenu(teamMenu),
        },
        {
          label: "Guild",
          children: guildMenu,
          show: this.showMenu(guildMenu),
        },
        {
          label: "Misc. Tools",
          children: miscMenu,
          show: this.showMenu(miscMenu),
        },
      ];
    },
  },
  methods: {
    ...mapActions("player", ["resetPlayer"]),
    search(): void {
      if (this?.searchUnit) {
        this.$router.push({
          name: "UnitPage",
          params: { unitId: this.searchUnit?.id },
        });
      }
    },
    showMenu(arr: any[]): boolean {
      return arr.some((x) => x.show);
    },
  },
});
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
  .versions,
  .last-updated-container {
    &:hover {
      background: none !important;
      cursor: default;
    }
    .client,
    .server {
      font-size: 0.75rem;
      margin-left: 0.5rem;
    }
  }
}
</style>
