import store from '@/store/index';

export default function getLocation(DistanceInMeters) {
  if (navigator.geolocation) {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    const success = (pos) => {
      const crd = pos.coords;
      console.log(crd);
      const { latitude: lat, longitude: lon } = crd;
      store.dispatch('getDataNearLocation', { lat, lon, DistanceInMeters });
    };

    navigator.geolocation.getCurrentPosition(
      success,
      (err) => {
        console.log(err);
      },
      options,
    );
  } else {
    alert('你的裝置或瀏覽器不支援定位功能');
  }
}
