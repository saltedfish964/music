import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tabs: [
      {
        name: '发现',
        path: '/home',
      },
      {
        name: '视频',
        path: '/video',
      },
    ],
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  },
});
