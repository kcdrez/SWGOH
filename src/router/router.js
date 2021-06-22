import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import HomePage from '../pages/homepage.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;