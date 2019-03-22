<template>
  <div class="con_main">
    <div class="childMain" style="width: 100%;">
      <div class="handle">
        <el-button type="primary" @click="addDataTable">新增</el-button>
        <el-input style="float: right;margin-top:0;margin-bottom:10px;width:150px" size="small" placeholder="请输入关键字"
                  icon="search"
                  v-model="search">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="handleSearch"></i>
        </el-input>
      </div>

      <el-table ref="multipleTable" :data="tableData" v-loading.fullscreen.lock="loading2" @row-dblclick="dblclick"
                highlight-current-row @selection-change="selectChange" border style="width: 100%;"
                :height="tableHeight">
        <el-table-column type="index" width="55" align="center"></el-table-column>
        <el-table-column prop="C_NAME" label="数据表名"></el-table-column>
        <el-table-column prop="C_TEXT" label="中文名"></el-table-column>
        <el-table-column prop="C_TYPE" :formatter="formatType" label="类型"></el-table-column>
        <el-table-column prop="C_DATASOURCETEXT" :formatter="formatDataSource" label="数据源"></el-table-column>
        <el-table-column prop="C_DATASOURCE" label="数据源code" v-if='false'></el-table-column>
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
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                       :page-sizes="[20, 50, 100, 200]" :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>

      <el-dialog size="small" :title="title" :visible.sync="editDialog" :close-on-click-modal="false" width="60%"
                 top="6vh">
        <manualTablesEdit @closeAndFresh="closeFresh" ref="sourceInfo"></manualTablesEdit>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialog = false">取 消</el-button>
          <el-button type="primary" @click="saveSubmitForm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {queryManualTables, delManualTables} from '../../api/api';
  import manualTablesEdit from '@/components/system/manualTablesEdit.vue';

  export default {
    components: {
      manualTablesEdit: manualTablesEdit
    },
    data() {
      return {
        tableHeight: '',
        total: 0,
        pageSize: 20,
        currentPage: 1,
        search: '',
        tableData: [],
        title: '新增',
        editDialog: false,
        loading2: false
      };
    },
    methods: {
      closeFresh() {
        this.editDialog = false;
        this.searchTableData();
      }, saveSubmitForm() {//手动建表数据保存
        this.$nextTick(() => {
          this.$refs.sourceInfo.saveData();
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
        queryManualTables(param).then(data => {
          this.tableData = data.rows;
          this.total = data.total;
        });
      }, dblclick(row) {
        this.editDialog = true;
        this.$nextTick(() => {
          if (row.C_DATASOURCE == null) {
            row.C_DATASOURCE = "_default"
          }
          this.$refs.sourceInfo.loadData(row.C_ID, row.C_DATASOURCE);
        });
      }, selectChange(rows) { //切换时，控制按钮
        this.selectRows = rows;
        if (rows.length > 0 && rows.length == 1) {
          this.enabledBtn = false;
        } else {
          this.enabledBtn = true;
        }
      },
      editDataTable(index, row) {
        this.title = "修改";
        this.editDialog = true;
        this.$nextTick(() => {
          this.$refs.sourceInfo.loadData(row.C_ID, row.C_DATASOURCE);
        });
      },
      addDataTable() {
        this.title = "新增";
        this.editDialog = true;
        this.$nextTick(() => {
          this.$refs.sourceInfo.loadData('');
        });
      }, deleteDataTable(index, row) {
        this.$confirm('此操作将删除该数据表, 是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (row.C_DATASOURCE == null) {
            row.C_DATASOURCE = "_default"
          }
          var params = {
            id: row.C_ID,
            dataSource: row.C_DATASOURCE
          };
          delManualTables(params).then((data) => {
            this.$message({
              message: '删除成功！',
              type: 'success'
            });
            this.searchTableData();
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleCommand(command, row) {
        if (command == '0') {
          this.title = "修改";
          this.editDialog = true;
          this.$nextTick(() => {
            this.$refs.sourceInfo.loadData(row.C_ID, row.C_DATASOURCE);
          });
        } else if (command == '1') {
          this.deleteDataTable(1, row);
        }
      },
      formatType(row, cell, value) {// 类型格式转换
        if (value == '00') {
          return "通用";
        } else if (value == '01') {
          return "树";
        }
      },
      formatDataSource(row, cell, value) {//数据源格式转换
        if (value === null) {
          return "系统数据源（默认）"
        } else {
          return value
        }
      },
    },
    mounted() {
      this.searchTableData();
    },
    created() {
      var childMainHeight = $('.childMain').height();
      this.tableHeight = (childMainHeight - 90) + 'px';
    }
  }
</script>

<style scoped>
</style>
