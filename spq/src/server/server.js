
import {Toast} from 'vant'
import Axios from '@/server/axios';
import router from '@/router/index';

let project = 'open-cp';
let version = '/v1';
// axios请求
let server = {
	/**
	 * [获取验证码图片]
	 * @return {[type]} [description]
	 */
	getCaptchaPic(callback){

    return new Promise((resolve, reject) => {
      Axios.get({
        url: project + version + '/captcha',
        }).then((response) => {
              //请求成功返回的数据
              if(response.captchaKey){
                callback && callback(response);
                return resolve(response);
              }else{
                response.errMsg && Toast(response.errMsg);
                return reject(response);
              }
            })
        .catch((error) => {
          return reject(error);
        });
    })

	},
  /**
   * [getSmsCaptcha 获取手机验证码]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  getSmsCaptcha(phoneNumber, loginName, type){
    let url = project + version + '/smsCaptcha/?phoneNumber=' + phoneNumber;

    if(loginName){
      url += '&loginName=' + loginName;
    }
    if(type){
      url += '&type=' + type;
    }
    return new Promise((resolve, reject) => {
      Axios.get({
        url: url,
        }).then((response) => {

          return resolve(response);
              //请求成功返回的数据
              if(response.captchaKey){
                callback && callback(response);
              }else{
                response.errMsg && Toast(response.errMsg);
                }
            })
        .catch((error) => {
          return reject(error);
        });
    })
  },
  /**
   * [getSmsCaptcha1 获取手机验证码]
   * @param  {[type]} phoneNumber [description]
   * @param  {[type]} loginName   [description]
   * @param  {[type]} type        [description]
   * @return {[type]}             [description]
   */
  getSmsCaptcha1(obj){
    let url = project + version + '/smsCaptcha/?';

    for(let key in obj){
      url += `${key}=${obj[key]}&`;
    }
    return new Promise((resolve, reject) => {
      Axios.get({
        url: url,
        }).then((response) => {

          return resolve(response);
              //请求成功返回的数据
              if(response.captchaKey){
                callback && callback(response);
              }else{
                response.errMsg && Toast(response.errMsg);
                }
            })
        .catch((error) => {
          return reject(error);
        });
    })
  },

   getSmsCaptchaCheck(obj){
    let url = project + version + '/smsCaptchaOfTransactor?';

    for(let key in obj){
      url += `${key}=${obj[key]}&`;
    }
    return new Promise((resolve, reject) => {
      Axios.get({
        url: url,
        }).then((response) => {

          return resolve(response);
              //请求成功返回的数据
              if(response.captchaKey){
                callback && callback(response);
              }else{
                response.errMsg && Toast(response.errMsg);
                }
            })
        .catch((error) => {
          return reject(error);
        });
    })
  },
	/**
	 * [登录]
	 * @param  {[type]}   data     [axios 传递的数据]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [this]
	 */
	login(data, callback){
		let url = project + version + '/login';

    return new Promise((resolve, reject) => {
      Axios.post({
        isLoading: true,
        url,
        data: data,
      }).then((response) => {
        if(response.code == 0 || response.code == 110008){
          // callback && callback(response);
          return resolve(response);
        }else{
          response.errMsg && Toast(response.errMsg);
          return reject(response);
        }
      }).catch(error => {
        return reject(response);
      })
    })
	},
  /**
   * [logout 登出]
   * @param  {[type]}   data     [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  logout(data, callback){
    let url = project + version + '/login';
    Axios.delete({
      isLoading: true,
      url,
      data: data,
      success(response){
        if(response.code == 0 || response.code == 110008){
          callback && callback(response);
        }else{
          response.errMsg && Toast(response.errMsg);
        }
      }
    });
    return this;
  },
  /**
   * [changePassword 修改登录密码]
   * @param  {[type]}   data     [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  changePassword(data, callback){
    let userId = localStorage.getItem('userId') ?  JSON.parse(localStorage.getItem('userId')): '';
    let url = project + version + '/users/';
    if(!userId){
      return;
    }
    url += userId;
    Axios.patch({
      isLoading: true,
      url,
      isdeal: true,
      data: data,
      success(response){
        if(response.code == 0 || response.code == 110008){
          callback && callback(response);
        }else{
          response.errMsg && Toast(response.errMsg);
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
		let url = project + version + '/register';
		Axios.post({
				isLoading: true,
				url,
				data: data,
			}).then((response) => {
					if(response.code == 0 || response.code == 110008){
            callback && callback(response);
          }else{
            response.errMsg && Toast(response.errMsg);
          }
			}).catch(error => {
				console.log(error);
			});
		return this;
	},
  /**
   * [forgetPassword 忘记密码]
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  forgetPassword(data){
    let url = project + version + '/forgetPassword';

    return new Promise( (resolve, reject) => {
      Axios.post({
        isLoading: true,
        url,
        data: data,
      }).then((response) => {
          if(response.code == 0 || response.code == 110008){
            return resolve(response);
          }else{
            response.errMsg && Toast(response.errMsg);
            return reject(response);
          }
      }).catch(error => {
        return reject(error);
        // console.log(error);
      });
    })
    
  },
  /**
   * [forgetLoginName 忘记用户名]
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  forgetLoginName(data){
    let url = project + version + '/forgetLoginName';

    return new Promise( (resolve, reject) => {
      Axios.post({
        isLoading: true,
        url,
        data: data,
      }).then((response) => {
          if(response.code == 0 || response.code == 110008){
            return resolve(response);
          }else{
            response.errMsg && Toast(response.errMsg);
            return reject(response);
          }
      }).catch(error => {
        return reject(error);
        // console.log(error);
      });
    })
    
  },
	/**
	 * [getBusinessTickets 大厅获取票据列表]
	 * @param  {[type]}   data     [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	getBusinessTickets(data, url){
    if(!url){
      url = '/businessTickets';
    }
		url = (project + version + url);
    return new Promise((resolve, reject) => {
      Axios.post({
        isLoading: true,
        url,
        isdeal: true,
        data: data,
      }).then((response) => {
        if(response.code == 0 || response.code == 110008){
          return resolve(response);
          
        }else{
          response.errMsg && Toast(response.errMsg);
          return reject(response);
        }
      }).catch(error => {
        return reject(error);
      });
    })
	},
	/**
	 * [getBusinessTicketDetail 获取票据详情]
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
  	getBusinessTicketDetail(params){
	    let url = project + version + '/businessTickets/' + params._id;
	    Axios.get({
        isLoading: true,
	      url,
	    }).then((response) => { 
          
	        if(response.code == 0 || response.code == 110008){
	          params.success &&  params.success(response);
	        }else{
	          response.errMsg && Toast(response.errMsg);
	        }
	      })
	    .catch(error => {
	    	  console.log(error)
	    });
	    return this;
  	},
    /**
     * [getSelfTicketDetail 获取票据详情，含img]
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */
    getSelfTicketDetail(_id){
      let url = project + version + '/commercialPaper/paper/' + _id;

      return new Promise( (resolve, reject) => {
        Axios.get({
          isLoading: true,
          url,
        }).then((response) => { 
          
            if(response.code == 0 || response.code == 110008){
                return resolve(response)
            }else{
              Toast(response.errMsg);
              return reject(error);
            }
          })
        .catch(error => {
            return reject(error);
        });
      })
     
    },
  	/**
  	 * [发布票据 description]
  	 * @param  {[type]}   data     [description]
  	 * @param  {Function} callback [description]
  	 * @return {[type]}            [description]
  	 */
  	getCommercialPaper(data, callback){
        let url = project + version + '/commercialPaper';
        Axios.post({
          isLoading: true,
          url,
          isdeal: false,
          data: data,
        }).then((response) => {
            if(response.code == 0 || response.code == 110008){
              callback && callback(response);
            }else{
              response.errMsg && Toast(response.errMsg);
            }
      	}).catch(error => {
      		  console.log(error);
      	})
        return this;
  	},
  	/**
  	 * [checkCommercialPaper 验证买家id]
  	 * @param  {[type]} params [description]
  	 * @return {[type]}        [description]
  	 */
  	checkCommercialPaper(params){
	    let url = project + version + '/commercialPaper/' + params._id;
	    Axios.get({
	      url,
	      isLoading: true, 
	    }).then((response) => {
	        if(response.code == 0 || response.code == 110008){
	          params.success &&  params.success(response)
	        }else{
            response.errMsg && Toast(response.errMsg);
	        }
	      })
	    .catch(error => {
	    	console.log(error);
	    });
	    return this;
  	},
  	/**
  	 * [getAuthentication 实名认证]
  	 * @param  {[type]}   data     [description]
  	 * @param  {Function} callback [description]
  	 * @return {[type]}            [description]
  	 */
    getAuthentication(data, callback){
      let url = project + version + '/company/authentication';
      Axios.post({
        isLoading: true,
        url,
        isdeal: false,
        data: data,
      }).then((response) => {
          if(response.code == 0 || response.code == 110008){
            callback && callback(response);
          }else{
            response.errMsg && Toast(response.errMsg);
          }
    	}).catch(error => {
    		console.log(error);
    	})
      return this;
    },
    /**
     * [getCompanyData 查询认证信息]
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */
    getCompanyData(params){
	    let url = project + version + '/company/' + params._id;
	    Axios.get({
	      url,
	      isLoading: true,  
	    }).then((response) => {
	          
	        if(response.code == 0 || response.code == 110008){
            params.success &&  params.success(response)
	        }else{
	          Toast(response.errMsg);
	        }
	      })
	    .catch(error => {
	    	console.log(error);
	    });
	    return this;
  	},
  	/**
  	 * [getAuthentication]
  	 * @param  {[type]}   data     [description]
  	 * @param  {Function} callback [description]
  	 * @return {[type]}            [description]
  	 */
  	buyFn(data, callback){
      let url = project + version + '/company/authentication';
      Axios.post({
        isLoading: false,
        url,
        isdeal: false,
        data: data,
      }).then((response) => {
    		callback && callback(response);
          // if(response.code == 0 || response.code == 110008){
          //   callback && callback(response);
          // }else{
          //   Toast(response.errMsg);
          // }
        }).catch(error => {
        	console.log(error)
        })
      return this;
    },
    /**
     * [editSave 认证修改]
     * @return {[type]} [description]
     */
    editSave(data, callback){
      let url = project + version + '/company/editSave';
      Axios.post({
        isLoading: true,
        url,
        isdeal: false,
        data: data,
      }).then((response) => {
        callback && callback(response);
          // if(response.code == 0 || response.code == 110008){
          //   callback && callback(response);
          // }else{
          //   Toast(response.errMsg);
          // }
        }).catch(error => {
          console.log(error)
        })
      return this;
    },
    /**
     * [insertQuotedInfo 报价 我要买]
     * @param  {[type]}   data     [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    insertQuotedInfo(data, callback){
      let url = project + version + '/quotedPrice/insertQuotedInfo';
      Axios.post({
        isLoading: false,
        url,
        isdeal: true,
        data: data,
      }).then((response) => {
          callback && callback(response);
          // if(response.code == 0 || response.code == 110008){
          //   callback && callback(response);
          // }else{
          //   Toast(response.errMsg);
          // }
        }).catch(error => {
          console.log(error)
        })
      return this;
    },
    /**
     * [getQuotedPrice 查询竞价]
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */
    getQuotedPrice(params){
      let url = project + version + '/quotedPrice/detail/' + params._id;
      Axios.get({
        url,
      }).then((response) => {
        if(response.code == 0 || response.code == 110008){
          params.success &&  params.success(response.data)
        }else{
          response.errMsg && Toast(response.errMsg);
        }
      })
      .catch(error => {
        console.log(error)
      });
      return this;
    },
    /**
     * [getCommercialPaperList 查询发布票据列表]
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */
    getCommercialPaperList(data){
      let url = project + version + '/commercialPaper';
      return new Promise((resolve, reject) => {
        Axios.get({
        data: data,
        url,
        isLoading: true,
      }).then((response) => {
        if(response.code == 0 || response.code == 110008){
          return resolve(response)
        }else{
          Toast(response.errMsg);
          return reject(response);
        }
      })
      .catch(error => {
        return reject(error)
        // console.log(error)
      });
      })
    },
    /**
     * [deleteCommercialPaper 注销票据]
     * @param  {[type]}   cpId     [票据cpId]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    deleteCommercialPaper(cpId, callback){
      let url = project + version + '/commercialPaper/paper/'+ cpId;
      Axios.delete({
        isLoading: true,
        url,
        success(response){
          if(response.code == 0 || response.code == 110008){
            callback && callback(response);
          }else{
            response.errMsg && Toast(response.errMsg);
          }
        }
      });
      return this;
    },
    /**
     * [changeCommercialPaper 票据修改]
     * @param  {[type]}   data     [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    changeCommercialPaper(data, callback){
      let url = project + version + '/commercialPaper';
      Axios.put({
          isLoading: true,
          url,
          data: data,
        }).then((response) => {
          if(response.code == 0 || response.code == 110008){
            callback && callback(response);
          }else{
            response.errMsg && Toast(response.errMsg);
          }
        }).catch(error => {
          console.log(error)
        })
      return this;
    },
    biddingFn(data, callback){
      let url = project + version + '/commercialPaper/bidding';
      Axios.put({
          isLoading: true,
          url,
          data: data,
          isdeal: true,
        }).then((response) => {
          callback && callback(response);
        }).catch(error => {
          console.log(error)
        })
      return this;
    },
    /**
     * [getQuotedPri 我的买入]
     * @param  {[type]}   data     [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    getQuotedPri(data){
      let url = project + version + '/quotedPrice';
      
      return new Promise((resolve, reject) => {
        Axios.get({
          isLoading: true,
          url,
          data: data.data
        }).then((response) => {
          if(response.code == 0 || response.code == 110008){
            return resolve(response);
          }else{
            response.errMsg && Toast(response.errMsg);
            return reject(response)
          }
        }).catch(error => {
          // console.log(error);
            return reject(error);
        })
      })
      
    },
    /**
     * [cancelQuotedPrice 取消报价]
     * @param  {[type]}   data     [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    cancelQuotedPrice(priceId, callback){

      let url = project + version + '/quotedPrice/cancle/' + priceId;

      Axios.delete({
        isLoading: true,
        url,
        success(response){
          if(response.code == 0 || response.code == 110008){
            callback && callback(response);
          }else{
            response.errMsg && Toast(response.errMsg);
          }
        }
      });
      return this;
    },
    /**
     * [resetPassword 重置支付密码]
     * @param  {[type]}   priceId  [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    resetPassword(data){

      let url = project + version + '/company/resetPassword';

      return new Promise((resolve, reject) => {
        Axios.post({
        isLoading: true,
        url,
        data
        }).then((response) =>{
          if(response.code == 0 || response.code == 110008){
            return resolve(response)
          }else{
            response.errMsg && Toast(response.errMsg);
            return reject(error);
          }
        }).catch(error => {
            return reject(error)
        })   
      })
    },
    /**
     * [refuseQuotedPric 拒绝报价]
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    refuseQuotedPric(id){
      let url = project + version + `/quotedPrice/refuse/${id}`;

      return new Promise((resolve, reject) => {
        Axios.put({
          isLoading: true,
          url,
        }).then((response) => {
          if(response.code == 0 || response.code == 110008){
            // callback && callback(response);
            return resolve(response);
          }else{
            response.errMsg && Toast(response.errMsg);
            return reject(response);
          }
        }).catch(error => {
          // console.log(error);
          return reject(error);
        })
      })
    },
    /**
     * [addCompanyAccount 增加银行账户]
     * @param {[type]} data [description]
     */
    addCompanyAccount(data){
      let url = project + version + '/companyAccount/insertAccountInfo';

      return new Promise((resolve, reject) => {
        Axios.post({
          isLoading: true,
          url,
          data: data
        }).then((response) => {
          if(response.code == 0 || response.code == 110008){
            // callback && callback(response);
            return resolve(response);
          }else{
            response.errMsg && Toast(response.errMsg);
            return reject(response);
          }
        }).catch(error => {
          // console.log(error);
          return reject(error);
        })
      })
    },
    /**
     * [getBankList 获取银行列表]
     * @return {[type]} [description]
     */
    getBankList(){
      let url = project + version + '/companyAccount/queryAllBank';
      return new Promise((resolve, reject) => {
        Axios.get({
          url
        }).then(response => {
          return resolve(response);
        }).catch(error => {
          return reject(error);
        })
      })
    },
    /**
     * [getCompanyAccount 获取列表]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
     getCompanyAccount(data){
      let url = project + version + '/companyAccount';

      return new Promise((resolve, reject) => {
        Axios.post({
          isLoading: true,
          url,
          isdeal: true,
          data: data
        }).then((response) => {
          if(response.code == 0 || response.code == 110008){
            // callback && callback(response);
            return resolve(response);
          }else{
            response.errMsg && Toast(response.errMsg);
            return reject(response);
          }
        }).catch(error => {
          // console.log(error);
          return reject(error);
        })
      })
    },
    /**
     * [changeCompanyAccount 修改银行账户信息]
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
     changeCompanyAccount(id, data){
      let url = project + version + `/companyAccount/${id}`;

      return new Promise((resolve, reject) => {
        Axios.put({
          isLoading: true,
          url,
          data
        }).then((response) => {
          if(response.code == 0 || response.code == 110008){
            // callback && callback(response);
            return resolve(response);
          }else{
            response.errMsg && Toast(response.errMsg);
            return reject(response);
          }
        }).catch(error => {
          // console.log(error);
          return reject(error);
        })
      })
    },
    /**
     * [deleteAccount 删除银行帐户]
     * @return {[type]} [description]
     */
    deleteAccount(id){
      let url = project + version + `/companyAccount/${id}`;

      return new Promise((resolve, reject) => {
        Axios.deleteN({
          isLoading: true,
          url
        }).then((response) => {
          if(response.code == 0 || response.code == 110008){
            // callback && callback(response);
            return resolve(response);
          }else{
            response.errMsg && Toast(response.errMsg);
            return reject(response);
          }
        }).catch(error => {
          // console.log(error);
          return reject(error);
        })
      })
    },
    /**
     * [changeAccountType 修改账户类型]
     * @return {[type]} [description]
     */
  	changeAccountType(data){
      let url = project + version + '/companyAccount/copyAccount';

      return new Promise((resolve, reject) => {
        Axios.post({
          isLoading: true,
          url,
          data: data,
        }).then((response) => {
          if(response.code == 0 || response.code == 110008){
            // callback && callback(response);
            return resolve(response);
          }else{
            response.errMsg && Toast(response.errMsg);
            return reject(response);
          }
        }).catch(error => {
          return reject(response);
        })
      })
    },
    /**
     * [getBankList description]
     * @return {[type]} [description]
     */
    getCompanyDataInfo(id){
      let url = project + version + '/company/byUserId/'+id;
      return new Promise((resolve, reject) => {
        Axios.get({
          url,
          isLoading: true,
        }).then(response => {
          return resolve(response);
        }).catch(error => {
          return reject(error);
        })
      })
    },
    /**
     * [getOcrData OCR识别图片信息]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    getOcrData(data){
      let url = project + version + '/ocr/ticket';

      return new Promise((resolve, reject) => {
        Axios.post({
          isLoading: true,
          url,
          data: data,
          isdeal: true,
        }).then((response) => {
          if(response.code == 0 || response.code == 110008){
            // callback && callback(response);
            return resolve(response);
          }else{
            response.errMsg && Toast(response.errMsg);
            return reject(response);
          }
        }).catch(error => {
          return reject(response);
        })
      })
    },
    /**
     * [checkedDeal 确认交易]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    checkedDeal(data){
      //id 是cpId imageName 1是我的卖出 0 是我的买入上传
      let url = project + version + '/quotedPrice/upload';

      return new Promise((resolve, reject) => {
        Axios.post({
          isLoading: true,
          url,
          data: data,
          isdeal: true,
        }).then((response) => {
          if(response.code == 0 || response.code == 110008){
            // callback && callback(response);
            return resolve(response);
          }else{
            response.errMsg && Toast(response.errMsg);
            return reject(response);
          }
        }).catch(error => {
          return reject(response);
        })
      })
    },
    /**
     * [submitComment 提交评价]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    submitComment(data){
      let url = project + version + '/comment';

      return new Promise((resolve, reject) => {
        Axios.post({
          isLoading: true,
          url,
          data: data,
        }).then((response) => {
            if(response.code == 0 || response.code == 110008){
              return resolve(response);
            }else{
              response.errMsg && Toast(response.errMsg);
              return reject(response);
            }
        }).catch(error => {
          return reject(error);
        });
      })
      
    },

    /**
     * [getOcrCompanyData 识别营业执照图片]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    getOcrBusinesslicenseData(data){
      let url = project + version + '/ocr/businesslicense';

      return new Promise((resolve, reject) => {
        Axios.post({
          isLoading: true,
          url,
          data: data,
          isdeal: true,
        }).then((response) => {
          if(response.code == 0 || response.code == 110008){
            // callback && callback(response);
            return resolve(response);
          }else{
            response.errMsg && Toast(response.errMsg);
            return reject(response);
          }
        }).catch(error => {
          return reject(response);
        })
      })
    },
    /**
     * [getOcrIdCardData 识别身份证正面]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    getOcrIdCardData(data){
      let url = project + version + '/ocr/idcardfront';

      return new Promise((resolve, reject) => {
        Axios.post({
          isLoading: true,
          url,
          data: data,
          isdeal: true,
        }).then((response) => {
          if(response.code == 0 || response.code == 110008){
            // callback && callback(response);
            return resolve(response);
          }else{
            response.errMsg && Toast(response.errMsg);
            return reject(response);
          }
        }).catch(error => {
          return reject(response);
        })
      })
    },
    /**
     * [getOcrIdBackCardData 身份证反面]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    getOcrIdBackCardData(data){
      let url = project + version + '/ocr/idcardback';

      return new Promise((resolve, reject) => {
        Axios.post({
          isLoading: true,
          url,
          data: data,
          isdeal: true,
        }).then((response) => {
          if(response.code == 0 || response.code == 110008){
            // callback && callback(response);
            return resolve(response);
          }else{
            response.errMsg && Toast(response.errMsg);
            return reject(response);
          }
        }).catch(error => {
          return reject(error);
        })
      })
    },
    /**
     * [getCompanyList 获取指定买家列表]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    getCompanyList(){
      let url = project + version + '/company/queryAllCompany';

      return new Promise((resolve, reject) => {
        Axios.get({
          isLoading: true,
          url,
        }).then(response => {
          return resolve(response);
        }).catch(error =>{
          return reject(error);
        })
      })
    },
    /**
     * [verifyMobileNumber 修改登录手机号--验证旧手机号]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    verifyMobileNumber(data){
      let url = project + version + '/comUsers/verifyMobileNumber';

      return new Promise((resolve, reject) => {
        Axios.post({
          isLoading: true,
          data,
          url,
        }).then(response => {
          return resolve(response);
        }).catch(error =>{
          return reject(error);
        })
      })
    },
    /**
     * [updateMobileNumber 修改登录手机号--验证新手机号]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    updateMobileNumber(data){
      let url = project + version + '/comUsers/updateMobileNumber';

      return new Promise((resolve, reject) => {
        Axios.post({
          isLoading: true,
          data,
          url,
        }).then(response => {
          return resolve(response);
        }).catch(error =>{
          return reject(error);
        })
      })
    },
    /**
     * [getSuppBanks 获取开户行全称]
     * @return {[type]} [description]
     */
    getSuppBanks(){
      let url = project + version + '/banks/getSuppBanks';

      return new Promise( (resolve, reject) => {
        Axios.get({
          url,
        }).then(response =>{
          return resolve(response);
        }).catch(error =>{
          return reject(error);
        })
      })
    },
    /**
     * [getAllProvince 获取所有省]
     * @return {[type]} [description]
     */
    getAllProvince(){
      const url = project + version + '/areas/getAllProvince';

      return new Promise( (resolve, reject) => {
        Axios.get({
          url
        }).then( response => {
          return resolve(response)
        }).catch(error => {
          return reject(error);
        })
      })
    },

    /**
     * [getAllCity 获取所有市]
     * @return {[type]} [description]
     */
    getAllCity(provId){
      let url = project + version + '/areas/getAllCity';

      if(provId){
        url += `?provId=${provId}`;
      }

      return new Promise( (resolve, reject) => {
        Axios.get({
          url
        }).then( response => {
          return resolve(response)
        }).catch(error => {
          return reject(error);
        })
      })
    },
    /**
     * [getBanks 获取所有支行]
     * @param  {[type]} provId [description]
     * @return {[type]}        [description]
     */
    getBanks(cityCode, bankId){
      let url = project + version + '/banks/getBanks';

      if(cityCode && bankId){
        url += `?cityCode=${cityCode}&bankId=${bankId}`;
      }
      
      return new Promise( (resolve, reject) => {
        Axios.get({
          url
        }).then( response => {
          return resolve(response)
        }).catch(error => {
          return reject(error);
        })
      })
    },
    /**
     * [insertOpenAccountInfo 实名认证--绑定账户]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    insertOpenAccountInfo(data){
      let url = project + version + '/companyAccount/insertOpenAccountInfo';

      return new Promise( (resolve, reject) => {
        Axios.post({
          url,
          data,
          isLoading: true,

        }).then( response => {
          return resolve(response);
        }).catch( error => {
          return reject(error);
        })
      })
    },

    /**
     * [queryAccountInfo 获取默认绑卡信息]
     * @return {[type]} [description]
     */
    queryAccountInfo(){
      let url = project + version + '/companyAccount/queryAccountInfo';

      return new Promise( (resolve, reject) => {
        Axios.get({
          url,
        }).then( response => {
          return resolve(response);
        }).catch( error =>{
          return reject(error);
        })
      })
    },
    /**
     * [verifyAccount 验证金额]
     * @return {[type]} [description]
     */
    verifyAccount(data){
      let url = project + version + '/companyAccount/verifyAccount';

      return new Promise((resolve, reject) => {
        Axios.post({
          url,
          isLoading:true,
          data,
        }).then(response => {
          return resolve(response);
        }).catch( error =>{
          return reject(error);
        })
      })
    },
    /**
     * [queryOpenAccountUrl 获取激活地址]
     * @return {[type]} [description]
     */
    queryOpenAccountUrl(data){
      let url = project + version + '/companyAccount/queryOpenAccountUrl';

      return new Promise((resolve, reject) => {
        Axios.post({
          url,
          data,
          isLoading: true,
        }).then( response => {
          return resolve(response);
        }).catch(error => {
          return reject(error);
        })
      })
    },

    /**
     * [openEAccount 重新开户]
     * @return {[type]} [description]
     */
    openEAccount(){
      let url = project + version + '/companyAccount/openEAccount';

      return new Promise((resolve, reject) => {
        Axios.post({
          url,
          isLoading: true,
        }).then( response =>{
          return resolve(response);
        }).catch(error =>{
          return reject(error);
        })
      })
    },

    /**
     * [getBankData 通过accountId 查询卡信息]
     * @param  {[type]} id [accountId]
     * @return {[type]}    [description]
     */
    getBankData(id){
      let url = project + version + '/companyAccount/' + id;

      return new Promise((resolve, reject) => {
        Axios.get({
          url
        }).then( response => {
          return resolve(response);
        }).catch(error => {
          return reject(error);
        })
      })
    },

    /**
     * [bindCard 新增卡]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    bindCard(data){
      let url = project + version + '/companyAccount/bindCard';

      return new Promise((resolve, reject) => {
        Axios.post({
          url,
          data,
          isLoading: true,
        }).then( response => {
          return resolve(response);
        }).catch( error => {
          return reject(error);
        })
      })
    },
    /**
     * [verifyBindCardAccount 新增卡验证金额]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    verifyBindCardAccount(data){
      let url = project + version + '/companyAccount/verifyBindCardAccount';

      return new Promise((resolve, reject) => {
        Axios.post({
          url,
          data,
          isLoading: true,
        }).then( response => {
          return resolve(response);
        }).catch(error => {
          return reject(error);
        })
      })
    },
    /**
     * [unBindCard 解绑卡]
     * @param  {[type]} accountId [description]
     * @return {[type]}           [description]
     */
    unBindCard(accountId){
      let url = project + version + '/companyAccount/unBindCard';

      url += `?accountId=${accountId}`;
      return new Promise( (resolve, reject) => {
        Axios.get({
          url,
          isLoading: true,
        }).then( response => {
          return resolve(response);
        }).catch(error => {
          return reject(error);
        })
      })
    },
    /**
     * [modifyDefaultAccount 设置默认账户]
     * @param  {[type]} accountId [description]
     * @return {[type]}           [description]
     */
    modifyDefaultAccount(accountId){
      let url = project + version + '/companyAccount/modifyDefaultAccount';

      url += `?accountId=${accountId}`;
      return new Promise( (resolve, reject) => {
        Axios.get({
          url,
          isLoading: true,
        }).then( response => {
          return resolve(response);
        }).catch(error => {
          return reject(error);
        })
      })
    },

    /**
     * [accountAndBalance 获取资金账户相关信息]
     * @return {[type]} [description]
     */
    accountAndBalance(){
      let url = project + version + '/transaction/accountAndBalance';

      return new Promise( (resolve, reject) => {
        Axios.post({
          url,
        }).then( response => {
          return resolve(response);
        }).catch( error => {
          return reject(error);
        })
      })
    },
    /**
     * [rechargeInfo 充值]
     * @return {[type]} [description]
     */
    rechargeInfo(){
      let url = project + version + '/transaction/rechargeInfo';

      return new Promise( (resolve, reject) => {
        Axios.post({
          url,
        }).then( response => {
          return resolve(response);
        }).catch(error => {
          return reject(error);
        })
      })
    },
    /**
     * [withDraw 提现]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    withDraw(data){
      let url = project + version + '/transaction/withdraw';  
      return new Promise((resolve, reject) => {
        Axios.post({
          url, 
          data,
          isdeal: true,
        }).then( response => {
          return resolve(response);
        }).catch(error => {
          return reject(error);
        })
      })
    },
    /**
     * [cpOrder 撮合成交列表]
     * @return {[type]} [description]
     */
    cpOrder(data){
      let url = project + version + '/cpOrder?';  

      for(let i in data){
        url += `${i}=${data[i]}&`;
      }

      return new Promise((resolve, reject) => {
        Axios.get({
          url, 
          isLoading: true,
        }).then( response => {
          return resolve(response);
        }).catch(error => {
          return reject(error);
        })
      })
    },
    /**
     * [queryEndTime 查询剩余时间]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    queryEndTime(data){
      let url = project + version + '/companyAccount/queryEndTime';

      return new Promise((resolve, reject) => {
        Axios.post({
          url,
          data,
          isLoading: true
        }).then(response => {
          return resolve(response);
        }).catch(error => {
          return reject(error);
        })
      })
    },
    /**
     * [cpOrderDetail 通过ordNo 查询详细]
     * @param  {[type]} cpNo [description]
     * @return {[type]}      [description]
     */
    cpOrderDetail(ordNo, type){
      let url = project + version + '/cpOrder/detail?ordNo='+ordNo+'&type='+ type;

      return new Promise((resolve, reject) => {
        Axios.get({
          url,
        }).then(response => {
          return resolve(response);
        }).catch(error => {
          return reject(error);
        })
      })
    },
    /**
     * [uploadFile 下载]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    uploadFile(data){
      let url = project + version + '/cpOrder/pdf';

      return new Promise((resolve, reject) => {
        Axios.post({
          url,
          data,
          isdeal: true,
          // responseType: 'blod',
          responseType: 'arraybuffer',
          isNoHeader: true,
        }).then(response => {
          return resolve(response);
        }).catch(error => {
          return reject(error);
        })
      })
    },
    /**
     * [cancelOrder 终止订单]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    cancelOrder(data){
      let url = project + version + '/cpOrder/seller/cancel';

      return new Promise((resolve, reject) => {
        Axios.post({
          url,
          data,
          isdeal: true,
        }).then( response => {
          return resolve(response);
        }).catch(error => {
          return reject(error);
        })
      })
    },


    sellerCosts(data){
      let url = project + version + '/cpOrder/sellerCosts';

      return new Promise((resolve, reject) => {
        Axios.post({
          url,
          data,
          isdeal: true,
        }).then( response => {
          return resolve(response);
        }).catch( error => {
          return reject(error);
        })
      })
    },

    refuseCosts(data){

      let url = project + version + '/cpOrder/seller/refuse';

      return new Promise((resolve, reject) => {
        Axios.post({
          url,
          data,
          isdeal: true,
        }).then( response => {
          return resolve(response);
        }).catch( error => {
          return reject( error);
        })
      })
    },

    buyerCosts(data){
      let url = project + version + '/cpOrder/buyerCosts';

      return new Promise((resolve, reject) => {
        Axios.post({
          url,
          data,
          isdeal: true,
        }).then( response => {
          return resolve(response);
        }).catch( error => {
          return reject( error );
        })
      })
    },

    pay(data){
      let url = project + version + '/cpOrder/pay';

      return new Promise((resolve, reject) => {
        Axios.post({
          url,
          data,
          isLoading: true,
          isdeal: true,
        }).then( response => {
          return resolve(response);
        }).catch( error => {
          return reject( error );
        })
      })
    },

    signEc(data){
      let url = project + version + '/cpOrder/signEc';

      return new Promise((resolve, reject) => {
        Axios.post({
          url,
          data,
          isdeal: true,
        }).then( response => {
          return resolve(response);
        }).catch( error => {
          return reject(error);
        })
      })
    },

    payDeposit(data){
      let url = project + version + '/cpOrder/payDeposit';

      return new Promise((resolve, reject) => {
        Axios.post({
          url,
          data,
          isdeal: true,
        }).then( response => {
          return resolve( response );
        }).catch(error => {
          return reject(error);
        })
      })
    },

    queryBuyerAccount(ordNo){
      let url = project + version + '/cpOrder/queryBuyerAccount/' + ordNo;

      return new Promise((resolve, reject)=>{ 
        Axios.get({
          url,
        }).then(response => {
          return resolve(response);
        }).catch(error => {
          return reject(error);
        })
      })
    },

    confirmEndorse(data){
      let url = project + version + '/cpOrder/confirmEndorse';

      return new Promise((resolve, reject) => {
        Axios.post({
          url,
          data,
          isdeal: true,
          isLoading: true
        }).then(response => {
          return resolve(response);
        }).catch(error => {
          return reject(error);
        })
      })
    },

    buyerCancel(data){

      let url =  project + version + '/cpOrder/buyer/cancel';

      return new Promise((resolve, reject) => {
        Axios.post({
          url,
          data,
          isdeal: true,
          isLoading: true,
        }).then( response => {
          return resolve(response);
        }).catch(error => {
          return reject(error);
        })
      })
    },

    buyerToPrice(data){
      let url = project + version + '/cpOrder/buyer/toPrice';

      return new Promise( (resolve, reject) => {
        Axios.post({
          url,
          data,
          isdeal: true,
          isLoading: true,
        }).then( response => {
          return resolve(response);
        }).catch(error => {
          return reject(error);
        })
      })
    },

    rePrice(data){
      let url = project + version + '/cpOrder/buyer/rePrice';

      return new Promise((resolve, reject) => {
        Axios.post({
          url,
          data,
          isdeal: true,
          isLoading: true,
        }).then(response => {
          return resolve(response);
        }).catch(error => {
          return reject(error);
        })
      })
    },

    queryAgreeTamplate(data){
      let url = project + version + '/esign/queryAgreeTamplate?';

      for(let i in data){
        url += `${i}=${data[i]}&`
      }
      
      return new Promise((resolve, reject) => {
        Axios.get({
          url
        }).then(response => {
          return resolve(response);
        }).catch(error => {
          return reject(error);
        })
      })
    },

    signFor(data){

      let url = project + version + '/cpOrder/signFor';
      return new Promise((resolve, reject) => {
        Axios.post({
          url,
          data,
          isdeal: true,
          isLoading: true,
        }).then(response => {
          return resolve(response);
        }).catch(error => {
          return reject(error);
        })
      })
    },

    transactionData(data){
      let url = project + version + '/transaction';

      return new Promise((resolve, reject) => {
        Axios.post({
          url,
          data,
          isdeal: true,
          isLoading: true,
        }).then(response => {
          return resolve(response);
        }).catch(error => {
          return reject(error);
        })
      })
    },

    contract(data){
      let url = project + version + '/cpOrder/contract?';

      for(let i in data){
        url += `${i}=${data[i]}&`;
      }

      return new Promise((resolve, reject) => {
        Axios.get({
          url
        }).then(response => {
          return resolve(response);
        }).catch(error => {
          return reject(error);
        })
      })
    },

    contractSms(data){
      let url = project + version + '/cpOrder/contract/sms';

      return new Promise((resolve, reject) => {
        Axios.post({
          url,
          data,
          isLoading: true,
          isdeal: true,
        }).then(response => {
          return resolve(response);
        }).catch(error => {
          return reject(error);
        })
      })
    },

    contractConfirm(data){
      let url = project + version + '/cpOrder/contract/confirm';

      return new Promise((resolve, reject) => {
        Axios.post({
          url,
          data,
          isdeal: true,
          isLoading: true
        }).then(response => {
          return resolve(response);
        }).catch(error => {
          return reject(error);
        })
      })
    },

    getWhiteNameList(data){
      let url = project + version + '/acceptorWhiteList?';

      for(let i in data){
        url += `${i}=${data[i]}&`;
      }

      return new Promise((resolve, reject) => {
        Axios.get({
          url,
          isLoading: true
        }).then(response => {
          return resolve(response);
        }).catch(error => {
          return reject(error);
        })
      })
    },

    insertData(data){
      let url = project + version + '/acceptorWhiteList/insert';

      return new Promise((resolve, reject) => {
        Axios.post({
          url,
          data,
          isLoading: true,
        }).then((res) => {
          return resolve(res);
        }).catch(error => {
          return reject(error);
        })
      })
    },

    delAcceptorWhiteList(id){
      let url = project + version + '/acceptorWhiteList/' + id;

      return new Promise((resolve, reject) => {
        Axios.deleteN({
          url,
        }).then((res) => {
          return resolve(res);
        }).catch(error => {
          return reject(error);
        })
      })
    },

    bindWechat(data){
      let url = project + version + '/acceptorWhiteList';

      return new Promise((resolve, reject) => {
        Axios.post({
          url,
          data,
          isLoading: true,
          isdeal: true,
        }).then(res => {
          return resolve(res);
        }).catch(error => {
          return reject(error);
        })
      })
    },

    updateCompanyInfo(data){
      let url = project + version + '/company/updateInfo';

      return new Promise((resolve, reject) => {
        Axios.post({
          url,
          data,
          isLoading: true,
        }).then(res => {
          return resolve(res);
        }).catch(error => {
          return reject(error);
        })
      })
    },

    getCompanies(){
      let url = project + version + '/companies';

      return new Promise((resolve, reject) => {
        Axios.get({
          url,
          isLoading: true
        }).then( res => {
          return resolve(res);
        }).catch( error => {
          return reject(error);
        })
      })
    },

    changeCompany(data){
      let url = project + version + '/companies/change';

      return new Promise((resolve, reject) => {
        Axios.post({
          url,
          data,
          isdeal: true,
          isLoading: true,
        }).then( res => {
          return resolve(res);
        }).catch( error => {
          return reject(error);
        })
      })
    }
    
}

export default server;
