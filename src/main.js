import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import Vuex from 'vuex';
import axios from 'axios';
import Cookies from 'js-cookie';

Vue.config.productionTip = false;

const api = axios.create({
  baseURL: 'http://192.168.1.62:3000'
});

api.interceptors.response.use((response) => {
  return response;
}, (err) => {
  if (err.response.status === 401) {
    // delete cookies and axios authorization header if unauthorized
    Cookies.remove('token');
    Cookies.remove('user');

    // console.log(!!api.defaults.headers.common.Authorization);

    delete api.defaults.headers.common.Authorization;
  }

  return Promise.reject(err.response);
});

const token = Cookies.get('token');

if (token) {
  api.defaults.headers.common.Authorization = token;
}

Vue.prototype.$http = api;
Vuex.Store.prototype.$http = api;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
