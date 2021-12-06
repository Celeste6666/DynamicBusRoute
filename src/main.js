// 載入樣式
import '@/scss/main.scss';
import * as bootstrap from 'bootstrap';

import 'leaflet/dist/leaflet.css';

// font-awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faBookmark,
  faReply,
  faGlobe,
  faMapMarkerAlt,
  faBars,
  faChevronUp,
  faChevronDown,
  faExchangeAlt,
  faBackspace,
  faBus,
  faMapPin,
} from '@fortawesome/free-solid-svg-icons';
import {
  faBookmark as farBookmark,
  faMap,
} from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

library.add(
  faBookmark,
  faReply,
  faGlobe,
  faMap,
  faMapMarkerAlt,
  faBars,
  faChevronUp,
  faChevronDown,
  faExchangeAlt,
  faBackspace,
  farBookmark,
  faBus,
  faMapPin,
);

createApp(App)
  .use(bootstrap)
  .use(store)
  .use(router)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app');
