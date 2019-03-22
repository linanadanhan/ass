<template>
	<div class="con_main">
		<div class="childMain" style="width: 100%;">
			<div class="handle">
				<el-button type="primary" @click="addDataTable">新增</el-button>
	            <el-input style="float: right;margin-top:0;margin-bottom:10px;width:150px" size="small" placeholder="请输入关键字" icon="search"
              		v-model="search">
                  <i slot="suffix" class="el-input__icon el-icon-search" @click="handleSearch"></i>
	            </el-input>
			</div>
				
			<el-table ref="multipleTable" :data="tableData" v-loading.fullscreen.lock="loading2" @row-dblclick="dblclick" highlight-current-row @selection-change="selectChange" border style="width: 100%;" :height="tableHeight">
				<el-table-column type="index" width="55" align="center"></el-table-column>
				<el-table-column prop="C_NAME" label="数据源编码"></el-table-column>
				<el-table-column prop="C_TEXT" label="数据源名称"></el-table-column>
				<el-table-column prop="C_TYPE" :formatter="formatSourceType" label="数据库类型"></el-table-column>
				<el-table-column prop="C_URL" label="地址"></el-table-column>
				<el-table-column prop="C_USER" label="用户名"></el-table-column>
				<el-table-column prop="C_MINIDLE" label="初始连接数"></el-table-column>
				<el-table-column prop="C_MAXSIZE" label="最大连接数"></el-table-column>
				<el-table-column label="操作" width="70" align="center">
		      <template slot-scope="scope">
		      <el-dropdown trigger="click" placement="bottom-start" @command="(command) => handleCommand(command, scope.row)">
					  <div style="width: 60px;"><i class="el-icon-more"></i></div>
					  <el-dropdown-menu slot="dropdown">
						<el-dropdown-item command="0">修改</el-dropdown-item>
						<el-dropdown-item command="1">删除</el-dropdown-item>
					  </el-dropdown-menu>
					</el-dropdown>
		          </template>
		        </el-table-column>
			</el-table>
			<div class="page-box">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 50, 100, 200]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
			
			<el-dialog size="small" :title="title" :visible.sync="editDialog" :close-on-click-modal="false" width="50%" top="6vh">
				<dataSourceEdit @closeAndFresh="closeFresh" ref="sourceInfo"></dataSourceEdit>
				<div slot="footer" class="dialog-footer">
					<el-button @click="editDialog = false">取 消</el-button>
					<el-button type="primary" @click="saveSubmitForm">确 定</el-button>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import {queryDataSourceTable,delDataSource} from '../../api/api';
	import dataSourceEdit from '@/components/system/dataSourceEdit.vue';
	
	export default {
		components: {
			dataSourceEdit:dataSourceEdit
		},
		data() {
			return {
				tableHeight:'',
				total: 0,
				pageSize: 20,
				currentPage: 1,
				search:'',
				tableData: [],
				title:'新增',
				editDialog: false,
				loading2: false
			};
		},
		methods: {
			formatSourceType(row, cell, value){
				if (value == '1'){
					return "Mysql";
				}else{
					return "Oracle";
				}
			},
			handleSearch() {
        this.currentPage = 1;
        this.searchTableData();			  
			},
			closeFresh(){
			   this.editDialog = false;
    		   this.searchTableData();
			},saveSubmitForm() {//数据源保存
				this.$nextTick(() => {
 					this.$refs.sourceInfo.saveData();
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
			searchTableData() {
				var param = {
					search: this.search,
					page: this.currentPage,
					size: this.pageSize
				};
				queryDataSourceTable(param).then(data => {
					this.tableData = data.rows;
					this.total = data.total;
				});
			},dblclick(row) {
				this.editDialog = true;
				this.$nextTick(() => {
   				  this.$refs.sourceInfo.loadData(row.C_ID);
   				});
			},selectChange(rows) { //切换时，控制按钮
				this.selectRows = rows;
				if(rows.length > 0 && rows.length == 1) {
				  this.enabledBtn = false;
				}else{
				  this.enabledBtn = true;
				}
			},
			editDataTable(index ,row){
				this.title = "修改";
	    		this.editDialog = true;
				this.$nextTick(() => {
   				  this.$refs.sourceInfo.loadData(row.C_ID);
   				});
	    	},
			addDataTable(){
				this.title = "新增";
				this.editDialog = true;
				this.$nextTick(() => {
 				  this.$refs.sourceInfo.loadData('');
 				});
			},deleteDataTable(index ,row){
				this.$confirm('此操作将删除该数据源, 是否继续', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
					var params = {
			      		id : row.C_ID
			      	};
			       	delDataSource(params).then((data)=>{
			       		this.$message({
				            message: '删除成功！',
				            type: 'success'
				        });
			       		this.searchTableData();
			       	});
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除'
		          });
		        });
			},
			handleCommand(command,row){
				if (command == '0'){
					this.title = "修改";
		    		this.editDialog = true;
					this.$nextTick(() => {
	   					this.$refs.sourceInfo.loadData(row.C_ID);
	   				});					
				}else if (command == '1'){
					this.deleteDataTable(1, row);
				}
			}
		},
		mounted() {
			this.searchTableData();
		},
	    created() {
	      var childMainHeight = $('.childMain').height();
		  this.tableHeight = (childMainHeight - 90) + 'px';
	    }
	}
</script>

<style scoped>
</style>