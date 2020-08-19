<template>
  <el-container>
    <img class="background" src alt="background" />
    <!-- 头部区域-->
    <el-header>
      <div class="homebtn" @click="goHome">
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
                :src="'http://127.0.0.1:8000' + myImage"
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
    <el-main>
      <!-- 用户信息 -->
      <div class="box-card">
        <!-- 用户头像 -->
        <div class="avatar">
          <!-- 头像 -->
          <el-upload
            v-if="isSelf"
            action="http://127.0.0.1:8000/upload/"
            :show-file-list="false"
            :on-success="uploadSuccess"
            :before-upload="beforeAvatarUpload"
            :on-error="uploadError"
            name="img"
            accept="image/jpeg,image/jpg,image/png"
          >
            <img
              :src="'http://127.0.0.1:8000' + userInfo.image"
              alt="用户头像"
            />
          </el-upload>
          <div v-if="isSelf">
            <span>点击头像可修改（支持jpg、png格式）</span>
          </div>
          <div v-else>
            <img
              :src="'http://127.0.0.1:8000' + userInfo.image"
              alt="用户头像"
            />
          </div>
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
              v-if="isSelf"
              v-model="userInfo.nickname"
              placeholder="用户昵称"
              @change="changeNickname"
            ></el-input>
            <span v-else>{{ userInfo.nickname }}</span>
          </div>
          <!-- 密码 -->
          <div class="passwd">
            <i class="el-icon-lock"></i>
            <span>密码</span>
            <span>•••••••</span>
            <!-- 修改密码 -->
            <el-button
              v-if="isSelf"
              type="text"
              @click="changePasswordDialogVisible = true"
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
        width="500px"
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
        password: '',
        image: ''
        // 头像
      },
      // 上方头像
      myImage: '',

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
      },

      // 辅助---------------------------------------------------------------
      isSelf: false
    }
  },
  created() {
    this.checkSelf()
    this.getMessage()
    // 加载用户信息
    this.getUserInfo()
  },
  methods: {
    // 查看是否是本人
    checkSelf() {
      var website = window.location.hash
      if (website === '#/profile') {
        this.isSelf = true
      } else {
        this.isSelf = false
      }
    },
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
      this.checkSelf()
      this.getMessage()
      // 加载用户信息
      this.getUserInfo()
    },
    // 前往官网
    gotoWelcome() {
      this.$router.push('/')
    },
    // 获取帮助!!!!!!!!!!!!!!!!!!!!!!!未完成!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    getHelp() {
      this.$router.push('/help')
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
    },
    // 主体部分--------------------------------------------------------------
    // 获取用户信息!!!!!!!!!!!!!!!!!!!!!!!未完成!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    async getUserInfo() {
      var token = window.sessionStorage.getItem('token')
      if (!this.isSelf) {
        var sbId = this.$route.params.id
        const { data: res } = await this.$http.get('/user/' + sbId)
        this.userInfo.userId = res.id
        this.userInfo.nickname = res.nickname
        this.userInfo.userName = res.username
        this.userInfo.email = res.email
        this.userInfo.image = res.image
        // 获取自己头像
        const { data: myres } = await this.$http.get('/user/?token=' + token)
        this.myImage = myres.image
      } else {
        const { data: res } = await this.$http.get('/user/?token=' + token)
        // 存储的userInfo对象
        this.userInfo.userId = res.id
        this.userInfo.nickname = res.nickname
        this.userInfo.userName = res.username
        this.userInfo.email = res.email
        this.oldNickname = res.nickname
        this.userInfo.password = res.password
        this.userInfo.image = res.image
        this.myImage = res.image
      }
    },

    // 修改用户头像
    // 上传照片前的校验
    beforeAvatarUpload(file) {
      var testmsg = /^image\/(jpeg|png|jpg)$/.test(file.type)
      // 图片大小不超过2MB
      const isLt4M = file.size / 1024 / 1024 <= 4
      if (!testmsg) {
        this.$message.error('仅支持jpg、png格式')
        return
      }
      if (!isLt4M) {
        this.$message.error('图片大小不能超过 4M')
        return
      }
      return testmsg && isLt4M
    },

    // 上传成功
    async uploadSuccess(res, file, fileList) {
      var token = window.sessionStorage.getItem('token')
      var patchform = {
        image: res.url
      }
      const { data: res3 } = await this.$http.patch(
        '/user' + '/?token=' + token,
        patchform
      )
      if (res3 === '修改失败') {
        this.$message.error('修改失败')
      } else {
        this.$message.success('上传成功')
        this.getUserInfo()
      }
    },

    // 上传失败
    uploadError(err, file) {
      this.$message.error(err)
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
.el-container {
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
.homebtn {
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
.homebtn:hover {
  transform: scale(1.05, 1.05);
  -webkit-transform: scale(1.05, 1.05);
  transition: 0.1s ease-in;
  -webkit-transition: 0.1s ease-in;
}
.homebtn:hover #bars {
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
.avatar-remind {
  position: absolute;
  top: 350px;
  left: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: rgb(150, 150, 150);
  font-size: 12px;
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
  background-color: rgb(201, 201, 201);
}
/deep/ .el-dialog .el-input__inner {
  width: 450px;
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
</style>
