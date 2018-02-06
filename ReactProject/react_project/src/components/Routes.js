

/*jshint esversion:6*/
import React, {Component} from 'react';

import {Route, Switch} from 'react-router-dom';

import Menu from './Menu/Menu';
import CommentApp from './Comment/CommentApp';
import Zoom from './Zoom/index';
import Calculate from './Calculate/index';
import Maze from './Maze/index';

class Routes extends Component{
    // constructor(props){
    //     super(props);
    // }
    render(){
        return (
            <div>
                <Switch>
                    <Route exact path="/" component={Menu} />
                    <Route path='/commentApp' component={CommentApp}/>
                    <Route path= '/zoom' component={Zoom}/>
                    <Route path='/calculate' component = {Calculate}/>
                    <Route path='/maze' component = {Maze}/>
                </Switch>
                {this.props.children}
            </div>
        )
    }
}

export default Routes;
