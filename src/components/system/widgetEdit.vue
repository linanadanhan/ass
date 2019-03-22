<template>
	<div>
		<el-form :model="addForm" ref="addForm" :rules="rules" label-width="100px">
				<el-row>
					<el-col :span="12">
						<el-form-item label="widget代码" prop="code">
							<el-input :readonly="isReadonly" v-model="addForm.code"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="widget名称" prop="name">
							<el-input v-model="addForm.name"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				
				<el-row>
					<el-col :span="12">
						<el-form-item label="widget标题">
							<el-input v-model="addForm.title"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="是否开放">
							<el-select v-model="addForm.isOpen" filterable>
								<el-option label="否" value="0"></el-option>
								<el-option label="是" value="1"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				
				<el-row>
					<el-col :span="12">
						<el-form-item label="widget包">
							<div class="up-file" style="height: 80px;">
								<div style="width: 300px;">
									<div style="float:left;width: 110px;height: 50px;">
										<el-upload class="avatar-uploader" :data="upLoadData" :action="fileUploadUrl" :show-file-list="false" :on-success="uploadSuccess" :before-upload="beforeAvatarUpload">
											<el-button slot="trigger" size="small" type="primary">选取widget包</el-button>
										</el-upload>
									</div>
									<div style="float:left;">
										<el-checkbox v-model="addForm.isSystem" size="small">系统内置</el-checkbox>
									</div>
								</div>
								<div style="height: 40px;">
									<img v-if="addForm.widgetImg" :src="addForm.widgetImg" class="avatar">
									<img v-else src="../../../static/img/noWidgetImg.jpg" />
								</div>
							</div>
					    </el-form-item >
					</el-col>
					<el-col :span="12">
					</el-col>
				</el-row>
		</el-form>
	</div>
</template>

<script>
	import {
		saveWidget,isExitWidgetCode,getWidgetInfoById,importWidget
	} from '../../api/apiPortal';
	
	import {gbs} from '../../config'
	
	export default {
		data(){
			//主题代码唯一性校验
			var validateCodeUnique = (rule, value, callback) => {
		        if (value) {
		        	
		        	if (!/^[^\u4e00-\u9fa5]{0,}$/.test(value)){
		          	  	 callback(new Error('不能输入中文！'));
		          	}
		        	
		          isExitWidgetCode({"code": value,"id":this.addForm.id}).then((data) => {
		              if (data) {
		                callback(new Error('widget代码已存在！'));
		              } else {
		                callback();
		              }
		          });
		        } else {
		          callback();
		        }
		      };
			return{
				addForm:{
					id: '',
					code: '',
					name: '',
					title:'',
					isOpen: '',
					isImp: '',
					referenceId:'',
					widgetImg:'',
					isSystem: true,
					projectCode:''				},
				isReadonly:false,
				fileUploadUrl: '/api/cos3-portal-manager/widget/importWidget',
				upLoadData: {type:'0',code:''},
				rules: {
		          name: [
		            {required: true, message: '必填 ', trigger: 'change'},
		            {min: 1, max: 200, message: '长度在 1到 200个字符', trigger: 'change'}
		          ],
		          code: [
		            {required: true, message: '必填 ', trigger: 'blur'},
		            {min: 1, max: 50, message: '长度在 1到 50个字符', trigger: 'change'},
		            {validator: validateCodeUnique, trigger: 'change'}
		          ],
		          sort: ''
		        },
			}
		},
		methods:{
			loadData(id){
				if(id == ''){//新增
					this.addForm.id = '';
					this.addForm.widgetImg = '';
					this.addForm.referenceId = '';
					this.addForm.isSystem = true;
					this.isReadonly = false;
					this.$refs['addForm'].resetFields();
					this.addForm.isOpen = '0';
					this.addForm.projectCode = '';
				}else{//修改
					this.isReadonly = true;
					getWidgetInfoById({id: id}).then((data) => { 
						this.addForm = data;
						this.addForm.referenceId = '';
						if (data.isImp != null && data.isImp != '' && data.isImp == '1'){
							this.addForm.widgetImg = gbs.portalFrontUrl + data.projectCode + '/widgets/'+data.code+'/bg.png';
						}
						this.$refs['addForm'].resetFields();
					});
				}
			},
			saveData(){
				this.$refs.addForm.validate((valid) => {
					if(valid) {
						saveWidget(this.addForm).then((data) => {
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
			beforeAvatarUpload(file) {
				var allow = (file.type === 'application/x-zip-compressed')
				const isLt2M = file.size / 1024 / 1024 / 2 < 20;
				if(!allow) {
					this.$message.error('上传widget包只能是 ZIP格式!');
				}
				if(!isLt2M) {
					this.$message.error('上传widget包大小不能超过 20MB!');
				}
				
				var fileName = file.name;
				var checkName = true;
				
				if (fileName.indexOf('.') != -1){
					fileName = fileName.substring(0,fileName.indexOf('.'));
					//压缩包文件名与主题代码比对，上传文件包目录校验服务端解压时校验 
					if (fileName != this.addForm.code){
						checkName = false;
						this.$message.error('上传widget包文件名与widget代码不一致!');
					}else{
						this.upLoadData.code = this.addForm.code;
					}
				}
				
				let fv = this.$refs.addForm.validate();
				return allow && isLt2M && checkName && fv;
			},uploadSuccess(response, file, fileList) {
				if (response.success){
					var jsonObj = JSON.parse(response.data);
					this.addForm.projectCode = jsonObj.projectCode;
					this.addForm.isImp = '1';
					this.addForm.referenceId = '1';
					this.$message({
			          message: response.title,
			          type: 'success'
			        });
					
				}else{
					this.addForm.referenceId = '';
					this.$message({
						type: 'error',
						message: response.title
					});
				}
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