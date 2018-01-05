
/*jshint esversion:6*/

import React, {Component} from 'react';
import {THREE}  from 'three';

class ThreeDemo extends Component{
    constructor(props){
        super(props);
        this.state = {

        };
    }
    componentWillMount(){

    }
    componentDidMount(){
        let scene = new THREE.Scene();
        console.log(scene);
    }
    render(){
        return (
            <div id="three">three</div>
        )
    }
}

export default ThreeDemo;