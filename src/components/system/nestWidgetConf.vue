<template>
	<div style="border: 1px solid;margin: 2px;height: 100%;width:100%;position: relative;">
		<i class="el-icon-error" style="cursor: pointer;position: absolute;top: 5px;right: 5px;" @click="handleClose()"></i>
		
		<div>
			<el-form ref="addForm" label-width="120px" style="margin-top: 15px;">
				<el-row>
					<el-col :span="10">
						<el-form-item label="嵌套widget标题">
							<el-input v-model="nestWidgetTitle" readonly size="small"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="14">
					</el-col>
				</el-row>
			</el-form>
		</div>
		
		<div style="width:100%;height: 500px;">
			<div :style="'width:'+ item.width +';background-color: #E9EEF3;border: solid 1px;display: inline-block;height: 100%;overflow:auto;'" v-for="item in layoutDatas">
				<widgetListForm :layoutPosition="item.position" pageUuId="" ywType="1" :nestUuId="nestUuId" :layoutCode="layoutCode"></widgetListForm>
				<div>
					<el-button @click="widgetConf(item.position)" style="width:100%"><i style="width: 100px;" class="el-icon-plus avatar-uploader-icon">添加widget</i></el-button>
				</div>
			</div>
		</div>
		
		<el-dialog size="small" :title="title" :visible.sync="widgetConfDialog" :close-on-click-modal="false" width="80%" top="8vh">
			<widgetConfEdit @closeAndFresh="closeAndFresh" ref="widgetConfInfo"></widgetConfEdit>

			<div slot="footer" class="dialog-footer">
				<el-button @click="widgetConfDialog = false">取 消</el-button>
				<el-button type="primary" @click="saveSubmitForm">确 定</el-button>
			</div>
		</el-dialog>
		
	</div>
</template>

<script>
	import {
		getLayoutDatas
	} from '../../api/apiPortal';
	
	import axios from '../../api/http'
	
	import widgetListForm from '@/components/system/widgetListForm.vue'
	import widgetConfEdit from '@/components/system/widgetConfEdit.vue';
	
	export default {
		components: {
			widgetListForm: widgetListForm,
			widgetConfEdit: widgetConfEdit
		},
		data(){
			
			return{
				layoutDatas:[],
				nestUuId:'',
				layoutCode:'',
				title: '新增',
				widgetConfDialog: false,
				nestWidgetTitle:''
			}
		},
		methods:{
			loadData(layoutCode,nestUuId,nestWidgetTitle){
				
				this.layoutCode = layoutCode;
				this.nestUuId = nestUuId;
				this.nestWidgetTitle = nestWidgetTitle;
				this.layoutDatas = [];
				
				//动态加载本地json文件,动态读取各个布局包中的布局json文件进行渲染
//				var url = this.GLOBAL.portalFrontUrl + 'layouts/'+ layoutCode;
//				axios.get(url + '/mainfest.json').then((data1) => {
//					this.layoutDatas = data1.data.params;
//				});
				
				this.refreshCur()
				
			},handleClose(){
				this.$emit('closeAndFresh'); 
				
			},widgetConf(position){
				
				this.widgetConfDialog = true;
				this.$nextTick(() => {
					this.$refs.widgetConfInfo.loadData('1',this.nestUuId,'', this.layoutCode, position, '');
				});
			},saveSubmitForm() { //保存
				this.$nextTick(() => {
					this.$refs.widgetConfInfo.saveSubmitForm();
				});
			},closeAndFresh() {
				this.widgetConfDialog = false;
				this.refreshCur();
			},refreshCur() {
				//动态加载本地json文件,动态读取各个布局包中的布局json文件进行渲染
//				var url = this.GLOBAL.portalFrontUrl + 'layouts/'+ this.layoutCode;
//				this.layoutDatas = [];
//				axios.get(url + '/mainfest.json').then((data1) => {
//					this.layoutDatas = data1.data.params;
//				});
				this.layoutDatas = [];
				getLayoutDatas({"layoutCode": this.layoutCode}).then((data) => {
					if (data && data != null){
						this.layoutDatas = data.params;
					}
				});
				
			}
		},
		mounted() {
			
		},
		created(){
			
		}
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