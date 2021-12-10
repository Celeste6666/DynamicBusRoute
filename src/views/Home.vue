<template>
  <article class="home container">
    <div class="d-grid gap-3 my-4">
      <router-link to="/bus" class="btn py-3 bg-white rounded-3 shadow">
        <div class="h5">公車查詢</div>
        <small class="text-success">查詢指定公車路線及其停靠站</small>
      </router-link>
      <router-link to="/NearBus" class="btn py-3 bg-white rounded-3 shadow">
        <div class="h5">附近公車</div>
        <small class="text-success">查詢附近公車站及其路線</small>
      </router-link>
      <router-link to="/collect" class="btn py-3 bg-white rounded-3 shadow">
        <div class="h5">我的收藏</div>
        <small class="text-success">收藏的公車站及路線</small>
      </router-link>
    </div>
    <div style="padding-bottom: 80px">
      <div
        class="d-flex flex-column justify-content-center align-items-center"
        style="height: 25vh"
        v-if="!location"
      >
        <div class="small mb-1">開啟定位服務，以獲得更多資訊</div>
        <button class="btn btn-lg px-3 w-75 bg-white rounded-3 shadow" @click="openGeolocation">
          開啟定位服務
        </button>
      </div>
      <div class="bg-white p-3 rounded-3 shadow" v-if="location">
        <div class="text-start">附近公車</div>
        <table class="table table-borderless align-middle my-2" v-if="NearLocationBus.length !== 0">
          <tbody>
            <tr v-for="stop of NearLocationBus" :key="stop.StopUID">
              <td class="text-start">
                <h5 class="fw-bold">{{ stop.RouteName.Zh_tw }}</h5>
                <div class="text-success fs-xs">往東門捷運站</div>
              </td>
              <td class="text-start">
                <h5 class="fw-bold">{{ stop.StopName.Zh_tw }}</h5>
                <div class="text-success fs-xs">{{ stop.distance }}公尺</div>
              </td>
              <td class="text-end">
                <div>3分</div>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>1 公里內查無公車</p>
        <router-link to="/NearBus" class="btn text-success">查詢其他公車路線</router-link>
      </div>
    </div>
  </article>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import getLocation from '@/hook/getLocation';
// @ is an alias to /src

export default {
  name: 'Home',
  components: {},
  setup() {
    const { getters } = useStore();
    const location = ref(false);

    const openGeolocation = () => {
      location.value = true;
      getLocation(1000);
    };

    const NearLocationBus = computed(() => getters.filterNearLocationBus.slice(0, 4));

    return {
      location,
      openGeolocation,
      NearLocationBus,
    };
  },
};
</script>
