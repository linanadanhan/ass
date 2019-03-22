<template>
	<div>
		<div>
			<el-form label-width="70px">
				<el-form-item :label="labelName">
					<el-input v-model="name" readonly></el-input>
				</el-form-item>
				<el-form-item label="站点">
					<el-select v-model="siteCode" filterable multiple placeholder="请选择站点">
						<el-option v-for="item in siteOptions" :key="item.code" :label="item.name" :value="item.code">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import {
		getAllSiteList,
		getAuthSiteInfo,
		saveSiteAuth
	} from '../../api/apiPortal';

	export default {
		data() {
			return {
				siteCode: [],
				grantId: '',
				grantType: '',
				name: name,
				labelName: '',
				siteOptions: [],
				defaultProps: {
					children: 'children',
					label: 'text'
				}
			};
		},
		methods: {
			loadData(name, grantId, type) {
				//清空页面内容
				this.siteCode = [];
				
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
				//查询对应业务下的授权信息
				let params = {
					grantId: grantId,
					grantType: type
				}
				getAuthSiteInfo(params).then((data) => {
					if(data && data != null) {
						console.info(data)
						this.siteCode = data;
					}
				});
			},
			getSiteList() { //获取站点下拉列表
				getAllSiteList().then((data) => {
					this.siteOptions = data;
				});
			},
			saveSiteAuth() {
				if(this.siteCode.length <= 0) {
					this.$message({
						type: 'error',
						message: '请选择站点！'
					});
				} else {
					var param = {
						sites: this.siteCode.join(","),
						grantId: this.grantId,
						grantType: this.grantType
					}
					saveSiteAuth(param).then((data) => {
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

</style>