<template>
  <div class="register_container">
    <!-- 注册组件 -->
    <div class="register_box">
      <!-- 标题区域 -->
      <div class="registerTitle">
        <h2>注册</h2>
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
          <el-button class="login_btn" type="primary" @click="gotoLogin"
            >立即登录</el-button
          >
        </div>
      </div>
    </div>
  </div>
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
      // 注册表单的数据绑定对象
      registerForm: {
        username: '',
        email: '',
        password1: '',
        password2: ''
      },
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
      this.$refs.registerFormRef.validate(valid => {
        // 校验失败
        if (!valid) return
        // 判断合法
        // 发送数据并接收返回信息
        // 注册失败弹窗提示(element-ui Message)
        // 注册成功跳转
        this.$router.push('/dashboard')
      })
    },
    // 转到登录
    gotoLogin() {
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="less" scoped>
.register_container {
  width: 100%;
  height: 100%;
  margin: 0;
  position: absolute;
  background: url(../assets/lr_backsrc.jpg) no-repeat;
  background-size: 100% 100%;
  background-attachment: fixed;
}
.register_box {
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
.registerTitle {
  width: 100%;
  height: 50px;
  margin-top: -30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.registerTitle h2 {
  color: rgb(85, 85, 85);
  font-size: 28px;
  letter-spacing: 5px;
  text-indent: 5px;
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
  box-shadow: inset 0 0 8px rgb(189, 189, 189);
  transition: 0.2s linear;
  -webkit-transition: 0.2s linear;
}
/deep/ .el-input__inner:focus {
  box-shadow: inset 0 0 12px rgb(165, 165, 165);
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
  background-color: rgb(85, 85, 85);
}
.register_btn:hover {
  background-color: rgb(49, 49, 49);
  box-shadow: 0 0 3px rgb(49, 49, 49);
}
.register_btn:active {
  background-color: rgb(85, 85, 85);
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
  color: rgb(85, 85, 85);
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
  font-weight: 700;
  box-shadow: 1px 2px 7px rgb(167, 167, 167);
}
.login_btn:active {
  font-weight: 700;
  color: white;
  background-color: rgb(85, 85, 85);
  box-shadow: none;
}
</style>
