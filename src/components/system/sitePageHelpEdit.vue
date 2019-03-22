<template>
	<div>
		<el-form :model="addForm" ref="addHelpForm" :rules="rules" label-width="100px">
			 <el-form-item label="展示图片">
			 	<el-upload class="avatar-uploader" :action="fileUploadUrl" :show-file-list="false" :on-success="(res,file) => handleAvatarSuccess(res, file)" :before-upload="beforeAvatarUpload">
					<div v-if="!addForm.id">
						<div class="image" v-if="addForm.photo">
							<img v-if="dialogImageUrl" :src="dialogImageUrl" class="avatar">
							<div class="delete">
								<!--<i class="el-icon-close" style="color: #000;" @click.stop="handleRemove"></i>&nbsp;&nbsp;&nbsp;&nbsp;
								<i class="el-icon-search" style="color: #000;" @click.stop="handlePictureCardPreview"></i>-->
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
			<el-form-item label="上传附件">
				<el-upload
					class="upload-demo"
					:action="fileUploadUrl"
					:on-remove="handleFileRemove"
					multiple
					:limit="3"
					:on-exceed="handleExceed"
					:on-success="handleFileSuccess"
					:file-list="fileList">
					<el-button size="small" type="primary">点击上传</el-button>
				</el-upload>
			</el-form-item>
			<el-form-item label="描述内容">
				<div ref="editor" class="edit-class"></div>
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
	import {
		saveSitePageHelp, getPageHelpInfoById, getPageHelpByParams, delSitePageHelp,getFileNodesById
	} from '../../api/apiPortal';
	import {gbs} from '../../config'
	import E from 'wangeditor'
	export default {
		data() {
			return {
				showHelpNodeType:'',
				fileUploadUrl: gbs.fileServiceUrl + '/file/uploadFile',
				fileDownloadUrl:gbs.fileServiceUrl + '/file/download',
				fileList: [],
				editor:'',
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
			handleFileRemove(file, fileList) {
	    		fileList.splice(fileList.indexOf(file), 0)
	    		var tmpReferenceId = ''
	    		if (fileList.length > 0) {
	    			fileList.forEach((item,index) => {
	    				if(item.response){//新增的数据
	    					tmpReferenceId += item.response.referenceId + ','
	    				}else{//回显的数据
	    					tmpReferenceId += item.referenceId + ','
	    				}
					})
	    		}
	    		if (tmpReferenceId.length > 0)
	    		{
	    			tmpReferenceId = tmpReferenceId.substring(0,tmpReferenceId.length - 1)
	    		}
	    		this.$set(this.addForm, 'files', tmpReferenceId)
	 		},
	 		handleExceed(files, fileList) {
		        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
		    },
		    handleFileSuccess(response, file, fileList){
		    	var tmpReferenceId = ''
	    		if (fileList.length > 0) {
	    			fileList.forEach((item,index) => {
	    				if(item.response){//新增的数据
	    					tmpReferenceId += item.response.referenceId + ','
	    				}else{//回显的数据
	    					tmpReferenceId += item.referenceId + ','
	    				}
					})
	    		}
	    		if (tmpReferenceId.length > 0)
	    		{
	    			tmpReferenceId = tmpReferenceId.substring(0,tmpReferenceId.length - 1)
	    		}
				this.$set(this.addForm, 'files', tmpReferenceId)
		    },
			addHelpForPage(showHelpNodeType, siteCode, pageUuId){
				//根据pageUuId和siteCode 获取 帮助信息，若存在帮助信息则回填；否则新增
				getPageHelpByParams({
					siteCode: siteCode,
					pageUuId:pageUuId,
					Type:showHelpNodeType
				}).then((data) => {
					this.showHelpNodeType = showHelpNodeType;
					this.$refs['addHelpForm'].resetFields();
					
					if(data.length>0){//1.加载表单信息
						this.addForm = data[0];
						this.editor.txt.html(this.addForm.content)
						this.dialogImageUrl = this.fileDownloadUrl + '/' + this.addForm.photo
						
						if (this.addForm.files && this.addForm.files.length > 0) {
							let params = {
								referenceIds: this.addForm.files
							}
							getFileNodesById(params).then(data => {
								if(data) {
									this.fileList = data.data
								}
							}).catch(err => {
								console.info(err)
							}).finally(() => {
							})
				    	}
					}else{//初始化表单信息
						this.addForm.id = '';
						this.addForm.siteCode = siteCode;
						this.addForm.pageUuId = pageUuId;
						this.addForm.type = showHelpNodeType;
						this.addForm.photo = '';
						this.addForm.content = '';
						this.addForm.files = '';
						this.addForm.title = '';
						this.editor.txt.clear();
						this.fileList = [];
					}
				});
			},
			saveHelpForPage(){
				this.$refs.addHelpForm.validate((valid) => {
					if(valid) {
						saveSitePageHelp(this.addForm).then((data) => {
							this.$message({
								type: 'success',
								message: '保存成功!'
							});
							//重新赋值表单属性
							this.addForm = data;
						}).catch(() => {
							this.$message({
								type: 'error',
								message: '保存失败!'
							});
						});
					}
				});
			},
			deleteHelpForPage(){
				if(this.addForm.id == ''){
					 this.$message({
			            type: 'info',
			            message: '请先保存帮助信息!'
			          });
				}else{
					this.$confirm('您确定删除该帮助信息吗？', '提示', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          type: 'warning'
			        }).then(() => {
						var params = {
				      		id: this.addForm.id
				      	};
				       	delSitePageHelp(params).then((data)=>{
				       		this.$message({
					            message: '删除成功！',
					            type: 'success'
					        });
					        //初始化表单数据
				       		this.loadData('',this.addForm.siteCode,this.addForm.pageUuId,this.addForm.type);
				       	}).catch((err) => {
							this.$message({
								type: 'error',
								message: '删除失败!'
							});
						});
			        }).catch(() => {
			          this.$message({
			            type: 'info',
			            message: '已取消删除'
			          });
			        });
				}
			}
		},
		mounted() {
			this.editor = new E(this.$refs.editor)
			// 自定义菜单配置
			this.editor.customConfig.menus = [
				'head',  // 标题
			    'bold',  // 粗体
			    'fontSize',  // 字号
			    'fontName',  // 字体
			    'italic',  // 斜体
			    'underline',  // 下划线
			    'strikeThrough',  // 删除线
			    'foreColor',  // 文字颜色
			    'backColor',  // 背景颜色
			    'link',  // 插入链接
			    'list',  // 列表
			    'justify',  // 对齐方式
			    'quote',  // 引用
			    'emoticon',  // 表情
			    'image',  // 插入图片
			    'table',  // 表格
			    'video',  // 插入视频
			    'code',  // 插入代码
			    'undo',  // 撤销
			    'redo'  // 重复
			]
			this.editor.customConfig.onchange = (html) => {
				this.addForm.content = html
			}
			this.editor.customConfig.zIndex = 100
			this.editor.create()
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