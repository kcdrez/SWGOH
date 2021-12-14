import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import HomePage from "../pages/homepage.vue";
import UnitPage from "../pages/unitPage.vue";

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
    // props: true,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
