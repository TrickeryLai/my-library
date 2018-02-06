
/*jshint esversion:6*/

import React, {Component} from 'react';
import {getOffset, getStyle} from "../../common/dealStorage";

let style={
    img:{
        width: '200px'
    },
    imgBox: {
        position: 'relative',
        display: 'inline-block'
    },
    imgChoseBlock: {
        display: 'inline-block',
        border: '1px solid #ccc',
        background: 'rgba(0,0,0,.3)',
        position: 'absolute',
        left: '0',
        top: '0',
        cursor: 'pointer'
    },
    imgWrap:{
        border: '1px solid #ccc',
        display: 'inline-block'
    },
    zoomBox: {
        backgroundAttachment: 'fixed',
        position: 'absolute',
        border: '1px solid #ccc',
        right: '-350px',
        top: '-100px'
    }
};

class ZoomChild  extends Component{
    constructor(props){
        super(props);
        this.state = {
            magnification: 3, //放大倍率
            move_magnification: 10,//移动区域比例
            picItem: null,
            picUrl: null,
            realImg: {
                width: 0,
                height: 0
            },
            moveClient: {
                clientX: 0,
                clientY: 0
            }
        };

        this.handleMouseMove = this.handleMouseMove.bind(this);
    }
    componentWillMount(){
        setTimeout(() => {
            this.props.match.params.item && this.initImg();
        }, 200);
    }
    componentDidMount(){
        this.initImg();
    }
    componentWillReceiveProps(props){
        this.initImg(props);
    }
    initImg(props = this.props){
        let picItem = JSON.parse(props.match.params.item),
            picUrl =decodeURIComponent(picItem.url),
            realImg = this.getImgInfo(picUrl);

        let regs = new RegExp('^[https?://]');
        if( !regs.test(picUrl)){
            //如果不是网络资源
            // picUrl = require(picUrl);
        }

        this.setState({
            realImg: Object.assign({}, this.state.realImg, realImg),
            picItem,
            picUrl
        });
    }
    getImgInfo(url){
        let real = {},
            img = new Image();
        img.src = url;
        real.width = img.width;
        real.height = img.height;

        return real;
    }
    handleMouseMove(e){
        let {clientX, clientY} = e,
            {realImg, move_magnification} = this.state,

            offsetWrap = getOffset(this.refs.imgBox),

            choseImg = this.getChoseImgBoxSize(realImg, move_magnification);

        clientX = clientX - offsetWrap.left;

        if(clientX - choseImg.width / 2 > 0){
            clientX = clientX - choseImg.width / 2;
        }else{
            clientX = 0;
        }

        if(clientX + choseImg.width >= parseFloat(getStyle(this.refs.imgBox, 'width'))){
            clientX = parseFloat(getStyle(this.refs.imgBox, 'width')) - choseImg.width;
        }

        clientY = clientY - offsetWrap.top;

        if(clientY - choseImg.width / 2 > 0){
            clientY = clientY - choseImg.width / 2;
        }else{
            clientY = 0;
        }
        if(clientY + choseImg.width >= parseFloat(getStyle(this.refs.imgBox, 'height'))){
            clientY = parseFloat(getStyle(this.refs.imgBox, 'height')) - choseImg.width;
        }

        clientY = clientY + document.documentElement.scrollTop;
        clientX = clientX + document.documentElement.scrollLeft;

        this.setState({
            moveClient: {
                clientX,
                clientY
            }
        });
    }
    getChoseImgBoxSize(realImg, magnification){
        return { width: realImg.width / magnification, height: realImg.height / magnification  };
    }
    bgUrlMove(){
        const {
            magnification,
            moveClient
        } = this.state;

        return {
            moveX: moveClient.clientX * magnification ,
            moveY: moveClient.clientY * magnification ,
        };
    }
    render(){
        const {
            picUrl,
            realImg,
            moveClient,
            magnification,
            move_magnification
        } = this.state;

        let choseImg = this.getChoseImgBoxSize(realImg, move_magnification);

        let move = this.bgUrlMove();

        return (
            <div style={style.imgBox} ref="imgBox">
                <div onMouseMove={this.handleMouseMove}>
                    <div style={Object.assign({},style.imgChoseBlock, {width: choseImg.width + 'px', height: choseImg.width + 'px', top: moveClient.clientY + 'px', left: moveClient.clientX + 'px'})}></div>
                    <div style={style.imgWrap}>
                        <img src={picUrl} style={Object.assign({}, style.img, {width: realImg.width / magnification})} alt=""/>
                    </div>
                </div>
                <div style={Object.assign({}, style.zoomBox, {width: choseImg.width * magnification + 'px', height: choseImg.width * magnification + 'px', right: -(choseImg.width * magnification + 50), top: -50 + 'px', background: `url(${picUrl}) top left no-repeat`, backgroundPosition: `-${move.moveX + 'px'}  -${move.moveY + 'px'} `})}>

                </div>
            </div>
        )
    }
}

export default ZoomChild;