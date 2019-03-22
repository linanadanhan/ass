<template>
  <div class="con_main">
      <div class="handle">
        <el-button type="primary" @click="addDataTableDlg=true">新增</el-button>
        <el-button type="primary" @click="loadComponet">对话框加载组件</el-button>
      </div>
      
      <el-table :data="tableData" border style="width: 100%" >
        <el-table-column type="index" width="80" align="center">
        </el-table-column>
        <el-table-column prop="C_STATE" label="状态" width="150"></el-table-column>
        <el-table-column prop="C_COM" label="com" width="150"></el-table-column>
        <el-table-column prop="C_NAME" label="姓名" width="150"></el-table-column>
        <el-table-column prop="C_AGE" label="年龄" width="150"></el-table-column>
        <el-table-column label="操作" width="180">
          <template scope="scope">
            <el-button type="text" size="small" @click="editDataTable(scope.$index, scope.row)">修改</el-button>
            <el-button type="text" size="small" @click="deleteRecord(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-box">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"  :current-page="currentPage" :page-sizes="[20, 50, 100, 200]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" >
        </el-pagination>
      </div>
      
    <el-dialog title="新增" :visible.sync="addDataTableDlg" :close-on-click-modal="false" @close="closeDialog">
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="120px">
      
        <el-form-item label="姓名" prop="C_NAME">
          <el-input v-model="addForm.C_NAME"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="C_AGE">
          <el-input v-model="addForm.C_AGE"></el-input>
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDataTableDlg = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit">确 定</el-button>
      </div>
    </el-dialog>
    
    <el-dialog title="对话框嵌入组件测试" modal="false" :visible.sync="testDlgShow" size="large" :close-on-click-modal="false" @close="false">
    		<div >
		        <router-view></router-view>
		    </div>
    </el-dialog>
  </div>
</template>

<script>
	import {dataTableSaveDemo,queryDataTableDemo,delDataTableDemo,loadDataTableDemo,dataTableGetFiledDemo} from '../../api/demo';
 
  export default {
    data() {
    	

      return {
      	testDlgShow:false,
      	total:0,
      	pageSize: 20,
        currentPage:1,
        tableData: [],
        currentLevel:1,
        addDataTableDlg: false,
        addForm: {
        
        },
        rules: {
					
				},
				formVisible:false
      };
    },
    methods: {
    	closeDialog(){
    		this.addForm ={};
    	},
    	handleUpdate(index, row, status) {

			},
    	editDataTable(index ,row){
    		  this.addDataTableDlg = true;
    		   var params = {
    		  	columnNames:'',
    		  	C_ID:row.C_ID
    		  };
    	    loadDataTableDemo(params).then((data)=>{
    	    	  this.addForm = data;
    	    });
    	},
    	addSubmit(){
    		this.$refs.addForm.validate((valid) => {
    			if(valid){
    				this.addForm.C_STATE =1;
    				this.addForm.C_COM ='测试';
    				var test = [];
    				var testDetail = {};
    				testDetail.C_ID = '';
    				testDetail.C_NAME = '明细数据测试';
    				test.push(testDetail);
    				this.addForm.C_EXPS_JSON = JSON.stringify(test);
		    		dataTableSaveDemo(this.addForm).then((data) =>{
		    			this.addForm.C_ID = data.data;
		    			this.$message({
								message: '保存成功',
								type: 'success'
							});
							this.addDataTableDlg = false;
							this.searchTableData();
		    		});
    			}
    			
    		});
    		
    	},
    	formatterStatus(row, column){
    	
    	},
    
      deleteRecord(index,row) {
      	var params = {
      		C_ID : row.C_ID
      	};
       	delDataTableDemo(params).then((data)=>{
       		this.searchTableData();
       	});
      },
			handleSizeChange(val) { //2.分页设置
				this.pageSize = val;
				this.searchTableData();
			},
			handleCurrentChange(val) { //2.分页设置
				this.currentPage = val;
				this.searchTableData();
			},
			searchTableData(){
				var param = {
					columnNames:'',
					page:this.currentPage,
					rows:this.pageSize
				};
				queryDataTableDemo(param).then(data=>{
					this.tableData = data.rows;
					this.total = data.total;
				});
			},
			loadComponet(){
				this.testDlgShow = true;
				this.$router.push({name:'dlgDemo1',params:{}});
			}
    },
    mounted() {
      this.searchTableData();
      dataTableGetFiledDemo().then((data)=>{
    		console.log('data:',data);
    		this.addForm = data;

    	});
    }
  }
</script>

<style scoped>
 
</style>