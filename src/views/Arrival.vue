<template>
  <Map v-if="mapIsShow" :direction="direction" @changeMapIsShow="changeMapIsShow" />
  <article class="arrival container pt-3 position-absolute" :class="{ 'map-show': mapIsShow }">
    <div class="btn btn-lg bg-white rounded-3 shadow d-flex justify-content-between my-2">
      <div class="text-start" v-if="route.length !== 0">
        <div class="fs-6">{{ route[0].RouteName.Zh_tw }}</div>
        <div class="align-bottom fs-6">
          <span v-if="direction === 0">往{{ route[0].DestinationStopNameZh }}</span>
          <span v-else>往{{ route[0].DepartureStopNameZh }}</span>
          <span class="fs-4 p-2" @click="changeMapIsShow">
            <font-awesome-icon :icon="['far', 'map']" class="" />
          </span>
        </div>
      </div>
      <div class="text-end">
        <div class="fs-4 p-2" @click.stop="changeRouteDirection">
          <font-awesome-icon :icon="['fas', 'exchange-alt']" class="fs-4 ms-2" />
        </div>
      </div>
    </div>
    <section class="mt-3">
      <template v-if="stops.length !== 0">
        <template v-for="stop of stops[0].Stops" :key="stop.StopUID">
          <div class="d-flex align-items-center my-2">
            <template v-for="estimate of estimateds" :key="estimate.StopUID">
              <span
                v-if="estimate.StopUID === stop.StopUID"
                :class="[
                  'text-white px-3 py-2 rounded-3 btn-sm w-25',
                  estimate.StopStatus > 0 ? 'bg-success' : '',
                  Math.floor(estimate.EstimateTime / 60) < 1 ? 'bg-danger' : '',
                  3 >= Math.floor(estimate.EstimateTime / 60) >= 1 ? 'bg-warning' : '',
                  Math.floor(estimate.EstimateTime / 60) > 3 ? 'bg-primary' : '',
                ]"
              >
                {{
                  estimate.StopStatus > 0
                    ? '尚未發車'
                    : '' || Math.floor(estimate.EstimateTime / 60) >= 1
                    ? `${Math.floor(estimate.EstimateTime / 60)}分`
                    : '即將進站'
                }}
              </span>
            </template>
            <span class="fs-6 mx-2">{{ stop.StopName.Zh_tw }}</span>
            <template v-for="acc of accurateStops" :key="acc.StopUID">
              <span
                class="bg-warning text-white px-2 rounded-3 fs-xs"
                v-if="acc.StopUID === stop.StopUID"
                >{{ acc.PlateNumb }}
              </span>
            </template>

            <span class="ms-auto p-2" @click.stop="setCollectStation(stop.StopUID)">
              <font-awesome-icon
                :icon="[stop.isCollect ? 'fas' : 'far', 'bookmark']"
                class="mx-2 fs-4"
              />
            </span>
          </div>
        </template>
      </template>
    </section>
  </article>
</template>
<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ref, computed, onUnmounted } from 'vue';
import Map from '@/components/Map.vue';

export default {
  name: 'Arrival',
  components: {
    Map,
  },
  setup() {
    const { state, getters, dispatch, commit } = useStore();
    const { currentRoute } = useRouter();
    const mapIsShow = ref(false);

    // 找出特定路線相關訊息
    // 以防直接輸入查詢網址
    const { city, routeName, routeId } = currentRoute.value.params;

    const getAllData = () => {
      dispatch('getData', {
        type: 'route',
        routeName,
        city,
        routeId,
      });

      dispatch('getData', {
        type: 'stop',
        routeName,
        city,
        routeId,
      });

      dispatch('getData', {
        type: 'realTimeNearStop',
        routeName,
        city,
        routeId,
      });

      dispatch('getData', {
        type: 'estimated',
        routeName,
        city,
        routeId,
      });
    };
    getAllData();
    // 每 30 秒 資料重整
    const updateBus = setInterval(() => {
      getAllData();
    }, 30000);

    const direction = ref(0);

    const changeRouteDirection = () => {
      direction.value = Number(!direction.value);
    };
    const route = computed(() => getters.filterRoute(routeId));
    const stops = computed(() => getters.filterStopRoute(direction.value));
    const accurateStops = computed(() => getters.filterRealTimeNearStop(direction.value));
    const estimateds = computed(() => getters.filterEstimatedBus(direction.value));

    const changeMapIsShow = () => {
      mapIsShow.value = !mapIsShow.value;
    };

    // 收藏車站
    const setCollectStation = (stationId) => {
      let collectStation = JSON.parse(localStorage.getItem('collectStation')) || [];
      const storeStation = stops.value[0].Stops.find((stop) => stop.StopUID === stationId);
      if (storeStation.isCollect) {
        const storeIndex = collectStation.findIndex((stop) => stop.StopUID === stationId);
        collectStation.splice(storeIndex, 1);
      } else {
        collectStation = [...collectStation, { route: route.value[0], stop: storeStation }];
      }
      localStorage.setItem('collectStation', JSON.stringify(collectStation));
      commit('getStopData', state.selectedRoute.Stops);
    };

    onUnmounted(() => {
      clearInterval(updateBus);
    });

    return {
      mapIsShow,
      direction,
      route,
      changeRouteDirection,
      stops,
      accurateStops,
      estimateds,
      changeMapIsShow,
      setCollectStation,
    };
  },
};
</script>
<style lang="scss" scoped>
.arrival {
  z-index: 998;
  top: calc(102px);
  background: linear-gradient(to bottom, #faf0df, #ededcc);
  transition: 0.3s linear;
  padding-bottom: 50px;
}
.map-show {
  top: calc(40vh + 102px);
}
</style>
