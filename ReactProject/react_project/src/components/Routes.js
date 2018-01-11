

/*jshint esversion:6*/
import React, {Component} from 'react';

import {Route} from 'react-router-dom';

import Menu from './Menu/Menu';
import CommentApp from './Comment/CommentApp';
import Zoom from './Zoom/index';

class Routes extends Component{
    // constructor(props){
    //     super(props);
    // }
    render(){
        return (
            <div>
                <Route exact path="/" component={Menu} />
                <Route path='/commentApp' component={CommentApp}/>
                <Route path='/zoom' component={Zoom}/>
                {this.props.children}
            </div>
        )
    }
}

export default Routes;
