<template>
  <el-container class="desktop-container">
    <!-- 头部区域-->
    <el-header class="nav">
      <div class="header-left">
        <div>
          <router-link to="/">
            <img src="../assets/img/logo.png" alt="金刚石文档logo" />
          </router-link>
        </div>
        <div>
          <router-link to="/">
            <span>金刚石文档</span>
          </router-link>
        </div>
      </div>

      <div class="header-right">
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
                icon="el-icon-bell"
                circle
                @click="getMessage"
              ></el-button>
            </el-badge>
          </el-popover>
        </div>

        <div class="nav-dropdown">
          <!-- 头像下拉菜单 -->
          <el-dropdown>
            <!-- 头像 -->
            <el-button class="nav-avatar" circle>
              <img src="../assets/img/avatar.png" alt="用户头像" />
            </el-button>
            <el-dropdown-menu class="dropdown-menu" slot="dropdown">
              <el-dropdown-item @click.native="gotoProfile">
                <span>账号设置</span>
              </el-dropdown-item>
              <el-dropdown-item @click.native="gotoWelcome">
                <span>前往官网</span>
              </el-dropdown-item>
              <el-dropdown-item @click.native="getHelp">
                <span>获取帮助</span>
              </el-dropdown-item>
              <el-dropdown-item @click.native="logout">
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </el-header>

    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside width="250px">
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="rgb(85, 85, 85)"
          text-color="white"
          active-text-color="rgb(85, 85, 85)"
          :router="true"
          :default-active="$route.path"
        >
          <!-- 工作台 -->
          <el-menu-item index="/dashboard">
            <i class="el-icon-files"></i>
            <span>工作台</span>
          </el-menu-item>

          <!-- 分割线 -->
          <el-divider></el-divider>

          <!-- 我的桌面 -->
          <el-menu-item index="/desktop">
            <i class="el-icon-house"></i>
            <span>我的桌面</span>
          </el-menu-item>

          <!-- 团队空间一级菜单 -->
          <el-submenu index="">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-box"></i>
              <!-- 文本 -->
              <span>团队空间</span>
            </template>

            <!-- 团队空间二级菜单 -->
            <el-menu-item-group>
              <el-menu-item
                v-for="team in teamList"
                :key="team.id"
                :index="'/space/' + team.teamId"
              >
                <!-- 文本 -->
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
          <el-menu-item index="5">
            <i class="el-icon-question"></i>
            <span>帮助</span>
          </el-menu-item>
        </el-menu>

        <!-- 添加团队空间按钮 -->
        <el-button class="addmember" @click="addSpaceDialogVisible = true">
          <i class="el-icon-plus"></i>
        </el-button>

        <!-- 添加团队空间对话框 -->
        <el-dialog
          title="添加团队空间"
          :visible.sync="addSpaceDialogVisible"
          width="40%"
          @close="addSpaceDialogClosed"
        >
          <!-- 添加团队标签区域 -->
          <el-tabs>
            <!-- 新建空间 -->
            <el-tab-pane label="新建空间">
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

              <!-- 按钮 -->
              <div>
                <el-button @click="addSpaceDialogVisible = false"
                  >取 消</el-button
                >
                <el-button @click="createTeamSpace">确 定</el-button>
              </div>
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

              <!-- 按钮 -->
              <div>
                <el-button @click="addSpaceDialogVisible = false"
                  >取 消</el-button
                >
                <el-button @click="joinTeamSpace">确 定</el-button>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-dialog>
      </el-aside>

      <!-- 内容主体区域 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>

        <!-- 右侧按钮区域 -->
        <div>
          <el-button class="newdoc" @click="createNewDoc">
            <span>新建文档</span>
          </el-button>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
// export 表示导出,在自定义组件里面使用export default导出
export default {
  components: {},
  data() {
    return {
      // 存储数据------------------------------------------------------------

      // 团队空间列表
      teamList: [],

      // 通知信息数字框
      messageInfo: {
        messageNum: '',
        isHidden: false
      },

      // 通知信息列表
      messageList: [
      ],

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
  },
  methods: {
    // 头部导航栏---------------------------------------------------------------

    // 未读消息变已读
    async readMessage(message) {
      var token = window.sessionStorage.getItem('token')
      var id = message.id
      var patchform = {
        status: 0
      }
      const { data: res } = await this.$http.patch('/message/' + id + '/?token=' + token, patchform)
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
      const { data: res } = await this.$http.put('/group/' + group + '/?token=' + token, putform)
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
      const { data: res } = await this.$http.put('/group/' + group + '/?token=' + token, putform)
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
      this.$router.push('/')
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
      var au = 2
      if (
        website === '#/dashboard' ||
        website === '#/desktop' ||
        website === '#trash'
      ) {
        au = 0
      }
      var token = window.sessionStorage.getItem('token')
      var postform = {
        title: '无标题',
        auth: au
      }
      // 团队默认权限2：他人可读+评论； 个人默认权限0：私密文档
      const { data: res } = await this.$http.post(
        '/doc/?token=' + token,
        postform
      )
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
<style lang="less" scoped>
.desktop-container {
  width: 100%;
  height: 100%;
  background-color: white;
}
.el-header {
  margin: 0;
  padding: 0;
  background-color: white;
  display: flex;
  justify-content: space-between;
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
.header-left .router-link-active {
  color: rgb(85, 85, 85);
  text-decoration: none;
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

.item {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.item .el-button {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(124, 124, 124);
  border: solid 1px rgb(124, 124, 124);
}
.item .el-button:hover {
  background-color: whitesmoke;
}
.nav-dropdown {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.nav-avatar {
  width: 30px;
  height: 30px;
  margin: 0;
  padding: 0;
  border: none;
  background-color: transparent;
}
.nav-avatar img {
  width: 30px;
  height: 30px;
  border-radius: 100%;
  border: solid 1px rgb(124, 124, 124);
}
.dropdown-menu {
  margin: 0;
  padding-top: 5px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.el-aside {
  padding-top: 20px;
  background-color: rgb(85, 85, 85);
  .el-menu {
    border-right: none;
  }
}
.el-menu-item.is-active {
  background-color: whitesmoke !important;
}
.addmember {
  width: 20px;
  height: 20px;
  margin: 0;
  padding: 0;
  position: fixed;
  top: 248px;
  left: 180px;
  color: rgb(143, 143, 143);
  background-color: transparent;
  border-radius: 100%;
  border-color: rgb(143, 143, 143);
}
.el-main {
  background-color: whitesmoke;
}
.newdoc {
  width: 200px;
  height: 50px;
  margin-top: 20px;
  position: absolute;
  top: 50px;
  right: 50px;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 1px;
  background-color: rgb(85, 85, 85);
}
</style>
