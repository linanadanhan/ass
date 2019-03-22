<template>
	<div class="con_main">
		<div class="childMain" style="width: 100%;">
			<div class="handle">
				<el-button type="primary" @click="updateWidget">更新Widget</el-button>
				<!--<el-button type="primary" @click="addDataTable">新增</el-button>-->
		        <!--<el-button size="small" type="primary">
					<el-upload :on-success="uploadSuccess" :action="fileUploadUrl" :show-file-list="false" :before-upload="beforeUpload">导入</el-upload>
				</el-button>-->
				<!--<el-dropdown  placement="bottom-start" @command="widgetAuth">
				  <el-button :disabled="enabledBtn" type="primary">
				   	 widget授权<i class="el-icon-arrow-down el-icon--right"></i>
				  </el-button>
				  <el-dropdown-menu slot="dropdown">
				    <el-dropdown-item command="0">用户授权</el-dropdown-item>
				    <el-dropdown-item command="1">角色授权</el-dropdown-item>
				  </el-dropdown-menu>
				</el-dropdown>-->

        <el-input style="float: right;margin-top:0;width:150px;margin-bottom: 10px;" size="small" placeholder="请输入关键字" icon="search"
      		v-model="search">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="handleSearch"></i>
        </el-input>
			</div>
			
			<el-table ref="multipleTable" :data="tableData" v-loading.fullscreen.lock="loading2" @row-click="rowClick" highlight-current-row @selection-change="selectChange" border style="width: 100%" :height="tableHeight">
				<el-table-column type="selection" width="55" align="center"></el-table-column>
				<el-table-column prop="C_CODE" label="widget代码"></el-table-column>
				<el-table-column prop="C_NAME" label="widget名称"></el-table-column>
				<!--<el-table-column prop="C_TITLE" label="widget标题"></el-table-column>-->
				<!--<el-table-column prop="C_PROJECT_CODE" label="项目CODE"></el-table-column>-->
				<!--<el-table-column prop="C_IS_OPEN" :formatter="formatIsOpen" label="是否开放"></el-table-column>-->
				<!--<el-table-column prop="C_IS_IMP" :formatter="formatIsImp" label="是否导入"></el-table-column>-->
				<el-table-column prop="C_IS_SYSTEM" :formatter="formatIsSystem" label="是否系统内置"></el-table-column>
				<el-table-column prop="C_IS_NESTED" :formatter="formatIsNested" label="嵌套widget"></el-table-column>
				<!--<el-table-column label="操作" width="180">
		          <template slot-scope="scope">
		            <el-button type="text" size="small" @click="editDataTable(scope.$index, scope.row)">修改</el-button>
		            <el-button type="text" size="small" @click="deleteDataTable(scope.$index, scope.row)">删除</el-button>
		            <el-button v-if="scope.row.C_IS_IMP" type="text" size="small" @click="exportData(scope.$index, scope.row)">导出</el-button>
		          </template>
		        </el-table-column>-->
			</el-table>
			
			<div class="page-box">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 50, 100, 200]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
			
			<el-dialog size="small" :title="title" :visible.sync="editDialog" :close-on-click-modal="false" width="50%" top="8vh">
				<widgetForm @closeAndFresh="closeFresh" ref="widgetInfo"></widgetForm>
				<div slot="footer" class="dialog-footer">
					<el-button @click="editDialog = false">取 消</el-button>
					<el-button type="primary" @click="saveSubmitForm">确 定</el-button>
				</div>
			</el-dialog>
			
			<el-dialog size="small" title="widget用户授权" :visible.sync="userAuthDialog" :close-on-click-modal="false" width="80%" top="7vh">
				<portalUserAuthForm @closeAndFresh="closeUserAuthAndFresh" ref="userAuthInfo"></portalUserAuthForm>
			
				<div class="dialog-footer" style="text-align: right;margin-top: 10px;">
					<el-button @click="userAuthDialog = false">取 消</el-button>
					<el-button type="primary" @click="saveUserAuth">确 定</el-button>
				</div>
			</el-dialog>
			
			<el-dialog size="small" title="widget角色授权" :visible.sync="rolesAuthDialog" :close-on-click-modal="false" width="80%" top="7vh">
				<portalRolesAuthForm @closeAndFresh="closeRolesAuthAndFresh" ref="rolesAuthInfo"></portalRolesAuthForm>
				<div class="dialog-footer" style="text-align: right;margin-top: 10px;">
					<el-button @click="rolesAuthDialog = false">取 消</el-button>
					<el-button type="primary" @click="saveRolesAuth">确 定</el-button>
				</div>
			</el-dialog>
			
		</div>
	</div>
</template>

<script>
	import {queryWidgetDataTable,delWidget,importWidget,exportWidget,udpWidgetCode  } from '../../api/apiPortal';
	import widgetForm from '@/components/system/widgetEdit.vue';
	import portalUserAuthForm from '@/components/system/portalUserAuthForm.vue'
	import portalRolesAuthForm from '@/components/system/portalRolesAuthForm.vue'
	
	export default {
		components: {
			widgetForm:widgetForm,
			portalUserAuthForm:portalUserAuthForm,
			portalRolesAuthForm:portalRolesAuthForm
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
				fileUploadUrl: '',
				loading2: false,
				enabledBtn:true,
				userAuthDialog:false,
				rolesAuthDialog:false,
				selectRows: [],
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
			},saveSubmitForm() { 
				this.$nextTick(() => {
 						 this.$refs.widgetInfo.saveData();
 				});
			},
			formatIsOpen(row, cell, value) {//格式化是否开放
				if (value == 1){
					return "是";
				}else{
					return "否";
				}
			},formatIsImp(row, cell, value){//格式化是否导入
				if (value == 1){
					return "是";
				}else{
					return "否";
				}
			},formatIsSystem(row, cell, value){
				if (value == true){
					return "是";
				}else{
					return "否";
				}
			},formatIsNested(row, cell, value){
				if (value == true){
					return "是";
				}else{
					return "否";
				}
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
					rows: this.pageSize
				};
				queryWidgetDataTable(param).then(data => {
					this.tableData = data.rows;
					this.total = data.total;
				});
			},dblclick(row) {
				this.editDialog = true;
				this.$nextTick(() => {
   						 this.$refs.widgetInfo.loadData(row.C_ID,'');
   				});
			},rowClick(row){
				this.$refs.multipleTable.toggleRowSelection(row);
				
			},editDataTable(index ,row){
				this.title = "修改";
	    		this.editDialog = true;
				this.$nextTick(() => {
   						 this.$refs.widgetInfo.loadData(row.C_ID,'');
   				});
	    	},
			addDataTable(){
				this.title = "新增";
				this.editDialog = true;
				this.$nextTick(() => {
 					this.$refs.widgetInfo.loadData('');
 				});
			},deleteDataTable(index ,row){
				this.$confirm('此操作将永久删除该及其下所有引用的数据项, 是否继续', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	
					var params = {
			      		id : row.C_ID,
			      		code:row.C_CODE
			      	};
			      	
			       	delWidget(params).then((data)=>{
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

			},exportData(index ,row){
		      	let params = {
					code: row.C_CODE
				};
				this.loading2 = true;
				exportWidget(params).then((data) => {
					this.loading2 = false;
					if (data.success){
						window.location.href = '/static/upload/zips/widgets/' + row.C_CODE + '.zip';
				        this.$message({
				          message: '导出成功',
				          type: 'success'
				        });
					}else{
						this.$message({
							message: data.title,
							type: 'error'
						});
						}
			    }).catch((e) => {
			   		this.loading2 = false;
					this.$message({
						message: '导出失败,原因:'+e,
						type: 'error'
					});
				});
				
			},uploadSuccess(response, file, fileList) {
				this.loading2 = false;
				if (response.success){
					if (response.description == '1'){//widget已存在
						var layoutCode = response.title;
						this.$confirm('导入widget：'+layoutCode+'已存在，是否覆盖？', '提示', {
						  confirmButtonText: '确定',
						  cancelButtonText: '取消',
						  type: 'warning'
						}).then(() => {
							var jsonObj = JSON.parse(response.data);
							var json = JSON.stringify(jsonObj);
							let params = {
								type:'1',
								json:json
							};
							this.importLayout(params);
						}).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消导入'
				          });
				        });
					} else{
						this.$message({
				          message: response.title,
				          type: 'success'
				        });
				        this.searchTableData();
					}
				}else{
					this.$message({
						type: 'error',
						message: response.title
					});
				}
			},importWidget(params){
				this.loading2 = true;
				importWidget(params).then((data) => {
					this.loading2 = false;
					if (data.success){
						this.$message({
				          message: data.title,
				          type: 'success'
				        });
				        this.searchTableData();
					}else{
						this.$message({
							type: 'error',
							message: data.title
						});
					}
				}).catch((e) => {
					this.loading2 = false;
					this.$message({
						type: 'error',
						message: "导入失败,原因:"+e
					});
				});
			},widgetAuth(command){//widget 授权
				if (command == '0'){
					this.userAuthDialog = true;
					this.$nextTick(() => {
	 					this.$refs.userAuthInfo.loadData(this.selectRows[0].C_ID,this.selectRows[0].C_NAME,'2');
	 				});
				}else{
					this.rolesAuthDialog = true;
					this.$nextTick(() => {
	 					this.$refs.rolesAuthInfo.loadData(this.selectRows[0].C_ID,this.selectRows[0].C_NAME,'2');
	 				});
				}
				
			},saveUserAuth(){//保存用户授权信息
				this.$nextTick(() => {
 					this.$refs.userAuthInfo.saveData();
 				});
				
			},closeUserAuthAndFresh(){//关闭用户授权窗口
				this.userAuthDialog = false;
			
			},saveRolesAuth(){//保存角色授权信息
				this.$nextTick(() => {
 					this.$refs.rolesAuthInfo.saveData();
 				});
			
			},closeRolesAuthAndFresh(){//关闭角色授权窗口
				this.rolesAuthDialog = false;
			},selectChange(rows) { //切换时，控制按钮
				this.selectRows = rows;
				if(rows.length > 0 && rows.length == 1) {
					this.enabledBtn = false;
				}else{
					this.enabledBtn = true;
				}
			},beforeUpload(file) {
				var allow = (file.type === 'application/x-zip-compressed')
				const isLt2M = file.size / 1024 / 1024 / 2 < 20;
				if(!allow) {
					this.$message.error('导入widget包只能是 ZIP格式!');
				}
				if(!isLt2M) {
					this.$message.error('导入widget包大小不能超过 20MB!');
				}
				
				if (allow && isLt2M){
					this.loading2 = true;
				}
				return allow && isLt2M;
			},
			updateWidget(){
				var params = {
		      	};
		       	udpWidgetCode(params).then((data) => {
					this.$message({
			            message: '更新成功！',
			            type: 'success'
			        });
				}).catch((e) => {
					this.$message({
						type: 'error',
						message: "更新失败,原因:"+e
					});
				});
			}
		},
		mounted() {
			this.searchTableData();
			this.fileUploadUrl = '/api/cos3-portal-manager/widget/importWidget';
		},
	    created() {
	      var childMainHeight = $('.childMain').height();
		  this.tableHeight = (childMainHeight - 90) + 'px';
	    }
	}
</script>

<style scoped>

</style>