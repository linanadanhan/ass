<template>
  <div class="con_main">
    <div class="childBar">
      <el-select v-model="value" placeholder="请选择维度" @change="(data)=>changeDimensionHandler(data)">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <!--<div class="showChild">
        <el-checkbox v-model="showChild" @change="changeChild">显示子集</el-checkbox>
      </div>-->
      <el-tree :data="dataTree" default-expand-all highlight-current ref="tree" @node-click="handleNodeClick"
               :expand-on-click-node=false node-key="id" :props="defaultProps">
      </el-tree>
    </div>
    <div class="childMain">
      <div class="handle">
        <el-button type="primary" @click="openAddOrgDialog">新增</el-button>
        <el-button type="primary" @click="handleEdit">修改</el-button>
        <el-button type="primary" @click="deleteRecord">删除</el-button>
        <el-button type="primary" @click="AuthorizationDialog">机构授权</el-button>
        <el-button type="primary" @click="download">模板下载</el-button>
        <el-upload style="display: inline-block" :on-success="uploadSuccess" :data="uploadData" :action="fileUploadUrl"
                   :show-file-list="false"
                   :before-upload="beforeFileUpload">
          <el-button type="primary">
            导入
          </el-button>
        </el-upload>
      </div>

      <div>
        <el-form :inline="true" :model="showForm" label-width="80px">
          <el-form-item label="上级机构">
            <el-input v-model="topName" disabled></el-input>
          </el-form-item>
          <el-form-item label="机构代码">
            <el-input v-model="showForm.code" disabled></el-input>
          </el-form-item>
          <el-form-item label="机构名称">
            <el-input v-model="showForm.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="机构类型">
            <el-select v-model="showForm.orgType" disabled placeholder="无">
              <el-option v-for="item in orgTypeOptions" :key="item.value" :label="item.text" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序号">
            <el-input v-model="showForm.sortNo" disabled></el-input>
          </el-form-item>
        </el-form>
      </div>

      <div class="handle">
        <el-button type="primary" @click="openSelectDialog">生成职位</el-button>
        <el-button type="primary" @click="openModifyDialog">修改排序</el-button>
        <el-button type="primary" @click="openLeaderDialog">设置上级</el-button>
      </div>
      <el-table highlight-current-row @current-change="handleTableChange"
                :data="tableData" border style="width: 100%" :height="tableHeight">
        <el-table-column type="index" width="80" align="center">
        </el-table-column>
        <el-table-column prop="postName" label="岗位">
        </el-table-column>
        <el-table-column prop="sortNo" label="排序号">
        </el-table-column>
      </el-table>
      <div class="page-box">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
                       :page-sizes="[20, 50, 100, 200]" :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>

    <el-dialog title="新增" v-loading.fullscreen.lock="addLoading" :visible.sync="addDivisionDialog"
               :close-on-click-modal="false" @close="closeDialog">
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="130px">
        <el-form-item label="上级机构">
          <el-input v-model="addForm.topName" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="机构代码" prop="code">
          <el-input v-model="addForm.code"></el-input>
        </el-form-item>
        <el-form-item label="机构名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="机构类型">
          <el-select v-model="addForm.orgType" placeholder="请选择机构类型">
            <el-option v-for="item in orgTypeOptions" :key="item.value" :label="item.text" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="排序号">
          <template>
            <el-input-number v-model="addForm.sortNo" :min="1" :max="10"></el-input-number>
          </template>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addDivisionDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改" v-loading.fullscreen.lock="editLoading" :visible.sync="editDivisionDialog"
               :close-on-click-modal="false" @close="closeDialog">
      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="120px">
        <el-form-item label="上级机构">
          <el-input v-model="editForm.topName" readonly></el-input>
        </el-form-item>
        <el-form-item label="机构代码">
          <el-input v-model="editForm.code" readonly></el-input>
        </el-form-item>
        <el-form-item label="机构名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="机构类型">
          <el-select v-model="editForm.orgType" placeholder="请选择机构类型">
            <el-option v-for="item in orgTypeOptions" :key="item.value" :label="item.text" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="排序号">
          <template>
            <el-input-number v-model="editForm.sortNo" :min="1" :max="10"></el-input-number>
          </template>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDivisionDialog = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="生成职位" v-loading.fullscreen.lock="selectLoading" width="30%" :visible.sync="selectDivisionDialog"
               :close-on-click-modal="false" @close="closeDialog">
      <el-select v-model="selectPost" multiple placeholder="请选择岗位">
        <el-option v-for="item in postNameOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="selectDivisionDialog = false">取 消</el-button>
        <el-button type="primary" @click="savePostSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改排序" v-loading.fullscreen.lock="modifyLoading" width="50%" :visible.sync="modifyDivisionDialog"
               :close-on-click-modal="false" @close="closeModifyDialog">
      <template v-for="item in tableData">
        <el-form :inline="true" :model="item">
          <el-form-item label="职位">
            <el-input v-model="item.postName" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="排序号" prop="sortNo"
                        :rules="[ {min: 1, max: 100, type: 'number', message: '长度在 1到 100的数字', trigger: 'change'}]">
            <el-input v-model.number="item.sortNo" type="sortNo" placeholder="请输入排序号"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyDivisionDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveModifySubmit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="设置上级" v-loading.fullscreen.lock="leaderLoading" width="30%" :visible.sync="leaderDivisionDialog"
               :close-on-click-modal="false" @close="closeLeaderDialog">

      <el-form ref="leaderForm" :model="leaderForm" label-width="80px">
        <el-form-item>
          <el-radio-group v-model="leaderType" @change="changeRadio">
            <el-radio border label="职位">选择职位</el-radio>
            <el-radio border label="身份">选择身份</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-select v-model="leaderForm.leaderOrgId" placeholder="上级所属机构" style="width: 80%;"
                     @change="changeLeaderOrg">
            <el-option v-for="item in orgOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="leaderForm.leaderId" placeholder="上级职位/身份" style="width: 80%;"
                     @visible-change="(boolean)=>changeHandler(boolean)">
            <el-option v-for="item in leaderOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="leaderDivisionDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveLeaderSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog v-loading.fullscreen.lock="postionLoading" title="机构授权" :visible.sync="postionDialog"
               :close-on-click-modal="false" width="80%" top="7vh">
      <el-form :model="orgForm" label-width="70px">
        <el-form-item label="机构名称">
          <el-input v-model="orgForm.name" readonly></el-input>
        </el-form-item>
      </el-form>
      <el-row class="rolehead">
        <el-col :span="4">
          <h5>组织机构结构</h5></el-col>
        <el-col :span="9">
          <h5>待授权身份</h5></el-col>
        <el-col :span="2">
          <h5>操作</h5></el-col>
        <el-col :span="9">
          <h5>已授权身份</h5></el-col>
      </el-row>
      <el-row class="dialog" style="background:#f5f5f5;height:391px;">
        <el-col :span="4" style="height:391px;overflow:auto;">
          <div class="showChild">
            <el-checkbox v-model="orgShowChild" @change="selectAreaTreeNodeList">显示子集</el-checkbox>
          </div>
          <el-tree :data="dataTree" ref="tree" :highlight-current=true @node-click="areaNodeClick"
                   :default-expand-all=true :expand-on-click-node=false node-key="id" :props="defaultProps"
                   style="background:#f5f5f5;">
          </el-tree>
        </el-col>
        <el-col :span="9">
          <el-table :data="waitPerson" @select="selectWaitPersonRow" @select-all="selectWaitPersonAll" border
                    style="width: 100%" height="390">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="name" align="center" label="姓名" width="120">
            </el-table-column>
            <el-table-column prop="positionName" label="职位">
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="2">
          <div style="margin-top: 120px;">
            <el-button type="primary" @click="toGrant" icon="arrow-right" size="small" style="margin-left:7px;">授权<i
              class="el-icon-arrow-right el-icon--right"></i></el-button>
          </div>
          <div style="margin-top: 60px;">
            <el-button type="primary" @click="cancelGrant" icon="el-icon-arrow-left" size="small"
                       style="margin-left:7px;">移除
            </el-button>
          </div>
        </el-col>
        <el-col :span="9">
          <el-table :data="havePerson" @select="selectHavePersonRow" @select-all="selectHavePersonAll" border
                    style="width: 100%" height="390">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="name" align="center" label="姓名" width="120">
            </el-table-column>
            <el-table-column prop="positionName" label="职位">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="postionDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveConnectPersonnel">保 存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {
    delOrgById,
    getDicItemListByDicKey,
    getHasConnectIdentity,
    getHasNoConnectIdentity,
    getIdentityListByOrg,
    getOrgById,
    getOrgListByDimension,
    getOrgTreeByDimension,
    getPositionListByOrg,
    getPositionManage,
    getPositionPageByOrgId,
    getPostByOrg,
    importOrg,
    isExitOrgCode,
    modifyPositionSort,
    orgConnectPost,
    saveOrg,
    saveOrgIdentityInfo,
    savePositionManage
  } from '../../api/api';
  
  import {gbs} from '../../config'

  export default {
    data() {
      var validateCodeUnique = (rule, value, callback) => {
        if (value) {
          isExitOrgCode({
            "code": value,
            "dimension": this.dimension
          }).then((data) => {
            if (data) {
              callback(new Error('此维度下机构代码已存在！'));
            } else {
              callback();
            }
          });
        } else {
          callback();
        }
      };
      //TODO
      return {
        tableHeight: '',
        loading2: false,
        page: 1,
        pageSize: 20,
        total: 0,
        showChild: false,
        orgShowChild: false,
        childMainWidth: '',
        fileUploadUrl: '',
        currentNode: {},
        currentNode2: {},
        dataTree: [],
        orgTypeOptions: [],
        defaultProps: {
          children: 'children',
          label: 'text'
        },
        tableData: [],
        addDivisionDialog: false,
        fileList: [],
        importFiles: {},
        editDivisionDialog: false,
        fileDownloadUrl: '',
        addForm: {
          parentId: '',
          topName: '',
          name: '',
          code: '',
          orgType: '0',
          status: '0',
          level: '',
          sortNo: ''
        },
        showForm: {},
        topName: '',
        uploadData: {
          appId: 1,
        },
        rules: {
          name: [
            {required: true, message: '必填 ', trigger: 'change'},
            {min: 1, max: 100, message: '长度在 1到 100个字符', trigger: 'change'}
          ],
          code: [
            {required: true, message: '必填 ', trigger: 'blur'},
            {min: 1, max: 30, message: '长度在 1到 30个字符', trigger: 'change'},
            {validator: validateCodeUnique, trigger: 'change'}
          ],
          sort: ''
        },
        editForm: {},
        addLoading: false,
        editLoading: false,
        options: [],
        value: '',
        selectLoading: false,
        modifyLoading: false,
        leaderLoading: false,
        postionLoading: false,
        selectDivisionDialog: false,
        modifyDivisionDialog: false,
        leaderDivisionDialog: false,
        postionDialog: false,
        leaderForm: {},
        leaderType: '职位',
        orgOptions: [],
        selectPost: [],
        postNameOptions: [],
        leaderOptions: [],
        currentRow: {},
        dimension: '',
        orgForm: {},
        waitPerson: [],
        havePerson: [],
        waitSelect: [],
        haveSelect: [],
      };
    },
    methods: {
      uploadSuccess(response, file, fileList) {
        fileList.splice(0, fileList.length);
        fileList.push(file);
        this.importFiles = response;
        this.loading2 = true;
        importOrg(this.importFiles).then((data) => {
          this.loading2 = false;
          if (data.data == '') {
            this.$message({
              message: '导入完成，生成导入结果明细失败',
              type: 'success'
            });
          }else if (!data.success) {
            this.$message({
              message: data.title,
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
            
            getOrgTreeByDimension({dimension: this.dimension}).then((data) => {
              this.dataTree = data;
            });
          }

        }).catch((err) => {
          this.loading2 = false;
          this.$message({
            type: 'error',
            message: "导入失败"
          });
        });
      },
      initAddForm() {
        this.addForm = {
          parentId: '',
          topName: '',
          name: '',
          code: '',
          orgType: '',
          status: '',
          level: '',
          sortNo: ''
        }
      },
      changeChild() {
        this.getOrgList();
      },
      closeDialog() {
        this.initAddForm();
        this.editForm = {};
      },
      editSubmit() {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.editLoading = true;
            saveOrg(this.editForm).then((data) => {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.editDivisionDialog = false;
              this.editLoading = false;
              this.editForm = {};
              getOrgTreeByDimension({dimension: this.dimension}).then((data) => {
                this.dataTree = data;
                this.handleNodeClick(this.currentNode);
              });
            }).catch((err) => {
              this.editLoading = false;
              this.$message({
                type: 'error',
                message: err.response.data.message
              });
            });
          }
        });
      },
      handleEdit() {
        var node = this.currentNode;
        getOrgById({id: node.id}).then((data) => {
          this.editForm = data;
          getOrgById({id: data.parentId}).then((pdata) => {
            this.editForm.topName = pdata.name;
            this.editDivisionDialog = true;
          });
        });
      },
      /**
       * 新增机构
       */
      openAddOrgDialog() {
        var node = this.currentNode;
        this.initAddForm();
        this.addForm.parentId = node.id;
        this.addForm.topName = node.text;
        this.addForm.orgType = "0";
        this.addForm.level = Number(node.attributes.level) + 1;
        this.addForm.dimension = this.dimension;
        this.addDivisionDialog = true;
      },
      saveSubmit() {//保存机构
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.addLoading = true;
            saveOrg(this.addForm).then((data) => {
              this.initAddForm();
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.addDivisionDialog = false;
              this.addLoading = false;
              getOrgTreeByDimension({dimension: this.dimension}).then((data) => {
                this.dataTree = data;
                this.handleNodeClick(this.currentNode);
              });
            }).catch((err) => {
              this.addLoading = false;
              this.$message({
                type: 'error',
                message: err.response.data.message
              });
            });
          }
        });
      },
      /**
       * 点击树结构机构
       */
      handleNodeClick(data) {
        this.currentNode = data;
        var node = this.currentNode;
        getOrgById({id: node.id}).then((data) => {
          this.showForm = data;
        });
        getOrgById({id: node.parentId}).then((pdata) => {
          this.topName = pdata.name;
        });
        this.getOrgList(node.id);
      },
      deleteRecord() {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var node = this.currentNode;
          delOrgById({id: node.id, code: node.code}).then((data) => {
            getOrgTreeByDimension({dimension: this.dimension}).then((data) => {
              this.dataTree = data;
              this.showForm = {};
              this.topName = '';
              this.tableData = [];
            });
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
      getOrgList(id) {
        if (typeof(id) == "undefined") {
          id = this.currentNode.attributes.id;
        }

        let para = {
          orgId: id,
          page: this.page,
          size: this.pageSize
        };
        getPositionPageByOrgId(para).then((data) => {
          this.tableData = data.rows;
          this.total = data.total;
          this.Loading = false;
        });
      },
      handleSizeChange(val) { //2.分页设置
        this.pageSize = val;
        this.getOrgList();
      },
      handleCurrentChange(val) { //2.分页设置
        this.page = val;
        this.getOrgList();
      },
      getTree(data) {//得到机构tree
        let para = {dimension: data};
        getOrgTreeByDimension(para).then((data) => {
          this.dataTree = data;
        });
      },
      download: function () {
        window.location.href = '/admin/static/org_import_templet.xlsx';
      },
      beforeFileUpload(file) {
        const isxlsx = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        if (!isxlsx) {
          this.$message.error('只能上传xlsx文件!');
        }
        return isxlsx;
      }, formatOrgType(row, column) {
        var dimension = row.dimension;
        if (dimension == 'ysdw') {
          return '预算单位';
        } else if (dimension == 'zgbm') {
          return '主管部门';
        } else if (dimension == 'bmks') {
          return '部门科室';
        }
        return '';
      }, getOrgTypeOptions() {//查询组织机构类型

        let param = {
          dicKey: 'orgType_catalog'
        };

        getDicItemListByDicKey(param).then((data) => {
          this.orgTypeOptions = data;
        });
      },
      /**
       * 选择维度
       */
      changeDimensionHandler(data) {
        this.$refs.tree.setCheckedKeys([]);
        this.dimension = data;
        this.getTree(data);
      },
      /**
       * 查询组织维度
       */
      getOrgDimension() {
        let param = {dicKey: 'org_dimension'};
        getDicItemListByDicKey(param).then((data) => {
          for (var value of data) {
            var param = {
              value: value.value,
              label: value.text
            };
            this.options.push(param);
          }
        });
      },
      handleTableChange(val) {
        this.currentRow = val;
      },
      openSelectDialog() {
        let param = {dicKey: 'org_post'};
        this.postNameOptions = [];
        this.selectPost = [];
        getDicItemListByDicKey(param).then((data) => {
          for (var value of data) {
            var param = {
              value: value.value,
              label: value.text
            };
            this.postNameOptions.push(param);
          }
        });
        let para = {
          orgId: this.currentNode.attributes.id
        };
        getPostByOrg(para).then((data) => {
          for (var value of data) {
            if (!this.selectPost.includes(value.value)) {
              this.selectPost.push(value.value);
            }
          }
        });

        this.selectDivisionDialog = true;
      },
      openModifyDialog() {
        if (Object.keys(this.tableData).length == 0) {
          this.$message({
            type: 'warning',
            message: '请先生成职位！'
          });
        } else {
          this.modifyDivisionDialog = true;
        }
      },
      openLeaderDialog() {
        if (Object.keys(this.currentRow).length == 0) {
          this.$message({
            type: 'warning',
            message: '请先选择需要设置上级的职位！'
          });
        } else {
          this.leaderOptions = [];
          let para = {positionId: this.currentRow.id};
          getPositionManage(para).then((data) => {
            this.leaderForm = data;
            let params = {orgId: data.leaderOrgId};
            getPositionListByOrg(params).then((data) => {
              for (var value of data) {
                var val = {
                  value: value.id,
                  label: value.postName
                };
                this.leaderOptions.push(val);
              }
            });
          });
          this.orgOptions = [];
          let param = {dimension: this.dimension};
          getOrgListByDimension(param).then((data) => {
            for (var value of data) {
              var param = {
                value: value.id,
                label: value.name
              };
              this.orgOptions.push(param);
            }
          });
          this.leaderDivisionDialog = true;
        }
      },
      changeRadio() {
        this.leaderForm.leaderId = '';
      },
      changeLeaderOrg() {
        this.leaderForm.leaderId = '';
      },
      saveLeaderSubmit() {
        this.leaderForm.positionId = this.currentRow.id;
        this.leaderForm.leaderType = this.leaderType;
        savePositionManage(this.leaderForm).then((data) => {
          if (data.success) {
            this.$message({
              type: 'success',
              message: '保存成功！'
            });
          }
        });
      },
      savePostSubmit() {
        var ids = '';
        var selects = [];
        for (var value  of this.selectPost) {
          for (var opt  of this.postNameOptions) {
            if (opt.value == value) {
              selects.push(opt);
            }
          }
        }
        for (var key of selects) {
          ids += key.value + ',';
        }
        var postId = ids.substr(0, ids.length - 1);
        let para = {
          orgId: this.currentNode.attributes.id,
          postIds: postId
        };

        if (postId == '') {
          this.$message({
            type: 'error',
            message: '请选择岗位！'
          });
        } else {
          this.selectLoading = true;
          orgConnectPost(para).then((data) => {
            if (data.success) {
              this.$message({
                type: 'success',
                message: '保存成功！'
              });
              this.selectLoading = false;
              this.getOrgList(this.currentNode.attributes.id);
            }
          });
        }
      },
      closeModifyDialog() {
        this.getOrgList(this.currentNode.attributes.id);
        this.modifyDivisionDialog = false;
      },
      saveModifySubmit() {
        this.modifyLoading = true;
        modifyPositionSort(this.tableData).then((data) => {
          if (data.success) {
            this.$message({
              type: 'success',
              message: '保存成功！'
            });
            this.modifyLoading = false;
            this.getOrgList(this.currentNode.attributes.id);
          }
        });
      },
      closeLeaderDialog() {
        this.leaderDivisionDialog = false;
        this.leaderForm = {};
        this.leaderOptions = [];
        this.orgOptions = [];
      },
      changeHandler(boolean) {
        this.leaderOptions = [];
        if (boolean && this.leaderForm.leaderOrgId == null) {
          this.$message({
            type: 'warning',
            message: '请先选择上级所属机构！'
          });
        } else {
          let param = {orgId: this.leaderForm.leaderOrgId};
          if (boolean && this.leaderType == "身份") {
            getIdentityListByOrg(param).then((data) => {
              for (var value of data) {
                var param = {
                  value: value.id,
                  label: value.name
                };
                this.leaderOptions.push(param);
              }
            });
          }
          if (boolean && this.leaderType == "职位") {
            getPositionListByOrg(param).then((data) => {
              for (var value of data) {
                var param = {
                  value: value.id,
                  label: value.postName
                };
                this.leaderOptions.push(param);
              }
            });
          }
        }
      },
      AuthorizationDialog() {
        if (Object.keys(this.currentNode).length === 0) {
          this.$message({
            type: 'warning',
            message: '请先选择机构！'
          });
        } else {
          this.orgForm = {};
          this.orgForm.id = this.currentNode.id;
          this.orgForm.name = this.currentNode.text;
          this.currentNode2 = this.dataTree[0];
          this.selectAreaTreeNodeList();
          this.postionDialog = true;
        }
      },

      areaNodeClick(data) {
        this.currentNode2 = data;
        this.selectAreaTreeNodeList();
      },
      selectAreaTreeNodeList() {
        var waitPerson = [];
        var havePerson = [];
        let NoConnectPara = {
          orgId: this.orgForm.id,
          isCascade: this.orgShowChild,
          orgCode: this.currentNode2.code,
          dimension: this.dimension
        };

        getHasNoConnectIdentity(NoConnectPara).then((data) => { //查询未授权的
          waitPerson = data;
          getHasConnectIdentity(NoConnectPara).then((data) => { //查询已经授权的 //必须放在这里，否则有时候会错乱
            havePerson = data;
            if (havePerson && havePerson.length > 0) {
              for (var i = waitPerson.length - 1; i >= 0; i--) {
                for (var j = 0; j < havePerson.length; j++) {
                  if (waitPerson[i].id == havePerson[j].id) {
                    waitPerson.splice(i, 1);
                    break;
                  }
                }
              }
              ;
            }
            this.waitPerson = waitPerson; //这样避免左边的列表先显示，然后不显示，导致有时候会错乱
            this.havePerson = havePerson;
          });
        });
      },
      selectWaitPersonAll(selection) {
        this.waitSelect = selection;
      },
      selectHavePersonAll(selection) {
        this.haveSelect = selection;
      },
      selectWaitPersonRow(selection, row) {
        this.waitSelect = selection;
      },
      selectHavePersonRow(selection, row) {
        this.haveSelect = selection;
      },

      toGrant() {
        if (!this.waitSelect || this.waitSelect.length == 0) {
          this.alertDialog('请选择需要授权的人员!', '提示');
        }
        for (var obj in this.waitSelect) {
          this.havePerson.push(this.waitSelect[obj]);
        }
        for (var i = this.waitPerson.length - 1; i >= 0; i--) {
          for (var j = 0; j < this.waitSelect.length; j++) {
            if (this.waitPerson[i].id == this.waitSelect[j].id) {
              this.waitPerson.splice(i, 1);
              break;
            }
          }
        }
        this.waitSelect = [];
      },
      cancelGrant() { //取消
        if (!this.haveSelect || this.haveSelect.length == 0) {
          this.alertDialog('请选择需要取消的人员!', '提示');
        }
        for (var obj in this.haveSelect) {
          this.waitPerson.push(this.haveSelect[obj]);
        }
        //删除
        for (var i = this.havePerson.length - 1; i >= 0; i--) {
          for (var j = 0; j < this.haveSelect.length; j++) {
            if (this.havePerson[i].id == this.haveSelect[j].id) {
              this.havePerson.splice(i, 1);
              break;
            }
          }
        }
        this.haveSelect = [];
      },
      saveConnectPersonnel() { //保存关联人员
        this.postionLoading = true;
        var params = new Set();
        if (this.havePerson && this.havePerson.length > 0) {
          for (let person of this.havePerson) {
            let para = {
              orgId: this.orgForm.id,
              identityId: person.id,
              userId: person.userId,
              dimension: this.dimension
            };
            params.add(para);
          }
        } else { //当为空的时候，就只删除，不用保存
          var obj = {
            orgId: this.orgForm.id,
            dimension: this.dimension
          };
          params.add(obj);
        }
        saveOrgIdentityInfo(params).then((data) => {
          this.postionLoading = false;
          this.$message({
            type: 'success',
            message: '保存成功!'
          });
        });
      },
    },
    mounted() {
      this.getOrgDimension();
      this.getOrgTypeOptions();
      this.fileUploadUrl = gbs.fileServiceUrl + '/file/uploadFile';
      this.fileDownloadUrl = gbs.fileServiceUrl + '/file/download';
    },
    created() {
      var childMainHeight = $('.childMain').height();
      if (childMainHeight) {
        this.tableHeight = (childMainHeight - 50) + 'px';
      } else {
        this.tableHeight = '480px';
      }
    }
  }
</script>

<style scoped>

</style>
