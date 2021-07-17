import Vue from 'vue'
import App from './App.vue'

import routes from "./router/route";
import VueRouter from "vue-router";
import less from 'less'

// 普通方式引入
// import 'element-ui/lib/theme-chalk/index.css';
// import ElementUI from 'element-ui';
// import Element from 'element-ui';
//
// Vue.use(Element, {size: 'small', zIndex: 3000});
// Vue.use(ElementUI);

// cdn
import ELEMENT from 'element-ui';

Vue.use(ELEMENT, {size: 'small', zIndex: 3000});

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
};


Vue.use(VueRouter).use(less);

const router = new VueRouter({routes});

Vue.config.productionTip = false;


new Vue({
    render: h => h(App), router,
}).$mount('#app');
