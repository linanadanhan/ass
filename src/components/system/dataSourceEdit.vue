<template>
	<div>
		<el-form :model="addForm" ref="addForm" :rules="rules" label-width="100px">
			<el-form-item label="数据源编码" prop="C_NAME">
				<el-input v-model="addForm.C_NAME" clearable></el-input>
			</el-form-item>
			<el-form-item label="数据源名称" prop="C_TEXT">
				<el-input v-model="addForm.C_TEXT" clearable></el-input>
			</el-form-item>
			<el-form-item label="数据库类型" prop="C_TYPE">
				<el-select v-model="addForm.C_TYPE" @change="handleTypeChange">
					<el-option label="Mysql" value="1"></el-option>
					<el-option label="Oracle" value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="地址" prop="C_URL">
				<el-input v-model="addForm.C_URL" clearable></el-input>
			</el-form-item>
			<el-form-item label="用户名" prop="C_USER">
				<el-input v-model="addForm.C_USER" clearable></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="C_PASSWORD">
				<el-input v-model="addForm.C_PASSWORD" type="password"></el-input>
			</el-form-item>
			<el-form-item label="初始连接数" prop="C_MINIDLE">
				<el-input-number v-model="addForm.C_MINIDLE" controls-position="right" :min="1"></el-input-number>
			</el-form-item>
			<el-form-item label="最大连接数" prop="C_MAXSIZE">
				<el-input-number v-model="addForm.C_MAXSIZE" controls-position="right" :min="1"></el-input-number>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import {
		getDataSourceById,
		isExitDataSourceName,
		saveDataSource
	} from '../../api/api';

	export default {
		data() {
			//数据源编码唯一性校验
			var validateNameUnique = (rule, value, callback) => {
				if(value) {
					if(!/^[A-Za-z][A-Za-z0-9_]+$/.test(value)) {
						callback(new Error('请输入英文、数字或下划线等，英文字符开头！'));
					}
					isExitDataSourceName({
						"C_NAME": value,
						"id": this.addForm.C_ID
					}).then((data) => {
						if(data) {
							callback();
						} else {
							callback(new Error('数据源编码已存在！'));
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
					C_TEXT: '',
					C_TYPE: '1',
					C_URL: 'jdbc:mysql://[ip]:[port:3306]/[databaseName]?useUnicode=true&characterEncoding=utf-8&zeroDateTimeBehavior=convertToNull',
					C_USER: '',
					C_PASSWORD: '',
					C_MINIDLE: 1,
					C_MAXSIZE: 1
				},
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
					],
					C_TEXT: [{
							required: true,
							message: '必填 ',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 50,
							message: '长度在 1到 50个字符',
							trigger: 'change'
						}
					],
					C_URL: [{
							required: true,
							message: '必填 ',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 300,
							message: '长度在 1到 300个字符',
							trigger: 'change'
						}
					],
					C_USER: [{
							required: true,
							message: '必填 ',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 50,
							message: '长度在 1到 50个字符',
							trigger: 'change'
						}
					],
					C_PASSWORD: [{
							required: true,
							message: '必填 ',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 50,
							message: '长度在 1到 50个字符',
							trigger: 'change'
						}
					]
				},
			}
		},
		methods: {
			handleTypeChange(val) {
				if(val == '1') {
					this.addForm.C_URL = 'jdbc:mysql://[ip]:[port:3306]/[databaseName]?useUnicode=true&characterEncoding=utf-8&zeroDateTimeBehavior=convertToNull';
				} else {
					this.addForm.C_URL = 'jdbc:oracle:thin:@[ip]:[port:1521]:[sid]';
				}
			},
			loadData(id) {
				if(id == '') { //新增
					this.$refs['addForm'].resetFields();
				} else { //修改
					this.isReadonly = true;
					getDataSourceById({
						columnNames: '',
						C_ID: id
					}).then((data) => {
						this.addForm = data;
						this.addForm.C_TYPE = String(this.addForm.C_TYPE)
						this.$refs['addForm'].resetFields();
					});
				}
			},
			saveData() {
        this.$refs.addForm.validate((valid) => {
          if(valid) {
            saveDataSource(this.addForm).then((data) => {
              if (!data || data.success) {
                this.$message({
                  message: '测试通过，数据源保存成功！',
                  type: 'success'
                });
                this.$emit('closeAndFresh');
              } else {
                this.$message({
                  type: 'error',
                  message: data.title
                });
              }
            }).catch((err) => {
              this.$message({
                type: 'error',
                message: data.title
              });
            })
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