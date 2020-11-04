import Vue from 'vue'
import App from './App.vue'

import VueAMap from "vue-amap";
import * as GmapVue from 'gmap-vue'
import BaiduMap from 'vue-baidu-map'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';


import Element from 'element-ui';
Vue.use(Element, { size: 'small', zIndex: 3000 });

Vue.config.productionTip = false;
Vue.use(ElementUI);
// amap
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: '290e8e1d4d5e1a44ad6b7cc1bd31184b',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale',
    'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor',
    'AMap.CircleEditor', "AMap.Marker"],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
});

// google map
Vue.use(GmapVue, {
  load: {
    key: 'AIzaSyCiDTrxcxJmMPsAsE9u5HyuBZITrUXG5aI',
    libraries: 'places', // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)

    //// If you want to set the version, you can do so:
    v: '3.26'
  },
  installComponents: true
});

Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'ftH0RTdhGjdgc96PvGGlfE7iwGg3toSG'
});

new Vue({
  render: h => h(App),
}).$mount('#app')
