import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-default/index.css'
import './assets/theme/theme-darkblue/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
// main.js
import './directives'  //控制对话框移动

import axios from 'axios'
import VueAxios from 'vue-axios'
import routes from './routes'

import Mock from './mock'
Mock.bootstrap();

import 'font-awesome/css/font-awesome.min.css'
import 'leaflet/dist/leaflet.css';

Vue.use(VueAxios, axios)
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

const router = new VueRouter({
    routes
});

router.beforeEach((to, from, next) => {
    if (to.path == '/login') {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
    }
    let user = JSON.parse(sessionStorage.getItem('user'));
    if (!user && to.path != '/login') {
        next({ path: '/login' })
    } else {
        next()
    }
});

//router.afterEach(transition => {
//NProgress.done();
//});

/* leaflet icon */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

new Vue({
    router,
    store,
    //components: { App }
    render: h => h(App)
}).$mount('#app')




