<template>
  <div class="con_main">
    <div class="childMain">
      <div class="handle">
        <el-button type="primary" @click="openAddDialog">新增</el-button>
        <el-button type="primary" :disabled="currentRowStatus" @click="openJwtDialog">关联API访问权限</el-button>
        <el-button type="primary" :disabled="currentRowStatus" @click="JwtSubmit">生成外部访问JWT</el-button>
      </div>
      <el-table v-loading.fullscreen.lock="loading" element-loading-text="请稍等，导入中..." :data="tableData" border
                highlight-current-row @current-change="handleCurrentChange" style="width: 100%" :height="tableHeight">
        <el-table-column type="index" width="80" align="center">
        </el-table-column>
        <el-table-column prop="systemName" label="系统名称" width="160">
        </el-table-column>
        <el-table-column prop="systemCode" label="系统代码" width="160">
        </el-table-column>
        <el-table-column prop="accessUrl" label="访问地址">
        </el-table-column>
        <el-table-column prop="ssoAdapter" label="认证适配器" width="160">
          <template slot-scope="scope">
            <el-button type="text" @click="openAdapterDialog(scope.$index, scope.row)"> {{ scope.row.ssoAdapter }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="70">
          <template slot-scope="scope">
            <el-dropdown trigger="click" placement="bottom-start" @command="(command) => handleCommand(command, scope.row)">
              <i class="el-icon-more"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="0">修改</el-dropdown-item>
                <el-dropdown-item command="1">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-box">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
                       :page-sizes="[20, 50, 100, 200]" :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>

    <el-dialog :title="title" v-loading.fullscreen.lock="addLoading" width="30%" :visible.sync="addDivisionDialog"
               :close-on-click-modal="false" @close="closeAddDialog">
      <el-form :model="addForm" ref="addForm" label-width="130px">
        <el-form-item label="系统名称" prop="systemName">
          <el-input v-model="addForm.systemName"></el-input>
        </el-form-item>
        <el-form-item label="系统代码" prop="systemCode">
          <el-input v-model="addForm.systemCode"></el-input>
        </el-form-item>
        <el-form-item label="访问地址" prop="accessUrl">
          <el-input v-model="addForm.accessUrl"></el-input>
        </el-form-item>
        <el-form-item label="认证适配器" prop="ssoAdapter">
          <el-input v-model="addForm.ssoAdapter"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDivisionDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveAddSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="适配器配置" v-loading.fullscreen.lock="adapterLoading" width="30%"
               :visible.sync="adapterDivisionDialog" :close-on-click-modal="false">
      <el-button type="primary" @click="download">用户对照信息下载</el-button>
      <el-upload style="display: inline-block;float: right" :on-success="uploadSuccess" :data="uploadData"
                 :action="fileUploadUrl"
                 :show-file-list="false">
        <el-button type="primary">
          导入用户对照信息
        </el-button>
      </el-upload>
    </el-dialog>
    disabled

    <el-dialog title="可访问API" width="50%" :visible.sync="jwtDivisionDialog" :close-on-click-modal="false">
      <el-select v-model="controllerPath" allow-create filterable multiple placeholder="请选择">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="jwtDivisionDialog = false">取 消</el-button>
        <el-button type="primary" @click="relationApi">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {
    exportUser,
    getApiFromServerCode,
    getJwtFromServerCode,
    importUser,
    isNeedImport,
    relationServerAndApi,
    ssoDeleteById,
    ssofindAll,
    ssoSave
  } from '../../api/api';
  
  import {gbs} from '../../config'

  export default {
    data() {
      return {
        tableHeight: '',
        loading: false,
        page: 1,
        pageSize: 20,
        total: 0,
        showChild: false,
        childMainWidth: '',
        tableData: [],
        title: '',
        addLoading: false,
        adapterLoading: false,
        addDivisionDialog: false,
        adapterDivisionDialog: false,
        jwtDivisionDialog: false,
        addForm: {},
        ssoAdapter: '',
        fileUploadUrl: '',
        fileDownloadUrl: '',
        uploadData: {
          appId: 1,
        },
        options: [],
        controllerPath: [],
        currentRow: null,
        currentRowStatus: true
      };
    },
    methods: {
      handleSizeChange(val) { //2.分页设置
        this.pageSize = val;
        this.getTableData();
      },
      handleCurrentChange(val) { //2.分页设置
        this.page = val;
        this.getTableData();
      },
      getTableData() {
        let para = {
          page: this.page,
          size: this.pageSize
        };
        ssofindAll(para).then((data) => {
          this.tableData = data.rows;
          this.total = data.total;
        });
      },
      handleCommand(command, row) {
        if (command == '0') {// 修改
          this.handleEdit(0, row);
        } else if (command == '1') {
          this.deleteRecord(0, row);
        }
      },
      handleEdit(index, row) {
        this.title = '修改';
        this.addForm = row;
        this.addDivisionDialog = true;
      },
      deleteRecord(index, row) {
        this.$confirm('此操作将永久删除该, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ssoDeleteById({id: row.id}).then((data) => {
            this.getTableData();
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch((err) => {
            this.$message({
              type: 'error',
              message: err.response.data.message
            });
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      openAddDialog() {
        this.title = '新增';
        this.addForm = {};
        this.addDivisionDialog = true;
      },
      openJwtDialog() {
        let param = {
          serverCode: this.currentRow.systemCode,
        }
        getApiFromServerCode(param).then((data) => {
          if (data.success) {
            this.controllerPath = data.description.split(",");
          }
        }).catch(() => {

        });
        this.jwtDivisionDialog = true;
      },
      saveAddSubmit() {
        this.addLoading = true;
        var data = this.addForm;
        ssoSave(data).then((data) => {
          this.getTableData();
          this.$message({
            message: '保存成功',
            type: 'success'
          });
          this.addDivisionDialog = false;
          this.addLoading = false;
          this.isNeedImportList(data);
        }).catch((err) => {
          this.addLoading = false;
          this.$message({
            type: 'error',
            message: '错误!'
          });
        });
      },
      closeAddDialog() {
        this.addDivisionDialog = false;
      },
      openAdapterDialog(index, row) {
        this.adapterDivisionDialog = true;
        this.ssoAdapter = row.ssoAdapter;
      },
      isNeedImportList(param) {
        isNeedImport(param).then((data) => {
          if (data) {
            this.$confirm('检测到此适配器未导入对照映射信息,是否现在导入?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.adapterDivisionDialog = true;
              this.ssoAdapter = param.ssoAdapter;
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              });
            });
          }
        })
      },
      download: function () {
        exportUser(this.ssoAdapter).then((data) => {
          if (data.success) {
            window.location.href = this.fileDownloadUrl + "/" + data.data;
          } else {
            this.$message({
              type: 'warning',
              message: '系统错误!'
            });
          }
        }).catch(() => {
          this.$message({
            type: 'warning',
            message: '系统错误!'
          });
        });
      },
      uploadSuccess(response, file, fileList) {
        fileList.splice(0, fileList.length);
        fileList.push(file);
        this.importFiles = response;
        this.importFiles.ssoAdapter = this.ssoAdapter;
        this.loading = true;
        importUser(this.importFiles).then((data) => {

          this.loading = false;

          if (data.data == '') {

            this.$message({
              message: '导入完成，生成导入结果明细失败',
              type: 'success'
            });
          } else if (!data.success) {

            this.$message({
              message: '导入失败!',
              type: 'error'
            });

          } else {
            this.$confirm('导入完成，是否需要下载导入结果明细?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'info'
            }).then(() => {

              window.location.href = this.fileDownloadUrl + "/" + data.data;

            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消下载'
              });
            });


          }
        }).catch((err) => {
          this.loading = false;
          this.$message({
            type: 'error',
            message: "导入失败"
          });
        });
      },
      // beforeFileUpload(file) {
      //   const isxlsx = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      //   if (!isxlsx) {
      //     this.$message.error('只能上传xlsx文件!');
      //   }
      //   return isxlsx;
      // },
      handleCurrentChange(val) {
        this.currentRow = val;
        this.currentRowStatus = false;
      },
      relationApi() {
        var join = this.controllerPath.join(',');
        let param = {
          serverCode: this.currentRow.systemCode,
          path: join
        }
        relationServerAndApi(param).then((data) => {
          if (data.success) {
            this.$message({
              message: '保存成功！',
              type: 'success'
            });
          } else {
            this.$message({
              type: 'warning',
              message: '保存失败!'
            });
          }
        }).catch(() => {
          this.$message({
            type: 'warning',
            message: '系统错误!'
          });
        });
      },
      JwtSubmit() {

        let param = {
          serverCode: this.currentRow.systemCode,
        }
        getJwtFromServerCode(param).then((data) => {
          this.$alert('<input style="width: 100%" type="text" value="' + data + '" />', {
            confirmButtonText: '确定',
            dangerouslyUseHTMLString: true
          });
        }).catch(() => {
          this.$message({
            type: 'warning',
            message: '系统错误!'
          });
        });
      }
    },
    mounted() {
      this.getTableData();
      this.fileUploadUrl = gbs.fileServiceUrl + '/file/uploadFile';
      console.info(this.fileUploadUrl)
      this.fileDownloadUrl = gbs.fileServiceUrl + '/file/download';
    },
    created() {
      var childMainHeight = $('.childMain').height();
      this.tableHeight = (childMainHeight - 90) + 'px';
    }
  }
</script>

<style scoped>
  .con_main .childMain {
    width: 100%;
  }
</style>
