import { createRouter, createWebHashHistory } from "vue-router";

import PlayerLoadingPage from "../pages/playerLoadingPage.vue";
import HomePage from "../pages/homepage.vue";
import UnitPage from "../pages/unitPage.vue";
import GeneralPlannerPage from "../pages/generalPlanner.vue";
import TeamPage from "../pages/team.vue";
import MatchUpPage from "../pages/matchUpPage.vue";
import CharacterFarmingPage from "../pages/characterFarming.vue";
import GuildEventsPage from "../pages/guildEvents.vue";
import GuildUnitsPage from "../pages/guildUnits.vue";
import DamageCalculatorPage from "../pages/damageCalculator.vue";
import GLChecklist from "../pages/glChecklist.vue";
import WidgetsPage from "../pages/widgets.vue";

const routes = [
  {
    path: "/",
    name: "home",
    // redirect: { name: "GeneralPlannerPage" },
    components: {
      default: HomePage,
    },
  },
  {
    path: "/general-planner",
    components: {
      default: PlayerLoadingPage,
    },
    props: {
      default: {
        dependencyModules: ["planner", "unit", "gear", "relic", "shards"],
      },
    },
    children: [
      {
        path: "",
        name: "GeneralPlannerPage",
        component: GeneralPlannerPage,
      },
    ],
  },
  {
    path: "/unit/:unitId",
    components: {
      default: PlayerLoadingPage,
    },
    props: {
      default: {
        dependencyModules: [
          "unit",
          "gear",
          "relic",
          "shards",
          "planner",
          "guild",
          "currency",
        ],
      },
    },
    children: [
      {
        path: "",
        name: "UnitPage",
        component: UnitPage,
      },
    ],
  },
  {
    path: "/teams",
    components: {
      default: PlayerLoadingPage,
    },
    props: {
      default: {
        dependencyModules: ["teams"],
      },
    },
    children: [
      {
        path: "",
        name: "TeamPage",
        component: TeamPage,
      },
    ],
  },
  {
    path: "/matchup",
    components: {
      default: PlayerLoadingPage,
    },
    props: {
      default: {
        dependencyModules: ["teams", "opponents"],
      },
    },
    children: [
      {
        path: "",
        name: "MatchUpPage",
        component: MatchUpPage,
      },
    ],
  },
  {
    path: "/character-farming",
    components: {
      default: PlayerLoadingPage,
    },
    props: {
      default: {
        dependencyModules: ["shards", "planner", "unit", "guild", "currency"],
      },
    },
    children: [
      {
        path: "",
        name: "CharacterFarmingPage",
        component: CharacterFarmingPage,
      },
    ],
  },
  {
    path: "/guild",
    components: {
      default: PlayerLoadingPage,
    },
    props: {
      default: {
        dependencyModules: ["guild"],
      },
    },
    children: [
      {
        path: "",
        name: "GuildEventsPage",
        component: GuildEventsPage,
      },
      {
        path: "units",
        name: "GuildUnitsPage",
        component: GuildUnitsPage,
      },
    ],
  },
  {
    path: "/damage-calculator",
    components: {
      default: PlayerLoadingPage,
    },
    props: {
      default: {
        dependencyModules: [],
      },
    },
    children: [
      {
        path: "",
        name: "DamageCalculatorPage",
        component: DamageCalculatorPage,
      },
    ],
  },
  {
    path: "/gl-checklist",
    components: {
      default: PlayerLoadingPage,
    },
    props: {
      default: {
        dependencyModules: ["unit", "shards"],
      },
    },
    children: [
      {
        path: "",
        name: "GLChecklist",
        component: GLChecklist,
      },
    ],
  },
  {
    path: "/widgets",
    name: "Widgets",
    components: {
      default: PlayerLoadingPage,
    },
    props: {
      default: {
        dependencyModules: [
          "unit",
          "gear",
          "relic",
          "shards",
          "planner",
          "guild",
          "currency",
        ],
      },
    },
    children: [
      {
        path: "",
        name: "Widgets",
        component: WidgetsPage,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
