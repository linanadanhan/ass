<template>
  <div class="con_main" v-loading.fullscreen.lock="fullscreenLoading">
  	<el-button @click="openAddDlg">新增</el-button>
	  <el-table :data="tableData" border style="width: 100%">
	    <el-table-column prop="C_NAME" label="姓名" width="180"></el-table-column>
	    <el-table-column prop="C_DATE" label="预约日期" width="180"></el-table-column>
	    <el-table-column prop="C_COURSE" label="所选课程" :formatter="formatCourse"></el-table-column>
	    <el-table-column prop="C_START_TIME" label="开始时间" ></el-table-column>
	    <el-table-column  label="操作" width="200">
	    	 	<template slot-scope="scope">
            <el-button type="text" size="small" @click="handleOper(scope.$index, scope.row,1)">修改</el-button>
            <el-button type="text" size="small" @click="handleOper(scope.$index, scope.row,2)">删除</el-button>
          </template>
	    </el-table-column>
	  </el-table>
    <el-dialog  title="修改"  modal="false"  :visible.sync="modifyDlgVisible" size="small" :close-on-click-modal="false" @close="false">
    		 <span class="dialog-footer">
				    <el-button @click="handleCancel">取 消</el-button>
				    <el-button @click="handleSave(1)">保存</el-button>
				    <el-button type="primary" @click="handleSave(2)">提交</el-button>
			  </span>
			  <detailDlg @closeAndFresh="closeFresh" @openNewDlg="openNewDlg" ref="detail" ></detailDlg>
    </el-dialog>
    
    <el-dialog  title="修改"  modal="false"  :visible.sync="newDlg" size="small" :close-on-click-modal="false" @close="false">
    		
    </el-dialog>
  </div>
</template>

<script>
	import detailDlg from '@/components/demo/addormodify.vue';
	import {getAll,del,getDicItemsByKey} from '../../api/demo';
	
  export default {
    data() {
      return {
      	fullscreenLoading:false,
      	tableData:[],
      	formData:{},
      	modifyDlgVisible:false,
      	newDlg:false,
      	courses:[]
      };
    },
    components:{
    	 detailDlg
    },
    methods: {
    	handleOper(index,row,oper){
    		  if(oper == 1){//编辑
    		  	  this.modifyDlgVisible = true;
		 					this.$nextTick(() => {
		 						 this.$refs.detail.loadData(row.C_ID);
		 					});
    		  }
    		  if(oper == 2){//删除
    		  	 this.fullscreenLoading = true;
    		  	 del({C_Id:row.C_ID}).then((data)=>{
    		  	 	    console.log('del:',data);
    		  	 	    if(data.success){
    		  	 	    		this.getTableData();
    		  	 	    }
    		  	 	    this.fullscreenLoading = false;
    		  	 });
    		  }
    	},
    	openAddDlg(){
    		  this.modifyDlgVisible = true;
 					this.$nextTick(() => {
 						 this.$refs.detail.loadData('');
 					});
    	},
    	openNewDlg(){
    		  this.newDlg = true;
    	},
    	handleCancel(){
    			this.modifyDlgVisible = false; 
    	},
    	handleSave(type){
					this.$nextTick(() => {
 						 this.$refs.detail.saveOrUpdate(type);
 					});
    	},
    	closeFresh(){
    		   this.modifyDlgVisible = false;
    		   this.getTableData();
    	},
    	getTableData(){
	    		var param ={};
	    	  param.columnNames = '';
	    	  getAll(param).then((data)=>{
	    	  	  this.tableData = data;
	    	  });
    	},
    	formatCourse(row, column){
//  		  let data = row.C_COURSE && row.C_COURSE != ''?row.C_COURSE.split(','):[];
    		  var result = '';
//  		  for(let v of data.values()){
//  		  	   result = result + this.courses.get(v) + ',';
//  		  }
//  		  if(result != ''){
//  		  	result = result.substr(0,result.length-1);
//  		  }
    		  return result;
    	}
    },
    mounted(){
    	 this.getTableData();
    },
    created(){
    	let param = {
    		dicKey : 'course_catalog'
    	};
    	getDicItemsByKey(param).then((data)=>{
    		  let map = new Map();
    		  for(let i=0;i<data.length;i++){
    		  	map.set(data[i].value,data[i].text);
    		  }
    		  this.courses = map;
    	});
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