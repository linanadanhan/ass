<template>
	<div>
		<el-form :model="addForm" ref="addForm" :rules="rules" label-width="100px">
			<el-row>
				<el-col :span="12">
					<el-form-item label="标题" prop="widgetTitle">
						<el-input v-model="addForm.widgetTitle"></el-input>
					</el-form-item>
				</el-col>

				<el-col :span="12">
					<el-form-item label="widget" prop="widgetCode">
						<!--<el-select filterable v-model="addForm.widgetCode" placeholder="请选择widget" @change="handleWidgetChange">
							<el-option v-for="item in widgetOptions" :key="item.code" :label="item.name" :value="item.code">
							</el-option>
						</el-select>-->
						<el-cascader placeholder="请选择widget" v-model="selWidget" @change="handleItemChange" :options="widgetOpts" :show-all-levels="false" :props="props" filterable></el-cascader>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row>
				<el-col :span="12">
					<el-form-item label="修饰器">
						<el-select :disabled="!isNestWidget" v-model="addForm.decoratorCode" placeholder="请选择修饰器">
							<el-option v-for="item in decorateOptions" :key="item.code" :label="item.name" :value="item.code">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="12">
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>

<script>
	import {
		getWidgetList,
		getDecorateList,
		getPageConfInfoById,
		saveSitePageConf,
		getCatlogWidgetList
	} from '../../api/apiPortal';

	export default {
		data() {
			//校验是否选择widgetCode
			var validateWidgetCode = (rule, value, callback) => {
		        if (value) {
		        	console.info(value)
//		        	if (!/^[^\u4e00-\u9fa5]{0,}$/.test(value)){
//		          	  	 callback(new Error('不能输入中文！'));
//		          	}
		        } else {
		          callback();
		        }
		      };
			
			return {
				addForm: {
					id: '',
					widgetCode: '',
					widgetTitle: '',
					decoratorCode: 'default',
					widgetHeight: '70',
					pageUuId: ''
				},
				widgetOptions: [],
				decorateOptions: [],
				tableData: [],
				rules: {
					widgetCode: [{
						required: true,
						message: '必填 ',
						trigger: 'blur'
					}],
					widgetTitle: [{
						required: true,
						message: '必填 ',
						trigger: 'blur'
					}]
				},
				isNestWidget: true,
				props: {
					children: 'children',
					label: 'label',
					value: 'value'
				},
				widgetOpts: [],
				selWidget: []
			}
		},
		methods: {
			loadData(id, pageUuId) {
				//获取Widget下拉选框信息
				getCatlogWidgetList().then((data) => {
					this.widgetOpts = data
				});

				//获取修饰器下拉选框信息
				getDecorateList().then((data) => {
					this.decorateOptions = data;
				});

				this.selWidget = []
				if(id == '') { //新增
					this.$refs['addForm'].resetFields();
					this.addForm.id = '';
					this.addForm.decoratorCode = 'default';
					this.addForm.pageUuId = pageUuId;
				} else { //修改
					getPageConfInfoById({
						id: id
					}).then((data) => {
						this.$refs['addForm'].resetFields();
						
						if (/\//.test(data.widgetCode)) {
							let projectCode = data.widgetCode.substr(0,data.widgetCode.indexOf('/'))
							this.selWidget.push(projectCode)
							this.selWidget.push(data.widgetCode)
						}else{
							this.selWidget.push("")
							this.selWidget.push(data.widgetCode)
						}
						this.addForm = data;
					});
				}
			},
			saveSubmitForm(pageUuId) {
				this.$refs.addForm.validate((valid) => {
					if(valid) {
						saveSitePageConf(this.addForm).then((data) => {
							this.$message({
								type: 'success',
								message: '保存成功!'
							});
							this.$emit('closeAndFresh');
						}).catch(() => {
							this.$message({
								type: 'error',
								message: '保存失败!'
							});
						});
					}
				});
			},
			resetForm() {
				this.$refs['addForm'].resetFields();
				this.addForm.id = '';
			},
			handleItemChange(val){
				this.addForm.widgetCode = val[1]
			},
			handleWidgetChange(value) {
				let obj = {};
				obj = this.widgetOptions.find((item) => {
					return item.code === value;
				});

				if(typeof(obj) != 'undefined') {
					if(obj.isNested) {
						this.isNestWidget = false;
						this.addForm.decoratorCode = 'none';
					} else {
						this.isNestWidget = true;
						this.addForm.decoratorCode = 'default';
					}
				}
			}
		},
		mounted() {},
		created() {}
	}
</script>
<style>

</style>