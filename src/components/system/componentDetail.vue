<template>
	<div class="pannel">
		<el-form ref="addAlleviationForm" :label-width="formLabelWidth" :label-position="labelPosition">
			<el-row :span="24" class="btn-group">
				<el-select style="width: 200px;" v-model="compType" placeholder="请选择类型" @change="handleCompTypeChange">
					<el-option label="全部" value=''></el-option>
					<el-option label="主题" value='theme'></el-option>
					<el-option label="布局器" value='layout'></el-option>
					<el-option label="修饰器" value='decorate'></el-option>
					<el-option label="widget" value='widget'></el-option>
				</el-select>
			</el-row>
			<el-table ref="dataTable" :data="tableData" highlight-current-row border style="width: 100%">
				<el-table-column type="index" width="55" align="center"></el-table-column>
				<el-table-column prop="C_CODE" label="部件代码"></el-table-column>
				<el-table-column prop="C_NAME" label="部件名称"></el-table-column>
				<el-table-column prop="C_TYPE" :formatter="fomaterCompType" label="部件类型"></el-table-column>
			</el-table>
		</el-form>
	</div>
</template>

<script>
	import {queryComponentDetailList} from '../../api/apiPortal';

	export default {
		data() {
			return {
				compCode: '',
				compType: '',
				tableData: [],
				formLabelWidth: '150px',
				labelPosition: 'right'
			}
		},
		methods: {
			loadData(code) {
				// 查询部件清单明细
				this.compCode = code
				this.serachTable()
			},
			serachTable() {
				var param = {
					compType: this.compType,
					compCode: this.compCode
				};
				queryComponentDetailList(param).then(data => {
					if (data.status == 200) {
						this.tableData = data.data;
					}
				});
			},
			handleCompTypeChange(val) {// 部件类型change事件
				this.serachTable()
			},
			fomaterCompType(row, cell, value) {
				if(value == 'theme') {
					return "主题";
				} else if (value == 'layout') {
					return "布局器";
				} else if (value == 'decorate') {
					return "修饰器";
				}else if (value == 'widget') {
					return "widget";
				}else{
					return ''
				}
			}
		},
		created() {

		},
		mounted() {}
	}
</script>

<style scoped>
	.btn-group {
		margin-bottom: 10px;
		text-align: -webkit-right;
	}
</style>