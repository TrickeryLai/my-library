// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { NavBar, Icon, List, Cell, CellGroup, PullRefresh, Row, Col, Tag, Dialog,  Popup, Field, Panel, Checkbox, CheckboxGroup, Button, NumberKeyboard, Search, Collapse, CollapseItem} from 'vant'
import MyInput from '@/components/MyInput'
import PasswordInput from '@/components/PasswordInput'

import '@/assets/font/iconfont.css'

//全局注册组件
Vue.component('MyInput', MyInput);
Vue.component('PasswordInput', PasswordInput);

Vue.use(Cell).use(CellGroup).use(List).use(Icon).use(NavBar).use(PullRefresh).use(Row).use(Col).use(Tag).use(Dialog).use(Popup).use(Field).use(Panel).use(Checkbox).use(CheckboxGroup).use(Button).use(NumberKeyboard).use(Search).use(Collapse).use(CollapseItem);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
