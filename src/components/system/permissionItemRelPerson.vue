<template>
	<div>
		<el-form :model="form" label-width="90px">
			<el-form-item label="权限项名称">
				<el-input v-model="form.C_NAME" readonly></el-input>
			</el-form-item>
		</el-form>
		<el-row>
			<el-row class="rolehead">
				<el-col :span="10">
					<h5>待授权用户</h5></el-col>
				<el-col :span="4">
					<h5>操作</h5></el-col>
				<el-col :span="10">
					<h5>已授权用户</h5></el-col>
			</el-row>
			<el-row class="dialog" style="background:#f5f5f5;height:391px;">
				<el-col :span="10">
					<el-table :data="waitPerson" @select="selectWaitPersonRow" @select-all="selectWaitPersonAll" border style="width: 100%" height="390">
						<el-table-column type="selection" width="55">
						</el-table-column>
						<el-table-column prop="C_NAME" align="center" label="用户">
						</el-table-column>
					</el-table>
				</el-col>
				<el-col :span="4">
					<div style="margin-top: 120px;">
						<el-button type="primary" @click="toGrant" icon="arrow-right" size="mini" style="margin-left:40px;">授权<i class="el-icon-arrow-right el-icon--right"></i></el-button>
					</div>
					<div style="margin-top: 60px;">
						<el-button type="primary" @click="cancelGrant" icon="el-icon-arrow-left" size="mini" style="margin-left:40px;">移除</el-button>
					</div>
				</el-col>
				<el-col :span="10">
					<el-table :data="havePerson" @select="selectHavePersonRow" @select-all="selectHavePersonAll" border style="width: 100%" height="390">
						<el-table-column type="selection" width="55">
						</el-table-column>
						<el-table-column prop="C_NAME" align="center" label="用户">
						</el-table-column>
					</el-table>
				</el-col>
			</el-row>
		</el-row>
	</div>
</template>

<script>
	import {
		getDicItemListByDicKey,
		getOrgTreeByDimension,
		getPermissionHasNoConnectPerson,
		getPermissionHasConnectPerson,
		savePermissionRelPerson

	} from '../../api/api';

	export default {
		data() {
			return {
				id: '',
				waitPerson: [],
				havePerson: [],
				waitSelect: [],
				haveSelect: [],
				form: {
					C_NAME: ''
				},
			}
		},
		methods: {
			loadData(itemName, id) {
				this.id = id
				this.form.C_NAME = itemName
				this.value = ''
				this.dimension = ''
				this.orgDataTree = []
				this.waitPerson = []
				this.havePerson = []
				this.waitSelect = []
				this.haveSelect = []

				var waitPerson = [];
				var havePerson = [];
				let NoConnectPara = {
					itemId: this.id
				};
				getPermissionHasNoConnectPerson(NoConnectPara).then((data) => { //查询未授权的
					waitPerson = data || [];
					getPermissionHasConnectPerson(NoConnectPara).then((data) => { //查询已经授权的 //必须放在这里，否则有时候会错乱
						havePerson = data || [];
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

			},
			alertDialog(message, title) { //抽出公共的提示弹出框
				this.$alert(message, title, {
					confirmButtonText: '确定',
					type: 'info',
					callback: action => {}
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
						if(this.waitPerson[i].C_ID == this.waitSelect[j].C_ID) {
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
						if(this.havePerson[i].C_ID == this.haveSelect[j].C_ID) {
							this.havePerson.splice(i, 1);
							break;
						}
					}
				}
				this.haveSelect = [];
			},
			saveData() {
				let selPerson = []
				if(this.havePerson && this.havePerson.length > 0) {
					for(let role of this.havePerson) {
						selPerson.push(role.C_ID)
					}
				}
				let param = {
					itemId: this.id,
					userIds: selPerson.join(',')
				}
				savePermissionRelPerson(param).then((data) => {
					this.$message({
						message: '保存成功！',
						type: 'success'
					});
					this.$emit('closeAndFresh');
				}).catch((err) => {
					this.$message({
						type: 'error',
						message: '保存失败!'
					});
				});
			}
		},
		mounted() {},
		created() {}
	}
</script>

<style>

</style>