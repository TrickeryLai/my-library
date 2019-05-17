/**
 * Created by zt on 2018/8/15.
 */
(function(){
    window.Router = function(){
        let self = this;
        self.hashList = {};
        self.index = null;
        self.key = '/';
        self.error = 404;
        window.onhashchange = function(){
            self.reload();
        }
        $("a").click(function(e){
            if(e.target.classList.contains("active")){
                self.reload()
            }
        });
    };

    Router.prototype.add = function(params){
        let self = this;
        self.hashList[params.hash] = function(){
            if(!sessionStorage.getItem('cancelAnimation')){
                if($('#animate').length == 0){
                    $('head').prepend('<link id="animate" media="all" href="../assets/css/animate.css" type="text/css" rel="stylesheet">');
                }
            }else{
                $('#animate').remove();
            }

            if(sessionStorage.getItem('bootstrap')){
                if($('#bootstrap').length == 0){
                    $('head').append('<link id="bootstrap" media="all" href="../assets/lib/bootstrap/bootstrap.min.css" type="text/css" rel="stylesheet">');
                }
            }else{
                $('#bootstrap').remove();
            }

            var arr=['zoomIn','zoomInDown','fadeInDown','fadeInUpBig','zoomInLeft'];
            var a=arr[ Math.floor(Math.random()*arr.length)];

            if(params.path.split('/')[0] == 'rbac'){
                $('#main').html('').load(params.path,function(){
                    $("#main").removeClass().addClass(a + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                          $(this).removeClass();
                          if($('aside').width() == 60){
                            $(this).addClass('add');
                          }
                    });
                });
            }else{
                if(project.web_port == location.port){
                    var str='/vnbopenvive/banking-monitor-web/src/main/resources/static/';
                    $('#main').html('').load(str+params.path,function(){
                        $("#main").removeClass().addClass(a + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                              $(this).removeClass();
                              if($('aside').width() == 60){
                                $(this).addClass('add');
                              }
                        });
                    });


                }else{
                     $.ajax({
                        type : "get",
                        url : params.path,
                        timeout:5000,
                        dataType : "html",
                        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                        // async: false,
                        // cache: false,
                        success:function(returnData){

                        },

                    });
                }



            }


            var crumbs=params['crumbs'][lang.getLang()];
            var crumbsList=crumbs.split('/');
            var str='';
            crumbsList.forEach(function(n,i){
                if(i == 0){
                    str+="<li onclick='$.homePage()' style='cursor: pointer'>"+n+'</li>';
                }else{
                    str+='<li>'+n+'</li>';
                }

            });
            $('.breadcrumb').html(str);
            $('.breadcrumb li:last').addClass('active');
            if(sessionStorage.getItem('changeHash')){
                sessionStorage.removeItem('changeHash')
                return;
            }

            upDataHash(params)

        }


    };

    Router.prototype.remove = function(addr){
        let self = this;
        delete self.hashList[addr];
    };

    Router.prototype.setIndex = function(index){
        let self = this;
        self.index = index;
    };

    Router.prototype.go = function(addr){
        let self = this;
        window.location.hash = '#'+ self.key + addr;
    };

    Router.prototype.reload = function(){
        let common_data=sessionStorage.getItem('data');
        common_data = JSON.parse(common_data);

        let authStatus = sessionStorage.getItem("authStatus_"+common_data.user.userId) || common_data.user.authStatus;
        let self = this,
            hash = window.location.hash.replace('#'+ self.key,'').split('?')[0],
            addr = hash.split('?')[0],
            cb = getCb(addr,self.hashList);
            $('.inner-drop').hide();
        if(authStatus != '9'&& (hash =='myBuys' || hash =='mySales' || hash=='cpPublish')){
            window.location.href=window.location.href.replace('#'+ self.key + hash,'')+'#/comAuth';
            // self.index='comAuth';
            // hash = 'comAuth';
            // addr = hash.split('?')[0],
            // cb = getCb(addr,self.hashList);
        }
            //此处为了调试路由bug
        //     console.log(hash);
        // console.log(cb);
        // console.log(self);
        if(cb){
            let arr = hash.split('/');
            arr.shift();
            cb.apply(self,arr);
        }else{
            if(hash == ''){
                self.index && self.go(self.index)
            }else{
                $('#main').load('tpl/404.html')
            }

        }
    };

    Router.prototype.start = function(){
        let self = this;
        self.reload()
    };

    Router.prototype.getParams = function () {
        let params = window.location.hash.split('?')[1];
        if(params === undefined){return ''}
        let arr = params.split('&'),paramsJson = {};
        for(let i=0; i<arr.length; i++){
            let temp = arr[i].split('=');
            paramsJson[temp[0]] = temp[1]
        }
        return  paramsJson
    };

    function getCb(addr,hashList){
        for(let key in hashList){
            if(key == addr) return hashList[key]
        }
        return false
    };

    function upDataHash(params){
        $('#menuList>ul>li').removeClass('open').find('>ul').hide();
        var _slef=$('[url="/'+params.hash+'"]');
        var _parent=_slef.closest('.nav-list');
        $('[url]').removeClass('active');
        _slef.addClass('active');
        _slef.closest('.nav-list').closest('li').addClass('open');
        _slef.closest('.nav-list').show();

        _parent.closest('li').closest('.nav-list').show();
        _parent.closest('li').closest('.nav-list').closest('li').addClass('open');

        if(params.hash == 'index'){
            $('#menuList [_id="1"]').closest('li').addClass('open');
            $('#menuList [_id="1"]').next('ul').show();


            return;
        }
    }
})();

let router = new Router();

for(var key in common_router){
    var obj=common_router[key];
    obj.forEach(function(n,i){
        router.add(n);
    });
}


router.setIndex('index');
router.start()
