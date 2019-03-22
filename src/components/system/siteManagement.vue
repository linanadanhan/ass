<template>
	<div class="con_main">
		<div class="childMain" style="width: 100%;">
			<div v-show="showDiv" style="width: 100%;height: 100%;">
				<div class="handle">
					<el-button style="float: left;" type="primary" @click="addDataTable">新增</el-button>

					<el-upload style="padding-left: 15px;float: left;padding-right: 15px;" :on-success="uploadSuccess" :action="fileUploadUrl" :show-file-list="false" :on-change="handleChange" :before-upload="beforeUpload">
						<el-button size="small" type="primary">导入</el-button>
					</el-upload>

					<el-button style="padding-right: 15px;" type="primary" :disabled="enabledBtn" @click="handlePageMgr">页面管理</el-button>
					<!--<el-button type="primary" :disabled="enabledBtn" @click="handleSitePublish">站点发布</el-button>-->
					<el-button style="padding-right: 15px;" type="primary" :disabled="enabledBtn" @click="handleSitePreview">站点预览</el-button>

					<el-dropdown trigger="click" style="padding-left: 10px;" placement="bottom-start" @command="siteAuth">
						<el-button :disabled="enabledBtn" type="primary">
							站点授权<i class="el-icon-arrow-down el-icon--right"></i>
						</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="0">用户授权</el-dropdown-item>
							<el-dropdown-item command="1">角色授权</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>

					<el-input style="float: right;margin-top:0;width:150px" size="small" placeholder="请输入关键字" icon="search" v-model="search">
						<i slot="suffix" class="el-input__icon el-icon-search" @click="handleSearch"></i>
					</el-input>
				</div>

				<el-table ref="multipleTable" :data="tableData" v-loading.fullscreen.lock="loading2" @row-dblclick="dblclick" @row-click="rowClick" highlight-current-row @selection-change="selectChange" border style="width: 100%" :height="tableHeight">
					<el-table-column type="selection" width="55" align="center"></el-table-column>
					<el-table-column prop="C_CODE" label="站点代码"></el-table-column>
					<el-table-column prop="C_NAME" label="站点名称"></el-table-column>
					<el-table-column prop="C_TITLE" label="站点标题"></el-table-column>
					<el-table-column prop="PUBLICTHEMENAME" label="站点公开主题"></el-table-column>
					<el-table-column prop="PRIVATETHEMENAME" label="站点私有主题"></el-table-column>
					<el-table-column label="操作" width="70" align="center">
						<template slot-scope="scope">
							<el-dropdown trigger="click" placement="bottom-start" @command="(command) => handleCommand(command, scope.row)">
								<div style="width: 60px;"><i class="el-icon-more"></i></div>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item command="0">修改</el-dropdown-item>
									<el-dropdown-item command="1">删除</el-dropdown-item>
									<el-dropdown-item command="2">导出</el-dropdown-item>
									<el-dropdown-item command="3">复制</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
							<!--						
			            <el-button type="text" size="small" @click="editDataTable(scope.$index, scope.row)">修改</el-button>
			            <el-button type="text" size="small" @click="deleteDataTable(scope.$index, scope.row)">删除</el-button>
			            <el-button type="text" size="small" @click="exportData(scope.$index, scope.row)">导出</el-button>-->
						</template>
					</el-table-column>
				</el-table>

				<div class="page-box">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 50, 100, 200]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
					</el-pagination>
				</div>
			</div>

			<div v-show="!showDiv" style="height: 100%;width: 100%;">
				<sitePageForm @closeAndFresh="closeFresh1" ref="sitePageInfo"></sitePageForm>
			</div>

			<el-dialog size="small" :title="title" :visible.sync="editDialog" :close-on-click-modal="false" width="50%" top="8vh">
				<siteForm @closeAndFresh="closeFresh" ref="siteInfo"></siteForm>
				<div slot="footer" class="dialog-footer">
					<el-button @click="editDialog = false">取 消</el-button>
					<el-button type="primary" @click="saveSubmitForm">确 定</el-button>
				</div>
			</el-dialog>

			<el-dialog size="small" title="站点用户授权" :visible.sync="siteUserAuthDialog" :close-on-click-modal="false" width="80%" top="7vh">
				<portalUserAuthForm @closeAndFresh="closeUserAuthAndFresh" ref="siteUserAuthInfo"></portalUserAuthForm>
				<div class="dialog-footer" style="text-align: right;margin-top: 10px;">
					<el-button @click="siteUserAuthDialog = false">取 消</el-button>
					<el-button type="primary" @click="saveSiteUserAuth">确 定</el-button>
				</div>
			</el-dialog>

			<el-dialog size="small" title="站点角色授权" :visible.sync="siteRolesAuthDialog" :close-on-click-modal="false" width="80%" top="7vh">
				<portalRolesAuthForm @closeAndFresh="closeRolesAuthAndFresh" ref="siteRolesAuthInfo"></portalRolesAuthForm>
				<div class="dialog-footer" style="text-align: right;margin-top: 10px;">
					<el-button @click="siteRolesAuthDialog = false">取 消</el-button>
					<el-button type="primary" @click="saveSiteRolesAuth">确 定</el-button>
				</div>
			</el-dialog>

			<!--复制站点form-->
			<el-dialog size="small" title="站点复制" :visible.sync="siteCopyDialog" :close-on-click-modal="false" width="30%" top="7vh">
				<el-form :model="addForm" ref="addForm" :rules="rules" label-width="80px">
					<el-form-item label="站点代码" prop="code">
						<el-input v-model="addForm.code"></el-input>
					</el-form-item>
					<el-form-item label="站点名称" prop="name">
						<el-input v-model="addForm.name"></el-input>
					</el-form-item>
				</el-form>
				<div class="dialog-footer" style="text-align: right;margin-top: 10px;">
					<el-button @click="siteCopyDialog = false">取 消</el-button>
					<el-button type="primary" @click="saveSiteCopyAuth">确 定</el-button>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import { querySiteDataTable, delSite, importSite, exportSite, isExitSiteCode, copySite } from '../../api/apiPortal';
	import siteForm from '@/components/system/siteEdit.vue';
	import sitePageForm from '@/components/system/sitePage.vue'
	import portalUserAuthForm from '@/components/system/portalUserAuthForm.vue'
	import portalRolesAuthForm from '@/components/system/portalRolesAuthForm.vue'
	
	import {gbs} from '../../config'

	export default {
		components: {
			siteForm: siteForm,
			sitePageForm: sitePageForm,
			portalUserAuthForm: portalUserAuthForm,
			portalRolesAuthForm: portalRolesAuthForm
		},
		data() {
			//主题代码唯一性校验
			var validateCodeUnique = (rule, value, callback) => {
				if(value) {
					if(!/^[^\u4e00-\u9fa5]{0,}$/.test(value)) {
						callback(new Error('不能输入中文！'));
					}

					isExitSiteCode({
						"code": value,
						"id": this.addForm.id
					}).then((data) => {
						if(data) {
							callback(new Error('站点代码已存在！'));
						} else {
							callback();
						}
					});
				} else {
					callback();
				}
			};
			return {
				copySiteCode: '',
				addForm: {
					code: '',
					name: ''
				},
				siteCopyDialog: false,
				tableHeight: '',
				total: 0,
				pageSize: 20,
				currentPage: 1,
				search: '',
				tableData: [],
				title: '新增',
				editDialog: false,
				sitePageDialog: false,
				fileUploadUrl: '',
				fileDownloadUrl: '',
				importFiles: {},
				fileList: [],
				loading2: false,
				enabledBtn: true,
				selectRows: [],
				siteUserAuthDialog: false,
				siteRolesAuthDialog: false,
				showDiv: true,
				rules: {
					name: [{
							required: true,
							message: '必填 ',
							trigger: 'change'
						},
						{
							min: 1,
							max: 200,
							message: '长度在 1到 200个字符',
							trigger: 'change'
						}
					],
					code: [{
							required: true,
							message: '必填 ',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 50,
							message: '长度在 1到 50个字符',
							trigger: 'change'
						},
						{
							validator: validateCodeUnique,
							trigger: 'change'
						}
					]
				}
			};
		},
		methods: {
		  handleSearch() {
        this.currentPage = 1;
        this.searchTableData();		    
		  },
			closeFresh() {
				this.editDialog = false;
				this.searchTableData();
			},
			closeFresh1() {
				this.showDiv = true;
				this.searchTableData();
			},
			saveSubmitForm() { //站点保存
				this.$nextTick(() => {
					this.$refs.siteInfo.saveData();
				});
			},
			saveSitePage() { //站点页面保存
				this.$nextTick(() => {
					this.$refs.sitePageInfo.saveData();
				});
			},
			handlePreview() { //预览
				this.$nextTick(() => {
					this.$refs.sitePageInfo.handlePreview();
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
					rows: this.pageSize
				};
				querySiteDataTable(param).then(data => {
					this.tableData = data.rows;
					this.total = data.total;
				});
			},
			dblclick(row) {
				this.editDialog = true;
				this.$nextTick(() => {
					this.$refs.siteInfo.loadData(row.C_ID, '');
				});
			},
			rowClick(row) { //单击行
				this.$refs.multipleTable.toggleRowSelection(row);
			},
			selectChange(rows) { //切换时，控制按钮
				this.selectRows = rows;
				if(rows.length > 0 && rows.length == 1) {
					this.enabledBtn = false;
				} else {
					this.enabledBtn = true;
				}
			},
			editDataTable(index, row) {
				this.title = "修改";
				this.editDialog = true;
				this.$nextTick(() => {
					this.$refs.siteInfo.loadData(row.C_ID, '');
				});
			},
			addDataTable() {
				this.title = "新增";
				this.editDialog = true;
				this.$nextTick(() => {
					this.$refs.siteInfo.loadData('');
				});
			},
			deleteDataTable(index, row) {

				this.$confirm('此操作将永久删除该站点及其下所有引用的数据项, 是否继续', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var params = {
						id: row.C_ID,
						code: row.C_CODE
					};

					delSite(params).then((data) => {

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
			exportData(index, row) {
				let params = {
					siteCode: row.C_CODE
				};
				this.loading2 = true;

				exportSite(params).then((data) => {
					this.loading2 = false;
					if(data.success) {
						window.location.href = this.fileDownloadUrl + '/' + data.data;
						this.$message({
							message: '导出成功',
							type: 'success'
						});
					} else {
						this.$message({
							message: data.title,
							type: 'error'
						});
					}
				}).catch((e) => {
					this.loading2 = false;
					this.$message({
						message: '导出失败,原因:' + e,
						type: 'error'
					});
				});
			},
			uploadSuccess(response, file, fileList) {
				this.loading2 = false;
				if (response && response.referenceId) {
				  let params = {
            referenceId: response.referenceId,
            fileName: response.name
          }
				  this.importSite(params);
				} else {
			    this.$message({
            type: 'error',
            message: '导入失败'
          });
				}
			},
			importSite(params) { //单独抽取，作为递归调用
				this.loading2 = true;
				importSite(params).then((data) => {
					this.loading2 = false;
					if(data.success) {
					  if(data.description == '0') { //站点已存在
              var siteCode = data.title;
              this.$confirm('导入站点：' + siteCode + '已存在，是否覆盖？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                var jsonObj = JSON.parse(data.data);
                jsonObj.isCover = "1";
                var json = JSON.stringify(jsonObj);
                let params = {
                  type: '0',
                  json: json
                };
                this.importSite(params);
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消导入'
                });
              });          
            }else if(data.description == '1') { //主题已存在
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
					}
				}).catch((e) => {
					this.loading2 = false;
					this.$message({
						type: 'error',
						message: "导入失败,原因:" + e
					});
				});
			},
			confirm(data, code, type) {
				var cmg = '';
				var jsonObj = JSON.parse(data.data);
				let obj = {};

				if(type == '1') { //主题
					cmg = '导入主题：' + code + '已存在，是否覆盖？';
					obj = jsonObj.themes.find((item) => {
						return item.code === code;
					});

				} else if(type == '2') { //布局
					cmg = '导入布局：' + code + '已存在，是否覆盖？';
					obj = jsonObj.layouts.find((item) => {
						return item.code === code;
					});

				} else if(type == '3') { //修饰器
					cmg = '导入修饰器：' + code + '已存在，是否覆盖？';
					obj = jsonObj.decorates.find((item) => {
						return item.code === code;
					});

				} else if(type == '4') { //widget
					cmg = '导入widget：' + code + '已存在，是否覆盖？';
					obj = jsonObj.widgets.find((item) => {
						return item.code === code;
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
					this.importSite(params);
				}).catch(() => {
					obj.isCover = "0";
					var json = JSON.stringify(jsonObj);
					let params = {
						type: type,
						json: json
					};
					this.importSite(params);
				});
			},
			beforeUpload(file) {
				var mime = file.name.toLowerCase().substr(file.name.lastIndexOf("."));
				var allow = (mime === '.zip')
				const isLt2M = file.size / 1024 / 1024 / 2 < 20;
				if(!allow) {
					this.$message.error('上传站点包只能是 zip格式!');
				}
				if(!isLt2M) {
					this.$message.error('上传站点包大小不能超过 20MB!');
				}

				if(allow && isLt2M) {
					this.loading2 = true;
				}

				return allow && isLt2M;
			},
			handleChange(file, fileList) {
				this.fileList = fileList.slice(-3);
			},
			handlePageMgr() { //页面管理
				this.showDiv = false;
				this.$nextTick(() => {
					this.$refs.sitePageInfo.loadData(this.selectRows[0].C_ID, this.selectRows[0].C_CODE);
				});
			},
			handlePageWidgetMgr() { //页面widget配置管理

				this.widgetConfDialog = true;

				this.$nextTick(() => {
					this.$refs.pageWidgetInfo.loadData(this.selectRows[0].C_ID);
				});
			},
			handleSitePreview() { //站点预览
			  var path = window.location.href
				var previewUrl = path.substr(0,path.indexOf('admin')) + "#/" + this.selectRows[0].C_CODE + '/public';
				window.open(previewUrl);
			},
			handleSitePublish() { //站点发布
				this.$message.info('待开发!'); //TODO
			},
			siteAuth(command) { //站点授权

				if(command == '0') {
					this.siteUserAuthDialog = true;

					this.$nextTick(() => {
						this.$refs.siteUserAuthInfo.loadData(this.selectRows[0].C_ID, this.selectRows[0].C_NAME, '0');
					});

				} else {

					this.siteRolesAuthDialog = true;

					this.$nextTick(() => {
						this.$refs.siteRolesAuthInfo.loadData(this.selectRows[0].C_ID, this.selectRows[0].C_NAME, '0');
					});

				}
			},
			closeUserAuthAndFresh() { //关闭用户授权窗口
				this.siteUserAuthDialog = false;
			},
			saveSiteUserAuth() { //保存站点用户授权信息

				this.$nextTick(() => {
					this.$refs.siteUserAuthInfo.saveData();
				});

			},
			closeRolesAuthAndFresh() { //关闭角色授权窗口
				this.siteRolesAuthDialog = false;

			},
			saveSiteRolesAuth() { //保存站点角色授权信息
				this.$nextTick(() => {
					this.$refs.siteRolesAuthInfo.saveData();
				});
			},
			handleCommand(command, row) {
				if(command == '0') {
					this.title = "修改";
					this.editDialog = true;
					this.$nextTick(() => {
						this.$refs.siteInfo.loadData(row.C_ID, '');
					});
				} else if(command == '1') {
					this.deleteDataTable(1, row);

				} else if(command == '2') {
					this.exportData(1, row);

				} else if(command == '3') { // 站点复制
					this.siteCopyDialog = true
					this.copySiteCode = row.C_CODE
					this.$refs.addForm.resetFields()
				}
			},
			saveSiteCopyAuth() { // 站点复制
				this.$refs.addForm.validate((valid) => {
					if(valid) {
						this.loading2 = true
						let params = {
							oSiteCode: this.copySiteCode,
							nSiteCode: this.addForm.code,
							siteName: this.addForm.name
						}
						copySite(params).then((data) => {
							this.loading2 = false
							console.info(data)
							if(data.status == 200) {
								// 复制成功刷新列表
								this.siteCopyDialog = false
								this.searchTableData();
								this.$message({
									message: '复制成功',
									type: 'success'
								});
							} else {
								this.$message({
									message: data.data,
									type: 'error'
								});
							}
						}).catch((e) => {
							this.loading2 = false
							console.info(e)
							this.$message({
								message: '复制站点失败:' + e,
								type: 'error'
							});
						});
					}
				})
			}
		},
		mounted() {
			this.searchTableData();
			this.fileUploadUrl = gbs.fileServiceUrl + '/file/uploadFile';
			this.fileDownloadUrl = gbs.fileServiceUrl + '/file/download';
		},
		created() {
			var childMainHeight = $('.childMain').height();
			this.tableHeight = (childMainHeight - 90) + 'px';
		}
	}
</script>

<style scoped>

</style>