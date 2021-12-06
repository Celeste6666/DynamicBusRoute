<template>
  <l-map
    ref="busMap"
    class="position-fixed"
    style="height: 40vh; width: 100%; top: 102px"
    :zoom="zoom"
    :center="center"
    :options="{ zoomControl: false }"
    @ready="ready"
  >
    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    <l-control :position="'bottomright'" ref="control" @click="changeMapIsShow">
      <button class="btn btn-lg bg-white border-primary text-primary">
        <font-awesome-icon :icon="['fas', 'chevron-up']" class="" />
      </button>
    </l-control>
    <!-- 路線 -->
    <template v-if="shape.Geometry.coordinates.length !== 0">
      <l-polyline
        :lat-lngs="shape.Geometry.coordinates"
        :color="'#929259'"
        :opacity="0.45"
        ref="routeShape"
      />
    </template>

    <!-- 各站牌位置 -->
    <template v-if="stops.length !== 0">
      <l-marker
        v-for="stop of stops[0].Stops"
        :key="stop.StopID"
        :lat-lng="[stop.StopPosition.PositionLat, stop.StopPosition.PositionLon]"
      >
        <l-icon>
          <font-awesome-icon :icon="['fas', 'map-pin']" class="display-6 text-danger" />
        </l-icon>
      </l-marker>
    </template>
    <!-- 公車目前位置 -->
    <template v-if="RealTimeByFrequency.length !== 0">
      <l-marker
        v-for="bus of RealTimeByFrequency"
        :key="bus.PlateNumb"
        :lat-lng="[bus.BusPosition.PositionLat, bus.BusPosition.PositionLon]"
      >
        <l-icon>
          <font-awesome-icon :icon="['fas', 'bus']" class="text-primary display-5" />
        </l-icon>
      </l-marker>
    </template>
  </l-map>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { computed, onUnmounted, ref, watch } from 'vue';
import { LMap, LTileLayer, LPolyline, LControl, LMarker, LIcon } from '@vue-leaflet/vue-leaflet';

export default {
  name: 'Map',
  components: {
    LMap,
    LTileLayer,
    LPolyline,
    LControl,
    LMarker,
    LIcon,
  },
  props: {
    direction: Number,
  },
  setup(props, { emit }) {
    const { state, getters, dispatch } = useStore();
    const { currentRoute } = useRouter();

    const busMap = ref(null);
    const center = ref([25, 121]);
    const zoom = ref(18);
    const control = ref(null);

    // 找出特定路線相關訊息
    const { city, routeName, routeId } = currentRoute.value.params;
    const getAllData = () => {
      // 車輛位置
      dispatch('getData', {
        type: 'realTimeByFrequency',
        city,
        routeName,
        routeId,
      });
      // 路線
      dispatch('getData', {
        type: 'shape',
        city,
        routeName,
        routeId,
      });

      // 站牌
      dispatch('getData', {
        type: 'stop',
        routeName,
        city,
        routeId,
      });
    };

    const ready = () => {
      getAllData();
    };
    const updateBusMarker = setInterval(() => {
      dispatch('getData', {
        type: 'realTimeByFrequency',
        city,
        routeName,
        routeId,
      });
    }, 30000);

    // 路線
    const routeShape = ref(null);
    const shape = computed(() => state.selectedRoute.shape);

    // 站牌
    const stops = computed(() => getters.filterStopRoute(props.direction));

    // 車輛位置
    const RealTimeByFrequency = computed(() => getters.filterRealTimeByFrequency(props.direction));

    watch(
      () => shape.value.Geometry.coordinates,
      (newVal) => {
        if (newVal.length !== 0) {
          let minLat = newVal[0][0];
          let minLon = newVal[0][1];
          let maxLat = 0;
          let maxLon = 0;
          newVal.forEach((item) => {
            minLat = item[0] < minLat ? item[0] : minLat;
            minLon = item[1] < minLon ? item[1] : minLon;
            maxLat = item[0] > maxLat ? item[0] : maxLat;
            maxLon = item[1] > maxLon ? item[1] : maxLon;
          });
          busMap.value.leafletObject.flyToBounds([
            [minLat, minLon],
            [maxLat, maxLon],
          ]);
        }
      },
    );

    const changeMapIsShow = () => {
      emit('changeMapIsShow');
    };

    onUnmounted(() => {
      clearInterval(updateBusMarker);
    });

    return {
      busMap,
      ready,
      center,
      zoom,
      control,
      routeShape,
      shape,
      stops,
      RealTimeByFrequency,
      changeMapIsShow,
    };
  },
  data() {
    return {
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
