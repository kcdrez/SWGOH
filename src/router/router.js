import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/homepage.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  }
]

const router = createRouter({
  // history: createWebHistory(),
  routes
});

export default router;