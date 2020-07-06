import Vue from 'vue';
import {
  Icon,
  Search,
  Toast,
  NavBar,
  Slider,
  Overlay,
  Loading,
  Swipe,
  SwipeItem,
  Lazyload,
  Dialog,
} from 'vant';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import store from './store';
import 'normalize.css';
import './assets/css/icon.css';

axios.defaults.baseURL = 'https://netease.bluej.cn';

Vue.use(Icon);
Vue.use(Search);
Vue.use(Toast);
Vue.use(NavBar);
Vue.use(Slider);
Vue.use(Overlay);
Vue.use(Loading);
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Lazyload);
Vue.use(Dialog);

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
