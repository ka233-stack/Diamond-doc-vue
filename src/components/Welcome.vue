<template>
  <div>
    <el-container>
      <!-- 头部区域-->
      <el-header class="nav">
        <div class="header-left">
          <img src="../assets/img/logo.png" alt="金刚石文档logo" />
          <span>金刚石文档</span>
        </div>
        <div class="header-right">
          <!-- 登录按钮 -->
          <el-button @click="login">登录</el-button>
          <!-- 注册按钮 -->
          <el-button @click="register">注册</el-button>
          <!-- 工作台按钮（登录后） -->
        </div>
      </el-header>
      <!-- 页面主体区域 -->
      <el-main>
        <div class="content">
          <p>这是软件的介绍等</p>
        </div>
      </el-main>
      <!-- 底部区域-->
      <el-footer>
        <div class="footer">
          <p>Footer</p>
        </div>
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
  margin: 0;
  padding: 0;
  background-color: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.nav {
  height: 50px !important;
  background-color: white;
}
.header-left {
  width: 250px;
  height: 50px;
  display: flex;
  justify-items: flex-start;
  align-items: center;
}
.header-left img {
  width: 40px;
  height: 40px;
  margin-left: 20px;
}
.header-left span {
  width: 100px;
  height: 40px;
  margin-left: 10px;
  display: inline-block;
  text-align: center;
  line-height: 40px;
  font-size: 18px;
}
.header-right {
  width: 400px;
  height: 50px;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.header-right .el-button {
  width: 100px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 14px;
  border: none;
  border-radius: 1px;
  background-color: rgb(85, 85, 85);
}
.el-main {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: whitesmoke;
}
.content {
  width: 70%;
  height: 1000px;
  display: flex;
  justify-content: center;
}
.el-footer {
  height: 200px !important;
  position: relative;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: rgb(85, 85, 85);
}
.footer {
  width: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
