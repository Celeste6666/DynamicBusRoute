import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Bus from '@/views/Bus.vue';
import Arrival from '@/views/Arrival.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/bus',
    name: 'Bus',
    component: Bus,
  },
  {
    path: '/bus/:city/:routeName/:routeId',
    name: 'Arrival',
    component: Arrival,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
