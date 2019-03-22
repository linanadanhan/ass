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
						<el-form :model="addForm" :rules="rules" ref="addForm" label-width="120px">
							<el-row>
								<el-col :span="12">
									<el-form-item label="所属组织机构">
										<el-input v-model="orgName" readonly></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="中文名" prop="name">
										<el-input v-model="addForm.name"></el-input>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="登录名" prop="loginName">
										<div v-if="!addForm.id">
											<el-input v-model="addForm.loginName"></el-input>
										</div>
										<div v-if="addForm.id">
											<el-input v-model="addForm.loginName" readonly></el-input>
										</div>
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="手机号" prop="mobilePhone">
										<el-input v-model="addForm.mobilePhone"></el-input>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="邮箱">
										<el-input v-model="addForm.email"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="排序号">
										<template>
											<el-input-number v-model="addForm.sortNo" :min="1" :max="10"></el-input-number>
										</template>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="密码策略">
										<el-select v-model="addForm.passwordPolicy">
											<el-option v-for="item in passwordPolicys" :key="item.value" :label="item.label" :value="item.value">
											</el-option>
										</el-select>
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="性别" prop="sex">
										<el-select v-model="addForm.sex" filterable size="small">
											<el-option label="女" value="0"></el-option>
											<el-option label="男" value="1"></el-option>
										</el-select>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="用户头像">
										<div class="up-file">
											<el-upload class="avatar-uploader" :action="fileUploadUrl" :show-file-list="false" :on-success="(res,file) => handleAvatarSuccess(res, file)" :before-upload="beforeAvatarUpload">
												<div v-if="!addForm.id">
													<img v-if="addForm.headImg" :src="addForm.headImgRef" class="avatar">
													<i v-else class="el-icon-plus avatar-uploader-icon">用户头像</i>
												</div>
												<div v-if="addForm.id">
													<img v-if="addForm.headImg" :src="addForm.headImgRef" class="avatar">
													<img v-else src="../../../static/img/noImg.jpg" class="el-icon-plus avatar-uploader-icon" />
												</div>
											</el-upload>
										</div>
									</el-form-item>
								</el-col>
								<el-col :span="12">
                  <el-form-item label="职位">
                    <el-select v-model="postionIds" multiple placeholder="请选择职位">
                      <el-option v-for="item in postionOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
								</el-col>
							</el-row>
						</el-form>
					</el-row>
					<el-row style="text-align: right;" >
						<el-button type="primary" @click="saveSubmitForm()">保存</el-button>
					</el-row>
				</el-collapse-item>

				<el-collapse-item name="2">
					<template slot="title">
						关联角色
					</template>
					<el-row>
						<el-row class="rolehead">
							<el-col :span="4">
								<h5>角色分类</h5></el-col>
							<el-col :span="9">
								<h5>待选角色</h5></el-col>
							<el-col :span="2">
								<h5 align="center">操作</h5></el-col>
							<el-col :span="9">
								<h5>已选角色</h5></el-col>
						</el-row>
						<el-row style="background:#f5f5f5;height:391px">
							<el-col :span="4" style="height:391px;overflow:auto;">
								<el-menu default-active="1" @select="selectRoleItems" class="el-menu-vertical-demo" background-color="#f5f5f5" text-color="#000" active-text-color="#409EFF">
									<el-menu-item v-for="item in roleTypes" :key="item" :index="item">{{item}}</el-menu-item>
								</el-menu>
							</el-col>
							<el-col :span="9">
								<el-table ref="waitTable" :data="waitRole" @select="selectWaitRoleRow" @select-all="selectWaitRoleAll" border style="width: 100%" height="390">
									<el-table-column type="selection" width="30">
									</el-table-column>
									<el-table-column prop="name" label="角色名称" width="180">
									</el-table-column>
									<el-table-column prop="code" label="角色标识">
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
								<el-table ref="haveTable" :data="haveRole" @select="selectHaveRoleRow" @select-all="selectHaveRoleAll" border style="width: 100%" height="390">
									<el-table-column type="selection" width="30">
									</el-table-column>
									<el-table-column prop="name" label="角色名称" width="180">
									</el-table-column>
									<el-table-column prop="code" label="角色标识">
									</el-table-column>
									<el-table-column label="允许转授">
										<template slot-scope="scope">
											<el-switch v-model="haveRole[scope.$index].isTurnGrant"></el-switch>
										</template>
									</el-table-column>
								</el-table>
							</el-col>
						</el-row>
					</el-row>
					<el-row style="text-align: right;margin-top: 8px;" >
						<el-button type="primary" @click="saveConnectRole()">保存</el-button>
					</el-row>
				</el-collapse-item>

				<el-collapse-item name="3" class="upload-bottom">
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

				<el-collapse-item name="4">
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
	import { personnelPageList, personnelList, getPersonnelById, validateLoginName, validatePhone, savePersonnel, delPersonnelById, updatePersonnelStatus, importPersonnel, movePersonnel, getOrgInfoByUserId } from '../../api/api';
	import { getTreeData, saveRolePersonnel, getHasNoConnectRoleTypes, getHasNoConnectRole, getHasConnectRole, getIdentityInfoByPersonAndOrg, getPositionListByOrgId, personConnectPosition } from '../../api/api';
	
	import {gbs} from '../../config'
	
	import siteAuthForm from '@/components/system/siteAuthForm.vue'
	import sitePageAuthForm from '@/components/system/sitePageAuthForm.vue'

	export default {
		components: {
			siteAuthForm,
			sitePageAuthForm
		},
		data() {
			var validatePhoneUnique = (rule, value, callback) => {
				if(value) {
					let para = {
						id: this.addForm.id,
						phone: value
					}
					validatePhone(para).then((data) => {
						if(!data) {
							callback(new Error('手机号必须唯一，此手机号已存在'));
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
				orgId: '',
				userName: '',
				orgName: '',
				collapseText: '全部收起',
				collapse: true,
				activeNames: ['1', '2', '3', '4'],
				inputSize: 'small',
				formLabelWidth: '150px',
				labelPosition: 'right',
				fullscreenLoading: false,
				addForm: {
					id: '',
					name: '',
					loginName: '',
					mobilePhone: '',
					email: '',
					sortNo: 1,
					passwordPolicy: 1,
					status: true,
					isMobileAccess: true,
					orgCode: '',
					headImg: '',
					sex: '1',
					headImgRef: '',
					orgId: ''
				},
				fileUploadUrl: '',
				passwordPolicys: [{
					value: 1,
					label: '默认初始密码'
				}, {
					value: 2,
					label: '使用随机密码并发短信至手机'
				}],
				rules: {
					name: [{
							required: true,
							message: '必填 ',
							trigger: 'change'
						},
						{
							min: 1,
							max: 30,
							message: '长度在 1到 50个字符',
							trigger: 'change'
						}
					],
					loginName: [{
							required: true,
							message: '必填 ',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 20,
							message: '长度在 1到 20个字符',
							trigger: 'change'
						}
					],
					sort: '',
					mobilePhone: {
						validator: validatePhoneUnique,
						trigger: 'change'
					}
				},
				roleTypes: [],
				waitRole: [],
				haveRole: [],
				waitRoles: [],
				haveRoles: [],
				roleType: '',
        postionOptions:[],
        postionIds:[]
			}
		},
		methods: {
			loadData(id, userName, orgId, orgName , dimension, postionOptions){

				this.id = String(id);
				this.userName = userName;
				this.orgName = orgName;
				this.orgId = orgId;

				//获取人员基本信息
				getPersonnelById({
					id: id
				}).then((data) => { //这里必须要查，因为row的值不能保证全部
					this.addForm = data;
					this.addForm.headImgRef = gbs.fileServiceUrl + '/file/download/' + data.headImg;
				});
        console.info("==================================="+dimension)
				//获取人员所属机构信息
				getOrgInfoByUserId({
					userId: id,
          dimension: dimension
				}).then((data) => { //这里必须要查，因为row的值不能保证全部
					if (data){
						this.orgId = data.C_ID;
						this.orgName = data.C_NAME;
					}
				});

				//初始化关联角色基本信息
				getHasNoConnectRoleTypes().then((data) => {
					if(!data || data.length == 0) {
						return false;
					}
					console.info(data)
					this.roleTypes = data;
					this.selectRoleItems(data[0]);
				});

				//初始化关联站点信息
				this.$refs.siteAuthInfo.loadData(this.userName,Number(this.id),'1');

				//初始化关联页面信息
				this.$refs.sitePageAuthInfo.loadData(this.userName,Number(this.id),'1');

        //更改可选职位的值
        this.postionOptions = [];
        getPositionListByOrgId({orgId: orgId}).then((data) => {
          for (var value of data) {
            var param = {
              value: value.id,
              label: value.postName
            };
            this.postionOptions.push(param);
          }
        });
				//初始化职位信息
        let param = {
          personalId: id,
          orgId: orgId,
        };
        getIdentityInfoByPersonAndOrg(param).then((data) => {
          this.postionIds = data;
        })
			},
			handleQuaCollapse() {
				this.collapse = !this.collapse;
				if(this.collapse) {
					this.collapseText = "全部收起";
					this.activeNames = ['1', '2', '3', '4'];
				} else {
					this.collapseText = "全部展开";
					this.activeNames = [];
				}
			},
			beforeAvatarUpload(file) {
				var allow = (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/bmp')
				const isLt2M = file.size / 1024 / 1024 / 2 < 2;
				if(!allow) {
					this.$message.error('上传头像图片只能是 JPG格式或PNG格式或BMP格式!');
				}
				if(!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return allow && isLt2M;
			},
			handleAvatarSuccess(res, file) {
				this.addForm.headImg = res.referenceId;
				this.addForm.headImgRef = URL.createObjectURL(file.raw);
			},
			saveSubmitForm(){// 人员基本信息保存
				this.addForm.orgId = this.orgId;
				this.$refs.addForm.validate((valid) => {
					if(valid) {
						savePersonnel(this.addForm).then((data) => {
							this.$message({
								message: '保存成功',
								type: 'success'
							});
						}).catch((err) => {
							this.$message({
								type: 'error',
								message: err.response.data.message
							});
						});
            if (Object.keys(this.postionIds).length > 0) {
              var ids = '';
              for (var val of this.postionIds) {
                ids += val + ',';
              }
              var positionIds = ids.substr(0, ids.length - 1);
              let para = {
                personId: this.addForm.id,
                positionIds: positionIds,
              };
              personConnectPosition(para).then((data) => {
              }).catch((err) => {
                this.$message({
                  type: 'error',
                  message: err.response.data.message
                });
              });
            }
					} else {
						this.$message('请确认表单是否填写完整！');
					}
				});
			},
			selectRoleItems(type) { //选中分类
				if(type == '全部') {
					type = '';
				};
				this.roleType = type; //保存的时候用
				var waitRole = [];
				var haveRole = [];
				getHasNoConnectRole({
					type: type
				}).then((data) => {
					waitRole = data;
					getHasConnectRole({
						type: type,
						personnelId: Number(this.id)
					}).then((data) => { //必须放在这里，否则有时候会错乱
						haveRole = data;
						if(haveRole && haveRole.length > 0) {
							for(var i = waitRole.length - 1; i >= 0; i--) {
								for(var j = 0; j < haveRole.length; j++) {
									if(waitRole[i]) {
										if(waitRole[i].id == haveRole[j].id) {
											waitRole.splice(i, 1);
										}
									}
								}
							};
						}
						this.waitRole = waitRole; //这样避免左边的列表先显示，然后不显示，导致有时候会错乱
						this.haveRole = haveRole;
					});
				});
			},
			selectWaitRoleAll(selection) {
				this.waitRoles = selection;
			},
			selectHaveRoleAll(selection) {
				this.haveRoles = selection;
			},
			selectWaitRoleRow(selection, row) {
				this.waitRoles = selection;
			},
			selectHaveRoleRow(selection, row) {
				this.haveRoles = selection
			},
			toGrant() {
				if(!this.waitRoles || this.waitRoles.length == 0) {
					this.alertDialog('请选择需要授权的角色!', '提示');
				}
				for(var obj in this.waitRoles) {
					console.info(this.waitRoles[obj]);
					this.haveRole.push(this.waitRoles[obj]);
				}
				//删除
				for(var i = this.waitRole.length - 1; i >= 0; i--) {
					for(var j = 0; j < this.waitRoles.length; j++) {
						if(this.waitRole[i].id == this.waitRoles[j].id) {
							this.waitRole.splice(i, 1);
							break;
						}
					}
				}
				this.waitRoles = [];
			},
			cancelGrant() { //取消
				if(!this.haveRoles || this.haveRoles.length == 0) {
					this.alertDialog('请选择需要取消的角色!', '提示');
				}
				for(var obj in this.haveRoles) {
					console.info(obj);
					this.waitRole.push(this.haveRoles[obj]);
				}
				//删除
				for(var i = this.haveRole.length - 1; i >= 0; i--) {
					for(var j = 0; j < this.haveRoles.length; j++) {
						if(this.haveRole[i].id == this.haveRoles[j].id) {
							this.haveRole.splice(i, 1);
							break;
						}
					}
				}
				this.haveRoles = [];
			},
			alertDialog(message, title) { //抽出公共的提示弹出框
				this.$alert(message, title, {
					confirmButtonText: '确定',
					type: 'info',
					callback: action => {}
				});
			},
			saveConnectRole(){// 关联角色保存
				var params = new Set();
				if(this.haveRole && this.haveRole.length > 0) {
					for(var role of this.haveRole) {
						var obj = {
							personnelId: Number(this.id),
							roleId: role.id,
							type: this.roleType,
							isTurnGrant: role.isTurnGrant
						};
						params.add(obj);
					}
				} else { //当为空的时候，就只删除，不用保存
					var obj = {
						personnelId: Number(this.id),
						type: this.roleType
					};
					params.add(obj);
				}
				saveRolePersonnel(params).then((data) => {
					this.$message({
						type: 'success',
						message: '保存成功!'
					});
				});
			},
			saveSiteAuth()	{// 关联站点保存
				this.$refs.siteAuthInfo.saveSiteAuth();
			},
			saveSitePageAuth() {// 关联页面保存
				this.$refs.sitePageAuthInfo.saveSitePageAuth();
			}
		},
		created() {

		},
		mounted() {
			this.fileUploadUrl = gbs.fileServiceUrl + '/file/uploadFile';
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
