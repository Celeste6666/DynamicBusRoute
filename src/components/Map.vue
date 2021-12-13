<template>
  <l-map
    ref="busMap"
    :class="[$route.name === 'Arrival' ? 'position-fixed' : 'position-relative']"
    style="height: 40vh; width: 100%; top: 102px"
    :zoom="zoom"
    :center="center"
    :options="{ zoomControl: false }"
    @ready="ready"
  >
    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    <template v-if="$route.name === 'Arrival'">
      <l-control
        :position="'bottomright'"
        ref="control"
        @pointerup="changeMapIsShow"
        v-if="$route.name === 'Arrival'"
      >
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
    </template>
    <!-- 目前位置 -->
    <template v-if="$route.name === 'NearBus'">
      <l-marker :lat-lng="center">
        <l-icon>
          <font-awesome-icon :icon="['fas', 'map-marker-alt']" class="text-primary display-5" />
        </l-icon>
      </l-marker>
      <!-- 各站牌位置 -->
      <template v-if="nearBusStop.length !== 0">
        <l-marker
          v-for="station of nearBusStop"
          :key="station.StationUID"
          :lat-lng="[station.StationPosition.PositionLat, station.StationPosition.PositionLon]"
        >
          <l-icon>
            <font-awesome-icon
              :icon="['fas', 'map-pin']"
              :class="[
                'display-6',
                openStationUid === station.StationUID ? 'text-danger' : 'text-success',
              ]"
            />
          </l-icon>
        </l-marker>
      </template>
    </template>
  </l-map>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { computed, onUnmounted, ref, watch } from 'vue';
import { LMap, LTileLayer, LPolyline, LControl, LMarker, LIcon } from '@vue-leaflet/vue-leaflet';
import getLocation from '@/hook/getLocation';

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
    openStationUid: String,
  },
  setup(props, { emit }) {
    console.log('Map');
    const { state, getters, dispatch } = useStore();
    const { currentRoute } = useRouter();

    const busMap = ref(null);
    const center = ref([25, 121]);
    const zoom = ref(18);
    const control = ref(null);

    // 找出特定路線相關訊息
    const { city, routeName, routeId } = currentRoute.value.params;
    let updateBusMarker;
    const getAllData = () => {
      if (currentRoute.value.name === 'Arrival') {
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

        updateBusMarker = setInterval(() => {
          dispatch('getData', {
            type: 'realTimeByFrequency',
            city,
            routeName,
            routeId,
          });
        }, 30000);
      } else if (currentRoute.value.name === 'NearBus') {
        // 取得目前位置
        getLocation(4500);
      }
    };

    const ready = () => {
      getAllData();
    };

    // Arrival
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

    // NearBus
    const nearBusStop = computed(() => state.NearLocationBus);
    const location = computed(() => state.location);

    watch(location, (newVal) => {
      console.log(newVal);
      const { lat, lon } = newVal;
      center.value = [lat, lon];
      zoom.value = 13;
      busMap.value.leafletObject.flyTo([lat, lon], zoom.value);
    });

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
      nearBusStop,
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
