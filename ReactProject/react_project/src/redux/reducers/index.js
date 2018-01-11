
/*jshint esversion: 6*/
//工具函数，用于组合多个reducer ,并返回reducer 集合
import {combineReducers } from 'redux';

import COMMENT_DATA from './COMMENT_DATA';

// 导出所有reducer
export default combineReducers({
    COMMENT_DATA
});