<template>
  <div class="con_main">
    <div class="childMain">
      <div class="handle">
        <el-button type="primary" @click="addDataTableDlg=true">新增</el-button>
      </div>
      <el-table :data="tableData" border style="width: 100%" :height="tableHeight">
        <el-table-column type="index" width="80" align="center"></el-table-column>
        <el-table-column prop="C_NAME" label="数据表名"></el-table-column>
        <el-table-column prop="C_TEXT" label="中文名"></el-table-column>
        <el-table-column label="操作" width="70" align="center">
          <template slot-scope="scope">
          	<el-dropdown trigger="click" placement="bottom-start" @command="(command) => handleCommand(command, scope.row)">
						  <div style="width: 60px;"><i class="el-icon-more"></i></div>
						  <el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="0">修改</el-dropdown-item>
							<el-dropdown-item command="1">删除</el-dropdown-item>
						  </el-dropdown-menu>
						</el-dropdown>
            <!--<el-button type="text" size="small" @click="editDataTable(scope.$index, scope.row)">修改</el-button>
            <el-button type="text" size="small" @click="deleteRecord(scope.$index, scope.row)">删除</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <div class="page-box">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                       :page-sizes="[20, 50, 100, 200]" :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>

      <el-dialog v-loading.fullscreen.lock="addLoading" title="新增" :visible.sync="addDataTableDlg"
                 :close-on-click-modal="false" @close="closeDialog">
        <el-form :model="addForm" :rules="rules" ref="addForm" label-width="120px">
          <el-form-item label="数据表名" prop="C_NAME">
            <el-input v-model="addForm.C_NAME"></el-input>
          </el-form-item>
          <el-form-item label="中文名称" prop="C_TEXT">
            <el-input v-model="addForm.C_TEXT"></el-input>
          </el-form-item>
          <el-form-item label="所属分类" prop="C_CATALOG">
            <el-select v-model="addForm.C_CATALOG" filterable allow-create>
              <el-option v-for="item in catalogs" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文件字段" prop="C_FILECOLUMNS">
            <el-input v-model="addForm.C_FILECOLUMNS" type="textarea" :rows="4"></el-input>
          </el-form-item>
          <el-form-item label="扩展表" prop="C_EXT_TABLE">
            <el-input v-model="addForm.C_EXT_TABLE"></el-input>
          </el-form-item>
          <el-form-item label="从表配置" prop="C_SUBTABLES">
            <el-input v-model="addForm.C_SUBTABLES" type="textarea" :rows="4"></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDataTableDlg = false">取 消</el-button>
          <el-button type="primary" @click="addSubmit">确 定</el-button>
        </div>
      </el-dialog>

    </div>
  </div>

</template>

<script>
  //	import axios from 'axios';
  //axios.defaults.baseURL = 'http://localhost:8004';//配置接口地址
  import {dataTableSave, delDataTable, loadDataTable, queryCatalogs, queryDataTable} from '../../api/datatable';

  export default {
    data() {
      return {
      	tableHeight:'',
        total: 0,
        pageSize: 20,
        currentPage: 1,
        tableData: [],
        currentLevel: 1,
        addDataTableDlg: false,
        catalogs: [],
        addForm: {
          C_ID: '',
          C_NAME: '',
          C_TEXT: '',
          C_CATALOG: '',
          C_FILECOLUMNS: '',
          C_EXT_TABLE: '',
          C_SUBTABLES: ''
        },
        rules: {},
        addLoading: false
      };
    },
    methods: {
      closeDialog() {
        this.addForm = {};
      },
      handleUpdate(index, row, status) {

      },
      editDataTable(index, row) {
        this.addDataTableDlg = true;
        var params = {
          columnNames: '',
          C_ID: row.C_ID
        };
        loadDataTable(params).then((data) => {
          this.addForm = data;
        });
      },
      addSubmit() {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.addLoading = true;
            dataTableSave(this.addForm).then((data) => {
              this.addLoading = false;
              if (data.success) {
                this.addForm.C_ID = data.data;
                this.$message({
                  message: '保存成功',
                  type: 'success'
                });
                this.addDataTableDlg = false;
                this.dataForm = {};
                this.searchTableData();
              } else {
                this.$message({
                  message: '保存失败,' + data.title,
                  type: 'error'
                });
              }
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
      formatterStatus(row, column) {

      },

      deleteRecord(index, row) {
        var params = {
          C_ID: row.C_ID
        };
        delDataTable(params).then((data) => {
          this.searchTableData();
        });
      },
      handleSizeChange(val) { //2.分页设置
        this.pageSize = val;
        this.searchTableData();
      },
      handleCurrentChange(val) { //2.分页设置
        this.currentPage = val;
        this.searchTableData();
      },
      searchTableData() {
        var param = {
          columnNames: '',
          page: this.currentPage,
          rows: this.pageSize
        };
        queryDataTable(param).then(data => {
          this.tableData = data.rows;
          this.total = data.total;
        });
      },
      queryCatalogs() {
        queryCatalogs().then((data) => {
          for (var val of data) {
            let param = {
              value: val,
              label: val
            };
            this.catalogs.push(param);
          }
        });
      },
      handleCommand(command, row){
      	if (command == '0'){// 修改
      		this.editDataTable(1, row);
      	}else if (command == '1'){
      		this.deleteRecord(1, row);
      	}
      	
      }
    },
    mounted() {
      this.searchTableData();
    },
    created() {
      this.queryCatalogs();
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
