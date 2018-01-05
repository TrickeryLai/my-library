
/*jshint esversion:6*/

// action，生成函数

export function createAction (type, data){
    return (dispatch, getState) => {
        dispatch({type, data});
    };
}

