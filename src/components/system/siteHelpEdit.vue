<template>
	<div>
		<el-form :model="addForm" ref="addHelpForm" :rules="rules" label-width="100px">
			 <el-form-item label="展示图片">
			 	<el-upload class="avatar-uploader" :action="fileUploadUrl" :show-file-list="false" :on-success="(res,file) => handleAvatarSuccess(res, file)" :before-upload="beforeAvatarUpload">
					<div v-if="!addForm.id">
						<div class="image" v-if="addForm.photo">
							<img v-if="dialogImageUrl" :src="dialogImageUrl" class="avatar">
							<div class="delete">
								<el-button type="danger" size="mini" icon="el-icon-delete" circle @click.stop="handleRemove"></el-button>&nbsp;&nbsp;&nbsp;&nbsp;
								<el-button type="success" size="mini" icon="el-icon-check" circle @click.stop="handlePictureCardPreview"></el-button>
							</div>
						</div>
						<i v-else class="el-icon-plus avatar-uploader-icon">展示图片</i>
					</div>
					<div v-if="addForm.id">
						<div class="image" v-if="addForm.photo">
							<img :src="dialogImageUrl" class="avatar">
							<div class="delete">
								<el-button type="danger" size="mini" icon="el-icon-delete" circle @click.stop="handleRemove"></el-button>&nbsp;&nbsp;&nbsp;&nbsp;
								<el-button type="success" size="mini" icon="el-icon-check" circle @click.stop="handlePictureCardPreview"></el-button>
							</div>
						</div>
						<img v-else src="../../../static/img/noImg.jpg" />
					</div>
				</el-upload>
			</el-form-item>
			
			<el-form-item label="标题">
				<el-input laceholder="请输入标题" v-model="addForm.title"> </el-input>
			</el-form-item>
			<el-form-item label="描述内容">
				<el-input type="textarea" :rows="8" laceholder="请输入内容" v-model="addForm.content"> </el-input>
			</el-form-item>
		</el-form>
		<div class="dialog-footer" style="text-align: right;" v-if="showHelpNodeType=='1'">
			 <el-button type="primary" @click="saveHelpForPage">确定</el-button>
			 <el-button type="primary" @click="deleteHelpForPage">删除</el-button>
		</div>
					
		<el-dialog :visible.sync="dialogVisible" append-to-body>
		  <img width="100%" :src="dialogImageUrl" alt="">
		</el-dialog>
	</div>
</template>

<script>
	import {gbs} from '../../config'
	import {
		saveSitePageHelp, getPageHelpInfoById
	} from '../../api/apiPortal';
	import E from 'wangeditor'
	export default {
		data() {
			return {
				showHelpNodeType:'',
				fileUploadUrl: gbs.fileServiceUrl + '/file/uploadFile',
				fileDownloadUrl:gbs.fileServiceUrl + '/file/download',
				addForm: {
					id: '',
					pageUuId: '',
					siteCode: '',
					type: '',
					photo: '',
					content: '',
					title:'',
					files: ''
				},
				dialogVisible: false,
				dialogImageUrl:'',
				rules: {
				}
			}
		},
		methods: {
			handleAvatarSuccess(res, file) {
				this.addForm.photo = res.referenceId;
				this.dialogImageUrl = URL.createObjectURL(file.raw);
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
			},
		    handlePictureCardPreview() {
		       this.dialogVisible = true;
		    },
			handleRemove() {// 删除图片
				this.addForm.photo = null;
				this.addForm.photoRef = null;
			},
			loadData(helpId,siteCode,pageUuId,type){ //type=0：站点  type=1:页面
				this.showHelpNodeType = type
				if(helpId==''){//新增
					this.$refs['addHelpForm'].resetFields();
					this.addForm.id = '';
					this.addForm.siteCode = siteCode;
					this.addForm.pageUuId = pageUuId;
					this.addForm.type = type;
					this.addForm.photo = '';
					this.addForm.content = '';
					this.addForm.files = '';
					this.addForm.title = '';
				}else{//修改
					getPageHelpInfoById({
						id: helpId
					}).then((data) => {
						this.$refs['addHelpForm'].resetFields();
						this.addForm = data;
						
						this.dialogImageUrl = this.fileDownloadUrl + '/' + this.addForm.photo
					});
				}
			},
			saveSubmitForm(){
				this.$refs.addHelpForm.validate((valid) => {
					if(valid) {
						saveSitePageHelp(this.addForm).then((data) => {
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
			}
		},
		mounted() {
		},
		created() {
		}
	}
</script>
<style scoped>
	.edit-class div:nth-child(2) {
		border: 1px solid #ccc;
	    border-top:none;
	    word-wrap:break-word;
	    word-break:break-all;
	}
	>>>.el-form-item {
	    margin-bottom: 35px;
	}
</style>