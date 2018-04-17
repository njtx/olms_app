/**
 * Created by robin.
 * axios interceptor
 */

import axios from 'axios'
import store from './store'
import router from './router'
import { cookie } from 'vux'

// axios 配置
axios.defaults.timeout = 5000;
axios.defaults.withCredentials = true;
axios.defaults.baseURL = '/olms_api_nuist/';

// http request 拦截器
axios.interceptors.request.use(
  config => {
    if (store.state.user || store.state.user.session) {
      // if(!cookie.get('JSESSIONID')) {
      //   cookie.set('JSESSIONID', store.state.user.session);
      // } else {
      //   cookie.set('JSESSIONID', store.state.user.session);
      // }
    }
    if (config.method === 'put') {
      config.url = config.url.replace(axios.defaults.baseURL, `${axios.defaults.baseURL}post2rest/put/`);
      config.method = 'post';
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  });

// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      store.state.isLoading = false;
      switch (error.response.status) {
        case 401:
          // 401 清除token信息并跳转到登录页面
          store.commit('logout');
          router.replace({
            path: 'login',
            query: {
              redirect: router.currentRoute.fullPath
            }
          });
          break;
        case 400:
          store.commit('toast', error.response.data.message);
          break;
      }
    }

    return Promise.reject(error.response.data)
  });

export default axios;
