<template>
  <div>
    <el-form :model="addForm" ref="addForm" :rules="rules" label-width="100px">
      <el-form-item v-show="addForm.C_ID !=''" label="表名" prop="C_NAME">
        <el-input v-model="addForm.C_NAME" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="中文名" prop="C_TEXT">
        <el-input v-model="addForm.C_TEXT" clearable></el-input>
      </el-form-item>

      <el-form-item label="类型" prop="C_TYPE">
        <el-select v-model="addForm.C_TYPE" :disabled="addForm.C_ID !=''" @change="handleTypeChange" placeholder="请选择类型">
          <el-option label="通用" value="00"></el-option>
          <el-option label="树" value="01"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="数据源" prop="C_DATASOURCE">
        <el-select v-model="addForm.C_DATASOURCE" @change="handleDatesourceChange" placeholder="请选择数据源">
          <el-option v-for="item in dataSourceOptions" :key="item.C_NAME" :label="item.C_TEXT" :value="item.C_NAME">
          </el-option>
        </el-select>
      </el-form-item>

    </el-form>
    <div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="C_COLUMN" label="栏位名">
          <template slot-scope="scope">
            <el-input :size="size" :disabled="scope.row.C_DEFAULT" v-model="scope.row.C_COLUMN"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="C_COLUMN_TYPE" width="120" label="类型">
          <template slot-scope="scope">
            <el-select :size="size" :disabled="scope.row.C_DEFAULT" filterable  v-model="scope.row.C_COLUMN_TYPE" value-key="value"
                       @visible-change="typeSelect" placeholder="请选择类型">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="C_LENGTH" label="长度" width="75">
          <template slot-scope="scope">
            <el-input :disabled="scope.row.C_DEFAULT" :size="size" v-model="scope.row.C_LENGTH"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="C_IS_NULL" label="空值" width="50">
          <template slot-scope="scope">
            <el-checkbox :disabled="scope.row.C_DEFAULT" v-model="scope.row.C_IS_NULL" :size="size"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="C_COMMENT" label="注释">
          <template slot-scope="scope">
            <el-input :disabled="scope.row.C_DEFAULT" :size="size" v-model="scope.row.C_COMMENT"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="C_PRIMARY" label="主键" width="50">
          <template slot-scope="scope">
            <el-checkbox :disabled="scope.row.C_DEFAULT" v-model="scope.row.C_PRIMARY" :size="size"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="60">
          <template slot-scope="scope">
            <el-button :disabled="scope.row.C_DEFAULT" @click.native.prevent="deleteRow(scope.$index, tableData)"
                       title="删除栏位" type="text" size="small">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 10px;">
        <el-button type="primary" :size="size" title="新增栏位" @click="addRow">+</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getDicItemListByDicKey,
    getManualTableById,
    isExitManualTableName,
    saveManualTable,
    getAllDataSource
  } from '../../api/api';

  import {
    initDataTable
  } from '../../config/initDataTable';

  import {
    MySqlOptions,
    OracleOptions
  } from '../../config/typeOptions';

  export default {
    data() {
      //表名唯一性校验
      var validateNameUnique = (rule, value, callback) => {
        if (value) {
          if (!/^[A-Za-z][A-Za-z0-9_]+$/.test(value)) {
            callback(new Error('请输入英文、数字或下划线等，英文字符开头！'));
          }
          isExitManualTableName({
            "C_NAME": value,
            "id": this.addForm.C_ID
          }).then((data) => {
            if (data) {
              callback();
            } else {
              callback(new Error('数据表名已存在！'));
            }
          });
        } else {
          callback();
        }
      };

      return {
        dataSourceOptions: [],
        initTableConfig: {},
        size: 'mini',
        tableData: [],
        typeOptions: [],
        options: [],
        addForm: {
          C_ID: '',
          C_NAME: '',
          C_TEXT: '',
          C_TYPE: '00',
          C_DATASOURCE: ''
        },
        rules: {
          C_TEXT: [{
            required: true,
            message: '必填 ',
            trigger: 'blur'
          },
            {
              min: 1,
              max: 50,
              message: '长度在 1到 50个字符',
              trigger: 'change'
            }
          ],
          C_TYPE: [{
            required: true,
            message: '必填 ',
            trigger: 'blur'
          }
          ],
          C_DATASOURCE: [{
            required: true,
            message: '必填 ',
            trigger: 'blur'
          }
          ]
        },
      }
    },
    methods: {
      addRow() {// 新增行
        this.tableData.push({
          "C_COLUMN_TYPE": "",
          "C_COLUMN": "",
          "C_LENGTH": "",
          "C_IS_NULL": true,
          "C_COMMENT": "",
          "C_PRIMARY": false
        })
      },
      deleteRow(index, rows) {// 删除行
        rows.splice(index, 1);
      },
      handleTypeChange(val) {
        let obj = {};
        obj = this.dataSourceOptions.find((item) => {
          return item.C_NAME === this.addForm.C_DATASOURCE;
        });
        if (obj.C_TYPE == 1) {//MySQL数据源
          this.tableData = this.initTableConfig[val]
        } else if (obj.C_TYPE == 2 && val == "00") {//Oracle数据源+通用
          this.tableData = this.initTableConfig["02"]
        } else if (obj.C_TYPE == 2 && val == "01") {//Oracle数据源+树
          this.tableData = this.initTableConfig["03"]
        }
      },
      handleDatesourceChange(val) {
        let obj = {};
        obj = this.dataSourceOptions.find((item) => {
          return item.C_NAME === val;
        });
        if (this.addForm.C_TYPE == "00" && obj.C_TYPE == 1) {//MySQL数据源+通用
          this.tableData = this.initTableConfig[this.addForm.C_TYPE]
        } else if (this.addForm.C_TYPE == "01" && obj.C_TYPE == 1) {//MySQL数据源+树
          this.tableData = this.initTableConfig[this.addForm.C_TYPE]
        } else if (this.addForm.C_TYPE == "00" && obj.C_TYPE == 2) {//Oracle数据源+通用
          this.tableData = this.initTableConfig["02"]
        } else if (this.addForm.C_TYPE == "01" && obj.C_TYPE == 2) {//Oracle数据源+树
          this.tableData = this.initTableConfig["03"]
        }
      },
      typeSelect(val) {
        let obj = {};
        obj = this.dataSourceOptions.find((item) => {//获取到数据源选项中的单独一条数据
          return item.C_NAME === this.addForm.C_DATASOURCE;
        });
        if (obj.C_TYPE == 1) {//如果是MySQL数据源
          this.options = MySqlOptions;
        } else if (obj.C_TYPE == 2) {//如果是Oracle数据源
          this.options = OracleOptions;
        }
      },
      loadData(id, dataSource) {
        this.getAllDataSource();
        if (!id && !dataSource) { //新增
          this.$refs['addForm'].resetFields();
          this.addForm.C_ID = '';
          this.addForm.C_NAME = '';
          this.addForm.C_TEXT = '';
          this.addForm.C_TYPE = '00';
          this.addForm.C_DATASOURCE = '_default';
          // this.tableData = [];
          this.initTableConfig = initDataTable;
          this.tableData = initDataTable['00'].slice(0,7)
        } else { //修改
          this.initTableConfig = initDataTable;
          getManualTableById({
            id: id,
            dataSource: dataSource
          }).then((data) => {
            console.log(data.C_DATASOURCE)
            if(data.C_DATASOURCE=="" || !data.C_DATASOURCE){
              data.C_DATASOURCE="_default"
            }
            this.addForm = data;
            let tableConfig = this.initTableConfig[data.C_TYPE]
            for (var i in data.columnList) {
              var isExist = false
              for (var j in tableConfig) {
                if (data.columnList[i].C_COLUMN == tableConfig[j].C_COLUMN) {
                  isExist = true
                  break
                }
              }
              if (isExist) {
                data.columnList[i].C_DEFAULT = true
              }
            }
            this.tableData = data.columnList;
            this.$refs['addForm'].resetFields();
          });
        }
      },
      getTypeOptions() {
        let param = {
          dicKey: 'table_type'
        };
        getDicItemListByDicKey(param).then((data) => {
          this.typeOptions = data;
        });
      },
      saveData() {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            if (this.tableData.length == 0) {
              this.$message({
                type: 'error',
                message: '栏位不能为空!'
              });
            } else {
              var checkFlag = true;
              var errMsg = "";
              var pNum = 0;// 主键的数量
              for (var i in this.tableData) {
                var rowData = this.tableData[i];
                if (rowData.C_COLUMN === '') {
                  errMsg = "栏位名不能为空!";
                  break;
                }
                if (rowData.C_COLUMN_TYPE === '') {
                  errMsg = "类型不能为空!";
                  break;
                }
                if (rowData.C_COMMENT === '') {
                  errMsg = "注释不能为空!";
                  break;
                }
                if (rowData.C_PRIMARY) {
                  pNum++;
                }
              }

              if (errMsg != '') {
                this.$message({
                  type: 'error',
                  message: errMsg
                });
              } else {
                if (pNum == 0) {
                  this.$message({
                    type: 'error',
                    message: '表至少需要设置一个主键!'
                  });
                } else {
                  this.addForm.fields = JSON.stringify(this.tableData);
                  saveManualTable(this.addForm).then((data) => {
                    if (data && !data.success) {
                      this.$message({
                        type: 'error',
                        message: data.title
                      });
                    } else {
                      this.$message({
                        message: '保存成功！',
                        type: 'success'
                      });
                      this.$emit('closeAndFresh');
                    }
                  }).catch((err) => {
                    this.$message({
                      type: 'error',
                      message: '保存失败!'
                    });
                  });
                }
              }
            }
          }
        });
      },
      getAllDataSource() {
        getAllDataSource({
          columnNames: ''
        }).then((data) => {
          data.splice(0, 0, {C_NAME: '_default', C_TEXT: '系统数据源（默认）', C_TYPE: 1});
          this.dataSourceOptions = data;
        });
      },
    },
    mounted() {
    },
    created() {
    }
  }
</script>

<style>

</style>
