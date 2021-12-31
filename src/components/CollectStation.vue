<template>
  <div
    :class="[
      'row gx-2 justify-content-between align-items-center my-3 bg-white py-2 px-1 rounded-3',
      deleteBtnIsShow === station.stop.StopUID ? 'moveRight' : '',
    ]"
    v-for="station of stations"
    :key="station.stop.StopUID"
    @pointermove.prevent="showDeleteBtn($event, station.stop.StopUID)"
  >
    <div class="col-auto text-start">
      <h5 class="m-0">{{ station.route.RouteName.Zh_tw }}</h5>
      <div class="text-success fs-xs">往{{ station.route.DestinationStopNameZh }}</div>
    </div>
    <div class="col-auto text-start">
      <h5 class="m-0">{{ station.stop.StopName.Zh_tw }}</h5>
    </div>
    <template v-for="estimate of estimateTime" :key="estimate.StopUID">
      <div class="col-auto text-end" v-if="station.stop.StopUID === estimate.StopUID">
        {{
          estimate.EstimateTime
            ? `${Math.ceil(estimate.EstimateTime / 60)}分`
            : '未提供預估抵達時間'
        }}
      </div>
    </template>
    <div class="col-auto p-0 text-nowrap" v-if="deleteBtnIsShow === station.stop.StopUID">
      <button
        class="btn btn-primary rounded-3 h-100 px-4"
        @pointerup.prevent="removeCollect(station.stop.StopUID)"
      >
        刪除
      </button>
    </div>
  </div>
</template>
<script>
import { useStore } from 'vuex';
import { ref, watch } from 'vue';

export default {
  name: 'CollectStation',
  setup() {
    const { state, getters } = useStore();
    const stations = ref(JSON.parse(localStorage.getItem('collectStation')) || []);
    const estimateTime = ref([]);

    watch(
      stations,
      (newVal, oldVal) => {
        if (newVal.length !== 0 && newVal !== oldVal) {
          const { Estimated_url: estimated } = state.api;
          newVal.forEach(async (item) => {
            const res = await fetch(
              `${estimated}${item.route.City}/${item.route.RouteName.Zh_tw}?$filter=RouteUID eq '${item.route.RouteUID}' and contains(StopUID, '${item.stop.StopUID}') and Direction eq '去程'&$top=1&$format=JSON`,
              getters.headers,
            );
            const data = await res.json();
            estimateTime.value = [...estimateTime.value, ...data];
          });
        }
      },
      { immediate: true },
    );

    // 用來判斷目前是否為pointermove事件，如果是就pointerup事件就return
    const deleteBtnIsShow = ref(null);

    let pointerOffsetX = 0;
    const showDeleteBtn = (e, stopId) => {
      if (!pointerOffsetX) {
        pointerOffsetX = e.offsetX;
        return;
      }
      if (pointerOffsetX - e.offsetX > 1) {
        deleteBtnIsShow.value = stopId;
        pointerOffsetX = 0;
      } else if (pointerOffsetX - e.offsetX < 0) {
        deleteBtnIsShow.value = '';
        pointerOffsetX = 0;
      }
    };

    const removeCollect = (id) => {
      const collectStation = JSON.parse(localStorage.getItem('collectStation')) || [];
      const storeIndex = collectStation.findIndex((station) => station.stop.StopUID === id);
      collectStation.splice(storeIndex, 1);
      localStorage.setItem('collectStation', JSON.stringify(collectStation));
      stations.value = JSON.parse(localStorage.getItem('collectStation'));
    };

    return {
      stations,
      estimateTime,
      deleteBtnIsShow,
      showDeleteBtn,
      removeCollect,
    };
  },
};
</script>
<style lang="scss" scoped>
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
