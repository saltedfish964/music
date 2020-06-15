import Vue from 'vue';
import {
  Icon,
  Search,
  Toast,
} from 'vant';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import store from './store';
import 'normalize.css';

Vue.use(Icon);
Vue.use(Search);
Vue.use(Toast);

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
