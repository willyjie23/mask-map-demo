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
              <option :value="a.AreaName" v-for="a in cityName.find((city) => city.CityName === select.city).AreaList" :key="a.AreaName">
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

export default {
  name: 'App',
  data() {
    return { 
      cityName,
      select: {
        city: '臺北市',
        area: '中正區',
      }
    }
  },
  mounted() {
    const api = 'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json'
    this.$http.get(api).then(function (response) {
      console.log(response);
    })
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