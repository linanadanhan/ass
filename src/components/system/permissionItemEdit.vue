<template>
	<div>
		<el-form :model="addForm" ref="addForm" :rules="rules" label-width="100px">
			<el-form-item label="权限代码" prop="C_CODE">
				<el-input v-model="addForm.C_CODE" clearable></el-input>
			</el-form-item>
			<el-form-item label="权限名称" prop="C_NAME">
				<el-input v-model="addForm.C_NAME" clearable></el-input>
			</el-form-item>
			<el-form-item label="所属权限组">
				<el-select v-model="groupId" filterable multiple placeholder="请选择权限组">
					<el-option v-for="item in groupOptions" :key="item.C_ID" :label="item.C_NAME" :value="item.C_ID">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="说明" prop="C_REMARK">
				<el-input type="textarea" :rows="5" v-model="addForm.C_REMARK"></el-input>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import {
		getPermissionItemById,
		isExitPermissionItemCode,
		savePermissionItem,
		getAllPermissionGroups
	} from '../../api/api';

	export default {
		data() {
			//数据源编码唯一性校验
			var validateCodeUnique = (rule, value, callback) => {
				if(value) {
					if(!/^[A-Za-z][A-Za-z0-9_]+$/.test(value)) {
						callback(new Error('请输入英文、数字或下划线等，英文字符开头！'));
					}
					isExitPermissionItemCode({
						"C_CODE": value,
						"id": this.addForm.C_ID
					}).then((data) => {
						if(data) {
							callback();
						} else {
							callback(new Error('权限项代码已存在！'));
						}
					});
				} else {
					callback();
				}
			};

			return {
				groupId: [],
				groupOptions: [],
				addForm: {
					C_ID: '',
					C_CODE: '',
					C_NAME: '',
					C_REMARK: ''
				},
				rules: {
					C_CODE: [{
							required: true,
							message: '必填 ',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 30,
							message: '长度在 1到 30个字符',
							trigger: 'change'
						},
						{
							validator: validateCodeUnique,
							trigger: 'blur'
						}
					],
					C_NAME: [{
							required: true,
							message: '必填 ',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 100,
							message: '长度在 1到 100个字符',
							trigger: 'change'
						}
					]
				},
			}
		},
		methods: {
			loadData(id) {
				// 查询平台所有权限分组信息
				this.getAllPermissionGroups();
				if(id == '') { //新增
					this.$refs['addForm'].resetFields();
					this.addForm = {
						C_ID: '',
						C_NAME: '',
						C_CODE: '',
						C_REMARK: ''
					}
					this.groupId = []
					
				} else { //修改
					getPermissionItemById({
						id: id
					}).then((data) => {
						this.addForm = data;
						if (data.groupId && data.groupId != '') {
							var dataStrArr = data.groupId.split(',')
							this.groupId = dataStrArr.map(function(data){  
						       return +data;  
						    });
						}else {
							this.groupId = []
						}
						this.$refs['addForm'].resetFields();
					});
				}
			},
			saveData() {
				this.$refs.addForm.validate((valid) => {
					if(valid) {
						this.addForm.groupId = this.groupId.join(',')
						savePermissionItem(this.addForm).then((data) => {
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
			getAllPermissionGroups() {// 查询所有权限分组
				getAllPermissionGroups({
					columnNames: ''
				}).then((data) => {
					this.groupOptions = data;
				});
			}
		},
		mounted() {},
		created() {
		}
	}
</script>

<style>

</style>