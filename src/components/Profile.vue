<template>
  <el-container class="container">
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
    <el-main>
      <!-- 面包屑导航 -->
      <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/desktop' }"
            >桌面</el-breadcrumb-item
          >
          <el-breadcrumb-item>个人信息</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!-- 用户信息 -->
      <div class="box-card">
        <!-- 用户头像 -->
        <div class="avatar">
          <!-- 头像 -->
          <el-button>
            <img src="../assets/img/avatar2.png" alt="用户头像" />
          </el-button>
        </div>
        <!-- 分割线 -->
        <div class="divide"></div>
        <!-- 信息显示区 -->
        <div class="info">
          <!-- 昵称 -->
          <div class="nickname">
            <i class="el-icon-user"></i>
            <span>昵称</span>
            <el-input
              v-model="userInfo.nickname"
              placeholder="用户昵称"
              @change="changeNickname"
            ></el-input>
          </div>
          <!-- 密码 -->
          <div class="passwd">
            <i class="el-icon-lock"></i>
            <span>密码</span>
            <span>•••••••</span>
            <!-- 修改密码 -->
            <el-button type="text" @click="changePasswordDialogVisible = true"
              >修改密码</el-button
            >
          </div>
          <!-- 邮箱 -->
          <div class="emailbox">
            <i class="el-icon-message"></i>
            <span>邮箱</span>
            <span>{{ userInfo.email }}</span>
          </div>
          <!-- 用户名 -->
          <div class="username">
            <i class="el-icon-bank-card"></i>
            <span>用户名</span>
            <span>{{ userInfo.userName }}</span>
          </div>
          <!-- 用户id -->
          <div class="username">
            <i class="el-icon-postcard"></i>
            <span>账号ID</span>
            <span>{{ userInfo.userId }}</span>
          </div>
        </div>
      </div>

      <!-- 修改密码对话框 -->
      <el-dialog
        title="修改密码"
        :visible.sync="changePasswordDialogVisible"
        width="30%"
        @close="changePasswordDialogClosed"
        center
      >
        <!-- 内容主体区域 -->
        <el-form
          :model="passwordForm"
          :rules="changePasswordRules"
          ref="changePasswordRef"
        >
          <!-- 当前密码 -->
          <el-form-item prop="oldPassword">
            <el-input
              v-model="passwordForm.oldPassword"
              placeholder="当前密码"
              type="password"
            ></el-input>
          </el-form-item>
          <!-- 新密码 -->
          <el-form-item prop="newPassword1">
            <el-input
              v-model="passwordForm.newPassword1"
              placeholder="输入新密码"
              type="password"
            ></el-input>
          </el-form-item>
          <!-- 二次输入新密码 -->
          <el-form-item prop="newPassword2">
            <el-input
              v-model="passwordForm.newPassword2"
              placeholder="确认新密码"
              type="password"
            ></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="changePasswordDialogVisible = false"
            >取消</el-button
          >
          <el-button @click="changePassword">确定</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
export default {
  data() {
    // 验证两次密码一致的函数
    var checkPassword2 = (rule, value, callback) => {
      if (value !== this.passwordForm.newPassword1) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      // 存储数据---------------------------------------------------------------

      // 用户信息
      userInfo: {
        // 用户ID
        userId: '1222113',
        nickname: '张三342',
        userName: 'WE谢谢',
        email: '111@qq.com',
        password: ''
        // 头像
      },

      // 通知信息数字框
      messageInfo: {
        messageNum: '',
        isHidden: false
      },

      // 通知信息列表
      messageList: [],

      // 表单--------------------------------------------------------------------

      // 修改密码的表单对象
      passwordForm: {
        oldPassword: '',
        newPassword1: '',
        newPassword2: ''
      },

      // 对话框的可见属性--------------------------------------------------------------------

      // 修改密码对话框的可见属性
      changePasswordDialogVisible: false,

      // 验证规则--------------------------------------------------------------------

      // 修改密码的验证规则对象
      changePasswordRules: {
        // 验证旧密码是否合法
        oldPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        // 验证新密码是否合法
        newPassword1: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        // 验证二次新密码是否合法
        newPassword2: [
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
  created() {
    this.getMessage()
    // 加载用户信息
    this.getUserInfo()
  },
  methods: {
    // 头部--------------------------------------------------------------

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
      console.log(res)
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
        this.$message.err('加入失败')
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

    // 获取头像

    // 前往个人信息页
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

    // 主体部分--------------------------------------------------------------

    // 获取用户信息!!!!!!!!!!!!!!!!!!!!!!!未完成!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    async getUserInfo() {
      var token = window.sessionStorage.getItem('token')
      const { data: res } = await this.$http.get('/user/?token=' + token)
      // 存储的userInfo对象
      this.userInfo.userId = res.id
      this.userInfo.nickname = res.nickname
      this.userInfo.userName = res.username
      this.userInfo.email = res.email
      this.oldNickname = res.nickname
      this.userInfo.password = res.password
    },

    // 修改用户昵称!!!!!!!!!!!!!!!!!!!!!!!未完成!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    async changeNickname() {
      // 发送数据（此时用户信息中存储的是本地修改后的用户昵称，查看userInfo
      var token = window.sessionStorage.getItem('token')
      console.log(this.oldNickname)
      var patchform = {
        nickname: this.userInfo.nickname
      }
      const { data: res } = await this.$http.patch(
        '/user/?token=' + token,
        patchform
      )
      if (res === '修改失败') {
        this.$message.error(res)
        this.userInfo.nickname = this.oldNickname
      } else {
        this.$message.success('修改昵称成功')
        this.userInfo.nickname = res.nickname
      }
      // 返回是否成功以及用户昵称（改后昵称
      // 成功则消息提示成功
      // 失败则消息提示失败，并将用户昵称改为修改前的用户昵称
      // 消息提示（测试用，写函数时可直接复制到正确位置
      // 错误消息提示
      // 成功消息提示
    },

    // 修改密码!!!!!!!!!!!!!!!!!!!!!!!未完成!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    async changePassword() {
      this.$refs.changePasswordRef.validate(async valid => {
        // 校验失败
        if (!valid) return
        if (this.passwordForm.oldPassword !== this.userInfo.password) {
          this.$message.error('原密码错误')
          return
        } else if (
          this.passwordForm.oldPassword === this.passwordForm.newPassword1
        ) {
          this.$message.error('新密码与旧密码一致')
          return
        }
        var token = window.sessionStorage.getItem('token')
        var patchform = {
          password: this.passwordForm.newPassword1
        }
        const { data: res } = await this.$http.patch(
          '/user/?token=' + token,
          patchform
        )
        if (res === '修改失败') {
          this.$message.error(res)
        } else {
          this.$message.success('修改密码成功')
          this.changePasswordDialogVisible = false
        }
      })
    },

    // 辅助--------------------------------------------------------------

    // 监听新建团队空间对话框的关闭事件
    changePasswordDialogClosed() {
      // 重置对话框中输入框内容
      this.$refs.changePasswordRef.resetFields()
    }

    // 待完成--------------------------------------------------------------
    // 获取通知
    // 修改头像
  }
}
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  background-color: whitesmoke;
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
.box-card {
  width: 900px;
  height: 600px;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 45%;
  left: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
}
.avatar {
  width: 250px;
  height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.avatar button {
  width: 80px;
  height: 80px;
  margin: 0;
  padding: 0;
  border-radius: 100%;
  border: none;
}
.avatar img {
  width: 80px;
  height: 80px;
  margin: 0;
  padding: 0;
  border-radius: 100%;
}
.info {
  width: 600px;
  height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.info div {
  width: 450px;
  height: 40px;
  margin: 10px 0px;
  margin-left: 30px;
  font-size: 14px;
  line-height: 40px;
  display: flex;
  justify-content: start;
  align-items: center;
}
.info i {
  margin-right: 10px;
}
.info span {
  width: 100px;
}
/deep/ .info .nickname .el-input__inner {
  width: 200px;
  height: 40px;
  margin: 0;
  color: rgb(85, 85, 85);
  font-size: 14px;
  border: none;
  border-radius: 1px;
  box-shadow: inset 0 0 6px rgb(224, 224, 224);
  transition: 0.1s linear;
  -webkit-transition: 0.1s linear;
}
/deep/ .info .nickname .el-input__inner:focus {
  box-shadow: inset 0 0 9px rgb(192, 192, 192);
}
.info .passwd .el-button {
  margin-left: 45px;
}
.divide {
  width: 1px;
  height: 400px;
  margin-right: 70px;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0) 10%,
    rgb(85, 85, 85) 20%,
    rgb(85, 85, 85) 80%,
    rgba(0, 0, 0, 0) 90%,
    rgba(0, 0, 0, 0) 100%
  );
}
</style>
