<template>
  <div class="vue-leaflet">
    <l-map style="width: 100%; height: 800px;" :zoom="zoom" :center="center">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-marker :lat-lng="marker" :draggable="true">
        <l-popup :content="text"></l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet';

export default {
  name: 'VueLeaflet',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup
  },
  data () {
    return {
      zoom: 10,
      center: L.latLng(40, 116),
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      marker: L.latLng(40, 116),
      text: 'this is a marker<br><button style="color: #42d885; border: none;background-color: cornsilk">进入</button>'
    }
  }
}
</script>

<style scoped>

</style>
