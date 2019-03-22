<template>
  <div class="con_main">
    <div class="childMain">
      <div class="handle">
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button type="primary" :disabled="selectState" @click="handleDelete">删除</el-button>
      </div>
      <el-table :data="tableData" @row-dblclick="dblclick" border style="width: 100%" :height="tableHeight"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="name" label="角色名称">
        </el-table-column>
        <el-table-column prop="code" label="角色代码">
        </el-table-column>
        <el-table-column prop="type" label="所属分类">
        </el-table-column>
        <el-table-column prop="dimension" :formatter="fomaterDimensions" label="维度">
        </el-table-column>
        <!--<el-table-column prop="status" :formatter="formatStatus" label="可用状态" width="100">
                </el-table-column>-->
        <el-table-column label="操作" width="70" align="center">
          <template slot-scope="scope">
            <el-dropdown trigger="click" placement="bottom-start" @command="(command) => handleCommand(command, scope.row)">
              <div style="width: 60px;"><i class="el-icon-more"></i></div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="0">修改</el-dropdown-item>
                <el-dropdown-item command="1">关联人员</el-dropdown-item>
                <el-dropdown-item command="2">关联权限</el-dropdown-item>
                <el-dropdown-item command="3">删除</el-dropdown-item>
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
    <el-dialog v-loading.fullscreen.lock="addLoading" :title="title" :visible.sync="addRoleDialog"
               :close-on-click-modal="false">
      <el-form :model="addForm" ref="addForm" :rules="rules" label-width="120px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色代码" prop="code">
          <el-input v-model="addForm.code"></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="type">
          <el-select v-model="addForm.type" filterable allow-create placeholder="请选择">
            <el-option v-for="item in roleTypeOptions" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="维度" prop="dimension">
          <el-select v-model="addForm.dimension" filterable allow-create placeholder="请选择">
            <el-option v-for="item in dimensionOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="addForm.describe" type="textarea" :rows="2"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveSubmitForm">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog v-loading.fullscreen.lock="rolePersonnelLoading" title="角色用户授权" :visible.sync="rolePersonnelDialog"
               :close-on-click-modal="false" width="80%" top="7vh">
      <el-form :model="roleForm" label-width="70px">
        <el-form-item label="角色名称">
          <el-input v-model="roleForm.name" readonly></el-input>
        </el-form-item>
      </el-form>
      <el-row class="rolehead">
        <el-col :span="4">
          <h5>组织机构结构</h5></el-col>
        <el-col :span="9">
          <h5>待授权用户</h5></el-col>
        <el-col :span="2">
          <h5>操作</h5></el-col>
        <el-col :span="9">
          <h5>已授权用户</h5></el-col>
      </el-row>
      <el-row class="dialog" style="background:#f5f5f5;height:391px;">
        <el-col :span="4" style="height:391px;overflow:auto;">
          <div class="showChild">
            <el-checkbox v-model="showChild" @change="selectAreaTreeNodeList">显示子集</el-checkbox>
          </div>
          <el-tree :data="orgDataTree" ref="tree" :highlight-current=true @node-click="areaNodeClick"
                   :default-expand-all=true :expand-on-click-node=false node-key="id" :props="defaultProps"
                   style="background:#f5f5f5;">
          </el-tree>
        </el-col>
        <el-col :span="9">
          <el-table :data="waitPerson" @select="selectWaitPersonRow" @select-all="selectWaitPersonAll" border
                    style="width: 100%" height="390">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="name" align="center" label="用户">
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
            <el-table-column prop="name" align="center" label="用户" width="180">
            </el-table-column>
            <el-table-column label="允许转授">
              <template slot-scope="scope">
                <el-switch v-model="havePerson[scope.$index].isTurnGrant"></el-switch>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rolePersonnelDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveConnectPersonnel">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog v-loading.fullscreen.lock="rolePermissionLoading" title="角色权限项授权" :visible.sync="rolePermissionDialog"
               :close-on-click-modal="false" width="50%" top="8vh">
      <el-form :model="roleForm" label-width="70px">
        <el-form-item label="角色名称">
          <el-input v-model="roleForm.name" readonly></el-input>
        </el-form-item>
      </el-form>

      <el-row style="background:#f5f5f5;height:391px">
        <el-col :span="9">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAllPermission"
                       @change="handleCheckAllPermissionChange">全选
          </el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="checkedPermissions" @change="handlecheckedPermissionChange">
            <el-checkbox v-for="Permission in Permissions" :label="Permission.id" :key="Permission.id">
              {{Permission.name}}
            </el-checkbox>
          </el-checkbox-group>el-cascader
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rolePermissionDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveConnectRolePermission">保 存</el-button>
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

    <!--角色详情-->
    <el-dialog :title="detailDlgTitle" width="80%" top="1vh" :lock-scroll="false" :visible.sync="detailDlgShow">
      <roleDetailComponent ref="roleDetailDlg"></roleDetailComponent>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getPageByAreaCode,
    saveRole,
    validateRoleCode,
    deleteRoleById,
    updateRoleStatus,
    getTreeData,
    getTreeDataByConnect,
    personnelList,
    getHasConnectPerson,
    getHasNoConnectPerson,
    saveConnectRolePersonnel,
    getPermissionTypes,
    getHasNoConnectPermission,
    getPerssionTypesByConnect,
    getHasConnectPermission,
    saveRolePermissions,
    getAllPermission,
    batchDeleteByIds,
    saveRolePermissionByIds,
    getDicItemListByDicKey,
    getRoleTypes
  } from '../../api/api';

  import siteAuthForm from '@/components/system/siteAuthForm.vue'
  import sitePageAuthForm from '@/components/system/sitePageAuthForm.vue'
  import roleDetailComponent from '@/components/system/roleDetailComponent.vue'

  export default {
    components: {
      siteAuthForm,
      sitePageAuthForm,
      roleDetailComponent
    },
    data() {
      //TODO:
      var validateCodeUnique = (rule, value, callback) => {
        if (value) {
          let para = {
            id: this.addForm.id,
            code: value
          }
          validateRoleCode(para).then((data) => {
            if (!data) {
              callback(new Error('角色代码必须唯一'));
            } else {
              callback();
            }
          });
        } else {
          callback();
        }
      };
      return {
        detailDlgTitle: '角色详情',
        detailDlgShow: false,
        tableHeight: '',
        page: 1,
        pageSize: 20,
        total: 0,
        title: '新增',
        tableData: [],
        dimensionOptions:[],
        rules: {
          name: [{
            required: true,
            message: '必填 ',
            trigger: 'change'
          },
            {
              min: 1,
              max: 30,
              message: '长度在 1到 30个字符',
              trigger: 'change'
            }
          ],
          type: {
            required: true,
            message: '必填 ',
            trigger: 'change'
          },
          dimension: {
            required: true,
            message: '必填 ',
            trigger: 'change'
          },
          code: [{
            required: true,
            message: '必填 ',
            trigger: 'change'
          },
            {
              min: 1,
              max: 20,
              message: '长度在 1到 20个字符',
              trigger: 'change'
            },
            {
              validator: validateCodeUnique,
              trigger: 'change'
            }
          ]
        },
        addRoleDialog: false,
        inputRoleDialog: false,
        fileList: [],
        rolePermissionDialog: false,
        rolePersonnelDialog: false,
        showChild: false,
        roleTypeOptions: [],

        addForm: {
          name: '',
          code: '',
          type: '',
          dimension: '',
          describe: '',
          status: true
        },
        roleForm: {
          roleId: '',
          name: '',
        },
        waitPerson: [],
        havePerson: [],
        waitSelect: [],
        haveSelect: [],
        waitPower: [],
        havePower: [],
        waitPowers: [],
        havePowers: [],
        currentNode: {},
        orgDataTree: [],
        defaultProps: {
          children: 'children',
          label: 'text'
        },
        permissionType: '',
        roleType: '',
        rolePermissionLoading: false,
        addLoading: false,
        rolePersonnelLoading: false,
        siteAuthDialog: false,
        sitePageAuthDialog: false,
        selection: [],
        isIndeterminate: true,
        checkAllPermission: false,
        Permissions: [],
        checkedPermissions: [],
        permissionOptions: [],
        selectState: true
      };
    },
    methods: {
      getDimensionOptions(){
        let param = {
          dicKey: 'org_dimension'
        };
        getDicItemListByDicKey(param).then((data) => {
          for (var value of data) {
            var param = {
              value: value.value,
              label: value.text
            };
            this.dimensionOptions.push(param);
          }
        });
      },
      fomaterDimensions(row,column){//格式化维度信息
        let obj = {};
          obj = this.dimensionOptions.find((item)=>{
              return item.value === row.dimension;
        });
        
        if (obj && obj.label) {
          return obj.label;
        } else {
          return ''
        }
      },
      formatStatus(row, column) {
        if (row.status) {
          return "启用";
        } else {
          return "停用";
        }
      },
      initAddForm() {
        this.addForm = {
          name: '',
          code: '',
          type: '',
          dimension: '',
          describe: '',
          status: true
        }
      },
      handleAdd() { //新增
        this.initAddForm();
        this.getRolesType();
        this.title = "新增";
        this.addRoleDialog = true;
      },
      handleEdit(row) { //修改
        this.title = '修改';
        this.getRolesType();
        this.addForm = row;
        this.addRoleDialog = true;
      },
      getRolesType() {// 获取所有角色类型
        getRoleTypes().then((data) => {
          if (data) {
            this.roleTypeOptions = data
          }
        });        
      },
      saveSubmitForm() { //保存对象
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.addLoading = true;
            saveRole(this.addForm).then((data) => {
              this.$message({
                type: 'success',
                message: '保存成功!'
              });
              this.addRoleDialog = false;
              this.addLoading = false;
              this.getListByPage();
            });
          } else {
            //this.$message('请确认表单是否填写完整！');
          }
        });
      },
      getListByPage() { //得到分页列表
        let para = {
          type: '',
          page: this.page,
          size: this.pageSize
        };
        getPageByAreaCode(para).then((data) => {
          this.tableData = data.rows;
          this.total = data.total;
        });
      },
      handleSizeChange(val) { //2.分页设置
        this.pageSize = val;
        this.getListByPage();
      },
      handleCurrentChange(val) { //2.分页设置
        this.page = val;
        this.getListByPage();
      },
      deleteRecord(index, row) {
        if (row.id == 1) { //平台管理员
          this.alertDialog('平台管理员角色不能删除', '提示');
        } else {
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let para = {
              id: row.id,
            };
            deleteRoleById(para).then((data) => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getListByPage();
            });
          }).catch(() => {
          });
        }

      },
      startOrStop(index, row, status, message) {
        this.$confirm('确定要' + message + '该项吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let para = {
            id: row.id,
            status: status,
          };
          updateRoleStatus(para).then((data) => {
            this.$message({
              type: 'success',
              message: '启用成功!'
            });
            this.getListByPage();
          });
        }).catch(() => {
        });
      },
      openConnectRolePersonnel(row) { //打开关联人员
        this.roleForm = {};
        this.roleForm.roleId = row.id;
        this.roleForm.name = row.name;
        getTreeDataByConnect().then((data) => {
          this.orgDataTree = data;
          this.currentNode = data[0];
          this.selectAreaTreeNodeList(this.currentNode.attributes.code);
          this.rolePersonnelDialog = true;
        });
      },
      areaNodeClick(data) {
        this.currentNode = data;
        this.selectAreaTreeNodeList(this.currentNode.attributes.code);
      },
      selectAreaTreeNodeList() {
        var waitPerson = [];
        var havePerson = [];
        let NoConnectPara = {
          roleId: this.roleForm.roleId,
          orgCode: this.currentNode.attributes.code,
          isCascade: this.showChild
        };

        getHasNoConnectPerson(NoConnectPara).then((data) => { //查询未授权的
          waitPerson = data;
          getHasConnectPerson(NoConnectPara).then((data) => { //查询已经授权的 //必须放在这里，否则有时候会错乱
            console.info(JSON.stringify(data));
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
      saveConnectPersonnel() { //保存关联人员
        this.rolePersonnelLoading = true;
        var params = new Set();
        if (this.havePerson && this.havePerson.length > 0) {
          for (let person of this.havePerson) {
            let para = {
              roleId: this.roleForm.roleId,
              personnelId: person.id,
              isTurnGrant: person.isTurnGrant,
              orgCode: this.currentNode.attributes.code,
              isCascade: this.showChild
            };
            params.add(para);
          }
        } else { //当为空的时候，就只删除，不用保存
          var obj = {
            roleId: this.roleForm.roleId,
            orgCode: this.currentNode.attributes.code,
            isCascade: this.showChild
          };
          params.add(obj);
        }
        saveConnectRolePersonnel(params).then((data) => {
          this.rolePersonnelLoading = false;
          this.$message({
            type: 'success',
            message: '保存成功!'
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
      openConnectRolePermission(row) { //打开关联权限
        this.roleForm = {};
        this.roleForm.roleId = row.id;
        this.roleForm.name = row.name;
        this.selectPermissionItems();
        this.rolePermissionDialog = true;
      },
      selectPermissionItems() {
        let para = {
          type: '',
          roleId: this.roleForm.roleId,
        };
        getAllPermission().then((data) => {
          this.Permissions = data;
          for (var val of data) {
            this.permissionOptions.push(val.id);
          }
        });
        this.checkedPermissions = [];
        getHasConnectPermission(para).then((data) => {
          for (var val of data) {
            this.checkedPermissions.push(val.id);
          }
        });

      },
      saveConnectRolePermission() { //保存
        this.rolePermissionLoading = true;

        var ids = '';
        for (var val of this.checkedPermissions) {
          ids += val + ',';
        }
        var permissionIds = ids.substr(0, ids.length - 1);

        let param = {
          roleId: this.roleForm.roleId,
          permissionIds: permissionIds,
        };
        saveRolePermissionByIds(param).then((data) => {
          this.rolePermissionLoading = false;
          this.$message({
            type: 'success',
            message: '保存成功!'
          });
        }).catch(() => {
          this.rolePermissionLoading = false;
        });
      },
      //      saveConnectRolePermission() { //保存
      //        //this.rolePermissionDialog = false;
      //        var params = [];
      //        var obj = {};
      //        if(this.havePower && this.havePower.length > 0) {
      //          for(var power of this.havePower) {
      //            obj.roleId = this.roleForm.roleId;
      //            obj.type = this.permissionType;
      //            obj.permissionId = power.id;
      //            params.push(obj);
      //          }
      //        } else { //当为空的时候，就只删除，不用保存
      //          obj.roleId = this.roleForm.roleId;
      //          obj.type = this.permissionType;
      //          params.push(obj);
      //        }
      //
      //        var para = {
      //          rolePermissionList: JSON.stringify(params)
      //        }
      //        saveRolePermissions(para).then((data) => {
      //          this.$message({
      //            type: 'success',
      //            message: '保存成功!'
      //          });
      //        });
      //      },
      selectWaitPowerAll(selection) {
        this.waitPowers = selection;
      },
      selectHavePowerAll(selection) {
        this.havePowers = selection;
      },
      selectWaitPowerRow(selection, row) {
        this.waitPowers = selection;
      },
      selectHavePowerRow(selection, row) {
        this.havePowers = selection;
      },
      toPowerGrant() {
        if (!this.waitPowers || this.waitPowers.length == 0) {
          this.alertDialog('请选择需要关联的权限!', '提示');
        }
        for (var obj in this.waitPowers) {
          this.havePower.push(this.waitPowers[obj]);
        }
        for (var i = this.waitPower.length - 1; i >= 0; i--) {
          for (var j = 0; j < this.waitPowers.length; j++) {
            if (this.waitPower[i].id == this.waitPowers[j].id) {
              this.waitPower.splice(i, 1);
              break;
            }
          }
        }
        this.waitPowers = [];
      },
      cancelPowerGrant() { //取消
        if (!this.havePowers || this.havePowers.length == 0) {
          this.alertDialog('请选择需要取消的权限!', '提示');
        }
        for (var obj in this.havePowers) {
          this.waitPower.push(this.havePowers[obj]);
        }
        //删除
        for (var i = this.havePower.length - 1; i >= 0; i--) {
          for (var j = 0; j < this.havePowers.length; j++) {
            if (this.havePower[i].id == this.havePowers[j].id) {
              this.havePower.splice(i, 1);
              break;
            }
          }
        }
        this.havePowers = [];
      },
      alertDialog(message, title) { //抽出公共的提示弹出框
        this.$alert(message, title, {
          confirmButtonText: '确定',
          type: 'info',
          callback: action => {
          }
        });
      },
      siteAuth(index, row) { //打开站点授权dialog
        this.siteAuthDialog = true;
        this.$nextTick(() => {
          this.$refs.siteAuthInfo.loadData(row.name, row.id, '0');
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
          this.$refs.sitePageAuthInfo.loadData(row.name, row.id, '0');
        });
      },
      closeFresh1() {
        this.sitePageAuthDialog = false;
      }, saveSitePageAuth() {//保存站点页面授权信息
        this.$nextTick(() => {
          this.$refs.sitePageAuthInfo.saveSitePageAuth();
        });
      },
      dblclick(row, event, column) {// table列表双击
        this.detailDlgShow = true;
        this.$nextTick(() => {
          this.$refs.roleDetailDlg.loadData(row, this.roleType);
        });
      },
      handleCommand(command, row) {// 修改 删除dropdown
        if (command == '0') {// 修改
          this.handleEdit(row);
        } else if (command == '1') {
          //关联人员
          this.openConnectRolePersonnel(row);
        } else if (command == '2') {
          //关联权限
          this.openConnectRolePermission(row);
        } else if (command == '3') {// 删除
          if (row.id == 1) { //平台管理员
            this.alertDialog('平台管理员角色不能删除', '提示');
          } else {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let para = {
                id: row.id,
              };
              deleteRoleById(para).then((data) => {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.getListByPage();
              });
            }).catch(() => {
            });
          }
        }
      },
      handleSelectionChange(val) {
        this.selection = val;
        if (val.length == 0){
          this.selectState = true;
        }else {
          this.selectState = false;
        }
      },
      handleDelete() {

        var b = this.selection.filter((item) => {
          return item.id == 1;
        });

        if (b.length == 1) { //平台管理员
          this.alertDialog('平台管理员角色不能删除', '提示');
        } else {
          this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {

            var ids = "";
            for (var val of this.selection) {
              ids += val.id + ',';
            }
            var roleIds = ids.substr(0, ids.length - 1);
            let para = {
              ids: roleIds,
            };
            batchDeleteByIds(para).then((data) => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getListByPage();
            });

          }).catch(() => {
          });
        }
      },
      handleCheckAllPermissionChange(val) {
        this.checkedPermissions = val ? this.permissionOptions : [];
        this.isIndeterminate = false;
      },
      handlecheckedPermissionChange(value) {
        let checkedCount = value.length;
        this.checkAllPermission = checkedCount === this.Permissions.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.Permissions.length;
      }

    },
    mounted() {
      this.getDimensionOptions();
      this.getListByPage();
    },
    created() {
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

  .con_main .childMain {
    padding: 10px;
    box-sizing: border-box;
    float: left;
    width: 100%;
    height: 100%;
    position: relative;
  }

</style>
