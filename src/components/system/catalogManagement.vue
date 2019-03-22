<template>
	
	<div class="con_main">
		<div class="childMain" style="width: 100%;">
			<div class="handle">
				<el-dropdown trigger="click" placement="bottom-start" @command="handleCommand">
				  <el-button type="primary">
				   	 新增<i class="el-icon-arrow-down el-icon--right"></i>
				  </el-button>
				  <el-dropdown-menu slot="dropdown">
				    <el-dropdown-item command="0">新增分类</el-dropdown-item>
				    <el-dropdown-item command="1">新增科目(一级分类)</el-dropdown-item>
				  </el-dropdown-menu>
				</el-dropdown>
				&nbsp;&nbsp;
				<el-button type="primary" :disabled="enabledBtn" @click="editDataTable">修改</el-button>
				<el-button type="primary" :disabled="enabledBtn" @click="delDataTable">删除</el-button>
			</div>
	
			<div>
			  <tree-grid 
			    :items='data' 
			    :columns='columns'
			    @on-row-click='rowClick'
			    @on-selection-change='selectionClick'
			    @on-sort-change='sortClick'
			    @on-row-select='rowSelect'>
			  </tree-grid>
			</div>
			
			<el-dialog size="small" :title="title" :visible.sync="editDialog" :close-on-click-modal="false" width="50%" top="8vh">
				<catalogForm @closeAndFresh="closeFresh" ref="catalogInfo"></catalogForm>
				<div slot="footer" class="dialog-footer">
					<el-button @click="editDialog = false">取 消</el-button>
					<el-button type="primary" @click="saveSubmitForm">确 定</el-button>
				</div>
			</el-dialog>
			
	  </div>
	</div>
      
</template>
<script>
    import TreeGrid from '@/components/treeGrid2.0.vue'
    import catalogForm from '@/components/system/catalogEdit.vue';
    
    import {queryCatalogDataTable, delCatalog} from '../../api/api';
    
    export default {
        data() {
            return {
                columns: [
                {
                    title: '分类名称',
                    key: 'name',
                    width: '150',
                },
                {
                    title: '自动展开',
                    key: 'isAutoExpend',
                    width: '80',
                }, 
                {
                    title: '叶子节点',
                    key: 'isLeaf',
                    width: '80',
                }, 
                {
                    title: '排序号',
                    key: 'sortNo',
                    width: '80',
                },
               	{
                    title: '所属科目标识键',
                    key: 'rootkey',
                    width: '150',
                },
                {
                    title: '所属科目名称',
                    key: 'rootName',
                    width: '150',
                },
                {
                    title: '分类',
                    key: 'type',
                    width: '120',
                },
                {
                    title: '科目值',
                    key: 'value',
                    width: '120',
                },
                {
                    title: '状态',
                    key: 'status',
                    width: '80',
                }
                ],
                data: [],
                editDialog: false,
                enabledBtn:true,
                title:'新增',
                selectRows: []
            }
        },
        components: {
            TreeGrid,
            catalogForm
        },
        methods: {
            rowClick(data, index, event) {
                console.log('当前行数据:' + data)
                console.log('点击行号:' + index)
                console.log('点击事件:' + event)
            },rowSelect(data){
            	console.log(JSON.stringify(data));
            	this.selectRows = data;
            	
            	if (!jQuery.isEmptyObject(this.selectRows)){
            		this.enabledBtn = false;
            	}
            },
            selectionClick(arr) {
            	//alert("selectionClick");
                console.log('选中数据id数组:' + arr)
            },
            sortClick(key, type) {
                console.log('排序字段:' + key)
                console.log('排序规则:' + type)
            },handleCommand(command){
            	
            	this.title = "新增";
            	
            	this.editDialog = true;
            	//alert(JSON.stringify(this.selectRows));
            	//alert(jQuery.isEmptyObject(this.selectRows));
            	
            	//一级分类父ID
            	var parentId = 0;
            	var rootkey = '';
            	
            	if (!jQuery.isEmptyObject(this.selectRows)){
            		parentId = this.selectRows.id;
            		rootkey = this.selectRows.rootkey;
            	}
            	
            	if (command == '0'){//新增分类
            		this.$nextTick(() => {
	 					this.$refs.catalogInfo.loadData('',parentId,rootkey);
	 				});
            	}else{//新增一级分类
            		
            		parentId = 0;
            		rootkey = '';
            		
            		this.$nextTick(() => {
	 					this.$refs.catalogInfo.loadData('',parentId,rootkey);
	 				});
            	}
            },editDataTable(){//修改分类科目信息
            	
            	this.title = "修改";
            	this.editDialog = true;
            	
	    	    this.$nextTick(() => {
					this.$refs.catalogInfo.loadData(this.selectRows.id,this.selectRows.parentId,this.selectRows.rootkey);
				});
            	
            },delDataTable(){//删除分类科目信息
            	
            	if (jQuery.isEmptyObject(this.selectRows)){
	            	this.$message({
			            type: 'info',
			            message: '请先选择一笔需要删除的数据！'
			        });
			        
			        return false;
            	}
            	
            	this.$confirm('删除分类会导致和分类所属数据失去关联，请保证该分类下没有业务数据。 请谨慎操作，确认要删除吗？', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
					var params = {
			      		id : this.selectRows.id
			      	};
			      	
			       	delCatalog(params).then((data)=>{
			       		this.searchTableData();
			       	});
		
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除'
		          });
		        });
            },
            saveSubmitForm() {
				this.$nextTick(() => {
 						 this.$refs.catalogInfo.saveData();
 				});
			},closeFresh(){
			   this.editDialog = false;
    		   this.searchTableData();
			},searchTableData(){//列表数据查询
				queryCatalogDataTable().then((data) => {
					//console.info(JSON.stringify(data));
					this.data = data;
				});
			}
        },
		mounted() {
			//获取列表数据
			this.searchTableData();
		}
    }
</script>

<style>
    
    /*body {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
    }*/
    
    #app {
        //color: #2c3e50;
        //margin-top: -100px;
        //max-width: 600px;
        font-family: Source Sans Pro, Helvetica, sans-serif;
        //text-align: center;
    }
    
    #app a {
        color: #42b983;
        text-decoration: none;
    }
</style>