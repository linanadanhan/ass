<template>
	<div style="padding:0px 4px 0px 0px">
		<div :style="'height:'+ item.C_WIDGET_HEIGHT +'px;border: 1px solid;width: 100%;margin: 2px;float: left;cursor: pointer;'" onmouseover="this.style.backgroundColor='#F4F9FD'" onmouseout="this.style.backgroundColor='#FFFFFF'" @click="handleEdit(item)" v-for="item in dataTable">
			<i class="el-icon-error" style="float: right;cursor: pointer;" @click.stop="handleDel(item)"></i>
			<p>widget:{{item.C_WIDGET_NAME}} <el-button v-if="item.C_IS_NESTED == '1'" size="mini" @click.stop="handleConfig(item)" type="text">配置</el-button></p>
			<p>标题：{{item.C_TITLE}}</p>
			<p>修饰器：{{item.C_DECORATE_NAME}}</p>
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

  import {queryWidgetConfig, delWidgetConf} from '../../api/apiPortal';
  import widgetConfEdit from '@/components/system/widgetConfEdit.vue';

  export default {
	components: {
		widgetConfEdit:widgetConfEdit
	},
    data() {
      return {
      	dataTable: [],
      	title:'修改',
      	widgetConfDialog:false
      }
    },
    props: ['layoutPosition','layoutCode','pageUuId','ywType','nestUuId'],
    methods: {
		handleEdit(item){
		  
	  	    this.widgetConfDialog = true;
	  
			this.$nextTick(() => {
					this.$refs.widgetConfInfo.loadData(this.ywType,this.nestWidgetId,this.pageUuId,this.layoutCode,this.layoutPosition,item.C_ID);
			});
			
		},handleDel(item){
			this.$confirm('此操作将永久删除该widget引用数据项, 是否继续', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
				var params = {
		      		id : item.C_ID,
		      	};
		      	
		       	delWidgetConf(params).then((data)=>{
		       		
	       			this.$message({
		                type: 'success',
		                message: '删除成功!'
		            });
		       		
		       		this.getDataTable();
	       			
		       	}).catch(() => {
	              this.$message({
	                type: 'error',
	                message: '删除失败!'
	              });
	            });
	
	        }).catch(() => {
	          this.$message({
	            type: 'info',
	            message: '已取消删除'
	          });
	        });
			
		},getDataTable(){//查询列表数据
			
			var param = {
				search: '',
				pageUuId: this.pageUuId,
				nestUuId:this.nestUuId,
				ywType:this.ywType,
				layoutCode: this.layoutCode,
				position: this.layoutPosition
			};
			
			queryWidgetConfig(param).then(data => {
				this.dataTable = data;
			});
		},saveSubmitForm(){
		
			this.$nextTick(() => {
				this.$refs.widgetConfInfo.saveSubmitForm();
			});
			
		},closeAndFresh(){
			this.widgetConfDialog = false;
			this.getDataTable();
		},handleConfig(item){//配置嵌套widget
			this.$emit('configNestWidget',item); 
		}
    },
    mounted() {
		
    },beforeDestroy() {
    	
    },created() {
    	this.getDataTable();
    }
  }

</script>

<style>
</style>