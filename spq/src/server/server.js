
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

    return new Promise((resolve, reject) => {
      Axios.get({
        url: 'open-cp/v1/captcha',
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
    let url = 'open-cp/v1/smsCaptcha/?phoneNumber=' + phoneNumber;

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
   * [getSmsCaptcha1 获取验证码]
   * @param  {[type]} phoneNumber [description]
   * @param  {[type]} loginName   [description]
   * @param  {[type]} type        [description]
   * @return {[type]}             [description]
   */
  getSmsCaptcha1(obj){
    let url = 'open-cp/v1/smsCaptcha/?';

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
		let url = 'open-cp/v1/login';

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
    let url = 'open-cp/v1/login';
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
    let url = 'open-cp/v1/users/';
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
		let url = 'open-cp/v1/register';
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
    let url = 'open-cp/v1/forgetPassword';

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
	getBusinessTickets(data, callback){
		let url = 'open-cp/v1/businessTickets';
    return new Promise((resolve, reject) => {
      Axios.post({
        isLoading: true,
        url,
        isdeal: true,
        data: data,
      }).then((response) => {
        if(response.code == 0 || response.code == 110008){
          return resolve(response);
          callback && callback(response);
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
	    let url = 'open-cp/v1/businessTickets/' + params._id;
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
      let url = 'open-cp/v1/commercialPaper/paper/' + _id;

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
        let url = 'open-cp/v1/commercialPaper';
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
	    let url = 'open-cp/v1/commercialPaper/' + params._id;
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
      let url = 'open-cp/v1/company/authentication';
      Axios.post({
        isLoading: false,
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
	    let url = 'open-cp/v1/company/' + params._id;
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
      let url = 'open-cp/v1/company/authentication';
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
      let url = 'open-cp/v1/company/editSave';
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
     * [insertQuotedInfo 报价 我要买]
     * @param  {[type]}   data     [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    insertQuotedInfo(data, callback){
      let url = 'open-cp/v1/quotedPrice/insertQuotedInfo';
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
      let url = 'open-cp/v1/quotedPrice/detail/' + params._id;
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
    getCommercialPaperList(params){
      let url = 'open-cp/v1/commercialPaper';
      return new Promise((resolve, reject) => {
        Axios.get({
        data: params.data,
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
      let url = 'open-cp/v1/commercialPaper/paper/'+ cpId;
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
      let url = 'open-cp/v1/commercialPaper';
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
      let url = 'open-cp/v1/commercialPaper/bidding';
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
      let url = 'open-cp/v1/quotedPrice';
      
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

      let url = 'open-cp/v1/quotedPrice/cancle/' + priceId;

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

      let url = 'open-cp/v1/company/resetPassword';

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
      let url = `open-cp/v1/quotedPrice/refuse/${id}`;

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
      let url = 'open-cp/v1/companyAccount/insertAccountInfo';

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
      let url = 'open-cp/v1/companyAccount/queryAllBank';
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
      let url = 'open-cp/v1/companyAccount';

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
      let url = `open-cp/v1/companyAccount/${id}`;

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
      let url = `open-cp/v1/companyAccount/${id}`;

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
      let url = 'open-cp/v1/companyAccount/copyAccount';

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
      let url = 'open-cp/v1/company/byUserId/'+id;
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
     * [getOcrData OCR识别图片信息]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    getOcrData(data){
      let url = 'open-cp/v1/ocr/ticket';

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
      let url = 'open-cp/v1/quotedPrice/upload';

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
      let url = 'open-cp/v1/comment';

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
      let url = 'open-cp/v1/ocr/businesslicense';

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
      let url = 'open-cp/v1/ocr/idcardfront';

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
      let url = 'open-cp/v1/ocr/idcardback';

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


}

export default server;
