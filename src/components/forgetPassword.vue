<template>
  <div>
    <div class="top">
      <div class="top_center">
        <div class="logo_and_title">
          <img src="../../static/img/logo1.png" alt="" width="40"/>
          <h1>门户管理平台</h1>
          <router-link to="/" tag="a" class="returnLogin">返回登录</router-link>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="main_center">
        <div class="login_form">
          <h3 class="getPassword">找回密码</h3>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm"
                   @keyup.enter.native="resetPassword">
            <el-form-item label="手机号" prop="tel">
              <el-input v-model="ruleForm.tel"></el-input>
            </el-form-item>
            <el-form-item label="设置新密码" prop="newPsd">
              <el-input type='password' v-model="ruleForm.newPsd"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" prop="comfirmPsd">
              <el-input type='password' v-model="ruleForm.comfirmPsd"></el-input>
            </el-form-item>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="验证码" prop="identifyingCode">
                  <el-input v-model="ruleForm.identifyingCode"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="!sendMsgDisabled">
                <el-form-item label-width="0px">
                  <el-button @click="getIdentify()">{{btnText}}</el-button>
                </el-form-item>
              </el-col>
              <template v-else>
                <el-col :span="8">
                  <el-form-item label-width="0px">
                    <el-button disabled>{{time+'秒后重新发送'}}</el-button>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <span class="send"><i class="el-icon-circle-check" style="color:#12ce66 ;"></i> 已发送</span>
                </el-col>
              </template>
            </el-row>
            <el-form-item>
              <el-button type="primary" @click="resetPassword()">重置密码</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="foot">
      <p>Copyright © 2017中科天翔</p>
    </div>
  </div>
</template>

<script>
  import {sendCode, resetPasswordAction, validatePhone} from '../api/api';

  var validateIsExist = (rule, value, callback) => {
    if (value) {
      let para = {
        phone: value,
      }
      validatePhone(para).then((data) => {
        if (!data) {
          callback();
        } else {
          callback(new Error("该手机号不存在或未启用！"));
        }
      });
    } else {
      callback();
    }

  };
  export default {
    data() {
      return {
        btnText: '获取验证码',
        time: 60, // 发送验证码倒计时
        sendMsgDisabled: false,
        ruleForm: {
          tel: '',
          newPsd: '',
          comfirmPsd: '',
          identifyingCode: '',
        },
        rules: {
          tel: [{
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
            {
              required: true,
              validator: validateIsExist,
              trigger: 'blur'
            }
          ],
          newPsd: [{
            required: true,
            message: '请输入新密码',
            trigger: 'blur'
          }],
          comfirmPsd: [{
            required: true,
            message: '请再次确认新密码',
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
      resetPassword() {
        let para = {
          mobile: this.ruleForm.tel,
          password1: this.ruleForm.newPsd,
          password2: this.ruleForm.comfirmPsd,
          msgValiCode: this.ruleForm.identifyingCode
        };

        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            resetPasswordAction(para).then((data) => {
              if (data.success) {
                //重置密码成功
                this.ruleForm.identifyingCode = '';
                this.$message({
                  message: '恭喜你，密码重置成功',
                  type: 'success'
                });
                this.$router.push({path: '/'});
              } else {
                //短信发送失败
                this.$message({
                  type: 'error',
                  message: data.title
                });
              }
            }).catch(() => {
              //出现异常
            });
          } else {
            //验证不过，请完整输入相关信息
          }
        });


      },
      getIdentify() { //获取手机验证码
        //验证手机号码正确性
        let para = {
          mobile: this.ruleForm.tel
        };

        if (!this.ruleForm.tel || this.ruleForm.tel == undefined || this.ruleForm.tel == '') {
          //手机号码不能为空
          this.$message({
            type: 'error',
            message: '手机号码不能为空'
          });
        } else {
          sendCode(para).then((data) => {
            if (data.success) {
              this.$message({
                type: 'success',
                message: '短信验证码发送成功，请查收'
              });
              let me = this;
              me.sendMsgDisabled = true;
              me.btnText = '重新获取';
              let interval = window.setInterval(function () {
                if ((me.time--) <= 0) {
                  me.time = 60;
                  me.sendMsgDisabled = false;
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
  button {
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
    box-shadow: 0 2px 9px 0 rgba(0, 0, 0, 0.15);
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

  .top_center .returnLogin {
    float: right;
    font-size: 14px;
    color: #333;
    line-height: 70px;
    margin-right: 100px;
    text-decoration: none;
  }

  .top_center .returnLogin:hover {
    color: #2a82dd;
  }

  .main {
    width: 100%;
    height: 440px;
  }

  .main_center {
    width: 1100px;
    height: 500px;
    margin: 0 auto;
  }

  .login_form {
    width: 700px;
    height: 440px;
    padding: 20px;
    box-sizing: border-box;
    background: #fff;
    margin: 40px auto 50px;
    border-radius: 5px;
    box-shadow: 0 2px 9px 0 rgba(0, 0, 0, 0.15);
  }

  .login_form .form {
    height: 240px;
    overflow: hidden;
  }

  .login_form .getPassword {
    height: 30px;
    color: #666;
    font-size: 16px;
    border-bottom: 1px solid #eee;
    margin-bottom: 20px;
  }

  .ruleForm {
    width: 420px;
    margin-left: 80px;
  }

  .ruleForm .el-button {
    display: block;
    width: 100%;
    height: 36px;
  }

  .send {
    line-height: 36px;
    color: #000;
  }

  .changeCode {
    line-height: 36px;
    color: #0667dc;
    font-size: 12px;
    cursor: pointer;
    text-decoration: underline;
  }

  .foot {
    height: 60px;
    line-height: 60px;
    text-align: center;
  }

  .createCode {
    height: 36px;
    border: 1px solid #999;
    box-sizing: border-box;
    font-family: Arial;
    font-style: italic;
    color: blue;
    font-size: 28px;
    letter-spacing: 3px;
    font-weight: bolder;
    text-align: center;
    vertical-align: middle;
    line-height: 36px;
    background: #eee;
  }

</style>
