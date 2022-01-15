import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import HomePage from "../pages/homepage.vue";
import UnitPage from "../pages/unitPage.vue";
import ShardCalculatorPage from "../pages/shardCalculator.vue";
import GeneralPlannerPage from "../pages/generalPlanner.vue";

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
    path: "/shard-calculator",
    name: "ShardCalculatorPage",
    component: ShardCalculatorPage,
  },
  {
    path: "/general-planner",
    name: "GeneralPlannerPage",
    component: GeneralPlannerPage,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
