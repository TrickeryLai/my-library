// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import MyInput from '@/components/MyInput'
import PasswordInput from '@/components/PasswordInput'
import Model from '@/components/Model'

Vue.config.productionTip = false

//全局注册组件
Vue.component('MyInput', MyInput);
Vue.component('PasswordInput', PasswordInput);
Vue.component('Model', Model);



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

Vue.prototype.$common = {};


