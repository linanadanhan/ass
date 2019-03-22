<template>
  <div class="con_main" v-loading.fullscreen.lock="fullscreenLoading">
  	 	  <el-button @click="openAddDlg1">打开新窗口</el-button>
	      <el-form :model="addForm"  :rules="rules" ref="addForm" label-width="120px">
	        <el-form-item label="课程" prop="C_COURSE">
	          <el-select v-model="courses" multiple placeholder="请选择" @change="(data)=>courseChangeHandler(data,'C_COURSE')">
					    	<el-option v-for="item in options" :key="item.value" :label="item.text" :value="item.value"></el-option>
					  </el-select>
	        </el-form-item>
	        <!--<div>
	        	<div style="height:400px;">撑页面</div>
	        </div>-->
	        <el-form-item label="预约日期" prop="C_DATE">
	           <el-date-picker v-model="addForm.C_DATE" type="date" placeholder="选择日期" ></el-date-picker>
	        </el-form-item>
	        <el-form-item label="开课时间" prop="C_START_TIME">
	           <el-date-picker v-model="addForm.C_START_TIME" type="datetime" placeholder="选择日期时间" ></el-date-picker>
	        </el-form-item>
	        <el-form-item label="姓名" prop="C_NAME">
	          <el-input v-model="addForm.C_NAME"></el-input>
	        </el-form-item>
	      </el-form>
        <detailCard  ref="detail" :dId="dataId"></detailCard>
  </div>
</template>

<script>
	import detailCard from '@/components/demo/detail.vue';
	import {saveOrUpdate,getData,getDicItemsByKey} from '../../api/demo'
	
  export default {
    data() {
      return {
      	  fullscreenLoading:false,
      		addForm:{},
      		dataId:1,
      		courses:[],
      		options:[],
      		operType:1,//1：保存； 2：提交
      		rules:{
				      			 C_NAME: [
						            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
						          ],
						         C_COURSE: [
						            { required: true, message: '请选择课程', trigger: 'change' }
						          ]
				      	}
      };
    },
    components:{
    	 detailCard
    },
    methods: {
    	  initForm(data){
    	  	 this.courses = [];
    	  	 this.$refs['addForm'].resetFields();
    	  	 if(data != null){
    	  	 	   this.addForm = data;
    	  	 	   this.courses = this.addForm.C_COURSE && this.addForm.C_COURSE!=''?this.addForm.C_COURSE.split(','):[];
    	  	 	   //TODO:其他需要转换的字段
    	  	 }else{
    	  	 	
    	  	 	 this.$refs['addForm'].resetFields();
    	  	 	 this.addForm = {
    	  	 	 	  C_ID:null,
    	  	 	 	  C_NAME:'',
    	  	 	 	  C_COURSE:'',
    	  	 	 	  C_DATE:null,
    	  	 	 	  C_START_TIME:null
    	  	 	 }
    	  	 	 
    	  	 }
    	  },
    		saveOrUpdate(type){
    			  this.operType = type;
    			  
	    			this.$refs.addForm.validate((valid) => {
	    				  if(valid){
	    				  	  this.fullscreenLoading = true;
	    				  	  saveOrUpdate(this.addForm).then((data)=>{
	    				  	  		this.fullscreenLoading = false;
	    				  	  	  console.log(data);
	    				  	  	  this.$emit('closeAndFresh'); 
	    				  	  });
	    				  }else{
	    				  	 return false;
	    				  }
	    			});
				},
				loadData(id){
					 if(id != ''){
					 	  var param = {
					 	  		columnNames:'',
					 	 		 	C_ID:id
					 	  };
					 		getData(param).then((data)=>{
					 				this.initForm(data);
					 		});
					 }else{
					 	  this.initForm(null);
					 }
					 this.$nextTick(() => {
					 		 this.$refs.detail.loadData(id);
					 });
				},
				openAddDlg1(){
					  this.$emit('openNewDlg'); 
				},
				courseChangeHandler(data,key){
					  if(data && data.length>0){
					  	this.addForm[key] = data.join(',');
					  }else{
					  	this.addForm[key] = '';
					  }
				}
    },
    computed:{
    	  loadRules(){
    	  	  console.log('operType',this.operType);
    	  	  if(this.operType == 1){
    	  	  	 return {
    	  	  	 	  	 C_NAME: [
						            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
						          ],
						         C_COURSE: [
						            { required: true, message: '请选择课程', trigger: 'change' }
						          ]
    	  	  	 };
    	  	  }
    	  	  if(this.operType == 2){
    	  	  	  return {
    	  	  	 	  	 C_NAME: [
    	  	  	 	  	    { required: true, message: '请输入姓名', trigger: 'blur' },
						            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
						          ],
						         C_COURSE: [
						            { required: true, message: '请选择课程', trigger: 'change' }
						          ]
    	  	  	 };
    	  	  }
    	  	  return {};
    	  }
    },
    mounted() {
    },
	  created(){
	  	let param = {
    		dicKey : 'course_catalog'
    	};
	  	getDicItemsByKey(param).then((data)=>{
    		  this.options = data;
    	});
		}
}
</script>

<style scoped>
  .con_main {
    height: 100%;
    position: relative;
  }
  
  .con_main .childBar {
    width:20%;
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
  
  .el-menu-item {
    height: 40px;
    line-height: 40px;
  }
  
  .con_main .childMain {
    padding: 10px;
    box-sizing: border-box;
    float: left;
    width: 80%;
    height:100%;
    position: relative;
  }
  
  .childMain .handle {
    margin-bottom: 10px;
  }

</style>