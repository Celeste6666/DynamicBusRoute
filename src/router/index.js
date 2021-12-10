import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Bus from '@/views/Bus.vue';
import Arrival from '@/views/Arrival.vue';
import NearBus from '@/views/NearBus.vue';

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
  {
    path: '/nearBus',
    name: 'NearBus',
    component: NearBus,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
