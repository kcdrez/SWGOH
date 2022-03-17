import { createRouter, createWebHashHistory } from "vue-router";

import store from "../vuex-store/store";
import HomePage from "../pages/homepage.vue";
import UnitPage from "../pages/unitPage.vue";
import GeneralPlannerPage from "../pages/generalPlanner.vue";
import TeamPage from "../pages/team.vue";
import MatchUpPage from "../pages/matchUpPage.vue";
import StarProgressionPage from "../pages/starProgression.vue";
import GuildEventsPage from "../pages/guildEvents.vue";
import DamageCalculatorPage from "../pages/damageCalculator.vue";
import GLChecklist from "../pages/glChecklist.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomePage,
  },
  {
    path: "/unit/:unitId",
    name: "UnitPage",
    component: UnitPage,
  },
  {
    path: "/general-planner",
    name: "GeneralPlannerPage",
    component: GeneralPlannerPage,
  },
  {
    path: "/teams",
    name: "TeamPage",
    component: TeamPage,
  },
  {
    path: "/matchup",
    name: "MatchUpPage",
    component: MatchUpPage,
  },
  {
    path: "/character-farming",
    name: "StarProgressionPage",
    component: StarProgressionPage,
  },
  {
    path: "/guild",
    name: "GuildEventsPage",
    component: GuildEventsPage,
  },
  {
    path: "/damage-calculator",
    name: "DamageCalculatorPage",
    component: DamageCalculatorPage,
  },
  {
    path: "/gl-checklist",
    name: "GLChecklist",
    component: GLChecklist,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  if (to.name === "home") {
    next();
  } else if (!store.state.player.player) {
    store.watch(
      (state) => {
        return state.player.player;
      },
      () => {
        next();
      }
    );
  } else {
    next();
  }
});

export default router;
