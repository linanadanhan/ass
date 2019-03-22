<template>
	<div>
		<el-form :model="addForm" ref="addForm" :rules="rules" label-width="100px">
				<el-row>
					<el-col :span="12">
						<el-form-item label="站点代码" prop="code">
							<el-input :readonly="isReadonly" v-model="addForm.code"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="站点名称" prop="name">
							<el-input v-model="addForm.name"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				
				<el-row>
					<el-col :span="12">
						<el-form-item label="公开主题" prop="publicTheme">
							<el-select v-model="addForm.publicTheme" placeholder="请选择公开主题" @change="handleThemeChange('1')">
								<el-option v-for="item in themeOptions" :key="item.code" :label="item.name" :value="item.code">
								</el-option>
							</el-select>
					  </el-form-item >
					</el-col>
					<el-col :span="12">
						<el-form-item label="私有主题" prop="privateTheme">
							<el-select v-model="addForm.privateTheme" placeholder="请选择私有主题" @change="handleThemeChange('2')">
								<el-option v-for="item in themeOptions" :key="item.code" :label="item.name" :value="item.code">
								</el-option>
							</el-select>
					  </el-form-item >
					</el-col>
				</el-row>
				
				<!--<el-row>
					<el-col :span="12">
						<el-form-item>
							<div class="up-file">
								<img v-if="addForm.publicTheme" :src="addForm.publicThemeImg" class="avatar">
								<img v-else src="../../../static/img/noThemeImg.jpg" />
							</div>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item>
							<div class="up-file">
								<img v-if="addForm.privateTheme" :src="addForm.privateThemeImg" class="avatar">
								<img v-else src="../../../static/img/noThemeImg.jpg" />
							</div>
						</el-form-item>
					</el-col>
				</el-row>-->
				
				<el-row>
					<el-col :span="12">
						<el-form-item label="节日主题" prop="holidayTheme">
							<el-select v-model="addForm.holidayTheme" clearable placeholder="请选择节日主题">
								<el-option v-for="item in themeOptions" :key="item.code" :label="item.name" :value="item.code">
								</el-option>
							</el-select>
					  </el-form-item >
					</el-col>
					<el-col :span="12">
					</el-col>
				</el-row>
				
				<el-row>
					<el-col :span="24">
						<el-form-item label="" prop="holidayRange">
							    <el-date-picker
							      v-model="holidayRanges"
							      type="daterange"
							      range-separator="至"
							      start-placeholder="开始日期"
							      end-placeholder="结束日期">
							    </el-date-picker>
					  </el-form-item >
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="随机主题" prop="randomTheme">
							<el-select multiple v-model="randomThemes" placeholder="请选择随机主题" >
								<el-option v-for="item in themeOptions" :key="item.code" :label="item.name" :value="item.code">
								</el-option>
							</el-select>
					  </el-form-item >
					</el-col>
					<el-col :span="12">
						<el-form-item label="个性化主题" prop="profileTheme">
							<el-select multiple v-model="profileThemes" placeholder="请选择个性化主题">
								<el-option v-for="item in themeOptions" :key="item.code" :label="item.name" :value="item.code">
								</el-option>
							</el-select>
					  </el-form-item >
					</el-col>
				</el-row>
				
				<el-row>
					<el-col :span="12">
						<el-form-item label="站点标题">
							<el-input v-model="addForm.title"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="Logo图片">
							<div class="up-file">
								<el-upload class="avatar-uploader" :action="fileUploadUrl" :show-file-list="false" :on-success="(res,file) => handleAvatarSuccess(res, file)" :before-upload="beforeAvatarUpload">
									<div v-if="!addForm.id">
										<div class="image" v-if="addForm.logo">
											<img :src="addForm.logoRef" class="avatar">
											<div class="delete">
												<i class="el-icon-circle-close" style="color: #000;" @click.stop="handleDelLogo"></i>
											</div>
										</div>
										<i v-else class="el-icon-plus avatar-uploader-icon">Logo图片</i>
									</div>
									<div v-if="addForm.id">
										<div class="image" v-if="addForm.logo">
											<img :src="addForm.logoRef" class="avatar">
											<div class="delete">
												<i class="el-icon-circle-close" style="color: #000;" @click.stop="handleDelLogo"></i>
											</div>
										</div>
										<img v-else src="../../../static/img/noImg.jpg" />
									</div>
								</el-upload>
							</div>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="登录类型">
							<el-select v-model="addForm.loginType" filterable>
								<el-option label="系统页登录模式" value="system"></el-option>
								<el-option label="弹窗登录模式" value="dialog"></el-option>
								<el-option label="公开页登录模式" value="public"></el-option>
								<el-option label="禁用登录验证" value="none"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="版权说明">
							<el-input v-model="addForm.copyright" type="textarea"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
		</el-form>
	</div>
</template>

<script>
	import {
		saveSite,isExitSiteCode,getSiteInfoById,importSite,getThemeList
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
		        	
		          isExitSiteCode({"code": value,"id":this.addForm.id}).then((data) => {
		              if (data) {
		                callback(new Error('站点代码已存在！'));
		              } else {
		                callback();
		              }
		          });
		        } else {
		          callback();
		        }
		      };
		      
			return{
				holidayRanges: [],
				randomThemes: [],
				profileThemes: [],
				addForm:{
					id: '',
					code: '',
					name: '',
					title: '',
					publicTheme: '',
					privateTheme:'',
					publicThemeImg:'',
					privateThemeImg:'',
					logo: '',
					logoRef: '',
					loginType: 'system',
					copyright: '',
					holidayRange: '',
					holidayTheme: '',
					randomTheme: '',
					profileTheme: ''				},
				themeOptions:[],
				importFile:{},
				isReadonly:false,
				fileUploadUrl: gbs.fileServiceUrl + '/file/uploadFile',
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
		          publicTheme:[{required: true, message: '必填 ', trigger: 'blur'}
		          ],
		          privateTheme:[{required: true, message: '必填 ', trigger: 'blur'}
		          ]
		        },
			}
		},
		methods:{
			loadData(id){
				getThemeList().then((data) => {
					this.themeOptions = data;
				});
				
				if(id == ''){//新增
					this.addForm.id = '';
					this.addForm.title = '';
					this.addForm.logo = '';
					this.addForm.publicThemeImg = '';
					this.addForm.privateThemeImg = '';
					this.addForm.copyright = '';
					this.addForm.holidayRange = '';
					this.addForm.holidayTheme = '';
					this.addForm.randomTheme = '';
					this.addForm.profileTheme = '';
					this.holidayRanges = [];
					this.randomThemes = [];
					this.profileThemes = [];
					this.addForm.loginType = 'system';
					this.isReadonly = false;
					this.$refs['addForm'].resetFields();
				}else{//修改
					this.isReadonly = true;
					getSiteInfoById({id: id}).then((data) => {
						console.info(data)
						if (data.holidayRange == null || data.holidayRange == '') {
							this.holidayRanges = []
						}else{
							this.holidayRanges = data.holidayRange.split(',')
						}
						
						if (data.randomTheme == null || data.randomTheme == '') {
							this.randomThemes = []
						}else{
							this.randomThemes = data.randomTheme.split(',')
						}
						
						if (data.profileTheme == null || data.profileTheme == '') {
							this.profileThemes = []
						}else{
							this.profileThemes = data.profileTheme.split(',')
						}
						
						this.addForm = data;
						this.addForm.logoRef = gbs.fileServiceUrl + '/file/download/' + data.logo;
						this.$refs['addForm'].resetFields();
						
						let obj = {};
					    obj = this.themeOptions.find((item)=>{
					          return item.code === data.publicTheme;
					    });
					    
					    let obj1 = {};
					    obj1 = this.themeOptions.find((item)=>{
					          return item.code === data.privateTheme;
					    });

					    if (obj.isSystem){
					    	this.addForm.publicThemeImg = '../../../static/component/themes/' + data.publicTheme + '/theme.png';
					    }else{
					    	this.addForm.publicThemeImg = gbs.portalFrontUrl + obj.projectCode + '/themes/' + data.publicTheme + "/theme.png";
					    }
						
						if (obj1.isSystem){
							this.addForm.privateThemeImg = '../../../static/component/themes/' + data.privateTheme + '/theme.png';
						}else {
							this.addForm.privateThemeImg = gbs.portalFrontUrl + obj.projectCode + '/themes/' + data.privateTheme + "/theme.png";
						}
					});
				}
			},
			saveData(){
				this.$refs.addForm.validate((valid) => {
					if(valid) {
						if (this.holidayRanges && this.holidayRanges.length > 0) {
							this.addForm.holidayRange = this.holidayRanges.join(',')
						}else{
							this.addForm.holidayRange = ''
						}
						
						if (this.randomThemes && this.randomThemes.length > 0) {
							this.addForm.randomTheme = this.randomThemes.join(',')
						}else{
							this.addForm.randomTheme = ''
						}
						
						if (this.profileThemes && this.profileThemes.length > 0) {
							this.addForm.profileTheme = this.profileThemes.join(',')
						}else{
							this.addForm.profileTheme = ''
						}

						saveSite(this.addForm).then((data) => {
							this.$message({
					            message: '保存成功！',
					            type: 'success'
					        });
							
							this.$emit('closeAndFresh'); 
						});
					}
				});
			},
			beforeAvatarUpload(file) {
				var allow = (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/bmp')
				const isLt2M = file.size / 1024 / 1024 / 2 < 2;
				if(!allow) {
					this.$message.error('上传头像图片只能是 JPG格式或PNG格式或BMP格式!');
				}
				if(!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return allow && isLt2M;
			},handleAvatarSuccess(res, file) {
				this.addForm.logo = res.referenceId;
				this.addForm.logoRef = URL.createObjectURL(file.raw);
			},handleThemeChange(value){
				if (value == '1'){
					let obj = {};
				    obj = this.themeOptions.find((item)=>{
				          return item.code === this.addForm.publicTheme;
				    });
				    if (obj.isSystem){
				    	this.addForm.publicThemeImg = '../../../static/component/themes/' + this.addForm.publicTheme + '/theme.png';
				    }else {
				    	this.addForm.publicThemeImg = gbs.portalFrontUrl + obj.projectCode + '/themes/' + this.addForm.publicTheme + "/theme.png";
				    }
				}else{
					let obj = {};
				    obj = this.themeOptions.find((item)=>{
				          return item.code === this.addForm.privateTheme;
				    });
				    if (obj.isSystem) {
				    	this.addForm.privateThemeImg = '../../../static/component/themes/' + this.addForm.privateTheme + '/theme.png';
				    }else {
				    	this.addForm.privateThemeImg = gbs.portalFrontUrl + obj.projectCode + '/themes/' + this.addForm.privateTheme + "/theme.png";
				    }
				}
			},
			handleDelLogo() {// 删除logo图片
				this.addForm.logo = null;
				this.addForm.logoRef = null;
			}
		},
		mounted() {
			
		},
		created(){

		}
	}
</script>

<style scoped="scoped">
	.image{width: 100%;height: 100%;background: red;position: relative;}
	.delete{position: absolute;right: 0;top: 0;display: none;}
	.image:hover .delete{display: block;line-height: 14px;}
</style>