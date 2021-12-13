<template>
  <table class="table table-borderless align-middle" v-if="stations.length !== 0">
    <tbody>
      <tr
        :class="[
          'bg-white position-relative',
          deleteBtnIsShow === station.stop.StopUID ? 'moveRight' : '',
        ]"
        v-for="station of stations"
        :key="station.stop.StopUID"
        @pointermove.prevent="showDeleteBtn($event, station.stop.StopUID)"
      >
        <td class="text-start">
          <h5>{{ station.route.RouteName.Zh_tw }}</h5>
          <div class="text-success fs-xs">往{{ station.route.DestinationStopNameZh }}</div>
        </td>
        <td class="text-start">
          <h5 class="m-0">{{ station.stop.StopName.Zh_tw }}</h5>
        </td>
        <template v-for="estimate of estimateTime" :key="estimate.StopUID">
          <td class="text-end" v-if="station.stop.StopUID === estimate.StopUID">
            {{
              estimate.EstimateTime
                ? `${Math.ceil(estimate.EstimateTime / 60)}分`
                : '未提供預估抵達時間'
            }}
          </td>
        </template>
        <td
          class="w-25 h-100 p-0 position-absolute right-0"
          v-if="deleteBtnIsShow === station.stop.StopUID"
        >
          <button
            class="w-100 h-100 btn btn-primary rounded-3"
            @pointerup.prevent="removeCollect(station.stop.StopUID)"
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
import { ref, watch } from 'vue';

export default {
  name: 'CollectStation',
  setup() {
    const { state, getters } = useStore();
    const stations = ref(JSON.parse(localStorage.getItem('collectStation')));
    const estimateTime = ref([]);

    watch(
      stations,
      (newVal, oldVal) => {
        if (newVal.length !== 0 && newVal !== oldVal) {
          const { Estimated_url: estimated } = state.api;
          newVal.forEach(async (item) => {
            const res = await fetch(
              `${estimated}${item.route.City}/${item.route.RouteName.Zh_tw}?$filter=RouteUID eq '${item.route.RouteUID}' and contains(StopUID, '${item.stop.StopUID}')&$orderBy=StopSequence&$format=JSON`,
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
tr {
  transition: 0.3s linear;
  &.moveRight {
    transform: translate(-88px, 0);
  }
}
</style>
