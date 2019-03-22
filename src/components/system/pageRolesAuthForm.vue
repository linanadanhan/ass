<template>
	<div>
		<el-form>
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
						<el-table-column prop="C_NAME" label="角色名称">
						</el-table-column>
						<el-table-column prop="C_CODE" label="角色标识">
						</el-table-column>
					</el-table>
				</el-col>
				<el-col :span="2">
					<div style="margin-top: 120px;">
						<el-button type="primary" @click="toGrant" icon="arrow-right" size="mini" style="margin-left:1px;">授权<i class="el-icon-arrow-right el-icon--right"></i></el-button>
					</div>
					
					<div style="margin-top: 60px;">
						<el-button type="primary" @click="cancelGrant" icon="el-icon-arrow-left" size="mini" style="margin-left:1px;">移除</el-button>
					</div>

				</el-col>
				<el-col :span="9">
					<el-table ref="haveTable" :data="haveRole" @select="selectHaveRoleRow" @select-all="selectHaveRoleAll" border style="width: 100%" height="390">
						<el-table-column type="selection" width="30">
						</el-table-column>
						<el-table-column prop="C_NAME" label="角色名称">
						</el-table-column>
						<el-table-column prop="C_CODE" label="角色标识">
						</el-table-column>
					</el-table>
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>

<script>
	import {getPortalHasNoAuthRole, getPortalHasAuthRole, savePortalAuthRole} from '../../api/apiPortal';
	import {getHasNoConnectRoleTypes} from '../../api/api';
	
	export default {
		data(){
			
			return{
				waitPerson:[],
				havePerson:[],
				roleTypes: [],
				waitRole: [],
				haveRole: [],
				waitRoles: [],
				haveRoles: [],
				roleType: '',
				ywLabel:'',
				ywName:'',
				ywType:'',
				ywId:''
			}
		},
		methods:{
			loadData(id,type){
				
				this.ywType = type;
				this.ywId = id;
				
			    //查询角色分类信息
				getHasNoConnectRoleTypes().then((data) => {
					if(!data || data.length == 0) {
						return false;
					}
					this.roleTypes = data;
					this.selectRoleItems(data[0]);
				});
			},selectRoleItems(roleCatalog) { //选中分类
				
				if(roleCatalog == '全部') {
					roleCatalog = '';
				};
				
				this.roleType = roleCatalog; //保存的时候用
				var waitRole = [];
				var haveRole = [];
				
				let NoAuthPara = {
					roleCatalog:roleCatalog,
					ywId: this.ywId,
					grantType: '0',
					ywType: this.ywType
				};
				
				getPortalHasNoAuthRole(NoAuthPara).then((data) => {
					waitRole = data;
					getPortalHasAuthRole(NoAuthPara).then((data) => { //必须放在这里，否则有时候会错乱
						haveRole = data;
						if(haveRole && haveRole.length > 0) {
							for(var i = waitRole.length - 1; i >= 0; i--) {
								for(var j = 0; j < haveRole.length; j++) {
									if(waitRole[i]) {
										if(waitRole[i].C_ID == haveRole[j].C_ID) {
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
			},selectWaitRoleAll(selection) {
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
						if(this.waitRole[i].C_ID == this.waitRoles[j].C_ID) {
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
						if(this.haveRole[i].C_ID == this.haveRoles[j].C_ID) {
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
			},saveData(){//保存
				
				var params = new Set();
				
				if(this.haveRole && this.haveRole.length > 0) {
					for(var role of this.haveRole) {
						var obj = {
							ywId: this.ywId,
							ywType: this.ywType,
							grantType: '0',
							grantId: role.C_ID
						};
						params.add(obj);
					}
				} else { //当为空的时候，就只删除，不用保存
					var obj = {
						ywId: this.ywId,
						ywType: this.ywType,
						grantType: '0',
						roleCatalog:this.roleType
					};
					params.add(obj);
				}
				
				savePortalAuthRole(params).then((data) => {
					this.$message({
						type: 'success',
						message: '保存成功!'
					});
				});		
			}
		},
		mounted() {
			
		},
		created(){
			
		}
	}
</script>

<style>
</style>