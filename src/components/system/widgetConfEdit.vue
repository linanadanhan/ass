<template>
	<div>
	    <el-form :model="addForm" ref="addForm" :rules="rules" label-width="100px">
			<el-row>
				<el-col :span="6">
					<el-form-item label="布局位置">
						<el-input readonly v-model="addForm.layoutPosition"></el-input>
					</el-form-item>
				</el-col>

				<el-col :span="6">
					<el-form-item label="widget高度" prop="widgetHeight">
						<template>
							<el-input-number v-model="addForm.widgetHeight" :min="1"></el-input-number>
						</template>
					</el-form-item>
				</el-col>
				
				<el-col :span="6">
					<el-form-item label="排序号" prop="sortNo">
						<template>
							<el-input-number v-model="addForm.sortNo" :min="1" :max="10"></el-input-number>
						</template>
					</el-form-item>
				</el-col>
				
				<el-col :span="6">
				</el-col>
			</el-row>
			
			<el-row>
				<el-col :span="6">
					<el-form-item label="标题" prop="title">
						<el-input v-model="addForm.title"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="widget" prop="widgetCode">
						<el-select v-model="addForm.widgetCode" placeholder="请选择widget" @change="handleWidgetChange">
							<el-option v-for="item in widgetOptions" :key="item.code" :label="item.name" :value="item.code">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				
				<el-col :span="6">
					<el-form-item label="嵌套布局" prop="nestLayoutCode">
						<el-select :disabled="isNestLayout" v-model="addForm.nestLayoutCode" placeholder="请选择嵌套布局">
							<el-option v-for="item in layoutOptions" :key="item.code" :label="item.name" :value="item.code">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				
				<el-col :span="6">
					<el-form-item label="修饰器">
						<el-select :disabled="!isNestLayout" v-model="addForm.decorateCode" placeholder="请选择修饰器">
							<el-option v-for="item in decorateOptions" :key="item.code" :label="item.name" :value="item.code">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			
			<el-row>
				<el-col :span="6">
					<el-form-item label="">
						<el-checkbox v-model="addForm.isAllowSetting" size="small">是否自定义</el-checkbox>
					</el-form-item>
				</el-col>
				<el-col :span="6">

				</el-col>
				<el-col :span="6">

				</el-col>
				
				<el-col :span="6">
				</el-col>
			</el-row>
			
			<el-row>
				<el-col :span="6">
					<el-form-item label="上边距" prop="marginUp">
						<template>
							<el-input-number :disabled="!addForm.isAllowSetting" v-model="addForm.marginUp"></el-input-number>
						</template>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="下边距" prop="marginDown">
						<template>
							<el-input-number :disabled="!addForm.isAllowSetting" v-model="addForm.marginDown"></el-input-number>
						</template>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="左边距" prop="marginLeft">
						<template>
							<el-input-number :disabled="!addForm.isAllowSetting" v-model="addForm.marginLeft"></el-input-number>
						</template>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="右边距" prop="marginRight">
						<template>
							<el-input-number :disabled="!addForm.isAllowSetting" v-model="addForm.marginRight"></el-input-number>
						</template>
					</el-form-item>
				</el-col>
			</el-row>
			
			<el-row>
				<el-col :span="6">
					<el-form-item label="按钮名称" prop="buttonName">
						<el-input :disabled="!addForm.isAllowSetting" v-model="addForm.buttonName"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="操作URL" prop="handleUrl">
						<el-input :disabled="!addForm.isAllowSetting" v-model="addForm.handleUrl"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="" prop="showBorder">
						<el-checkbox :disabled="!addForm.isAllowSetting" v-model="addForm.showBorder" size="small">显示边框</el-checkbox>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="">
						<el-checkbox :disabled="!addForm.isAllowSetting" v-model="addForm.showTitle" size="small">显示标题</el-checkbox>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</div>

</template>

<script>
	import {
		getWidgetList, getLayoutList, getDecorateList, queryWidgetConfig, isExitWidgetCode, saveWidgetConf, getWidgetConfInfoById, delWidgetConf
	} from '../../api/apiPortal';
	
	export default {
		data(){
			var validateWidgetCode = (rule, value, callback) => {
		        if (value === '' && !this.addForm.isNested) {
		          callback(new Error('请选择widget！'));
		        } else {
		          callback();
		        }
		    };
		    
		    var validateNestLayoutCode = (rule, value, callback) => {
		        if (value === '' && !this.isNestLayout) {
		          callback(new Error('请选择嵌套布局！'));
		        } else {
		          callback();
		        }
		    };

			return{
				addForm:{
					id: '',
					pageUuId: '',
					layoutCode: '',
					nestLayoutCode:'',
					widgetCode: '',
					layoutPosition: '',
					sortNo:'',
					showTitle: false,
					showBorder: false,
					isAllowSetting:false,
					marginUp:'',
					marginDown:'',
					marginLeft:'',
					marginRight:'',
					buttonName:'',
					handleUrl:'',
					title:'',
					decorateCode:'default',
					type:'',
					widgetHeight:'70',
					uuId:''
				},
				widgetOptions:[],
				decorateOptions:[],
				layoutOptions:[],
				tableData:[],
				search:'',
				selPosition: '',
		        selPageUuId: '',
		        selLayoutCode: '',
		        selNestUuId:'',
		        isNestLayout:true,
		        selType:'',
				rules: {
		          widgetCode: [
		            {validator: validateWidgetCode, trigger: 'blur'}
		          ],
		          nestLayoutCode:[
		          	{validator: validateNestLayoutCode, trigger: 'blur'}
		          ],
		          title:[
		          	{required: true, message: '必填 ', trigger: 'blur'}
		          ]
		        },
			}
		},
		methods:{
			loadData(ywType,nestUuId,pageUuId,layoutCode,position,id){
				
				//获取Widget下拉选框信息
				getWidgetList().then((data) => {
					this.widgetOptions = data;
					this.widgetOptions.forEach((item,index) => {
						if (ywType == '1' && item.isNested){
							this.widgetOptions.splice(index,1);
						}
					})
				});
				
				//获取布局下拉选框信息
				getLayoutList().then((data) => {
					this.layoutOptions = data;
				});
				
				//获取修饰器下拉选框信息
				getDecorateList().then((data) => {
					this.decorateOptions = data;
				});
				
				if(id == ''){//新增
					this.$refs['addForm'].resetFields();
					this.addForm.layoutPosition = position;
					this.addForm.layoutCode = layoutCode;
					this.addForm.pageUuId = pageUuId;
					this.addForm.id = '';
					this.addForm.decorateCode = 'default';
					this.addForm.type = ywType;
					this.addForm.uuId = nestUuId;
					
					this.selPageUuId = pageUuId;
	      			this.selLayoutCode = layoutCode;
	      			this.selPosition = position;
	      			this.selType = ywType;
	      			this.selNestUuId = nestUuId;
					
				}else{//修改
					
					getWidgetConfInfoById({id: id}).then((data) => { 
						this.$refs['addForm'].resetFields();
						
						this.addForm = data;
						
						if (ywType != '1'){
							if (this.addForm.nestLayoutCode != '' && this.addForm.nestLayoutCode != null){
								this.isNestLayout = false;
							}else{
								this.isNestLayout = true;
							}
						}
					});
				}
			},
			saveSubmitForm(){
				this.$refs.addForm.validate((valid) => {
					if(valid) {
						
						saveWidgetConf(this.addForm).then((data) => {
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
			},resetForm(){
				this.$refs['addForm'].resetFields();
				this.addForm.layoutPosition = this.selPosition;
				this.addForm.layoutCode = this.selLayoutCode;
				this.addForm.pageUuId = this.selPageUuId;
				this.addForm.uuId = this.selNestUuId;
				this.addForm.id = '';
				
			},searchTableData(){
				
				var param = {
					search: this.search,
					pageUuId: this.selPageUuId,
					layoutCode: this.selLayoutCode,
					position: this.selPosition
				};
				
				queryWidgetConfig(param).then(data => {
					this.tableData = data;
				});
				
			},handleWidgetChange(value){//widget change事件
				
				this.addForm.nestLayoutCode = '';
				
				let obj = {};
			    obj = this.widgetOptions.find((item)=>{
			          return item.code === value;
			    });
			    
			    if(typeof(obj) != 'undefined'){
			    	if (obj.isNested){
			    		this.isNestLayout = false;
			    		this.addForm.decorateCode = 'none';
			    	}else{
			    		this.isNestLayout = true;
			    		this.addForm.decorateCode = 'default';
			    	}
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