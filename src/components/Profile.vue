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
            <el-button type="text" @click="changeDialogVisible = true"
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
        <!-- 修改密码对话框 -->
        <el-dialog
          title="修改密码"
          :visible.sync="changeDialogVisible"
          width="30%"
          @close="changeDialogClosed"
        >
          <!-- 内容主体区域 -->
          <el-form
            :model="passwordDialog"
            :rules="changePasswordRules"
            ref="changePasswordRef"
          >
            <!-- 当前密码 -->
            <el-form-item prop="oldPassword">
              <el-input
                v-model="passwordDialog.oldPassword"
                placeholder="当前密码"
                type="password"
              ></el-input>
            </el-form-item>
            <!-- 新密码 -->
            <el-form-item prop="newPassword1">
              <el-input
                v-model="passwordDialog.newPassword1"
                placeholder="输入新密码"
                type="password"
              ></el-input>
            </el-form-item>
            <!-- 二次输入新密码 -->
            <el-form-item prop="newPassword2">
              <el-input
                v-model="passwordDialog.newPassword2"
                placeholder="确认新密码"
                type="password"
              ></el-input>
            </el-form-item>
          </el-form>
          <!-- 底部区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="changeDialogVisible = false">取 消</el-button>
            <el-button @click="changePassword">确 定</el-button>
          </span>
        </el-dialog>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    // 验证两次密码一致的函数
    var checkPassword2 = (rule, value, callback) => {
      if (value !== this.passwordDialog.newPassword1) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      // 用户信息
      userInfo: {
        // 用户ID
        userId: '1222113',
        nickname: '张三342',
        userName: 'WE谢谢',
        email: '111@qq.com'
      },
      // 修改密码对话框的可见属性
      changeDialogVisible: false,
      // 修改密码的表单对象
      passwordDialog: {
        oldPassword: '',
        newPassword1: '',
        newPassword2: ''
      },
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
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' },
          { validator: checkPassword2, trigger: 'blur' }
        ]
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 账号设置
    gotoProfile() {
      this.$router.push('/profile')
    },
    // 前往官网
    gotoWelcome() {
      this.$router.push('/')
    },
    // 获取帮助
    getHelp() {
      this.$router.push('/')
    },
    // 退出登录
    logout() {
      // 清除token
      // window.sessionStorage.removeItem('token')
      // 跳转到/
      this.$router.push('/')
    },
    // 更改用户昵称
    changeNickname() {
      // 消息提示
      this.$message({
        showClose: true,
        message: '更改昵称成功',
        type: 'success'
      })
    },
    // 修改密码
    changePassword() {
      this.$refs.changePasswordRef.validate(valid => {
        // 校验失败
        if (!valid) return
        // 判断合法
        // 发送数据并接收返回信息
        // 修改密码失败弹窗提示(element-ui Message)
        // 修改密码成功
        this.changeDialogVisible = false
        // 修改密码成功提示
        this.$message({
          showClose: true,
          message: '修改密码成功',
          type: 'success'
        })
      })
    },
    // 监听新建团队空间对话框的关闭事件
    changeDialogClosed() {
      this.$refs.changePasswordRef.resetFields()
    }
  }
}
</script>

<style></style>
