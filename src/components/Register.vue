<template>
  <el-container>
    <img class="background" src="../assets/img/rg_backsrc.png" alt="background" />
    <!-- 头部区域-->
    <el-header>
      <div class="welcomebtn" @click="gotoWelcome">
        <div id="bars"></div>
        <div id="bars"></div>
        <div id="bars"></div>
      </div>
      <div id="triangle"></div>
    </el-header>
    <el-main>
      <!-- 注册组件 -->
      <div class="register_box">
        <!-- 标题区域 -->
        <div class="registerTitle">
          <div id="block_outer"></div>
          <div id="block_inner"></div>
          <h2>注册</h2>
          <div id="block_outer"></div>
          <div id="block_inner"></div>
        </div>
        <!-- 注册表单区域 -->
        <div class="registerForm">
          <el-form
            ref="registerFormRef"
            :model="registerForm"
            :rules="registerFormRules"
            label-width="0px"
            class="register_form"
          >
            <!-- 用户名 -->
            <el-form-item prop="username">
              <el-input
                v-model="registerForm.username"
                prefix-icon="el-icon-user"
                placeholder="用户名"
              ></el-input>
            </el-form-item>
            <!-- 邮箱 -->
            <el-form-item prop="email">
              <el-input
                v-model="registerForm.email"
                prefix-icon="el-icon-message"
                type="email"
                placeholder="邮箱"
              ></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password1">
              <el-input
                v-model="registerForm.password1"
                prefix-icon="el-icon-lock"
                type="password"
                placeholder="密码"
              ></el-input>
            </el-form-item>
            <!-- 确认密码 -->
            <el-form-item prop="password2">
              <el-input
                v-model="registerForm.password2"
                prefix-icon="el-icon-lock"
                type="password"
                placeholder="确认密码"
              ></el-input>
            </el-form-item>
            <!-- 按钮区域 -->
            <el-form-item>
              <!-- 登录按钮 -->
              <el-button class="register_btn" @click="register">注册</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 提示 -->
        <div class="loginPropt">
          <div>已有帐号？</div>
          <!-- 转到登录按钮 -->
          <div>
            <el-button class="login_btn" type="primary" @click="gotoLogin">立即登录</el-button>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script>
export default {
  data() {
    // 验证两次密码一致的函数
    var checkPassword2 = (rule, value, callback) => {
      if (value !== this.registerForm.password1) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    // 验证邮箱格式的函数
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱格式的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (!regEmail.test(value)) {
        callback(new Error('请输入合法的邮箱'))
      } else {
        callback()
      }
    }
    return {
      // 表单数据------------------------------------------------------------
      // 注册表单的数据绑定对象
      registerForm: {
        username: '',
        email: '',
        password1: '',
        password2: ''
      },
      // 验证规则------------------------------------------------------------
      // 注册表单的验证规则对象
      registerFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证邮箱是否合法
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        // 验证密码是否合法
        password1: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        // 验证二次密码是否合法
        password2: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '长度在 6 到 16 个字符',
            trigger: 'blur'
          },
          { validator: checkPassword2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 注册
    register() {
      this.$refs.registerFormRef.validate(async valid => {
        // 校验失败
        if (!valid) return
        // 要发送的数据
        var postForm = {
          username: this.registerForm.username,
          password: this.registerForm.password1,
          email: this.registerForm.email,
          image: 'image/avatar.png'
        }
        const { data: res } = await this.$http.post('/register/', postForm)
        // 发送数据并接收返回信息
        if (res === '用户名已存在' || res === '邮箱已存在') {
          this.$message.error(res)
        } else {
          // token = res;
          window.sessionStorage.setItem('token', res)
          this.$message.success('注册成功')
          this.$router.push('/dashboard')
        }
      })
    },
    // 转到首页
    gotoWelcome() {
      this.$router.push('/')
    },
    // 转到登录
    gotoLogin() {
      this.$router.push('/login')
    }
    // 检查登录状态
    /*
    checkLogin() {
      console.log(window.sessionStorage.getItem('token'))
      if (window.sessionStorage.getItem('token') !== null) {
        this.$router.push('/dashboard')
      }
    }
    */
  }
}
</script>
<style lang="less" scoped>
.el-container {
  width: 1918px;
  height: 937px;
  margin: 0;
  padding: 0;
  position: absolute;
  overflow: hidden;
}
.background {
  width: 1918px;
  opacity: 0.6;
}
.welcomebtn {
  width: 50px;
  height: 40px;
  position: absolute;
  top: 30px;
  left: 35px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  z-index: 99;
  transition: 0.2s ease-in;
  -webkit-transition: 0.2s ease-in;
}
#bars {
  width: 50px;
  height: 8px;
  border-radius: 100px;
  background-color: rgb(150, 150, 150);
}
.welcomebtn:hover {
  transform: scale(1.05, 1.05);
  -webkit-transform: scale(1.05, 1.05);
  transition: 0.1s ease-in;
  -webkit-transition: 0.1s ease-in;
}
.welcomebtn:hover #bars {
  background-color: rgb(85, 85, 85);
  box-shadow: 0 0 3px rgb(199, 199, 199);
  transform: scale(1.05, 1.05);
  -webkit-transform: scale(1.05, 1.05);
  transition: 0.1s ease-in;
  -webkit-transition: 0.1s ease-in;
}
#triangle {
  width: 0;
  height: 0;
  position: absolute;
  top: 0;
  left: 0;
  border-top: 200px solid white;
  border-right: 200px solid transparent;
}
.register_box {
  width: 700px;
  height: 600px;
  position: absolute;
  left: 50%;
  top: 45%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  box-shadow: 0 0 5px rgb(201, 201, 201);
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
}
.registerTitle {
  width: 100%;
  height: 50px;
  margin-top: -30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.registerTitle h2 {
  color: rgb(50, 50, 50);
  font-size: 28px;
  letter-spacing: 5px;
  text-indent: 5px;
}
#block_outer {
  width: 21px;
  height: 21px;
  position: absolute;
  top: 51px;
  background-color: rgb(50, 50, 50);
}
#block_outer::before {
  content: '';
  width: 17px;
  height: 17px;
  position: absolute;
  top: 2px;
  left: 2px;
  background-color: white;
}
#block_inner {
  width: 11px;
  height: 11px;
  position: absolute;
  top: 56px;
  background-color: rgb(50, 50, 50);
}
#block_inner::before {
  content: '';
  width: 7px;
  height: 7px;
  position: absolute;
  top: 2px;
  left: 2px;
  background-color: white;
}
#block_outer:nth-child(1) {
  left: 240px;
}
#block_inner:nth-child(2) {
  left: 245px;
}
#block_outer:nth-child(4) {
  right: 240px;
}
#block_inner:nth-child(5) {
  right: 245px;
}
#block_outer:nth-child(1),
#block_inner:nth-child(2),
#block_outer:nth-child(4),
#block_inner:nth-child(5) {
  transform: rotateZ(45deg);
}
.registerForm {
  width: 100%;
  height: 400px;
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.register_form {
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
  box-shadow: inset 0 0 6px rgb(189, 189, 189);
  transition: 0.2s linear;
  -webkit-transition: 0.2s linear;
}
/deep/ .el-input__inner:focus {
  box-shadow: inset 0 0 8px rgb(189, 189, 189);
}
.register_btn {
  width: 320px;
  height: 50px;
  margin-top: 20px;
  color: white;
  font-size: 20px;
  letter-spacing: 4px;
  text-indent: 4px;
  border: none;
  border-radius: 1px;
  background: linear-gradient(
    -20deg,
    rgb(50, 50, 50) 0%,
    rgb(70, 70, 70) 60%,
    rgb(50, 50, 50) 100%
  );
}
.register_btn:hover {
  color: white;
}
.register_btn:active {
  background: linear-gradient(
    -20deg,
    rgb(85, 85, 85) 0%,
    rgb(100, 100, 100) 60%,
    rgb(85, 85, 85) 100%
  );
  box-shadow: none;
}
.loginPropt {
  width: 320px;
  height: 30px;
  margin-top: -10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  color: rgb(50, 50, 50);
}
.login_btn {
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
.login_btn:hover {
  color: black;
  font-weight: 700;
  background: linear-gradient(
    -10deg,
    rgb(219, 219, 219) 0%,
    rgb(255, 255, 255) 100%
  );
  box-shadow: 1px 2px 7px rgb(167, 167, 167);
}
.login_btn:active {
  font-weight: 700;
  color: white;
  background: linear-gradient(
    -10deg,
    rgb(50, 50, 50) 0%,
    rgb(100, 100, 100) 100%
  );
  box-shadow: none;
}
</style>
