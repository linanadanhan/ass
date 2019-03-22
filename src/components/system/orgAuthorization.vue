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
        <el-button type="primary" @click="saveOrgAuthorization">保存</el-button>
      </div>
      <el-table v-loading.fullscreen.lock="Loading" highlight-current-row
                @current-change="handleTableChange" ref="table"
                :data="tableData" border style="width: 100%" :height="tableHeight">
        <el-table-column type="index" width="80" align="center">
        </el-table-column>
        <el-table-column prop="loginName" label="登录名" width="180">
        </el-table-column>
        <el-table-column prop="name" label="姓名">
        </el-table-column>
        <el-table-column prop="mobilePhone" label="手机号">
        </el-table-column>
        <el-table-column prop="positionName" label="职位">
        </el-table-column>
      </el-table>
      <div class="page-box">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
                       :page-sizes="[20, 50, 100, 200]" :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <div class="rightBar">
      <el-tree :data="dataTree" default-expand-all highlight-current ref="tree" show-checkbox
               @check-change="handleCheckChange" :check-strictly=true
               :expand-on-click-node=false node-key="id" :props="defaultProps">
      </el-tree>
    </div>
  </div>
</template>

<script>
  import {
    getDicItemListByDicKey,
    getIdentityInfoListByOrgCode,
    getOrgIdsByIdentity,
    getOrgTreeByDimension,
    isExitOrgCode,
    saveDataGrant
  } from '../../api/api';

  export default {
    data() {
      var validateCodeUnique = (rule, value, callback) => {
        if (value) {
          isExitOrgCode({"code": value}).then((data) => {
            if (data) {
              callback(new Error('机构代码已存在！'));
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
        page: 1,
        pageSize: 20,
        total: 0,
        childMainWidth: '',
        showChild: false,
        currentNode: {},
        dataTree: [],
        defaultProps: {
          children: 'children',
          label: 'text'
        },
        tableData: [],
        Loading: false,
        options: [],
        value: '',
        currentRow: {},
        orgIds: '',

      };
    },
    methods: {
      changeChild() {
        this.getOrgList();
      },
      /**
       * 点击树结构机构
       */
      handleNodeClick(data) {
        this.$refs.tree.setCheckedKeys([]);
        this.currentNode = data;
        this.getOrgList(this.currentNode.attributes.code);
      },
      getOrgList(code) {
        if (typeof(code) == "undefined") {
          code = this.currentNode.attributes.code;
        }

        let para = {
          code: code,
          isCascade: this.showChild,
          id: this.currentNode.id,
          page: this.page,
          size: this.pageSize
        };
        this.Loading = true;
        getIdentityInfoListByOrgCode(para).then((data) => {
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
      handleTableChange(val) {
        this.currentRow = val;
        let para = {
          identityId: val.id,
          dimension: this.value
        };
        getOrgIdsByIdentity(para).then((data) => {
          this.$refs.tree.setCheckedKeys(data);
        });
      },
      getTree(data) {//得到机构tree
        let para = {dimension: data};
        getOrgTreeByDimension(para).then((data) => {
          this.dataTree = data;
          if (typeof(data[0]) != 'undefined') {
            this.currentNode = data[0];
            this.getOrgList(this.currentNode.attributes.code);
          }
        });
      },
      /**
       * 选择维度
       */
      changeDimensionHandler(data) {
        this.$refs.tree.setCheckedKeys([]);
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
      /**
       * 点击右边机构树
       */
      handleCheckChange() {
        var ids = '';
        var keys = this.$refs.tree.getCheckedKeys();
        for (var key of keys) {
          ids += key + ',';
        }
        this.orgIds = ids.substr(0, ids.length - 1);
      },
      /**
       * 保存授权关联
       */
      saveOrgAuthorization() {
        if (Object.keys(this.currentRow).length == 0) {
          this.$message({
            type: 'warning',
            message: '请选择要授权的人员！'
          });
        } else {
          let param = {
            identityId: this.currentRow.id,
            orgIds: this.orgIds,
            dimension: this.value
          };
          saveDataGrant(param).then((data) => {
            if (data.success) {
              this.$message({
                type: 'success',
                message: '保存成功！'
              });
            }
          });
        }

      },
    },
    mounted() {
      this.getOrgDimension();
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

  .con_main .childMain {
    padding: 10px;
    box-sizing: border-box;
    float: left;
    width: 60%;
    height: 100%;
    position: relative;
  }

  .con_main .rightBar {
    width: 20%;
    height: 100%;
    float: left;
    background: #f6f7fb;
    overflow: auto;
  }

  .childBar .el-menu {
    background: none;
  }

  .showChild {
    height: 30px;
    background: #eceff9;
    line-height: 30px;
    padding: 0 5px;
    box-sizing: border-box;
  }

  .showChild .el-checkbox {
    color: #666;
    font-size: 12px;
  }

  .childMain .handle {
    margin-bottom: 10px;
    float: right;
  }

</style>
