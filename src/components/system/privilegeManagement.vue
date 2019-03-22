<template>
	<div class="con_main">
		<div class="childBar">
			<div class="showChild">
				<h3>权限分类</h3>
			</div>
			<el-menu default-active="0" @select="selectItems" class="el-menu-vertical-demo">
				<el-menu-item v-for="(item,index) in permissionTypeOptionsAll" :key="index" :index="item"> {{ item }}</el-menu-item>
			</el-menu>
		</div>
		<div class="childMain">
			<div class="handle">
				<el-button type="primary" @click="addPermission">新增</el-button>
			</div>
			<el-table :data="tableData" border style="width: 100%" :height="tableHeight">
				<el-table-column type="index" width="80" align="center">
				</el-table-column>
				<el-table-column prop="code" label="权限代码" width="100">
				</el-table-column>
				<el-table-column prop="name" label="权限名称" width="100">
				</el-table-column>
				<el-table-column prop="includeResourceRul" label="包含资源" width="160">
				</el-table-column>
				<el-table-column prop="excludeResourceRul" label="不包含资源" width="160">
				</el-table-column>
				<el-table-column prop="describe" label="备注">
				</el-table-column>
				<el-table-column prop="type" label="所属分类" width="100">
				</el-table-column>
				<el-table-column label="操作" width="70" align="center">
					<template slot-scope="scope">
						<el-dropdown trigger="click" placement="bottom-start" @command="(command) => handleCommand(command, scope.row)">
						  <div style="width: 60px;"><i class="el-icon-more"></i></div>
						  <el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="0">修改</el-dropdown-item>
							<el-dropdown-item command="1">删除</el-dropdown-item>
						  </el-dropdown-menu>
						</el-dropdown>
						<!--<el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
						<el-button type="text" size="small" @click="deleteRecord(scope.$index, scope.row)">删除</el-button>-->
						<!--<el-button type="text" size="small" @click="openConnectRolePermission(scope.$index, scope.row)">关联角色</el-button>-->
					</template>
				</el-table-column>
			</el-table>
			<div class="page-box">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[20, 50, 100, 200]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
		</div>
		<el-dialog v-loading.fullscreen.lock="addLoading" title="新增" :visible.sync="addPermissionDialog" :close-on-click-modal="false">
			<el-form :model="addForm" ref="addForm" :rules="rules" label-width="120px">
				<el-form-item label="权限名称" prop="name">
					<el-input v-model="addForm.name"></el-input>
				</el-form-item>
				<el-form-item label="权限代码" prop="code">
					<el-input v-model="addForm.code"></el-input>
				</el-form-item>
				<el-form-item label="分类" prop="type">
					<el-select v-model="addForm.type" filterable allow-create placeholder="请选择">
						<el-option v-for="item in permissionTypeOptions" :key="item" :label="item" :value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="备注">
					<el-input v-model="addForm.describe" type="textarea" :rows="2"></el-input>
				</el-form-item>
				<el-form-item label="包含资源" prop="includeResourceRul">
					<el-select v-model="includeResourceRuls" @change="changeResource" multiple filterable allow-create placeholder="请选择">
						<el-option v-for="item in includeResourceAll" :key="item.text" :label="item.text" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="排斥资源">
					<el-select v-model="excludeResourceRuls" multiple filterable allow-create placeholder="请选择">
						<el-option v-for="item in excludeResourceAll" :key="item.text" :label="item.text" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addPermissionDialog = false">取 消</el-button>
				<el-button type="primary" @click="savePermission">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog v-loading.fullscreen.lock="associationLoading" title="权限关联角色" :visible.sync="associationRoleDialog" :close-on-click-modal="false" width="80%" top="8vh">
			<el-form :model="roleForm" label-width="100px">
				<el-form-item label="当前权限项">
					<el-input v-model="roleForm.name"></el-input>
				</el-form-item>
			</el-form>
			<el-row class="rolehead">
				<el-col :span="4">
					<h5>角色组浏览</h5></el-col>
				<el-col :span="9">
					<h5>待授权角色</h5></el-col>
				<el-col :span="2">
					<h5>操作</h5></el-col>
				<el-col :span="9">
					<h5>已授权角色</h5></el-col>
			</el-row>
			<el-row style="background:#f5f5f5;height:391px">
				<el-col :span="4" style="height:391px;overflow:auto;">
					<el-menu default-active="1" @select="selectRolesItems" class="el-menu-vertical-demo" background-color="#f5f5f5" text-color="#000" active-text-color="#409EFF">
						<el-menu-item v-for="(item,index) in powerKind" :key="index" :index="item"> {{ item }}</el-menu-item>
					</el-menu>
					<el-tree style="background:#f5f5f5;" :data="powerKind" default-expand-all show-checkbox :default-checked-keys="[1-1]" node-key="id" @node-click="handleNodeClick"></el-tree>
				</el-col>
				<el-col :span="9">
					<el-table :data="waitPower" @select="selectWaitPersonRow" @select-all="selectWaitPersonAll" border style="width: 100%" height="390">
						<el-table-column type="selection" width="55">
						</el-table-column>
						<el-table-column prop="name" label="角色名称" width="180">
						</el-table-column>
						<el-table-column prop="code" label="角色标识">
						</el-table-column>
					</el-table>
				</el-col>
				<el-col :span="2">
					<div style="margin:20px 0 ;">
						<el-button type="primary" icon="arrow-right" @click="toGrant" size="small" style="margin-left:25px;">授权</el-button>
					</div>
					<div>
						<el-button type="primary" icon="arrow-left" @click="cancelGrant" size="small" style="margin-left:25px;">移除</el-button>
					</div>

				</el-col>
				<el-col :span="9">
					<el-table :data="havePower" @select="selectHavePersonRow" @select-all="selectHavePersonAll" border style="width: 100%" height="390">
						<el-table-column type="selection" width="55">
						</el-table-column>
						<el-table-column prop="name" label="角色名称" width="180">
						</el-table-column>
						<el-table-column prop="code" label="角色标识">
						</el-table-column>
					</el-table>
				</el-col>
			</el-row>
			<div slot="footer" class="dialog-footer">
				<el-button @click="associationRoleDialog = false">取 消</el-button>
				<el-button type="primary" @click="saveConnectRolePermission">保 存</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {
		saveRolePermissions1,
		getHasConnectRole1,
		getHasNoConnectRole1,
		getRoleTypes,
		getPermissionTypes,
		getPermissionPageByType,
		savePermission,
		deletePermissionById,
		validatePermissionCode
	} from '../../api/api';
	
	import {loadPermissions} from '../../api/permission'

	export default {
		data() {
			var validateCodeUnique = (rule, value, callback) => {
				if(value) {
					let para = {
						id: this.addForm.id,
						code: value
					}
					console.info(value);
					validatePermissionCode(para).then((data) => {
						if(!data) {
							callback(new Error('权限代码必须唯一'));
						} else {
							callback();
						}
					});
				} else {
					callback();
				}
			};
			//TODO:
			return {
				tableHeight:'',
				type: '全部',
				page: 1,
				pageSize: 20,
				total: 0,
				tableData: [],
				addPermissionDialog: false,
				editPermissionDialog: false,
				associationRoleDialog: false,
				rules: {
					name: [
						{ required: true, message: '必填 ', trigger: 'change' }
					],
					code: [
						{ required: true, message: '必填 ', trigger: 'change' },
						{ min: 1, max: 20, message: '长度在 1到 20个字符', trigger: 'change' },
						{ validator: validateCodeUnique, trigger: 'change' }
					],
					type: [
						{ required: true, message: '必填 ', trigger: 'change' }
					],
					includeResourceRul: [
						{ required: true, message: '必填 ', trigger: 'change' }
					]
				},
				addForm: {
					id: '',
					name: '',
					code: '',
					type: '',
					describe: '',
					includeResourceRul: '',
					excludeResourceRul: '',
				},
				includeResourceRuls: [],
				excludeResourceRuls: [],
				includeResourceAll: [],
				excludeResourceAll: [],
				permissionTypeOptions: [],
				permissionTypeOptionsAll: [],
				roleForm: {
					permissionId: '',
					name: '',
				},
				powerKind: [],
				waitPower: [],
				havePower: [],
				waitSelect: [],
				haveSelect: [],
				associationLoading: false,
				addLoading: false,
				roleType:'',
			};
		},
		methods: {
			saveConnectRolePermission() { //保存
				this.associationLoading = true;
				var params = new Set();
				if(this.havePower && this.havePower.length > 0) {
					for(var power of this.havePower) {
						var obj = {
							permissionId: this.roleForm.permissionId,
							type: this.roleType,
							roleId: power.id
						};
						params.add(obj);
					}
				} else { //当为空的时候，就只删除，不用保存
					var obj = {
						permissionId: this.roleForm.permissionId,
						type: this.roleType
					};
					params.add(obj);
				}
				saveRolePermissions1(params).then((data) => {
					this.associationLoading = false;
					this.$message({
						type: 'success',
						message: '保存成功!'
					});
				});
			},
			selectWaitPersonAll(selection) {
				this.waitSelect = selection;
			},
			selectHavePersonAll(selection) {
				this.haveSelect = selection;
			},
			selectWaitPersonRow(selection, row) {
				this.waitSelect = selection;
			},
			selectHavePersonRow(selection, row) {
				this.haveSelect = selection;
			},
			toGrant() {
				if(!this.waitSelect || this.waitSelect.length == 0) {
					this.alertDialog('请选择需要授权的角色!', '提示');
				}
				for(var obj in this.waitSelect) {
					this.havePower.push(this.waitSelect[obj]);
				}
				for(var i = this.waitPower.length - 1; i >= 0; i--) {
					for(var j = 0; j < this.waitSelect.length; j++) {
						if(this.waitPower[i].id == this.waitSelect[j].id) {
							this.waitPower.splice(i, 1);
							break;
						}

					}
				}
				this.waitSelect = [];
			},
			cancelGrant() { //取消
				if(!this.haveSelect || this.haveSelect.length == 0) {
					this.alertDialog('请选择需要取消的人员!', '提示');
				}
				for(var obj in this.haveSelect) {
					this.waitPower.push(this.haveSelect[obj]);
				}
				//删除
				for(var i = this.havePower.length - 1; i >= 0; i--) {
					for(var j = 0; j < this.haveSelect.length; j++) {
						if(this.havePower[i].id == this.haveSelect[j].id) {
							this.havePower.splice(i, 1);
							break;
						}

					}
				}
				this.haveSelect = [];
			},
			selectRolesItems(type) {
				if(type == '全部') {
					type = '';
				};
				let para = {
					type: type,
					permissionId: this.roleForm.permissionId,
				};
				this.roleType = type;
				var waitPower = [];
				var havePower = [];
				getHasNoConnectRole1(para).then((data) => { //查询未授权的
					console.log(data);
					waitPower = data;
					//					this.waitPower = data;
					getHasConnectRole1(para).then((data) => { //查询已经授权的 //必须放在这里，否则有时候会错乱
						havePower = data;
						//this.havePower = data;
						if(havePower && havePower.length > 0) {
							for(var i = waitPower.length - 1; i >= 0; i--) {
								for(var j = 0; j < havePower.length; j++) {
									if(waitPower[i].id == havePower[j].id) {
										waitPower.splice(i, 1);
										break;
									}
								}
							};
						}
						this.waitPower = waitPower; //这样避免左边的列表先显示，然后不显示，导致有时候会错乱
						this.havePower = havePower;
					});
				});

			},
			openConnectRolePermission(index, row) { //打开关联权限
				//TODO:
				this.roleForm = {};
				this.roleForm.permissionId = row.id;
				this.roleForm.name = row.name;
				getRoleTypes().then((data) => {
					console.log(data);
					console.log(this.roleForm);
					if(!data || data.length == 0) {
						this.associationRoleDialog = true;
					}
					if(data.length > 1) {
						data.unshift('全部');
					}
					this.powerKind = data;
					//查询未授权的
					//查询已经授权的
					this.selectRolesItems(data[0]);
					this.associationRoleDialog = true;
				});
			},
			alertDialog(message, title) { //抽出公共的提示弹出框
				this.$alert(message, title, {
					confirmButtonText: '确定',
					type: 'info',
					callback: action => {}
				});
			},
			initAddForm() {
				this.addForm = {
					id: '',
					name: '',
					code: '',
					type: '',
					describe: '',
					includeResourceRul: '',
					excludeResourceRul: ''
				};
				this.includeResourceRuls = [];
				this.excludeResourceRuls = [];
			},
			handleSizeChange(val) { //2.分页设置
				this.pageSize = val;
				this.getPermissionList();
			},
			handleCurrentChange(val) { //2.分页设置
				this.page = val;
				this.getPermissionList();
			},
			getPermissionList() {
				let para = {
					type: this.type,
					page: this.page,
					size: this.pageSize
				};
				getPermissionPageByType(para).then((data) => {
					this.tableData = data.rows;
					this.total = data.total;
				});
			},
			handleNodeClick(data) {
				console.log(data);
			},
			addPermission() {
				this.initAddForm(); //初始化表格
				this.addPermissionDialog = true;
			},
			handleEdit(index, row) {
				this.addForm = row;
				if(row.includeResourceRul) {
					this.includeResourceRuls = row.includeResourceRul.split(",");
				}
				if(row.excludeResourceRul) {
					this.excludeResourceRuls = row.excludeResourceRul.split(",");
				}
				this.addPermissionDialog = true;
			},
			savePermission() {
				if(this.includeResourceRuls) {
					this.addForm.includeResourceRul = this.includeResourceRuls.join(",");
				}
				if(this.excludeResourceRuls) {
					this.addForm.excludeResourceRul = this.excludeResourceRuls.join(",");
				}
				this.$refs.addForm.validate((valid) => {
					if(valid) {
						this.addLoading = true;
						savePermission(this.addForm).then((data) => {
							this.addPermissionDialog = false;
							this.addLoading = false;
							this.$message({
								type: 'success',
								message: '保存成功!'
							});
							this.init();
						}).catch((err) => {
							this.addLoading = false;
							this.$message({
								type: 'error',
								message: err.response.data.message
							});
						});
					} else {

					}
				});
			},
			deleteRecord(index, row) {
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let para = {
						id: row.id,
					};
					deletePermissionById(para).then((data) => {
						this.$message({
							type: 'success',
							message: '删除成功!'
						});
						this.init();
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			changeResource(value) {
				if(value) {
					this.addForm.includeResourceRul = value.join(",");
				}
			},
			selectItems(type) {
				console.log('type:', type);
				if(type == '全部') {
					type = '';
				}
				this.type = type;
				let para = {
					type: type,
					page: this.page,
					size: this.pageSize
				};
				getPermissionPageByType(para).then((data) => {
					if(data && data.rows) {
						this.tableData = data.rows;
						this.total = data.total;
					}

				});
			},
			getPermissionTypeOptions() {
				getPermissionTypes().then((data) => {
					if(data && data.length > 0) {
						this.permissionTypeOptions = data;
					}
				});
			},
			init() {
				getPermissionTypes().then((data) => {
					if(data && data.length > 0) {
						if(data.length > 1) {
							data.unshift('全部');
						}
						this.permissionTypeOptionsAll = data;
						this.selectItems(data[0]);
					}
				});
				this.getPermissionTypeOptions(); //初始化下拉框的值
			},
			handleCommand(command, row){
				if (command == '0'){// 修改
					this.handleEdit(0, row);
				} else if (command == '1'){
					this.deleteRecord(0, row);
				}
			}
		},
		mounted() {
			this.init();
			this.includeResourceAll = loadPermissions;
      this.excludeResourceAll = loadPermissions;
		},
	    created(){
	    	var childMainHeight = $('.childMain').height();
			this.tableHeight = (childMainHeight - 90) + 'px';
	    }
	}
</script>

<style scoped>

</style>