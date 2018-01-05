
/*jshint esversion:6*/

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { createAction } from './../../redux/actions/actions';
import {connect} from 'react-redux';

class CommentsData extends Component{
    // static propTypes = {
    //     initData: PropTypes.array,//限制为数组
    // };
    constructor(props){
        super(props);
        this.handleRemove = this.handleRemove.bind(this);
        this.state = {

        };
    }
    handleRemove(item, index){
        createAction('COMMENT_DATA_REMOVE', {item, index})(this.props.dispatch);
        // if(this.props.handleRemove) {
        //     this.props.handleRemove(item, index);
        // }
    }
    render(){
        let html = this.props.state.COMMENT_DATA.map((item, index) => {
           return (<li key={index}><span className="comment_user">{item.name}：</span>{item.content}<span onClick={this.handleRemove.bind(this, item, index)}>删除</span></li>)
        });

        //如果没有数据，则用组件内的子内容
        if(html.length <= 0){
            html = <li>{this.props.children}</li>;
        }

        return (
            <ul className="comment_list">
                {html}
            </ul>
        )
    }
}


const mapStateToProps = (state, ownProps) => {
    return {state, ownProps}
};

// const mapDispatchToProps = {
//     createAction,
// };

CommentsData = connect(mapStateToProps)( CommentsData );

export default CommentsData;