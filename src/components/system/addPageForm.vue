<template>
	<div>
		<el-form :model="addForm" ref="addForm" :rules="rules" label-width="120px">
	        <el-form-item label="页面名称" prop="name">
				<el-input v-model="addForm.name"></el-input>
	        </el-form-item>
	        <el-form-item label="">
				<el-checkbox v-model="addForm.isLink">外部链接</el-checkbox>
	        </el-form-item>
	        <el-form-item v-if="!addForm.isLink" label="页面path" prop="path">
	          <el-input v-model="addForm.path"></el-input>
	          {{addForm.cascade}}{{addForm.path}}
	        </el-form-item>
	        <el-form-item v-if="addForm.isLink" label="链接地址" prop="linkUrl">
	          <el-input v-model="addForm.linkUrl"></el-input>
	        </el-form-item>
	    </el-form>
	</div>
</template>

<script>
	import { getSitePageTree, getSitePageInfoById, getLayoutList, getThemeList, saveSitePage, delSitePage, isExitPagePath } from '../../api/apiPortal';
	export default {
		data() {
			//页面path唯一性校验
			var validatePagePath = (rule, value, callback) => {
				if(value) {
					if(!/^[^\u4e00-\u9fa5]{0,}$/.test(value)) {
						callback(new Error('不能输入中文！'));
					}
					isExitPagePath({
						"path": value,
						"id": this.addForm.id,
						"cascade": this.addForm.cascade,
						"type": this.addForm.type,
						"siteCode": this.siteCode
					}).then((data) => {
						if(data) {
							callback(new Error('页面path已存在！'));
						} else {
							callback();
						}
					});
				} else {
					callback();
				}
			};

			return {
				siteCode: '',
				addForm: {
					id: '',
					parentId: '',
					siteCode: '',
					name: '',
					themeCode: '',
					themeCodeImg: '',
					layoutCode: '',
					layoutCodeImg: '',
					openSelf: '0',
					navHidden: '0',
					allowWidget: '0',
					allowLayout: '0',
					isMenu: false,
					themeStyle:'standard',
					type: '',
					path: '',
					cascade: '',
					sortNo: 1,
					isLink: false,
					linkUrl: ''
				},
				rules: {
					name: [{
							required: true,
							message: '必填 ',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 200,
							message: '长度在 1到 200个字符',
							trigger: 'blur'
						}
					],
					path: [{
							required: true,
							message: '必填 ',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 50,
							message: '长度在 1到 50个字符',
							trigger: 'blur'
						},
						{
							validator: validatePagePath,
							trigger: 'blur'
						}
					],
					linkUrl: [
						{
							required: true,
							message: '必填 ',
							trigger: 'blur'
						}
					]
				}
				
			};
		},
		methods: {
			loadData(siteCode, data){
				this.siteCode = siteCode;
				this.initForm();
				this.$refs['addForm'].resetFields();
				this.addForm.parentId = data.id;
				this.addForm.siteCode = this.siteCode;
				this.addForm.type = data.attributes.type;
				this.addForm.layoutCode = 'default';
				if(data.parentId != 0) {
					this.addForm.cascade = data.attributes.cascade + data.attributes.path + '/';
				}else{
					this.addForm.cascade = '/';
				}	
			},
			saveSitePage(){
				this.$refs.addForm.validate((valid) => {
					if(valid) {
						if (this.addForm.isLink) {
							this.addForm.path = Date.now()
						}
						saveSitePage(this.addForm).then((data) => {
							this.$message({
								message: '保存页面成功!',
								type: 'success'
							});
							this.$emit('closeAndFresh'); 
							
						}).catch((err) => {
							this.$message({
								type: 'error',
								message: '新增页面失败!'
							});
						});
					}
				});				
			},
			initForm(){
				this.addForm = {
					id: '',
					parentId: '',
					siteCode: '',
					name: '',
					themeCode: '',
					themeCodeImg: '',
					layoutCode: '',
					layoutCodeImg: '',
					openSelf: '0',
					navHidden: '0',
					allowWidget: '0',
					allowLayout: '0',
					isMenu: false,
					themeStyle:'standard',
					type: '',
					path: '',
					cascade: '',
					sortNo: 1,
					isLink: false,
					linkUrl: ''
				}
			}
		},
		mounted() {
		}
	}
</script>

<style>
</style>