<template>
	<div>
		<div class="top">
			<div class="top_center">
				<div class="logo_and_title">
					<img src="../../static/img/logo1.png" alt="" width="40" />
					<h1>门户管理平台</h1>
				</div>
			</div>
		</div>
		<div class="main">
			<div class="main_center">
				<div class="login_form" v-if="showLoginForm">
					<ul class="login_head">
						<li :class="{active:isActive}"><label @click="showTab1">账号登录</label></li>
						<li class="line"></li>
						<li :class="{active:!isActive}"><label @click="showTab2">手机号登录</label></li>
					</ul>
					<div class="tip">
						<p v-show="tipError"><i class="iconfont icon-xinxi1"></i> 用户名不存在</p>
					</div>
					<div class="form accountLogin" v-if="tabShow">
						<el-form :model="loginForm" ref="loginForm" :rules="ruleLoginForm" @keyup.enter.native="handleLogin" size="medium">
							<el-form-item prop="account">
								<el-input type="text" v-model.trim="loginForm.account" placeholder="账号 / 手机号">
									<i slot="prefix" class="el-input__icon iconfont icon-zhanghao1"></i>
								</el-input>
							</el-form-item>
							<el-form-item prop="password">
								<el-input type="password" v-model.trim="loginForm.password" placeholder="密码">
									<i slot="prefix" class="el-input__icon iconfont icon-mima"></i>
								</el-input>
							</el-form-item>
						</el-form>
						<div class="rememberPassword">
							<el-checkbox v-model="checked" style="color: #666;">记住密码</el-checkbox>
							<a href="/forgetPassword">忘记密码？</a>
						</div>
						<div class="btnDiv">
							<el-button type="primary" @click="handleLogin" :loading="loginLoading">登 录</el-button>
						</div>
					</div>
					<div class="form telLogin" v-else>
						<el-form :model="ruleForm" :rules="rules" ref="ruleForm" @keyup.enter.native="phoneLogin" size="medium">
							<el-form-item prop="tel">
								<el-input type="text" v-model.trim="ruleForm.tel" placeholder="手机号">
									<i slot="prefix" class="el-input__icon el-icon-mobile-phone"></i>
								</el-input>
							</el-form-item>
							<el-form-item prop="validateCode">
								<el-row :gutter="5">
									<el-col :span="16">
										<el-input type="text" v-model.trim="ruleForm.identifyingCode" placeholder="手机验证码">
											<i slot="prefix" class="el-input__icon el-icon-mobile-phone"></i>
										</el-input>
									</el-col>
									<el-col :span="8">
										<el-button class="validateBtn" :disabled="sendMsgDisabled" type="primary" @click="getIdentify">
											{{btnText}}
										</el-button>
									</el-col>
								</el-row>
							</el-form-item>
						</el-form>
						<div class="validate"><span v-show="codeTip">验证码已发送，5分钟内有效，如未收到{{time}}s后请重试！</span></div>
						<div class="btnDiv">
							<el-button type="primary" @click="phoneLogin" :loading="loginLoading">登 录</el-button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="foot">
			<p>Copyright © 2017中科天翔</p>
		</div>
	</div>
</template>

<script>
	import { login, getAdminSecurity, sendCode } from '../api/api';

	export default {
		data() {
			return {
				showLoginForm: true,
				loginLoading: false,
				loginForm: {
					account: '',
					password: '',
				},
				ruleLoginForm: {
					account: {
						required: true,
						message: '请输入登录账号',
						trigger: 'blur'
					},
					password: {
						required: true,
						message: '请输入登录密码',
						trigger: 'blur'
					}
				},
				checked: false,
				tabShow: true,
				isActive: true,
				codeTip: false,
				tipError: false,
				btnText: '获取验证码',
				time: 60, // 发送验证码倒计时
				sendMsgDisabled: false,
				ruleForm: {
					tel: '',
					identifyingCode: '',
				},
				rules: {
					tel: [{
						required: true,
						pattern: /^1[34578]\d{9}$/,
						message: '请输入正确手机号',
						trigger: 'blur'
					}],
					identifyingCode: [{
						required: true,
						message: '不能为空',
						trigger: 'blur'
					}],
				}
			};
		},
		methods: {
			showTab1: function() {
				this.tabShow = true;
				this.isActive = true;
			},
			showTab2: function() {
				this.tabShow = false;
				this.isActive = false;
			},
			getIdentify: function() {
				this.$refs.ruleForm.validate((valid) => {
					if(valid) {
						let para = {
							mobile: this.ruleForm.tel
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
			phoneLogin: function() {
				this.loginLoading = true;
				let para = {
					username: this.ruleForm.tel,
					password: this.ruleForm.identifyingCode,
					type: 'phone',
				};
				this.$refs.ruleForm.validate((valid) => {
					this.loginMethod(valid, para);
				});
			},
			handleLogin() {
				this.loginLoading = true;
				let para = {
					username: this.loginForm.account,
					password: this.loginForm.password,
				};
				this.$refs.loginForm.validate((valid) => {
					this.loginMethod(valid, para);
				});
			},
			loginMethod(valid, para) {
				if(valid) {
					login(para).then((data) => {
						if(data.status == 200) {
              this.loginLoading = false;
              sessionStorage.setItem('uName', data.data.userinfo.username);
              sessionStorage.setItem('uId', data.data.userinfo.id);
							this.$message({
								type: 'success',
								message: '登录成功！'
							});
							//记住密码
							if(this.checked) {
								localStorage.setItem("cosUsername", this.loginForm.account);
								localStorage.setItem("cosPassword", this.compileStr(this.loginForm.password));
							} else {
								localStorage.removeItem("cosPassword");
							}

							//前端权限
							getAdminSecurity().then((data) => {
								sessionStorage.setItem('securityUrl', JSON.stringify(data));
								console.log('securityUrl:', JSON.stringify(data));
								this.$router.push({
									path: '/manageHome'
								});
							});
						} else {
							this.loginLoading = false;
							this.$message({
								type: 'error',
								message: data.data
							});
						}
					}).catch(() => {
						this.loginLoading = false;
					});
				} else {
					this.loginLoading = false;
					console.log('error submit!!');
					return false;
				}
			},
			compileStr(code) { //对字符串进行加密
				var c = String.fromCharCode(code.charCodeAt(0) + code.length);
				for(var i = 1; i < code.length; i++) {
					c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
				}
				return escape(c);
			},
			uncompileStr(code) {
				code = unescape(code);
				var c = String.fromCharCode(code.charCodeAt(0) - code.length);
				for(var i = 1; i < code.length; i++) {
					c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
				}
				return c;
			},
			onmessage(evnet){
			  console.info('onmessage params:', event.data)
			}
		},
		mounted() {
		  // 接收postMessage参数
      if (typeof window.addEventListener != 'undefined') {
          window.addEventListener('message', this.onmessage, false);
      } else if (typeof window.attachEvent != 'undefined') {
          window.attachEvent('onmessage', this.onmessage);
      }
		},
		created: function() {
      var qs = window.location.search.substring(1);
      console.info(qs)
			if(qs.length > 0) { // 前端mosaic 登录跳转过来
        this.showLoginForm = false;
        qs = decodeURI(qs)
        var userName = qs.split("=")[1];
        sessionStorage.setItem('uName', userName);

				//前端权限
				getAdminSecurity().then((data) => {
					sessionStorage.setItem('securityUrl', JSON.stringify(data));
					console.log('securityUrl:', JSON.stringify(data));
					this.$router.push({
						path: '/manageHome'
					});
				});
			} else {
				this.showLoginForm = true;
				var cosUsername = localStorage.getItem("cosUsername");
				var cosPassword = localStorage.getItem("cosPassword");
				if(cosUsername && cosPassword) {
					this.loginForm.account = cosUsername;
					this.loginForm.password = this.uncompileStr(cosPassword);
					this.checked = true;
				} else if(cosUsername && !cosPassword) {
					this.loginForm.account = cosUsername;
				}
			}
		}
	}
</script>

<style scoped>
	body,
	p,
	h1,
	h2,
	h3,
	h4,
	h5,
	h6,
	li,
	ul,
	dl,
	dt,
	dd,
	a,
	span,
	img,
	input,
	table,
	tr,
	td,
	label,
	{
		padding: 0;
		margin: 0;
		list-style: none;
	}
	
	body {
		width: 100%;
		font-family: "微软雅黑";
		font-size: 12px;
		color: #666;
		background: #f6f6f6;
	}
	
	.top {
		position: relative;
		height: 70px;
		line-height: 70px;
		box-shadow: 0 2px 9px 0 rgba(0, 0, 0, 0.25);
		z-index: 100;
		background: #fff;
	}
	
	.top_center {
		width: 1100px;
		margin: 0 auto;
	}
	
	.top_center img {
		float: left;
		margin-top: 22px;
		margin-right: 10px;
	}
	
	.top_center h1 {
		color: #2a82dd;
		float: left;
		font-size: 26px;
	}
	
	.main {
		width: 100%;
		height: 480px;
		background-color: #0667dc;
	}
	
	.main_center {
		width: 1100px;
		height: 480px;
		margin: 0 auto;
		background: url(../../static/img/bg1.jpg) center center no-repeat;
	}
	
	.login_form {
		width: 400px;
		height: 380px;
		padding: 20px 40px;
		box-sizing: border-box;
		background: #fff;
		float: right;
		margin-top: 50px;
		border-radius: 5px;
		margin-right: 40px;
	}
	
	.login_head {
		height: 40px;
		border-bottom: 1px solid #eeeeee;
	}
	
	.login_head li {
		float: left;
		width: 159px;
		text-align: center;
		line-height: 30px;
		color: #333;
		font-size: 16px;
	}
	
	.login_head li:nth-of-type(2) {
		width: 1px;
		height: 30px;
		background: #eee;
	}
	
	.login_head li label {
		height: 40px;
		display: inline-block;
		padding: 0 3px;
		box-sizing: border-box;
		cursor: pointer;
	}
	
	.login_head .active label {
		border-bottom: 3px solid #0190fe;
		color: #0190fe;
	}
	
	.login_head label:hover {
		color: #0190fe;
	}
	
	.login_form .tip {
		width: 320px;
		height: 20px;
		margin: 10px auto;
		display: block;
	}
	
	.login_form .tip i {
		color: #f42929;
		font-weight: bold;
	}
	
	.login_form .form {
		height: 240px;
		overflow: hidden;
	}
	
	.login_form .form div:first-child {
		margin-top: 0px;
	}
	
	.login_form .telLogin .validateCode {
		margin-bottom: 0;
	}
	
	.login_form .form .validate {
		margin: -10px auto 20px;
		height: 24px;
		line-height: 24px;
		border: none;
		color: #999;
	}
	
	.login_form .form .iconfont {
		/*float: left;
    width: 40px;
    height: 40px;
    line-height: 40px;*/
		font-size: 18px;
		color: #ccc;
		text-align: center;
	}
	
	.login_form input {
		float: left;
		height: 40px;
		width: 270px;
		line-height: 40px;
		border: none;
		outline: medium;
		font-size: 14px;
		color: #666;
	}
	
	.login_form .telLogin .validateCode input {
		width: 170px;
	}
	
	.login_form .telLogin .validateBtn {
		display: block;
		width: 100%;
	}
	
	.login_form .form .rememberPassword {
		border: none;
		display: flex;
		justify-content: space-between;
		margin-bottom: 0px;
		height: 30px;
	}
	
	.login_form .telLogin .rememberPassword {
		border: none;
		display: flex;
		justify-content: space-between;
		margin-bottom: 0px;
		margin-top: 6px;
		height: 30px;
	}
	
	.rememberPassword a {
		font-size: 14px;
		color: #666;
		text-decoration: none;
	}
	
	.rememberPassword a:hover {
		text-decoration: underline;
	}
	
	.login_form .form .btnDiv {
		border: none;
		margin-top: 10px;
	}
	
	.btnDiv .el-button {
		display: block;
		width: 100%;
		height: 40px;
	}
	
	.btnDiv .el-button span {
		display: block;
		font-size: 16px;
	}
	
	.foot {
		height: 60px;
		line-height: 60px;
		text-align: center;
	}
</style>