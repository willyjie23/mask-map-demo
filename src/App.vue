<template>
  <div id="app">
    <div class="row no-gutters">
      <!-- 選擇所在區域 -->
      <div class="toolbox col-sm-3 p-2 bg-white">
        <div class="form-group d-flex">
          <label for="cityName" class="col-form-label mr-2 text-right">縣市</label>
          <div class="flex-fill">
              <select id="cityName" class="form-control" v-model="select.city">
              <option value="">請選擇縣市</option>
              <option :value="c.CityName" v-for="c in cityName" :key="c.CityName">
              {{ c.CityName }}
              </option>
            </select>
          </div>
        </div>
        <div class="form-group d-flex">
          <label for="area" class="col-form-label mr-2 text-right">地區</label>
          <div class="flex-fill">
            <select id="area" class="form-control" v-model="select.area">
              <option value="">請選擇地區</option>
              <option 
                :value="a.AreaName"
                v-for="a in cityName.find((city) => city.CityName === select.city).AreaList"
                :key="a.AreaName"
              >
                {{ a.AreaName }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- 顯示藥局位置 -->
      <div class="col-sm-9">
        <div id="map"></div>
      </div>
    </div>
  </div>
</template>

<script>
import cityName from './assets/cityName.json';
import L from 'leaflet';

let openStreetMap = {};

export default {
  name: 'App',
  data() {
    return {
      data: [],
      cityName,
      select: {
        city: '臺北市',
        area: '中正區',
      }
    }
  },
  computed: {
    pharmacies() {
      return this.data.filter((pharmacy) => {
        if (!this.select.area) {
          return pharmacy.properties.county === this.select.city;
        }
        return pharmacy.properties.town === this.select.area;
      });
    },
  },
  watch: {
    pharmacies(value) {
      this.updateMap(value);
    },
  },
  mounted() {
    const self = this;
    const api = 'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json'
    
    self.$http.get(api).then(function (response) {
      self.data = response.data.features;
    });

    openStreetMap = L.map('map', {
      center: [25.042474, 121.513729],
      // 可以嘗試改變 zoom 的數值
      // 筆者嘗試後覺得 18 的縮放比例是較適當的查詢範圍
      zoom: 18,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 20,
    }).addTo(openStreetMap);
  },
  methods: {
    updateMap() {
      openStreetMap.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          openStreetMap.removeLayer(layer);
        }
      });

      this.pharmacies.forEach((pharmacy) => {
        L.marker([
          pharmacy.geometry.coordinates[1],
          pharmacy.geometry.coordinates[0],
        ]).addTo(openStreetMap).bindPopup(`<p><strong style="font-size: 20px;">${pharmacy.properties.name}</strong></p>
          <strong style="font-size: 16px; color: #d45345;">口罩剩餘：成人 - ${pharmacy.properties.mask_adult ? `${pharmacy.properties.mask_adult} 個` : '未取得資料'} / 兒童 - ${pharmacy.properties.mask_child ? `${pharmacy.properties.mask_child} 個` : '未取得資料'}</strong><br>
          地址: ${pharmacy.properties.address}<br>
          電話: ${pharmacy.properties.phone}<br>
          <small>最後更新時間: ${pharmacy.properties.updated}</small>`);
      });
    },
  },
}
</script>

<style lang="scss">
  @import 'bootstrap/scss/bootstrap';

  #map {
    position: relative;
    height: 100vh;
  }
</style>