<template>
  <table
    class="table table-borderless align-middle"
    v-if="routes.length !== 0 && routes[0].RouteUID"
  >
    <tbody>
      <tr
        class="bg-white btn-lg"
        v-for="route of routes"
        :key="route.RouteUID"
        @click="changeRouterId(route.City, route.RouteName.Zh_tw, route.RouteUID)"
      >
        <td class="px-0">{{ route.RouteName.Zh_tw }}</td>
        <td class="px-0 text-end">
          {{ route.DepartureStopNameZh }}
        </td>
        <td class="px-0">
          <font-awesome-icon :icon="['fas', 'exchange-alt']" class="mx-2" />
        </td>
        <td class="px-0 text-start">
          {{ route.DestinationStopNameZh }}
        </td>
        <td v-if="$route.name !== 'CollectRoute'" @click.stop="setCollectRoute(route.RouteUID)">
          <font-awesome-icon :icon="[route.isCollect ? 'fas' : 'far', 'bookmark']" class="mx-2" />
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

export default {
  setup() {
    const { state, commit } = useStore();
    const router = useRouter();

    const routes = computed(() => state.routes);

    const changeRouterId = (city, routeName, routeId) => {
      router.push({ name: 'Arrival', params: { city, routeName, routeId } });
    };

    const setCollectRoute = (routeId) => {
      let collectRoute = JSON.parse(localStorage.getItem('collectRoute')) || [];
      const storeRoute = routes.value.find((route) => route.RouteUID === routeId);
      if (storeRoute.isCollect) {
        const storeIndex = collectRoute.findIndex((route) => route.RouteUID === routeId);
        collectRoute.splice(storeIndex, 1);
      } else {
        collectRoute = [...collectRoute, storeRoute];
      }
      localStorage.setItem('collectRoute', JSON.stringify(collectRoute));
      commit('getRouteData', routes.value);
    };

    return { routes, changeRouterId, setCollectRoute };
  },
};
</script>
<style lang="scss" scoped>
table {
  border-collapse: separate; //設定表格的邊框是否被合併
  border-spacing: 0px 1rem; //第一個引數代表td的間距，第二個引數代表tr的行距。
  td:first-child {
    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
  }

  td:last-child {
    border-top-right-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
  }
}
</style>
