<template>
  <el-container class="desktop-container">
    <!-- 头部区域-->
    <el-header class="nav">
      <div class="header-left">
        <div>
          <router-link to="/">
            <img src="../assets/logo.png" alt="金刚石文档logo" />
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
          <el-popover placement="bottom" width="200" trigger="click">
            <!-- 通知框 -->
            <div>
              <!-- 标题 -->
              <h3>通知</h3>

              <!-- 通知 -->
              <div v-for="item in messageList" :key="item.messageId">
                <!-- 通知内容 -->
                <div>
                  <span>
                    {{ item.content }}
                  </span>
                </div>
                <!-- 通知时间 -->
                <div>
                  <span>
                    {{ item.time }}
                  </span>
                </div>
                <!-- 按钮组 -->
                <div v-if="item.isConfirm">
                  <el-button
                    type="success"
                    icon="el-icon-check"
                    size="mini"
                    circle
                  ></el-button>
                  <el-button
                    type="danger"
                    icon="el-icon-close"
                    size="mini"
                    circle
                  ></el-button>
                </div>
              </div>
            </div>
            <!-- 通知数字标记 -->
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
                @click="showMessage"
              ></el-button>
            </el-badge>
          </el-popover>
        </div>

        <div class="nav-dropdown">
          <!-- 头像下拉菜单 -->
          <el-dropdown>
            <!-- 头像 -->
            <el-button class="nav-avatar" circle>
              <img src="../assets/avatar.png" alt="用户头像" />
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
                :index="'/space/' + team.id"
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
                <el-form-item label="空间ID" prop="spaceId">
                  <el-input v-model.number="joinSpaceForm.spaceId"></el-input>
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
      teamList: [
        {
          id: 1,
          teamName: '团队空间1'
        },
        {
          id: 2,
          teamName: '团队空间2'
        },
        {
          id: 6,
          teamName: '团队空间3'
        }
      ],

      // 通知信息
      messageInfo: {
        messageNum: 13,
        isHidden: false
      },

      // 通知列表
      messageList: [
        {
          messageId: 1,
          isConfirm: false,
          content: '发顺丰士大夫反对',
          time: '2020-08-10 12:11:11'
        },
        {
          messageId: 3,
          isConfirm: true,
          content: '发顺丰士大夫反对1',
          time: '2020-08-10 12:11:11'
        },
        {
          messageId: 2,
          isConfirm: false,
          content: '发顺丰士大夫反对2',
          time: '2020-08-10 12:11:11'
        }
      ],

      // 表单--------------------------------------------------------------------

      // 加入团队空间的表单对象
      joinSpaceForm: {
        // 空间ID
        spaceId: null
      },

      // 新建团队空间的表单对象
      createSpaceForm: {
        // 空间ID
        spaceName: ''
      },

      // 对话框的可见属性----------------------------------------------------------------

      // 控制添加空间框的显示
      addSpaceDialogVisible: false,

      // 验证规则----------------------------------------------------------------

      // 新建团队空间的验证规则对象
      createSpaceRules: {
        spaceName: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ]
      },
      // 加入团队空间的验证规则对象
      joinSpaceRules: {
        spaceId: [
          { required: true, message: 'ID不能为空', trigger: 'blur' },
          { type: 'number', message: '请输入数字ID', trigger: 'blur' }
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
    this.getMessage()
  },
  methods: {
    // 头部导航栏---------------------------------------------------------------

    // 获取通知
    getMessage() {},

    // 显示通知
    showMessage() {
      // 隐藏通知数字标记
      this.messageInfo.isHidden = true
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
      // window.sessionStorage.removeItem('token')
      // 跳转到/
      this.$router.push('/')
    },

    // 侧边栏---------------------------------------------------------------

    // 获取团队列表!!!!!!!!!!!!!!!!!!!!!!!未完成!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    async getTeamList() {
      // get请求
    },

    // 新建团队空间!!!!!!!!!!!!!!!!!!!!!!!未完成!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    createTeamSpace() {
      this.$refs.createSpaceRef.validate(valid => {
        // 校验失败
        if (!valid) return
        // 发起添加团队空间的网络请求
        // 判断是否创建成功
        // 创建失败if
        // 创建成功
        // 隐藏对话框
        this.addSpaceDialogVisible = false
        // 创建成功提示
        this.$message.success('创建团队空间成功')
        // 重新获取团队空间列表
        this.getTeamList()
      })
    },

    // 加入团队空间!!!!!!!!!!!!!!!!!!!!!!!未完成!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    joinTeamSpace() {
      this.$refs.joinSpaceRef.validate(valid => {
        // 校验失败
        if (!valid) return
        // 发起添加团队空间的网络请求
        // 判断是否添加成功
        // 添加失败if
        // 添加成功
        // 隐藏对话框
        this.addSpaceDialogVisible = false
        // 创建成功提示
        this.$message.success('创建团队空间成功')
        // 重新获取团队空间列表
        this.getTeamList()
      })
    },

    // 右侧---------------------------------------------------------------

    // 新建文档!!!!!!!!!!!!!!!!!!!!!!!未完成!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    createNewDoc() {
      // 发送请求
      // 获取新文档id
      // 跳转至文档页
      this.$router.push('/doc/1')
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
.search {
  width: 200px;
  height: 50px;
  margin: 0;
  padding: 0;
  margin-right: 10px;
  display: flex;
  align-items: center;
}
/deep/ .search .el-input__inner {
  width: 200px;
  height: 30px;
  color: rgb(85, 85, 85);
  font-size: 15px;
  border: none;
  border-radius: 30px;
  box-shadow: inset 0 0 3px rgb(124, 124, 124);
  transition: 0.1s linear;
  -webkit-transition: 0.1s linear;
}
/deep/ .el-input__inner:hover {
  box-shadow: inset 0 0 6px rgb(189, 189, 189);
  transition: 0.2s linear;
  -webkit-transition: 0.2s linear;
}
/deep/ .el-input__inner:focus {
  box-shadow: inset 0 0 10px rgb(165, 165, 165);
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
