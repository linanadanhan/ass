<template>
	<div class="pannel" v-loading.fullscreen.lock="fullscreenLoading">
		<el-form ref="addAlleviationForm" :label-width="formLabelWidth" :label-position="labelPosition">
			<el-row :span="24" class="btn-group">
				<el-button :size="inputSize" @click="handleQuaCollapse">{{collapseText}}</el-button>
			</el-row>

			<el-collapse v-model="activeNames">
				<el-collapse-item name="1">
					<template slot="title">
						基本信息
					</template>
					<el-row>
					<el-form :model="addForm" ref="addForm" :rules="rules" label-width="120px">
						<el-form-item label="角色名称" prop="name">
							<el-input v-model="addForm.name"></el-input>
						</el-form-item>
						<el-form-item label="角色代码" prop="code">
							<el-input v-model="addForm.code"></el-input>
						</el-form-item>
						<el-form-item label="分类" prop="type">
							<el-select v-model="addForm.type" filterable allow-create placeholder="请选择">
								<el-option v-for="item in roleTypeOptions" :key="item" :label="item" :value="item">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="描述">
							<el-input v-model="addForm.describe" type="textarea" :rows="2"></el-input>
						</el-form-item>
					</el-form>
					</el-row>

					<el-row style="text-align: right;" >
						<el-button type="primary" @click="saveSubmitForm()">保存</el-button>
					</el-row>
				</el-collapse-item>

				<el-collapse-item name="2">
					<template slot="title">
						关联人员
					</template>
					<el-row>
						<el-row class="rolehead">
								<el-col :span="4">
									<h5>组织机构结构</h5></el-col>
								<el-col :span="9">
									<h5>待授权用户</h5></el-col>
								<el-col :span="2">
									<h5>操作</h5></el-col>
								<el-col :span="9">
									<h5>已授权用户</h5></el-col>
							</el-row>
							<el-row class="dialog" style="background:#f5f5f5;height:391px;">
								<el-col :span="4" style="height:391px;overflow:auto;">
                  <el-select v-model="value" placeholder="请选择维度" @change="(data)=>changeDimensionHandler(data)">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
									<div class="showChild">
										<el-checkbox v-model="showChild" @change="selectAreaTreeNodeList">显示子集</el-checkbox>
									</div>
									<el-tree :data="orgDataTree" ref="tree" :highlight-current=true @node-click="areaNodeClick" :default-expand-all=true :expand-on-click-node=false node-key="id" :props="defaultProps" style="background:#f5f5f5;">
									</el-tree>
								</el-col>
								<el-col :span="9">
									<el-table :data="waitPerson" @select="selectWaitPersonRow" @select-all="selectWaitPersonAll" border style="width: 100%" height="390">
										<el-table-column type="selection" width="55">
										</el-table-column>
										<el-table-column prop="name" align="center" label="用户">
										</el-table-column>
									</el-table>
								</el-col>
								<el-col :span="2">
									<div style="margin-top: 120px;">
										<el-button type="primary" @click="toGrant" icon="arrow-right" size="small" style="margin-left:7px;">授权<i class="el-icon-arrow-right el-icon--right"></i></el-button>
									</div>
									<div style="margin-top: 60px;">
										<el-button type="primary" @click="cancelGrant" icon="el-icon-arrow-left" size="small" style="margin-left:7px;">移除</el-button>
									</div>
								</el-col>
								<el-col :span="9">
									<el-table :data="havePerson" @select="selectHavePersonRow" @select-all="selectHavePersonAll" border style="width: 100%" height="390">
										<el-table-column type="selection" width="55">
										</el-table-column>
										<el-table-column prop="name" align="center" label="用户" width="180">
										</el-table-column>
										<el-table-column label="允许转授">
											<template slot-scope="scope">
												<el-switch v-model="havePerson[scope.$index].isTurnGrant"></el-switch>
											</template>
										</el-table-column>
									</el-table>
								</el-col>
							</el-row>
					</el-row>
					<el-row style="text-align: right;margin-top: 8px;" >
						<el-button type="primary" @click="saveConnectPersonnel()">保存</el-button>
					</el-row>
				</el-collapse-item>

				<el-collapse-item name="3" class="upload-bottom">
					<template slot="title">
						关联权限
					</template>
					<el-row>
					<el-row class="rolehead">
								<el-col :span="4">
									<h5>权限组浏览</h5></el-col>
								<el-col :span="9">
									<h5>待选权限项</h5></el-col>
								<el-col :span="2">
									<h5>操作</h5></el-col>
								<el-col :span="9">
									<h5>已选权限项</h5></el-col>
							</el-row>
							<el-row style="background:#f5f5f5;height:391px">
								<el-col :span="4" style="height:391px;overflow:auto;">
									<el-menu default-active="1" @select="selectPermissionItems" class="el-menu-vertical-demo" background-color="#f5f5f5" text-color="#000" active-text-color="#409EFF">
										<el-menu-item v-for="(item,index) in permissionTypeOptions" :key="index" :index="item"> {{ item }}</el-menu-item>
									</el-menu>
								</el-col>
								<el-col :span="9">
									<el-table :data="waitPower" @select="selectWaitPowerRow" @select-all="selectWaitPowerAll" border style="width: 100%" height="390">
										<el-table-column type="selection" width="30">
										</el-table-column>
										<el-table-column prop="id" label="权限项id" width="80">
										</el-table-column>
										<el-table-column prop="name" label="权限项名称" width="180">
										</el-table-column>
										<el-table-column prop="code" label="权限项标识">
										</el-table-column>
									</el-table>
								</el-col>
								<el-col :span="2">
									<div style="margin-top: 120px;">
										<el-button type="primary" @click="toPowerGrant" icon="arrow-right" size="small" style="margin-left:7px;">授权<i class="el-icon-arrow-right el-icon--right"></i>
										</el-button>
									</div>
									<div style="margin-top: 60px;">
										<el-button type="primary" @click="cancelPowerGrant" icon="el-icon-arrow-left" size="small" style="margin-left:7px;">移除</el-button>
									</div>
								</el-col>
								<el-col :span="9">
									<el-table :data="havePower" @select="selectHavePowerRow" @select-all="selectHavePowerAll" border style="width: 100%" height="390">
										<el-table-column type="selection" width="30">
										</el-table-column>
										<el-table-column prop="id" label="权限项id" width="80">
										</el-table-column>
										<el-table-column prop="name" label="权限项名称" width="180">
										</el-table-column>
										<el-table-column prop="code" label="权限项标识">
										</el-table-column>
									</el-table>
								</el-col>
							</el-row>
					</el-row>
					<el-row style="text-align: right;margin-bottom: 30px;" >
						<el-button type="primary" @click="saveConnectRolePermission()">保存</el-button>
					</el-row>
				</el-collapse-item>

				<el-collapse-item name="4" class="upload-bottom">
					<template slot="title">
						关联站点
					</template>
					<el-row>
						<siteAuthForm ref="siteAuthInfo"></siteAuthForm>
					</el-row>
					<el-row style="text-align: right;margin-bottom: 30px;" >
						<el-button type="primary" @click="saveSiteAuth()">保存</el-button>
					</el-row>
				</el-collapse-item>

				<el-collapse-item name="5">
					<template slot="title">
						关联页面
					</template>
					<el-row>
						<sitePageAuthForm ref="sitePageAuthInfo"></sitePageAuthForm>
					</el-row>
					<el-row style="text-align: right;margin-top: 8px;" >
						<el-button type="primary" @click="saveSitePageAuth()">保存</el-button>
					</el-row>
				</el-collapse-item>
			</el-collapse>
		</el-form>
	</div>
</template>

<script>
	import {
		getRoleTypes,
		getPageByAreaCode,
		saveRole,
		validateRoleCode,
		deleteRoleById,
		updateRoleStatus,
		getTreeData,
		getTreeDataByConnect,
		personnelList,
		getHasConnectPerson,
		getHasNoConnectPerson,
		saveConnectRolePersonnel,
		getPermissionTypes,
		getHasNoConnectPermission,
		getPerssionTypesByConnect,
		getHasConnectPermission,
		saveRolePermissions,
    getDicItemListByDicKey,
    getOrgTreeByDimension
	} from '../../api/api';

	import siteAuthForm from '@/components/system/siteAuthForm.vue'
	import sitePageAuthForm from '@/components/system/sitePageAuthForm.vue'

	export default {
		components: {
			siteAuthForm,
			sitePageAuthForm
		},
		data() {
			var validateCodeUnique = (rule, value, callback) => {
				if(value) {
					let para = {
						id: this.addForm.id,
						code: value
					}
					validateRoleCode(para).then((data) => {
						if(!data) {
							callback(new Error('角色代码必须唯一'));
						} else {
							callback();
						}
					});
				} else {
					callback();
				}
			};
			return {
				id: '',
				collapseText: '全部收起',
				collapse: true,
				activeNames: ['1', '2', '3', '4', '5'],
				inputSize: 'small',
				formLabelWidth: '150px',
				labelPosition: 'right',
				fullscreenLoading: false,
				addForm: {
					name: '',
					code: '',
					type: '',
					describe: '',
					status: true
				},
				rules: {
					name: [{
							required: true,
							message: '必填 ',
							trigger: 'change'
						},
						{
							min: 1,
							max: 30,
							message: '长度在 1到 30个字符',
							trigger: 'change'
						}
					],
					type: {
						required: true,
						message: '必填 ',
						trigger: 'change'
					},
					code: [{
							required: true,
							message: '必填 ',
							trigger: 'change'
						},
						{
							min: 1,
							max: 20,
							message: '长度在 1到 20个字符',
							trigger: 'change'
						},
						{
							validator: validateCodeUnique,
							trigger: 'change'
						}
					]
				},
				roleTypeOptions: [],
				roleTypeOptionsAll: [],
				roleType: '',
				showChild: false,
				roleForm: {
					roleId: '',
					name: '',
				},
				waitPerson: [],
				havePerson: [],
				waitSelect: [],
				haveSelect: [],
				waitPower: [],
				havePower: [],
				waitPowers: [],
				havePowers: [],
				orgDataTree: [],
				currentNode: {},
				permissionTypeOptions: [],
				defaultProps: {
					children: 'children',
					label: 'text'
				},
				permissionType: '',
        options:[],
        dimension: '',
        value: '',
			}
		},
		methods: {
			loadData(row, roleType){

				this.initTypes();

				//获取人员基本信息
				this.addForm = row;
				this.roleType = roleType;

				//初始化关联人员基本信息
				this.roleForm = {};
				this.roleForm.roleId = row.id;
				this.roleForm.name = row.name;

				//初始化关联权限
				getPerssionTypesByConnect().then((data) => {
					if(!data || data.length == 0) {
						return false;
					}
					if(data.length > 1) {
						data.unshift('全部');
					}
					this.permissionTypeOptions = data;
					//查询未授权的
					//查询已经授权的
					this.selectPermissionItems(data[0]);
				});

				//初始化关联角色信息
				this.$refs.siteAuthInfo.loadData(row.name,row.id,'0');

				//初始化关联页面信息
				this.$refs.sitePageAuthInfo.loadData(row.name,row.id,'0');
			},
			areaNodeClick(data) {
				this.currentNode = data;
				this.selectAreaTreeNodeList(this.currentNode.attributes.code);
			},
			selectAreaTreeNodeList() {
				var waitPerson = [];
				var havePerson = [];
				let NoConnectPara = {
					roleId: this.roleForm.roleId,
					orgCode: this.currentNode.attributes.code,
					isCascade: this.showChild
				};
				getHasNoConnectPerson(NoConnectPara).then((data) => { //查询未授权的
					waitPerson = data;
					getHasConnectPerson(NoConnectPara).then((data) => { //查询已经授权的 //必须放在这里，否则有时候会错乱
						console.info(JSON.stringify(data));
						havePerson = data;
						if(havePerson && havePerson.length > 0) {
							for(var i = waitPerson.length - 1; i >= 0; i--) {
								for(var j = 0; j < havePerson.length; j++) {
									if(waitPerson[i].id == havePerson[j].id) {
										waitPerson.splice(i, 1);
										break;
									}
								}
							};
						}
						this.waitPerson = waitPerson; //这样避免左边的列表先显示，然后不显示，导致有时候会错乱
						this.havePerson = havePerson;
					});
				});
			},
			handleQuaCollapse() {
				this.collapse = !this.collapse;
				if(this.collapse) {
					this.collapseText = "全部收起";
					this.activeNames = ['1', '2', '3', '4', '5'];
				} else {
					this.collapseText = "全部展开";
					this.activeNames = [];
				}
			},
			saveSubmitForm(){// 角色基本信息保存
				this.$refs.addForm.validate((valid) => {
					if(valid) {
						saveRole(this.addForm).then((data) => {
							this.$message({
								type: 'success',
								message: '保存成功!'
							});
						});
					} else {
						//this.$message('请确认表单是否填写完整！');
					}
				});
			},
			alertDialog(message, title) { //抽出公共的提示弹出框
				this.$alert(message, title, {
					confirmButtonText: '确定',
					type: 'info',
					callback: action => {}
				});
			},
			saveSiteAuth()	{// 关联站点保存
				this.$refs.siteAuthInfo.saveSiteAuth();
			},
			saveSitePageAuth() {// 关联页面保存
				this.$refs.sitePageAuthInfo.saveSitePageAuth();
			},
			initTypes() {
				getRoleTypes().then((data) => {
					if(data && data.length > 0) {
						if(data.length > 1) {
							data.unshift('全部');
						}
						this.roleTypeOptionsAll = data;
					}
				});
				this.getRoleTypeOptions(); //初始化下拉框的值
			},
			getRoleTypeOptions() {
				getRoleTypes().then((data) => {
					console.info(data);
					if(data && data.length > 0) {
						this.roleTypeOptions = data;
					}
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
					this.alertDialog('请选择需要授权的人员!', '提示');
				}
				for(var obj in this.waitSelect) {
					this.havePerson.push(this.waitSelect[obj]);
				}
				for(var i = this.waitPerson.length - 1; i >= 0; i--) {
					for(var j = 0; j < this.waitSelect.length; j++) {
						if(this.waitPerson[i].id == this.waitSelect[j].id) {
							this.waitPerson.splice(i, 1);
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
					this.waitPerson.push(this.haveSelect[obj]);
				}
				//删除
				for(var i = this.havePerson.length - 1; i >= 0; i--) {
					for(var j = 0; j < this.haveSelect.length; j++) {
						if(this.havePerson[i].id == this.haveSelect[j].id) {
							this.havePerson.splice(i, 1);
							break;
						}
					}
				}
				this.haveSelect = [];
			},
			saveConnectPersonnel(){
				var params = new Set();
				if(this.havePerson && this.havePerson.length > 0) {
					for(let person of this.havePerson) {
						let para = {
							roleId: this.roleForm.roleId,
							personnelId: person.id,
							isTurnGrant: person.isTurnGrant,
							orgCode: this.currentNode.attributes.code,
							isCascade: this.showChild
						};
						params.add(para);
					}
				} else { //当为空的时候，就只删除，不用保存
					var obj = {
						roleId: this.roleForm.roleId,
						orgCode: this.currentNode.attributes.code,
						isCascade: this.showChild
					};
					params.add(obj);
				}
				saveConnectRolePersonnel(params).then((data) => {
					this.$message({
						type: 'success',
						message: '保存成功!'
					});
				});
			},
			selectPermissionItems(type) {
				if(type == '全部') {
					type = '';
				};
				let para = {
					type: type,
					roleId: this.roleForm.roleId,
				};
				this.permissionType = type;
				var waitPower = [];
				var havePower = [];
				getHasNoConnectPermission(para).then((data) => { //查询未授权的
					waitPower = data;
					getHasConnectPermission(para).then((data) => { //查询已经授权的 //必须放在这里，否则有时候会错乱
						havePower = data;
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
			selectWaitPowerAll(selection) {
				this.waitPowers = selection;
			},
			selectHavePowerAll(selection) {
				this.havePowers = selection;
			},
			selectWaitPowerRow(selection, row) {
				this.waitPowers = selection;
			},
			selectHavePowerRow(selection, row) {
				this.havePowers = selection;
			},
			toPowerGrant() {
				if(!this.waitPowers || this.waitPowers.length == 0) {
					this.alertDialog('请选择需要关联的权限!', '提示');
				}
				for(var obj in this.waitPowers) {
					this.havePower.push(this.waitPowers[obj]);
				}
				for(var i = this.waitPower.length - 1; i >= 0; i--) {
					for(var j = 0; j < this.waitPowers.length; j++) {
						if(this.waitPower[i].id == this.waitPowers[j].id) {
							this.waitPower.splice(i, 1);
							break;
						}
					}
				}
				this.waitPowers = [];
			},
			cancelPowerGrant() { //取消
				if(!this.havePowers || this.havePowers.length == 0) {
					this.alertDialog('请选择需要取消的权限!', '提示');
				}
				for(var obj in this.havePowers) {
					this.waitPower.push(this.havePowers[obj]);
				}
				//删除
				for(var i = this.havePower.length - 1; i >= 0; i--) {
					for(var j = 0; j < this.havePowers.length; j++) {
						if(this.havePower[i].id == this.havePowers[j].id) {
							this.havePower.splice(i, 1);
							break;
						}
					}
				}
				this.havePowers = [];
			},
			saveConnectRolePermission(){
				var params = new Set();
				if(this.havePower && this.havePower.length > 0) {
					for(var power of this.havePower) {
						var obj = {
							roleId: this.roleForm.roleId,
							type: this.permissionType,
							permissionId: power.id
						};
						params.add(obj);
					}
				} else { //当为空的时候，就只删除，不用保存
					var obj = {
						roleId: this.roleForm.roleId,
						type: this.permissionType
					};
					params.add(obj);
				}
				saveRolePermissions(params).then((data) => {
					this.$message({
						type: 'success',
						message: '保存成功!'
					});
				});
			},
      /**
       * 查询组织维度
       */
      getOrgDimension() {
        let param = {dicKey: 'org_dimension'};
        getDicItemListByDicKey(param).then((data) => {
          for (var value of data) {
            var param = {
              value: value.value,
              label: value.text
            };
            this.options.push(param);
          }
        });
      },
      /**
       * 选择维度
       */
      changeDimensionHandler(data) {
        this.$refs.tree.setCheckedKeys([]);
        this.dimension = data;
        this.getTree(data);
      },
      getTree(data) {//得到机构tree
        let para = {dimension: data};
        getOrgTreeByDimension(para).then((data) => {
          this.orgDataTree = data;
        });
      },
		},
		created() {

		},
		mounted() {
      this.getOrgDimension();
		}
	}
</script>

<style scoped>
	.btn-group {
		margin-bottom: 10px;
	}
	.remove-bottom .el-form-item {
		margin-bottom: 5px !important;
	}

	.el-form-item {
		margin-bottom: 15px !important;
	}

	.table-data {
		width: 100% !important;
	}
</style>

<style>
	.upload-bottom .el-collapse-item__content {
		padding: 15px 15px 0 !important;
	}
</style>
