<template>
	<div class="con_main">
		<div class="childMain">
			<div class="handle">
				<el-button type="primary" @click="addHelp">新增</el-button>
			</div>
			
			<el-table ref="multipleTable" :data="tableData" v-loading.fullscreen.lock="loading2" highlight-current-row  @row-dblclick="dblclick" border >
				<el-table-column type="index"> </el-table-column>
				<el-table-column prop="C_SITE_CODE" label="站点"></el-table-column>
				<el-table-column prop="C_TITLE" label="标题"></el-table-column>
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
			
			<el-dialog size="small" :title="title" :visible.sync="editDialog" :close-on-click-modal="false" width="90%" top="8vh">
				<siteHelpEdit @closeAndFresh="closeAndFresh" ref="pageHelpInfo"></siteHelpEdit>
				<div slot="footer" class="dialog-footer">
					<el-button @click="editDialog = false">取 消</el-button>
					<el-button type="primary" @click="saveSubmitForm">确 定</el-button>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import {querySitePageHelp, delSitePageHelp } from '../../api/apiPortal';
	import siteHelpEdit from '@/components/system/siteHelpEdit.vue'
	
	export default {
		components: {
			siteHelpEdit:siteHelpEdit
		},
		props:['currentNode','showHelpNodeType'],
		data() {
			return {
				total: 0,
				pageSize: 20,
				currentPage: 1,
				tableData: [],
				title:'新增',
				editDialog: false,
				loading2: false
			};
		},
		methods: {
			handleCommand(command,row){
				if (command == '0'){// 修改
					this.editHelp(0, row);
				}else if (command == '1'){// 删除
					this.deleteHelp(0, row);
				}
			},
			addHelp(){
				this.title = "新增";
				this.editDialog = true;
				this.$nextTick(() => {
 					this.$refs.pageHelpInfo.loadData('',this.currentNode.attributes.siteCode,this.currentNode.attributes.uuId,this.showHelpNodeType);
 				});
			},
			closeAndFresh(){
			   this.editDialog = false;
			   this.loadData();
			},
			saveSubmitForm() {
				this.$nextTick(() => {
 					this.$refs.pageHelpInfo.saveSubmitForm();
 				});
			},
			editHelp(index ,row){
				this.title = "修改";
	    		this.editDialog = true;
				this.$nextTick(() => {
   					this.$refs.pageHelpInfo.loadData(row.C_ID,this.currentNode.attributes.siteCode,this.currentNode.attributes.uuId,this.showHelpNodeType);
   				});
	    	},
	    	deleteHelp(index ,row){
	    		this.$confirm('您确定删除该帮助信息吗？', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
					var params = {
			      		id: row.C_ID
			      	};
			       	delSitePageHelp(params).then((data)=>{
			       		this.$message({
				            message: '删除成功！',
				            type: 'success'
				        });
			       		this.loadData();
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
	    	handleSizeChange(val){
	    		this.pageSize = val;
	    		this.loadData();
	    	},
	    	handleCurrentChange(val){
	    		this.currentPage = val;
	    		this.loadData();
	    	},
			loadData(){
				var param = {
					pageUuId:this.currentNode.attributes.uuId==null ? '' : this.currentNode.attributes.uuId,
					siteCode:this.currentNode.attributes.siteCode,
					type:this.showHelpNodeType,
					page: this.currentPage,
					size: this.pageSize
				};
				querySitePageHelp(param).then(data => {
					this.tableData = data.rows;
					this.total = data.total;
				});
			},
			dblclick(row){
				this.title = "修改";
	    		this.editDialog = true;
				this.$nextTick(() => {
   					this.$refs.pageHelpInfo.loadData(row.C_ID,this.currentNode.attributes.siteCode,this.currentNode.attributes.uuId,this.showHelpNodeType);
   				});
			}
		},
		mounted() {
		}
	}
</script>

<style scoped>
.con_main .childMain { width: 100%; }
</style>