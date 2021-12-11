<template>
  <table class="table table-borderless align-middle" v-if="stations.length !== 0">
    <tbody>
      <tr class="bg-white" v-for="station of stations" :key="station.stop.StopUID">
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
      </tr>
    </tbody>
  </table>
</template>
<script>
import { useStore } from 'vuex';
import { ref, computed, watch } from 'vue';

export default {
  name: 'CollectStation',
  setup() {
    const { state, getters } = useStore();
    const stations = computed(() => JSON.parse(localStorage.getItem('collectStation')));
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

    return {
      stations,
      estimateTime,
    };
  },
};
</script>
