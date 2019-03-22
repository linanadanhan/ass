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
				
			<el-table ref="multipleTable" :data="tableData" v-loading.fullscreen.lock="loading2" @row-dblclick="dblclick" highlight-current-row border style="width: 100%;" :height="tableHeight">
				<el-table-column type="index" width="55" align="center"></el-table-column>
				<el-table-column prop="C_CODE" width="150" label="权限代码"></el-table-column>
				<el-table-column prop="C_NAME" width="200" label="权限名称"></el-table-column>
				<el-table-column prop="C_REMARK" label="权限描述"></el-table-column>
				<el-table-column label="操作" width="70" align="center">
		          <template slot-scope="scope">
		          	<el-dropdown trigger="click" placement="bottom-start" @command="(command) => handleCommand(command, scope.row)">
      					  <div style="width: 60px;"><i class="el-icon-more"></i></div>
      					  <el-dropdown-menu slot="dropdown">
      						<el-dropdown-item command="0">修改</el-dropdown-item>
      						<el-dropdown-item command="1">关联角色</el-dropdown-item>
      						<el-dropdown-item command="2">关联人员</el-dropdown-item>
      						<el-dropdown-item command="3">删除</el-dropdown-item>
      					  </el-dropdown-menu>
      					</el-dropdown>
		          </template>
		        </el-table-column>
			</el-table>
			<div class="page-box">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 50, 100, 200]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
			
			<!--权限项修改-->
			<el-dialog size="small" :title="title" :visible.sync="editDialog" :close-on-click-modal="false" width="70%" top="6vh">
				<permissionItemEdit @closeAndFresh="closeFresh" ref="sourceInfo"></permissionItemEdit>
				<div slot="footer" class="dialog-footer">
					<el-button @click="editDialog = false">取 消</el-button>
					<el-button type="primary" @click="saveSubmitForm">确 定</el-button>
				</div>
			</el-dialog>
			
			<!--权限项关联角色-->
			<el-dialog size="small" title="关联角色" :visible.sync="relRoleDialog" :close-on-click-modal="false" width="70%" top="6vh">
				<permissionItemRelRole @closeAndFresh="closeRelRoleFresh" ref="relRoleInfo"></permissionItemRelRole>
				<div slot="footer" class="dialog-footer">
					<el-button @click="relRoleDialog = false">取 消</el-button>
					<el-button type="primary" @click="saveRelRoleSubmit">确 定</el-button>
				</div>
			</el-dialog>
			
			<!--权限项关联人员-->
			<el-dialog size="small" title="关联人员" :visible.sync="relPersonDialog" :close-on-click-modal="false" width="70%" top="6vh">
				<permissionItemRelPerson @closeAndFresh="closeRelPersonFresh" ref="relPersonInfo"></permissionItemRelPerson>
				<div slot="footer" class="dialog-footer">
					<el-button @click="relPersonDialog = false">取 消</el-button>
					<el-button type="primary" @click="saveRelPersonSubmit">确 定</el-button>
				</div>
			</el-dialog>
			
		</div>
	</div>
</template>

<script>
	import {queryPerssionItem,delPerssionItem} from '../../api/api';
	import permissionItemEdit from '@/components/system/permissionItemEdit.vue';
	import permissionItemRelRole from '@/components/system/permissionItemRelRole.vue';
	import permissionItemRelPerson from '@/components/system/permissionItemRelPerson.vue'
	
	export default {
		components: {
			permissionItemEdit: permissionItemEdit,
			permissionItemRelRole: permissionItemRelRole,
			permissionItemRelPerson: permissionItemRelPerson
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
				loading2: false,
				relRoleDialog: false,
				relPersonDialog: false
			};
		},
		methods: {
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
					search:this.search,
					page: this.currentPage,
					rows: this.pageSize
				};
				queryPerssionItem(param).then(data => {
					this.tableData = data.rows;
					this.total = data.total;
				});
			},dblclick(row) {
				this.editDialog = true;
				this.$nextTick(() => {
   				  this.$refs.sourceInfo.loadData(row.C_ID);
   				});
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
				this.$confirm('删除权限项后，会将所有与权限项相关联的都删掉，确定要删除吗？', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
					var params = {
			      		C_ID : row.C_ID,
			      	};
			       	delPerssionItem(params).then((data)=>{
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
				}else if (command == '1'){ // 关联角色
					this.relRoleDialog = true;
					this.$nextTick(() => {
	   					this.$refs.relRoleInfo.loadData(row.C_NAME, row.C_ID);
	   				});	
					
				} else if (command == '2') { // 关联人员
					this.relPersonDialog = true;
					this.$nextTick(() => {
	   					this.$refs.relPersonInfo.loadData(row.C_NAME, row.C_ID);
	   				});	
					
				}else if (command == '3') {// 删除
					this.deleteDataTable(1, row);
				}
			},
			saveRelRoleSubmit() {// 关联角色保存
				this.$nextTick(() => {
 					this.$refs.relRoleInfo.saveData();
 				});
			},
			closeRelRoleFresh() {// 关联角色关闭刷新
				this.relRoleDialog = false;
				this.searchTableData();
			},
			saveRelPersonSubmit() {// 关联人员
				this.$nextTick(() => {
 					this.$refs.relPersonInfo.saveData();
 				});
			},
			closeRelPersonFresh() {// 关联人员关闭刷新
				this.relPersonDialog = false;
				this.searchTableData();
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