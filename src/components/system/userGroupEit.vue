<template>
	<div>
		<el-form :model="addForm" ref="addForm" :rules="rules" label-width="100px">
			<el-form-item label="用户组名称" prop="groupName">
				<el-input v-model="addForm.groupName" clearable></el-input>
			</el-form-item>
			<el-form-item label="用户组描述" prop="describe">
				<el-input type="textarea" :rows="3" v-model="addForm.describe"></el-input>
			</el-form-item>
		</el-form>
		<el-row class="rolehead">
			<el-col :span="4">
				<h5>组织机构结构</h5></el-col>
			<el-col :span="9">
				<h5>待添加用户</h5></el-col>
			<el-col :span="2">
				<h5>操作</h5></el-col>
			<el-col :span="9">
				<h5>已添加用户</h5></el-col>
		</el-row>
		<el-row class="dialog" style="background:#f5f5f5;height:391px;">
			<el-col :span="4" style="height:391px;overflow:auto;">
				<el-select v-model="dimension" placeholder="请选择维度" @change="changeDimensionHandler">
					<el-option v-for="item in dimensionOptions" :key="item.value" :label="item.text" :value="item.value"></el-option>
				</el-select>
				<div class="showChild">
					<el-checkbox v-model="showChild" @change="check">显示子集</el-checkbox>
				</div>
				<el-tree :data="orgDataTree" ref="tree" :highlight-current=true @node-click="areaNodeClick" :default-expand-all=true :expand-on-click-node=false node-key="id" :props="defaultProps" style="background:#f5f5f5;">
				</el-tree>
			</el-col>
			<el-col :span="9">
				<el-table :data="waitPerson" @select="selectWaitPersonRow" @select-all="selectWaitPersonAll" border style="width: 100%" height="390">
					<el-table-column type="selection" width="55">
					</el-table-column>
					<el-table-column prop="name" align="center" label="用户">
					</el-table-column>
				</el-table>
			</el-col>
			<el-col :span="2">
				<div style="margin-top: 120px;">
					<el-button type="primary" @click="toGrant" icon="arrow-right" size="small" style="margin-left:7px;">添加<i class="el-icon-arrow-right el-icon--right"></i></el-button>
				</div>
				<div style="margin-top: 60px;">
					<el-button type="primary" @click="cancelGrant" icon="el-icon-arrow-left" size="small" style="margin-left:7px;">移除
					</el-button>
				</div>
			</el-col>
			<el-col :span="9">
				<el-table :data="havePerson" @select="selectHavePersonRow" @select-all="selectHavePersonAll" border style="width: 100%" height="390">
					<el-table-column type="selection" width="55">
					</el-table-column>
					<el-table-column prop="name" align="center" label="用户">
					</el-table-column>
				</el-table>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import {
		getOrgTreeByDimension,
		getTreeDataByConnect,
		getUserGroupById,
		isExitUserGroupName,
		saveUserGroup,
		getPersonsByOrgId,
		getPerson,
		getAllPerson
	} from '../../api/api';

	export default {
		props: ['dimensionOptions'],
		data() {
			//用户组名称唯一性校验
			var validateNameUnique = (rule, value, callback) => {
				if(value) {
					isExitUserGroupName({
						"C_GROUP_NAME": value,
						"C_GROUP_TYPE": 1,
						"id": this.addForm.id
					}).then((data) => {
						if(data) {
							callback();
						} else {
							callback(new Error('用户组名称已存在！'));
						}
					});
				} else {
					callback();
				}
			};
			return {
				showChild: true,
				waitPerson: [],
				havePerson: [],
				waitSelect: [],
				haveSelect: [],
				currentNode: '',
				orgDataTree: [],
				defaultProps: {
					children: 'children',
					label: 'text'
				},
				addForm: {
					id: '',
					groupType: 1,
					groupName: '',
					describe: '',
				},
				rules: {
					groupName: [{
							required: true,
							message: '必填 ',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 50,
							message: '长度在 1到 50个字符',
							trigger: 'change'
						},
						{
							validator: validateNameUnique,
							message: '此名称已被占用 ',
							trigger: 'change'
						}
					]
				},
				dimension: '',
			}
		},
		methods: {
			loadData(id) {
				this.empty();
				if(!id) { //新增
					this.addForm = {
						id: '',
						groupType: 1,
						groupName: '',
						describe: '',
					}
				} else { //修改
					getUserGroupById({
						id: id
					}).then((data) => {
						this.addForm = data;
					});
				}
			},
			empty(){
				this.orgDataTree=[];
				this.waitPerson = [];
				this.havePerson = [];
				this.dimension='';
				this.currentNode='';
				this.showChild=true;
			},
			changeDimensionHandler(val) { //选择维度
				this.dimension = val;
				//查询机构
				this.getTree(val);
			},
			getTree(val) { //得到机构tree
				let para = {
					dimension: val
				};
				getOrgTreeByDimension(para).then((data) => {
					this.orgDataTree = data;
					this.currentNode=data[0].id;
					this.selectAreaTreeNodeList(); //得到人
					
				});
			},
			selectWaitPersonAll(selection) {
				this.waitSelect = selection;
			},
			selectHavePersonAll(selection) {
				this.haveSelect = selection;
			},
			selectWaitPersonRow(selection, row) {
				this.waitSelect = selection;
			},
			selectHavePersonRow(selection, row) {
				this.haveSelect = selection;
			},
			toGrant() {
				if(!this.waitSelect || this.waitSelect.length == 0) {
					this.alertDialog('请选择需要添加的人员!', '提示');
				}
				for(let obj of this.waitSelect) {
					this.havePerson.push(obj);
				}
				for(let i = this.waitPerson.length - 1; i >= 0; i--) {
					for(let j = 0; j < this.waitSelect.length; j++) {
						if(this.waitPerson[i].id == this.waitSelect[j].id) {
							this.waitPerson.splice(i, 1);
							break;
						}
					}
				}
				this.waitSelect = [];
			},
			cancelGrant() { //取消
				if(!this.haveSelect || this.haveSelect.length == 0) {
					this.alertDialog('请选择需要取消的人员!', '提示');
				}
				for(let obj of this.haveSelect) {
					this.waitPerson.push(obj);
				}
				//删除
				for(let i = this.havePerson.length - 1; i >= 0; i--) {
					for(let j = 0; j < this.haveSelect.length; j++) {
						if(this.havePerson[i].id == this.haveSelect[j].id) {
							this.havePerson.splice(i, 1);
							break;
						}
					}
				}
				this.haveSelect = [];
			},
			areaNodeClick(data) {
				this.currentNode = data.id;
				this.selectAreaTreeNodeList();
			},
			selectAreaTreeNodeList() {  //得到未关联和已关联人员
				getAllPerson({
					dimension: this.dimension,
					orgId: this.currentNode,
					isCascade: this.showChild
				}).then((data) => { //查询未关联的
					if( this.addForm.id){
						this.getHavePerson(data);
					}else{
						this.waitPerson = data;
					}
				});
			},
			getHavePerson(waitPerson) {
				var havePerson = [];
				getPerson({
					groupId: this.addForm.id,
					dimension: this.dimension,
					orgId: this.currentNode,
					isCascade: this.showChild
				}).then((data) => { //查询已经关联的 //必须放在这里，否则有时候会错乱
					havePerson = data;
					if(havePerson && havePerson.length > 0) {
						for(var i = waitPerson.length - 1; i >= 0; i--) {
							for(var j = 0; j < havePerson.length; j++) {
								if(waitPerson[i].id == havePerson[j].id) {
									waitPerson.splice(i, 1);
									break;
								}
							}
						};
					}
					this.waitPerson = waitPerson; //这样避免左边的列表先显示，然后不显示，导致有时候会错乱
					this.havePerson = havePerson;
				});
			},
			saveData() {
//				if(this.havePerson.length == 0) {
//					this.alertDialog('已添加用户不能为空!', '提示');
//					return false;
//				}
				this.$refs.addForm.validate((valid) => {
					if(valid) {
						if(this.havePerson && this.havePerson.length>0){
							this.addForm.jsonPersonDtoList = JSON.stringify(this.havePerson);
						}
						this.addForm.currentOrgId=this.currentNode;
						saveUserGroup(this.addForm).then((data) => {
							this.$message({
								message: '保存成功！',
								type: 'success'
							});
							//回填
							if(data){
								this.addForm.id=data;
							}
//							this.$emit('closeAndFresh');
						}).catch((err) => {
							this.$message({
								type: 'error',
								message: '保存失败!'
							});
						});
					}
				});
			},
			check() {
				this.selectAreaTreeNodeList();
			},
			alertDialog(message, title) { //抽出公共的提示弹出框
				this.$alert(message, title, {
					confirmButtonText: '确定',
					type: 'info',
					callback: action => {}
				});
			}
		},
		mounted() {},
		created() {}
	}
</script>

<style scoped>

</style>