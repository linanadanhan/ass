<template>
	<div>
		<el-form :model="addForm" ref="addForm" :rules="rules" label-width="100px">
			<el-form-item label="权限组名称" prop="C_NAME">
				<el-input v-model="addForm.C_NAME" clearable></el-input>
			</el-form-item>
			<el-form-item label="权限组描述" prop="C_REMARK">
				<el-input type="textarea" :rows="3" v-model="addForm.C_REMARK"></el-input>
			</el-form-item>

			<el-row class="rolehead">
				<el-col :span="10">
					<h5>待选权限项</h5></el-col>
				<el-col :span="3">
					<h5 align="center">操作</h5></el-col>
				<el-col :span="11">
					<h5>已选权限项</h5></el-col>
			</el-row>
			<el-row class="dialog" style="background:#f5f5f5;height:391px;">
				<el-col :span="10">
					<el-table :data="waitPermissionItem" @select="selectWaitRow" @select-all="selectWaitAll" border style="width: 100%" height="390">
						<el-table-column align="center" type="selection" width="55">
						</el-table-column>
						<el-table-column prop="C_CODE" label="权限代码">
						</el-table-column>
						<el-table-column prop="C_NAME" label="权限名称">
						</el-table-column>
						<el-table-column prop="C_REMARK" label="权限说明">
						</el-table-column>
					</el-table>
				</el-col>
				<el-col :span="3">
					<div style="margin-top: 120px;">
						<el-button type="primary" @click="toGrant" icon="arrow-right" size="mini" style="margin-left:20px;">授权<i class="el-icon-arrow-right el-icon--right"></i></el-button>
					</div>
					<div style="margin-top: 60px;">
						<el-button type="primary" @click="cancelGrant" icon="el-icon-arrow-left" size="mini" style="margin-left:20px;">移除</el-button>
					</div>

				</el-col>
				<el-col :span="11">
					<el-table :data="havePermissionItem" @select="selectHaveRow" @select-all="selectHaveAll" border style="width: 100%" height="391">
						<el-table-column align="center" type="selection" width="55">
						</el-table-column>
						<el-table-column prop="C_CODE" label="权限代码">
						</el-table-column>
						<el-table-column prop="C_NAME" label="权限名称">
						</el-table-column>
						<el-table-column prop="C_REMARK" label="权限说明">
						</el-table-column>
					</el-table>
				</el-col>
			</el-row>

		</el-form>
	</div>
</template>

<script>
	import {
		getPermissionGroupById,
		isExitPermissionGroupName,
		savePermissionGroup,
		getHasNoAuthPermissionItem,
		getHasAuthPermissionItem
	} from '../../api/api';

	export default {
		data() {
			//权限组名称唯一性校验
			var validateNameUnique = (rule, value, callback) => {
				if(value) {
					isExitPermissionGroupName({
						"C_NAME": value,
						"id": this.addForm.C_ID
					}).then((data) => {
						if(data) {
							callback();
						} else {
							callback(new Error('权限组名称已存在！'));
						}
					});
				} else {
					callback();
				}
			};

			return {
				addForm: {
					C_ID: '',
					C_NAME: '',
					C_REMARK: ''
				},
				waitPermissionItem: [],
				havePermissionItem: [],
				waitSelect: [],
				haveSelect: [],
				rules: {
					C_NAME: [{
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
							validator: validateNameUnique,
							trigger: 'blur'
						}
					]
				},
			}
		},
		methods: {
			loadData(id) {
				if(id == '') { //新增
					this.$refs['addForm'].resetFields();
					this.addForm = {
						C_ID: '',
						C_NAME: '',
						C_REMARK: ''
					}
					this.initPermissionItem(id)
				} else { //修改
					getPermissionGroupById({
						columnNames: '',
						C_ID: id
					}).then((data) => {
						this.addForm = data;
						this.$refs['addForm'].resetFields();
						this.initPermissionItem(id)
					});
				}
			},
			initPermissionItem(id) {
				//待选权限项初始化
				var waitPermissionItem = [];
				var havePermissionItem = []; 
				let params = {
					groupId: id
				}
				getHasNoAuthPermissionItem(params).then((data) => { //查询未授权的
					waitPermissionItem = data || [];
					getHasAuthPermissionItem(params).then((hasAuthData) => { //查询已经授权的 //必须放在这里，否则有时候会错乱
						havePermissionItem = hasAuthData || [];
						if(havePermissionItem && havePermissionItem.length > 0) {
							for(var i = waitPermissionItem.length - 1; i >= 0; i--) {
								for(var j = 0; j < havePermissionItem.length; j++) {
									if(waitPermissionItem[i].C_ID == havePermissionItem[j].C_ID) {
										waitPermissionItem.splice(i, 1);
										break;
									}
								}
							};
						}
						this.waitPermissionItem = waitPermissionItem; //这样避免左边的列表先显示，然后不显示，导致有时候会错乱
						this.havePermissionItem = havePermissionItem;
						console.info(this.waitPermissionItem, this.havePermissionItem)
					});
				});
			},
			saveData() {
				this.$refs.addForm.validate((valid) => {
					if(valid) {
						let pItem = []
						if(this.havePermissionItem && this.havePermissionItem.length > 0) {
							for(let permissionItem of this.havePermissionItem) {
								pItem.push(permissionItem.C_ID)
							}
						}
						this.addForm.pItem = pItem.join(',')
						savePermissionGroup(this.addForm).then((data) => {
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
				});
			},
			toGrant() { //授权
				if(!this.waitSelect || this.waitSelect.length == 0) {
					this.alertDialog('请选择需要授权的权限项!', '提示');
				}
				for(var obj in this.waitSelect) {
					this.havePermissionItem.push(this.waitSelect[obj]);
				}
				for(var i = this.waitPermissionItem.length - 1; i >= 0; i--) {
					for(var j = 0; j < this.waitSelect.length; j++) {
						if(this.waitPermissionItem[i].C_ID == this.waitSelect[j].C_ID) {
							this.waitPermissionItem.splice(i, 1);
							break;
						}
					}
				}
				this.waitSelect = [];
			},
			cancelGrant() { //移除
				if(!this.haveSelect || this.haveSelect.length == 0) {
					this.alertDialog('请选择需要取消的权限项!', '提示');
				}
				for(var obj in this.haveSelect) {
					this.waitPermissionItem.push(this.haveSelect[obj]);
				}
				//删除
				for(var i = this.havePermissionItem.length - 1; i >= 0; i--) {
					for(var j = 0; j < this.haveSelect.length; j++) {
						if(this.havePermissionItem[i].C_ID == this.haveSelect[j].C_ID) {
							this.havePermissionItem.splice(i, 1);
							break;
						}
					}
				}
				this.haveSelect = [];
			},
			selectWaitAll(selection) {
				this.waitSelect = selection;
			},
			selectHaveAll(selection) {
				this.haveSelect = selection;
			},
			selectWaitRow(selection, row) {
				this.waitSelect = selection;
			},
			selectHaveRow(selection, row) {
				this.haveSelect = selection;
			},
			alertDialog(message, title) { //抽出公共的提示弹出框
				this.$alert(message, title, {
					confirmButtonText: '确定',
					type: 'info',
					callback: action => {}
				});
			}
		},
		mounted() {},
		created() {}
	}
</script>

<style>

</style>