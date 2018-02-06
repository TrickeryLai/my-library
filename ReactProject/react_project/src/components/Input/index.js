
/*jshint esversion:6*/

import React, {Component} from 'react';

class Input extends Component{
    constructor(props){
        super(props);
        this.state = {
            ref: this.props.ref_c ||  'input_com',
            value: this.props.value || 0,
            type: this.props.type || 'text',
            inputV: null
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }
    componentWillReceiveProps(props){
        let state = this.state;
        state = Object.assign({}, state, props);
        this.setState(state);
    }
    handleInputChange(v){
        let value = this.refs[this.props.ref_c || this.state.ref].value;
        this.setState({value});
        this.props.onChange && this.props.onChange.call(this, value);
    }
    handleKeyUp(e){
        const keyCode = e.keyCode;
        if(keyCode === 13){
            this.props.enter && this.props.enter.call(this, this.state.value);
            return;
        }

        this.props.onKeyUp && this.props.onKeyUp.call(this, this.state.value);
    }
    render(){
        return (
            <input
                className={this.props.className}
                style={this.props.style}
                type={this.state.type}
                ref={this.state.ref}
                value={this.state.value}
                onChange={this.handleInputChange}
                onKeyUp={this.handleKeyUp}
            />
        )
    }
}

export default Input;