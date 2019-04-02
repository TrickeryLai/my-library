
import {Toast} from 'vant'
import Axios from '@/server/axios';
import router from '@/router/index';

// axios请求
let server = {
	/**
	 * [获取验证码图片]
	 * @return {[type]} [description]
	 */
	getCaptchaPic(callback){
			Axios.get({
				url: 'open-cp/v1/captcha',
				success(response){
	            //请求成功返回的数据
	            if(response.captchaKey){
	            	callback && callback(response);
	            }else{
	            	Toast(response.errMsg);
	            }
	        }
	    });

		return this;
	},
	/**
	 * [登录]
	 * @param  {[type]}   data     [axios 传递的数据]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [this]
	 */
	login(data, callback){
		let url = 'open-cp/v1/login';
		Axios.post({
				isLoading: true,
				url,
				data: data,
				success(response){
					if(response.code == 0 || response.code == 110008){
	                	callback && callback(response);
	                }else{
	                	Toast(response.errMsg);
	                }
				}
			})
		return this;
	},
  logout(data, callback){
    let url = 'open-cp/v1/login';
    Axios.delete({
      isLoading: true,
      url,
      data: data,
      success(response){
        if(response.code == 0 || response.code == 110008){
          callback && callback(response);
        }else{
          Toast(response.errMsg);
        }
      }
    });
    return this;
  },
  changePassword(data, callback){
    let user = localStorage.getItem('user') ?  JSON.parse(localStorage.getItem('user')): '';
    let url = 'open-cp/v1/users/';
    if(!user){
      return;
    }
    url += user.userId;
    Axios.patch({
      isLoading: true,
      url,
      isdeal: true,
      data: data,
      success(response){
        if(response.code == 0 || response.code == 110008){
          callback && callback(response);
        }else{
          Toast(response.errMsg);
        }
      }
    });
    return this;
  }
  ,
	/**
	 * [注册]
	 * @param  {[type]}   data     [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	register(data, callback){
		let url = 'open-cp/v1/register';
		Axios.post({
				isLoading: true,
				url,
				data: data,
				success(response){
					if(response.code == 0 || response.code == 110008){
	                	callback && callback(response);
	                }else{
	                	Toast(response.errMsg);
	                }
				}
			});
		return this;
	},
	getBusinessTickets(data, callback){
		let url = 'open-cp/v1/businessTickets';
		Axios.post({
				isLoading: false,
				url,
        isdeal: true,
				data: data,
				success(response){
					if(response.code == 0 || response.code == 110008){
	                	callback && callback(response);
	                }else{
	                	Toast(response.errMsg);
	                }
				},
				error(){
					
				}
			})
		return this;
	},
  	getBusinessTicketDetail(params){
	    let url = 'open-cp/v1/businessTickets/' + params._id;
	    Axios.get({
	      url,
	      success(response){
	        params.success &&  params.success(response)
	        // if(response.code == 0 || response.code == 110008){
	        //   params.success &&  params.success(response)
	        // }else{
	        //   Toast(response.errMsg);
	        // }
	      }
	    });
	    return this;
  	},
  	getCommercialPaper(data, callback){
        let url = 'open-cp/v1/commercialPaper';
        Axios.post({
          isLoading: false,
          url,
          isdeal: true,
          data: data,
          success(response){
            if(response.code == 0 || response.code == 110008){
              callback && callback(response);
            }else{
              Toast(response.errMsg);
            }
          }
        })
        return this;
  	},
    getAuthentication(data, callback){
      let url = 'open-cp/v1/company/authentication';
      Axios.post({
        isLoading: false,
        url,
        isdeal: false,
        data: data,
        success(response){
          if(response.code == 0 || response.code == 110008){
            callback && callback(response);
          }else{
            Toast(response.errMsg);
          }
        }
      })
      return this;
    }
  	
}

export default server;
