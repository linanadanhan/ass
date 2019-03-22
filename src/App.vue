<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
body,p,h1,h2,h3,h4,h5,h6,li,ul,dl,dt,dd,a,span,img,input,table,tr,td,label,button,iframe{padding: 0;margin: 0;list-style: none;border:none}
html{ height:100%}
body{
  width: 100%;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  font-size: 12px;
  color: #666;
  height:100%;
  overflow: hidden;
}
a{text-decoration: none;color: #666;}
[v-cloak] {
  display: none;
}
#app {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
}
.el-select {
    display: block;
  }
  
.el-table--mini, .el-table--small{ font-size: 14px; }
  
</style>
