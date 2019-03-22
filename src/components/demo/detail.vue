<template>
  <div class="con_main">
		  <el-table :data="tableData" border style="width: 100%">
		    <el-table-column prop="name" label="审核人" width="180"></el-table-column>
		    <el-table-column prop="result" label="审核结果" ></el-table-column>
		  </el-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
      		tableData:[]
      };
    },
    props:['dId'],
    methods: {
    	  loadData(id){
    	  	  if(id== 1){
    	  	  	 this.tableData = [{'name':'张三','result':'同意'}];
    	  	  }else{
    	  	  	 this.tableData = [{'name':'张三','result':'同意'},{'name':'李四','result':'不同意'}];
    	  	  }
    	  	 
    	  }
    },
    mounted() {
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