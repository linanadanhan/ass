<template>
	<div class="con_main">
		<div class="childMain" style="width: 100%;">
			<div class="handle">
				<!--<el-button type="primary" v-loading.fullscreen.lock="loading2" @click="addDataTable">新增</el-button>-->
		        <!--<el-button size="small" type="primary">
					<el-upload :on-success="uploadSuccess" :action="fileUploadUrl" :show-file-list="false" :before-upload="beforeUpload">导入</el-upload>
				</el-button>-->

        <el-input style="float: right;margin-top:0;width:150px;margin-bottom: 10px;" size="small" placeholder="请输入关键字" icon="search"
      		v-model="search">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="handleSearch"></i>
        </el-input>
			</div>
			
			<el-table ref="multipleTable" :data="tableData" @row-click="rowClick" highlight-current-row border style="width: 100%" :height="tableHeight">
				<el-table-column type="selection" width="55" align="center"></el-table-column>
				<el-table-column prop="C_CODE" label="修饰器代码"></el-table-column>
				<el-table-column prop="C_NAME" label="修饰器名称"></el-table-column>
				<!--<el-table-column prop="C_PROJECT_CODE" label="项目CODE"></el-table-column>-->
				<!--<el-table-column prop="C_IS_IMP" :formatter="formatIsImp" label="是否导入"></el-table-column>-->
				<el-table-column prop="C_IS_SYSTEM" :formatter="formatIsSystem" label="是否系统内置"></el-table-column>
				<!--<el-table-column label="操作" width="180">
		          <template scope="scope">
		            <el-button type="text" size="small" @click="editDataTable(scope.$index, scope.row)">修改</el-button>
		            <el-button v-show="scope.row.C_CODE !='default'" type="text" size="small" @click="deleteDataTable(scope.$index, scope.row)">删除</el-button>
		          	<el-button v-if="scope.row.C_IS_IMP" type="text" size="small" @click="exportData(scope.$index, scope.row)">导出</el-button>
		          </template>
		        </el-table-column>-->
			</el-table>
			
			<div class="page-box">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 50, 100, 200]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
			
			<el-dialog size="small" :title="title" :visible.sync="editDialog" :close-on-click-modal="false" width="50%" top="8vh">
				<decorateForm @closeAndFresh="closeFresh" ref="decorateInfo"></decorateForm>
				<div slot="footer" class="dialog-footer">
					<el-button @click="editDialog = false">取 消</el-button>
					<el-button type="primary" @click="saveSubmitForm">确 定</el-button>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import {queryDecorateDataTable,delDecorate,importDecorate, exportDecorate } from '../../api/apiPortal';
	import decorateForm from '@/components/system/decorateEdit.vue';
	
	export default {
		components: {
			decorateForm:decorateForm
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
				loading2: false
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
 						 this.$refs.decorateInfo.saveData();
 				});
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
				queryDecorateDataTable(param).then(data => {
					this.tableData = data.rows;
					this.total = data.total;
				});
			},dblclick(row) {
				this.editDialog = true;
				this.$nextTick(() => {
   						 this.$refs.decorateInfo.loadData(row.C_ID,'');
   				});
			},rowClick(row){
				this.$refs.multipleTable.toggleRowSelection(row);
				
			},editDataTable(index ,row){
				this.title = "修改";
	    		this.editDialog = true;
				this.$nextTick(() => {
   						 this.$refs.decorateInfo.loadData(row.C_ID,'');
   				});
	    	},
			addDataTable(){
				this.title = "新增";
				this.editDialog = true;
				this.$nextTick(() => {
 					this.$refs.decorateInfo.loadData('');
 				});
			},deleteDataTable(index ,row){
		       	
				this.$confirm('此操作将永久删除该修饰器, 是否继续', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
					var params = {
			      		id : row.C_ID,
			      		code:row.C_CODE
			      	};
			       	delDecorate(params).then((data)=>{
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
				exportDecorate(params).then((data) => {
					this.loading2 = false;
					if (data.success){
						window.location.href = '/static/upload/zips/decorators/' + row.C_CODE + '.zip';
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
					if (response.description == '1'){//修饰器已存在
						var siteCode = response.title;
						this.$confirm('导入修饰器：'+siteCode+'已存在，是否覆盖？', '提示', {
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
							this.importDecorate(params);
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
			},importDecorate(params){
				this.loading2 = true;
				importDecorate(params).then((data) => {
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
			},beforeUpload(file) {
				var allow = (file.type === 'application/x-zip-compressed')
				const isLt2M = file.size / 1024 / 1024 / 2 < 20;
				if(!allow) {
					this.$message.error('导入修饰器包只能是 ZIP格式!');
				}
				if(!isLt2M) {
					this.$message.error('导入修饰器包大小不能超过 20MB!');
				}
				
				if (allow && isLt2M){
					this.loading2 = true;
				}
				return allow && isLt2M;
			}
		},
		mounted() {
			this.searchTableData();
			this.fileUploadUrl = '/api/cos3-portal-manager/decorate/importDecorate';
		},
	    created() {
	      var childMainHeight = $('.childMain').height();
		  this.tableHeight = (childMainHeight - 90) + 'px';
	    }
	}
</script>

<style scoped>

</style>