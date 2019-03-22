<template>
	<div>
		<el-form :model="addForm" ref="addForm" :rules="rules" label-width="100px">
			<el-form-item label="消息KEY" prop="C_MSG_KEY">
				<el-input v-model="addForm.C_MSG_KEY" clearable></el-input>
			</el-form-item>
			<el-form-item label="消息名称" prop="C_MSG_NAME">
				<el-input v-model="addForm.C_MSG_NAME" clearable></el-input>
			</el-form-item>
			<el-form-item label="状态">
	          <el-select v-model="addForm.C_STATUS" placeholder="请选择">
	            <el-option label="停用" v-bind:value='false'></el-option>
	            <el-option label="启用" v-bind:value='true'></el-option>
	          </el-select>
	        </el-form-item>
			<el-form-item label="描述" prop="C_DESC">
				<el-input type="textarea" :rows="3" v-model="addForm.C_DESC"></el-input>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import {
		getMsgRegisterById,
		isExitMsgRegisterKey,
		saveMsgRegister
	} from '../../api/api';

	export default {
		data() {
			//权限组名称唯一性校验
			var validateKeyUnique = (rule, value, callback) => {
				if(value) {
					isExitMsgRegisterKey({
						"C_MSG_KEY": value,
						"id": this.addForm.C_ID
					}).then((data) => {
						if(data) {
							callback();
						} else {
							callback(new Error('消息key已存在！'));
						}
					});
				} else {
					callback();
				}
			};

			return {
				addForm: {
					C_ID: '',
					C_MSG_KEY: '',
					C_MSG_NAME: '',
					C_DESC: '',
					C_STATUS: true
				},
				rules: {
					C_MSG_KEY: [{
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
							validator: validateKeyUnique,
							trigger: 'blur'
						}
					],
					C_MSG_NAME: [{
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
				if(id == '') { //新增
					this.$refs['addForm'].resetFields();
					this.addForm = {
						C_ID: '',
						C_MSG_KEY: '',
						C_MSG_NAME: '',
						C_DESC: '',
						C_STATUS: true
					}
				} else { //修改
					getMsgRegisterById({
						columnNames: '',
						C_ID: id
					}).then((data) => {
						this.addForm = data;
						this.$refs['addForm'].resetFields();
					});
				}
			},
			saveData() {
				this.$refs.addForm.validate((valid) => {
					if(valid) {
						saveMsgRegister(this.addForm).then((data) => {
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
			}
		},
		mounted() {},
		created() {}
	}
</script>

<style>

</style>