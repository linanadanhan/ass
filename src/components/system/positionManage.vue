<template>
  <div class="con_main">
    <div class="childBar">
      <el-tree :data="dataTree" default-expand-all highlight-current ref="tree" @node-click="handleNodeClick"
               :expand-on-click-node=false node-key="id" :props="defaultProps">
      </el-tree>
    </div>
    <div class="childMain">
      <div class="handle">
        <el-button type="primary" @click="openSelectDialog">生成职位</el-button>
        <el-button type="primary" @click="openModifyDialog">修改排序</el-button>
        <el-button type="primary" @click="openLeaderDialog">设置上级</el-button>
      </div>
      <el-table v-loading.fullscreen.lock="Loading" highlight-current-row @current-change="handleTableChange"
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
    <div class="childMain">
      <div class="handle">
        <el-button type="primary" @click="createIdentity">添加用户</el-button>
        <el-button type="primary" @click="deleteIdentity">删除</el-button>
      </div>
      <el-table v-loading.fullscreen.lock="Loading" highlight-current-row @selection-change="handleIdentityChange"
                :data="tableIdentityData" border style="width: 100%" :height="tableHeight">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column prop="loginName" label="登录名">
        </el-table-column>
        <el-table-column prop="name" label="姓名">
        </el-table-column>
        <el-table-column prop="mobilePhone" width="110" label="手机号">
        </el-table-column>
        <el-table-column prop="sortNo" label="排序号">
        </el-table-column>
      </el-table>
      <div class="page-box">
        <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page="page2"
                       :page-sizes="[20, 50, 100, 200]" :page-size="pageSize2"
                       layout="total, sizes, prev, pager, next, jumper" :total="total2">
        </el-pagination>
      </div>
    </div>

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
          <el-select v-model="leaderForm.leaderOrgId" placeholder="上级所属机构" style="width: 80%;" @change="changeLeaderOrg">
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

    <el-dialog title="添加用户" v-loading.fullscreen.lock="userLoading" width="50%" :visible.sync="userDivisionDialog"
               :close-on-click-modal="false" @close="closeUserDialog">

      <el-form ref="userForm" :model="userForm" :inline="true" label-width="80px">
        <el-form-item>
          <el-button type="primary" @click="createNewUser">新建用户</el-button>
        </el-form-item>
        <el-form-item>
          <el-autocomplete style="width: 220px"
                           v-model="userForm.input"
                           :fetch-suggestions="querySearch"
                           placeholder="搜索用户名，登录名或手机号"
                           @select="handleSelect">
            <template slot-scope="props">
              <div class="name">{{ props.item.name }}</div>
            </template>
          </el-autocomplete>
        </el-form-item>
      </el-form>

      <el-table highlight-current-row :data="tableUserData" border style="width: 100%"
                @selection-change="handleSelectChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column prop="loginName" label="登录名">
        </el-table-column>
        <el-table-column prop="name" label="姓名">
        </el-table-column>
        <el-table-column prop="mobilePhone" width="110" label="手机号">
        </el-table-column>
        <el-table-column prop="sortNo" label="排序号">
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="closeUserDialog">取 消</el-button>
        <el-button type="primary" @click="saveUserSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog v-loading.fullscreen.lock="addLoading" title="新增" :visible.sync="addPersonnelDialog"
               :close-on-click-modal="false">
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属组织机构">
              <el-input v-model="currentNode.text" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="中文名" prop="name">
              <el-input v-model="addForm.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="登录名" prop="loginName">
              <div v-if="!addForm.id">
                <el-input v-model="addForm.loginName"></el-input>
              </div>
              <div v-if="addForm.id">
                <el-input v-model="addForm.loginName" readonly></el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="mobilePhone">
              <el-input v-model="addForm.mobilePhone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="邮箱">
              <el-input v-model="addForm.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序号">
              <template>
                <el-input-number v-model="addForm.sortNo" :min="1" :max="10"></el-input-number>
              </template>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="密码策略">
              <el-select v-model="addForm.passwordPolicy">
                <el-option v-for="item in passwordPolicys" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户头像">
              <div class="up-file">
                <el-upload class="avatar-uploader" :action="fileUploadUrl" :show-file-list="false"
                           :on-success="(res,file) => handleAvatarSuccess(res, file)"
                           :before-upload="beforeAvatarUpload">
                  <div v-if="!addForm.id">
                    <img v-if="addForm.headImg" :src="addForm.headImgRef" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon">用户头像</i>
                  </div>
                  <div v-if="addForm.id">
                    <img v-if="addForm.headImg" :src="addForm.headImgRef" class="avatar">
                    <img v-else src="../../../static/img/noImg.jpg" class="el-icon-plus avatar-uploader-icon"/>
                  </div>
                </el-upload>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addPersonnelDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveSubmitForm()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {
    deleteIdentityInfo,
    getDicItemListByDicKey,
    getIdentityInfoByPosition,
    getIdentityListByOrg,
    getOrgListByDimension,
    getOrgTreeByPerson,
    getPositionPageByOrgId,
    getPositionListByOrg,
    getPositionManage,
    getPostByOrg,
    modifyPositionSort,
    orgConnectPost,
    positionConnectPerson,
    savePersonnel,
    savePositionManage,
    vagueQueryPerson,
    validateLoginName,
    validatePhone
  } from '../../api/api';

  export default {
    data() {
      var validatePhoneUnique = (rule, value, callback) => {
        if (value) {
          let para = {
            id: this.addForm.id,
            phone: value
          }
          validatePhone(para).then((data) => {
            if (!data) {
              callback(new Error('手机号必须唯一，此手机号已存在'));
            } else {
              callback();
            }
          });
        } else {
          callback();
        }
      };

      var validateLogNameUnique = (rule, value, callback) => {
        if (value) {
          validateLoginName({"id": this.addForm.id, "loginName": value}).then((data) => {
            if (data) {
              callback();
            } else {
              callback(new Error('登录名已存在！'));
            }
          });
        } else {
          callback();
        }
      };
      return {
      	tableHeight: '',
        page: 1,
        pageSize: 20,
        total: 0,
        page2: 1,
        pageSize2: 20,
        total2: 0,
        childMainWidth: '',
        currentNode: {},
        dataTree: [],
        defaultProps: {
          children: 'children',
          label: 'text'
        },
        tableData: [],
        tableIdentityData: [],
        tableUserData: [],
        Loading: false,
        selectLoading: false,
        modifyLoading: false,
        leaderLoading: false,
        userLoading: false,
        addLoading: false,
        selectDivisionDialog: false,
        modifyDivisionDialog: false,
        leaderDivisionDialog: false,
        userDivisionDialog: false,
        addPersonnelDialog: false,
        postNameOptions: [],
        orgOptions: [],
        leaderOptions: [],
        value: '',
        currentRow: {},
        currentRow2: {},
        orgIds: '',
        selectPost: [],
        sortForm: {},
        leaderForm: {},
        leaderType: '职位',
        userForm: {},
        selection: [],
        addForm: {},
        rules: {
          name: [
            {required: true, message: '必填 ', trigger: 'change'},
            {min: 1, max: 30, message: '长度在 1到 50个字符', trigger: 'change'}
          ],
          loginName: [
            {required: true, message: '必填 ', trigger: 'blur'},
            {min: 1, max: 20, message: '长度在 1到 20个字符', trigger: 'change'},
            {validator: validateLogNameUnique, trigger: 'change'}
          ],
          sort: '',
          mobilePhone: {validator: validatePhoneUnique, trigger: 'change'}
        },
        passwordPolicys: [{
          value: 1,
          label: '默认初始密码'
        }, {
          value: 2,
          label: '使用随机密码并发短信至手机'
        }],
        fileUploadUrl: '',
      };
    },
    methods: {
      handleSizeChange(val) { //2.分页设置
        this.pageSize = val;
        this.getOrgList();
      },
      handleCurrentChange(val) { //2.分页设置
        this.page = val;
        this.getOrgList();
      },
      handleSizeChange2(val) { //2.分页设置
        this.pageSize2 = val;
        this.findIdentityInfo(this.currentRow.id);
      },
      handleCurrentChange2(val) { //2.分页设置
        this.page2 = val;
        this.findIdentityInfo(this.currentRow.id);
      },
      handleTableChange(val) {
        this.currentRow = val;
        this.findIdentityInfo(val.id);
      },
      findIdentityInfo(id) {
        if (typeof(id) == "undefined") {
          id = this.currentRow.id;
        }
        let para = {
          positionId: id,
          page: this.page2,
          size: this.pageSize2
        };
        this.Loading = true;
        getIdentityInfoByPosition(para).then((data) => {
          this.tableIdentityData = data.rows;
          this.total2 = data.total;
          this.Loading = false;
        });
      },
      handleIdentityChange(val) {
        this.currentRow2 = val;
      },
      createIdentity() {
        if (Object.keys(this.currentRow).length == 0) {
          this.$message({
            type: 'warning',
            message: '请选择人员！'
          });
        } else {
          this.userDivisionDialog = true;
        }
      },
      deleteIdentity() {
        if (Object.keys(this.currentRow2).length == 0) {
          this.$message({
            type: 'warning',
            message: '请选择人员！'
          });
        } else {
          this.$confirm('此操作将删除该身份, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.userLoading = true;
            var ids = '';
            for (var val of this.currentRow2) {
              ids += val.id + ',';
            }
            var identityIds = ids.substr(0, ids.length - 1);
            deleteIdentityInfo({identityIds: identityIds}).then((data) => {
              if (data.success) {
                this.$message({
                  type: 'success',
                  message: '删除成功！'
                });
                this.userLoading = false;
                this.findIdentityInfo(this.currentRow.id);
              }
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }
      },
      querySearch(queryString, cb) {
        let para = {
          condition: this.userForm.input,
          positionId: this.currentRow.id
        };
        vagueQueryPerson(para).then((data) => {
          var restaurants = data;
          cb(restaurants);
        });
      },
      handleSelect(item) {
        const array = this.tableUserData;
        const isTrue = array.find(obj => obj.id === item.id);
        if (!isTrue) {
          this.tableUserData.push(item);
        }
      },
      handleSelectChange(selection) {
        this.selection = selection;
      },
      saveUserSubmit() {
        if (Object.keys(this.selection).length == 0) {
          this.$message({
            type: 'warning',
            message: '请勾选数据！'
          });
        } else {
          this.userLoading = true;
          var ids = '';
          for (var val of this.selection) {
            ids += val.id + ',';
          }
          var personIds = ids.substr(0, ids.length - 1);
          let para = {
            positionId: this.currentRow.id,
            personIds: personIds,
          };
          positionConnectPerson(para).then((data) => {
            if (data.success) {
              this.$message({
                type: 'success',
                message: '保存成功！'
              });
              this.userLoading = false;
              this.findIdentityInfo(this.currentRow.id);
            }
          });
        }

      },
      closeUserDialog() {
        this.userDivisionDialog = false;
        this.userForm = {};
        this.tableUserData = [];
      },
      createNewUser() {
        this.initPersonnelDto(); //初始化表单，重置表单
        this.addPersonnelDialog = true;
      },
      handleAvatarSuccess(res, file) {
        this.addForm.headImg = res.referenceId;
        this.addForm.headImgRef = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        var allow = (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/bmp')
        const isLt2M = file.size / 1024 / 1024 / 2 < 2;
        if (!allow) {
          this.$message.error('上传头像图片只能是 JPG格式或PNG格式或BMP格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return allow && isLt2M;
      },
      saveSubmitForm() { //保存对象
        this.addForm.orgId = this.currentNode.id;
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.addLoading = true;
            savePersonnel(this.addForm).then((data) => {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.tableUserData.push(data);
              this.addLoading = false;
              this.addPersonnelDialog = false;
            }).catch((err) => {
              this.addLoading = false;
              this.$message({
                type: 'error',
                message: err.response.data.message
              });
            });
          } else {
            this.$message('请确认表单是否填写完整！');
          }
        });
      },
      initPersonnelDto() {
        this.addForm = {
          id: '',
          name: '',
          loginName: '',
          mobilePhone: '',
          email: '',
          sortNo: 1,
          passwordPolicy: 1,
          status: true,
          isMobileAccess: true,
          orgCode: '',
          headImg: '',
          headImgRef: '',
          orgId: ''
        };
      },
      /**
       * 得到机构tree
       */
      getTree() {
        getOrgTreeByPerson().then((data) => {
          this.dataTree = data;
          if (typeof(data[0]) != 'undefined') {
            this.currentNode = data[0];
            this.getOrgList(this.currentNode.attributes.id);
          }
        });
      },
      /**
       * 点击树结构机构
       */
      handleNodeClick(data) {
        this.tableIdentityData = [];
        this.currentNode = data;
        this.getOrgList(this.currentNode.attributes.id);
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
        this.Loading = true;
        getPositionPageByOrgId(para).then((data) => {
          this.tableData = data.rows;
          this.total = data.total;
          this.Loading = false;
        });
      },
      openSelectDialog() {
        let param = {dicKey: 'org_post'};
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
      closeDialog() {
        this.postNameOptions = [];
        this.selectPost = [];
        this.selectDivisionDialog = false;
      },
      openModifyDialog() {
        this.modifyDivisionDialog = true;
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
          let param = {dimension: this.currentNode.attributes.dimension};
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
      closeLeaderDialog() {
        this.leaderDivisionDialog = false;
        this.leaderForm = {};
        this.leaderOptions = [];
        this.orgOptions = [];
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
      changeLeaderOrg(){
        this.leaderForm.leaderId = '';
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
    },
    mounted() {
      this.getTree();
    },
    created(){
    	var childMainHeight = $('.childMain').height();
			this.tableHeight = (childMainHeight - 90) + 'px';
    }
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

  .con_main .rightBar {
    width: 40%;
    height: 100%;
    float: left;
    background: #f6f7fb;
    overflow: auto;
  }

  .childBar .el-menu {
    background: none;
  }

  .el-menu-item {
    height: 40px;
    line-height: 40px;
  }

  .con_main .childMain {
    padding: 10px;
    box-sizing: border-box;
    float: left;
    width: 40%;
    height: 100%;
    position: relative;
  }

  .childMain .handle {
    margin-bottom: 10px;
    float: left;
  }

</style>

