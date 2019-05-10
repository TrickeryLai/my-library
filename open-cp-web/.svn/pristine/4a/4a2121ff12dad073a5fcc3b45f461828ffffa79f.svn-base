template.defaults.escape=false;


/*************************************
	由于template.helper是异步的，循环方案暂时不行
*************************************/
// for(var key in common_params){
// 	var data=common_params[key];
// 	for(var par in data){
// 		var arr=data[par];
// 		if(Array.isArray(arr)){
// 			console.log(par)
// 			template.helper(par+'Format',function(val){
// 				var str='';
// 				var language=lang.getLang();
// 				console.log('arr')
// 				// console.log(arr)
// 			console.log(par)

// 				// arr.forEach(function(n,i){
// 				// 	// console.log(n.value)
// 				// 	if(n.value == val)str=(n.name1?n.name1?n.name1[language]:n.name[language]:n.name1?n.name1[language]:n.name[language]);
// 				// });

// 				for(var i=0;i<arr.length;i++){
// 					if(arr[i].value == val)str=(n.name1?n.name1[language]:n.name[language]);
// 				}
// 			   	return str
// 			})
// 		}
// 	}
// }


template.helper('statusFormat',function(val){
	var str='';
	var language=lang.getLang();
	common_params['rbac']['status'].forEach(function(n,i){
		if(n.value == val)str=n.name1?n.name1[language]:n.name[language];
	});
   	return str
})
template.helper('cpStatusFormat',function(val){
	var str='';
	var language=lang.getLang();
	common_params['rbac']['cpStatus'].forEach(function(n,i){
		if(n.value == val)str=n.name1?n.name1[language]:n.name[language];
	});
   	return str
})
template.helper('cpStatusFormatText',function(val){
	var str='';
	var language=lang.getLang();
	common_params['rbac']['cpStatus'].forEach(function(n,i){
		if(n.value == val)str=n.name?n.name[language]:n.name1[language];
	});
   	return str
})
template.helper('quoteStatusFormat',function(val){
	var str='';
	var language=lang.getLang();
	common_params['rbac']['quoteStatus'].forEach(function(n,i){
		if(n.value == val)str=n.name1?n.name1[language]:n.name[language];
	});
   	return str
})
template.helper('businessTypeFormat',function(val){
	var str='';
	var language=lang.getLang();
	common_params['rbac']['businessType'].forEach(function(n,i){
		if(n.value == val)str=n.name1?n.name1[language]:n.name[language];
	});
   	return str
})
template.helper('codeStatusFormat',function(val){
	var str='';
	var language=lang.getLang();
	common_params['rbac']['codeStatus'].forEach(function(n,i){
		if(n.value == val)str=n.name1?n.name1[language]:n.name[language];
	});
   	return str
})
template.helper('ruleStatusFormat',function(val){
    var str='';
    var language=lang.getLang();
    common_params['rbac']['isDeleted'].forEach(function(n,i){
        if(n.value == val)str=n.name1?n.name1[language]:n.name[language];
    });
    return str
})

template.helper('userStatusFormat',function(val){
	var str='';
	var language=lang.getLang();
	common_params['rbac']['userStatus'].forEach(function(n,i){
		if(n.value == val)str=n.name1?n.name1[language]:n.name[language];
	});
   	return str
})

template.helper('channeFormat',function(val){
	var str='';
	var language=lang.getLang();
	common_params['rbac']['channel'].forEach(function(n,i){
		if(n.value == val)str=n.name1?n.name1[language]:n.name[language];
	});
   	return str
})

template.helper('operStatusFormat',function(val){
	var str='';
	var language=lang.getLang();
	common_params['rbac']['operStatus'].forEach(function(n,i){
		if(n.value == val)str=n.name1?n.name1[language]:n.name[language];
	});
   	return str
})

template.helper('sex',function(val){
    var str='';
    var language=lang.getLang();
    common_params['rbac']['sex'].forEach(function(n,i){
        if(n.value == val)str=n.name1?n.name1[language]:n.name[language];
    });
    return str
})

template.helper('loginStatusFormat',function(val){
	var str='';
	var language=lang.getLang();
	common_params['rbac']['loginStatus'].forEach(function(n,i){
		if(n.value == val)str=n.name1?n.name1[language]:n.name[language];
	});
   	return str
})


template.helper('onlineStatusFormat',function(val){
	var str='';
	var language=lang.getLang();
	common_params['rbac']['onlineStatus'].forEach(function(n,i){
		if(n.value == val)str=n.name1?n.name1[language]:n.name[language];
	});
   	return str
})






template.helper('actionFormat',function(val){
	var str='';
	var language=lang.getLang();
	common_params['rbac']['action'].forEach(function(n,i){
		if(n.value == val)str=n.name1?n.name1[language]:n.name[language];
	});
   	return str
})

template.helper('jobStatusFormat',function(val){
	var str='';
	var language=lang.getLang();
	common_params['rbac']['jobStatus'].forEach(function(n,i){
		if(n.value == val)str=n.name1?n.name1[language]:n.name[language];
	});
   	return str
})

template.helper('jobLogsStatusFormat',function(val){
	var str='';
	var language=lang.getLang();
	common_params['rbac']['jobLogsStatus'].forEach(function(n,i){
		if(n.value == val)str=n.name1?n.name1[language]:n.name[language];
	});
   	return str
})



template.helper('jobMisfirePolicyFormat',function(val){
	var str='';
	var language=lang.getLang();
	common_params['rbac']['jobMisfirePolicy'].forEach(function(n,i){
		if(n.value == val)str=n.name1?n.name1[language]:n.name[language];
	});
   	return str
})

template.helper('isDefaultFormat',function(val){
	var str='';
	var language=lang.getLang();
	common_params['rbac']['isDefault'].forEach(function(n,i){
		if(n.value == val)str=n.name1?n.name1[language]:n.name[language];
	});
   	return str
})

template.helper('configTypeFormat',function(val){
	var str='';
	var language=lang.getLang();
	common_params['rbac']['configType'].forEach(function(n,i){
		if(n.value == val)str=n.name1?n.name1[language]:n.name[language];
	});
   	return str
})

template.helper('jobTriggerStateFormat',function(val){
	var str='';
	var language=lang.getLang();
	common_params['rbac']['jobTriggerState'].forEach(function(n,i){
		if(n.value == val)str=n.name1?n.name1[language]:n.name[language];
	});
   	return str
})


template.helper('dateFormat',function(val){
	var date =  new Date(val);
    var y = 1900+date.getYear();
    var m = "0"+(date.getMonth()+1);
    var d = "0"+date.getDate();
    return y+"-"+m.substring(m.length-2,m.length)+"-"+d.substring(d.length-2,d.length);
})
template.helper('amountFormat',function(val){

    return val.toFixed(2);
})
template.helper('noData',function(val){
   	return lang.getData('noData');
})

template.helper('companyBusinessType',function(val){
	var str='';
	var language=lang.getLang();
	common_params['rbac']['businessType'].forEach(function(n,i){
		if(n.value == val)str=n.name1?n.name1[language]:n.name[language];
	});
   	return str
})
template.helper('creditRatingType',function(val){
	var str='';
	var language=lang.getLang();
	common_params['rbac']['creditRatingType'].forEach(function(n,i){
		if(n.value == val)str=n.name1?n.name1[language]:n.name[language];
	});
	return str
})
template.helper('defectType',function(val){
	var str='';
	var language=lang.getLang();
	common_params['rbac']['defectType'].forEach(function(n,i){
		if(n.value == val)str=n.name1?n.name1[language]:n.name[language];
	});
	return str
})

template.helper('accountType1',function(val){
	var str='';
	var language=lang.getLang();
	common_params['rbac']['accountType'].forEach(function(n,i){
		if(n.value == val)str=n.name1?n.name1[language]:n.name[language];
	});
	return str
})
template.helper('status2',function(val){
	var str='';
	var language=lang.getLang();
	common_params['rbac']['status2'].forEach(function(n,i){
		if(n.value == val)str=n.name1?n.name1[language]:n.name[language];
	});
	return str
})





