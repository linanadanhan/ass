<template>
  <div class="con_main">
    <div class="childBar">
      <el-select v-model="value" placeholder="请选择维度" @change="(data)=>changeDimensionHandler(data)">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <div class="showChild">
        <el-checkbox v-model="showChild" @change="changeChild">显示子集</el-checkbox>
      </div>
      <el-tree :data="dataTree" default-expand-all highlight-current ref="tree" @node-click="handleNodeClick"
               :expand-on-click-node=false node-key="id" :props="defaultProps">
      </el-tree>
    </div>
    <div class="childMain">
      <div class="handle">
        <el-button type="primary" v-if="showAddBtn" @click="addPersonnel()">新增</el-button>

        <el-upload style="display: inline-block;padding-left: 10px;padding-right: 10px;" :on-success="uploadSuccess"
                   :data="uploadData" :action="fileUploadUrl" :show-file-list="false" :on-change="handleChange"
                   :before-upload="beforeFileUpload">
          <el-button type="primary">导入</el-button>
        </el-upload>

        <el-button type="primary" @click="download">模板下载</el-button>
        <el-button :disabled="selectState" type="primary" @click="movePersonnel()">移动至</el-button>
        <el-button :disabled="selectState" type="primary" @click="batchDelPersonnel()">批量删除</el-button>

        <el-input style="float: right;margin-top:0;margin-bottom:10px;width:150px" size="small" placeholder="请输入关键字"
                  icon="search" v-model="search">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="searchTableData"></i>
        </el-input>

      </div>

      <div v-show="showDiv">
        <el-table ref="multipleTable" :data="tableData" @row-click="rowClick" @row-dblclick="dblclick"
                  @selection-change="changeForm" border style="width: 100%" :height="tableHeight">
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column prop="C_SORT_NO" width="60" label="序号">
          </el-table-column>
          <el-table-column prop="C_NAME" label="中文名" width="100">
          </el-table-column>
          <el-table-column prop="C_LOGIN_NAME" label="登录名" width="100">
          </el-table-column>
          <el-table-column prop="C_PASSWORD_POLICY" label="密码策略" width="150" :formatter="formatterPassPolicy">
          </el-table-column>
          <el-table-column prop="C_MOBILE_PHONE" label="手机号" width="110">
          </el-table-column>
          <el-table-column prop="C_EMAIL" label="邮箱">
          </el-table-column>
          <el-table-column label="操作" width="70" align="center">
            <template slot-scope="scope">
              <el-dropdown trigger="click" placement="bottom-start" @command="(command) => handleCommand(command, scope.row)">
                <div style="width: 60px;"><i class="el-icon-more"></i></div>
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

      <div v-show="!showDiv">

        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane label="人员信息" name="first">
            <el-row class="tab">
              <el-form :model="addForm" :rules="rules" ref="addForm" label-width="120px">
                <el-row>
                  <el-col :span="10">
                    <el-form-item label="中文名" prop="name">
                      <el-input v-model="addForm.name"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="登录名" prop="loginName">
                      <div v-if="!addForm.id">
                        <el-input v-model="addForm.loginName"></el-input>
                      </div>
                      <div v-if="addForm.id">
                        <el-input v-model="addForm.loginName" readonly></el-input>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="16">
                    <el-form-item label="机构/岗位">
                      <el-input v-model="currentNode.text" readonly></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2">
                    <el-form-item>
                      <el-button type="text" @click="addPost()">新增</el-button>
                    </el-form-item>
                  </el-col>

                </el-row>

                <template v-for="(item,index) in postions">
                  <el-row>
                    <el-col :span="16">
                      <el-form-item>
                        <el-input v-model="item.positionName" readonly @focus="choose(index)"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2">
                      <el-form-item>
                        <el-button type="text" @click="deletePost(index)">删除</el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </template>


                <el-row>

                  <el-col :span="10">
                    <el-form-item label="密码策略">
                      <el-select v-model="addForm.passwordPolicy">
                        <el-option v-for="item in passwordPolicys" :key="item.value" :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="排序号">
                      <template>
                        <el-input-number v-model="addForm.sortNo" :min="1" :max="10"></el-input-number>
                      </template>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="10">
                    <el-form-item label="手机号" prop="mobilePhone">
                      <el-input v-model="addForm.mobilePhone"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="性别" prop="sex">
                      <el-select v-model="addForm.sex" filterable size="small">
                        <el-option label="女" value="0"></el-option>
                        <el-option label="男" value="1"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="20">
                    <el-form-item label="电子邮箱">
                      <el-input v-model="addForm.email"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="10">
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
            </el-row>
            <el-row style="text-align: right;">
              <el-col :span="20">
                <el-button type="primary" @click="saveSubmitForm()">保存</el-button>
                <el-button type="primary" @click="cancelSaveForm()">取消</el-button>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="用户权限信息" name="second">

            <el-form label-width="80px">

              <el-row type="flex" class="row-bg" justify="center">
                <el-col :span="10">
                  <el-form-item label="用户角色">
                    <el-input v-model="userRolesName" readonly></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-button type="text" @click="addRole()">添加</el-button>
                    <el-button type="text" @click="clearRole()">清空</el-button>
                  </el-form-item>
                </el-col>
              </el-row>

            </el-form>

          </el-tab-pane>
        </el-tabs>
      </div>


    </div>

    <el-dialog title="选择角色" :visible.sync="chooseRoleDialog" width="50%" :close-on-click-modal="false">
      <el-row>

        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="checkedRoles" @change="handlecheckedRolesChange">
          <el-checkbox v-for="role in roles" :label="role.id" :key="role.id">{{role.name}}</el-checkbox>
        </el-checkbox-group>

      </el-row>
      <el-row style="text-align: right;margin-top: 8px;">
        <el-button type="primary" @click="saveConnectRoles()">确定</el-button>
      </el-row>
    </el-dialog>

    <el-dialog title="选择机构/岗位" :visible.sync="chooseDialog" width="30%" :close-on-click-modal="false">
      <el-row>
        <el-row class="rolehead">
          <el-col :span="11">
            <h5>组织机构结构</h5></el-col>
          <el-col :span="13">
            <h5>待选岗位</h5></el-col>
        </el-row>
        <el-row class="dialog" style="background:#f5f5f5;height:391px;">
          <el-col :span="11" style="height:391px;overflow:auto;">
            <el-tree :data="orgDataTree" :highlight-current=true @node-click="areaNodeClick"
                     :default-expand-all=true :expand-on-click-node=false node-key="id" :props="defaultProps"
                     style="background:#f5f5f5;">
            </el-tree>
          </el-col>
          <el-col :span="13">
            <el-table :data="waitPost" highlight-current-row @current-change="handlePostChange" border
                      style="width: 100%" height="390">
              <el-table-column type="index" width="50"></el-table-column>
              <el-table-column prop="postName" align="center" label="岗位">
              </el-table-column>
            </el-table>
          </el-col>

        </el-row>
      </el-row>
      <el-row style="text-align: right;margin-top: 8px;">
        <el-button type="primary" @click="saveConnectPosition()">确定</el-button>
      </el-row>
    </el-dialog>

    <el-dialog v-loading.fullscreen.lock="connectLoading" title="人员角色授权" :visible.sync="connectRoleDialog"
               :close-on-click-modal="false" width="80%" top="8vh">
      <el-form :model="PersonnelForm" label-width="70px">
        <el-form-item label="人员名称">
          <el-input v-model="PersonnelForm.C_NAME" readonly></el-input>
        </el-form-item>
      </el-form>
      <el-row class="rolehead">
        <el-col :span="4">
          <h5>角色分类</h5></el-col>
        <el-col :span="9">
          <h5>待选角色</h5></el-col>
        <el-col :span="2">
          <h5 align="center">操作</h5></el-col>
        <el-col :span="9">
          <h5>已选角色</h5></el-col>
      </el-row>
      <el-row style="background:#f5f5f5;height:391px">
        <el-col :span="4" style="height:391px;overflow:auto;">
          <el-menu default-active="1" @select="selectRoleItems" class="el-menu-vertical-demo" background-color="#f5f5f5"
                   text-color="#000" active-text-color="#409EFF">
            <el-menu-item v-for="item in roleTypes" :key="item" :index="item">{{item}}</el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="9">
          <el-table ref="waitTable" :data="waitRole" @select="selectWaitRoleRow" @select-all="selectWaitRoleAll" border
                    style="width: 100%" height="390">
            <el-table-column type="selection" width="30">bn v
            </el-table-column>
            <el-table-column prop="name" label="角色名称" width="180">
            </el-table-column>
            <el-table-column prop="code" label="角色标识">
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
          <el-table ref="haveTable" :data="haveRole" @select="selectHaveRoleRow" @select-all="selectHaveRoleAll" border
                    style="width: 100%" height="390">
            <el-table-column type="selection" width="30">
            </el-table-column>
            <el-table-column prop="name" label="角色名称" width="180">
            </el-table-column>
            <el-table-column prop="code" label="角色标识">
            </el-table-column>
            <el-table-column label="允许转授">
              <template slot-scope="scope">
                <el-switch v-model="haveRole[scope.$index].isTurnGrant"></el-switch>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="connectRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveConnectRole">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog v-loading.fullscreen.lock="moveLoading" title="移动" size="tiny" :visible.sync="movePersonnelDialog"
               :close-on-click-modal="false">
      <div class='treeSelect'>
        <el-tree :data="dataTree" highlight-current ref="tree" @node-click="selectNodeClick" :default-expand-all=true
                 :expand-on-click-node=false node-key="id" :props="defaultProps">
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="movePersonnelDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveMove()">确 定</el-button>
      </div>
    </el-dialog>

    <!--站点授权-->
    <el-dialog size="small" title="关联站点" :visible.sync="siteAuthDialog" :close-on-click-modal="false" width="50%"
               top="8vh">
      <siteAuthForm @closeAndFresh="closeFresh" ref="siteAuthInfo"></siteAuthForm>
      <div class="dialog-footer" style="text-align: right;margin-top: 10px;">
        <el-button @click="siteAuthDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveSiteAuth">确 定</el-button>
      </div>
    </el-dialog>

    <!--站点页面授权-->
    <el-dialog size="small" title="关联页面" :visible.sync="sitePageAuthDialog" :close-on-click-modal="false" width="50%"
               top="8vh">
      <sitePageAuthForm @closeAndFresh="closeFresh1" ref="sitePageAuthInfo"></sitePageAuthForm>
      <div class="dialog-footer" style="text-align: right;margin-top: 10px;">
        <el-button @click="sitePageAuthDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveSitePageAuth">确 定</el-button>
      </div>
    </el-dialog>

    <!--人员详情-->
    <el-dialog :title="detailDlgTitle" width="80%" top="1vh" :lock-scroll="false" :visible.sync="detailDlgShow"
               @close="closeDetailDlg">
      <personDetailComponent ref="pDetailDlg"></personDetailComponent>
    </el-dialog>

  </div>
</template>

<script>
  import {
    batchDelPersonnel,
    delPersonnelById,
    getDicItemListByDicKey,
    getHasConnectRole,
    getHasNoConnectRole,
    getHasNoConnectRoleTypes,
    getIdentityInfoByPersonAndOrg,
    getOrgTreeByDimension,
    getPersonnelById,
    getPositionListByOrgId,
    importPersonnel,
    personConnectPosition,
    personnelPageList,
    savePersonnel,
    saveRolePersonnel,
    updatePersonnelStatus,
    validateLoginName,
    validatePhone,
    deleteConnectRole,
    getAllRoles,
    personnelConnectRoles,
    movePersonnel
  } from '../../api/api';
  
  import {gbs} from '../../config'

  import siteAuthForm from '@/components/system/siteAuthForm.vue'
  import sitePageAuthForm from '@/components/system/sitePageAuthForm.vue'
  import personDetailComponent from '@/components/system/personDetailComponent.vue'

  export default {
    components: {
      siteAuthForm,
      sitePageAuthForm,
      personDetailComponent
    },
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
          validateLoginName({
            "id": this.addForm.id,
            "loginName": value
          }).then((data) => {
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
        search: '',
        detailDlgTitle: '人员详情',
        detailDlgShow: false,
        tableHeight: '',
        showAddBtn: true,
        value6: '',
        page: 1,
        pageSize: 20,
        total: 0,
        sortProp: 'C_SORT_NO',
        order: 'asc',
        title: '新增',
        showChild: false,
        fileDownloadUrl: '',
        currentNode: {},
        currentOrgNode: {},
        selectRows: [],
        dataTree: [],
        rules: {
          name: [{
            required: true,
            message: '必填 ',
            trigger: 'change'
          },
            {
              min: 1,
              max: 30,
              message: '长度在 1到 50个字符',
              trigger: 'change'
            }
          ],
          loginName: [{
            required: true,
            message: '必填 ',
            trigger: 'blur'
          },
            {
              min: 1,
              max: 20,
              message: '长度在 1到 20个字符',
              trigger: 'change'
            },
            {
              validator: validateLogNameUnique,
              trigger: 'change'
            }
          ],
          sort: '',
          mobilePhone: {
            validator: validatePhoneUnique,
            trigger: 'change'
          }
        },
        dataTree: [],
        defaultProps: {
          children: 'children',
          label: 'text'
        },
        tableData: [],
        passwordPolicys: [{
          value: 1,
          label: '默认初始密码'
        }, {
          value: 2,
          label: '使用随机密码并发短信至手机'
        }],
        inputDivisionDialog: false,
        movePersonnelDialog: false,
        addOrEditDialog: false,
        chooseDialog: false,
        chooseRoleDialog: false,
        fileList: [],
        connectRoleDialog: false,
        addForm: {},
        unitList: [],
        PersonnelForm: {},
        roleTypes: [],
        waitRole: [],
        haveRole: [],
        waitRoles: [],
        haveRoles: [],
        roleType: '',
        fileList: [],
        importFiles: {},
        uploadData: {
          appId: '2',
        },
        checkFormData: [],
        selectMoveNode: {},
        fileUploadUrl: '',
        moveLoading: false,
        connectLoading: false,
        addLoading: false,
        siteAuthDialog: false,
        sitePageAuthDialog: false,
        postionOptions: [],
        value: '',
        options: [],
        dimension: '',
        selectState: true,
        showDiv: true,
        activeName: 'first',
        postionIds: [],
        postions: [],
        waitPost: [],
        orgDataTree: [],
        currentPostion: {},
        index: '',
        identityIds: [],
        userRoles: [],
        userRolesName: '',
        checkAll: false,
        checkedRoles: [],
        roles: [],
        roleOptions: [],
        isIndeterminate: true
      };
    },
    methods: {
      searchTableData() {
        this.page = 1;
        this.getPersonnelList();
      },
      closeDetailDlg() {
//				this.init();
        this.getPersonnelList(this.currentNode.attributes.code);
      },
      uploadSuccess(response, file, fileList) {
        this.importFiles = response;
        importPersonnel(this.importFiles).then((data) => {

          if (data.data == '') {

            this.init(this.dimension);

            this.$message({
              message: '导入完成，生成导入结果明细失败',
              type: 'success'
            });

          } else {
            this.$confirm('导入完成，是否需要下载导入结果明细?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'info'
            }).then(() => {

              this.init(this.dimension);

              window.location.href = this.fileDownloadUrl + "/" + data.data;

            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消下载'
              });
            });
          }

          this.inputDivisionDialog = false;
        }).catch((err) => {

          this.$message({
            type: 'error',
            message: "导入失败"
          });
        });
      },
      handleChange(file, fileList) {
        this.fileList = fileList.slice(-3);
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
          sex: '1',
          headImgRef: '',
          orgId: ''
        };
      },
      addPersonnel() { //新增
        this.initPersonnelDto(); //初始化表单，重置表单
        this.postions = [];
        this.selectState = true;
        this.showAddBtn = false;
        this.showDiv = false;
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
              this.addLoading = false;

              var ids = "";
              for (var val of this.postions) {
                if (val.isPosition) {
                  if (val.positionId != '') {
                    ids += val.positionId + ',';
                  }
                }
              }
              var positionIds = ids.substr(0, ids.length - 1);
              let para = {
                personId: data.id,
                positionIds: positionIds,
              };
              personConnectPosition(para).then((data) => {

              }).catch((err) => {
                this.$message({
                  type: 'error',
                  message: err.response.data.message
                });
              });
              this.handleNodeClick(this.currentNode);
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
      handleNodeClick(data) { //点击树节点
        this.showDiv = true;
        if (data.parentId == '0') {
          this.showAddBtn = false;
        } else {
          this.showAddBtn = true;
        }
        this.currentNode = data;
        this.getPersonnelList(this.currentNode.attributes.code);
        //更改可选职位的值
        this.postionOptions = [];
        getPositionListByOrgId({orgId: this.currentNode.id}).then((data) => {
          for (var value of data) {
            var param = {
              value: value.id,
              label: value.postName
            };
            this.postionOptions.push(param);
          }
        });
      },
      changeChild() {
        this.getPersonnelList();
      },
      getPersonnelList(code) {
        if (!code) {
          code = this.currentNode.attributes.code;
        }

        let para = {
        	dimension: this.value,
          orgCode: code,
          isCascade: this.showChild,
          page: this.page,
          size: this.pageSize,
          sortProp: this.sortProp,
          order: this.order,
          search: this.search
        };
        this.Loading = true;
        personnelPageList(para).then((data) => {
          this.tableData = data.rows;
          this.total = data.total;
        });
      },
      selectRoleItems(type) { //选中分类
        if (type == '全部') {
          type = '';
        }
        ;
        this.roleType = type; //保存的时候用
        var waitRole = [];
        var haveRole = [];
        getHasNoConnectRole({
          type: type
        }).then((data) => {
          waitRole = data;
          getHasConnectRole({
            type: type,
            personnelId: this.PersonnelForm.C_ID
          }).then((data) => { //必须放在这里，否则有时候会错乱
            haveRole = data;
            if (haveRole && haveRole.length > 0) {
              for (var i = waitRole.length - 1; i >= 0; i--) {
                for (var j = 0; j < haveRole.length; j++) {
                  if (waitRole[i]) {
                    if (waitRole[i].id == haveRole[j].id) {
                      waitRole.splice(i, 1);
                    }
                  }
                }
              }
              ;
            }
            this.waitRole = waitRole; //这样避免左边的列表先显示，然后不显示，导致有时候会错乱
            this.haveRole = haveRole;
          });
        });
      },
      connectRole(index, row) { //打开关联角色dialog
        this.PersonnelForm = row;
        getHasNoConnectRoleTypes().then((data) => {
          if (!data || data.length == 0) {
            this.connectRoleDialog = true;
            return false;
          }
          this.roleTypes = data;
          this.selectRoleItems(data[0]);
          this.connectRoleDialog = true;
        });
      },
      saveConnectRole() { //保存关联角色
        var params = new Set();
        if (this.haveRole && this.haveRole.length > 0) {
          for (var role of this.haveRole) {
            var obj = {
              personnelId: this.PersonnelForm.C_ID,
              roleId: role.id,
              type: this.roleType,
              isTurnGrant: role.isTurnGrant
            };
            params.add(obj);
          }
        } else { //当为空的时候，就只删除，不用保存
          var obj = {
            personnelId: this.PersonnelForm.C_ID,
            type: this.roleType
          };
          params.add(obj);
        }
        this.connectLoading = true;
        saveRolePersonnel(params).then((data) => {
          this.$message({
            type: 'success',
            message: '保存成功!'
          });
          this.connectLoading = false;
        });
      },
      selectWaitRoleAll(selection) {
        this.waitRoles = selection;
      },
      selectHaveRoleAll(selection) {
        this.haveRoles = selection;
      },
      selectWaitRoleRow(selection, row) {
        this.waitRoles = selection;
      },
      selectHaveRoleRow(selection, row) {
        this.haveRoles = selection
      },
      toGrant() {
        if (!this.waitRoles || this.waitRoles.length == 0) {
          this.alertDialog('请选择需要授权的角色!', '提示');
        }
        for (var obj in this.waitRoles) {
          console.info(this.waitRoles[obj]);
          this.haveRole.push(this.waitRoles[obj]);
        }
        //删除
        for (var i = this.waitRole.length - 1; i >= 0; i--) {
          for (var j = 0; j < this.waitRoles.length; j++) {
            if (this.waitRole[i].id == this.waitRoles[j].id) {
              this.waitRole.splice(i, 1);
              break;
            }
          }
        }
        this.waitRoles = [];
      },
      cancelGrant() { //取消
        if (!this.haveRoles || this.haveRoles.length == 0) {
          this.alertDialog('请选择需要取消的角色!', '提示');
        }
        for (var obj in this.haveRoles) {
          console.info(obj);
          this.waitRole.push(this.haveRoles[obj]);
        }
        //删除
        for (var i = this.haveRole.length - 1; i >= 0; i--) {
          for (var j = 0; j < this.haveRoles.length; j++) {
            if (this.haveRole[i].id == this.haveRoles[j].id) {
              this.haveRole.splice(i, 1);
              break;
            }
          }
        }
        this.haveRoles = [];
      },
      alertDialog(message, title) { //抽出公共的提示弹出框
        this.$alert(message, title, {
          confirmButtonText: '确定',
          type: 'info',
          callback: action => {
          }
        });
      },
      handleDelete(index, row) {
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let para = {
            id: row.C_ID
          };
          delPersonnelById(para).then((data) => {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getPersonnelList();
          });
        }).catch(() => {

        });
      },
      handleUpdate(index, row, status) { //停用或启用
        let messageTip = "停用"
        if (status) {
          messageTip = "启用";
        }
        this.$confirm('确定要' + messageTip + '吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let para = {
            id: row.C_ID,
            status: status
          };
          updatePersonnelStatus(para).then((data) => {
            this.$message({
              message: '成功' + messageTip,
              type: 'success'
            });
            this.getPersonnelList();
          });
        }).catch(() => {

        });
      },
      handleSizeChange(val) { //2.分页设置
        this.pageSize = val;
        this.getPersonnelList();
      },
      handleCurrentChange(val) { //2.分页设置
        this.page = val;
        this.getPersonnelList();
      },
      changeForm(val) {

        if (Object.keys(val).length === 0) {
          this.selectState = true;
        } else {
          this.selectState = false;
        }

        this.checkFormData = val; //选中数据
      },
      rowClick(row) {
        this.$refs.multipleTable.toggleRowSelection(row);
      },
      movePersonnel() { //移动至
        if (!this.checkFormData || this.checkFormData.length == 0) {
          this.alertDialog('您还没有选择要移动的人员!', '提示');
          return;
        }
        this.movePersonnelDialog = true;
      },
      selectNodeClick(data) { //选中移动的树节点
        //不能选中的是这批人的树节点
        this.selectMoveNode = data;
        if (data.attributes.code == this.currentNode.attributes.code) {
          this.alertDialog('新机构组织与原机构组织不能相同!', '提示');
          return;
        }
        //得到人的ids,和树节点的code
      },
      saveMove() { //保存移动
        console.info(this.selectMoveNode)
        if (jQuery.isEmptyObject(this.selectMoveNode)) {
          this.alertDialog('请选择目标位置!', '提示');
          return;
        }
        this.moveLoading = true;
        var ids = [];
        for (let i in this.checkFormData) {
          console.info(this.checkFormData[i].C_ID);
          ids.push(this.checkFormData[i].C_ID);
        }
        var param = {
          ids: ids.join(","),
          orgId: this.selectMoveNode.attributes.id
        }

        movePersonnel(param).then((data) => {
          this.moveLoading = false;
          this.$alert("移动成功,请重新给移动的这批人员赋予权限!", "提示", {
            confirmButtonText: '确定',
            type: 'info',
            callback: action => {
              this.movePersonnelDialog = false;
              //刷新列表
              this.getPersonnelList();
            }
          });
        }).catch((err) => {
          this.addLoading = false;
          this.$message({
            type: 'error',
            message: err.response.data.message
          });
        });
      },
      formatterPassPolicy(row, column) {
        if (row.C_PASSWORD_POLICY == '2') {
          return "短信密码";
        } else {
          return "默认初始化秘密";
        }
      },
      formatterStatus(row, column) {
        if (row.C_STATUS) {
          return "启用";
        } else {
          return "停用";
        }
      },
      handleAvatarSuccess(res, file) {
        this.addForm.headImg = res.referenceId;
        this.addForm.headImgRef = URL.createObjectURL(file.raw);
      },
      init(data) {
        let para = {dimension: data};
        getOrgTreeByDimension(para).then((data) => {
          this.dataTree = data;
          this.currentNode = data[0];
          this.getPersonnelList(this.currentNode.attributes.code);
        });
      },
      download: function () {
        window.location.href = '/admin/static/person_import_templet.xlsx';
      },
      beforeFileUpload(file) {
        const isxlsx = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        if (!isxlsx) {
          this.$message.error('只能上传xlsx文件!');
        }
        return isxlsx;
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
      siteAuth(index, row) { //打开站点授权dialog
        this.siteAuthDialog = true;
        this.$nextTick(() => {
          this.$refs.siteAuthInfo.loadData(row.C_NAME, row.C_ID, '1');
        });
      },
      closeFresh() {
        this.siteAuthDialog = false;
      }, saveSiteAuth() {//保存站点授权信息
        this.$nextTick(() => {
          this.$refs.siteAuthInfo.saveSiteAuth();
        });
      },
      sitePageAuth(index, row) { //打开站点页面授权dialog
        this.sitePageAuthDialog = true;
        this.$nextTick(() => {
          this.$refs.sitePageAuthInfo.loadData(row.C_NAME, row.C_ID, '1');
        });
      },
      closeFresh1() {
        this.sitePageAuthDialog = false;
      }, saveSitePageAuth() {//保存站点页面授权信息
        this.$nextTick(() => {
          this.$refs.sitePageAuthInfo.saveSitePageAuth();
        });
      }, dblclick(row, event, column) {// table列表双击
        this.detailDlgShow = true;
        var orgId = this.currentNode.id;
        var orgName = this.currentNode.text;
        this.$nextTick(() => {
          this.$refs.pDetailDlg.loadData(row.C_ID, row.C_NAME, orgId, orgName, this.dimension);
        });
      },
      handleCommand(command, row) {// 修改 删除dropdown
        if (command == '0') {// 修改

          // this.detailDlgShow = true;
          // var orgId = this.currentNode.id;
          // this.$nextTick(() => {
          //   this.$refs.pDetailDlg.loadData(row.C_ID, row.C_NAME, orgId, orgName, this.dimension);
          // });
          this.selectState = true;
          this.showAddBtn = false;
          //获取人员基本信息
          getPersonnelById({
            id: row.C_ID
          }).then((data) => { //这里必须要查，因为row的值不能保证全部
            this.addForm = data;
            this.addForm.headImgRef = gbs.fileServiceUrl + '/file/download/' + data.headImg;
          });

          //更改可选职位的值
          this.postionOptions = [];
          getPositionListByOrgId({orgId: this.currentNode.id}).then((data) => {
            for (var value of data) {
              var param = {
                value: value.id,
                label: value.postName
              };
              this.postionOptions.push(param);
            }
          });
          //初始化职位信息
          this.postions = [];
          let param = {
            personalId: row.C_ID,
            orgId: this.currentNode.id,
          };
          getIdentityInfoByPersonAndOrg(param).then((data) => {
            this.postions = data;
          })

          this.initRole(row.C_ID);

          this.showDiv = false;
        } else if (command == '1') {// 删除
          this.$confirm('确定要删除吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let para = {
              id: row.C_ID
            };
            delPersonnelById(para).then((data) => {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getPersonnelList();
            });
          }).catch(() => {

          });
        }
      },
      initRole(personnelId){
        let para = {
          personnelId: personnelId,
          type: ''
        }
        this.userRolesName = '';
        //初始化关联角色基本信息
        getHasConnectRole(para).then((data) => {
          this.userRoles = data;
          for (var val of data) {
            this.userRolesName += val.name + '; '
          }
        });

      },
      batchDelPersonnel() {// 批量删除人员
        if (!this.checkFormData || this.checkFormData.length == 0) {
          this.alertDialog('您还没有选择要删除的人员!', '提示');
          return;
        } else {
          this.$confirm('此操作将删除该人员及其下所有引用的数据项, 是否继续', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var ids = this.getIds();
            batchDelPersonnel({
              "ids": ids
            }).then((data) => {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getPersonnelList(this.currentNode.attributes.code);
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
        }
      },
      getIds() {
        this.checkFormData;
        var ids = '';
        ids = this.checkFormData[0].C_ID;
        for (var i = 1; i < this.checkFormData.length; i++) {
          ids += "," + this.checkFormData[i].C_ID;
        }
        return ids;
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
      /**
       * 选择维度
       */
      changeDimensionHandler(data) {
        this.$refs.tree.setCheckedKeys([]);
        this.dimension = data;
        this.init(data);
      },
      handleTabClick(tab, event) {
        if (tab.name == "first") {

          this.activeName = "first";

        } else if (tab.name == "second") {

          this.activeName = "second";

        }
      },
      addPost() {
        let param = {
          positionId: '',
          positionName: '',
          isPosition: true
        };
        this.postions.push(param);
      },
      deletePost(index) {
        var item = this.postions[index];
        if (!item.isPosition) {
          let param = {
            identityIds: item.id
          };
          this.identityIds.push(param);
          // deleteIdentityInfo(param).then((data) => {
          //
          // });
        }
        this.postions.splice(index, 1);
      },
      choose(index) {
        let para = {dimension: this.dimension};
        getOrgTreeByDimension(para).then((data) => {
          this.orgDataTree = data;
        });
        this.index = index;
        this.chooseDialog = true;
      },
      cancelSaveForm() {
        this.showAddBtn = true;
        this.showDiv = true;
      },
      saveConnectPosition() {
        var val = this.currentPostion;
        let param = {
          positionId: val.id,
          positionName: this.currentOrgNode.text + '/' + val.postName,
          isPosition: true
        }
        this.postions[this.index] = param;
        this.chooseDialog = false;
      },
      areaNodeClick(data) {
        this.currentOrgNode = data;
        var node = this.currentOrgNode;

        let para = {
          orgId: node.id,
        };
        getPositionListByOrgId(para).then((data) => {
          this.waitPost = data;
        });
      },
      handlePostChange(currentRow) {
        this.currentPostion = currentRow;
      },
      addRole() {
        this.roles = [];
        this.roleOptions = [];
        getAllRoles().then((data) => {
          this.roles = data;
          for (var val of data) {
            this.roleOptions.push(val.id);
          }
        });
        this.checkedRoles = [];
        for (var val of this.userRoles) {
          this.checkedRoles.push(val.id);
        }
        this.chooseRoleDialog = true;
      },
      clearRole() {
        this.$confirm('确定要清空所有角色吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          let para = {
            personnelId: this.addForm.id
          };

          deleteConnectRole(para).then((data) => {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.userRolesName = '';
            let para = {
              personnelId: this.addForm.id,
              type: ''
            }
            //初始化关联角色基本信息
            getHasConnectRole(para).then((data) => {
              this.userRoles = data;
              for (var val of data) {
                console.info(val)
                this.userRolesName += val.name + '; '
              }
            });
          });

        }).catch(() => {

        });
      },
      handleCheckAllChange(val) {
        this.checkedRoles = val ? this.roleOptions : [];
        this.isIndeterminate = false;
      },
      handlecheckedRolesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.roles.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.roles.length;
      },
      saveConnectRoles() {
        var ids = '';
        for (var val of this.checkedRoles) {
          ids += val + ',';
        }
        var roleIds = ids.substr(0, ids.length - 1);
        let param = {
          personalId: this.addForm.id,
          roleIds: roleIds
        }

        personnelConnectRoles(param).then((data) => {
          this.$message({
            message: '修改成功',
            type: 'success'
          });
          this.initRole(this.addForm.id);
          this.chooseRoleDialog = false;
        });
      }
    },
    mounted() {
      this.getOrgDimension();
      this.fileUploadUrl = gbs.fileServiceUrl + '/file/uploadFile';
      this.fileDownloadUrl = gbs.fileServiceUrl + '/file/download';
    },
    created() {
      var childMainHeight = $('.childMain').height();
      this.tableHeight = (childMainHeight - 90) + 'px';
    }
  }
</script>

<style scoped>
  .treeSelect {
    width: 100%;
    height: 300px;
    border: 1px solid #EAEAEA;
    overflow: auto;
  }

  .tab {
    height: 400px;
    overflow: auto;
  }

  .el-tree {
    border: 0px solid #d1dbe5;
  }
</style>
