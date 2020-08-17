<template>
  <div class="login_container">
    <!-- 登录组件 -->
    <div class="login_box">
      <!-- 标题区域 -->
      <div class="loginTitle">
        <h2>登录</h2>
      </div>
      <!-- 登录表单区域 -->
      <div class="loginForm">
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginFormRules"
          label-width="0px"
          class="login_form"
        >
          <!-- 用户名 -->
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              prefix-icon="el-icon-user"
              placeholder="用户名"
            ></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              prefix-icon="el-icon-lock"
              type="password"
              placeholder="密码"
            ></el-input>
          </el-form-item>
          <!-- 按钮区域 -->
          <el-form-item>
            <!-- 登录按钮 -->
            <el-button class="login_btn" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 提示 -->
      <div class="registerPropt">
        <div>没有账号？</div>
        <!-- 转到注册按钮 -->
        <div>
          <el-button class="register_btn" @click="gotoRegister">
            <span>立即注册</span>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        username: '',
        password: ''
      },
      // 登录表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.checkLogin()
  },
  methods: {
    // 登录
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        // 校验失败
        if (!valid) return
        // 发送数据并接收返回信息
        const { data: res } = await this.$http.post('/login/', this.loginForm)
        if (res === '登录失败') {
          // 登录失败弹窗提示
          this.$message.error(res)
        } else {
          // 登录成功跳转
          // token=res
          window.sessionStorage.setItem('token', res)
          this.$message.success('登陆成功')
          this.$router.push('/dashboard')
        }
      })
    },
    // 转到注册
    gotoRegister() {
      this.$router.push('/register')
    },
    // 检查登录状态
    checkLogin() {
      if (window.sessionStorage.getItem('token') !== null) {
        this.$router.push('/dashboard')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.login_container {
  width: 100%;
  height: 100%;
  margin: 0;
  position: absolute;
  background: url(../assets/img/lr_backsrc.jpg) no-repeat;
  background-size: 100% 100%;
  background-attachment: fixed;
}
.login_box {
  width: 400px;
  height: 100%;
  position: absolute;
  left: 65%;
  top: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  box-shadow: 0 0 10px rgb(46, 46, 46);
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
}
.loginTitle {
  width: 100%;
  height: 50px;
  margin-top: -30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.loginTitle h2 {
  color: rgb(85, 85, 85);
  font-size: 28px;
  letter-spacing: 5px;
  text-indent: 5px;
}
.loginForm {
  width: 100%;
  height: 250px;
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login_form {
  width: 100%;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
/deep/ .el-input__inner {
  width: 320px;
  height: 50px;
  color: rgb(85, 85, 85);
  font-size: 15px;
  border: none;
  border-radius: 1px;
  box-shadow: inset 0 0 6px rgb(224, 224, 224);
  transition: 0.1s linear;
  -webkit-transition: 0.1s linear;
}
/deep/ .el-input__inner:hover {
  box-shadow: inset 0 0 8px rgb(189, 189, 189);
  transition: 0.2s linear;
  -webkit-transition: 0.2s linear;
}
/deep/ .el-input__inner:focus {
  box-shadow: inset 0 0 12px rgb(165, 165, 165);
}
.login_btn {
  width: 320px;
  height: 50px;
  margin-top: 20px;
  color: white;
  font-size: 20px;
  letter-spacing: 4px;
  text-indent: 4px;
  border: none;
  border-radius: 1px;
  background-color: rgb(85, 85, 85);
}
.login_btn:hover {
  background-color: rgb(49, 49, 49);
  box-shadow: 0 0 3px rgb(49, 49, 49);
}
.login_btn:active {
  background-color: rgb(85, 85, 85);
  box-shadow: none;
}
.registerPropt {
  width: 320px;
  height: 30px;
  margin-top: -10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  color: rgb(85, 85, 85);
}
.register_btn {
  width: 80px;
  height: 40px;
  margin-left: 5px;
  padding-left: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  letter-spacing: 1px;
  text-indent: 1px;
  border: none;
  border-radius: 1px;
  background-color: white;
}
.register_btn:hover {
  font-weight: 700;
  box-shadow: 1px 2px 7px rgb(167, 167, 167);
}
.register_btn:active {
  font-weight: 700;
  color: white;
  background-color: rgb(85, 85, 85);
  box-shadow: none;
}
</style>
