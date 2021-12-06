import { createStore } from 'vuex';
import hmacSHA1 from 'crypto-js/hmac-sha1';
import Base64 from 'crypto-js/enc-base64';
import convertToGeoJson from '@/hook/convertToGeoJson';

// 會用到的 API
// 公車線型 GET /v2/Bus/Shape/City/{City}/{RouteName}
// 公車路線起終站 GET /v2/Bus/Route/City/{City}
// 公車預估到站 GET /v2/Bus/EstimatedTimeOfArrival/City/{City}/{RouteName}
// 公車動態定時資料(車牌+目前位置) GET /v2/Bus/RealTimeByFrequency/City/{City}/{RouteName}
// 公車動態定點資料(車牌+目前所在站牌位置) GET /v2/Bus/RealTimeNearStop/City/{City}/{RouteName}
// 公車站牌 GET /v2/Bus/StopOfRoute/City/{City}/{RouteName}
// 公車站位 GET /v2/Bus/Station/City/{City}
export default createStore({
  state: {
    api: {
      Shape_url: 'https://ptx.transportdata.tw/MOTC/v2/Bus/Shape/City/',
      Route_url: 'https://ptx.transportdata.tw/MOTC/v2/Bus/Route/City/',
      Estimated_url: 'https://ptx.transportdata.tw/MOTC/v2/Bus/EstimatedTimeOfArrival/City/',
      RealTimeByFrequency_url: 'https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeByFrequency/City/',
      RealTimeNearStop_url: 'https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeNearStop/City/',
      StopOfRoute_url: 'https://ptx.transportdata.tw/MOTC/v2/Bus/StopOfRoute/City/',
      Station_url: 'https://ptx.transportdata.tw/MOTC/v2/Bus/Station/City/',
      nominatim_url: 'https://nominatim.openstreetmap.org/reverse?format=json&',
      id: '0c672be3679e4f1e8441118a50a5d9f3',
      key: 'ovFaA4lsqC5GyOKZHEEo_IS1Vt4',
    },
    city: {
      Taipei: '臺北市',
      NewTaipei: '新北市',
      Taoyuan: '桃園市',
      Taichung: '臺中市',
      Tainan: '臺南市',
      Kaohsiung: '高雄市',
      Keelung: '基隆市',
      Hsinchu: '新竹市',
      HsinchuCounty: '新竹縣',
      MiaoliCounty: '苗栗縣',
      ChanghuaCounty: '彰化縣',
      NantouCounty: '南投縣',
      YunlinCounty: '雲林縣',
      ChiayiCounty: '嘉義縣',
      Chiayi: '嘉義市',
      PingtungCounty: '屏東縣',
      YilanCounty: '宜蘭縣',
      HualienCounty: '花蓮縣',
      TaitungCounty: '臺東縣',
      KinmenCounty: '金門縣',
      PenghuCounty: '澎湖縣',
      LienchiangCounty: '連江縣',
    },
    // 縣市裡所有公車路線
    routes: [{
      RouteUID: '',
      RouteName: {
        Zh_tw: '',
      },
    }],

    // 特定路線動態資料
    selectedRoute: {
      // 特定路線圖
      shape: {
        Geometry: {
          type: '',
          coordinates: [],
        },
      },
      // 特定路線站牌資料
      Stops: [{
        StopID: '',
        StopPosition: {
          PositionLat: '',
          PositionLon: '',
        },
      }],
      // 特定路線預估到站
      Estimated: [],
      // 特定路線定時資料(車牌目前位置)
      RealTimeByFrequency: [],
      // 特定路線定點資料(確定車牌要到哪一站)
      RealTimeNearStop: [],
    },
    // 附近公車
    NearLocationBus: [],
  },
  getters: {
    headers: (state) => {
      const { key, id } = state.api;
      const GMTDate = new Date().toUTCString();
      const HAMC = hmacSHA1(`x-date: ${GMTDate}`, key);
      const toBase = Base64.stringify(HAMC);
      return {
        methods: 'GET',
        headers: {
          Authorization: `hmac username="${id}", algorithm="hmac-sha1", headers="x-date", signature="${toBase}"`,
          'x-date': GMTDate,
        },
      };
    },
    filterRoute: (state) => (routeId) => {
      const route = state.routes.filter((rou) => rou.RouteUID === routeId);
      return route;
    },
    filterStopRoute: (state) => (direction) => {
      if (state.selectedRoute.Stops.length !== 0) {
        const stops = state.selectedRoute.Stops.filter((bus) => bus.Direction === direction);
        return stops;
      }
      return [];
    },
    filterRealTimeNearStop: (state) => (direction) => {
      const { RealTimeNearStop } = state.selectedRoute;
      if (RealTimeNearStop.length !== 0) {
        const stop = RealTimeNearStop.filter((bus) => bus.Direction === direction);
        return stop;
      }
      return [];
    },
    filterRealTimeByFrequency: (state) => (direction) => {
      const { RealTimeByFrequency } = state.selectedRoute;
      if (RealTimeByFrequency.length !== 0) {
        const Buses = RealTimeByFrequency.filter((bus) => bus.Direction === direction);
        return Buses;
      }
      return [];
    },
    filterEstimatedBus: (state) => (direction) => {
      if (state.selectedRoute.Estimated.length !== 0) {
        const stop = state.selectedRoute.Estimated.filter((bus) => bus.Direction === direction);
        return stop;
      }
      return [];
    },
  },
  mutations: {
    getRouteData(state, payload) {
      state.routes = payload;
    },
    getShapeData(state, payload) {
      const shape = payload;
      shape.Geometry = convertToGeoJson(shape.Geometry);
      state.selectedRoute.shape = shape;
    },
    getStopData(state, payload) {
      state.selectedRoute.Stops = payload;
    },
    getRealTimeByFrequencyData(state, payload) {
      state.selectedRoute.RealTimeByFrequency = payload;
    },
    getRealTimeNearStopData(state, payload) {
      state.selectedRoute.RealTimeNearStop = payload;
    },
    getEstimatedData(state, payload) {
      state.selectedRoute.Estimated = payload;
    },
    clearDataNearLocation(state) {
      state.NearLocationBus = [];
    },
    getDataNearLocation(state, payload) {
      state.NearLocationBus = payload;
    },
  },
  actions: {
    // payload = {type, routeName, city}
    async getData({ state, getters, commit }, payload) {
      const {
        Shape_url: shape,
        Route_url: route,
        StopOfRoute_url: stop,
        RealTimeNearStop_url: realTimeNearStop,
        RealTimeByFrequency_url: realTimeByFrequency,
        Estimated_url: estimated,
      } = state.api;
      const { type, routeName, city, routeId } = payload;

      let res;
      let data;

      switch (type) {
        case 'route':
          res = await fetch(`${route}${city}/${routeName}?$format=JSON`, getters.headers);
          if (res.ok) {
            data = await res.json();
            commit('getRouteData', data);
          }
          break;

        case 'estimated':
          res = await fetch(`${estimated}${city}/${routeName}?$filter=RouteUID eq '${routeId}'&$orderBy=StopSequence&$format=JSON`, getters.headers);
          if (res.ok) {
            data = await res.json();
            commit('getEstimatedData', data);
          }
          break;

        case 'shape':
          res = await fetch(`${shape}${city}/${routeName}?$filter=RouteUID eq '${routeId}'&$format=JSON`, getters.headers);
          if (res.ok) {
            data = await res.json();
            commit('getShapeData', data[0]);
          }
          break;

        case 'stop':
          res = await fetch(`${stop}${city}/${routeName}?$filter=RouteUID eq '${routeId}'&$format=JSON`, getters.headers);
          if (res.ok) {
            data = await res.json();
            commit('getStopData', data);
          }
          break;

        case 'realTimeNearStop':
          res = await fetch(`${realTimeNearStop}${city}/${routeName}?$filter=RouteUID eq '${routeId}'&$format=JSON`, getters.headers);
          if (res.ok) {
            data = await res.json();
            commit('getRealTimeNearStopData', data);
          }
          break;

        case 'realTimeByFrequency':
          res = await fetch(`${realTimeByFrequency}${city}/${routeName}?$filter=RouteUID eq '${routeId}'&$top=10&$format=JSON`, getters.headers);
          if (res.ok) {
            data = await res.json();
            commit('getRealTimeByFrequencyData', data);
          }
          break;

        default:
          break;
      }
    },
    async getDataNearLocation({ state, getters, commit }, payload) {
      // 清空附近公車站資料
      commit('clearDataNearLocation');

      // 循環縣市找出附近公車
      const { nominatim_url: nominatiml, Station_url: station } = state.api;
      const { lat, lon } = payload;
      const locationRes = await fetch(`${nominatiml}lat=${lat}&lon=${lon}&accept-language=en`);
      const locationData = await locationRes.json();
      const { county: city } = locationData.address;
      if (city.includes('Keelung') && city.includes('Lienchiang')) {
        const res = await fetch(`${station}${city}?$spatialFilter=nearby(${lat}, ${lon}, 500)&$format=JSON`, getters.headers);
        const data = await res.json();
        if (res.ok && data.length !== 0) {
          commit('getDataNearLocation', data);
        }
      }
    },
  },
  modules: {
  },
});