<template>
	<div class="con_main">
		<div class="childMain" style="width: 100%;">
			<div class="handle">
				<el-button type="primary" @click="addDataTable">新增</el-button>
				<el-input style="float: right;margin-top:0;margin-bottom:10px;width:150px" size="small" placeholder="请输入关键字" icon="search" v-model="search">
					<i slot="suffix" class="el-input__icon el-icon-search" @click="handleSearch"></i>
				</el-input>
			</div>

			<el-table ref="multipleTable" :data="tableData" @row-dblclick="dblclick" highlight-current-row border style="width: 100%;" :height="tableHeight">
				<el-table-column type="index" width="55" align="center"></el-table-column>
				<el-table-column prop="groupName" width="400" label="用户组名称"></el-table-column>
				<el-table-column prop="describe" label="用户组描述"></el-table-column>
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

			<el-dialog size="small" :title="title" :visible.sync="editDialog" :close-on-click-modal="false" width="80%" top="6vh" @close="closeFresh">
				<userGroupEdit ref="sourceInfo" :dimensionOptions="dimensionOptions"></userGroupEdit>
				<div slot="footer" class="dialog-footer">
					<el-button @click="editDialog = false">取 消</el-button>
					<el-button type="primary" @click="saveSubmitForm">确 定</el-button>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import { getDicItemListByDicKey, queryUserGroup, delUserGroup } from '../../api/api';
	import userGroupEdit from '@/components/system/userGroupEit.vue';

	export default {
		components: {
			userGroupEdit: userGroupEdit
		},
		data() {
			return {
				tableHeight: '',
				total: 0,
				pageSize: 20,
				currentPage: 1,
				search: '',
				tableData: [],
				title: '新增',
				editDialog: false,
				dimensionOptions: []
			};
		},
		methods: {
		  handleSearch() {
        this.currentPage = 1;
        this.searchTableData();		    
		  },
			closeFresh() {
				//不需要关闭
//				this.editDialog = false;
				this.searchTableData();
			},
			saveSubmitForm() { //数据源保存
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
					keyword: this.search
				};
				queryUserGroup(param).then(data => {
					this.tableData = data;
//					this.total = data.total;
				});
			},
			dblclick(row) {
				this.editDialog = true;
				this.$nextTick(() => {
					this.$refs.sourceInfo.loadData(row.id);
				});
			},
			editDataTable(index, row) {
				this.title = "修改";
				this.editDialog = true;
				this.$nextTick(() => {
					this.$refs.sourceInfo.loadData(row.id);
				});
			},
			addDataTable() {
				this.title = "新增";
				this.editDialog = true;
				this.$nextTick(() => {
					this.$refs.sourceInfo.loadData();
				});
			},
			deleteDataTable(index, row) {
				this.$confirm('删除用户组后，会将所有与用户组相关联的都删掉，确定要删除吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var params = {
						id: row.id,
					};
					delUserGroup(params).then((data) => {
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
			handleCommand(command, row) {
				if(command == '0') {
					this.title = "修改";
					this.editDialog = true;
					this.$nextTick(() => {
						this.$refs.sourceInfo.loadData(row.id);
					});
				} else if(command == '1') {
					this.deleteDataTable(1, row);
				}
			},
			getOrgDimension() { //得到纬度
				let param = {
					dicKey: 'org_dimension'
				};
				getDicItemListByDicKey(param).then((data) => {
					if(data) {
						this.dimensionOptions = data;
					}
				});
			},
		},
		mounted() {
			this.searchTableData();
			this.getOrgDimension();
		},
		created() {
			var childMainHeight = $('.childMain').height();
			this.tableHeight = (childMainHeight - 90) + 'px';
		}
	}
</script>

<style scoped>

</style>