<template>
  <div class="container">
    <div class="row g-0 shadow">
      <div class="col-6 d-grid bg-white">
        <router-link
          to="/collect/station"
          :class="['btn  rounded-3', $route.name === 'CollectStation' ? 'btn-primary' : 'bg-white']"
          >公車站</router-link
        >
      </div>
      <div class="col-6 d-grid">
        <router-link
          to="/collect/route"
          :class="['btn  rounded-3', $route.name === 'CollectRoute' ? 'btn-primary' : 'bg-white']"
          >公車路線</router-link
        >
      </div>
    </div>
    <router-view class="my-2"></router-view>
  </div>
</template>
<script>
import { useStore } from 'vuex';

export default {
  name: 'Collect',
  setup() {
    const { commit } = useStore();
    commit('getRouteData', JSON.parse(localStorage.getItem('collectRoute')));
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
