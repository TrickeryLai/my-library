/*
 treeMenu 
*/



//树的构造函数
function treeMenu(a){
    this.tree=a||[];
    this.groups={};
};
treeMenu.prototype={
    init:function(obj){

        // 左侧菜单
        if(obj.pIdKey == 'pId' && obj.treeType == 'menu'){
            this.group(obj.pIdKey);
            return this.getDomMenu(this.groups[obj.pIdInit]);
        }
        
        //菜单树选择
        if(obj.pIdKey == 'pId' && obj.treeType == 'menuTree'){
            this.group(obj.pIdKey);
            return this.getDomMenuTree(this.groups[obj.pIdInit]);
        }

        //机构树选择
        if(obj.pIdKey == 'pId' && obj.treeType == 'orgTree'){
            this.group(obj.pIdKey);
            return this.getDomOrgTree(this.groups[obj.pIdInit]);
        }
        
    },
    group:function(pIdKey){
        for(var i=0;i<this.tree.length;i++){
            if(this.groups[this.tree[i][pIdKey]]){
                this.groups[this.tree[i][pIdKey]].push(this.tree[i]);
            }else{
                this.groups[this.tree[i][pIdKey]]=[];
                this.groups[this.tree[i][pIdKey]].push(this.tree[i]);
            }
        }
    },


    //生成左侧菜单
    getDomMenu:function(a){
        if(!a){return ''}
        var html='\n<ul class="list-unstyled nav-list">\n';
        for(var i=0;i<a.length;i++){
            var str=this.getDomMenu(this.groups[a[i].id]);
            if(a[i].type != 'F'){
                html+='<li><a href="javascript:void(0)" _id='+a[i].id+' name='+a[i]['menuName_'+lang.getLang()]
                +' url='+a[i].url +' type='+a[i].type 
                +' >'
                +(a[i].type == 'C' ? '' : (a[i].icon&&a[i].icon!='#' ? '<i class="'+(a[i].icon?a[i].icon:'fa fa-reorder')+' icon"></i>' : '')  +'<span class="text">')
                +(a[i]['menuName_'+lang.getLang()] !== 'null' ? a[i]['menuName_'+lang.getLang()] : '-')
                +'</span>'
                +(a[i].type == 'C' ? '' : '<i class="arrow fa fa-angle-right right"></i>')
                +'</a>';
                html+=str;
                html+='</li>\n';
            }else{
                html+='<div class="hideBtn">'+JSON.stringify(a[i])+'</div>';
            }
            
        };
        html+='</ul>\n';
        return html;
    },

    //生成机构树
    getDomOrgTree:function(a){
        if(!a){return ''}
        var html='\n<ul>\n';
        for(var i=0;i<a.length;i++){
            html+='<li><a class="treeA" href="javascript:;" _id='+a[i].id+'>'+a[i].name+'</a>';
            html+=this.getDomOrgTree(this.groups[a[i].id]);
            html+='</li>\n';
        };
        html+='</ul>\n';
        return html;
    },

    //生成菜单树
    getDomMenuTree:function(a){
        if(!a){return ''}
        var html='\n<ul>\n';
        for(var i=0;i<a.length;i++){
            html+='<li><a class="treeA" href="javascript:;" _id='+a[i].id+'>'
            +'<s class="treeCheck"></s>'
            +'<em>'+(a[i]['menuName_'+lang.getLang()] !== 'null' ? a[i]['menuName_'+lang.getLang()] : '-')+'</em>'
            // +'<i class="urlI">'+a[i].url+'</i></a>';
            +'</a>',
            html+=this.getDomMenuTree(this.groups[a[i].id]);
            html+='</li>\n';
        };
        html+='</ul>\n';
        return html;
    },
};



/**
 *树的展开收起事件
 */
(function($){
    $.fn.openActive = function(activeSel) {
        activeSel = activeSel || ".active";

        var c = this.attr("class");

        this.find(activeSel).each(function(){
            var el = $(this).parent();
            while (el.attr("class") !== c) {
                if(el.prop("tagName") === 'UL') {
                    el.show();
                } else if (el.prop("tagName") === 'LI') {
                    el.removeClass('tree-closed');
                    el.addClass("tree-opened");
                }

                el = el.parent();
            }
        });

        return this;
    }

    $.fn.treemenu = function(options) {
        options = options || {};
        options.delay = options.delay || 0;
        options.openActive = options.openActive || false;
        options.activeSelector = options.activeSelector || "";

        this.addClass("treemenu");
        this.find("> li").each(function() {
            e = $(this);
            var subtree = e.find('> ul');
            var button = e.find('span').eq(0).addClass('toggler');

            if( button.length == 0) {
                var button = $('<span>');
                button.addClass('toggler');
                e.prepend(button);
            } else {
                button.addClass('toggler');
            }

            if(subtree.length > 0) {
                subtree.hide();

                e.addClass('tree-closed');

                e.find(button).click(function() {
                    var li = $(this).parent('li');
                    li.find('> ul').slideToggle(options.delay);
                    li.toggleClass('tree-opened');
                    li.toggleClass('tree-closed');
                    li.toggleClass(options.activeSelector);
                });

                $(this).find('> ul').treemenu(options);
            } else {
                $(this).addClass('tree-empty');
            }
        });

        if (options.openActive) {
            this.openActive(options.activeSelector);
        }

        return this;
    }
})(jQuery);



/**
 *表格树
 * bootstrapTreeTable
 */

(function($) {
    $.fn.bootstrapTreeTable = function(options, param) {
        var allData = null;//用于存放格式化后的数据
        // 如果是调用方法
        if (typeof options == 'string') {
            return $.fn.bootstrapTreeTable.methods[options](this, param);
        }
        // 如果是初始化组件
        options = $.extend({}, $.fn.bootstrapTreeTable.defaults, options || {});
        // 是否有radio或checkbox
        var hasSelectItem = false;
        var target = $(this);
        // 在外层包装一下div，样式用的bootstrap-table的
        var _main_div = $("<div class='bootstrap-tree-table fixed-table-container'></div>");
        target.before(_main_div);
        _main_div.append(target);
        target.addClass("table table-hover treetable-table");
        if (options.striped) {
            target.addClass('table-striped');
        }
        // 工具条在外层包装一下div，样式用的bootstrap-table的
        if(options.toolbar){
            var _tool_div = $("<div class='fixed-table-toolbar'></div>");
            var _tool_left_div = $("<div class='bs-bars pull-left'></div>");
            _tool_left_div.append($(options.toolbar));
            _tool_div.append(_tool_left_div);
            _main_div.before(_tool_div);
        }
        // 格式化数据，优化性能
        target.formatData=function(data){
            var _root = options.rootCodeValue?options.rootCodeValue:null
            $.each(data, function(index, item) {
                // 添加一个默认属性，用来判断当前节点有没有被显示
                item.isShow = false;
                // 这里兼容几种常见Root节点写法
                // 默认的几种判断
                var _defaultRootFlag = item[options.parentCode] == '0'
                    || item[options.parentCode] == 0
                    || item[options.parentCode] == null
                    || item[options.parentCode] == '';
                if (!item[options.parentCode] || (_root?(item[options.parentCode] == options.rootCodeValue):_defaultRootFlag)){
                    if(!allData["_root_"]){allData["_root_"]=[];}
                    allData["_root_"].push(item);
                }else{
                    if(!allData["_n_"+item[options.parentCode]]){allData["_n_"+item[options.parentCode]]=[];}
                    allData["_n_"+item[options.parentCode]].push(item);
                }
            });
            data=null;//回收
        }
        // 得到根节点
        target.getRootNodes = function() {
            return allData["_root_"];
        };
        // 递归获取子节点并且设置子节点
        target.handleNode = function(parentNode, lv, row_id, p_id, tbody) {
            var _ls = allData["_n_"+parentNode[options.code]];
            var tr = target.renderRow(parentNode,_ls?true:false,lv,row_id,p_id);
            tbody.append(tr);
            if(_ls){
                $.each(_ls, function(i, item) {
                    var _row_id = row_id+"_"+i
                    target.handleNode(item, (lv + 1), _row_id,row_id, tbody)
                });
            }
        }; 
        // 绘制行
        target.renderRow = function(item,isP,lv,row_id,p_id){
            // 标记已显示
            item.isShow = true;
            var tr = $('<tr id="'+(row_id?row_id:'')+'" pid="'+(p_id?p_id:'')+'"></tr>');
            var _icon = options.expanderCollapsedClass;
            if(options.expandAll){
                tr.show()
                _icon = options.expanderExpandedClass;
            }else if(options.expandFirst&&lv<=1){
                tr.show()
                _icon=(lv==0)?options.expanderExpandedClass:options.expanderCollapsedClass;
            }else{
                tr.css("display","none");
                _icon = options.expanderCollapsedClass;
            }
            $.each(options.columns, function(index, column) {
                // 判断有没有选择列
                if(column.field=='selectItem'){
                    hasSelectItem = true;
                    var td = $('<td style="text-align:center;width:36px"></td>');
                    if(column.radio){
                        var _ipt = $('<input name="select_item" type="radio" value="'+item[options.id]+'"></input>');
                        td.append(_ipt);
                    } 
                    if(column.checkbox){
                        var _ipt = $('<input name="select_item" type="checkbox" value="'+item[options.id]+'"></input>');
                        td.append(_ipt);
                    } 
                    tr.append(td);
                }else{
                    var td = $('<td title="'+item[column.field]+'" name="'+column.field+'" style="text-align:'+column.align+';'+((column.width)?('width:'+column.width):'')+'"></td>');
                    // 增加formatter渲染
                    if (column.formatter) {
                        td = $('<td style="text-align:'+(column.align?column.align:'')+';'+((column.width)?('width:'+column.width):'')+'"></td>');
                        td.html(column.formatter.call(this, item[column.field], item, index));
                    } else {
                        td.text(item[column.field]);
                    }
                    if(options.expandColumn==index){
                        if(!isP){
                            td.prepend('<span class="treetable-expander"></span>')
                        }else{
                            td.prepend('<span class="treetable-expander '+_icon+'"></span>')
                        }
                        for (var int = 0; int < (lv-1); int++) {
                            td.prepend('<span class="treetable-indent"></span>')
                        }
                    }
                    tr.append(td);
                }
            });
            return tr;
        }
        // 加载数据
        target.load = function(parms){
            // 加载数据前先清空
            allData = {};
            // 加载数据前先清空
            target.html("");
            // 构造表头
            var thr = $('<tr></tr>');
            $.each(options.columns, function(i, item) {
                var th = null;
                // 判断有没有选择列
                if(i==0 && item.field=='selectItem'){
                    hasSelectItem = true;
                    th = $('<th style="width:36px"></th>');
                }else{
                    th = $('<th style="'+((item.width)?('width:'+item.width):'')+'"></th>');
                }
                th.text(item.title);
                thr.append(th);
            });
            var thead = $('<thead class="treetable-thead"></thead>');
            thead.append(thr);
            target.append(thead);
            // 构造表体
            var tbody = $('<tbody class="treetable-tbody"></tbody>');
            target.append(tbody);
            // 添加加载loading
            var _loading = '<tr><td colspan="'+options.columns.length+'"><div style="display: block;text-align: center;">'+lang.getData('loading')+'</div></td></tr>'
            tbody.html(_loading);
            // 默认高度
            if(options.height){
                tbody.css("height",options.height);
            }

            $.zAjax({
                isString:false,
                type : options.type,
                url : options.url,
                data : parms?parms:options.ajaxParams,
                dataType : "JSON",
                success: function(data) {
                    // 加载完数据先清空
                    tbody.html("");
                    if(!data||data.length<=0){
                        var _empty = '<tr><td colspan="'+options.columns.length+'"><div style="display: block;text-align: center;">'+lang.getData('noData')+'</div></td></tr>'
                        tbody.html(_empty);
                        $.btnPermissions();
                        return;
                    }
                    // 格式化数据
                    target.formatData(data);
                    // 开始绘制
                    var rootNode = target.getRootNodes();
                    if(rootNode){
                        $.each(rootNode, function(i, item) {
                            var _row_id = "row_id_"+i
                            target.handleNode(item, 1, _row_id,"row_root", tbody);
                        });
                    }
                    // 下边的操作主要是为了查询时让一些没有根节点的节点显示
                    $.each(data, function(i, item) {
                        if(!item.isShow){
                            var tr = target.renderRow(item,false,1);
                            tbody.append(tr);
                        }
                    });
                    target.append(tbody);
                    //动态设置表头宽度
                    thead.css("width", tbody.children(":first").css("width"));
                    // 行点击选中事件
                    target.find("tbody").find("tr").click(function(){
                        if(hasSelectItem){
                            var _ipt = $(this).find("input[name='select_item']");
                            if(_ipt.attr("type")=="radio"){
                                _ipt.prop('checked',true);
                                target.find("tbody").find("tr").removeClass("treetable-selected");
                                $(this).addClass("treetable-selected");
                            }else{
                                if(_ipt.prop('checked')){
                                    _ipt.prop('checked',false);
                                    $(this).removeClass("treetable-selected");
                                }else{
                                    _ipt.prop('checked',true);
                                    $(this).addClass("treetable-selected");
                                }
                            }
                        }
                    });
                    // 小图标点击事件--展开缩起
                    target.find("tbody").find("tr").find(".treetable-expander").click(function(){
                        var _flag = $(this).hasClass(options.expanderExpandedClass);
                        var tr = $(this).parent().parent();
                        var row_id = tr.attr("id");
                        if(_flag){
                            var _ls = target.find("tbody").find("tr[id^='"+row_id+"_']");//下所有
                            if(_ls&&_ls.length>0){
                                $.each(_ls, function(index, item) {
                                    $(item).css("display","none");
                                    var _icon = $(item).children().eq(options.expandColumn).find(".treetable-expander");
                                    if(_icon.hasClass(options.expanderExpandedClass)){
                                        _icon.removeClass(options.expanderExpandedClass)
                                        _icon.addClass(options.expanderCollapsedClass)
                                    }
                                });
                            }
                            $(this).removeClass(options.expanderExpandedClass)
                            $(this).addClass(options.expanderCollapsedClass)
                        }else{
                            var _ls = target.find("tbody").find("tr[pid='"+row_id+"']");//下一级
                            if(_ls&&_ls.length>0){
                                $.each(_ls, function(index, item) {
                                    $(item).show()
                                });
                            }
                            $(this).removeClass(options.expanderCollapsedClass)
                            $(this).addClass(options.expanderExpandedClass)
                        }

                        
                    });

                    $.btnPermissions();

                }
            });

           
        }
        if (options.url) {
            target.load();
        } else {
            // 也可以通过defaults里面的data属性通过传递一个数据集合进来对组件进行初始化....有兴趣可以自己实现，思路和上述类似
        }
        
        return target;
    };

    $.fn.bootstrapTreeTable.defaults = {
        id : 'id',// 选取记录返回的值
        code : 'id',// 用于设置父子关系
        parentCode : 'parentId',// 用于设置父子关系
        rootCodeValue: null,//设置根节点code值----可指定根节点，默认为null,"",0,"0"
        data : [], // 构造table的数据集合
        type : "GET", // 请求数据的ajax类型
        url : null, // 请求数据的ajax的url
        ajaxParams : {}, // 请求数据的ajax的data属性
        expandColumn : 0,// 在哪一列上面显示展开按钮
        expandAll : false, // 是否全部展开
        expandFirst : true, // 是否默认第一级展开--expandAll为false时生效
        striped : false, // 是否各行渐变色
        columns : [],
        toolbar: '#toolbar',//顶部工具条
        height: 0,
        expanderExpandedClass : 'glyphicon glyphicon-chevron-down',// 展开的按钮的图标
        expanderCollapsedClass : 'glyphicon glyphicon-chevron-right'// 缩起的按钮的图标
    };

    $.extend({
        table: {
            _option: {},
            _params: {},
            init: function(options) {
                $.table._option = options;
                $.table._params = $.common.isEmpty(options.queryParams) ? $.table.queryParams : options.queryParams;
                _sortOrder = $.common.isEmpty(options.sortOrder) ? "asc" : options.sortOrder;
                _sortName = $.common.isEmpty(options.sortName) ? "" : options.sortName;
                $("#bootstrap-table").bootstrapTable({
                    url: options.url,
                    contentType: "application/x-www-form-urlencoded",
                    method: "post",
                    cache: false,
                    sortable: true,
                    sortStable: true,
                    sortName: _sortName,
                    sortOrder: _sortOrder,
                    pagination: $.common.visible(options.pagination),
                    pageNumber: 1,
                    pageSize: 10,
                    pageList: [10, 25, 50],
                    iconSize: "outline",
                    toolbar: "#toolbar",
                    sidePagination: "server",
                    search: $.common.visible(options.search),
                    showRefresh: $.common.visible(options.showRefresh),
                    showColumns: $.common.visible(options.showColumns),
                    showToggle: $.common.visible(options.showToggle),
                    showExport: $.common.visible(options.showExport),
                    queryParams: $.table._params,
                    columns: options.columns,
                    responseHandler: $.table.responseHandler
                })
            },
            queryParams: function(params) {
                return {
                    pageSize: params.limit,
                    pageNum: params.offset / params.limit + 1,
                    searchValue: params.search,
                    orderByColumn: params.sort,
                    isAsc: params.order
                }
            },
            responseHandler: function(res) {
                if (res.code == 0) {
                    return {
                        rows: res.rows,
                        total: res.total
                    }
                } else {
                    $.modal.alertWarning(res.msg);
                    return {
                        rows: [],
                        total: 0
                    }
                }
            },
            
        },
        treeTable: {
            _option: {},
            _treeTable: {},
            init: function(options) {
                $.table._option = options;
                var treeTable = $("#bootstrap-table").bootstrapTreeTable({
                    code: options.id,
                    parentCode: options.parentId,
                    type: "get",
                    url: options.url,
                    ajaxParams: {},
                    expandColumn: "0",
                    striped: false,
                    bordered: true,
                    expandAll: $.common.visible(options.expandAll),
                    columns: options.columns
                });
                debugger;
                $.treeTable._treeTable = treeTable
            },

        },
        common: {
            isEmpty: function(value) {
                if (value == null || this.trim(value) == "") {
                    return true
                }
                return false
            },
            visible: function(value) {
                if ($.common.isEmpty(value) || value == true) {
                    return true
                }
                return false
            },
            trim: function(value) {
                if (value == null) {
                    return ""
                }
                return value.toString().replace(/(^\s*)|(\s*$)|\r|\n/g, "")
            },
            random: function(min, max) {
                return Math.floor((Math.random() * max) + min)
            }
        }
    })
}
)(jQuery);
