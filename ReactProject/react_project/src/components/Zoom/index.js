
/*jshint esversion:6*/

import React, { Component } from 'react';

import dealStorage, {clientWidth, clientHeight} from './../../common/dealStorage';

class Zoom extends Component{
    constructor(props){
        super(props);
        this.state = {
            id: ''
        };
    }
    componentWillMount(){
        console.log(clientWidth, clientHeight);
        if(this.props.location.query){
            dealStorage.setItem('ZOOM_ID', this.props.location.query.id);
        }else{
            let data = dealStorage.setItem('ZOOM_ID');

            this.setState({id: data});
        }
    }
    render(){
        return (
            <div>
                zoom
            </div>
        )
    }
}

export default Zoom;