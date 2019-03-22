<template>
	<div class="con_main">
				开发中....
	</div>
</template>

<script>

	export default {
		data() {
			return {};
		},
		methods: {},
		mounted() {},
		created() {}
	}
</script>

<style scoped>
	.con_main {
		height: 100%;
		position: relative;
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
	
	.el-menu-item {
		height: 40px;
		line-height: 40px;
	}
	
	.con_main .childMain {
		box-sizing: border-box;
		float: left;
		width: 100%;
		height: 100%;
		position: relative;
	}
	
	.childMain .handle {
		margin-bottom: 10px;
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
	
	.dialog .showChild {
		height: 40px;
		background: #eceff9;
		line-height: 40px;
		padding: 0 5px;
		box-sizing: border-box;
	}
	
	.hjkForm {
		padding-top: 5px;
		background: #f6f6f6;
	}
	
	.hjkForm .el-form-item {
		margin-bottom: 5px !important;
	}
</style>