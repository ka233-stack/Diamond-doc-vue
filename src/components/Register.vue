<template>
  <div class='register_container'>
    <!-- 注册组件 -->
    <div class='register_box'>
      <!-- 头像区域 -->
      <div class='avatar_box'>
        <img src='../assets/default avatar.png' alt />
      </div>
      <!-- 标题区域 -->
      <div class='registerTitle'>
        <h2>注册</h2>
      </div>
      <!-- 注册表单区域 -->
      <el-form
        ref='registerFormRef'
        :model='registerForm'
        :rules='registerFormRules'
        label-width='0px'
        class='register_form'
      >
        <!-- 用户名 -->
        <el-form-item prop='username'>
          <el-input v-model='registerForm.username' prefix-icon='el-icon-user'></el-input>
        </el-form-item>
         <!-- 邮箱 -->
        <el-form-item prop='email'>
          <el-input v-model='registerForm.email' prefix-icon='el-icon-message' type='email'></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop='password1'>
          <el-input v-model='registerForm.password' prefix-icon='el-icon-lock' type='password'></el-input>
        </el-form-item>
        <!-- 确认密码 -->
        <el-form-item prop='password2'>
          <el-input v-model='registerForm.password' prefix-icon='el-icon-lock' type='password'></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class='btns'>
          <!-- 登录按钮 -->
          <el-button type='primary' @click='register'>注册</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 提示 -->
      <div class='registerPropt'>
        <h2>已有帐号？</h2>
        <p>见到你很高兴xD，快点登录吧！</p>
        <!-- 转到登录按钮 -->
        <el-button type='primary' @click='gotoregister'>登录</el-button>
      </div>
  </div>
</template>
<script>
export default {
  data () {
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
    // 注册
    register () {
      // 判断合法
      // 发送数据并接收返回信息
      // 注册失败弹窗提示(Message)
      // 注册成功跳转
    },
    // 转到登录
    gotoregister () {
      this.$router.push('/login')
    }
  }
}
</script>
<style lang='less' scoped>
</style>
