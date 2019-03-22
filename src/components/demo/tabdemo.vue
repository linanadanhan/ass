<template>
  <div class="con_main" v-loading.fullscreen.lock="fullscreenLoading">
		  <el-tabs v-model="activeName" @tab-click="handleClick">
		    <el-tab-pane label="资格库" name="first">
		    	<demotab1></demotab1>
		    </el-tab-pane>
		    <el-tab-pane label="统计视图" name="second">
		    	<demotab2></demotab2>
		    </el-tab-pane>
		  </el-tabs>
  </div>
</template>

<script>
	import demotab1 from '@/components/demo/demotab1';
	import demotab2 from '@/components/demo/demotab2';
	
  export default {
    data() {
      return {
      	fullscreenLoading:false,
      	activeName:'first'
      };
    },
    components:{
    	demotab1,
    	demotab2
    },
    methods: {
    	
    },
    mounted(){
    	
    },
    created(){
    	
    }
   }
</script>

<style scoped>
  .con_main {
    height: 100%;
    position: relative;
  }
  
  .con_main .childBar {
    width:20%;
    height: 100%;
    float: left;
    background: #f6f7fb;
    overflow: auto;
  }
  
  .childBar .el-menu {
    background: none;
  }
  
  .showChild {
    height: 30px;
    background: #eceff9;
    line-height: 30px;
    padding: 0 5px;
    box-sizing: border-box;
  }
  
  .showChild .el-checkbox {
    color: #666;
    font-size: 12px;
  }
  
  .el-menu-item {
    height: 40px;
    line-height: 40px;
  }
  
  .con_main .childMain {
    padding: 10px;
    box-sizing: border-box;
    float: left;
    width: 80%;
    height:100%;
    position: relative;
  }
  
  .childMain .handle {
    margin-bottom: 10px;
  }

</style>