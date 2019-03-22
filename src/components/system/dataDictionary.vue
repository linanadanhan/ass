<template>
  <div class="con_main">
    <div class="childBar">
      <div class="showChild">
        <h3>数据字典分类</h3>
      </div>
      <el-menu default-active="1" @select="selectItems" class="el-menu-vertical-demo">
        <el-menu-item v-for="item in dictionaryTypeOptionsAll" :key="item"  :index="item"> {{ item }}</el-menu-item>
      </el-menu>
    </div>
    <div class="childMain">
      <el-row :gutter="10">
        <el-col :span="10">
          <div class="handle" style="background:#f6f7fb;padding: 5px;box-sizing: border-box;">
            <el-button type="primary" size="small" @click="handleAddDictionary">新增</el-button>
            <el-button type="primary" size="small" @click="handleUpdateDictionary1">修改</el-button>
            <el-button type="primary" size="small" @click="deleteRecord1">删除</el-button>
            <el-input style="float: right;margin-top:0;width:150px" size="small" placeholder="请输入关键字" icon="search"
                      v-model="search1">
                          <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick1"></i>
            </el-input>
          </div>
          <el-table :data="tableData1" @current-change="handleCurrentChange1" highlight-current-row border
                    style="width: 100%" :height="tableHeight">
            <el-table-column type="index" width="80" align="center">
            </el-table-column>
            <el-table-column prop="key" label="字典标识">
            </el-table-column>
            <el-table-column prop="name" label="字典名称">
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="14">
          <div class="handle" style="background: #f6f7fb;padding: 5px;box-sizing: border-box;">
            <el-button type="primary " size="small " @click="addDicItem2">新增</el-button>
            <el-button type="primary " size="small " @click="handleUpdateDictionary2">修改</el-button>
            <el-button type="primary " size="small " @click="deleteRecord2">删除</el-button>
            <el-input style="float: right;width:150px" size="small" placeholder="请输入关键字" v-model="search2">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick2"></i>
            </el-input>
          </div>
          <el-table :data="tableData2" @current-change="handleCurrentChange2" highlight-current-row border
                    style="width: 100%" :height="tableHeight">
            <el-table-column type="index" width="50">
            </el-table-column>
            <el-table-column prop="value" label="字典对照码">
            </el-table-column>
            <el-table-column prop="text" label="字典对照值">
            </el-table-column>
            <el-table-column prop="sortNo" label="排序号 " width="80">
            </el-table-column>
            <el-table-column prop="status" :formatter="formatStatus" label="当前状态 " width="100 ">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
    <el-dialog v-loading.fullscreen.lock="addLoading1" :title="title1" :visible.sync="addDataDialog1" :close-on-click-modal="false">
      <el-form :model="addForm1" ref="addForm1" :rules="rules1" label-width="120px">
        <el-form-item label="所属分类" prop="type">
          <el-select v-model="addForm1.type" filterable allow-create placeholder="请选择">
            <el-option v-for="item in dictionaryTypeOptions" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="addForm1.name"></el-input>
        </el-form-item>
        <el-form-item label="字典标识" prop="key">
          <el-input v-model="addForm1.key"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addForm1.remark" type="textarea" :rows="2"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDataDialog1 = false">取 消</el-button>
        <el-button type="primary" @click="addDataDictionary">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog v-loading.fullscreen.lock="addLoading2" :title="title2" :visible.sync="addDataDialog2" :close-on-click-modal="false">
      <el-form :model="addForm2" ref="addForm2" :rules="rules2" label-width="120px">
        <el-form-item label="字典标识" prop="dicKey">
          <el-input v-model="addForm2.dicKey"></el-input>
        </el-form-item>
        <el-form-item label="字典对照码" prop="value">
          <el-input v-model="addForm2.value"></el-input>
        </el-form-item>
        <el-form-item label="字典对照值">
          <el-input v-model="addForm2.text"></el-input>
        </el-form-item>
        <el-form-item label="当前状态">
          <el-select v-model="addForm2.status" placeholder="请选择">
            <el-option label="禁用" value="0"></el-option>
            <el-option label="启用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序号">
          <template>
            <el-input-number v-model="addForm2.sortNo" :min="1"></el-input-number>
          </template>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addForm2.remark" type="textarea" :rows="2"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDataDialog2 = false">取 消</el-button>
        <el-button type="primary" @click="addDataDictionaryItem">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getDictionaryTypes,
    getDictionaryListByType,
    saveDictionary,
    destroyDictionary,
    getDictionaryListByName,
    getDicItemListByDicKey,
    saveDictionaryItem,
    destoryDictionaryItem,
    getDicItemByValue,
    validateDictionaryKey,
    validaDictionaryItemValue
  } from '../../api/api';

  export default {
    data() {
      var validateKeyUnique = (rule, value, callback) => {
        if (value) {
          let para = {
            id: this.addForm1.id,
            key: value
          }
          validateDictionaryKey(para).then((data) => {
            if (!data) {
              callback(new Error('字典标识必须唯一，该标识已存在'));
            } else {
              callback();
            }
          });
        } else {
          callback();
        }
      };
      var validateItemKeyUnique = (rule, value, callback) => {
        if (value) {
          let para = {
            id: this.addForm2.id,
            dicKey: this.addForm2.dicKey,
            value: value
          }
          validaDictionaryItemValue(para).then((data) => {
            if (!data) {
              callback(new Error('字典项标识必须唯一，该标识已存在'));
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
        title1: '',
        title2: '',
        search1: '',
        search2: '',
        currentRow1: '',
        currentRow2: '',
        tableData1: [],
        tableData2: [],
        addDataDialog1: false,
        editDataDialog1: false,
        addDataDialog2: false,
        editDataDialog2: false,
        showChild: false,
        dictionaryTypeOptions: [],
        dictionaryTypeOptionsAll: [],
        addForm1: {
          id: '',
          name: '',
          key: '',
          type: '',
          remark: ''

        },
        addForm2: {
          id: '',
          dicId: '',
          dicKey: '',
          value: '',
          status: '',
          text: '',
          sortNo: '',
          remark: ''
        },
        rules1: {
          name: [
            {required: true, message: '必填 ', trigger: 'hover'}
          ],
          key: [
            {required: true, message: '必填 ', trigger: 'hover'},
            {validator: validateKeyUnique, trigger: 'change'}
          ],
          type: [
            {required: true, message: '必填 ', trigger: 'hover'}
          ]
        },
        rules2: {
          dicKey: [
            {required: true, message: '必填 ', trigger: 'hover'}
          ],
          value: [
            {required: true, message: '必填 ', trigger: 'hover'},
            {validator: validateItemKeyUnique, trigger: 'change'}
          ]
        },
        addLoading1: false,
        addLoading2: false,
      };
    },
    methods: {
      formatStatus(row, column) {
        if(row.status) {
          return "启用";
        } else {
          return "停用";
        }
      },
      initAddForm1() {
        this.addForm1 = {
          id: '',
          name: '',
          key: '',
          type: '',
          remark: ''
        }
      },
      initAddForm2() {
        this.addForm2 = {
          id: '',
          dicId: '',
          dicKey: '',
          value: '',
          status: '',
          text: '',
          sortNo: '',
          remark: ''
        }
      },
      addDataDictionary() {
        this.$refs.addForm1.validate((valid) => {
          if (valid) {
            this.addDataDialog1 = false;
            this.addLoading1 = true;
            saveDictionary(this.addForm1).then((data) => {
              this.$message({
                type: 'success',
                message: '保存成功!'
              });
              this.init();
              this.addLoading1 = false;
            }).catch(() => {
              this.$message({
                type: 'error',
                message: '保存失败!'
              });
              this.addLoading1 = false;
            });
          } else {
            this.$message('请确认表单是否填写完整！');
          }
        });
      },
      addDicItem2() {
        if (this.currentRow1 == '' || this.currentRow1 == null) {
          this.$message({
            type: 'info',
            message: '请选择'
          });
        } else {
          this.initAddForm2();
          this.title2 = '新增';
          this.addForm2.dicId = this.currentRow1.id;
          this.addForm2.dicKey = this.currentRow1.key;
          this.addForm2.status = "1";
          this.addDataDialog2 = true;
        }
      },
      addDataDictionaryItem() {
        this.addDataDialog2 = false;
        this.addLoading2 = true;
        saveDictionaryItem(this.addForm2).then((data) => {
          this.$message({
            type: 'success',
            message: '保存成功!'
          });
          this.addLoading2 = false;
          this.handleCurrentChange1(this.currentRow1)
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '保存失败!'
          });
          this.addLoading2 = false;
        });
        this.initAddForm2();
      },
      handleCurrentChange1(val) {
        this.currentRow1 = val;
        if (val != null) {
          let para = {
            dicKey: val.key
          }
          getDicItemListByDicKey(para).then((data) => {
            this.tableData2 = data;
          });
        }
      },
      handleCurrentChange2(val) {
        this.currentRow2 = val;
      },
      handleAddDictionary() {
        this.initAddForm1();
        this.title1 = '新增';
        this.addDataDialog1 = true;
      },
      handleUpdateDictionary1() {
        if (this.currentRow1 == '' || this.currentRow1 == null) {
          this.$message({
            type: 'info',
            message: '请选择'
          });
        } else {
          this.initAddForm1();
          this.title1 = '修改';
          this.addForm1 = this.currentRow1;
          this.addDataDialog1 = true;
        }
      },
      handleUpdateDictionary2() {
        if (this.currentRow2 == '' || this.currentRow2 == null) {
          this.$message({
            type: 'info',
            message: '请选择'
          });
        } else {
          this.initAddForm2();
          this.title2 = '修改';
          this.addForm2 = this.currentRow2;
          this.addForm2.status = this.currentRow2.status.toString();
          this.addDataDialog2 = true;
        }
      },
      handleIconClick1() {
        let para = {
          name: this.search1
        }
        getDictionaryListByName(para).then((data) => {
          this.tableData1 = data;
        });
      },
      handleIconClick2() {
        let para = {
          value: this.search2
        };
        getDicItemByValue(para).then((data) => {
          this.tableData2 = data;
        });
      },
      deleteRecord1() {
        if (this.currentRow1 == '' || this.currentRow1 == null) {
          this.$message({
            type: 'info',
            message: '请选择'
          });
        } else {
          this.$confirm('此操作将永久删除该字典及其下所有的数据项, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            destroyDictionary(this.currentRow1.id).then((data) => {
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
        }
      },
      deleteRecord2() {
        if (this.currentRow2 == '') {
          this.$message({
            type: 'info',
            message: '请选择'
          });
        } else {
          this.$confirm('此操作将永久删除该字典数据项, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            destoryDictionaryItem(this.currentRow2.id).then((data) => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.handleCurrentChange1(this.currentRow1);
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }
      },
      init() {
        getDictionaryTypes().then((data) => {
          if (data && data.length > 0) {
            if (data.length>1) data.unshift('全部');
            this.dictionaryTypeOptionsAll = data;
            this.selectItems(data[0]);
          }else {
            this.dictionaryTypeOptionsAll = data;
            this.tableData1 = [];
          }
        });
        this.getDictionaryTypeOptions();
      },
      getDictionaryTypeOptions(){
        getDictionaryTypes().then((data) => {
            this.dictionaryTypeOptions = data;
        });
      },
      selectItems(type) {
        if (type == '全部') {
          type = '';
        }
        let para = {
          type: type,
        };
        getDictionaryListByType(para).then((data) => {
          this.tableData1 = data;
        });
      },
    },
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
