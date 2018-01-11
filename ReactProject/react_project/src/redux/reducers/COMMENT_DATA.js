
/*jshint esversion: 6*/

import defaultState from '../states';

// 一个reducer就是一个函数

function COMMENT_DATA (COMMENT_DATA = defaultState.COMMENT_DATA, action) {
    switch (action.type) {
        case 'COMMENT_DATA_ADD':
            COMMENT_DATA = [ action.data, ...COMMENT_DATA];
            // state.unshift(action.data);
            return COMMENT_DATA;
        case 'COMMENT_DATA_REMOVE':
            COMMENT_DATA = COMMENT_DATA.filter ((item, index) => {
                if(index !== action.data.index){
                    return item;
                }
            });
            return COMMENT_DATA;
        default:
            return COMMENT_DATA;
    }
}

export default COMMENT_DATA;

