<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
// background: -moz-linear-gradient(left, #1E90FF 0%, #00BFFF 100%);
//     background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#1E90FF), color-stop(100%,#00BFFF));
//     background: -webkit-linear-gradient(left, #1E90FF 0%,#00BFFF 100%);
//     background: -o-linear-gradient(left, #1E90FF 0%,#00BFFF 100%);
//     background: -ms-linear-gradient(left, #1E90FF 0%,#00BFFF 100%);
//     background: linear-gradient(to right, #1E90FF 0%,#00BFFF 100%);
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
    background-color: #eee;
  }
  .top-bg-title{
   
  }
  .text-left{
    text-align: left;
  }
  .blue-font{
    color: #0079f3;
  }
  .deep-blue-font{
    color: #011629;
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
  textarea{
    background:#eee!important;
    padding-left: 5px!important;
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
  .price-txt{
    color: red;
    font-size: 22px;
  }
  .xy-txt{
    color: #232333;
    font-weight: 900;
  }

  </style>
