
(function(){
    'use strict';
    //maze
    function Maze (config){
        this.row = config && parseInt(config.row) || 66;
        this.col = config && parseInt(config.col) || 66;
        this.mazeData = [];
        this.begin = {
            x:0,
            y:0
        };
        this.end = {
            x:this.row - 1,
            y:this.col - 1 || Math.floor(Math.random()*this.col - 1)
        };
        this.now = {
            x:0,
            y:0
        };
    }

    Maze.prototype = {
        //创建基本数据
        createCeil: function(row, col){
          var ceilArr = [],
                rowArr = [];
          for(var i = 0; i < row ; i++){
              rowArr = [];
              for(var j = 0; j < col; j++){
                  rowArr.push({
                      id: i + '-' + j,
                      topWall: false,
                      rightWall: false,
                      downWall: false,
                      leftWall: false,
                      isVisited: false
                  });
              }
              ceilArr.push(rowArr);
          }
          return ceilArr;
        },
        //获取可以走的方向，返回arr [0,1,2,3]，上、右、下、左
        getDirection: function getDirection(x, y, ceilData, row, col){
            var dirArrAll = [],
                _this = {
                    row: row,
                    col: col
                };

            // 如果x轴大于一，可以往上，并且上面方向的墙未通,且上面未被访问
            if(x >= 1 &&  !ceilData[x][y].topWall && !ceilData[x-1][y].isVisited){
                dirArrAll.push(0);
            }
            // 如果x轴小于最大边，可以往下, 并且下面方向的墙未通

            if( x < _this.row -1 && !ceilData[x][y].downWall && !ceilData[x- (-1)][y].isVisited){
                dirArrAll.push(2);
            }

            // 如果y 轴大于一，可以往左，并且左边方向的墙未通
            if(y >=1 && !ceilData[x][y].leftWall && !ceilData[x][y-1].isVisited){
                dirArrAll.push(3);
            }

            // 如果y轴小于最大边，可以往右
            if(y <_this.col-1 && !ceilData[x][y].rightWall && !ceilData[x][y- (-1)].isVisited){
                dirArrAll.push(1);
            }

            return dirArrAll;
        },

        create: function(){
            //所有maze 格子
            var ceilData = this.createCeil(this.row, this.col);

            // 已经访问的格子集合
            var visitedCeil = [],
                 _this = this,
                hasVistedItem = null,
                notThroughRoad = [],//四周都已经访问过的格子集合
                visitedCanThrough = [],//已经访问过，同时，四周不是已经访问过的格子集合
                randomCeilN = 0 ;//循环了多少次

            //随机起点坐标
            var beginA = this.begin.x ,
                beginB = this.begin.y ,
                endA = this.end.x,
                endB =  this.end.y;

            ceilData[beginA][beginB].isFirst = true;
            ceilData[endA][endB].isLast = true;
            //将终点设置为死点
            notThroughRoad.push(ceilData[endA][endB].id);
            // 随机终点坐标
            function randomCeil(x, y){
                randomCeilN++;
                //如果全部访问过，停止
                if(visitedCeil.length === _this.row * _this.col - 1){
                    console.log(randomCeilN);
                    return;
                }
                // 上
                if(ceilData[(x-2)>=0 ? x-2 : (x-1)>=0 ? x - 1 : x][y].isVisited && ceilData[(x- (-1)) > _this.row -1 ? x : x - (-1)][(y-1)>=0?y-1: y].isVisited && ceilData[x - 1 >= 0 ? x-1 : x ][(y-1)>=0?y-1: y].isVisited && x - 1 >=0){
                    notThroughRoad.push(ceilData[x - 1][y].id);//如果四周都被访问过，则将此点加入 notThroughRoad 中；
                    if(visitedCanThrough.indexOf(ceilData[x - 1][y].id) !== -1){//将已经四周都被访问过的点，从 visitedCanThrough 中删除
                        visitedCanThrough.splice(visitedCanThrough.indexOf(ceilData[x - 1][y].id), 1);
                    }
                }
                //右
                if(ceilData[(x-1)>=0 ? x-1 : x][y - (-1) > (_this.col - 1)? y : y - (-1)].isVisited && ceilData[x][y - (-2) > (_this.col - 1)? y - (-1) > _this.col -1 ? y : y - (-1) : y - (-2)].isVisited && ceilData[(x- (-1)> _this.row -1) ? x : x - (-1)][y - (-1) > (_this.col - 1)? y : y - (-1)].isVisited && y - (-1) < _this.col - 1){
                    notThroughRoad.push(ceilData[x][y- (-1)].id);//如果四周都被访问过，则将此点加入 notThroughRoad 中；
                    if(visitedCanThrough.indexOf(ceilData[x][y - (-1)].id) !== -1){//将已经四周都被访问过的点，从 visitedCanThrough 中删除
                        visitedCanThrough.splice(visitedCanThrough.indexOf(ceilData[x][y - (-1)].id), 1);
                    }
                }

                //下
                if(ceilData[(x- (-2))>_this.row - 1 ? x - (-1) > _this.row - 1 ? x: x - (-1): x - (-2)][y].isVisited && ceilData[(x- (-1)>= _this.row) ? x : x - (-1)][y - (-1) > (_this.col - 1)? y : y - (-1)].isVisited && ceilData[(x- (-1)> _this.row -1) ? x : x - (-1)][y - 1 > 0? y-1 : y ].isVisited && x - (-1) < _this.row -1){
                    notThroughRoad.push(ceilData[x - (-1)][y].id);//如果四周都被访问过，则将此点加入 notThroughRoad 中；
                    if(visitedCanThrough.indexOf(ceilData[x - (-1)][y].id) !== -1){//将已经四周都被访问过的点，从 visitedCanThrough 中删除
                        visitedCanThrough.splice(visitedCanThrough.indexOf(ceilData[x - (-1)][y].id), 1);
                    }
                }
                //左
                if(ceilData[(x-1)>=0 ? x-1 : x][y -1 > 0? y - 1 : y].isVisited && ceilData[x][y - 2 > 0 ? y - 2 : y - 1 > 0 ? y - 1 : y].isVisited && ceilData[(x- (-1)> _this.row -1) ? x : x - (-1)][y -1 > 0? y - 1 : y].isVisited && y - 1 >= 0 ){
                    notThroughRoad.push(ceilData[x][y - 1].id);//如果四周都被访问过，则将此点加入 notThroughRoad 中；
                    if(visitedCanThrough.indexOf(ceilData[x][y - 1].id) !== -1){//将已经四周都被访问过的点，从 visitedCanThrough 中删除
                        visitedCanThrough.splice(visitedCanThrough.indexOf(ceilData[x][y - 1].id), 1);
                    }
                }
                //如果走到了终点，停止
                if( x === endA && y === endB){
                    hasVistedItem =visitedCeil[Math.floor(Math.random()*visitedCeil.length)].split('-');
                    randomCeil(hasVistedItem[0], hasVistedItem[1]);
                }
                //如果随机的格子未访问，添加为访问
                if(visitedCeil.indexOf(ceilData[x][y].id) === -1) {
                    visitedCeil.push(ceilData[x][y].id);
                    ceilData[x][y].isVisited = true;
                }

                //判断坐标位置，上下左右是否都被访问过,如果被访问过，从已经访问过，且四周未被访问点集合中，随机重新开始选择
                if(ceilData[(x-1)>=0 ? x-1 : x][y].isVisited && ceilData[(x- (-1)) > _this.row -1 ? x : x - (-1)][y].isVisited && ceilData[x][(y- (-1)) > _this.col - 1 ? y : y - (-1)].isVisited && ceilData[x][(y-1)>=0?y-1: y].isVisited && visitedCanThrough.length > 0){
                    notThroughRoad.push(ceilData[x][y].id);//如果四周都被访问过，则将此点加入 notThroughRoad 中；
                    if(visitedCanThrough.indexOf(ceilData[x][y].id) !== -1){//将已经四周都被访问过的点，从 visitedCanThrough 中删除
                        visitedCanThrough.splice(visitedCanThrough.indexOf(ceilData[x][y].id), 1);
                    }
                    if(visitedCanThrough.length <= 0 ){
                        return;
                    }
                    hasVistedItem = visitedCanThrough[Math.floor(Math.random() * (visitedCanThrough.length - 1))].split('-');//从已经访问过，且四周未被访问点集合中，随机重新开始选择
                    randomCeil(hasVistedItem[0], hasVistedItem[1]);
                    return;
                }

                if(visitedCanThrough.indexOf(ceilData[x][y].id) === -1 && x !== endA && y !== endB){
                    visitedCanThrough.push(ceilData[x][y].id);
                }
                //获取可以通的方向，随机方向
                randomDirect(_this.getDirection(x, y, ceilData, _this.row, _this.col));
                /*----------------------------------------------------------------------------------*/
                function randomDirect(dirArr){
                    if(dirArr.length === 1 && visitedCanThrough.indexOf(ceilData[x][y].id) !== -1){
                        //将已经四周都被访问过的点，从 visitedCanThrough 中删除
                        visitedCanThrough.splice(visitedCanThrough.indexOf(ceilData[x][y].id), 1);
                    }
                    var randomBreak = Math.floor(Math.random() * dirArr.length),
                        randomD = dirArr[randomBreak];
                    switch (randomD) {
                        case 0:
                            //上
                            ceilData[x][y].topWall = true;
                            ceilData[x - 1][y].downWall = true;
                            randomCeil(x - 1, y);
                            break;
                        case 1: {
                            //右
                            ceilData[x][y].rightWall = true;
                            ceilData[x][y - (-1)].leftWall = true;
                            randomCeil(x, y - (-1));
                            break;
                        }
                        case 2: {
                            //下
                            ceilData[x][y].downWall = true;
                            ceilData[x - (-1)][y].topWall = true;
                            randomCeil(x - (-1), y);
                            break;
                        }
                        case 3: {
                            //左
                            ceilData[x][y].leftWall = true;
                            ceilData[x][y - 1].rightWall = true;
                            randomCeil(x, y - 1);
                            break;
                        }
                        default : {
                            return;
                        }

                    }
                }
                // 周围4个随机一个打破屏障，上：0，右：1，下：2，左：3
            }
            randomCeil(beginA, beginB);
            this.mazeData = ceilData;
            return this;
        },
        showMaze: function(mazeData){
            var data = mazeData,
                allHtml = "",
                rowHtml = "",
                item = null,
                wrap;
            if(document.getElementById('mazeWrap')){
                wrap = document.getElementById('mazeWrap');
                wrap.innerHTML = "";
            }else{
                wrap =  document.createElement('div');
                wrap.id='mazeWrap';
            }

            for(var i = 0; i<data.length; i++){
                rowHtml = "<div class='clear'>";
                for(var j = 0; j < data[i].length; j++){
                    item = data[i][j];
                    if(i === this.now.x && j === this.now.y){
                        item.isNowPlace = true;
                    }else{
                        item.isNowPlace = false;
                    }
                    rowHtml += '<span class="ceil ceil-first-'+ item.isFirst +'  ceil-last-'+ item.isLast +' ceil-left-'+ item.leftWall+' ceil-top-'+ item.topWall +' ceil-right-'+ item.rightWall +' ceil-down-' + item.downWall+ '  ceil-isBranch-'+ item.isBranch+' ceil-nowPlace-'+item.isNowPlace+'"></span>';
                }
                allHtml +=  rowHtml + '</div>';
            }

            wrap.innerHTML = allHtml;

            document.getElementsByTagName('body')[0].appendChild(wrap);
            return this;
        },
        createMaze:function(){
            this.create();
            this.showMaze(this.mazeData);
            return this;
        },
        moveListener: function(){
            var _this = this,
                stepNum = 0;
            document.addEventListener('keydown', moveFn, false);

            function moveFn(e){
                var code = e.which || e.keyCode;
                switch(code){
                    case 38:
                        // 上
                        if(_this.mazeData[_this.now.x][_this.now.y].topWall){
                            _this.now = {x : _this.now.x - 1,y:_this.now.y};
                            stepNum++;
                        }
                        break;
                    case 39:
                        // 右
                        if(_this.mazeData[_this.now.x][_this.now.y].rightWall){
                            _this.now.y = _this.now.y - (-1);
                            stepNum++;
                        }
                        break;
                    case 40:
                        // 下
                        if(_this.mazeData[_this.now.x][_this.now.y].downWall){
                            _this.now ={x: _this.now.x - (-1),y:_this.now.y};
                            stepNum++;
                        }
                        break;
                    case 37:
                        // 左
                        if(_this.mazeData[_this.now.x][_this.now.y].leftWall){
                            _this.now.y = _this.now.y - 1;
                            stepNum++;
                        }
                        break;
                    default:
                        break;
                }
                //如果走到了终点
                if(_this.now.x === _this.end.x && _this.now.y === _this.end.y){
                    console.log('走了'+stepNum+'步');
                    document.removeEventListener('keydown',moveFn);
                    alert('走了'+stepNum+'步，到达了终点。');
                }
                _this.showMaze(_this.mazeData);
            }

            return this;
        },
        autoPath: function(){
            //自动寻路

        }
    };
    var row, col, myMaze;
    document.getElementById('mazeReset').onclick = function(){
        row = document.getElementById('mazeRow').value;
        col = document.getElementById('mazeCol').value;
        myMaze = new Maze({row: row, col: col});
        myMaze.createMaze().moveListener();
    };
})();
