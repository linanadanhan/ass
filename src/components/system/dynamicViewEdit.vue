<template>
	<div>
		<el-form :model="addForm" ref="addForm" :rules="rules" label-width="100px">
			<el-form-item label="视图编码" prop="C_NAME">
				<el-input v-model="addForm.C_NAME" clearable></el-input>
			</el-form-item>
			<el-form-item label="视图名称" prop="C_TEXT">
				<el-input v-model="addForm.C_TEXT" clearable></el-input>
			</el-form-item>
			<el-form-item label="数据源" prop="C_DATASOURCE">
				<el-select v-model="addForm.C_DATASOURCE" placeholder="请选择数据源">
					<el-option v-for="item in dataSourceOptions" :key="item.C_NAME" :label="item.C_TEXT" :value="item.C_NAME">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="SQL" prop="C_SQL">
				<el-input type="textarea" :rows="5" v-model="addForm.C_SQL"></el-input>
				${key}表示参数，${key#type}可指定参数类型，type支持date、array，系统将自动根据字符串参数转为指定类型
			</el-form-item>
			<el-form-item label="测试参数" prop="C_PARAMS">
				<el-input type="textarea" :rows="3" v-model="addForm.C_PARAMS"></el-input>
				参数格式：key1=value1&key2=value2
			</el-form-item>
			<el-form-item label="说明" prop="C_DESCRIPTION">
				<el-input type="textarea" :rows="3" v-model="addForm.C_DESCRIPTION"></el-input>
			</el-form-item>
			<el-form-item label="API说明">
				视图所有数据：dynamicView/view/{viewName}/queryAll<br>
				视图分页数据：dynamicView/view/{viewName}/queryPage
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import {
		getDynamicViewById,
		isExitDynamicViewName,
		saveDynamicView,
		getAllDataSource
	} from '../../api/api';
	
	import {gbs} from '../../config'

	export default {
		data() {
			//数据源编码唯一性校验
			var validateNameUnique = (rule, value, callback) => {
				if(value) {
					if(!/^[A-Za-z][A-Za-z0-9_]+$/.test(value)) {
						callback(new Error('请输入英文、数字或下划线等，英文字符开头！'));
					}
					isExitDynamicViewName({
						"C_NAME": value,
						"id": this.addForm.C_ID
					}).then((data) => {
						if(data) {
							callback();
						} else {
							callback(new Error('视图编码已存在！'));
						}
					});
				} else {
					callback();
				}
			};

			return {
				dataSourceOptions: [],
				addForm: {
					C_ID: '',
					C_NAME: '',
					C_TEXT: '',
					C_PERMISSION: '',
					C_DATASOURCE: '_default',
					C_SQL: '',
					C_PARAMS: '',
					C_DESCRIPTION: ''
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
				this.getAllDataSource();
				if(id == '') { //新增
					this.$refs['addForm'].resetFields();
					this.addForm = {
						C_ID: '',
						C_NAME: '',
						C_TEXT: '',
						C_PERMISSION: '',
						C_DATASOURCE: '_default',
						C_SQL: '',
						C_PARAMS: '',
						C_DESCRIPTION: ''
					}
					
				} else { //修改
					this.isReadonly = true;
					getDynamicViewById({
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
						console.info(this.addForm)
						saveDynamicView(this.addForm).then((data) => {
							if (data.success) {
								this.$message({
									message: '保存成功！',
									type: 'success'
								});
								this.$emit('closeAndFresh');								
							}else {
								this.$message({
									type: 'error',
									message: data.title
								});
							}
						}).catch((err) => {
							this.$message({
								type: 'error',
								message: '保存失败!'
							});
						});
					}
				});
			},
			getAllDataSource() {
				getAllDataSource({
					columnNames: ''
				}).then((data) => {
					data.splice(0, 0, {C_NAME:'_default', C_TEXT: '系统数据源（默认）'});
					this.dataSourceOptions = data;
				});
			},
			testView() {
                if (this.addForm.C_ID == '') {
        			this.$message({
						type: 'info',
						message: '先保存再测试!'
					});
                }else {
                	var dynamicViewUrl = gbs.dynamicViewUrl;
                	var viewName = this.addForm.C_NAME;
                	var data = this.addForm.C_PARAMS;
                	var url = dynamicViewUrl + "/dynamicView/view/" + viewName + "/queryAll";
                	
                	if (data){
                		url += "?" + data;
                	}
                	window.open(url);
                }
			}
		},
		mounted() {},
		created() {
		}
	}
</script>

<style>

</style>