<template>
  <div class="login-container">
    <div class="title-container">
      <h3 class="title">文件管理平台</h3>
    </div>
    <div class="tabs-container">
      <!-- 注册的tab -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="注册" name="regiser">
          <el-form
            ref="regiserForm"
            :model="regiserForm"
            :rules="regiserRules"
            class="regiser-form"
            auto-complete="on"
            label-position="left"
          >
            <el-form-item prop="username">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-input
                ref="username"
                v-model="regiserForm.userName"
                placeholder="username"
                name="username"
                type="text"
                tabindex="1"
                auto-complete="on"
              />
            </el-form-item>

            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                :key="passwordType"
                ref="password"
                v-model="regiserForm.password"
                :type="passwordType"
                placeholder="Password"
                name="password"
                tabindex="2"
                auto-complete="on"
                @keyup.enter.native="handleLogin"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon
                  :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
                />
              </span>
            </el-form-item>
            <el-form-item prop="phone">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-input
                ref="phone"
                v-model="regiserForm.phone"
                placeholder="手机号"
                name="phone"
                type="text"
                tabindex="1"
                auto-complete="on"
              />
            </el-form-item>
            <el-form-item prop="userdepartment">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-select
                v-model="regiserForm.userDepartment"
                placeholder="请选择部门"
              >
                <el-option label="部门一" value="1" />
                <el-option label="部门二" value="2" />
              </el-select>
            </el-form-item>
            <el-button
              type="primary"
              style="width: 100%"
              @click.native.prevent="handleResiger"
              >注册</el-button
            >

            <!-- <div class="tips">
              <span style="margin-right: 20px">username: admin</span>
              <span> password: any</span>
            </div> -->
          </el-form>
        </el-tab-pane>
        <!-- 登陆的tabs -->
        <el-tab-pane label="登陆" name="login">
          <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            auto-complete="on"
            label-position="left"
          >
            <el-form-item prop="username">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-input
                ref="username"
                v-model="loginForm.userName"
                placeholder="username"
                name="username"
                type="text"
                tabindex="1"
                auto-complete="on"
              />
            </el-form-item>

            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="Password"
                name="password"
                tabindex="2"
                auto-complete="on"
                @keyup.enter.native="handleLogin"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon
                  :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
                />
              </span>
            </el-form-item>
            <!-- 验证码 -->
            <el-form-item prop="code">
              <el-input v-model="loginForm.loginVerifyParam" />
              <img
                class="code"
                :src="code"
                alt="验证码图片"
                style="width: 30px; height: 30px; display: inline-block"
                @click="getVerifyCode"
              />
            </el-form-item>
            <el-button
              :loading="loading"
              type="primary"
              style="width: 100%"
              @click.native.prevent="handleLogin"
              >登陆</el-button
            >
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import axios from "axios";
export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("Please enter the correct user name"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("The password can not be less than 6 digits"));
      } else {
        callback();
      }
    };
    return {
      activeName: "regiser",
      // 验证码  假数据 用接口返回的替换
      code:
        "data:image/png;base64,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",
      // 登陆的参数
      loginForm: {
        userName: "admin",
        password: "111111",
        loginVerifyParam: "", // 验证码
      },
      // 注册的参数
      regiserForm: {
        account: 2,
        password: 123456,
        userName: "test",
        userDepartment: 1,
        phone: 15101040690,
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      regiserRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    this.getVerifyCode();
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    // 获取验证码  （先采用页面里使用axios 直接调的形式，后面再抽到dispatch vuex上）
    getVerifyCode() {
      axios.get("/captchaController/generateVerifyCodeOfReport").then((res) => {
        console.log(res, "获取验证码");
        // this.code = res.data.code;
      });
    },
    // 注册
    handleResiger() {
      // 法1 直接使用axios
      const params = this.regiserForm;
      // const params = {
      //   account: this.regiserForm.password,
      //   password: this.regiserForm.password,
      //   userName: this.regiserForm.userName,
      //   userDepartment: this.regiserForm.userDepartment,
      //   phone: this.regiserForm.phone,
      // };
      axios.post("/registered", params).then((res) => {
        console.log(res, "注册");
      });

      // 法2
      // this.$refs.loginForm.validate((valid) => {
      //   if (valid) {
      //     this.loading = true;
      //     this.$store
      //       .dispatch("resiger", params)
      //       .then((res) => {
      //         console.log(res, "res");
      //         // this.$router.push({ path: this.redirect || '/' })
      //         this.loading = false;
      //       })
      //       .catch(() => {
      //         this.loading = false;
      //       });
      //   } else {
      //     console.log("error submit!!");
      //     return false;
      //   }
      // });
    },
    // 登陆
    handleLogin() {
      this.$router.push({ path: "/dashboard" });
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
// 4.25新增
.tabs-container {
  width: 520px;
  margin: 0 auto;
  .el-tabs__item {
    color: #fff;
  }
}
.code {
  border: 1px solid red;

  display: flex;
  justify-content: center;
  align-items: center;
}
/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    // padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    margin-top: 100px;
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
