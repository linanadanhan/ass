<template>
	<div class="con_main">
		<div class="childMain" style="width: 100%;">
			<div class="handle">
				<div style="float: left;">
					<el-upload :on-success="uploadSuccess" :action="fileUploadUrl" :show-file-list="false" :before-upload="beforeUpload">
						<el-button size="small" type="primary">安装</el-button>
					</el-upload>
				</div>
				<el-input style="float: right;margin-top:0;width:150px" size="small" placeholder="请输入关键字" icon="search" v-model="search">
					<i slot="suffix" class="el-input__icon el-icon-search" @click="searchTableData"></i>
				</el-input>
			</div>
			<div style="height: 30px;"></div>
			<el-table ref="multipleTable" :data="tableData" v-loading.fullscreen.lock="loading2" @row-dblclick="dblclick" highlight-current-row border style="width: 100%;" :height="tableHeight">
				<el-table-column type="index" width="55" align="center"></el-table-column>
				<el-table-column prop="C_NAME" width="160" label="部件名称"></el-table-column>
				<el-table-column prop="C_DESC" label="部件信息">
					<!--<template slot-scope="scope">
						<el-popover trigger="hover" placement="top-start">
							{{ scope.row.C_DESC }}
							<div slot="reference" class="name-wrapper">
								{{ scope.row.C_DESC }}
							</div>
						</el-popover>
					</template>-->
				</el-table-column>
				<el-table-column label="认证" width="90">
					<template slot-scope="scope">
						<span v-if="scope.row.C_IS_AUTH == true"><i class="iconfont icon-unie60f">已认证</i></span>
						<span v-else>未认证</span>
					</template>
				</el-table-column>
				<el-table-column prop="C_STATUS" :formatter="fomaterStatus" label="状态" width="80"></el-table-column>
				<el-table-column label="操作" width="70" align="center">
					<template slot-scope="scope">
						<el-dropdown trigger="click" placement="bottom-start" @command="(command) => handleCommand(command, scope.row)">
							<div style="width: 60px;"><i class="el-icon-more"></i></div>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="0">启用</el-dropdown-item>
								<el-dropdown-item command="1">停用</el-dropdown-item>
								<el-dropdown-item :disabled="scope.row.C_CODE == 'sys'" command="2">卸载</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</template>
				</el-table-column>
			</el-table>
			<div class="page-box">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 50, 100, 200]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
			<el-dialog size="small" :title="title" :visible.sync="editDialog" :close-on-click-modal="false" width="70%" top="6vh">
				<componentDetail ref="sourceInfo"></componentDetail>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import { queryComponentDataTable, updateComponentStatus, importData, uninstallComponent} from '../../api/apiPortal';
	import componentDetail from '@/components/system/componentDetail.vue';

  import {gbs} from '../../config'
  
	export default {
		components: {
			componentDetail: componentDetail
		},
		data() {
			return {
				tableHeight: '',
				total: 0,
				pageSize: 20,
				currentPage: 1,
				search: '',
				tableData: [],
				title: '部件明细',
				editDialog: false,
				loading2: false,
				fileUploadUrl: ''
			};
		},
		methods: {
			handleSizeChange(val) { //2.分页设置
				this.pageSize = val;
				this.searchTableData();
			},
			handleCurrentChange(val) { //2.分页设置
				this.currentPage = val;
				this.searchTableData();
			},
			searchTableData() { // 查询列表数据
				var param = {
					search: this.search,
					page: this.currentPage,
					rows: this.pageSize
				};
				queryComponentDataTable(param).then(data => {
					this.tableData = data.rows;
					this.total = data.total;
				});
			},
			dblclick(row) { // 双击列表
				this.editDialog = true;
				this.$nextTick(() => {
					this.$refs.sourceInfo.loadData(row.C_CODE);
				});
			},
			fomaterStatus(row, cell, value) { // 格式化状态
				if(value == true) {
					return "启用";
				} else {
					return "停用";
				}
			},
			deleteDataTable(index, row) {
				this.$confirm('确定要删除吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var params = {
						C_ID: row.C_ID,
					};
					delMsgRegister(params).then((data) => {
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
				if(command == '0') { // 启用
					this.startOrStop(true, '启用', row)
				} else if(command == '1') { // 停用
					this.startOrStop(false, '停用', row)
				} else if(command == '2') { // 卸载
					this.uninstall(row)
				}
			},
			startOrStop(status, msg, row) {
				this.$confirm('确定要' + msg + '该部件吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let para = {
						id: row.C_ID,
						status: status
					};
					updateComponentStatus(para).then((data) => {
						if(data.status == 200) {
							this.$message({
								type: 'success',
								message: msg + '成功!'
							});
						}
						this.searchTableData()
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消' + msg
					});
				});
			},
			uninstall(row) {
				this.$confirm('确定要卸载该部件吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let para = {
						code: row.C_CODE
					};
          uninstallComponent(para).then((data) => {
            if(data.status == 200) {
              this.$message({
                type: 'success',
                message: '卸载成功!'
              });
              this.searchTableData()
            } else {
              this.$message({
                type: 'error',
                message: data.data
              });
            }
          }).catch((err) => {
              this.$message({
                type: 'error',
                message: '卸载失败!'
              });
            });
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消卸载!'
					});
				});
			},
			formatterStatus(row, column) {
				if(row.C_STATUS == true) {
					return "启用";
				} else {
					return "停用";
				}
			},
			uploadSuccess(response, file, fileList) {
				this.loading2 = false;
				if (response && response.referenceId) {
          let params = {
            referenceId: response.referenceId,
            fileName: response.name
          }
          this.importData(params);
        } else {
          this.$message({
            type: 'error',
            message: '导入失败'
          });
        }
			},
			importData(params) {
				this.loading2 = true;
				importData(params).then((data) => {
					this.loading2 = false;
					if(data.success) {
						if(data.description == '1') { //主题已存在
							this.confirm(data, data.title, '1');

						} else if(data.description == '2') { //布局已存在
							this.confirm(data, data.title, '2');

						} else if(data.description == '3') { //修饰器已存在
							this.confirm(data, data.title, '3');

						} else if(data.description == '4') { //widget已存在
							this.confirm(data, data.title, '4');

						} else {
							this.$message({
								message: data.title,
								type: 'success'
							});
							this.searchTableData();
						}
					} else {
						this.$message({
							type: 'error',
							message: data.title
						});
						this.searchTableData();
					}
				}).catch((e) => {
					this.loading2 = false;
					this.$message({
						type: 'error',
						message: "安装失败,原因:" + e
					});
				});
			},
			confirm(data, code, type) {
				var cmg = '';
				var jsonObj = JSON.parse(data.data);
				let obj = {};

				if(type == '1') { //主题
					cmg = '安装主题：' + code + '已存在，是否覆盖？';
					obj = jsonObj.themes.find((item) => {
						return item.name === code;
					});

				} else if(type == '2') { //布局
					cmg = '安装布局：' + code + '已存在，是否覆盖？';
					obj = jsonObj.layouts.find((item) => {
						return item.name === code;
					});

				} else if(type == '3') { //修饰器
					cmg = '安装修饰器：' + code + '已存在，是否覆盖？';
					obj = jsonObj.decorators.find((item) => {
						return item.name === code;
					});

				} else if(type == '4') { //widget
					cmg = '安装widget：' + code + '已存在，是否覆盖？';
					console.info(jsonObj.widgets)
					obj = jsonObj.widgets.find((item) => {
						return item.name === code;
					});
				}

				this.$confirm(cmg, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					obj.isCover = "1";
					var json = JSON.stringify(jsonObj);
					let params = {
						type: type,
						json: json
					};
					this.importData(params);
				}).catch(() => {
					obj.isCover = "0";
					var json = JSON.stringify(jsonObj);
					let params = {
						type: type,
						json: json
					};
					this.importData(params);
				});
			},
			beforeUpload(file) {
				var mime = file.name.toLowerCase().substr(file.name.lastIndexOf("."));
				var allow = (mime === '.zip')
				const isLt2M = file.size / 1024 / 1024 / 2 < 20;
				if(!allow) {
					this.$message.error('安装部件包只能是 zip格式!');
				}
				if(!isLt2M) {
					this.$message.error('安装部件包大小不能超过 20MB!');
				}

				if(allow && isLt2M) {
					this.loading2 = true;
				}
				return allow && isLt2M;
			}
		},
		mounted() {
			this.searchTableData();
			this.fileUploadUrl = gbs.fileServiceUrl + '/file/uploadFile';
		},
		created() {
			var childMainHeight = $('.childMain').height();
			this.tableHeight = (childMainHeight - 90) + 'px';
		}
	}
</script>

<style scoped>

</style>