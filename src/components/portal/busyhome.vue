<template>
	<div class="container">
		<div class="header">
			<a class="logo" href="">
				<img src="../../../static/img/logo.png" width="40" />
				<span>门户管理平台</span>
			</a>
			
			<el-dialog title="修改密码" :visible.sync="changePsdDialog" size="small" :close-on-click-modal="false">
				<el-form :model="passwordInfo" ref="passwordInfo" :rules="rules" label-width="90px">
					<el-form-item label="登录名">
						<el-input v-model="userName" :readonly="true"></el-input>
					</el-form-item>
					<el-form-item label="旧密码" prop="oldPassword">
						<el-input placeholder="请输入旧密码" type="password" v-model="passwordInfo.oldPassword"></el-input>
					</el-form-item>
					<el-form-item label="新密码" prop="newPassword">
						<el-input placeholder="请输入新密码" type="password" v-model="passwordInfo.newPassword"></el-input>
					</el-form-item>
					<el-form-item label="确认密码" prop="secondPassword">
						<el-input placeholder="请确认新密码" type="password" v-model="passwordInfo.secondPassword"></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
				    <el-button type="primary" @click="modifyPassword">保存</el-button>
				    <el-button @click="cancelModifyPsd">取消</el-button>
			 	</span>
			</el-dialog>
			<el-dialog title="绑定手机" :visible.sync="bindPhoneDialog" size="small" :close-on-click-modal="false">
				<el-form :model="bindPhoneForm" ref="bindPhoneForm" :rules="bindPhoneFormRules" label-width="90px">
					<el-form-item label="手机号" prop="tel">
						<el-row :gutter="20">
							<el-col :span="14">
								<el-input type="text" v-model="bindPhoneForm.tel" placeholder="请输入手机号"></el-input>
							</el-col>
						</el-row>
					</el-form-item>
					<el-form-item label="验证码" prop="identifyingCode">
						<el-row :gutter="20">
							<el-col :span="14">
								<el-input type="text" v-model="bindPhoneForm.identifyingCode" placeholder="请输入手机验证码"></el-input>
							</el-col>
							<el-col :span="8">
								<el-button class="validateBtn" :disabled="sendMsgDisabled" type="primary" @click="getIdentify">{{btnText}}</el-button>
							</el-col>
						</el-row>
					</el-form-item>
					<el-form-item>
						<span v-show="codeTip">验证码已发送，5分钟内有效，如未收到{{time}}s后请重试！</span>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
				    <el-button type="primary" @click="bindPhone">保存</el-button>
				    <el-button @click="cancelBindPhone">取消</el-button>
			 	</span>
			</el-dialog>
			<div class="userinfo">
				<el-dropdown trigger="click" @command="handleCommand" class="header-user-dropdown">
					<span class="el-dropdown-link"><i class="iconfont icon-ren"></i> {{userName}}  <i
            			class="el-icon-caret-bottom el-icon-right"></i></span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item command="changePsd">修改密码</el-dropdown-item>
						<el-dropdown-item command="bindPhone">绑定手机</el-dropdown-item>
						<el-dropdown-item command="exit"><i class="iconfont icon-tuichu1"></i>退出</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
				<span @click="manageSite" v-show="manage"> 管理维护</span>
			</div>
		</div>

		<div class="content">
			<div class="wrapper">
				<router-view></router-view>
				<div class="wrapper-push"></div>
			</div>
			<div class="footer" style="background: rgba(205, 205, 205, .5);">
				Copyright &copy; 2017中科天翔
			</div>
		</div>
	</div>
</template>

<script>
	//TODO:
	import { logout, modifyPassword, sendCode, bindPhone } from '../../api/api';
	import ElCol from "element-ui/packages/col/src/col";

	export default {
		components: {
			ElCol
		},
		data() {
			return {
				manage: true,
				activeIndex: 'qualification',
				userName: '',
				changePsdDialog: false,
				bindPhoneDialog: false,
				passwordInfo: {
					id: '',
					oldPassword: '',
					newPassword: '',
					secondPassword: ''
				},
				seen: {
					does: true,
					audit: false,
					pay: false
				},
				rules: {
					oldPassword: [{
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
					newPassword: [{
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
					secondPassword: [{
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
				},
				bindPhoneForm: {
					tel: '',
					identifyingCode: '',
				},
				bindPhoneFormRules: {
					tel: [{
						required: true,
						pattern: /^1[34578]\d{9}$/,
						message: '请输入正确手机号',
						trigger: 'blur'
					}],
				},
				btnText: '获取验证码',
				time: 60, // 发送验证码倒计时
				sendMsgDisabled: false,
				codeTip: false
			};
		},
		methods: {
			handleSelect(key, keyPath) {},
			handleCommand(command) {
				if(command == 'exit') {
					logout().then((data) => {
						sessionStorage.clear();
						this.$router.push({
							path: '/'
						});
						sessionStorage.clear();
					}).catch(() => {
						this.$message({
							type: 'error',
							message: '退出失败'
						});
					});
				} else if(command == 'changePsd') {
					this.changePsdDialog = true;
				} else if(command == 'bindPhone') {
					this.bindPhoneDialog = true;
					this.bindPhoneForm = {
						tel: '',
						identifyingCode: ''
					}
				}
			},
			manageSite() {
				this.$router.push({
					path: '/manageHome'
				});
			},
			modifyPassword() {
				this.$refs.passwordInfo.validate((valid) => {
					if(valid) {
						this.passwordInfo.id = sessionStorage.getItem('uId');
						modifyPassword(this.passwordInfo).then((data) => {
							if(data.success) {
								this.$message({
									type: 'success',
									message: data.title
								});
								this.cancelModifyPsd();
							} else {
								this.$message({
									type: 'error',
									message: data.title
								});
							}
						}).catch(() => {
							this.$message({
								type: 'error',
								message: '错误！'
							});
						});
					}
				});
			},
			cancelModifyPsd() {
				this.changePsdDialog = false;
				this.$refs.passwordInfo.resetFields();
			},
			getIdentify: function() {
				this.$refs.bindPhoneForm.validate((valid) => {
					if(valid) {
						let para = {
							mobile: this.bindPhoneForm.tel
						};
						sendCode(para).then((data) => {
							if(data.success) {
								this.$message({
									type: 'success',
									message: '短信验证码发送成功，请查收'
								});
								this.codeTip = true;
								let me = this;
								me.sendMsgDisabled = true;
								me.btnText = '重新获取';
								let interval = window.setInterval(function() {
									if((me.time--) <= 0) {
										me.time = 60;
										me.sendMsgDisabled = false;
										me.codeTip = false;
										me.ruleForm.identifyingCode = '';
										window.clearInterval(interval);
									}
								}, 1000);

							} else {
								//短信发送失败
								this.$message({
									type: 'error',
									message: data.title
								});
							}
						}).catch(() => {

						});
					}
				});
			},
			bindPhone() {
				let para = {
					id: sessionStorage.getItem('uId'),
					mobile: this.bindPhoneForm.tel,
					msgValiCode: this.bindPhoneForm.identifyingCode,
				};
				this.$refs.bindPhoneForm.validate((valid) => {
					bindPhone(para).then((data) => {
						if(data.success) {
							this.$message({
								type: 'success',
								message: data.title
							});
							this.cancelBindPhone();
						} else {
							this.$message({
								type: 'error',
								message: data.title
							});
						}
					}).catch(() => {
						this.$message({
							type: 'error',
							message: '错误！'
						});
					});
				});
			},
			cancelBindPhone() {
				this.bindPhoneDialog = false;
				this.bindPhoneForm = {
					tel: '',
					identifyingCode: ''
				}
			}
		},
		mounted() {
			var permissions = sessionStorage.getItem('securityUrl');
			if(permissions != '{}') {
				this.manage = true;
			}
		},
		created() {
			this.userName = sessionStorage.getItem('uName');
			
			//TODO 业务权限判断跳转页面
			
			this.$router.push({
				path: '/mhgl/does'
			});
		}
	}
</script>

<style scoped>
	html,
	body,
	.container {
		width: 100%;
		min-height: 100%;
		background-color: #e8ecf0;
		min-width: 1200px;
	}
	
	.header {
		position: relative;
		width: 100%;
		height: 50px;
		background: #0070c1;
		line-height: 50px;
		padding: 0 20px;
		box-sizing: border-box;
	}
	
	.header .logo {
		float: left;
		margin-right: 100px;
		height: 50px;
	}
	
	.logo img {
		float: left;
		margin-top: 10px;
		margin-right: 10px;
	}
	
	.logo span {
		float: left;
		color: #fff;
		font-size: 20px;
		font-weight: bold;
	}
	
	.menu li {
		float: left;
		height: 50px;
		line-height: 50px;
		list-style: none;
		padding: 0 20px;
		cursor: pointer;
		font-size: 15px;
		color: #fff;
		opacity: 0.8;
	}
	
	.menu li:hover {
		opacity: 1;
	}
	
	.menu li.router-link-active {
		border-bottom: 4px solid #1191f9;
		box-sizing: border-box;
		opacity: 1;
		font-weight: bold;
		color: #fff;
	}
	
	.header .userinfo {
		position: absolute;
		right: 15px;
		top: 0;
		color: #fff;
		font-size: 14px;
		cursor: pointer;
	}
	
	.el-dropdown {
		color: #fff !important;
		margin-right: 20px;
	}
</style>


<style>
	.wrapper {
		min-height: 100%;
		height: auto !important;
		height: 100%;
		margin: 0 auto -3em;
	}
	
	.wrapper-push {
		height: 3em;
	}
	
	.footer {
		height: 3em;
		width: 100%;
		height: 40px;
		line-height: 40px;
		color: #777;
		text-align: center;
		background: #fff;
	}
	
	.el-card {
    border: none;
    border-radius: 0;
    background-color: #fff;
    overflow: hidden;
    box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, .05);
  }

  .el-card__header {
    padding: 5px 10px;
    border-bottom: 1px solid #f2f2f2;
    box-sizing: border-box;
    line-height: 24px;
    color: #2a82dd;
    font-size: 14px;
  }

  .box-card-project .el-card__body {
    min-height: 171px;
  }

  .el-card__body {
    padding: 10px 15px 5px 15px;
  }

  .el-tooltip__popper .popper__arrow {
    left: 40px !important;
  }

  .el-table--fit {
    border-right: 1px solid #dfe6ec !important;
  }
  
   .content-index {
    padding: 10px;
    box-sizing: border-box;
    overflow: hidden;
    background-color: #e8ecf0;
  }

  .content-index .home-right {
    overflow-y: auto;
  }

  .content-index .home-right::-webkit-scrollbar {
    width: 6px;
  }

  .content-index .home-right::-webkit-scrollbar-thumb {
    background-color: rgba(51, 51, 51, .3);
    border-radius: 20px;
  }

  .content-index .home-left-content > div:last-child,
  .content-index .home-left-content > div:last-child .box-card {
    margin-bottom: 0;
  }

  .content-index .home-left .el-card {
    margin-bottom: 10px;
  }

  .content-index .projectCard {
    width: 100%;
    max-height: 161px;
    background: #f5f5f6;
    padding: 10px;
    box-sizing: border-box;
    margin-bottom: 10px;
    overflow: hidden;
  }

  .content-index .imgProject {
    width: 100%;
    height: 100px;
    overflow: hidden;
  }

  .content-index .imgProject img {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  .content-index .waitText {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #333;
    line-height: 35px;
  }
  .content-index .waitText span{ display: inline-block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 12px; }
  .content-index .projectTitle {
    color: #2a82dd;
    font-weight: bold;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }

  .content-index .projectList {
  	max-height: 80px;
  	overflow: hidden;
    color: #666;
    font-size: 12px;
    line-height: 26px;
    margin-top: 10px;
  }
   .content-index .projectList li {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }


  .content-index .apply {
    text-align: right;
    font-size: 12px;
    color: #333;
    line-height: 35px;
    cursor: pointer;
  }

  .content-index .apply:hover {
    color: #2a82dd;
  }

  .content-index .apply i {
    font-size: 14px;
    color: #2a82dd;
    margin-right: 5px;
  }

  .content-index .handle {
    text-align: center;
    cursor: pointer;
    color: #333;
    padding: 10px 0;
  }

  .content-index .handle i {
    display: block;
    color: #12a0eb;
    font-size: 44px;
  }

  .content-index .handle h4 {
    font-size: 14px;
    line-height: 28px;
    font-weight: normal;
  }

  .content-index .handle:hover, .content-index .info:hover {
    color: #2a82dd;
  }

  .content-index .info {
    cursor: pointer;
    background: #f6f7fb;
    margin: 5px 0 10px 0;
    height: 80px;
  }

  .content-index .info i {
    float: left;
    background: #eceff9;
    width: 80px;
    color: #12a0eb;
    font-size: 40px;
    text-align: center;
    line-height: 80px;
  }

  .content-index .info h4 {
    float: left;
    font-size: 14px;
    line-height: 80px;
    font-weight: normal;
    margin-left: 30px;
  }

  .content-index .card-backlog-item {
    color: #333;
    font-size: 12px;
    border-bottom: 1px dashed #ddd;
    margin-bottom: 10px;
    padding: 0 10px;
    box-sizing: border-box;
  }

  .content-index .card-backlog-item p {
    margin-bottom: 10px;
  }

  .content-index .backlog-item-mark {
    display: flex;
    justify-content: space-between;
  }

  .content-index .backlog-item-mark .card-btn-back {
    color: red;
  }
  .content-index .spot{position: absolute;top: -5px;right:-8px;display: inline-block;background: red;color: #fff;font-size: 10px;line-height:16px;border-radius:100px;padding:2px;height: 16px;min-width: 16px;}
  
  .iconfont{ margin-right: 5px; vertical-align: middle;}
  .el-dialog__body{ padding: 20px; }
  .el-dialog__title{
		font-size:18px;text-align: left;padding-right:60px;color: #000;
	}

  /*.searchForm {
    padding:5px 15px 0 15px;
    background: #f6f6f6;
    margin-bottom: 10px;
  }

  .searchForm .el-form-item{
    margin-bottom: 5px;
  }*/
</style>