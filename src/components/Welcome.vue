<template>
  <el-container>
    <!-- 头部区域-->
    <el-header>
      <img
        class="background"
        src="../assets/img/wl_backsrc.png"
        alt="background"
      />
      <div class="navbar">
        <div class="title">
          <img class="name1" src="../assets/img/name2.png" alt="name2" />
          <img class="logo" src="../assets/img/logo.png" alt="logo" />
          <img class="name2" src="../assets/img/name3.png" alt="name3" />
        </div>
        <div class="buttons">
          <!-- 注册按钮 -->
          <el-button v-if="!hasLogin" class="navbtn" @click="register"
            >注册</el-button
          >
          <!-- 登录按钮 -->
          <el-button v-if="!hasLogin" class="navbtn" @click="login"
            >登录</el-button
          >
          <el-button v-if="hasLogin" class="navbtn" @click="gotoDashboard"
            >开始使用</el-button
          >
        </div>
      </div>
      <div class="intro">
        <span>超越富文本编辑器，面向 doc 与未来的办公软件</span>
        <img src="../assets/img/shot1.png" alt="shot1">
      </div>
    </el-header>
    <el-main>
      <!-- 产品介绍 -->
      <div class="outer">
        <div class="inner">
          <div>
            <h3>文档协作</h3>
            <span>
              轻量级文档协同，支持文档多人编辑。
            </span>
          </div>
          <img id="shot2" src="../assets/img/shot2.png" alt="adv1" />
        </div>
        <div class="inner">
          <img id="shot3" src="../assets/img/shot3.png" alt="adv2" />
          <div>
            <h3 class="lefth3">权限可控</h3>
            <span>
              文档读写权限可控，确保信息安全。
            </span>
          </div>
        </div>
        <div class="inner">
          <div>
            <h3>丰富模板</h3>
            <span>
              支持模板自定义，开启高效工作模式。
            </span>
          </div>
          <img id="shot4" src="../assets/img/shot4.png" alt="adv3" />
        </div>
      </div>
    </el-main>
    <!-- 底部区域-->
    <el-footer>
      <div class="footer">
        <!-- 页尾 -->
        <img
          class="footerlogo"
          src="../assets/img/logowhite.png"
          alt="logowhite"
        />
        <el-button class="footerbtn" @click="gameStart">开始使用</el-button>
        <div class="produced">
          <p>By</p>
          <div>
            <span>LE.</span>
            <span>Rank_E</span>
            <span>Redal</span>
            <span>Sujun</span>
            <span>XuYanyang</span>
          </div>
        </div>
      </div>
    </el-footer>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      hasLogin: false
    }
  },
  created() {
    this.checkLogin()
  },
  methods: {
    // 转到登录
    login() {
      this.$router.push('/login')
    },
    // 转到注册
    register() {
      this.$router.push('/register')
    },
    checkLogin() {
      if (window.sessionStorage.getItem('token') !== null) {
        this.hasLogin = true
      }
    },
    gotoDashboard() {
      this.$router.push('/dashboard')
    },
    gameStart() {
      if (window.sessionStorage.getItem('token') !== null) {
        this.$router.push('/dashboard')
      } else {
        this.$router.push('/login')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.el-header {
  width: 1918px !important;
  height: 937px !important;
  margin: 0;
  padding: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  overflow: hidden !important;
  background: linear-gradient(
    to bottom,
    rgb(190, 190, 190) 0%,
    rgb(221, 221, 221) 75%,
    rgb(245, 245, 245) 100%
  );
}
.background {
  width: 1918px;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.2;
  user-select: none;
}
.navbar {
  height: 350px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  z-index: 99;
}
.title .logo {
  width: 120px;
  height: 120px;
  margin: 30px 10px;
  user-select: none;
}
.name1,
.name2 {
  width: 120px;
  position: absolute;
  top: 0;
  left: 50%;
  user-select: none;
  transform: translateX(-50%);
  -webkit-transform: translateX(-50%);
}
.name1 {
  top: 75px;
  transform: translateX(-170%);
  -webkit-transform: translateX(-170%);
}
.name2 {
  top: 75px;
  transform: translateX(70%);
  -webkit-transform: translateX(70%);
}
.buttons {
  width: 320px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.navbtn,
.footerbtn {
  width: 150px;
  height: 50px;
  margin: 0 5px;
  padding: 0;
  color: rgb(50, 50, 50);
  font-size: 20px;
  font-weight: 700;
  line-height: 25px;
  letter-spacing: 10px;
  text-indent: 10px;
  border: 3px solid rgb(50, 50, 50);
  border-radius: 0;
  background-color: transparent;
  transition: 0.2s ease-in-out;
  -webkit-transition: 0.2s ease-in-out;
}
.navbtn:hover {
  color: whitesmoke;
  border: 3px solid rgb(50, 50, 50);
  background-color: rgb(50, 50, 50);
  transition: 0.1s ease-in-out;
  -webkit-transition: 0.1s ease-in-out;
}
.intro {
  width: 1140px;
  height: 587px;
  color: rgb(50, 50, 50);
  font-size: 40px;
  font-family: mainfont;
  text-align: center;
  letter-spacing: 2px;
  text-indent: 2px;
  z-index: 98;
  user-select: none;
}
.intro img {
  width: 900px;
  position: absolute;
  bottom: -20px;
  right: 50%;
  transform: translateX(50%);
}
.el-main {
  width: 1901px;
  height: 1850px;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  background-color: white;
}
.el-main img {
  width: 400px;
}
.outer {
  width: 1200px;
  height: 1850px;
  padding-top: 130px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.inner {
  width: 1200px;
  margin: 30px 0;
  padding: 50px 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  border-radius: 10px 10px 0 0;
  transition: 0.5s ease-in-out;
  -webkit-transition: 0.5s ease-in-out;
}
.inner:hover {
  box-shadow: 0 0px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  transform: translateY(-20px);
  -webkit-transform: translateY(-20px);
  transition: 0.4s ease-in-out;
  -webkit-transition: 0.4s ease-in-out;
}
.inner div {
  margin: 0 70px;
  margin-top: 40px;
  text-align: justify;
}
.inner h3 {
  color: rgb(50, 50, 50);
  font-size: 30px;
  font-weight: 100;
  font-family: mainfont;
  letter-spacing: 1px;
  text-indent: 1px;
}
.lefth3 {
  text-align: right;
}
.inner #shot2 {
  width: 600px;
  user-select: none;
}
.inner #shot3 {
  width: 800px;
  user-select: none;
}
.inner #shot4 {
  width: 600px;
  user-select: none;
}
.el-footer {
  width: 1918px !important;
  height: 600px !important;
  position: relative;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  color: white;
  background-color: rgb(50, 50, 50);
}
.footer {
  width: 1045px;
  margin: 50px 0;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.footerlogo {
  width: 200px;
  margin: 50px 0;
  user-select: none;
}
.footerbtn {
  color: white;
  font-weight: 500;
  letter-spacing: 3px;
  text-indent: 3px;
  border: 2px solid white;
}
.footerbtn:hover {
  font-weight: 600;
  color: rgb(50, 50, 50);
  border: 2px solid white;
  background-color: white;
}
.produced {
  margin: 0;
  padding: 0;
  margin-top: 70px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: rgb(138, 138, 138);
  font-size: 14px;
}
.produced div {
  display: flex;
  justify-content: center;
  align-items: center;
}
.produced span {
  margin: 0 7px;
}
</style>
