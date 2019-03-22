<template>
	<div>
	    <el-form :model="addForm" ref="addForm" :rules="rules" label-width="100px">
			<el-row>
				<el-col :span="8">
					<el-form-item label="widget高度" prop="widgetHeight">
						<template>
							<el-input-number v-model="addForm.widgetHeight" :min="1"></el-input-number>
						</template>
					</el-form-item>
				</el-col>
				
				<el-col :span="8">
					<el-form-item label="排序号" prop="sortNo">
						<template>
							<el-input-number v-model="addForm.sortNo" :min="1" :max="10"></el-input-number>
						</template>
					</el-form-item>
				</el-col>
				
				<el-col :span="8">
					<el-form-item label="标题" prop="title">
						<el-input v-model="addForm.title"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			
			<el-row>
				<el-col :span="8">
					<el-form-item label="widget" prop="widgetCode">
						<el-select v-model="addForm.widgetCode" placeholder="请选择widget" @change="handleWidgetChange">
							<el-option v-for="item in widgetOptions" :key="item.code" :label="item.name" :value="item.code">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				
				<el-col :span="8">
					<el-form-item label="嵌套布局" prop="nestLayoutCode">
						<el-select :disabled="isNestLayout" v-model="addForm.nestLayoutCode" placeholder="请选择嵌套布局">
							<el-option v-for="item in layoutOptions" :key="item.code" :label="item.name" :value="item.code">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				
				<el-col :span="8">
					<el-form-item label="修饰器">
						<el-select :disabled="!isNestLayout" v-model="addForm.decorateCode" placeholder="请选择修饰器">
							<el-option v-for="item in decorateOptions" :key="item.code" :label="item.name" :value="item.code">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</div>

</template>

<script>
	import {
		getWidgetList, getLayoutList, getDecorateList, queryCustomWidgetConfig, saveCustomWidgetConf, getCustomWidgetConfInfoById, delWidgetConf
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
					nestLayoutCode:'',
					widgetCode: '',
					sortNo:'',
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
		        selPageUuId: '',
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
			loadData(ywType,nestUuId,pageUuId,id){
				
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
					this.addForm.pageUuId = pageUuId;
					this.addForm.id = '';
					this.addForm.decorateCode = 'default';
					this.addForm.type = '0';
					this.addForm.uuId = nestUuId;
					
					this.selPageUuId = pageUuId;
	      			this.selType = ywType;
	      			this.selNestUuId = nestUuId;
					
				}else{//修改
					
					getCustomWidgetConfInfoById({id: id}).then((data) => { 
						this.$refs['addForm'].resetFields();
						
						this.addForm = data;
						
						if (ywType != '1'){
							if (this.addForm.nestLayoutCode != '' && this.addForm.nestLayoutCode != null){
								this.isNestLayout = false;
								this.addForm.type = '1';
							}else{
								this.isNestLayout = true;
								this.addForm.type = '0';
							}
						}
					});
				}
			},
			saveSubmitForm(){
				this.$refs.addForm.validate((valid) => {
					if(valid) {
						saveCustomWidgetConf(this.addForm).then((data) => {
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
				this.addForm.pageUuId = this.selPageUuId;
				this.addForm.uuId = this.selNestUuId;
				this.addForm.id = '';
				
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
			    		this.addForm.type = '1';
			    	}else{
			    		this.isNestLayout = true;
			    		this.addForm.decorateCode = 'default';
			    		this.addForm.type = '0';
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