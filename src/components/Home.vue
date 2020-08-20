<template>
  <el-container class="outer-container">
    <img class="background" src alt="background" />
    <!-- 头部区域-->
    <el-header>
      <div class="welcomebtn" @click="gotoWelcome">
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
              <div class="notion" v-for="item in messageList" :key="item.id">
                <!-- 通知内容 -->
                <span>{{ item.content }}</span>
                <!-- 通知时间 -->
                <div class="notion-info">
                  <span>{{ item.createtime }}</span>
                  <!-- 确认、拒绝按钮 -->
                  <div class="notion-btn" v-if="item.category === 2">
                    <!-- 确认按钮 -->
                    <el-button
                      class="accept"
                      icon="el-icon-check"
                      circle
                      size="mini"
                      @click="agreeMessage(item)"
                    ></el-button>
                    <!-- 拒绝按钮 -->
                    <el-button
                      class="reject"
                      icon="el-icon-close"
                      circle
                      size="mini"
                      @click="refuseMessage(item)"
                    ></el-button>
                  </div>
                  <!-- 已读按钮 -->
                  <div class="notion-btn" v-else>
                    <!-- 确认按钮 -->
                    <el-button
                      class="accept"
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
              <el-dropdown-item @click.native="getHelp">
                <span>获取帮助</span>
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
    <el-container class="inner-container">
      <!-- 侧边栏区域 -->
      <el-aside width="205px">
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="whitesmoke"
          text-color="rgb(150, 150, 150)"
          active-text-color="rgb(85, 85, 85)"
          :router="true"
          :default-active="$route.path"
        >
          <!-- 工作台 -->
          <el-menu-item index="/dashboard">
            <i class="el-icon-files"></i>
            <span>工作台</span>
          </el-menu-item>
          <el-divider></el-divider>
          <!-- 我的桌面 -->
          <el-menu-item index="/desktop">
            <i class="el-icon-house"></i>
            <span>我的桌面</span>
          </el-menu-item>
          <!-- 团队空间一级菜单 -->
          <el-submenu index>
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <i class="el-icon-box"></i>
              <span>团队空间</span>
              <!-- 添加团队空间按钮 -->
              <el-button
                class="addmember"
                @click="addSpaceDialogVisible = true"
              >
                <i class="el-icon-plus"></i>
              </el-button>
            </template>
            <!-- 团队空间二级菜单 -->
            <el-menu-item-group>
              <el-menu-item
                v-for="team in teamList"
                :key="team.id"
                :index="'/space/' + team.teamId"
              >
                <span>{{ team.teamName }}</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!-- 回收站 -->
          <el-menu-item index="/trash">
            <i class="el-icon-delete"></i>
            <span>回收站</span>
          </el-menu-item>
          <!-- 分割线 -->
          <el-divider></el-divider>
          <!-- 区域3 -->
          <el-menu-item index="/help">
            <i class="el-icon-question"></i>
            <span>帮助</span>
          </el-menu-item>
        </el-menu>
        <!-- 添加团队空间对话框 -->
        <el-dialog
          title="添加团队空间"
          width="600px"
          :visible.sync="addSpaceDialogVisible"
          @close="addSpaceDialogClosed"
          :append-to-body="true"
        >
          <!-- 添加团队标签区域 -->
          <el-tabs>
            <!-- 新建空间 -->
            <el-tab-pane label="创建空间">
              <!-- 新建空间表单 -->
              <el-form
                :model="createSpaceForm"
                :rules="createSpaceRules"
                ref="createSpaceRef"
                label-width="100px"
              >
                <el-form-item label="空间名称" prop="spaceName">
                  <el-input v-model="createSpaceForm.spaceName"></el-input>
                </el-form-item>
              </el-form>
              <el-button @click="createTeamSpace">创建</el-button>
            </el-tab-pane>
            <!-- 加入空间 -->
            <el-tab-pane label="加入空间">
              <!-- 加入空间表单 -->
              <el-form
                :model="joinSpaceForm"
                :rules="joinSpaceRules"
                ref="joinSpaceRef"
                label-width="100px"
              >
                <el-form-item label="空间名称" prop="spaceName">
                  <el-input v-model="joinSpaceForm.spaceName"></el-input>
                </el-form-item>
              </el-form>
              <el-button @click="joinTeamSpace">加入</el-button>
            </el-tab-pane>
          </el-tabs>
        </el-dialog>
      </el-aside>
      <!-- 内容主体区域 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
        <!-- 右侧按钮区域 -->
        <div class="btnsarea">
          <el-button class="newdoc" @click="createNewDoc">
            <span>新建文档</span>
          </el-button>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      // 存储数据------------------------------------------------------------
      image: '',
      // 团队空间列表
      teamList: [],
      // 通知信息数字框
      messageInfo: {
        messageNum: '',
        isHidden: false
      },
      // 通知信息列表
      messageList: [],
      // 加入团队空间的表单对象
      joinSpaceForm: {
        // 空间ID
        spaceName: ''
      },
      // 新建团队空间的表单对象
      createSpaceForm: {
        // 空间ID
        spaceName: ''
      },
      // 辅助----------------------------------------------------------------
      // 控制添加空间框的显示
      addSpaceDialogVisible: false,
      // 新建团队空间的验证规则对象
      createSpaceRules: {
        spaceName: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ]
      },
      // 加入团队空间的验证规则对象
      joinSpaceRules: {
        spaceName: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ]
      }
      // 待完成--------------------------------------------------------------
      // 获取头像
      // 获取通知
      // 搜索文件
      // 弃用----------------------------------------------------------------
    }
  },
  created() {
    // 获取头像
    // 获取通知
    this.getTeamList()
    this.getMessage()
    this.getImage()
  },
  activated() {
    this.getTeamList()
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
    // 获取帮助!!!!!!!!!!!!!!!!!!!!!!!未完成!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    getHelp() {
      this.$router.push('/help')
    },
    // 退出登录!!!!!!!!!!!!!!!!!!!!!!!未完成!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    logout() {
      // 清除token
      window.sessionStorage.removeItem('token')
      // 跳转到/
      this.$router.push('/')
    },
    // 侧边栏---------------------------------------------------------------
    // 获取团队列表!!!!!!!!!!!!!!!!!!!!!!!未完成!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    async getTeamList() {
      // get请求
      this.teamList = []
      var token = window.sessionStorage.getItem('token')
      const { data: res } = await this.$http.get('/group/user/?token=' + token)
      var num = res.length
      for (var i = 0; i < num; i++) {
        var plus = {
          teamId: res[i].id,
          teamName: res[i].name
        }
        this.teamList.push(plus)
      }
    },
    // 新建团队空间!!!!!!!!!!!!!!!!!!!!!!!未完成!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    createTeamSpace() {
      this.$refs.createSpaceRef.validate(async valid => {
        // 校验失败
        if (!valid) return
        // 发起添加团队空间的网络请求
        // 判断是否创建成功
        // 创建失败if
        // 创建成功
        // 隐藏对话框
        var token = window.sessionStorage.getItem('token')
        var postform = {
          name: this.createSpaceForm.spaceName
        }
        const { data: res } = await this.$http.post(
          '/group/?token=' + token,
          postform
        )
        if (res === '小组名重复') {
          this.$message.error(res)
        } else {
          this.$message.success('创建团队空间成功')
          this.addSpaceDialogVisible = false
        }
        // 创建成功提示
        // 重新获取团队空间列表
        this.getTeamList()
      })
    },
    // 加入团队空间!!!!!!!!!!!!!!!!!!!!!!!未完成!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    joinTeamSpace() {
      this.$refs.joinSpaceRef.validate(async valid => {
        // 校验失败
        if (!valid) return
        // 发起添加团队空间的网络请求
        // 判断是否添加成功
        // 添加失败if
        // 添加成功
        // 隐藏对话框
        var token = window.sessionStorage.getItem('token')
        var postform = {
          category: '2',
          name: this.joinSpaceForm.spaceName
        }
        const { data: res } = await this.$http.post(
          '/message/?token=' + token,
          postform
        )
        if (res === '成功') {
          this.addSpaceDialogVisible = false
          this.$message.success('已发出申请')
        } else if (res === null) {
          this.$message.error('该小组不存在')
        } else {
          this.$message.error(res)
        }
        // 创建成功提示
        // 重新获取团队空间列表
        this.getTeamList()
      })
    },
    // 右侧---------------------------------------------------------------
    // 新建文档!!!!!!!!!!!!!!!!!!!!!!!未完成!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    async createNewDoc() {
      // 发送请求
      var website = window.location.hash
      var token = window.sessionStorage.getItem('token')
      var url = '/doc/?token=' + token
      if (
        website === '#/dashboard' ||
        website === '#/desktop' ||
        website === '#trash'
      ) {
        var postform = {
          title: '无标题',
          auth: 3
        }
      } else {
        var groupId = this.$route.params.id
        postform = {
          title: '无标题',
          auth: 3,
          group: groupId
        }
      }
      const { data: res } = await this.$http.post(url, postform)
      if (res === '请先登录') {
        this.$message.error(res)
      } else {
        var doc = res.id
        this.$router.push('/doc/' + doc)
      }
      // 获取新文档id
      // 跳转至文档页
    },
    // 辅助---------------------------------------------------------------
    // 监听新建团队空间对话框的关闭事件
    addSpaceDialogClosed() {
      this.$refs.createSpaceRef.resetFields()
      this.$refs.joinSpaceRef.resetFields()
    }
    // 待完成--------------------------------------------------------------
    // 获取通知
    // 搜索文件
  }
}
</script>
<style>
.el-submenu > .el-submenu__title .el-submenu__icon-arrow {
  position: relative;
  top: 5px;
  left: 10px;
  transform: rotateZ(-90deg);
  -webkit-transform: rotateZ(-90deg);
}
.el-submenu.is-opened > .el-submenu__title .el-submenu__icon-arrow {
  position: relative;
  top: 5px;
  left: 10px;
  transform: rotateZ(0deg) !important;
  -webkit-transform: rotateZ(0deg) !important;
}
.template-dropdown-menu {
  width: 160px !important;
  margin: 7px 0 !important;
  text-align: center;
}
.template-dropdown-menu img {
  height: 20px;
  margin-left: 15px;
  margin-right: 10px;
}
.template-dropdown-menu .el-dropdown-menu__item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.template-dropdown-menu .popper__arrow {
  border: none !important;
}
.template-dropdown-menu .popper__arrow::after {
  content: none !important;
}
</style>
<style lang="less" scoped>
.outer-container {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  position: absolute;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: whitesmoke;
  overflow: hidden;
}
.background {
  width: 100vw;
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
.navbar {
  width: 130px;
  height: 80px;
  position: absolute;
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
  position: absolute;
  top: 0;
  left: 0;
  border-top: 200px solid white;
  border-right: 200px solid transparent;
  z-index: 98;
}
#triangle-top-right {
  width: 0;
  height: 0;
  position: absolute;
  top: 0;
  right: 0;
  border-top: 200px solid white;
  border-left: 200px solid transparent;
  z-index: 98;
}
.inner-container {
  width: 90vw;
  height: 90vh;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
}
.el-aside {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: whitesmoke;
  border-right: 1px solid rgb(201, 201, 201);
}
.el-menu {
  border: none;
}
/deep/ .el-submenu__title,
/deep/ .el-menu-item {
  width: 205px;
  color: rgb(150, 150, 150) !important;
  background-color: whitesmoke !important;
  user-select: none;
}
.el-menu-item-group {
  max-height: 35vh;
  overflow-y: auto;
}
.el-menu-item-group .el-menu-item {
  height: 40px;
  line-height: 40px;
}
.el-menu-item-group .el-menu-item:hover {
  background-color: rgb(230, 230, 230) !important;
}
.el-menu-item.is-active {
  color: rgb(50, 50, 50) !important;
  font-weight: 600;
}
.el-divider {
  width: 180px !important;
  height: 1px !important;
  background: linear-gradient(
    to right,
    whitesmoke 0%,
    rgb(201, 201, 201) 10%,
    rgb(201, 201, 201) 100%
  );
  box-shadow: none;
}
.addmember {
  width: 15px;
  height: 15px;
  margin: 0;
  padding: 0;
  position: relative;
  top: 0;
  left: 60px;
  background-color: rgb(150, 150, 150);
  border: none;
  border-radius: 0;
  transform: rotateZ(45deg);
  -webkit-transform: rotateZ(45deg);
}
.addmember i {
  width: 15px;
  height: 15px;
  position: relative;
  top: -1px;
  font-size: 14px;
  color: whitesmoke;
  transform: rotateZ(45deg);
  -webkit-transform: rotateZ(45deg);
}
.addmember:hover {
  background-color: rgb(150, 150, 150);
}
.addmember:hover i {
  color: whitesmoke;
}
.addmember:active {
  background-color: rgb(100, 100, 100);
}
/deep/ .el-dialog .el-tabs__item {
  color: rgb(150, 150, 150);
}
/deep/ .el-dialog .el-tabs__item:hover {
  color: rgb(85, 85, 85);
}
/deep/ .el-dialog .el-tabs__item.is-active {
  color: rgb(50, 50, 50);
  font-weight: 600;
}
/deep/ .el-dialog .el-tabs__active-bar {
  background-color: rgb(50, 50, 50);
}
/deep/ .el-dialog .el-input__inner {
  width: 350px;
  color: rgb(85, 85, 85);
  font-size: 15px;
  border: none;
  border-radius: 1px;
  box-shadow: inset 0 0 6px rgb(224, 224, 224);
  transition: 0.1s linear;
  -webkit-transition: 0.1s linear;
}
/deep/ .el-dialog .el-input__inner:focus {
  box-shadow: inset 0 0 8px rgb(189, 189, 189);
}
.el-dialog .el-button {
  width: 100px;
  height: 40px;
  position: absolute;
  top: 0;
  right: 0;
  color: white;
  font-size: 16px;
  letter-spacing: 2px;
  text-indent: 2px;
  border: none;
  border-radius: 1px;
  background: linear-gradient(
    -20deg,
    rgb(50, 50, 50) 0%,
    rgb(70, 70, 70) 60%,
    rgb(50, 50, 50) 100%
  );
}
.el-dialog .el-button:hover {
  color: white;
}
.el-dialog .el-button:active {
  background: linear-gradient(
    -20deg,
    rgb(85, 85, 85) 0%,
    rgb(100, 100, 100) 60%,
    rgb(85, 85, 85) 100%
  );
  box-shadow: none;
}
/deep/ .el-dialog__headerbtn .el-dialog__close {
  color: rgb(150, 150, 150);
  font-weight: 600;
}
/deep/ .el-dialog__headerbtn .el-dialog__close:hover {
  color: rgb(150, 150, 150);
  font-weight: 600;
}
/deep/ .el-dialog__headerbtn .el-dialog__close:active {
  color: rgb(50, 50, 50);
  font-weight: 600;
  transform: translateY(2px);
  -webkit-transform: translateY(2px);
}
.el-main {
  background-color: whitesmoke;
}
.btnsarea {
  width: 160px;
  height: 40px;
  position: absolute;
  top: 24px;
  right: 244px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.newdoc {
  width: 160px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 1px;
  text-indent: 1px;
  border: none;
  border-radius: 0;
  background: linear-gradient(
    -20deg,
    rgb(50, 50, 50) 0%,
    rgb(70, 70, 70) 60%,
    rgb(50, 50, 50) 100%
  );
}
.newdoc:hover {
  color: white;
  background: linear-gradient(
    -20deg,
    rgb(40, 40, 40) 0%,
    rgb(60, 60, 60) 40%,
    rgb(40, 40, 40) 100%
  );
}
.newdoc:focus {
  color: white;
  background: linear-gradient(
    -20deg,
    rgb(40, 40, 40) 0%,
    rgb(60, 60, 60) 40%,
    rgb(40, 40, 40) 100%
  );
}
.notion {
  padding: 5px 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  border-bottom: 1px solid rgb(221, 221, 221);
}
.notion-info {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgb(201, 201, 201);
  font-size: 12px;
}
.notion-btn .el-button {
  width: 20px;
  height: 20px;
  margin: 0 3px;
  padding: 0;
  color: rgb(201, 201, 201);
  background-color: white;
  border: 1px solid rgb(201, 201, 201);
  transition: 0.1s ease-in-out;
  -webkit-transition: 0.1s ease-in-out;
}
.notion-btn .el-button:focus {
  color: rgb(201, 201, 201);
  background-color: white;
  border: 1px solid rgb(201, 201, 201);
}
.notion-btn .el-button:active {
  transform: translateY(2px);
  -webkit-transform: translateY(2px);
  transition: 0.1s linear;
  -webkit-transition: 0.1s linear;
}
.el-button.accept:hover {
  color: white;
  background-color: rgb(114, 175, 114);
  border: 1px solid rgb(114, 175, 114);
  transition: 0.2s ease-in-out;
  -webkit-transition: 0.2s ease-in-out;
}
.el-button.reject:hover {
  color: white;
  background-color: rgb(214, 100, 100);
  border: 1px solid rgb(214, 100, 100);
  transition: 0.2s ease-in-out;
  -webkit-transition: 0.2s ease-in-out;
}
</style>
