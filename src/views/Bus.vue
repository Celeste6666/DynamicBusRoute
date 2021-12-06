<template>
  <articale class="bus container" style="padding-top: 120px">
    <div class="dropdown">
      <button
        class="btn bg-white btn-lg rounded-3 w-100"
        ref="dropdownBtn"
        type="button"
        data-bs-toggle="dropdown"
        data-bs-auto-close="true"
        aria-expanded="false"
      >
        {{ cityZh ? `${cityZh.substring(0, 2)}公車` : '選擇縣市' }}
        <font-awesome-icon :icon="['fas', 'chevron-down']" class="fs-6 ms-3" />
      </button>
      <ul class="dropdown-menu rounded-3 shadow w-100 overflow-scroll" ref="dropdownMenu">
        <li class="p-3 btn-lg position-absolute dropdown-menu-icon" @click.stop="closeDropMenu">
          <font-awesome-icon :icon="['fas', 'chevron-up']" @click.stop="closeDropMenu" />
        </li>
        <li
          class="text-center py-3 btn-lg"
          v-for="(city, key) in BusCity"
          :key="key"
          :data-city-en="key"
          :data-city-zh="city"
          @click="getCityName"
        >
          {{ city.substring(0, 2) }}公車
        </li>
      </ul>
    </div>

    <!-- 公車路線 -->
    <section class="mt-4">
      <div class="text-start">查詢歷史</div>
      <BusRoute />
    </section>
  </articale>
  <!-- 自製鍵盤 -->
  <section
    v-show="customKeyboard"
    class="position-fixed bottom-0 w-100 bg-white shadow fs-4"
    style="z-index: 1000"
  >
    <div class="container d-flex flex-column align-items-center">
      <p class="mt-4" v-if="keyboard">{{ routeName }}</p>
      <div class="d-flex justify-content-end alidn-items-center w-100 py-2" v-else>
        <input
          type="text"
          ref="routeNameInput"
          v-model="routeName"
          style="text-align: center"
          class="form-control border-0 me-3 fs-3 lh-sm"
        />
        <button class="btn btn-lg btn-outline-primary fs-2" @click="changeKeyboard">
          <font-awesome-icon :icon="['fas', 'globe']" />
        </button>
      </div>

      <div class="row gx-1 gy-2 btns-option mb-3" v-if="keyboard" @click="getRouteName">
        <div class="col">
          <button class="btn btn-lg btn-outline-primary">{{ options ? '紅' : '內科' }}</button>
        </div>
        <div class="col">
          <button class="btn btn-lg btn-outline-primary">{{ options ? '藍' : '通勤' }}</button>
        </div>
        <div class="col" v-for="n in 3" :key="n">
          <button class="btn btn-lg btn-outline-primary">{{ n }}</button>
        </div>

        <div class="col">
          <button class="btn btn-lg btn-outline-primary">{{ options ? '綠' : '南軟' }}</button>
        </div>
        <div class="col">
          <button class="btn btn-lg btn-outline-primary">{{ options ? '棕' : '小' }}</button>
        </div>
        <div class="col" v-for="n in 3" :key="n">
          <button class="btn btn-lg btn-outline-primary">
            {{ n + 3 }}
          </button>
        </div>

        <div class="col">
          <button class="btn btn-lg btn-outline-primary">{{ options ? '橘' : '市民' }}</button>
        </div>
        <div class="col">
          <button class="btn btn-lg btn-outline-primary">{{ options ? '幹道' : 'F' }}</button>
        </div>
        <div class="col" v-for="n in 3" :key="n">
          <button class="btn btn-lg btn-outline-primary">
            {{ n + 6 }}
          </button>
        </div>
        <div class="col">
          <button class="btn btn-lg btn-outline-primary" @click="changeKeyboard">
            <font-awesome-icon :icon="['fas', 'globe']" />
          </button>
        </div>
        <div class="col">
          <button class="btn btn-lg btn-outline-primary" @click="changeOptions">
            {{ options ? '更多' : '返回' }}
          </button>
        </div>
        <div class="col">
          <button class="btn btn-lg btn-outline-primary">0</button>
        </div>
        <div class="col">
          <button class="btn btn-lg btn-outline-primary" data-clear="all" @click.stop="deleteWord">
            重設
          </button>
        </div>
        <div class="col">
          <button class="btn btn-lg btn-outline-primary" data-clear="1" @click.stop="deleteWord">
            <font-awesome-icon :icon="['fas', 'backspace']" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { useStore } from 'vuex';
import {
  computed,
  ref,
  reactive,
  nextTick,
  toRefs,
  watch,
  //
} from 'vue';
import BusRoute from '@/components/BusRoute.vue';

export default {
  name: 'Bus',
  components: {
    BusRoute,
  },
  setup() {
    const { state, dispatch } = useStore();

    const BusCity = computed(() => state.city);
    const dropdownBtn = ref(null);
    const dropdownMenu = ref(null);

    const closeDropMenu = () => {
      dropdownBtn.value.classList.remove('show');
      dropdownBtn.value.setAttribute('aria-expanded', false);
      dropdownMenu.value.classList.remove('show');
    };

    const customKeyboard = ref(false);

    const busSearch = reactive({
      cityEn: '',
      cityZh: '',
      routeName: '',
    });

    // 切換城市公車，把之前的routeName清空
    const getCityName = (e) => {
      busSearch.cityEn = e.target.dataset.cityEn;
      busSearch.cityZh = e.target.dataset.cityZh;
      busSearch.routeName = '';
      customKeyboard.value = true;
    };

    const getRouteName = (e) => {
      if (e.target.tagName === 'BUTTON') {
        busSearch.routeName += e.target.textContent;
      }
    };

    const deleteWord = (e) => {
      const { length } = busSearch.routeName;
      const { clear } = e.target.dataset;
      switch (clear) {
        case 'all':
          busSearch.routeName = '';
          break;
        default:
          busSearch.routeName = busSearch.routeName.substring(0, length - 1);
          break;
      }
    };

    watch(
      () => busSearch.routeName,
      async (newVal, oldVal) => {
        if (newVal && newVal !== oldVal) {
          await dispatch('getData', {
            type: 'route',
            routeName: busSearch.routeName,
            city: busSearch.cityEn,
          });
        }
      },
    );

    // 打開手機內置鍵盤
    const keyboard = ref('true');
    const routeNameInput = ref(null);
    const changeKeyboard = () => {
      keyboard.value = !keyboard.value;
      nextTick(() => {
        routeNameInput.value.focus();
      });
    };

    // 改變自製鍵盤內容
    const options = ref('true');
    const changeOptions = () => {
      options.value = !options.value;
    };

    return {
      BusCity,
      dropdownBtn,
      dropdownMenu,
      closeDropMenu,
      customKeyboard,
      ...toRefs(busSearch),
      getCityName,
      getRouteName,
      deleteWord,
      keyboard,
      routeNameInput,
      changeKeyboard,
      options,
      changeOptions,
    };
  },
};
</script>
<style lang="scss" scoped>
.dropdown-menu {
  max-height: 50vh;
  transform: translate3d(0px, 0px, 0px) !important;
  &::-webkit-scrollbar {
    display: none;
  }
  &-icon {
    top: 0px;
    right: 25%;
    transform: translate(0, 15%);
  }
}
.btns-option {
  .col {
    min-width: 20%;
  }
  button {
    width: 100%;
  }
}
</style>
