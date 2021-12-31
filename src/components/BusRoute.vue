<template>
  <div class="container" v-if="routes.length !== 0 && routes[0].RouteUID">
    <div
      v-for="route of routes"
      :key="route.RouteUID"
      :class="[
        'row gx-2 justify-content-between  align-items-center my-3 bg-white py-2 px-1  rounded-3',
        deleteBtnIsShow === route.RouteUID ? 'moveRight' : '',
      ]"
      @pointermove.prevent="showDeleteBtn($event, route.RouteUID)"
      @pointerup.prevent="changeRouterId(route.City, route.RouteName.Zh_tw, route.RouteUID)"
    >
      <div class="col-auto">{{ route.RouteName.Zh_tw }}</div>
      <div class="col text-center">
        <span>{{ route.DepartureStopNameZh }}</span>
        <font-awesome-icon :icon="['fas', 'exchange-alt']" class="mx-2" />
        <span>{{ route.DestinationStopNameZh }}</span>
      </div>
      <div
        class="col-1 ms-auto"
        v-if="$route.name !== 'CollectRoute'"
        @pointerup.prevent.stop="setCollectRoute(route.RouteUID)"
      >
        <font-awesome-icon :icon="[route.isCollect ? 'fas' : 'far', 'bookmark']" class="mx-2" />
      </div>
      <div
        class="p-0 text-nowrap col-auto"
        v-if="$route.path !== '/bus' && deleteBtnIsShow === route.RouteUID"
      >
        <button
          class="btn btn-primary rounded-3 h-100 px-4"
          @pointerup.prevent="removeCollect(route.RouteUID)"
        >
          刪除
        </button>
      </div>
    </div>
  </div>
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
      console.log(router.currentRoute.value.path);
      if (router.currentRoute.value.path === '/bus') return;
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

.row {
  transition: 0.3s linear;
  &.moveRight {
    position: relative;
    transform: translateX(-80px);
    & .col-auto:last-child {
      position: absolute;
      top: 0;
      bottom: 0;
      right: -85px;
    }
  }
}
</style>
