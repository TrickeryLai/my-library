
/*jshint esversion: 6*/

import React, { Component } from 'react';
import {Provider} from 'react-redux';
import './App.css';
import store from './redux/store';
import CommentApp from './components/Comment/CommentApp';

class App extends Component {
  render() {
    return (
        <Provider store={store}>
            <CommentApp />
        </Provider>
    );
  }
}

export default App;
