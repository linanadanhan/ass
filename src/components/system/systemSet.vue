<template>
	<div>
		<div class="sidebar">
			<el-menu :default-active="$route.path" router class="el-menu-vertical-demo" ref="menu" background-color="#324157" text-color="#fff" active-text-color="#409EFF">
				<el-menu-item v-cosSecurity="'vir_orgManage'" index="/manageHome/systemSet/orgManagement">
					<el-tooltip v-if="isCollapse==true" class="item" effect="dark" content="机构管理" placement="right"><i class="iconfont icon-danweiguanli"></i></el-tooltip><i v-else class="iconfont icon-danweiguanli"></i>机构管理</el-menu-item>
				<el-menu-item v-cosSecurity="'vir_personManage'" index="/manageHome/systemSet/personManagement">
					<el-tooltip v-if="isCollapse==true" class="item" effect="dark" content="人员管理" placement="right"><i class="iconfont icon-renyuanguanli"></i></el-tooltip><i v-else class="iconfont icon-renyuanguanli"></i> 人员管理</el-menu-item>
				<el-menu-item v-cosSecurity="'vir_roleManage'" index="/manageHome/systemSet/roleManagement">
					<el-tooltip v-if="isCollapse==true" class="item" effect="dark" content="角色管理" placement="right"><i class="iconfont icon-jiaose2"></i></el-tooltip><i v-else class="iconfont icon-jiaose2"></i> 角色管理</el-menu-item>
				<el-menu-item v-cosSecurity="'vir_permissionManage'" index="/manageHome/systemSet/privilegeManagement">
					<el-tooltip v-if="isCollapse==true" class="item" effect="dark" content="权限管理" placement="right"><i class="iconfont icon-quanxian1"></i></el-tooltip><i v-else class="iconfont icon-quanxian1"></i> 权限管理</el-menu-item>
				<el-menu-item v-cosSecurity="'vir_paramManage'" index="/manageHome/systemSet/parameterManagement">
					<el-tooltip v-if="isCollapse==true" class="item" effect="dark" content="参数管理" placement="right"><i class="iconfont icon-canshu1"></i></el-tooltip><i v-else class="iconfont icon-canshu1"></i> 参数管理</el-menu-item>
				<el-menu-item v-cosSecurity="'vir_dataDicManage'" index="/manageHome/systemSet/dataDictionary">
					<el-tooltip v-if="isCollapse==true" class="item" effect="dark" content="数据字典" placement="right"><i class="iconfont icon-shujuzidian"></i></el-tooltip><i v-else class="iconfont icon-shujuzidian"></i> 数据字典</el-menu-item>
				<el-menu-item v-cosSecurity="'vir_datatableManage'" index="/manageHome/systemSet/dataTableManage">
					<el-tooltip v-if="isCollapse==true" class="item" effect="dark" content="数据表管理" placement="right"><i class="iconfont icon-ccgl-shujuzidian-5"></i></el-tooltip><i v-else class="iconfont icon-ccgl-shujuzidian-5"></i> 数据表管理</el-menu-item>
				<el-menu-item v-cosSecurity="'vir_ssoManagement'" index="/manageHome/systemSet/ssoManagement">
					<el-tooltip v-if="isCollapse==true" class="item" effect="dark" content="外部接入管理" placement="right"><i class="iconfont icon-ccgl-shujuzidian-5"></i></el-tooltip><i v-else class="iconfont icon-ccgl-shujuzidian-5"></i>外部接入管理</el-menu-item>

				<el-menu-item v-cosSecurity="'vir_catalogManage'" index="/manageHome/systemSet/catalogManagement">
					<el-tooltip v-if="isCollapse==true" class="item" effect="dark" content="分类科目管理" placement="right"><i class="iconfont icon-ccgl-shujuzidian-5"></i></el-tooltip><i v-else class="iconfont icon-ccgl-shujuzidian-5"></i> 分类科目管理</el-menu-item>
				<el-menu-item v-cosSecurity="'vir_themeManage'" index="/manageHome/systemSet/themeManagement">
					<el-tooltip v-if="isCollapse==true" class="item" effect="dark" content="主题管理" placement="right"><i class="iconfont icon-ccgl-shujuzidian-5"></i></el-tooltip><i v-else class="iconfont icon-ccgl-shujuzidian-5"></i> 主题管理</el-menu-item>
				<el-menu-item v-cosSecurity="'vir_layoutManage'" index="/manageHome/systemSet/layoutManagement">
					<el-tooltip v-if="isCollapse==true" class="item" effect="dark" content="布局管理" placement="right"><i class="iconfont icon-ccgl-shujuzidian-5"></i></el-tooltip><i v-else class="iconfont icon-ccgl-shujuzidian-5"></i> 布局管理</el-menu-item>
				<el-menu-item v-cosSecurity="'vir_widgetManage'" index="/manageHome/systemSet/widgetManagement">
					<el-tooltip v-if="isCollapse==true" class="item" effect="dark" content="widget管理" placement="right"><i class="iconfont icon-ccgl-shujuzidian-5"></i></el-tooltip><i v-else class="iconfont icon-ccgl-shujuzidian-5"></i> widget管理</el-menu-item>

				<el-menu-item v-cosSecurity="'vir_decorateManage'" index="/manageHome/systemSet/decorateManagement">
					<el-tooltip v-if="isCollapse==true" class="item" effect="dark" content="修饰器管理" placement="right"><i class="iconfont icon-ccgl-shujuzidian-5"></i></el-tooltip><i v-else class="iconfont icon-ccgl-shujuzidian-5"></i> 修饰器管理</el-menu-item>

				<el-menu-item v-cosSecurity="'vir_siteManage'" index="/manageHome/systemSet/siteManagement">
					<el-tooltip v-if="isCollapse==true" class="item" effect="dark" content="站点管理" placement="right"><i class="iconfont icon-ccgl-shujuzidian-5"></i></el-tooltip><i v-else class="iconfont icon-ccgl-shujuzidian-5"></i> 站点管理</el-menu-item>

				<!--<el-menu-item v-cosSecurity="'vir_pageWidgetManage'" index="/manageHome/systemSet/pageWidgetManage">
					<el-tooltip v-if="isCollapse==true" class="item" effect="dark" content="页面widget配置管理" placement="right"><i class="iconfont icon-ccgl-shujuzidian-5"></i></el-tooltip><i v-else class="iconfont icon-ccgl-shujuzidian-5"></i> 页面widget配置管理</el-menu-item>-->

				<el-menu-item v-cosSecurity="'vir_pageAuthManage'" index="/manageHome/systemSet/pageAuthManage">
					<el-tooltip v-if="isCollapse==true" class="item" effect="dark" content="页面授权管理" placement="right"><i class="iconfont icon-ccgl-shujuzidian-5"></i></el-tooltip><i v-else class="iconfont icon-ccgl-shujuzidian-5"></i> 页面授权管理</el-menu-item>

				<el-menu-item v-cosSecurity="'vir_importManage'" index="/manageHome/systemSet/importManage">
					<el-tooltip v-if="isCollapse==true" class="item" effect="dark" content="导入管理" placement="right"><i class="iconfont icon-ccgl-shujuzidian-5"></i></el-tooltip><i v-else class="iconfont icon-ccgl-shujuzidian-5"></i> 导入管理</el-menu-item>

				<el-menu-item v-cosSecurity="'vir_dataSourceManage'" index="/manageHome/systemSet/dataSourceManage">
					<el-tooltip v-if="isCollapse==true" class="item" effect="dark" content="数据源管理" placement="right"><i class="iconfont icon-ccgl-shujuzidian-5"></i></el-tooltip><i v-else class="iconfont icon-ccgl-shujuzidian-5"></i> 数据源管理</el-menu-item>

				<el-menu-item v-cosSecurity="'vir_manualTablesManage'" index="/manageHome/systemSet/manualTablesManage">
					<el-tooltip v-if="isCollapse==true" class="item" effect="dark" content="动态表管理" placement="right"><i class="iconfont icon-ccgl-shujuzidian-5"></i></el-tooltip><i v-else class="iconfont icon-ccgl-shujuzidian-5"></i> 动态表管理</el-menu-item>

				<el-menu-item v-cosSecurity="'vir_dynamicViewManage'" index="/manageHome/systemSet/dynamicViewManage">
					<el-tooltip v-if="isCollapse==true" class="item" effect="dark" content="动态视图管理" placement="right"><i class="iconfont icon-ccgl-shujuzidian-5"></i></el-tooltip><i v-else class="iconfont icon-ccgl-shujuzidian-5"></i> 动态视图管理</el-menu-item>

				<el-menu-item v-cosSecurity="'vir_permissionGroupManage'" index="/manageHome/systemSet/permissionGroupManage">
					<el-tooltip v-if="isCollapse==true" class="item" effect="dark" content="权限组管理" placement="right"><i class="iconfont icon-ccgl-shujuzidian-5"></i></el-tooltip><i v-else class="iconfont icon-ccgl-shujuzidian-5"></i> 权限组管理</el-menu-item>

				<el-menu-item v-cosSecurity="'vir_permissionItemManage'" index="/manageHome/systemSet/permissionItemManage">
					<el-tooltip v-if="isCollapse==true" class="item" effect="dark" content="权限项管理" placement="right"><i class="iconfont icon-ccgl-shujuzidian-5"></i></el-tooltip><i v-else class="iconfont icon-ccgl-shujuzidian-5"></i> 权限项管理</el-menu-item>

				<el-menu-item v-cosSecurity="'vir_msgRegisteManage'" index="/manageHome/systemSet/msgRegisteManage">
					<el-tooltip v-if="isCollapse==true" class="item" effect="dark" content="消息注册管理" placement="right"><i class="iconfont icon-ccgl-shujuzidian-5"></i></el-tooltip><i v-else class="iconfont icon-ccgl-shujuzidian-5"></i> 消息注册管理</el-menu-item>
				<!--<el-menu-item v-cosSecurity="'vir_demo'" index="/manageHome/systemSet/demo">
					<el-tooltip v-if="isCollapse==true" class="item" effect="dark" content="开发示例1" placement="right"><i class="iconfont icon-quanxian"></i></el-tooltip><i v-else class="iconfont icon-quanxian"></i> 开发示例1</el-menu-item>
			    <el-menu-item v-cosSecurity="'vir_demo'" index="/manageHome/systemSet/demo1">
					<el-tooltip v-if="isCollapse==true" class="item" effect="dark" content="开发示例2" placement="right"><i class="iconfont icon-quanxian"></i></el-tooltip><i v-else class="iconfont icon-quanxian"></i> 开发示例2</el-menu-item>	-->
				<el-menu-item v-cosSecurity="'vir_userGroupManage'" index="/manageHome/systemSet/userGroupManage">
					<el-tooltip v-if="isCollapse==true" class="item" effect="dark" content="用户组管理" placement="right"><i class="iconfont icon-ccgl-shujuzidian-5"></i></el-tooltip><i v-else class="iconfont icon-ccgl-shujuzidian-5"></i> 用户组管理</el-menu-item>	
				<el-menu-item v-cosSecurity="'vir_componentManage'" index="/manageHome/systemSet/componentManage">
					<el-tooltip v-if="isCollapse==true" class="item" effect="dark" content="部件管理" placement="right"><i class="iconfont icon-ccgl-shujuzidian-5"></i></el-tooltip><i v-else class="iconfont icon-ccgl-shujuzidian-5"></i> 部件管理</el-menu-item>

			</el-menu>
			<div class="on-off" @click="hide"><i v-if="isCollapse==false" class="el-icon-d-arrow-left"></i><i v-else class="el-icon-d-arrow-right"></i></div>
		</div>
		<div class="main">
			<router-view></router-view>
		</div>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				isCollapse: false
			};
		},
		methods: {
			hide() {
				if(this.isCollapse == false) {
					$('.sidebar').animate({
						'width': '45px'
					}, 100);
					$('.main').animate({
						'left': '45px'
					}, 100);
					$('.on-off').animate({
						'left': '45px'
					}, 100);
					this.isCollapse = true
				} else {
					$('.sidebar').animate({
						'width': '195px'
					}, 100);
					$('.main').animate({
						'left': '195px'
					}, 100);
					$('.on-off').animate({
						'left': '163px'
					}, 100);
					this.isCollapse = false
				}
			},
		},
		mounted() {
			var datas = this.$refs.menu.$children;
			var routePath = '';
			for(var i = 0; i < datas.length; i++) {
				if(datas[i].$el.style.display == '') {
					routePath = datas[i].index;
					break;
				}
			}
			this.$router.push({
				path: routePath,
				params: {}
			});
		},
		created() {
			//this.$router.push({ name: 'administrativeDivision', params: {} });
		}
	}
</script>

<style scoped>
	.sidebar {
		width: 200px;
		position: absolute;
		top: 0px;
		left: 0;
		bottom: 0;
		background: #324157;
		box-sizing: border-box;
		overflow-x: hidden;
		overflow-y: auto;
	}
	
	.on-off {
		height: 30px;
		color: #fff;
		text-align: center;
		line-height: 30px;
		background: #19233c;
		position: fixed;
		z-index: 99;
		bottom: 0;
		left: 168px;
		padding: 0 10px;
		cursor: pointer;
	}
	
	.main {
		position: absolute;
		top: 0;
		left: 200px;
		bottom: 0;
		right: 0;
		box-sizing: border-box;
		overflow: hidden;
	}
	
	.el-menu-item {
		height: 45px;
		line-height: 45px;
	}
	
	.sidebar .iconfont {
		margin-right: 5px;
	}
	
	.sidebar::-webkit-scrollbar {
		width: 6px;
		/*	background-color: #F5F5F5;*/
	}
	
	.sidebar::-webkit-scrollbar-thumb {
		background-color: rgba(255, 255, 255, .3);
		border-radius: 20px;
	}
	
	.sidebar::-webkit-scrollbar-track {
		/*-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
		background-color: #F5F5F5;*/
	}
	
	.el-menu {
		border-right: 0;
	}
	/*.el-menu .is-active, .el-menu--horizontal>.el-menu-item:hover{ border-bottom: 5px solid #20a0ff;}*/
</style>

<style>
	.el-table thead>tr {
		background: #f5f7fa;
	}
	
	.con_main {
		height: 100%;
		position: relative;
	}
	
	.el-select {
		display: block;
	}
	
	.con_main .childBar {
		width: 20%;
		height: 100%;
		float: left;
		background: #f6f7fb;
		overflow: auto;
	}
	
	.childBar .el-menu {
		background: none;
	}
	
	.childBar .el-tree {
		border: none;
		background: #f6f7fb;
	}
	
	.showChild {
		height: 30px;
		background: #eceff9;
		line-height: 30px;
		padding: 0 5px;
		box-sizing: border-box;
	}
	
	.showChild .el-checkbox {
		color: #666;
		font-size: 12px;
	}
	
	.con_main .childMain {
		padding: 10px;
		box-sizing: border-box;
		float: left;
		width: 80%;
		height: 100%;
		position: relative;
	}
	
	.childMain .handle {
		margin-bottom: 10px;
	}
	
	.el-select {
		display: block;
	}
	
	.rolehead {
		background: #f3f3f3;
		height: 30px;
		line-height: 30px;
		border: 1px solid #d1dbe5;
	}
	
	.rolehead .el-col {
		padding-left: 5px;
		box-sizing: border-box;
		display: block;
		border-right: 1px solid #d1dbe5;
	}
	
	.el-tree {
		background: #fff;
	}
	
	.page-box {
		background: #eef1f6;
		padding-top: 3px;
		padding-bottom: 3px;
		box-sizing: border-box;
	}
	
	.dialog .showChild {
		height: 40px;
		background: #eceff9;
		line-height: 40px;
		padding: 0 5px;
		box-sizing: border-box;
	}
	/*-----【设置上传图片大小】------*/
	
	.avatar-uploader .el-upload {
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	
	.avatar-uploader .el-upload:hover {
		border-color: #20a0ff;
	}
	
	.avatar-uploader-icon {
		font-size: 14px;
		color: #8c939d;
		width: 150px;
		height: 100px;
		line-height: 100px;
		text-align: center;
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
	}
	
	.up-file {
		position: relative;
		width: 150px;
		margin-bottom: 15px;
	}
	
	.avatar-uploader {
		width: 150px;
		height: 100px;
	}
	
	.el-upload-dragger {
		width: 150px;
		height: 100px;
		background-color: #fbfbfb;
	}
	
	.avatar {
		width: 150px;
		height: 100px;
		display: block;
	}
	
	.el-collapse {
		border: 1px solid #ddd;
	}
	
	.el-collapse-item__header {
		padding: 0 15px;
		background: #f5f5f5;
		color: #333;
		border-bottom-color: #ddd;
	}
	
	.el-collapse-item__content {
		padding: 15px 15px 30px;
		/*background-color: #fbfdff;*/
	}
	/*.el-collapse {border: 1px solid #dfe6ec;border-radius: 0;}
	.el-collapse-item__header{padding: 0 15px;color: #31708f;border-bottom-color:#dfe6ec;}
	.el-collapse-item__content{ padding: 10px 15px; background-color: #fbfdff;}    */
	
	.el-collapse-item.is-active .el-collapse-item__header,
	.el-collapse-item:hover .el-collapse-item__header {
		color: #409eff;
	}
</style>