<template>
  <Map />
  <article class="container position-relative" style="top: 120px; padding-bottom: 180px">
    <div class="accordion my-2" v-if="nearBusStop.length !== 0">
      <div
        class="accordion-item my-3 border-0"
        v-for="busStop of nearBusStop"
        :key="busStop.StationUID"
      >
        <h2 class="accordion-header">
          <button
            :class="['accordion-button  px-3', open === busStop.StationUID ? '' : 'collapsed']"
            type="button"
            data-bs-toggle="collapse"
            :data-bs-target="`#${busStop.StationUID}`"
            aria-expanded="false"
            :aria-controls="busStop.StationUID"
            @click.prevent="changeOpenId(busStop.StationUID)"
          >
            <div class="row w-75 g-1 align-items-center">
              <div class="col-6">{{ busStop.StationName.Zh_tw }}</div>
              <div class="col-6 d-flex flex-wrap">
                <span class="m-1" v-for="stop of busStop.Stops" :key="stop.RouteUID">{{
                  stop.RouteName.Zh_tw
                }}</span>
              </div>
            </div>
          </button>
        </h2>
        <div
          :id="busStop.StationUID"
          :class="['accordion-collapse collapse', open === busStop.StationUID ? 'show' : '']"
          aria-labelledby="headingOne"
        >
          <div class="container px-3 py-1" v-if="stationRoute.length !== 0">
            <router-link
              :to="{
                name: 'Arrival',
                params: { city, routeName: stop.RouteName.Zh_tw, routeId: stop.RouteUID },
              }"
              class="row g-2 align-items-center my-2 text-decoration-none"
              v-for="stop of stationRoute"
              :key="stop.RouteUID"
            >
              <div class="col-3 text-start">{{ stop.RouteName.Zh_tw }}</div>
              <div class="col-7">
                <span class="m-1">往{{ stop.DepartureStopNameZh }}</span>
              </div>
              <span class="col-2 text-end p-2">
                <font-awesome-icon :icon="['far', 'bookmark']" class="fs-4" />
              </span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
<script>
import { useStore } from 'vuex';
import { ref, computed, watch } from 'vue';
import Map from '@/components/Map.vue';
// @ is an alias to /src

export default {
  name: 'NearBus',
  components: {
    Map,
  },
  setup() {
    const { state, dispatch } = useStore();
    const open = ref(null);
    const nearBusStop = computed(() => state.NearLocationBus);

    // 當按下選單後才取得該站各路線資料
    const stationRoute = ref([]);
    const city = computed(() => state.location.city);
    const changeOpenId = (id) => {
      open.value = id;
    };
    watch(open, (newId, oldId) => {
      if (newId && newId !== oldId) {
        stationRoute.value = [];
        const station = nearBusStop.value.find((item) => item.StationUID === newId);
        station.Stops.forEach(async (item) => {
          const stop = item;
          const busDestinationStopRes = await dispatch('getDestinationStop', {
            city: city.value,
            RouteName: stop.RouteName.Zh_tw,
            RouteUID: stop.RouteUID,
          });
          const data = await busDestinationStopRes.json();
          stationRoute.value = [
            ...stationRoute.value,
            { ...stop, DepartureStopNameZh: data[0].DepartureStopNameZh },
          ];
        });
      }
    });

    return {
      open,
      city,
      nearBusStop,
      changeOpenId,
      stationRoute,
    };
  },
};
</script>
