
/*jshint esversion: 6*/

import React, {Component} from 'react';

class CommentInput extends Component{
    constructor(props){
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputFocus = this.handleInputFocus.bind(this);
        this.handleInputBlur = this.handleInputBlur.bind(this);
        this.handleKeypress = this.handleKeypress.bind(this);

        this.state = {
            ref: this.props.ref || 'inputVal',
            placeholder: this.props.placeholder,
            className: this.props.className,
            wrapStyle: this.props.style,
            style: {}
        };
    }
    handleKeypress(e){
        if(this.props.onKeyPress){
            this.props.onKeyPress(e);
        }
    }
    handleInputChange(){
        let val =  this.refs.inputVal.value;
        if(this.props.onChange){
            this.props.onChange(val);
        }
    }
    handleInputFocus(){
        if(!this.props.isRequired)return;
        let style = {
            'borderColor': '#ccc'
        };
        style = Object.assign({}, this.state.style, style);
        this.setState({style});
    }
    handleInputBlur(){
        let style = {};
        if(this.props.isRequired && !this.refs[this.state.ref].value){
            style = {
                'borderColor': 'red'
            };

            style = Object.assign({}, this.state.style, style);
            this.setState({style});
        }
    }
    render(){
        return (
            <div className="w100">
                <input type={this.props.type || 'text'}
                       className={this.state.className + " comment_input"}
                       style={Object.assign({}, this.state.style, this.state.wrapStyle)}
                       placeholder={this.state.placeholder}
                       value = {this.props.inputVal}
                       ref= {this.state.ref}
                       onChange={this.handleInputChange}
                       onFocus = {this.handleInputFocus}
                       onBlur = {this.handleInputBlur}
                />
            </div>
        )
    }
}

export default CommentInput;