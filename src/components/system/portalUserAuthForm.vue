<template>
	<div>
		<el-form>
			<el-row>
				<el-form-item :label="ywLabel" label-width="90px">
					<el-input v-model="ywName" readonly></el-input>
				</el-form-item>
			</el-row>
			
			<el-row class="rolehead">
				<el-col :span="11">
					<h5>待授权用户</h5></el-col>
				<el-col :span="2">
					<h5 align="center">操作</h5></el-col>
				<el-col :span="11">
					<h5>已授权用户</h5></el-col>
			</el-row>
			
			<el-row class="dialog" style="background:#f5f5f5;height:391px;">
				<el-col :span="11">
					<el-table ref="waitPerson" :data="waitPerson" @select="selectWaitPersonRow" @select-all="selectWaitPersonAll" border style="width: 100%" height="390">
						<el-table-column align="center" type="selection" width="55">
						</el-table-column>
						<el-table-column prop="C_LOGIN_NAME" align="center" label="登录名">
						</el-table-column>
						<el-table-column prop="C_NAME" align="center" label="中文名">
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
				<el-col :span="11">
					<el-table :data="havePerson" @select="selectHavePersonRow" @select-all="selectHavePersonAll" border style="width: 100%" height="391">
						<el-table-column align="center" type="selection" width="55">
						</el-table-column>
						<el-table-column prop="C_LOGIN_NAME" align="center" label="登录名">
						</el-table-column>
						<el-table-column prop="C_NAME" align="center" label="中文名">
						</el-table-column>
					</el-table>
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>

<script>
	import {
		getPortalHasNoAuthPerson, getPortalHasAuthPerson, savePortalAuthUser
	} from '../../api/apiPortal';
	
	export default {
		data(){
			return{
				waitPerson:[],
				havePerson:[],
				waitSelect: [],
				haveSelect: [],
				ywLabel:'',
				ywName:'',
				ywType:'',
				ywId:''
			}
		},
		methods:{
			loadData(id,ywName,type){
				
				var waitPerson = [];
				var havePerson = [];
				
				this.ywType = type;
				this.ywId = id;
				
				if (type == '0'){
					this.ywLabel = "站点名称";
					this.ywName = ywName;
					
				}else if (type == '2'){
					this.ywLabel = "widget名称";
					this.ywName = ywName;
				}
				
				let NoAuthPara = {
					ywId: id,
					grantType: '1',
					ywType: type
				};

				getPortalHasNoAuthPerson(NoAuthPara).then((data) => { //查询未授权的

					waitPerson = data;
					getPortalHasAuthPerson(NoAuthPara).then((data) => { //查询已经授权的 //必须放在这里，否则有时候会错乱
						
						//console.info(JSON.stringify(data));
						havePerson = data;
						
						if(havePerson && havePerson.length > 0) {
							for(var i = waitPerson.length - 1; i >= 0; i--) {
								for(var j = 0; j < havePerson.length; j++) {
									if(waitPerson[i].C_ID == havePerson[j].C_ID) {
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
			},toGrant(){//授权
				
				if(!this.waitSelect || this.waitSelect.length == 0) {
					this.alertDialog('请选择需要授权的人员!', '提示');
				}
				
				for(var obj in this.waitSelect) {
					this.havePerson.push(this.waitSelect[obj]);
				}
				
				for(var i = this.waitPerson.length - 1; i >= 0; i--) {
					for(var j = 0; j < this.waitSelect.length; j++) {
						if(this.waitPerson[i].C_ID == this.waitSelect[j].C_ID) {
							this.waitPerson.splice(i, 1);
							break;
						}
					}
				}
				
				this.waitSelect = [];
				
			},cancelGrant(){//移除
				
				if(!this.haveSelect || this.haveSelect.length == 0) {
					this.alertDialog('请选择需要取消的人员!', '提示');
				}
				
				for(var obj in this.haveSelect) {
					this.waitPerson.push(this.haveSelect[obj]);
				}
				
				//删除
				for(var i = this.havePerson.length - 1; i >= 0; i--) {
					for(var j = 0; j < this.haveSelect.length; j++) {
						if(this.havePerson[i].C_ID == this.haveSelect[j].C_ID) {
							this.havePerson.splice(i, 1);
							break;
						}
					}
				}
				
				this.haveSelect = [];
			},selectWaitPersonAll(selection) {
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
			},alertDialog(message, title) { //抽出公共的提示弹出框
				this.$alert(message, title, {
					confirmButtonText: '确定',
					type: 'info',
					callback: action => {}
				});
			},rowClick(row){
				this.$refs.waitPerson.toggleRowSelection(row);
			},saveData(){//保存实作
				
				var params = new Set();
				
				if(this.havePerson && this.havePerson.length > 0) {
					
					for(let person of this.havePerson) {
						let para = {
							ywId: this.ywId,
							ywType: this.ywType,
							grantType: '1',
							grantId: person.C_ID
						};
						params.add(para);
					}
				} else { //当为空的时候，就只删除，不用保存
					var obj = {
							ywId: this.ywId,
							ywType: this.ywType,
							grantType: '1'
					};
					params.add(obj);
				}
				
				savePortalAuthUser(params).then((data) => {
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