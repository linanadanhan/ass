<template>
  
  <div class="con_main">
  	
  	<div class="childBar" style="width: 120px;">
				<div class="showChild">
	        <h3>站点信息</h3>
	      </div>
	      <el-menu default-active="1" @select="selectItems" class="el-menu-vertical-demo">
	        <el-menu-item v-for="item in siteData" :key="item.id" :index="String(item.id)"> {{ item.name }}</el-menu-item>
	      </el-menu>
    </div>
  	
    <div class="childBar" style="margin-left: 10px;width: 180px;">
    		<div class="showChild">
	        <h3>页面信息</h3>
	      </div>
			<el-tree :data="dataTree" default-expand-all highlight-current ref="tree" @node-click="handleNodeClick"  :expand-on-click-node=false node-key="id" :props="defaultProps">
			</el-tree>
    </div>
    
    <div class="childMain" style="width: 850px;">
			<el-tabs v-show="showTabs" v-model="activeName" @tab-click="handleTabClick">
		    <el-tab-pane label="用户授权" name="first">
						<pageUserAuthForm ref="pageUserAuthInfo"></pageUserAuthForm>
						<div class="dialog-footer" style="text-align: right;margin-top: 10px;">
							<el-button type="primary" @click="savePageUserAuth">确 定</el-button>
						</div>
		    </el-tab-pane>
		    
		    <el-tab-pane label="角色授权" name="second">
		    	<pageRolesAuthForm ref="pageRolesAuthInfo"></pageRolesAuthForm>
					<div class="dialog-footer" style="text-align: right;margin-top: 10px;">
						<el-button type="primary" @click="savePageRolesAuth">确 定</el-button>
					</div>
		    </el-tab-pane>
		  </el-tabs>
    </div>
	</div>
</template>

<script>
  import {
		getAllSiteList, getSitePageTree
  } from '../../api/apiPortal';
  
  import pageUserAuthForm from '@/components/system/pageUserAuthForm.vue'
  import pageRolesAuthForm from '@/components/system/pageRolesAuthForm.vue'
  
  import axios from '../../api/http'

  export default {
  	components: {
			pageUserAuthForm:pageUserAuthForm,
			pageRolesAuthForm:pageRolesAuthForm
		},
    data() {
      return {
        num:100,
        siteData: [],
        widgetConfDialog: false,
        dataTree: [],
        selSiteId: '',
        selPageId: '',
        defaultProps: {
					children: 'children',
					label: 'text'
				},
        activeName:'',
        showTabs:false
      };
    },
    methods: {
    
      /**
       * 点击树结构
       */
      handleNodeClick(data) {
      	//仅页面才会显示授权
      	if (data.parentId != 0){
      		this.selPageId = data.id;
      		this.showTabs = true;
      		this.activeName = "first";
					this.$nextTick(() => {
	 					this.$refs.pageUserAuthInfo.loadData(this.selPageId,'1');
	 				});
      	}else{
      		this.showTabs = false;
      		this.activeName = '';
      	}
      },
			getSiteInfo(){
      	getAllSiteList().then((data) => {
          this.siteData = data;
          this.selectItems(String(data[0].id));
        });
    },selectItems(siteId) {
    	  this.dataTree = [];
    	  this.showTabs = false;
      	this.selSiteId = siteId;
      	//获取站点页面Tree 只取私有页面
      	let obj = {};
		    obj = this.siteData.find((item)=>{
		        return String(item.id) === siteId;
		    });
				getSitePageTree({"siteCode":obj.code, "type":'0'}).then((data) => {
					this.dataTree = data;
				});
      },handleTabClick(tab, event){
				if (tab.name == "first"){
					if (this.selPageId != ''){
						this.showTabs = true;
	      		this.activeName = "first";
						
						this.$nextTick(() => {
		 					this.$refs.pageUserAuthInfo.loadData(this.selPageId,'1');
		 				});
					}
				
				}else if (tab.name == "second") {
				
					if (this.selPageId != ''){
						this.showTabs = true;
	      		this.activeName = "second";
						this.$nextTick(() => {
		 					this.$refs.pageRolesAuthInfo.loadData(this.selPageId,'1');
		 				});
					}
					
				}
			},savePageUserAuth(){//保存页面用户授权
				
				this.$nextTick(() => {
 					this.$refs.pageUserAuthInfo.saveData();
 				});
			
			},savePageRolesAuth(){//保存页面角色授权
				this.$nextTick(() => {
 					this.$refs.pageRolesAuthInfo.saveData();
 				});
			}
    },
    mounted() {
      this.getSiteInfo();
    },
  }
</script>

<style scoped>
	.con_main >>>.childMain {
    padding: 10px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 80%;
    height: 100%;
    position: relative;
}
	
.el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 400px;
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }
  
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>
