<template>
  <aside
    class="offcanvas offcanvas-end"
    tabindex="-1"
    id="menu"
    ref="menu"
    aria-labelledby="offcanvasExampleLabel"
  >
    <div class="offcanvas-header">
      <button
        type="button"
        class="btn-close bg-primary ms-auto"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>
    </div>
    <div
      class="offcanvas-body d-flex flex-column align-items-center d-grid gap-5"
      @pointerup="closeMenu"
    >
      <router-link to="/" class="btn">
        <img src="@/assets/logo.svg" alt="" srcset="" />
        <p class="fs-xs my-2">全台公車時刻資訊整合網</p>
      </router-link>
      <router-link to="/bus" class="btn">
        <div class="h5">公車查詢</div>
        <small class="text-success">查詢指定公車路線及其停靠站</small>
      </router-link>
      <router-link to="/NearBus" class="btn">
        <div class="h5">附近公車</div>
        <small class="text-success">查詢附近公車站及其路線</small>
      </router-link>
      <router-link to="/collect/station" class="btn">
        <div class="h5">我的收藏</div>
        <small class="text-success">收藏的公車站及路線</small>
      </router-link>

      <footer class="position-fixed bottom-0 py-3">Designed By Len Cheng && Celeste</footer>
    </div>
  </aside>
</template>
<script>
import { ref, watch } from 'vue';
import * as bootstrap from 'bootstrap';

export default {
  name: 'Menu',
  setup() {
    const menu = ref(null);
    let bsOffcanvas = '';

    watch(menu, (newVal, oldVal) => {
      if (newVal && newVal !== oldVal) {
        bsOffcanvas = new bootstrap.Offcanvas(newVal);
      }
    });
    const closeMenu = () => {
      bsOffcanvas.hide();
    };
    return {
      menu,
      closeMenu,
    };
  },
};
</script>
