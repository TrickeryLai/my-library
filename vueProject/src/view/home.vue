
<template>
  <div>
    <router-view class="nav" name="nav"></router-view>
    <div class="content">
      <router-view class="content"></router-view>
      <router-view class="sidebar" name="sidebar"></router-view>
    </div>
  </div>
</template>

<style scoped>
  .nav{
    position:fixed;
    height:60px;
    line-height:60px;
    top: 0;
    left: 0;
    width:100%;
  }
  .content{
    position:relative;
    top: 60px;
  }
  .sidebar{
    position: relative;
    float:left;
    width: 25%
  }
  .content{
    width: 75%;
    background: #f5f5f5;
  }
</style>
