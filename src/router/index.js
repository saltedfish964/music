import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: {
      name: 'Home',
    },
    component: () => import(/* webpackChunkName: "layout" */ '../layout/index.vue'),
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import(/* webpackChunkName: "home" */ '../views/home/index.vue'),
      },
      {
        path: '/video',
        name: 'Video',
        component: () => import(/* webpackChunkName: "video" */ '../views/video/index.vue'),
      },
    ],
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import(/* webpackChunkName: "search" */ '../views/search/index.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
