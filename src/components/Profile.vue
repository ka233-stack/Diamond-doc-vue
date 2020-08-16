<template>
  <el-container>
    <!-- 头部区域-->
    <el-header>
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
          <el-popover placement="bottom" width="200" trigger="hover">
            <div>
              <h2>
                通知
              </h2>
              <el-link>默认链接</el-link>
            </div>
            <el-badge :value="12" slot="reference">
              <!-- 通知图标 -->
              <el-button icon="el-icon-bell" circle></el-button>
            </el-badge>
          </el-popover>
        </div>

        <div class="nav-dropdown">
          <!-- 头像下拉菜单 -->
          <el-dropdown>
            <!-- 头像 -->
            <el-button class="nav-avatar" circle>
              <img src="../assets/avatar2.png" alt="用户头像" />
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
      <el-card class="box-card">
        <!-- 用户头像 -->
        <div>
          <!-- 头像 -->
          <el-button class="nav-avatar" circle>
            <img src="../assets/avatar2.png" alt="用户头像" />
          </el-button>
        </div>
        <!-- 信息显示区 -->
        <div>
          <!-- 昵称 -->
          <div>
            <span class="el-icon-user">昵称</span>
            <el-input
              v-model="userInfo.nickname"
              placeholder="用户昵称"
              @change="changeNickname"
            ></el-input>
          </div>
          <!-- 密码 -->
          <div>
            <span class="el-icon-lock">密码</span>
            <span>•••••••</span>
            <!-- 修改密码 -->
            <el-button type="text" @click="changePasswordDialogVisible = true"
              >修改密码</el-button
            >
          </div>
          <!-- 邮箱 -->
          <div>
            <span class="el-icon-message">邮箱</span>
            <span>{{ userInfo.email }}</span>
          </div>
          <!-- 用户名 -->
          <div>
            <span class="el-icon-bank-card">用户名</span>
            <span>{{ userInfo.userName }}</span>
          </div>
          <!-- 用户id -->
          <div>
            <span class="el-icon-postcard">账号ID</span>
            <span>{{ userInfo.userId }}</span>
          </div>
        </div>
      </el-card>

      <!-- 修改密码对话框 -->
      <el-dialog
        title="修改密码"
        :visible.sync="changePasswordDialogVisible"
        width="30%"
        @close="changePasswordDialogClosed"
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
            >取 消</el-button
          >
          <el-button @click="changePassword">确 定</el-button>
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
      // 旧昵称
      oldNickname: '',
      // 用户信息
      userInfo: {
        // 用户ID
        userId: '',
        nickname: '',
        userName: '',
        email: '',
        password: ''
        // 头像
      },

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
    // 加载用户信息
    this.getUserInfo()
  },
  methods: {
    // 头部--------------------------------------------------------------

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

    // 获取用户信息
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
    changePassword() {
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

<style></style>
