// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { NavBar, Icon, List, Cell, CellGroup, PullRefresh, Row, Col, Tag, Dialog,  Popup, Field, Panel, Checkbox, CheckboxGroup, Button, NumberKeyboard, Search, Collapse, CollapseItem, Step, Steps, Toast, DatetimePicker  } from 'vant'

import axios from 'axios'
import Qs from 'qs'

import server from '@/server/index.js'
import UploadImg from '@/components/UploadImg';

import '@/assets/font/iconfont.css'

// Vue.prototype.$axios = axios    //全局注册，使用方法为:this.$axios
Vue.prototype.Qs = Qs           //全局注册，使用方法为:this.qs

// //全局注册组件
Vue.component('UploadImg', UploadImg);
// Vue.component('PasswordInput', PasswordInput);
// 
Vue.prototype.$axios = {
  get(params = {}){

    axios({
      method: 'get',
      url: server.headUrl + params.url
    }).then((res)=>{
        params.success(res);
    }).then((error) =>{

    })
  },
  post(params = {}){
    let _this = this;
    axios({
        method: "post",
        url: server.headUrl + params.url,
        transformRequest: [function (data) {
              // 对 data 进行任意转换处理
              return Qs.stringify(data)
          }],
        data: params.data
      }).then((res) =>{
        params.success(res);
      })
  }
}

Vue.use(Cell).use(CellGroup).use(List).use(Icon).use(NavBar).use(PullRefresh).use(Row).use(Col).use(Tag).use(Dialog).use(Popup).use(Field).use(Panel).use(Checkbox).use(CheckboxGroup).use(Button).use(NumberKeyboard).use(Search).use(Collapse).use(CollapseItem).use(Step).use(Steps).use(Toast).use(DatetimePicker);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
