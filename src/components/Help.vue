<template>
  <el-container>
    <!-- 头部区域-->
    <el-header>
      <div class="welcomebtn" @click="goHome">
        <div id="bars"></div>
        <div id="bars"></div>
        <div id="bars"></div>
      </div>
      <div id="triangle-top-left"></div>
      <div class="navbar">
        <div class="item">
          <!-- 通知框 -->
          <el-popover
            placement="bottom"
            width="260"
            trigger="hover"
            title="通知"
          >
            <!-- 滚动条 -->
            <el-scrollbar style="height:360px">
              <!-- 通知显示部分 -->
              <div v-for="item in messageList" :key="item.id">
                <!-- 通知内容 -->
                <span>{{ item.content }}</span>
                <!-- 通知时间 -->
                <div>
                  <span>{{ item.createtime }}</span>
                  <!-- 确认、拒绝按钮 -->
                  <div v-if="item.category === 2">
                    <!-- 确认按钮 -->
                    <el-button
                      icon="el-icon-check"
                      circle
                      size="mini"
                      @click="agreeMessage(item)"
                    ></el-button>
                    <!-- 拒绝按钮 -->
                    <el-button
                      icon="el-icon-close"
                      circle
                      size="mini"
                      @click="refuseMessage(item)"
                    ></el-button>
                  </div>
                  <!-- 已读按钮 -->
                  <div v-else>
                    <!-- 确认按钮 -->
                    <el-button
                      icon="el-icon-check"
                      circle
                      size="mini"
                      @click="readMessage(item)"
                    ></el-button>
                  </div>
                </div>
              </div>
            </el-scrollbar>
            <el-badge
              :value="messageInfo.messageNum"
              :max="99"
              :hidden="messageInfo.isHidden"
              slot="reference"
            >
              <!-- 通知图标 -->
              <el-button
                id="bellbtn"
                icon="el-icon-bell"
                circle
                @click="getMessage"
              ></el-button>
            </el-badge>
          </el-popover>
        </div>
        <div class="icon-dropdown">
          <el-dropdown>
            <!-- 头像 -->
            <el-button id="iconbtn" circle>
              <img
                class="icon"
                :src="'http://123.57.67.128:8000' + image"
                alt="用户头像"
              />
            </el-button>
            <!-- 头像下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="gotoProfile">
                <span>账号设置</span>
              </el-dropdown-item>
              <el-dropdown-item @click.native="gotoWelcome">
                <span>前往官网</span>
              </el-dropdown-item>
              <el-dropdown-item @click.native="logout" divided>
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div id="triangle-top-right"></div>
    </el-header>
    <!-- 页面主体区域 -->
    <el-main>
      <h3>帮助中心</h3>
      <div class="content">
        <div>
          <h4># 如何查看和修改我的个人信息？</h4>
          <span
            >登录后，将光标移至右上圆形头像处，在弹出的下拉框中选择“账号设置”即可访问个人页面。在个人页面中，您可以更改修改您的头像、昵称及密码。</span
          >
        </div>
        <div>
          <h4># 如何设置或更改文档权限？</h4>
          <span>在黑石文档中，您可以且仅可以设置由您所创建的文档权限。</span>
          <h5>方法一</h5>
          <span
            >将光标移至工作台界面文件右侧的“更多选项”图标，在弹出的下拉框中选择“权限更改”即可更改文档权限。</span
          >
          <h5>方法二</h5>
          <span>在文档编辑页中，点击“文档权限”按钮，即可更改文档权限。</span>
        </div>
        <div>
          <h4># 如何在文档中上传图片？</h4>
          <span
            >在文档编辑页中，点击文本编辑器右上“图片”图标，选择您想上传的图片即可。</span
          >
        </div>
        <div>
          <h4># 黑石支持文档模板功能吗？</h4>
          <span>黑石文档支持新建及选择模板功能。</span>
          <p></p>
          <span
            >在文档编辑页中，点击左上“保存为模板”按钮，您可以将当前文档中的内容存储为模板供下次使用；在当前有模板保存的情况下，点击左上“使用模板”按钮，并在弹窗中选择即可使用模板。</span
          >
        </div>
        <div>
          <h4># 如何加入或创建一个团队？</h4>
          <span
            >在工作台页面，点击左侧导航栏“团队空间”右侧的“加号（+）”，在出现的弹窗中即可选择加入或创建团队。</span
          >
        </div>
        <div>
          <h4># 如何在我的团队中添加协作者？</h4>
          <span>在目前版本的黑石中，并没有主动添加协作者的功能。</span>
          <h5>若您想加入一个团队</h5>
          <span
            >请阅读上方“如何加入或创建一个团队？”帮助后，搜索并添加您想加入的团队，征求团队管理者认同后方可加入。</span
          >
        </div>
        <div>
          <h4># 黑石支持实时共享协同文档吗？</h4>
          <span>在目前版本的黑石中，并不支持实时共享功能。</span>
          <p></p>
          <span
            >黑石文档协作功能支持且仅支持一人在线编辑文档，当文档出现“正在编辑”提示时，您需要等待编辑者保存文档后，方可编辑该文档。</span
          >
        </div>
      </div>
    </el-main>
    <el-footer>
      <div class="footer">
        <span>编写于</span>
        <span>黑石文档</span>
      </div>
    </el-footer>
  </el-container>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      // 存储数据------------------------------------------------------------
      image: '',
      // 通知信息数字框
      messageInfo: {
        messageNum: '',
        isHidden: false
      },
      // 通知信息列表
      messageList: []
    }
  },
  created() {
    // 获取头像
    // 获取通知
    this.getMessage()
    this.getImage()
  },
  methods: {
    // 头部导航栏---------------------------------------------------------------
    // 获取头像
    async getImage() {
      var token = window.sessionStorage.getItem('token')
      const { data: res } = await this.$http.get('/user/?token=' + token)
      this.image = res.image
    },
    // 未读消息变已读
    async readMessage(message) {
      var token = window.sessionStorage.getItem('token')
      var id = message.id
      var patchform = {
        status: 0
      }
      const { data: res } = await this.$http.patch(
        '/message/' + id + '/?token=' + token,
        patchform
      )
      if (res === '成功') {
        this.$message.success('消息已读')
        this.getMessage()
      } else {
        this.$message.error(res)
      }
    },
    // 同意通知
    async agreeMessage(message) {
      var group = message.group
      var token = window.sessionStorage.getItem('token')
      var putform = {
        user_id: message.senduser,
        decision: true
      }
      const { data: res } = await this.$http.put(
        '/group/' + group + '/?token=' + token,
        putform
      )
      if (res === '成功') {
        this.$message.success('该用户已加入您的团队')
        this.readMessage(message)
      } else {
        this.$message.err(res)
      }
    },
    // 拒绝通知
    async refuseMessage(message) {
      var group = message.group
      var token = window.sessionStorage.getItem('token')
      var putform = {
        user_id: message.senduser,
        decision: false
      }
      const { data: res } = await this.$http.put(
        '/group/' + group + '/?token=' + token,
        putform
      )
      if (res === '成功') {
        this.$message.success('已拒绝此申请')
        this.readMessage(message)
      } else {
        this.$message.err(res)
      }
    },
    // 获取通知!!!!!!!!!!!!!!!!!!!!!!!未完成!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    async getMessage() {
      this.messageList = []
      this.messageInfo.messageNum = ''
      var token = window.sessionStorage.getItem('token')
      const { data: res } = await this.$http.get('/message/?token=' + token)
      this.messageInfo.messageNum = res[0].count
      this.messageList = res
    },
    // 前往个人信息
    gotoProfile() {
      this.$router.push('/profile')
    },
    // 前往官网
    gotoWelcome() {
      this.$router.push('/')
    },
    goHome() {
      this.$router.push('/home')
    },
    // 退出登录!!!!!!!!!!!!!!!!!!!!!!!未完成!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    logout() {
      // 清除token
      window.sessionStorage.removeItem('token')
      // 跳转到/
      this.$router.push('/')
    }
  }
}
</script>
<style lang="less" scoped>
.el-container {
  width: 100vw;
  height: 200vh;
  margin: 0;
  padding: 0;
  position: absolute;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: whitesmoke;
}
.background {
  width: 100vw;
  opacity: 0.6;
}
.welcomebtn {
  width: 50px;
  height: 40px;
  position: fixed;
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
.navbar {
  width: 130px;
  height: 80px;
  position: fixed;
  top: 15px;
  right: 15px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  z-index: 99;
}
.item {
  width: 30px;
  height: 30px;
}
#bellbtn {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(50, 50, 50);
  border: 1px solid whitesmoke;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  cursor: default;
  transition: 0.1s linear;
  -webkit-transition: 0.1s linear;
}
#bellbtn:hover {
  background-color: white;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.12),
    inset 0 0 6px rgba(0, 0, 0, 0.04);
  transition: 0.2s linear;
  -webkit-transition: 0.2s linear;
}
#iconbtn {
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid rgb(224, 224, 224);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  transition: 0.2s linear;
  -webkit-transition: 0.2s linear;
}
.icon {
  width: 75px;
  height: 75px;
  border-radius: 100%;
}
#iconbtn:hover {
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.12),
    inset 0 0 6px rgba(0, 0, 0, 0.04);
  transition: 1s linear;
  -webkit-transition: 1s linear;
}
.el-dropdown-menu__item:not(.is-disabled):hover {
  color: rgb(50, 50, 50);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  background: linear-gradient(
    -20deg,
    rgb(245, 245, 245) 0%,
    rgb(235, 235, 235) 60%,
    rgb(245, 245, 245) 100%
  );
  transition: 0.2s linear;
  -webkit-transition: 0.2s linear;
}
#triangle-top-left {
  width: 0;
  height: 0;
  position: fixed;
  top: 0;
  left: 0;
  border-top: 200px solid white;
  border-right: 200px solid transparent;
  z-index: 98;
}
#triangle-top-right {
  width: 0;
  height: 0;
  position: fixed;
  top: 0;
  right: 0;
  border-top: 200px solid white;
  border-left: 200px solid transparent;
  z-index: 98;
}
.el-main {
  width: 40vw;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.content div {
  width: 90%;
  padding: 0 20px 30px 20px;
  margin: 5px 0;
  border-radius: 5px;
  opacity: 0.6;
  transition: 0.4s ease-in-out;
  -webkit-transition: 0.4s ease-in-out;
}
.content div:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  background-color: white;
  opacity: 1;
  transform: scale(1.02, 1.02);
  -webkit-transform: scale(1.02, 1.02);
  transition: 0.2s ease-in-out;
  -webkit-transition: 0.2s ease-in-out;
}
.footer {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  user-select: none;
}
.footer span:nth-child(1) {
  margin-right: 10px;
  color: rgb(167, 167, 167);
}
.footer span:nth-child(2) {
  font-weight: 600;
}
</style>
