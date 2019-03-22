<template>
	<div class="con_main">
		<div class="childMain">
			<div class="handle">
				<el-button type="primary" @click="addDataTable">新增</el-button>
	            <el-input style="float: right;margin-top:0;width:150px" size="small" placeholder="请输入关键字" icon="search"
              		v-model="search">
                  <i slot="suffix" class="el-input__icon el-icon-search" @click="searchTableData(this.selPageUuId);"></i>
	            </el-input>
			</div>
			
			<el-table ref="multipleTable" :data="tableData" v-loading.fullscreen.lock="loading2" highlight-current-row @row-click="rowClick" @row-dblclick="dblclick" border >
				<el-table-column type="selection" width="55" align="center"></el-table-column>
				<el-table-column prop="C_WIDGET_TITLE" label="标题"></el-table-column>
				<el-table-column prop="C_WIDGET_NAME" label="widget名称"></el-table-column>
				<el-table-column prop="C_DECORATOR_NAME" label="修饰器"></el-table-column>
				<el-table-column label="操作" width="70" align="center">
		          <template slot-scope="scope">
	          		<el-dropdown trigger="click" placement="bottom-start" @command="(command) => handleCommand(command, scope.row)">
					  <div style="width: 60px;"><i class="el-icon-more"></i></div>
					  <el-dropdown-menu slot="dropdown">
					    <el-dropdown-item command="0">修改</el-dropdown-item>
					    <el-dropdown-item command="1">删除</el-dropdown-item>
					  </el-dropdown-menu>
					</el-dropdown>
		            <!--<el-button type="text" size="small" @click="editDataTable(scope.$index, scope.row)">修改</el-button>
		            <el-button v-show="scope.row.C_CODE !='default'" type="text" size="small" @click="deleteDataTable(scope.$index, scope.row)">删除</el-button>-->
		          </template>
		        </el-table-column>
			</el-table>
			
			<div class="page-box">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 50, 100, 200]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
			
			<el-dialog size="small" :title="title" :visible.sync="editDialog" :close-on-click-modal="false" width="50%" top="8vh">
				<sitePageConfEdit @closeAndFresh="closeFresh" ref="pageConfInfo"></sitePageConfEdit>
				<div slot="footer" class="dialog-footer">
					<el-button @click="editDialog = false">取 消</el-button>
					<el-button type="primary" @click="saveSubmitForm">确 定</el-button>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import {querySitePageConf, delSitePageConf} from '../../api/apiPortal';
	import themeForm from '@/components/system/themeEdit.vue';
	import sitePageConfEdit from '@/components/system/sitePageConfEdit.vue'
	
	export default {
		components: {
			themeForm:themeForm,
			sitePageConfEdit:sitePageConfEdit
		},
		data() {
			return {
				total: 0,
				pageSize: 20,
				currentPage: 1,
				search:'',
				tableData: [],
				title:'新增',
				editDialog: false,
				loading2: false,
				selPageUuId:''
			};
		},
		methods: {
			loadData(pageUuId){
				this.selPageUuId = pageUuId;
				this.searchTableData(pageUuId);
			},
			closeFresh(){
			   this.editDialog = false;
    		   this.searchTableData(this.selPageUuId);
			},saveSubmitForm() { 
				this.$nextTick(() => {
 					this.$refs.pageConfInfo.saveSubmitForm(this.selPageUuId);
 				});
			},
			handleSizeChange(val) { //2.分页设置
				this.pageSize = val;
				this.searchTableData(this.selPageUuId);
			},
			handleCurrentChange(val) { //2.分页设置
				this.currentPage = val;
				this.searchTableData(this.selPageUuId);
			},
			searchTableData(pageUuId) {
				var param = {
					search: this.search,
					pageUuId:pageUuId,
					page: this.currentPage,
					rows: this.pageSize
				};
				querySitePageConf(param).then(data => {
					this.tableData = data.rows;
					this.total = data.total;
				});
			},dblclick(row) {
				this.editDialog = true;
				this.$nextTick(() => {
   					this.$refs.pageConfInfo.loadData(row.C_ID,this.selPageUuId);
   				});
			},rowClick(row){
				this.$refs.multipleTable.toggleRowSelection(row);
			},
			editDataTable(index ,row){
				this.title = "修改";
	    		this.editDialog = true;
				this.$nextTick(() => {
   					this.$refs.pageConfInfo.loadData(row.C_ID,this.selPageUuId);
   				});
	    	},
			addDataTable(){
				this.title = "新增";
				this.editDialog = true;
				this.$nextTick(() => {
 					this.$refs.pageConfInfo.loadData('',this.selPageUuId);
 				});
			},deleteDataTable(index ,row){
				this.$confirm('此操作将删除该widget配置, 是否继续', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
					var params = {
			      		uuId: row.C_UU_ID,
			      		pageUuId: this.selPageUuId
			      	};
			       	delSitePageConf(params).then((data)=>{
			       		this.$message({
				            message: '删除成功！',
				            type: 'success'
				        });
			       		this.searchTableData(this.selPageUuId);
			       	}).catch((err) => {
						this.$message({
							type: 'error',
							message: '删除失败!'
						});
					});
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除'
		          });
		        });
			},
			handleCommand(command,row){// 修改 删除dropdown
				if (command == '0'){// 修改
					this.editDataTable(0, row);
				}else if (command == '1'){// 删除
					this.deleteDataTable(0, row);
				}
			},
		},
		mounted() {
		}
	}
</script>

<style scoped>
.con_main .childMain { width: 100%; }
</style>