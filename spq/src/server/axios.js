
import Vue from 'vue'
import axios from 'axios'
import Qs from 'qs'
import server from '@/server/index.js'
import router from '@/router/index'
import {Toast} from 'vant'


// Vue.prototype.$axios = axios    //全局注册，使用方法为:this.$axios
Vue.prototype.Qs = Qs;           //全局注册，使用方法为:this.qs
//设置post 请求头
// axios.defaults.headers.post['content-type'] = 'application/json;charset=UTF-8';

//初始化设置axios 全局的请求次数，请求的间隙
let Axios =  axios.create({
  timeout: 20000,  //请求延时时间
});

let modelToast;

let model = {
  modelI: '',
  time: 300,
  show(){
    // Toast.clear();
    modelToast = Toast.loading({
      position: 'middle',
      mask: true,
      duration: 0,       // 持续展示 toast
      forbidClick: true, // 禁用背景点击
      loadingType: 'spinner',
    });
  },
  hide(){
    modelToast.clear();
  }
};


Axios.interceptors.request.use((config) => {
  let token = localStorage.getItem('token') ? localStorage.getItem('token'): '';
  if (token) {  
    // 判断是否存在token，如果存在的话，则每个http header都加上token
    config.headers.Authorization = `Bearer ${token}`;
  }
   // 为所有接口加上前缀
  config.url = server.headUrl + config.url;
  config.headers.lang = 'zh_cn';
  return config;
}, (err)=> {
  // 错误处理
  // console.log('err',err)
  return Promise.reject(err)
});

//响应拦截（配置请求回来的信息）
Axios.interceptors.response.use((response) => {
  //统一拦截 验证是否登录
  if(response.data && response.data.code == 110025 || response.data.code == 110026){
      localStorage.clear();//需要重新登录则清楚所有本地缓存，跳转至登录
      router.replace({path: '/login'});
      Toast(response.data.errMsg);
      return false;
  }

  return response;
 }, (error) => {
  let errMsg = error.message;
  if(errMsg.indexOf('timeout') > -1){
    Toast('请求超时！');
  }
  // 处理响应失败
  return Promise.reject(error);
 });

let _Axios = {
  get(params = {}){
    // Vue.prototype.__globalModelState = true;
    
    return new Promise((resolve, reject) => {
      if(params.isLoading){
        model.show();
      }
      Axios({
        method: 'get',
        params: params.data,
        header: params.header,
        url: params.url
      }).then((res)=>{
        if(params.isLoading){
          setTimeout(()=>{
            model.hide();
            // params.success(res.data);
            return resolve(res.data);
          }, model.time);
          return;
        }else{
          return resolve(res.data);
        }
      }).catch((error) =>{
        if(params.isLoading){
          setTimeout(()=>{
            model.hide();
            return reject(error);
          }, model.time);
          return;
        }else{
          return reject(error);
        } 
      })
    })
  },
  delete(params = {}){

    if(params.isLoading){
      model.show();
    }
    // Vue.prototype.__globalModelState = true;
    Axios({
      method: 'delete',
      params: params.data,
      header: params.header,
      url: params.url
    }).then((res)=>{
      if(params.isLoading){
        setTimeout(()=>{
          model.hide();
          params.success(res.data);
        }, model.time);
        return;
      }else{
        params.success(res.data);
      }
      // params.success(res.data);
    }).catch((error) =>{
      if(params.isLoading){
        setTimeout(()=>{
          model.hide();
        }, model.time);
        return;
      }
    })
  },
  patch(params = {}){

    if(params.isLoading){
      model.show();
    }
    // Vue.prototype.__globalModelState = true;
    Axios({
      method: 'patch',
      data: params.data,
      header: params.header,
      url: params.url
    }).then((res)=>{
      if(params.isLoading){
        setTimeout(()=>{
          model.hide();
          params.success(res.data);
        }, model.time);
        return;
      }else{
        params.success(res.data);
      }
      // params.success(res.data);
    }).catch((error) =>{
      if(params.isLoading){
        setTimeout(()=>{
          model.hide();
        }, model.time);
        return;
      }
    })
  },
  post(params = {}){

    if(params.isLoading){
        model.show();
    }
    params.header = params.header || {};
    header = Object.assign({}, header, params.header);
    let header = {
      'content-type': 'application/json;charset=UTF-8'
    };
    let option = {
      method: 'post',
      url: params.url,
      header: header,
      data: params.data
    };

    if(params.isdeal){
      option.transformRequest = [function (data) {
        // 对 data 进行任意转换处理
        return Qs.stringify(data)
      }];
    }

    return new Promise((resolve, reject)=>{
        Axios(option).then((res) =>{
          let data = res.data ? res.data : res;
          if(params.isLoading){
            setTimeout(()=>{
              model.hide();
              // params.success(data);
              return resolve(data);
            }, model.time);
            return;
          }else{
            return resolve(data);
          }
        }).catch((error) =>{
          // params.error && params.error(error); 
          if(params.isLoading){
            setTimeout(()=>{
              model.hide();
              return reject(error);
            }, model.time);
            return;
          }
          return reject(error);
        })
    })

    return;
  },
  put(params = {}){

    if(params.isLoading){
        model.show();
    }
    params.header = params.header || {};
    header = Object.assign({}, header, params.header);
    let header = {
      'content-type': 'application/json;charset=UTF-8'
    };
    let option = {
      method: 'put',
      url: params.url,
      header: header,
      data: params.data
    };

    if(params.isdeal){
      option.transformRequest = [function (data) {
        // 对 data 进行任意转换处理
        return Qs.stringify(data)
      }];
    }

    return new Promise((resolve, reject)=>{
        Axios(option).then((res) =>{
          let data = res.data ? res.data : res;
          if(params.isLoading){
            setTimeout(()=>{
              model.hide();
              // params.success(data);
              return resolve(data);
            }, model.time);
            return;
          }else{
            return resolve(data);
          }
        }).catch((error) =>{
          // params.error && params.error(error); 
          if(params.isLoading){
            setTimeout(()=>{
              model.hide();
              return reject(error);
            }, model.time);
            return;
          }
          return reject(error);
        })
    })

    return;
  }
}

Vue.prototype.$axios = _Axios

export default _Axios;
