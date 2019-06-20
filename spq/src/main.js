// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { NavBar, Icon, List, Cell, CellGroup, PullRefresh, Row, Col, Tag, Dialog,  Popup, Field, Panel, Checkbox, CheckboxGroup, Button, NumberKeyboard, Search, Collapse, CollapseItem, Step, Steps, Toast, DatetimePicker, Stepper, Loading, Pagination, Tab, Tabs, RadioGroup, Radio, Area, Picker, Rate } from 'vant'


import server from '@/server/index.js'
import routerData from '@/router/routerData.js'
import Axios from '@/server/axios'
import UploadImg from '@/components/UploadImg';
import PreviewPdf from '@/components/PreviewPdf'

import '@/directive/inputReset.js';
import '@/directive/inputLimit.js'

import '@/assets/font/iconfont.css';

  var mo = function (e) {
    e.preventDefault();
  };
//弹出框禁止滑动
Vue.prototype.$noScroll = function () {
  
  document.body.style.overflow = 'hidden';
  // document.body.style.position = 'fixed';
  document.addEventListener('touchmove', mo,{ passive: false })// 禁止页面滑动
}
 
//弹出框可以滑动
Vue.prototype.$canScroll = function () {

  document.body.style.overflow = ''// 出现滚动条
  // document.body.style.position = '';
  document.removeEventListener('touchmove', mo,{ passive: false })
}

// //全局注册组件
Vue.component('UploadImg', UploadImg);
Vue.component('PreviewPdf', PreviewPdf);
// Vue.component('PasswordInput', PasswordInput);

Vue.use(Cell).use(CellGroup).use(List).use(Icon).use(NavBar).use(PullRefresh).use(Row).use(Col).use(Tag).use(Dialog).use(Popup).use(Field).use(Panel).use(Checkbox).use(CheckboxGroup).use(Button).use(NumberKeyboard).use(Search).use(Collapse).use(CollapseItem).use(Step).use(Steps).use(Toast).use(DatetimePicker).use(Stepper).use(Loading).use(Pagination).use(Tab).use(Tabs).use(RadioGroup).use(Radio).use(Area).use(Picker).use(Rate);

Vue.config.productionTip = false;

Toast.setDefaultOptions({
   position: 'bottom',
})
//允许多个 toast 存在, axios 请求 loading 效果弹窗
Toast.allowMultiple();

//路由跳转拦截
//

router.beforeEach( (to, from, next) => {
  let localItem = localStorage.getItem('token'),
      user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')): '';
  let orgId = user ? user. orgId : '';
  let authStatus = user ? user.authStatus : '';
  Vue.prototype.$modelToast && Vue.prototype.$modelToast.clear();
   //路由跳转清空所有提示框 -- 登录页面,实名认证不清除
  if(to.name !== 'Login' && to.name !== 'RealName'){
      // Vue.prototype.$modelToast && Vue.prototype.$modelToast.clear();
  }

  //判断是否需要登录, 通过本地是否存在 token, 未登录跳转至登录页面，同时将该页面地址传入 redirect
  if(to.meta.isLogin && !localItem){
      next({path: '/login', query:{redirect: to.fullPath}});
      Toast('请先登录！');
      return;
  }
  //判断是否认证，否则跳出
  // if(to.meta.isNChecked && !orgId){
  //     next({path: '/home/realName', query:{redirect: to.fullPath}});
  //     Toast('请先实名认证！');
  //     return;
  // }
  
  if(to.meta.isNChecked){
    // authStatus(认证状态：1-待审核；2-审核不通过；9-已认证)
     if(authStatus != 9) {
      next({path: '/home/selfInfo/realNameChange', query:{redirect: to.fullPath}});
      return;
    }
  }
  
  //默认操作跳转下个页面
  next();
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  data:{
      globalModelState: true,
  },
  components: { App },
  template: '<App />'
})
