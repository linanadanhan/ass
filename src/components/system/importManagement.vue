<template>
	<div class="con_main">
		<div class="childMain" style="width: 100%;">
			<div class="handle">
				<div style="float: left;">
					<!--<el-upload :on-success="uploadSuccess" :action="fileUploadUrl" :show-file-list="false" :before-upload="beforeUpload"><el-button size="small" type="primary">导入</el-button></el-upload>   -->
				</div>
	            <el-input style="float: right;margin-top:0;width:150px" size="small" placeholder="请输入关键字" icon="search"
              		v-model="search">
                  <i slot="suffix" class="el-input__icon el-icon-search" @click="handleSearch"></i>
	            </el-input>
			</div>
			
			<div style="height: 30px;"></div>
			
			<el-table ref="multipleTable" :data="tableData" v-loading.fullscreen.lock="loading2" highlight-current-row border  style="width: 100%;" :height="tableHeight">
				<el-table-column type="selection" width="55" align="center"></el-table-column>
				<el-table-column width="150" label="导入文件">
					<template slot-scope="scope">
		            	<el-button type="text" size="small" @click="exportFile(scope.$index, scope.row)">{{scope.row.C_FILE_NAME}}</el-button>
		          	</template>
				</el-table-column>
				
				<el-table-column width="80" prop="C_RESULT" :formatter="formatImpResult" label="导入结果"></el-table-column>
				<el-table-column prop="C_FAIL_REASON" label="失败原因"></el-table-column>
				<el-table-column width="180" prop="C_CREATE_TIME" label="导入时间"></el-table-column>
				<el-table-column width="120" prop="C_NAME" label="操作人"></el-table-column>
			</el-table>
			<div class="page-box">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 50, 100, 200]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
	import {queryImportData,importData} from '../../api/apiPortal';
	
	import {gbs} from '../../config'
	
	export default {
		data() {
			return {
				tableHeight:'',
				total: 0,
				pageSize: 20,
				currentPage: 1,
				search:'',
				tableData: [],
				fileUploadUrl: '',
				loading2: false,
				fileDownloadUrl: ''
			};
		},
		methods: {
		  handleSearch() {
        this.currentPage = 1;
        this.searchTableData();		    
		  },
			searchTableData() {
				var param = {
					search: this.search,
					page: this.currentPage,
					rows: this.pageSize
				};
				queryImportData(param).then(data => {
					this.tableData = data.rows;
					this.total = data.total;
				});
			},
			formatImpResult(row, cell, value) {//格式化导入结果
				if (value == '1'){
					return "成功";
				}else{
					return "失败";
				}
			},
			handleSizeChange(val) { //2.分页设置
				this.pageSize = val;
				this.searchTableData();
			},
			handleCurrentChange(val) { //2.分页设置
				this.currentPage = val;
				this.searchTableData();
			},uploadSuccess(response, file, fileList) {
				this.loading2 = false;
				if (response.success){
					console.info(response)
					if(response.description == '1'){//主题已存在
						this.confirm(response,response.title,'1');
						
					}else if (response.description == '2'){//布局已存在
						this.confirm(response,response.title,'2');
						
					}else if (response.description == '3'){//修饰器已存在
						this.confirm(response,response.title,'3');
						
					}else if (response.description == '4'){//widget已存在
						this.confirm(response,response.title,'4');
					}else{
						this.$message({
				          message: response.title,
				          type: 'success'
				        });
				        this.searchTableData();
					}
				}else{
					this.$message({
						type: 'error',
						message: response.title
					});
					this.searchTableData();
				}
			},importData(params){
				this.loading2 = true;
				importData(params).then((data) => {
					this.loading2 = false;
					if (data.success){
						if (data.description == '1'){//主题已存在
							this.confirm(data,data.title,'1');
							
						}else if (data.description == '2'){//布局已存在
							this.confirm(data,data.title,'2');
							
						}else if (data.description == '3'){//修饰器已存在
							this.confirm(data,data.title,'3');
							
						}else if (data.description == '4'){//widget已存在
							this.confirm(data,data.title,'4');
							
						}else{
							this.$message({
					          message: data.title,
					          type: 'success'
					        });
					        this.searchTableData();
						}
						
					}else{
						this.$message({
							type: 'error',
							message: data.title
						});
						this.searchTableData();
					}
				}).catch((e) => {
					this.loading2 = false;
					this.$message({
						type: 'error',
						message: "导入失败,原因:"+e
					});
				});
			},confirm(data,code,type){
				var cmg = ''; 
				var jsonObj = JSON.parse(data.data);
				let obj = {};
				
				if (type == '1'){//主题
					cmg = '导入主题：'+code+'已存在，是否覆盖？';
				    obj = jsonObj.themes.find((item)=>{
				          return item.name === code;
				    });
					
				}else if (type == '2'){//布局
					cmg = '导入布局：'+code+'已存在，是否覆盖？';
					obj = jsonObj.layouts.find((item)=>{
				          return item.name === code;
				    });
					
				}else if (type == '3'){//修饰器
					cmg = '导入修饰器：'+code+'已存在，是否覆盖？';
					obj = jsonObj.decorators.find((item)=>{
				          return item.name === code;
				    });
					
				}else if (type == '4'){//widget
					cmg = '导入widget：'+code+'已存在，是否覆盖？';
					console.info(jsonObj.widgets)
					obj = jsonObj.widgets.find((item)=>{
				          return item.name === code;
				    });
				}
				
				this.$confirm(cmg, '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(() => {
					obj.isCover = "1";
					var json = JSON.stringify(jsonObj);
					let params = {
						type:type,
						json:json
					};
					this.importData(params);
				}).catch(() => {
		          	obj.isCover = "0";
					var json = JSON.stringify(jsonObj);
					let params = {
						type:type,
						json:json
					};
					this.importData(params);
		        });
			},beforeUpload(file) {
				var mime = file.name.toLowerCase().substr(file.name.lastIndexOf(".")); 
				var allow = (mime === '.zip')
				const isLt2M = file.size / 1024 / 1024 / 2 < 20;
				if(!allow) {
					this.$message.error('导入包只能是 zip格式!');
				}
				if(!isLt2M) {
					this.$message.error('导入包大小不能超过 20MB!');
				}
				
				if (allow && isLt2M){
					this.loading2 = true;
				}
				return allow && isLt2M;
			},exportFile(index ,row){
				window.location.href = this.fileDownloadUrl + '/' + row.C_FILE_ALIAS;
			}
		},
		mounted() {
			this.searchTableData();
			this.fileDownloadUrl = gbs.fileServiceUrl + '/file/download';
		},
	    created() {
	      var childMainHeight = $('.childMain').height();
		  this.tableHeight = (childMainHeight - 90) + 'px';
	    }
	}
</script>

<style scoped>

</style>