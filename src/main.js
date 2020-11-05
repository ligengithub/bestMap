import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import routes from "./router/route";
import Element from 'element-ui';
import VueRouter from "vue-router";

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter);

Vue.use(Element, { size: 'small', zIndex: 3000 });
const router = new VueRouter({routes});

Vue.config.productionTip = false;
Vue.use(ElementUI);

new Vue({
  render: h => h(App),router,
}).$mount('#app');
