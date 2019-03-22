<template>
	<div>
		<div>
			<el-form label-width="70px">
				<el-form-item :label="labelName">
					<el-input v-model="name" readonly></el-input>
				</el-form-item>
				<el-form-item label="站点">
					<el-select v-model="siteCode" placeholder="请选择站点" @change="handleSiteChange">
						<el-option v-for="item in siteOptions" :key="item.code" :label="item.name" :value="item.code">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
		</div>
		<div class='treeSelect'>
			<el-tree ref="tree" :data="dataTree" :default-checked-keys="checkedKeys" check-strictly default-expand-all show-checkbox node-key="id" :props="defaultProps">
			</el-tree>
		</div>
	</div>
</template>

<script>
	import {
		getAllSiteList,
		getSitePageTree,
		getAuthSitePageInfo,
		saveSitePageAuth
	} from '../../api/apiPortal';

	export default {
		data() {
			return {
				siteCode: '',
				grantId: '',
				grantType: '',
				name: name,
				labelName: '',
				siteOptions: [],
				dataTree: [],
				defaultProps: {
					children: 'children',
					label: 'text'
				},
				checkedKeys: []
			};
		},
		methods: {
			loadData(name, grantId, type) {
				//清空页面内容
				this.siteCode = '';
				this.dataTree = [];
				this.checkedKeys = [];

				if(type == '1') {
					this.labelName = '人员名称';
				} else {
					this.labelName = '角色名称';
				}
				this.name = name;
				this.grantType = type; //授权类型 0 角色  1用户
				this.grantId = grantId;
				//加载站点下拉选单
				this.getSiteList();
			},
			getSiteList() { //获取站点下拉列表
				getAllSiteList().then((data) => {
					this.siteOptions = data;
				});
			},
			selectItems(siteCode) { //获取站点下的所有私有页面
				//获取站点页面Tree 只取私有页面
				getSitePageTree({
					"siteCode": siteCode,
					"type": '0'
				}).then((data) => {
					if(data[0].children) {
						var jsonObj = data[0].children;
						console.info(jsonObj)
						this.dataTree = jsonObj;
					}else {
						this.dataTree = [];
					}
				});
			},
			getSitePageInfo() {
				//查询对应业务下的授权信息
				let params = {
					grantId: this.grantId,
					grantType: this.grantType
				}
				getAuthSitePageInfo(params).then((data) => {
					if(data && data != null) {
						console.info(data)
						this.checkedKeys = data;
					}
				});
			},
			handleSiteChange() {
				this.checkedKeys = [];
				this.getSitePageInfo();
				this.selectItems(this.siteCode);
			},
			saveSitePageAuth() {
				if(this.siteCode.length <= 0) {
					this.$message({
						type: 'error',
						message: '请选择站点！'
					});
				} else {
					let selKeys = this.$refs.tree.getCheckedKeys();
					var param = {
						ids: selKeys.join(","),
						grantId: this.grantId,
						grantType: this.grantType,
						siteCode: this.siteCode
					}
					saveSitePageAuth(param).then((data) => {
						this.$message({
							message: '保存成功！',
							type: 'success'
						});
						this.$emit('closeAndFresh');
					}).catch((err) => {
						this.$message({
							type: 'error',
							message: '保存失败!'
						});
					});
				}
			}
		},
		mounted() {},
		created() {}
	};
</script>

<style>
	.treeSelect {
		width: 100%;
		height: 300px;
		border: 1px solid #EAEAEA;
		overflow: auto;
	}
</style>