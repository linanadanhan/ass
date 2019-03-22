<template>
	<div class="main" style="height: 100%;position: relative;margin: 2px;">
		<i class="el-icon-error" style="cursor: pointer;position: absolute;top: 5px;right: 5px;z-index: 100;" @click="handleClose()"></i>
		<div class="mainLeft">
			<!--<div class="showChild">
				<el-button type="text" icon="el-icon-circle-plus-outline" @click="addSitePage"><span style="font-size: 13px;">新增</span></el-button>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				<el-button type="text" icon="el-icon-circle-close-outline" @click="delSitePage"><span style="font-size: 13px;">删除</span></el-button>
			</div>-->

			<el-tree
				:data="dataTree"
				default-expand-all
				highlight-current
				ref="tree"
				@node-click="handleNodeClick"
				:expand-on-click-node=false
				node-key="id"
				:props="defaultProps"
				@node-drag-start="handleDragStart"
				@node-drag-enter="handleDragEnter"
				@node-drag-leave="handleDragLeave"
				@node-drag-over="handleDragOver"
				@node-drag-end="handleDragEnd"
				@node-drop="handleDrop"
				draggable
				:allow-drop="allowDrop"
				:allow-drag="allowDrag">
			  <span class="custom-tree-node" slot-scope="{ node, data }" @mouseover="treeMouseOver(data, dataTree)">
		        <span>{{ node.label }}</span>
		        <span v-if="data.showAddBtn">
		          <el-button
		            type="text"
		            icon="el-icon-circle-plus-outline"
		            title="添加"
		            @click.stop="() => append(data)">
		          </el-button>
		        </span>
		      </span>
			</el-tree>
		</div>
		<div class="mainRight">
			<el-tabs v-model="activeName" @tab-click="handleTabClick">
				<el-tab-pane v-if="showPageInfoTabs" label="基本信息" name="first">
					<el-form ref="addForm" :model="addForm" :rules="rules" label-width="110px">
						<el-row>
							<el-col :span="12">
								<el-form-item label="页面名称" prop="name">
									<el-input v-model="addForm.name"></el-input>
									<el-checkbox v-model="addForm.isMenu" size="small">作为菜单项</el-checkbox>
									<el-checkbox v-model="addForm.isLink" size="small">外部链接</el-checkbox>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="页面path" prop="path">
									<el-input :disabled="addForm.isLink" v-model="addForm.path"></el-input>
									{{addForm.cascade}}{{addForm.path}}
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item label="主题样式" prop="themeStyle">
									<el-select :disabled="addForm.isMenu || addForm.isLink" v-model="addForm.themeStyle" placeholder="请选择主题样式">
										<el-option v-for="item in themeStyleOptions" :key="item.value" :label="item.text" :value="item.value">
										</el-option>
									</el-select>
								</el-form-item>

							</el-col>
							<el-col :span="12">
								<el-form-item label="页面布局" prop="layoutCode">
									<el-select :disabled="addForm.isMenu || addForm.isLink" v-model="addForm.layoutCode" placeholder="请选择页面布局" @change="handleLayoutChange">
										<el-option v-for="item in layoutOptions" :key="item.code" :label="item.name" :value="item.code">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item label="排序号">
									<template>
										<el-input-number v-model="addForm.sortNo" :min="1"></el-input-number>
									</template>
								</el-form-item>
								<el-form-item label="导航菜单栏隐藏">
									<el-select :disabled="addForm.isMenu || addForm.isLink" v-model="addForm.navHidden" filterable>
										<el-option label="否" value="0"></el-option>
										<el-option label="是" value="1"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item>
									<div class="up-file">
										<img v-if="addForm.layoutCode" :src="addForm.layoutCodeImg" class="avatar">
										<img v-else src="../../../static/img/noLayoutImg.jpg" />
									</div>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item label="widget个性配置">
									<el-select :disabled="addForm.isMenu || addForm.isLink" v-model="addForm.allowWidget" filterable>
										<el-option label="否" value="0"></el-option>
										<el-option label="是" value="1"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="布局个性配置">
									<el-select :disabled="addForm.isMenu || addForm.isLink" v-model="addForm.allowLayout" filterable>
										<el-option label="否" value="0"></el-option>
										<el-option label="是" value="1"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="24">
								<el-form-item label="链接地址">
									<el-input :disabled="!addForm.isLink" v-model="addForm.linkUrl"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
					<div class="dialog-footer" style="text-align: right;">
						<!--<el-button type="primary" @click="designSitePage">设计</el-button>-->
						<el-button type="primary" @click="saveData">确 定</el-button>
						<el-button type="primary" @click="copyData">复制</el-button>
						<el-button type="primary" @click="delData">删除</el-button>
						<el-button type="primary" @click="handlePreview">预览</el-button>
					</div>
				</el-tab-pane>
				<!--<el-tab-pane v-if="showPageConfTabs" label="页面配置" name="second">
					<sitePageConf ref="sitePageConf"></sitePageConf>
				</el-tab-pane>-->
				<el-tab-pane v-if="showPageHelpTabs" :label="showHelpNodeType=='0'?'引导页配置':'帮助配置'" name="third">
					<div  v-if="showHelpNodeType=='0'" >
						<sitePageHelp ref="sitePageHelp" :currentNode="currentNode" :showHelpNodeType="showHelpNodeType"></sitePageHelp>
					</div>
					<div class="mainBottom" v-if="showHelpNodeType=='1'">
						<sitePageHelpEdit ref="sitePageHelpEdit"></sitePageHelpEdit>
					</div>
				</el-tab-pane>
			</el-tabs>

			<el-dialog size="small" title="新增页面" :visible.sync="addPageDialog" :close-on-click-modal="false" width="50%" top="8vh">
				<addPageForm @closeAndFresh="closeAddPageFresh" ref="addPageInfo"></addPageForm>
				<div class="dialog-footer" style="text-align: right;margin-top: 10px;">
					<el-button @click="addPageDialog = false">取 消</el-button>
					<el-button type="primary" @click="saveAddPage">确 定</el-button>
				</div>
			</el-dialog>

			<!--复制页面form-->
			<el-dialog size="small" title="页面复制" :visible.sync="pageCopyDialog" :close-on-click-modal="false" width="30%" top="7vh">
				<el-form :model="copyForm" ref="copyForm" :rules="rules" label-width="80px">
					<el-form-item label="页面名称" prop="name">
						<el-input v-model="copyForm.name"></el-input>
					</el-form-item>
				</el-form>
				<div class="dialog-footer" style="text-align: right;margin-top: 10px;">
					<el-button @click="pageCopyDialog = false">取 消</el-button>
					<el-button type="primary" @click="savePageCopy">确 定</el-button>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import { getSitePageTree, getSitePageInfoById, getLayoutList, getThemeList, saveSitePage, delSitePage, isExitPagePath, saveSitePageTree, copyPage } from '../../api/apiPortal';
	import { getDicItemListByDicKey } from '../../api/api';

	import {gbs} from '../../config'

	import sitePageConf from '@/components/system/sitePageConf.vue'
	import addPageForm from '@/components/system/addPageForm.vue'
	import sitePageHelp from '@/components/system/sitePageHelp.vue'
	import sitePageHelpEdit from '@/components/system/sitePageHelpEdit.vue'

	export default {
		components: {
			sitePageConf:sitePageConf,
			addPageForm: addPageForm,
			sitePageHelp: sitePageHelp,
			sitePageHelpEdit: sitePageHelpEdit
		},
		data() {
			var validateLayoutCode = (rule, value, callback) => {
				if(value === '' && !this.addForm.isMenu) {
					callback(new Error('请选择页面布局！'));
				} else {
					callback();
				}
			};
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
						"type": this.currentNode.attributes.type,
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
				pageCopyDialog: false,
				addPageDialog:false,
				showPageInfoTabs:false,
				showPageConfTabs:false,
				showPageHelpTabs:false,
				showHelpNodeType:'', //点击左边树节点的类型 0=站点 1=页面
				activeName: 'first',
				currentNode: {},
				dataTree: [],
				selIds: [],
				themeOptions: [],
				layoutOptions: [],
				themeStyleOptions: [],
				defaultProps: {
					children: 'children',
					label: 'text'
				},
				siteId: '',
				siteCode: '',
				copyForm: {
					name: ''
				},
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
					layoutCode: [{
						validator: validateLayoutCode,
						trigger: 'blur'
					}]
				}
			};
		},
		methods: {
			  handleDragStart(node, ev) {
			    //console.log('drag start', node);
			  },
			  handleDragEnter(draggingNode, dropNode, ev) {
			    //console.log('tree drag enter: ', dropNode.label);
			  },
			  handleDragLeave(draggingNode, dropNode, ev) {
			    //console.log('tree drag leave: ', dropNode.label);
			  },
			  handleDragOver(draggingNode, dropNode, ev) {
			    //console.log('tree drag over: ', dropNode.label);
			  },
			  handleDragEnd(draggingNode, dropNode, dropType, ev) {
			    //console.log('tree drag end: ', dropNode && dropNode.label, dropType);
			  },
			  handleDrop(draggingNode, dropNode, dropType, ev) {
			  	// 拖拽成功完成时触发的事件 TODO
			    console.info('111111', draggingNode, dropNode, dropType)
			    // 校验拖动后的页面path是否已存在放后台校验
			    let parentId
			    if (dropType === 'before' || dropType === 'after') {
			    	parentId = dropNode.data.parentId
			    }else {
			    	parentId = dropNode.data.id
			    }

			    let param = {
			    	"siteCode": this.siteCode,
			    	"draggingNode": JSON.stringify(draggingNode.data),
			    	"dataTree": JSON.stringify(this.dataTree),
			    	"parentId": parentId
			    }
			    //保存拖动后的页面tree
    			saveSitePageTree(param).then((data) => {
    				console.info(data)
					this.$message({
						message: '拖动页面成功!',
						type: 'success'
					});
				}).catch((err) => {
					this.$message({
						type: 'error',
						message: '拖动页面失败!'
					});
				});
			  },
			  allowDrop(draggingNode, dropNode, type) {
			  	//公开页面和私有页面前后不能插入
			  	if (dropNode.data.id === '1' || dropNode.data.id === '2') {
			  		return type != 'prev' && type != 'next'
			  	}else{
			  		return true;
			  	}
			  },
			  allowDrag(draggingNode) {
			  	 //校验公开页面和私有页面节点不能移动
			  	 if (draggingNode.data.id === '2' || draggingNode.data.id === '1') {
			  	 	this.$message({
						type: 'info',
						message: '该节点不能拖动！'
					});
			  	 	return false
			  	 }else{
			  	 	return true
			  	 }
			  },
			closeAddPageFresh(){
				this.addPageDialog = false;
				//刷新站点页面Tree
				getSitePageTree({
					"siteCode": this.siteCode
				}).then((data) => {
					this.initData(data);
					this.dataTree = data;
					this.initForm();
					this.showPageConfTabs = false;
					this.showPageInfoTabs = false;
					this.showPageHelpTabs = false;
				});
			},
			saveAddPage(){
				this.$nextTick(() => {
					this.$refs.addPageInfo.saveSitePage();
				});
			},
		    append(data) { // 新增页面
		    	this.addPageDialog = true;
		    	this.$nextTick(() => {
   					this.$refs.addPageInfo.loadData(this.siteCode, data);
   				});
//		    	this.$prompt('请输入页面名称', '', { inputPattern:/^\S+$/,inputErrorMessage: '页面名称不能为空！' }).then((result) => {
//		    		this.initForm();
//		    		console.info(data)
//		    		this.addForm.name = result.value;
//					this.addForm.parentId = data.id;
//					this.addForm.siteCode = this.siteCode;
//					this.addForm.type = data.attributes.type;
//
//					if(data.parentId != 0) {
//						this.addForm.cascade = data.attributes.cascade + data.attributes.path + '/';
//					}else{
//						this.addForm.cascade = '/';
//					}
//  				saveSitePage(this.addForm).then((data) => {
//						this.$message({
//							message: '保存页面成功!',
//							type: 'success'
//						});
//						//刷新站点页面Tree
//						getSitePageTree({
//							"siteCode": this.siteCode
//						}).then((data) => {
//							this.initData(data);
//							this.dataTree = data;
//							this.initForm();
//							this.showPageConfTabs = false;
//							this.showPageInfoTabs = false;
//							this.showPageHelpTabs = false;
//						});
//					}).catch((err) => {
//						this.$message({
//							type: 'error',
//							message: '新增页面失败!'
//						});
//					});
//		    });

		    },
			loadData(id, siteCode) {
				this.currentNode = {};
				this.showPageConfTabs = false;
				this.showPageInfoTabs = false;
				this.showPageHelpTabs = false;
				this.siteId = id;
				this.siteCode = siteCode;
				this.initForm();
				//获取站点页面Tree
				getSitePageTree({
					"siteCode": siteCode
				}).then((data) => {
					this.initData(data);
					this.dataTree = data;
				});

				//获取主题下拉选框信息
				getThemeList().then((data) => {
					this.themeOptions = data;
				});

				//获取布局下拉选框信息
				getLayoutList().then((data) => {
					this.layoutOptions = data;
				});

				let param = {
					dicKey: 'theme_styles'
				};

				getDicItemListByDicKey(param).then((data) => {
					this.themeStyleOptions = data;
				});
			},
			initData(data){
				for(var i in data) {
					data[i].showAddBtn = false;
					if(data[i].children) {
						this.initData(data[i].children);
					}
				}
			},
			initForm() {
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
					sortNo: 1
				}
			},
			addSitePage() { //新增站点页面
				if(jQuery.isEmptyObject(this.currentNode)) {
					this.$message.error('请选择父页面!');
				} else {
					this.initForm();
					this.$refs['addForm'].resetFields();
					this.addForm.cascade = this.currentNode.attributes.cascade + this.currentNode.attributes.path + '/';
				}
			},
			delSitePage() { //删除站点页面
				if(jQuery.isEmptyObject(this.currentNode)) {
					this.$message.error('请选择要删除的页面!');
				} else {
					this.$confirm('此操作将删除该该页面及其下所有子页面, 是否继续', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						var params = {
							id: this.currentNode.id,
							parentId: this.currentNode.parentId,
							siteCode: this.siteCode
						};
						delSitePage(params).then((data) => {
							this.$message({
								message: '删除页面成功!',
								type: 'success'
							});
							//刷新站点页面Tree
							getSitePageTree({
								"siteCode": this.siteCode
							}).then((data) => {
								this.initData(data);
								this.dataTree = data;
								this.initForm();
								this.showPageConfTabs = false;
								this.showPageInfoTabs = false;
								this.showPageHelpTabs = false;
							});
						}).catch((err) => {
							this.$message({
								type: 'error',
								message: '删除页面失败!'
							});
						});
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消删除'
						});
					});
				}
			},
			delData(){//删除页面
				this.delSitePage();
			},
			getChildIds(data) {
				for(var i in data) {
					this.selIds.push(data[i].id)
					console.info(data[i].id);
					if(data[i].children) {
						this.getChildIds(data[i].children);
					}
				}
			},
			handlePreview() { //站点预览
				var previewUrl = "";
				var path = window.location.href
				if(jQuery.isEmptyObject(this.currentNode)) { //预览整个站点
					previewUrl = path.substr(0,path.indexOf('admin')) + "#/" + this.siteCode + '/public';
				} else {
					var prefix = "";
					if(this.currentNode.attributes.type == '0') {
						prefix = '/private' + this.currentNode.attributes.cascade + this.currentNode.attributes.path;
					} else {
						prefix = '/public' + this.currentNode.attributes.cascade + this.currentNode.attributes.path;
					}
					previewUrl = path.substr(0,path.indexOf('admin')) + "#/" + this.siteCode + prefix;
				}
				if(previewUrl != '') {
					window.open(previewUrl);
				}
			},
			designSitePage() { //站点页面设计
				if(jQuery.isEmptyObject(this.currentNode) || this.currentNode.parentId == '0') {
					this.$message.error('请选择要设计的页面!');
				} else {

				}
			},
			handleNodeClick(data) { //点击树节点
				this.currentNode = data;
				this.initForm();
				//根据页面ID获取页面信息 排除公共页面和私有页面两节点
				if(data.parentId != 0) {
					getSitePageInfoById({
						id: data.id
					}).then((data) => {
						this.addForm = data;
						this.$refs['addForm'].resetFields();
						let obj = {};
						obj = this.themeOptions.find((item) => {
							return item.code === data.themeCode;
						});

						let obj1 = {};
						obj1 = this.layoutOptions.find((item) => {
							return item.code === data.layoutCode;
						});

						if (!jQuery.isEmptyObject(obj)){
							if (obj.isSystem){
								this.addForm.themeCodeImg = '../../../static/component/themes/' + data.themeCode + '/theme.png';
							}else{
								this.addForm.themeCodeImg = gbs.portalFrontUrl + obj.projectCode + '/themes/' + data.themeCode + '/theme.png';
							}
						}

						if (!jQuery.isEmptyObject(obj1)) {
							if (obj1.isSystem){
								this.addForm.layoutCodeImg = '../../../static/component/layouts/' + data.layoutCode + '/bg.png';
							}else{
								this.addForm.layoutCodeImg = gbs.portalFrontUrl + obj1.projectCode + '/layouts/' + data.layoutCode + '/bg.png';
							}
						}
					});
					this.addForm.cascade = this.currentNode.attributes.cascade;
					this.activeName = "first";
					this.showPageConfTabs = true;
					this.showPageInfoTabs = true;
					this.showPageHelpTabs = true;
					this.showHelpNodeType = '1';
				} else {
					this.addForm.cascade = '/';
					this.showPageConfTabs = false;
					this.showPageInfoTabs = false;
					this.showPageHelpTabs = true;
					this.showHelpNodeType = '0';

					this.activeName = 'third';
					this.$nextTick(() => {
 						 this.$refs.sitePageHelp.loadData();
 					});
				}
			},
			saveData() {
				if(jQuery.isEmptyObject(this.currentNode)) {
					this.$message.error('请选择父页面!');
				} else {
					this.$refs.addForm.validate((valid) => {
						if(valid) {
							if(this.addForm.id == '') {
								this.addForm.parentId = this.currentNode.id;
								this.addForm.siteCode = this.siteCode;
								this.addForm.type = this.currentNode.attributes.type;
							}
							saveSitePage(this.addForm).then((data) => {
								this.$message({
									message: '保存页面成功!',
									type: 'success'
								});
								//刷新站点页面Tree
								getSitePageTree({
									"siteCode": this.siteCode
								}).then((data) => {
									this.initData(data);
									this.dataTree = data;
									this.initForm();
									this.showPageConfTabs = false;
									this.showPageInfoTabs = false;
									this.showPageHelpTabs = false;
								});
							}).catch((err) => {
								this.$message({
									type: 'error',
									message: '新增页面失败!'
								});
							});
						}
					});
				}
			},
			handleThemeChange() { //主题change
				let obj = {};
				obj = this.themeOptions.find((item) => {
					return item.code === this.addForm.themeCode;
				});

				if (obj.isSystem){
					this.addForm.themeCodeImg = '../../../static/component/themes/' + this.addForm.themeCode + '/theme.png';
				}else{
					this.addForm.themeCodeImg = gbs.portalFrontUrl + obj.projectCode + '/themes/' + this.addForm.themeCode + '/theme.png';
				}
			},
			handleLayoutChange() { //布局change
				let obj1 = {};
				obj1 = this.layoutOptions.find((item) => {
					return item.code === this.addForm.layoutCode;
				});

				if (obj1.isSystem){
					this.addForm.layoutCodeImg = '../../../static/component/layouts/' + this.addForm.layoutCode + '/bg.png';
				}else{
					this.addForm.layoutCodeImg = gbs.portalFrontUrl + obj1.projectCode + '/layouts/' + this.addForm.layoutCode + '/bg.png';
				}
			},
			alertDialog(message, title) { //抽出公共的提示弹出框
				this.$alert(message, title, {
					confirmButtonText: '确定',
					type: 'info',
					callback: action => {}
				});
			},handleClose(){
				this.$emit('closeAndFresh');
			},handleTabClick(tab, event){
				if (tab.name == "first"){
					this.activeName = "first";
					this.handleNodeClick(this.currentNode);
				}else if (tab.name == "second") {
					this.activeName = "second";
					this.$nextTick(() => {
 						 this.$refs.sitePageConf.loadData(this.currentNode.attributes.uuId);
 					});
				}else if (tab.name == "third") {
					this.activeName = "third";
					this.$nextTick(() => {
						if(this.showHelpNodeType == '0'){
							this.$refs.sitePageHelp.loadData();
						}else if(this.showHelpNodeType == '1'){
							this.$refs.sitePageHelpEdit.addHelpForPage(this.showHelpNodeType, this.currentNode.attributes.siteCode, this.currentNode.attributes.uuId);
						}


 					});
				}
			},
			treeMouseOver(node,data) {
				for(var i in data) {
					if (node.id == data[i].id){
						data[i].showAddBtn = true;
					}else{
						data[i].showAddBtn = false;
					}
					if(data[i].children) {
						this.treeMouseOver(node, data[i].children);
					}
				}
			},
			copyData() {// 复制页面
				if(jQuery.isEmptyObject(this.currentNode)) {
					this.$message.error('请选择父页面!');
				} else {
					this.pageCopyDialog = true;
				}
			},
			savePageCopy() {// 保存复制页面数据
				this.$refs.copyForm.validate((valid) => {
					if(valid) {
						let params = {
							id: this.currentNode.id,
							name: this.copyForm.name
						}
						copyPage(params).then((data) => {
							if(data.status === 200) {
								this.pageCopyDialog = false
								// 复制成功刷新列表
								//刷新站点页面Tree
								getSitePageTree({
									"siteCode": this.siteCode
								}).then((data) => {
									this.initData(data);
									this.dataTree = data;
									this.initForm();
									this.showPageConfTabs = false;
									this.showPageInfoTabs = false;
								});
								this.$message({
									message: '复制成功',
									type: 'success'
								});
							} else {
								this.$message({
									message: data.data,
									type: 'error'
								});
							}
						}).catch((e) => {
							console.info(e)
							this.$message({
								message: '复制页面失败:' + e,
								type: 'error'
							});
						});
					}
				})
			}
		},
		mounted() {
		}
	}
</script>

<style scoped>
	.el-dropdown-link {
		cursor: pointer;
		color: #409EFF;
	}

	.el-icon-arrow-down {
		font-size: 8px;
	}
	.addNode {
		display: none;
	}
	.addNode:hover {
		display: block;
	}
	.main{
		height: 100%;
		display: flex;

	}
	.mainLeft{width: 200px;overflow:auto;background: #f6f7fb;}
	.mainLeft .el-tree{background: #f6f7fb;}
	.mainRight{flex: 1;overflow-y: auto;padding:0 10px;}
	.mainBottom{height:500px;overflow-y: auto;}
</style>
