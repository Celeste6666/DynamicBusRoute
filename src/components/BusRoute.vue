<template>
  <table
    class="table table-borderless align-middle"
    v-if="routes.length !== 0 && routes[0].RouteUID"
  >
    <tbody>
      <tr
        class="bg-white btn-lg"
        v-for="route of routes"
        :key="route.RouteUID"
        @click="changeRouterId(route.City, route.RouteName.Zh_tw, route.RouteUID)"
      >
        <td class="px-0">{{ route.RouteName.Zh_tw }}</td>
        <td class="px-0 text-end">
          {{ route.DepartureStopNameZh }}
        </td>
        <td class="px-0">
          <font-awesome-icon :icon="['fas', 'exchange-alt']" class="mx-2" />
        </td>
        <td class="px-0 text-start">
          {{ route.DestinationStopNameZh }}
        </td>
        <td>
          <font-awesome-icon :icon="['far', 'bookmark']" class="mx-2" />
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

export default {
  setup() {
    const { state } = useStore();
    const router = useRouter();

    const routes = computed(() => state.routes);

    const changeRouterId = (city, routeName, routeId) => {
      router.push({ name: 'Arrival', params: { city, routeName, routeId } });
    };

    return { routes, changeRouterId };
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
</style>
