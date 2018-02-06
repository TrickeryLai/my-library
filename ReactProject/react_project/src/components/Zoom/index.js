
/*jshint esversion:6*/

import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom';

import dealStorage, {clientWidth, clientHeight} from './../../common/dealStorage';

import ZoomChild from './ZoomChild';

import img1 from './../../imgs/pic01.jpg';


class Zoom extends Component{
    constructor(props){
        super(props);
        this.state = {
            id: '',
            picUrls: [
                {
                    url: encodeURIComponent('https://default.file.dachentech.com.cn/doctororg/huaban1@2x.jpg'),
                    txt: '11'
                },
                {
                    url: encodeURIComponent(img1),
                    txt: '22'
                },
                {
                    url: encodeURIComponent('https://default.file.dachentech.com.cn/doctororg/huaban1@2x.jpg'),
                    txt: '33'
                }
            ]
        };

        this.back = this.back.bind(this);
        this.handlePicClick = this.handlePicClick.bind(this);
    }
    componentWillMount(){
        if(this.props.location.query){
            dealStorage.setItem('ZOOM_ID', this.props.location.query.id);
        }else{
            let data = dealStorage.setItem('ZOOM_ID');

            this.setState({id: data});
        }
    }
    componentDidMount(){

    }
    handlePicClick(item){
        this.props.history.replace(`/zoom/${JSON.stringify(item)}`);
    }
    back(){
        this.props.history.goBack();
    }
    render(){
        return (
            <div>
                <a href="javascript:;" onClick={this.back}>返回</a>
                <ul>
                    {
                        this.state.picUrls.map( (item, index) => {
                            return <li key={index} onClick={this.handlePicClick.bind(this, item)}>{item.txt}</li>
                        })
                    }
                </ul>
                <div style={{margin: '50px'}}>
                    <Route path='/zoom/:item' component={ZoomChild}/>
                </div>
                <Route exact path='/zoom' render = {
                    () => (<p>请先选择一个</p>)
                }/>
            </div>
        )
    }
}

export default Zoom;