
/*jshint esversion:6*/

import React, {Component} from 'react';

class CommentBlock extends Component{
    constructor(props){
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputFocus = this.handleInputFocus.bind(this);
        this.handleInputBlur = this.handleInputBlur.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.state = {
            placeholder: this.props.placeholder,
            className: this.props.className,
            wrapStyle: this.props.style,
            style: {}
        };
    }
    handleInputChange(){
        let val =  this.refs.inputVal.value;
        if(this.props.onChange){
            this.props.onChange(val);
        }
    }
    handleKeyUp(e){
        if(this.props.onKeyUp){
            this.props.onKeyUp(e);
        }
    }
    handleInputFocus(){
        if(!this.props.isRequired){
            return;
        }
        let style = {
            'borderColor': '#ccc'
        };
        style = Object.assign({}, this.state.style, style);
        this.setState({style});
    }
    handleInputBlur(){
        let style = {};
        if(this.props.isRequired && !this.refs.inputVal.value){
            style = {
                'borderColor': 'red'
            };

            style = Object.assign({}, this.state.style, style);
            this.setState({style});
        }
    }
    componentWillMount(){

    }
    componentDidMount(){
        this.refs.inputVal.focus();
    }
    //组件移除之前
    componentWillUnmount(){

    }
    render(){
        return (
            <div className="w100">
                <textarea
                    value = {this.props.inputVal}
                    className={this.state.className + " comment_input"}
                    style={Object.assign({}, this.state.style, this.state.wrapStyle)}
                    placeholder={this.state.placeholder}
                    ref="inputVal"
                    onChange={this.handleInputChange}
                    onFocus = {this.handleInputFocus}
                    onBlur = {this.handleInputBlur}
                    onKeyUp = {this.handleKeyUp}
                />
            </div>
        )
    }
}

export default CommentBlock;