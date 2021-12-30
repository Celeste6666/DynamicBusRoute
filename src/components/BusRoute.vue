<template>
  <table
    class="table table-borderless align-middle"
    v-if="routes.length !== 0 && routes[0].RouteUID"
  >
    <tbody>
      <tr
        v-for="route of routes"
        :key="route.RouteUID"
        :class="[
          'bg-white btn-lg position-relative',
          deleteBtnIsShow === route.RouteUID ? 'moveRight' : '',
        ]"
        @pointermove.prevent="showDeleteBtn($event, route.RouteUID)"
        @pointerup.prevent="changeRouterId(route.City, route.RouteName.Zh_tw, route.RouteUID)"
      >
        <td class="">{{ route.RouteName.Zh_tw }}</td>
        <td class="text-end">
          {{ route.DepartureStopNameZh }}
        </td>
        <td>
          <font-awesome-icon :icon="['fas', 'exchange-alt']" class="mx-2" />
        </td>
        <td class="text-start">
          {{ route.DestinationStopNameZh }}
        </td>
        <td
          v-if="$route.name !== 'CollectRoute'"
          @pointerup.prevent.stop="setCollectRoute(route.RouteUID)"
        >
          <font-awesome-icon :icon="[route.isCollect ? 'fas' : 'far', 'bookmark']" class="mx-2" />
        </td>
        <td
          class="w-25 p-0 position-absolute bottom-0 top-0 right-0"
          v-if="$route.name === 'CollectRoute' && deleteBtnIsShow === route.RouteUID"
        >
          <button
            class="w-100 h-100 btn btn-primary rounded-3"
            @pointerup.prevent="removeCollect(route.RouteUID)"
          >
            刪除
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';

export default {
  setup() {
    const { state, commit } = useStore();
    const router = useRouter();

    const routes = computed(() => state.routes);

    // 用來判斷目前是否為pointermove事件，如果是就pointerup事件就return
    const deleteBtnIsShow = ref(null);
    // pointerup
    const changeRouterId = (city, routeName, routeId) => {
      if (deleteBtnIsShow.value !== routeId) {
        router.push({ name: 'Arrival', params: { city, routeName, routeId } });
      }
    };

    let pointerOffsetX = 0;
    const showDeleteBtn = (e, routeId) => {
      if (router.currentRoute.value.name !== 'CollectRoute') return;
      if (!pointerOffsetX) {
        pointerOffsetX = e.offsetX;
        return;
      }
      if (router.currentRoute.value.name === 'CollectRoute' && pointerOffsetX - e.offsetX > 1) {
        deleteBtnIsShow.value = routeId;
        pointerOffsetX = 0;
      } else if (pointerOffsetX - e.offsetX < 0) {
        deleteBtnIsShow.value = '';
        pointerOffsetX = 0;
      }
    };

    const setCollectRoute = (routeId) => {
      let collectRoute = JSON.parse(localStorage.getItem('collectRoute')) || [];
      const storeRoute = routes.value.find((route) => route.RouteUID === routeId);
      console.log(routeId, storeRoute);
      if (storeRoute.isCollect) {
        const storeIndex = collectRoute.findIndex((route) => route.RouteUID === routeId);
        collectRoute.splice(storeIndex, 1);
      } else {
        collectRoute = [...collectRoute, storeRoute];
      }
      localStorage.setItem('collectRoute', JSON.stringify(collectRoute));
      commit('getRouteData', routes.value);
    };

    const removeCollect = (id) => {
      const collectRoute = JSON.parse(localStorage.getItem('collectRoute')) || [];
      const storeIndex = collectRoute.findIndex((route) => route.RouteUID === id);
      collectRoute.splice(storeIndex, 1);
      localStorage.setItem('collectRoute', JSON.stringify(collectRoute));
      commit('getRouteData', JSON.parse(localStorage.getItem('collectRoute')));
    };

    return {
      routes,
      changeRouterId,
      setCollectRoute,
      showDeleteBtn,
      deleteBtnIsShow,
      removeCollect,
    };
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

tr {
  transition: 0.3s linear;
  &.moveRight {
    transform: translate(-88px, 0);
  }
}
</style>
