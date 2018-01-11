
/*jshint esversion: 6*/

import React, { Component } from 'react';

import {BrowserRouter} from 'react-router-dom';

import {Provider} from 'react-redux';
import './App.css';
import store from './redux/store';
import Routes from './components/Routes';

import CommentApp from './components/Comment/CommentApp';

class App extends Component {
  render() {
    return (
        <Provider store={store}>
            <BrowserRouter>
               <Routes />
            </BrowserRouter>
        </Provider>
    );
  }
}

export default App;
