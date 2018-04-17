// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import  { ToastPlugin } from 'vux'
import VueScroller from 'vue-scroller'
import  { ConfirmPlugin } from 'vux'
import FastClick from 'fastclick'
//import { sync } from 'vuex-router-sync'
import router from './router'
import store from './store'
import axios from './http'
import App from './App'

FastClick.attach(document.body)

Vue.config.productionTip = false

Vue.use(VueScroller)
Vue.use(ToastPlugin)
//sync(store, router);
Vue.use(ConfirmPlugin)
Vue.prototype.axios = axios;

/* eslint-disable no-new */
new Vue({
  router,
	store,
  axios,
  render: h => h(App)
}).$mount('#app')
