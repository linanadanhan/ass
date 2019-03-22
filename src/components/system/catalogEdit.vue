<template>
	<div>
		<el-form :model="addForm" ref="addForm" :rules="rules" label-width="100px">
				<el-row>
					<el-col :span="12">
						<el-form-item label="科目名称" prop="name">
							<el-input v-model="addForm.name"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="科目标识键" prop="rootkey">
							<el-input :readonly="isReadonly" v-model="addForm.rootkey"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				
				<el-row>
					<el-col :span="12">
						<el-form-item label="自动展开">
							<el-select v-model="addForm.isAutoExpend" filterable>
								<el-option label="否" v-bind:value='false'></el-option>
								<el-option label="是" v-bind:value='true'></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="状态">
							<el-select v-model="addForm.status" filterable>
								<el-option label="否" v-bind:value='false' ></el-option>
								<el-option label="是" v-bind:value='true'></el-option>
							</el-select>
					    </el-form-item >
					</el-col>
				</el-row>
				
				<el-row>
					<el-col :span="12">
						<el-form-item label="科目节点类型" prop="type">
							<el-input v-model="addForm.type"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="科目节点值" prop="value">
							<el-input v-model="addForm.value"></el-input>
					    </el-form-item >
					</el-col>
				</el-row>
				
				<el-row>
					<el-col :span="12">
						<el-form-item label="排序号">
							<template>
								<el-input-number v-model="addForm.sortNo" :min="1" :max="10"></el-input-number>
							</template>
						</el-form-item>
					</el-col>
					<el-col :span="12">
					</el-col>
				</el-row>

		</el-form>
	</div>
</template>

<script>
	import {
		saveCatalog,isExitRootKey,getCatalogInfoById
	} from '../../api/api';
	
	export default {
		data(){
			//科目标识键唯一性校验
			var validateRootkeyUnique = (rule, value, callback) => {
		        if (value) {
		          isExitRootKey({"rootkey": value,"id":this.addForm.parentId}).then((data) => {
		              if (data) {
		                callback(new Error('科目标识键已存在！'));
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
					parentId: '',
					cascadeid:'',
					name: '',
					rootkey: '',
					isAutoExpend: true,
					status: true,
					type: '',
					value: '',
					sortNo: ''				},
				isReadonly:false,
				rules: {
		          name: [
		            {required: true, message: '必填 ', trigger: 'change'},
		            {min: 1, max: 200, message: '长度在 1到 200个字符', trigger: 'change'}
		          ],
		          rootkey: [
		            {required: true, message: '必填 ', trigger: 'blur'},
		            {min: 1, max: 50, message: '长度在 1到 50个字符', trigger: 'change'},
		            {validator: validateRootkeyUnique, trigger: 'change'}
		          ],
		          sort: ''
		        },
			}
		},
		methods:{
			loadData(id, parentId, rootkey){
				if(id == ''){//新增
					this.$refs['addForm'].resetFields();
					this.addForm.id = '';
					this.addForm.parentId = parentId;
					this.addForm.isAutoExpend = true;
					this.addForm.rootkey = rootkey;
					this.addForm.status = true;
					
					if (rootkey != ''){
						this.isReadonly = true;
					}else{
						this.isReadonly = false;
					}
					
				}else{//修改
					this.isReadonly = true;
					
					getCatalogInfoById({id: id}).then((data) => {
						this.$refs['addForm'].resetFields();
						this.addForm = data;
					});
				}
			},
			saveData(){
				this.$refs.addForm.validate((valid) => {
					if(valid) {
						saveCatalog(this.addForm).then((data) => {
							this.$emit('closeAndFresh'); 
						});
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
</style>