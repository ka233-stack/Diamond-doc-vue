<template>
  <div class='login_container'>
    <!-- 登录组件 -->
    <div class='login_box'>
      <!-- 头像区域 -->
      <div class='avatar_box'>
        <img src='../assets/default avatar.png' alt />
      </div>
      <!-- 标题区域 -->
      <div class='loginTitle'>
        <h2>登录</h2>
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref='loginFormRef'
        :model='loginForm'
        :rules='loginFormRules'
        label-width='0px'
        class='login_form'
      >
        <!-- 用户名 -->
        <el-form-item prop='username'>
          <el-input v-model='loginForm.username' prefix-icon='el-icon-user'></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop='password'>
          <el-input v-model='loginForm.password' prefix-icon='el-icon-lock' type='password'></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class='btns'>
          <!-- 登录按钮 -->
          <el-button type='primary' @click='login'>立即登录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 提示 -->
    <div class='registerPropt'>
      <h2>没有账号？</h2>
      <p>立即注册，享用大量学习资源！</p>
      <!-- 转到注册按钮 -->
      <el-button type='primary' @click='gotoRegister'>注册</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data () {
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
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      },
      // 注册表单的数据绑定对象
      registerForm: {
        username: '',
        email: '',
        password1: '',
        password2: ''
      },
      // 登录表单的验证规则对象
      registerFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证邮箱是否合法
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password1: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        // 验证两次密码是否相同
        password2: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 登录
    login () {
      // 判断合法
      // 发送数据并接收返回信息
      // 登录失败弹窗提示(Message)
      // 登录成功跳转
    },
    // 转到注册
    gotoRegister () {
      this.$router.push('/register')
    }
  }
}
</script>
<style lang='less' scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: center;
}
</style>
