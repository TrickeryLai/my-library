
/*jshint esversion: 6*/

import React, {Component} from 'react';

import Input from './../Input/index';
import Mazebox from './Mazebox';

class Maze extends Component {
    constructor(props){
        super(props);
        this.state = {
            mazeSize: 0
        };
        this.handleBtnBegin = this.handleBtnBegin.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputEnter = this.handleInputEnter.bind(this);
    }
    handleBtnBegin(){

    }
    handleInputChange(v){
        if((v - 0) >= 20) {
            this.setState({
                mazeSize: 20
            });
        }
    }
    handleInputEnter(v){
        console.log('enter', v);
    }
    render(){
        return(
            <div>
                <h3>Maze</h3>
                <Input type="text" ref_c="mazeSize" value={this.state.mazeSize}
                       onChange={this.handleInputChange}
                       enter={this.handleInputEnter}
                />
                <button type="button" onClick={this.handleBtnBegin}>开始</button>
                <Mazebox
                    mazeSize={this.state.mazeSize}
                />
            </div>
        )
    }
}

export default Maze;