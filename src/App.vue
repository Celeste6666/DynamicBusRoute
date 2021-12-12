<template>
  <header class="position-fixed top-0 bg-white w-100 p-4 pb-3 shadow">
    <img src="@/assets/logo.svg" alt="" srcset="" />
    <section class="small mt-2 text-success d-flex align-items-center">
      <font-awesome-icon
        :icon="['fas', 'reply']"
        class="fs-4"
        @click="backToLast"
        v-show="$route.path !== '/'"
      />
      <span class="mx-auto">全台公車時刻資訊整合網</span>
      <font-awesome-icon
        :icon="['fas', 'bars']"
        class="fs-4"
        v-show="$route.path !== '/'"
        data-bs-toggle="offcanvas"
        href="#menu"
        role="button"
        aria-controls="offcanvasExample"
      />
    </section>
  </header>
  <Menu />
  <router-view style="padding-top: 120px" />
  <footer class="position-fixed bottom-0 w-100 bg-white text-success shadow py-3">
    Designed By Len Cheng
  </footer>
</template>
<script>
import { useRouter } from 'vue-router';
import Menu from '@/components/Menu.vue';

export default {
  name: 'App',
  components: {
    Menu,
  },
  setup() {
    const router = useRouter();
    const backToLast = () => {
      router.go(-1);
    };

    return {
      backToLast,
    };
  },
};
</script>
<style lang="scss">
#app {
  background: linear-gradient(to bottom, #faf0df, #ededcc);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  vertical-align: middle;
  overflow: hidden;
  min-height: 100vh;
}
header {
  z-index: 1001;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}

footer {
  z-index: 1001;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}
</style>
