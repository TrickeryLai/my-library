
/*jshint esversion:6*/

import React ,{Component} from 'react';

class Mazebox extends Component{
    constructor(props){
        super(props);
        this.state = {
            mazeSize: this.props.mazeSize || 20,
            mazeData:[],
            mazeBegin: this.props.mazeBegin || {
                x:0,
                y:0
            },
            mazeEnd: {
                x:0,
                y:0
            }
        };
        this.initMaze();
    }
    initMaze(){
        //创建 开始结束点
        this.createMazePoint();
        //创建空数组
        this.createMazeData();
    }
    createMazePoint() {
        let mazeBegin = this.createRandomPoint(),
            mazeEnd = this.createRandomPoint();
        if (this.props.mazeBegin) {
            this.setState({mazeEnd});
            return;
        }
        this.setState({mazeEnd, mazeBegin});
    }

    random(num){
        return Math.floor(Math.random() * num);
    }
    createRandomPoint(num){
        //创建随机点
        let {mazeSize} = this.state;
        return {
            x: this.random( num || mazeSize),
            y: this.random( num || mazeSize)
        };
    }
    createMazeData(){
    //    初始创建
        let arr = new Array(this.state.mazeSize).fill(' '),
            mazeData = [];

        mazeData = arr.map( (item, index) => {
            let colArr = arr.map( (item, colI) => {
               return {
                   l: false,//左
                   r: false,//右
                   t: false,//上
                   b: false,//下
                   isVisited: false
               } ;
            });
            return colArr;
        });

        this.setState({mazeData});
    }
    createMazePath(nowPoint, mazeData = this.state.mazeData, hasVisitedArr = []){
        let {mazeBegin, mazeEnd, mazeSize} = this.state;
            nowPoint = nowPoint || mazeBegin;
            // hasVisitedArr = hasVisitedArr;//已经访问的点

        mazeData[nowPoint.x][nowPoint.y].isVisited = true;

        hasVisitedArr.push(nowPoint);

        if(hasVisitedArr.length === mazeData.length){
            return mazeData;
        }

        let arrowArr = this.pointBoundary(nowPoint);
        let nextArrow = arrowArr[this.random(arrowArr.length)];

        //如果没有可选方向，从hasVisitedArr 中，随机一个点
        if(nextArrow.length === 0){
            nowPoint = hasVisitedArr[this.createRandomPoint(hasVisitedArr.length)];
            this.createMazePath(nowPoint, mazeData, hasVisitedArr);
            return;
        }

        switch (nextArrow){
            case 'l':
                nowPoint.x --;
                break;
            case 'r':
                nowPoint.x ++;
                break;
            case 't':
                nowPoint.y --;
                break;
            case 'b':
                nowPoint.y ++;
                break;
            default:
                break;
        }

        this.createMazePath(nowPoint, mazeData, hasVisitedArr);
    }
    pointBoundary(point, mazeData = this.state.mazeData){
        //点的四周，返回代表方向的数组
        let {mazeSize} = this.state,
            pathArr = [];
        if(point.x > 0 && !mazeData[point.x - 1][point.y].isVisited){
            pathArr.push('l');
        }
        if(point.x < (mazeSize - 1)&& !mazeData[point.x + 1][point.y].isVisited){
            pathArr.push('r');
        }
        if(point.y > 0 && !mazeData[point.x][point.y - 1].isVisited){
            pathArr.push('t');
        }
        if(point.y < (mazeSize - 1)&& !mazeData[point.x][point.y + 1].isVisited){
            pathArr.push('b');
        }
        return pathArr;
    }
    aaa(time, type = 'dd天hh小时mm分ss秒'){
        let regs, lastTime,
            timeStrArr = [
                {
                    type: 'd',//类型， 天
                    cal: 24*3600,//取整数部分计算
                    remainder: 1,//取余数计算
                },
                {
                    type: 'h',//类型， 时
                    cal: 3600,
                    remainder: 3600*24,//取余数计算
                },
                {
                    type: 'm',
                    cal: 60,
                    remainder: 3600,//取余数计算
                },
                {
                    type: 's',
                    cal: 1,
                    remainder: 60,//取余数计算
                },
            ];

        lastTime = time / 1000;

        let setType = (typeString, time, type) =>{
            let regsStr = `[${typeString}]+`, zeroN, zeroArr,
                timeArr = [time];
            regs = new RegExp(regsStr);

            zeroN = type.match(regs) && (type.match(regs)[0].length - time.toString().length);

            if(zeroN < 0){
                zeroN = 0;
            }

            zeroArr = zeroN ? new Array(zeroN).fill(0) : [];
            // zeroArr.push(time);
            // time = zeroArr.join('');
            time = [zeroArr, ...[timeArr]].join('');
            type = type.replace(regs, time);
            return type;
        };

        let newArr = timeStrArr.map( (item) => {
            if(item.type === 'd'){
                debugger;
            }
            let calTime = lastTime % item.remainder,
                dd = Math.floor(calTime / item.cal);
            type = setType(item.type, dd, type);
            return type;
        });
        console.log(newArr);
        return;

        // 天
        let dd = Math.floor(lastTime / (3600*24));
        lastTime = lastTime % (3600*24);

        type = setType('d', dd, type);
        //时
        let hh = Math.floor(lastTime / 3600);
        lastTime = lastTime % 3600;

        type = setType('h', hh, type);
        //分
        let mm = Math.floor(lastTime / 60);
        lastTime = lastTime % 60;

        type = setType('m', mm, type);
        //秒
        type = setType('s', lastTime, type);

        return type;
    }
    render(){
        console.log(this.aaa(360000000, 'd天hh小时mm分ss秒'));
        return (
            <div>
123
            </div>
        )
    }
}

export default Mazebox;