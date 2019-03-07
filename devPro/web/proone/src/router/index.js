import Vue from 'vue';
import axios from "axios";
import Qs from 'qs';
import common from '@/commons/common';
import Router from 'vue-router';
import LoginIndex from '@/components/LoginIndex';
import Login from '@/components/Login';
import Register from '@/components/Register';
import UserIndex from '@/components/UserIndex';
import UserList from '@/components/UserList';

Vue.use(Router)

axios.interceptors.request.use(
          config => {
            let sessionData = JSON.parse(sessionStorage.getItem('userData'));
            let token = sessionData && sessionData.token;
            if (token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
              config.headers.token = token;
            }
            return config;
          },
          err => {
            return Promise.reject(err);
          })

Vue.prototype.$common = common;
Vue.prototype.$axios = {
  get(params = {}){

    axios({
      method: 'get',
      url: common.headerUrl + params.url
    }).then((res)=>{
        params.success(res);
    })
  },
  post(params = {}){
    let _this = this;
    axios({
        method: "post",
        url: common.headerUrl + params.url,
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

export default new Router({
  routes: [
    {
      path: '/',
      redirect: 'login',
      name: 'LoginIndex',
      component: LoginIndex,
      children: [
      	{
      		path: 'login',
      		component: Login
      	},
      	{
      		path: 'register',
      		component: Register
      	}
      ]
    },
    {
    	path: '/user',
      redirect: 'user/list',
    	name: 'UserIndex',
    	component: UserIndex,
      children: [
        {
          path: 'list',
          component: UserList
        }
      ]
    }
  ]
})
