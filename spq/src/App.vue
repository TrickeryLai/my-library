<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  // color: #2c3e50;
export default {
  name: 'App'
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
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
  padding-top: 47px;
  max-height: 100%;
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
.black-font{
  color: #000;
  font-size: 16px;
}
.small-font{
  font-size: 12px;
  transform: scale(0.8);
  line-height: 0;
}
input[type='text'], input[type='number'], input[type='password'], input[type='phone'], input[type='email']{
  background:#eee;
  padding: 5px 8px;
}
</style>
