
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
    alert(1314)
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
	getBusinessTickets(data, callback, dealState){
		let url = 'open-cp/v1/businessTickets';
		Axios.post({
				isLoading: false,
				url,
        isdeal: true,
				data: data,
				success(response){
          dealState && dealState();
					if(response.code == 110025){
						
					}
					if(response.code == 0 || response.code == 110008){
	                	callback && callback(response);
	                }else{
	                	Toast(response.errMsg);
	                }
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
	//http://127.0.0.1:8890/open-cp/v1/businessTickets
}

export default server;
