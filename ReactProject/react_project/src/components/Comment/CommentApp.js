
/*jshint esversion:6*/
import './Comment.css';

import React, {Component} from 'react';

import {connect} from 'react-redux';

import CommentInput from './CommentInput';
import CommentBlock from './CommentBlock';
import CommentsData from './CommentsData';


import { createAction } from './../../redux/actions/actions';


class CommentApp extends Component {
    constructor(props){
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleContentChange = this.handleContentChange.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.submit = this.submit.bind(this);
        this.state = {
            inputVal: 'qwr',
            contentVal: 'qwrrqr',
            initData: []
        };
    }
    //输入框改变
    handleInputChange(inputVal){
        this.setState({inputVal});
    }
    //内容改变
    handleContentChange(contentVal){
        this.setState({contentVal});
    }
    handleRemove(item, index){
        let initData = [];
        initData = this.state.initData.filter((i, n) => {
            if(n !== (index - 0)){
                return i;
            }
            return false;
        });
        this.setState({initData});
    }
    handleKeyUp(e){
        const keyCode = e.keyCode ;
        //ctrl + enter 提交
        if(keyCode  === 13 && e.ctrlKey){
            e.preventDefault();
            this.submit();
        }
    }
    submit(){
        let initData = this.state.initData || [];
        if( !this.state.inputVal){
            alert('姓名不能为空');
            return;
        }
        if( !this.state.contentVal){
            return;
        }
        createAction('COMMENT_DATA_ADD', {name: this.state.inputVal, content: this.state.contentVal})(this.props.dispatch);
        // initData.unshift({name: this.state.inputVal,content: this.state.contentVal});
        // this.setState({initData, contentVal: ''});
    }
    componentDidMount(){

    }
    render(){
        return (
            <div className="comment_app">
                <div className="clear">
                    <span className="fl">姓名：</span>
                    <CommentInput
                        placeholder = "请输入姓名"
                        className = ""
                        inputVal = {this.state.inputVal}
                        onChange = {this.handleInputChange}
                        isRequired = {true}
                    />
                </div>
                <div className="clear">
                    <span className="fl">评论：</span>
                    <CommentBlock
                        placeholder = "请输入评论，ctrl + enter 完成"
                        className = "comment_content"
                        inputVal = {this.state.contentVal}
                        onChange = {this.handleContentChange}
                        onKeyUp = {this.handleKeyUp}
                        isRequired = {false}
                    />
                </div>
                <CommentsData
                    initData = {this.props.COMMENT_DATA}
                    handleRemove = {this.handleRemove}
                >
                    {/*initData是 空时候，显示下面内容*/}
                    无
                </CommentsData>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {state: state.state, ownProps}
};

// const mapDispatchToProps = {
//     createAction,
// };

CommentApp = connect(mapStateToProps)( CommentApp );

export default CommentApp;
