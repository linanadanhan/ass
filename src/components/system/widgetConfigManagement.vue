<template>
	<div class="con_main">
		<div v-show="showDiv" style="width: 100%;height: 100%;">
			<div class="childBar" style="width: 9%;">
				<div class="showChild">
					<h3>站点信息</h3>
				</div>
				<el-menu default-active="1" @select="selectItems" class="el-menu-vertical-demo">
					<el-menu-item v-for="item in siteData" :key="item.code" :index="item.code"> {{ item.name }}</el-menu-item>
				</el-menu>
			</div>
	
			<div class="childBar" style="width: 15%;margin-left: 10px;">
				<div class="showChild">
					<h3>页面信息</h3>
				</div>
				<el-tree :data="dataTree" default-expand-all highlight-current ref="tree" @node-click="handleNodeClick" :expand-on-click-node=true node-key="id" :props="defaultProps">
				</el-tree>
			</div>
	
			<div class="childMain" style="width: 75%;">
				<div style="height: 100%;">
					<el-tabs v-model="activeName" @tab-click="handleTabClick">
						<el-tab-pane label="基本配置" name="first">
							<div :style="'width:'+ item.width +';background-color: #E9EEF3;border: solid 1px;display: inline-block;height: 500px;overflow:auto;float:left;'" v-for="item in layoutDatas">
								<widgetListForm @configNestWidget="configNestWidget" :layoutPosition="item.position" :pageUuId="selPageUuId" ywType="0" nestUuId="" :layoutCode="selLayoutCode"></widgetListForm>
								<div>
									<el-button @click="widgetConf(item.position)" style="width:100%"><i  style="width:100px" class="el-icon-plus avatar-uploader-icon">添加widget</i></el-button>
								</div>
							</div>
						</el-tab-pane>
						
						<el-tab-pane v-if="showPersonTabs" label="个性化配置" name="second">
							<div style="width:100%;background-color: #E9EEF3;border: solid 1px;display: inline-block;height: 500px;overflow:auto;">
								<customWidgetListForm @configNestWidget="configNestWidget" ref="customWidgetList" :pageUuId="selPageUuId" ywType="0" nestUuId=""></customWidgetListForm>
								<div>
									<el-button @click="customWidgetConf()" style="width:100%"><i  style="width:100px" class="el-icon-plus avatar-uploader-icon">添加widget</i></el-button>
								</div>
							</div>					
						</el-tab-pane>
					</el-tabs>
				</div>
				
				<!--基本配置widget-->
				<el-dialog size="small" :title="title" :visible.sync="widgetConfDialog" :close-on-click-modal="false" width="80%" top="8vh">
					<widgetConfEdit @closeAndFresh="closeAndFresh" ref="widgetConfInfo"></widgetConfEdit>
	
					<div slot="footer" class="dialog-footer">
						<el-button @click="widgetConfDialog = false">取 消</el-button>
						<el-button type="primary" @click="saveSubmitForm">确 定</el-button>
					</div>
				</el-dialog>
				
				<!--个性化配置widget-->
				<el-dialog size="small" :title="title" :visible.sync="customWidgetConfDialog" :close-on-click-modal="false" width="80%" top="8vh">
					<customWidgetConfEdit @closeAndFresh="closeAndFresh1" ref="customWidgetConfInfo"></customWidgetConfEdit>
	
					<div slot="footer" class="dialog-footer">
						<el-button @click="customWidgetConfDialog = false">取 消</el-button>
						<el-button type="primary" @click="saveCustomSubmitForm">确 定</el-button>
					</div>
				</el-dialog>
			</div>
		</div>
		
		<div v-show="!showDiv" style="height: 100%;width: 100%;">
			<nestWidgetConf @closeAndFresh="closeFresh" ref="nestWidgetConfInfo"></nestWidgetConf>
		</div>

	</div>
</template>

<script>
	import {
		getAllSiteList, getSitePageTree, getLayoutDatas
	}
	from '../../api/apiPortal';
	import widgetConfEdit from '@/components/system/widgetConfEdit.vue';
	import widgetListForm from '@/components/system/widgetListForm.vue'
	import nestWidgetConf from '@/components/system/nestWidgetConf.vue';

	import customWidgetListForm from '@/components/system/customWidgetListForm.vue';
	import customWidgetConfEdit from '@/components/system/customWidgetConfEdit.vue'	
	
	import axios from '../../api/http'
	export default {
		components: {
			widgetConfEdit: widgetConfEdit,
			widgetListForm: widgetListForm,
			nestWidgetConf:nestWidgetConf,
			customWidgetListForm:customWidgetListForm,
			customWidgetConfEdit:customWidgetConfEdit
		},
		data() {
			return {
				num: 100,
				siteData: [],
				widgetConfDialog: false,
				customWidgetConfDialog: false,
				title: '新增',
				dataTree: [],
				selSiteCode: '',
				selPageUuId: '',
				selLayoutCode: '',
				defaultProps: {
					children: 'children',
					label: 'text'
				},
				layoutDatas: [],
				showDiv:true,
				activeName:'first',
				showPersonTabs:false
			};
		},
		methods: {
			/**
			 * 点击树结构
			 */
			handleNodeClick(data) {
					//布局code 
					var isMenu = data.attributes.isMenu;
					var layoutCode = data.attributes.layoutCode;
					this.selPageUuId = data.attributes.uuId;
					this.selLayoutCode = layoutCode;
					//this.$refs.tree.getCurrentNode().backgroundColor = '#FF7F24';
					this.layoutDatas = [];
					this.activeName = "first";
					
					//是否允许个性化配置widget
					if (data.attributes.allowWidget == '1'){
						this.showPersonTabs = true;
					}else{
						this.showPersonTabs = false;
					}
					
					//仅页面才会显示有布局
					if (data.parentId != 0) {
						//动态加载本地json文件
						//var url = this.GLOBAL.portalFrontUrl + 'layouts/' + layoutCode;
						this.refreshCur();
//						axios.get(url + '/mainfest.json').then((data1) => {
//							this.layoutDatas = data1.data.params;
//						});
					}
				}, refreshCur() {
					//动态加载本地json文件,动态读取各个布局包中的布局json文件进行渲染
//					var url = this.GLOBAL.portalFrontUrl + 'layouts/' + this.selLayoutCode;
//					this.layoutDatas = [];
//					axios.get(url + '/mainfest.json').then((data1) => {
//						this.layoutDatas = data1.data.params;
//					});
					
					this.layoutDatas = [];
					getLayoutDatas({"layoutCode": this.selLayoutCode}).then((data) => {
						if (data && data != null){
							this.layoutDatas = data.params;
						}
					});
				},
				getSiteInfo() {
					getAllSiteList().then((data) => {
						this.siteData = data;
						this.selectItems(data[0].code);
					});
				}, selectItems(siteCode) {
					this.selSiteCode = siteCode;
					//获取站点页面Tree
					getSitePageTree({
						"siteCode": siteCode
					}).then((data) => {
						this.dataTree = data;
					});
				}, widgetConf(position) {
					this.widgetConfDialog = true;
					this.$nextTick(() => {
						this.$refs.widgetConfInfo.loadData('0','',this.selPageUuId, this.selLayoutCode, position, '');
					});
				}, closeAndFresh() {
					this.widgetConfDialog = false;
					this.refreshCur();
				}, saveSubmitForm() { //保存
					this.$nextTick(() => {
						this.$refs.widgetConfInfo.saveSubmitForm();
					});
				}, handleEdit(item) {

				},configNestWidget(item){//配置嵌套widget
					this.showDiv = false;
					this.$nextTick(() => {
	   						 this.$refs.nestWidgetConfInfo.loadData(item.C_NEST_LAYOUT_CODE,item.C_UU_ID,item.C_TITLE);
	   				});
				},closeFresh(){//配置嵌套widget子组件关闭
					this.showDiv = true;
				},handleTabClick(tab, event){//基本配置和widget个性化配置tab页签切换事件
					
					if (tab.name == "first"){
						this.refreshCur();
					}else{
						this.$nextTick(() => {
		   					this.$refs.customWidgetList.getDataTable();
		   				});
					}
					this.activeName = tab.name;
				},customWidgetConf() {
					
					this.customWidgetConfDialog = true;
					this.$nextTick(() => {
						this.$refs.customWidgetConfInfo.loadData('0','',this.selPageUuId,'');
					});
				},saveCustomSubmitForm(){
					this.$nextTick(() => {
						this.$refs.customWidgetConfInfo.saveSubmitForm();
					});					
				},closeAndFresh1() {
					this.customWidgetConfDialog = false;
					this.$nextTick(() => {
	   					this.$refs.customWidgetList.getDataTable();
	   				});
				}
		},
		mounted() {
			this.getSiteInfo();
			var childMainHeight = $('.childMain').height();
			this.tableHeight = childMainHeight - 92;
		},
	}
</script>

<style>
	.avatar-uploader-icon {
		font-size: 14px;
		color: #8c939d;
		width: 150px;
		height: 50px;
		line-height: 50px;
		text-align: center;
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
	}
	
	.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
		background-color: #E0FFFF;
	}
</style>