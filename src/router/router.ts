import { createRouter, createWebHashHistory } from "vue-router";

import PlayerLoadingPage from "pages/loading/playerLoadingPage.vue";
import UnitLoadingPage from "pages/loading/unitLoadingPage.vue";
import BasicLoadingPage from "pages/loading/basicLoadingPage.vue";
import HomePage from "pages/general/homepage.vue";
import UnitPage from "pages/units/unitPage.vue";
import GeneralPlannerPage from "pages/general/generalPlanner.vue";
import TeamPage from "pages/units/team.vue";
import MatchUpPage from "pages/units/matchUpPage.vue";
import GameSimulationPage from "pages/units/gameSimulation.vue";
import CharacterFarmingPage from "pages/units/characterFarming.vue";
import GuildEventsPage from "pages/guild/guildEvents.vue";
import GuildUnitsPage from "pages/guild/guildUnits.vue";
import GuildGoalsPage from "pages/guild/guildGoals.vue";
import GuildGoalDetails from "pages/guild/goalDetailsPage.vue";
import StatCalculatorPage from "pages/units/statCalculator.vue";
import GLChecklist from "pages/goals/glChecklist.vue";
import GLCompare from "pages/goals/glCompare.vue";
import GoalsPage from "pages/goals/goalsPage.vue";
import GoalDetails from "pages/goals/goalDetailsPage.vue";
import TBStatusPage from "pages/guild/TBStatusPage.vue";
import TWPlannerPage from "pages/guild/twPlanner.vue";
import GuildStats from "pages/guild/guildStats.vue";
import WidgetsPage from "pages/general/widgets.vue";
import GearListPage from "pages/gear/gearList.vue";
// import GearPage from "pages/gearPage.vue";
import ScavengerPage from "pages/relic/scavenger.vue";
import UnitSearchPage from "pages/units/unitSearch.vue";
import RelicCalculatorPage from "pages/relic/relicCalculator.vue";
import SettingsPage from "pages/general/settings.vue";

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
    path: "/settings",
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
        name: "SettingsPage",
        component: SettingsPage,
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
        errorLoading: "no loading",
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
    path: "/game_simulation",
    components: {
      default: PlayerLoadingPage,
    },
    props: {
      default: {
        dependencyModules: ["teams", "opponents"],
        errorLoading: "no loading",
      },
    },
    children: [
      {
        path: "",
        name: "GameSimulationPage",
        component: GameSimulationPage,
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
        dependencyModules: ["guild", "teams", "unit"],
      },
    },
    children: [
      {
        path: "events",
        name: "GuildEventsPage",
        component: GuildEventsPage,
      },
      {
        path: "units",
        name: "GuildUnitsPage",
        component: GuildUnitsPage,
      },
      {
        path: "goals",
        name: "GuildGoalsPage",
        component: GuildGoalsPage,
      },
      {
        path: "goal/:goalName",
        name: "GuildGoalDetails",
        component: GuildGoalDetails,
      },
    ],
  },
  {
    path: "/guild/:guildId?",
    components: {
      default: BasicLoadingPage,
    },
    props: {
      default: {
        dependencyModules: ["guild", "teams", "unit"],
      },
    },
    children: [
      {
        path: "events",
        name: "GuildEventsPage",
        component: GuildEventsPage,
      },
      {
        path: "units",
        name: "GuildUnitsPage",
        component: GuildUnitsPage,
      },
      {
        path: "stats",
        name: "GuildStats",
        component: GuildStats,
      },
    ],
  },
  {
    path: "/stat-calculator",
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
        name: "StatCalculatorPage",
        component: StatCalculatorPage,
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
    path: "/gl-compare",
    components: {
      default: PlayerLoadingPage,
    },
    props: {
      default: {
        dependencyModules: ["unit", "shards", "gear", "relic"],
      },
    },
    children: [
      {
        path: "",
        name: "GLCompare",
        component: GLCompare,
      },
    ],
  },
  {
    path: "/goal-list",
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
        name: "GoalsPage",
        component: GoalsPage,
      },
    ],
  },
  {
    path: "/goal/:goalName",
    components: {
      default: PlayerLoadingPage,
    },
    props: {
      default: {
        dependencyModules: ["unit", "gear", "relic"],
      },
    },
    children: [
      {
        path: "",
        name: "GoalDetails",
        component: GoalDetails,
      },
    ],
  },
  {
    path: "/tb-status",
    components: {
      default: PlayerLoadingPage,
    },
    props: {
      default: {
        dependencyModules: ["unit", "guild"],
      },
    },
    children: [
      {
        path: "",
        name: "TBStatusPage",
        component: TBStatusPage,
      },
    ],
  },
  {
    path: "/tw-planner",
    components: {
      default: PlayerLoadingPage,
    },
    props: {
      default: {
        dependencyModules: ["unit", "guild", "teams"],
      },
    },
    children: [
      {
        path: "",
        name: "TWPlannerPage",
        component: TWPlannerPage,
      },
    ],
  },
  {
    path: "/widgets",
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
  {
    path: "/gear-list",
    components: {
      default: UnitLoadingPage,
    },
    props: {
      default: {
        dependencyModules: ["shards", "gear"],
        loadAsync: false,
      },
    },
    children: [
      {
        path: "",
        name: "GearList",
        component: GearListPage,
      },
    ],
  },
  {
    path: "/search",
    components: {
      default: UnitLoadingPage,
    },
    props: {
      default: {
        dependencyModules: [],
      },
    },
    children: [
      {
        path: "",
        name: "UnitSearchPage",
        component: UnitSearchPage,
      },
    ],
  },
  {
    path: "/scavenger",
    components: {
      default: BasicLoadingPage,
    },
    props: {
      default: {
        dependencyModules: ["shards", "gear"],
        loadAsync: false,
      },
    },
    children: [
      {
        path: "",
        name: "ScavengerPage",
        component: ScavengerPage,
      },
    ],
  },
  {
    path: "/relic-calculator",
    components: {
      default: BasicLoadingPage,
    },
    props: {
      default: {
        dependencyModules: ["shards", "gear"],
        loadAsync: false,
      },
    },
    children: [
      {
        path: "",
        name: "RelicCalculator",
        component: RelicCalculatorPage,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
