import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Bus from '@/views/Bus.vue';
import Arrival from '@/views/Arrival.vue';
import NearBus from '@/views/NearBus.vue';
import Collect from '@/views/Collect.vue';
import CollectStation from '@/components/CollectStation.vue';
import CollectRoute from '@/components/CollectRoute.vue';

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
  {
    path: '/collect',
    name: 'Collect',
    component: Collect,
    children: [
      {
        path: 'station',
        name: 'CollectStation',
        component: CollectStation,
      },
      {
        path: 'route',
        name: 'CollectRoute',
        component: CollectRoute,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
