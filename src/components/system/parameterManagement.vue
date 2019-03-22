<template>
  <div class="con_main">
    <div class="childBar">
      <div class="showChild">
        <h3>参数分类</h3>
      </div>
      <el-menu default-active="1" @select="selectItems" class="el-menu-vertical-demo">
        <el-menu-item v-for="item in parameterTypeOptionsAll" :key="item" :index="item"> {{ item }}</el-menu-item>
      </el-menu>
    </div>
    <div class="childMain">
      <div class="handle">
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </div>
      <el-table :data="tableData" border style="width: 100%" :height="tableHeight">
        <el-table-column type="index" width="80" align="center">
        </el-table-column>
        <el-table-column prop="name" label="参数名称" width="150">
        </el-table-column>
        <el-table-column prop="key" label="参数键" width="150">
        </el-table-column>
        <el-table-column prop="value" label="参数值">
        </el-table-column>
        <el-table-column prop="status" :formatter="statusFormat" label="状态" width="100">
        </el-table-column>
        <el-table-column label="操作" width="70" align="center">
          <template slot-scope="scope">
          	<el-dropdown trigger="click" placement="bottom-start" @command="(command) => handleCommand(command, scope.row)">
						  <div style="width: 60px;"><i class="el-icon-more"></i></div>
						  <el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="0">修改</el-dropdown-item>
							<el-dropdown-item command="1">删除</el-dropdown-item>
							<el-dropdown-item command="2">停用</el-dropdown-item>
							<el-dropdown-item command="3">启用</el-dropdown-item>
						  </el-dropdown-menu>
						</el-dropdown>
            <!--<el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            <el-button type="text" size="small" @click="deleteRecord(scope.$index, scope.row)">删除</el-button>
            <el-button type="text" size="small" @click="stop(scope.$index, scope.row)">停用</el-button>
            <el-button type="text" size="small" @click="start(scope.$index, scope.row)">启用</el-button>-->
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
    <el-dialog v-loading.fullscreen.lock="addLoading" :title="title" :visible.sync="addDivisionDialog" :close-on-click-modal="false">
      <el-form :model="addForm" ref="addForm" :rules="rules" label-width="120px">
        <el-form-item label="所属分类" prop="type">
          <el-select v-model="addForm.type" filterable allow-create placeholder="请选择">
            <el-option v-for="item in parameterTypeOptions" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参数名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="参数标识" prop="key">
          <el-input v-model="addForm.key"></el-input>
        </el-form-item>
        <el-form-item label="参数值" prop="value">
          <el-input type="textarea" :rows="2" v-model="addForm.value"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addForm.remark" type="textarea" :rows="2"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDivisionDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveSubmitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getParameterTypes,
    saveAndUpdateParameter,
    getParameterPageByType,
    updateParameterStatus,
    deleteParameterById,
    validateParameterKey
  } from '../../api/api';

  export default {
    data() {
      var validateKeyUnique = (rule, value, callback) => {
        if (value) {
          let para = {
            id: this.addForm.id,
            key: value
          }
          validateParameterKey(para).then((data) => {
            if (!data) {
              callback(new Error('参数标识必须唯一，该标识已存在'));
            } else {
              callback();
            }
          });
        } else {
          callback();
        }
      };
      return {
      	tableHeight:'',
        page: 1,
        pageSize: 10,
        total: 0,
        title: '新增',
        tableData: [],
        addDivisionDialog: false,
        showChild: false,
        parameterTypeOptions: [],
        parameterTypeOptionsAll: [],
        addForm: {
          id: '',
          name: '',
          key: '',
          value: '',
          type: '',
          remark: ''
        },
        rules: {
          type: [
            {required: true, message: '必填 ', trigger: 'hover'}
          ],
          name: [
            {required: true, message: '必填 ', trigger: 'hover'}
          ],
          key: [
            {required: true, message: '必填 ', trigger: 'hover'},
            {validator: validateKeyUnique, trigger: 'change'}
          ],
          value: [
            {required: true, message: '必填 ', trigger: 'hover'}
          ]
        },
        addLoading:false
      };
    },
    methods: {
      statusFormat(row, column) {
        if (row.status) {
          return "启用";
        } else {
          return "停用";
        }
      },
      handleSizeChange(val) {//2.分页设置
        this.pageSize = val;
      },
      handleCurrentChange(val) {//2.分页设置
        this.page = val;
      },
      init() {
        getParameterTypes().then((data) => {
          if (data && data.length > 0) {
            if (data.length>1) data.unshift('全部');
            this.parameterTypeOptionsAll = data;
            this.selectItems(data[0]);
          }else {
            this.parameterTypeOptionsAll = data;
            this.tableData = [];
            this.total = 0;
          }
        });
        this.getParameterTypeOptions();
      },
      getParameterTypeOptions(){
        getParameterTypes().then((data) => {
            this.parameterTypeOptions = data;
        });
      },
      selectItems(type) {
        if (type == '全部') {
          type = '';
        }
        let para = {
          type: type,
          page: this.page,
          size: this.pageSize
        };
        getParameterPageByType(para).then((data) => {
          if (data && data.rows) {
            this.tableData = data.rows;
            this.total = data.total;
          }
        });
      },
      initAddForm() {
        this.addForm = {
          id: '',
          name: '',
          key: '',
          value: '',
          type: '',
          remark: ''
        }
      },
      handleAdd() {
        this.initAddForm();
        this.title = '新增';
        this.addDivisionDialog = true;
      },
      handleEdit(index, row) {
        this.initAddForm();
        this.title = '修改';
        this.addForm = row;
        this.addDivisionDialog = true;
      },
      saveSubmitForm() {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.addLoading = true;
            saveAndUpdateParameter(this.addForm).then((data) => {
              this.$message({
                type: 'success',
                message: '保存成功!'
              });
              this.addLoading = false;
              this.addDivisionDialog = false;
              this.init();
            });
          } else {
            this.$message('请确认表单是否填写完整！');
          }
        });
      },
      handleNodeClick(data) {
        console.log(data);
      },
      deleteRecord(index, row) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteParameterById(row.id).then((data) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.init();
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      stop(index, row) {
        this.$confirm('确定要停用该项吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let para = {
            id: row.id,
            status: false,
          };
          updateParameterStatus(para).then((data) => {
            this.$message({
              type: 'success',
              message: '停用成功!'
            });
            this.init();
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消停用'
          });
        });
      },
      start(index, row) {
        this.$confirm('确定要启用该项吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let para = {
            id: row.id,
            status: true,
          };
          updateParameterStatus(para).then((data) => {
            this.$message({
              type: 'success',
              message: '启用成功!'
            });
            this.init();
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消启用'
          });
        });
      },
      handleCommand(command, row){
      	if (command == '0'){// 修改
      		this.handleEdit(0, row);
      	}else if (command == '1'){
      		this.deleteRecord(0, row);
      	}else if (command == '2'){
      		this.stop(0, row);
      	}else if (command == '3'){
      		this.start(0, row);
      	}
      }
      
    }
    ,
    mounted() {
    },
    created() {
      this.init();
      var childMainHeight = $('.childMain').height();
			this.tableHeight = (childMainHeight - 90) + 'px';
    }
  }

</script>

<style scoped>

</style>
