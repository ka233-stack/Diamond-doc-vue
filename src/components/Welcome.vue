<template>
  <div>
    <el-container class="">
      <!-- 头部区域-->
      <el-header>
        <p>Header</p>
        <div class="header-left">
          <img src="../assets/logo.png" alt="金刚石文档logo" />
          <span>金刚石文档</span>
        </div>
        <div class="header-right">
          <!-- 注册按钮 -->
          <el-button @click="register">开始注册</el-button>
          <!-- 登录按钮 -->
          <el-button @click="login">登录</el-button>
          <!-- 工作台按钮（登录后） -->
        </div>
      </el-header>
      <!-- 页面主体区域 -->
      <el-main>
        <p>Main</p>
      </el-main>
      <!-- 底部区域-->
      <el-footer>
        <p>Footer</p>
      </el-footer>
    </el-container>
  </div>
</template>
<script>
export default {
  methods: {
    // 转到登录
    login() {
      this.$router.push('/login')
    },
    // 转到注册
    register() {
      this.$router.push('/register')
    }
  }
}
</script>
<style lang="less" scoped>
.welcome-container {
  height: 100%;
}
.el-header {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  padding-left: 0px;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
    font-size: 20px;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #e6e6e6;
}
.el-main {
  background-color: #f7f7f7;
}
</style>
