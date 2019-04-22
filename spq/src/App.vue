<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

// color: #2c3e50;
  export default {
    name: 'App',
    data(){
      return{
       
      }
    }
  }
</script>

  <style>
  *{
    margin: 0;
    padding: 0;
    cursor: pointer!important;
  }
  .van-swipe{
    touch-callout: all!important; 
    user-select: all!important;
    user-select: text!important;
    cursor: pointer!important;
  }
  input, textarea{
    -webkit-touch-callout: all; 
    -webkit-user-select: all;
    -webkit-user-select: text
  }
  *:not(input,textarea) { 
    -webkit-touch-callout: none; 
    -webkit-user-select: none; 
  }
  html, body{
    width: 100%;
    height: 100%;
    background: #f5f5f5;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #666;
    padding-top: 46px;
    font-size: 16px;
  }
  .top-bg{
    background: #eee;
  }
  .text-left{
    text-align: left;
  }
  .blue-font{
    color: #0079f3;
  }
  .red-font{
    color: red;
  }
  .black-font{
    color: #000;
    font-size: 16px;
  }
  .small-font{
    font-size: 12px;
    transform: scale(0.8);
    line-height: 0;
  }
  input[type='text'], input[type='number'], input[type='password'], input[type='phone'], input[type='email'], textarea{
    background:#eee;
    padding: 5px 8px;
  }
  .top-total-Model{
    background-color: #666;
    background-color: transparent;
  }
  .border-1{
    border: 1px solid #ccc;
  }
  .text-left{
    text-align: left;
  }
  .text-right{
    text-align: right;
  }
  .relative {
    position: relative;
  }
  .rant-active {
    color: #0079f3;
  }
  .w-35p{
    width: 35%;
  }
  .detail-small-input{
    display:inline-block!important;
    vertical-align:middle;
    margin-left:0;
    margin-right:0;
    padding-left:0;
    padding-right:0;
  }


  </style>
