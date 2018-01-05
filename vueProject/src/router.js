
/*jshint esversion:6*/

import Vue from 'vue';
import VueRouter from 'vue-router';

//引入组件
import Home from './view/home.vue';
import Test from './view/test/test.vue';
import Nav from './view/nav.vue';
import Sidebar from './view/slider/slider.vue';

Vue.use(VueRouter);

const routes = [
  {
    name: 'home',
    path: '/',
    component: Home,
    children: [
      {
        path: '',
        components: {
          // default: Home,
          sidebar: Sidebar,
          nav: Nav
        },
      }
    ]
  },
  {
    name: 'test',
    path: '/test',
    component: Test
  }
];

const router = new VueRouter({
  routes
});

export default router;

