<template>
  <div>
    <!-- 页面头部区域 -->
    <el-header class="nav">
      <!-- 页面头部左侧 -->
      <div class="header-left">
        <!-- 返回按钮 -->
        <el-button icon="el-icon-back" @click="backDashborad"></el-button>
        <!-- 新建文档按钮 -->
        <el-button
          icon="el-icon-document-add"
          @click="createNewDoc"
        ></el-button>
        <!-- 选择模板按钮 -->
        <el-button
          v-if="showType > 1"
          @click="
            getTemplate()
            templateDialogVisible = true
          "
          >选择模板</el-button
        >
        <!-- 保存为模板按钮 -->
        <el-button v-if="showType > 0" @click="saveTemplate"
          >保存为模板</el-button
        >
      </div>

      <!-- 页面头部中间:文档标题 -->
      <div>
        <h3>{{ docInfo.title }}</h3>
      </div>

      <!-- 页面头部右侧 -->
      <div class="header-right">
        <!-- 头像下拉菜单 -->
        <el-dropdown>
          <!-- 头像 -->
          <el-button class="nav-avatar">
            <img src="../assets/img/avatar.png" alt="头像" />
          </el-button>
          <el-dropdown-menu class="dropdown-menu" slot="dropdown">
            <el-dropdown-item @click.native="setAccount">
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

        <!-- 通知框 -->
        <el-popover placement="bottom" width="260" trigger="hover" title="通知">
          <!-- 滚动条 -->
          <el-scrollbar style="height: 360px;">
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

        <!-- 设置下拉菜单 -->
        <el-dropdown v-if="showType > 0">
          <!-- 设置 -->
          <el-button icon="el-icon-setting"></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="docInfoDialogVisible = true"
              >文档信息</el-dropdown-item
            >
            <el-dropdown-item
              v-if="deletePermission"
              @click.native="deleteDocDialogVisible = true"
              divided
              >删除</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>

        <!-- 分享按钮 -->
        <el-button class="share" @click="shareDoc">分享</el-button>
        <!-- 保存按钮 -->
        <el-button v-if="showType > 1" class="save">保存</el-button>
      </div>
    </el-header>

    <!-- 内容区域 -->
    <el-main>
      <!-- 滚动遮盖 -->

      <!-- 浏览模式滚动遮盖 -->
      <div class="cover" v-if="showType === 1">
        <div class="remind">您目前处于浏览模式</div>
        <div>
          <el-button class="switch" @click="switchMode">
            <p>编辑</p>
            <p>模式</p>
          </el-button>
        </div>
      </div>
      <!-- 编辑模式滚动遮盖 -->
      <div class="cover" v-else-if="showType === 2">
        <div class="remind">您目前处于编辑模式</div>
        <div>
          <el-button class="switch" @click="switchMode">
            <p>浏览</p>
            <p>模式</p>
          </el-button>
        </div>
      </div>
      <!-- 无权限模式 -->
      <div v-else>
        <!-- 页面主体区域 -->
        <div class="warn-icon"></div>
        <div class="auth-warn">您没有阅读此文档的权限</div>
      </div>

      <!-- 编辑器区域:编辑模式、浏览模式 -->
      <div class="editor" v-if="showType > 0">
        <el-card>
          <!-- 文档标题 -->
          <div>
            <h1 v-if="showType === 1">{{ docInfo.title }}</h1>
            <el-input
              v-else-if="showType === 2"
              v-model="newTitle"
              placeholder="请输入标题"
              @change="changeDocTitle"
            ></el-input>
          </div>
          <div>
            <!-- 图片上传组件辅助-->
            <el-upload
              action=""
              accept="image/jpg, image/jpeg, image/png, image/gif"
              :http-request="upload"
              :before-upload="beforeUploadImg"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              :show-file-list="false"
            >
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <!-- 编辑器 -->
            <quill-editor
              v-model="docInfo.content"
              :options="editorOption"
              ref="QuillEditor"
              @blur="onEditorBlur($event)"
              @focus="onEditorFocus($event)"
            >
            </quill-editor>
          </div>
        </el-card>
      </div>

      <!-- 文档评论区：浏览模式 -->
      <div class="comment-frame" v-if="showType === 1">
        <!-- 评论区头部 -->
        <div>
          <h3>评论</h3>
        </div>
        <!-- 编写评论区 -->
        <div class="comment-container">
          <div class="comment-input">
            <!-- 用户头像 -->
            <img src="../assets/img/avatar.png" alt="用户头像" />
            <!-- 评论输入框 -->
            <el-input
              type="textarea"
              placeholder="写下你的评论"
              v-model="comments"
              @input="change($event)"
            ></el-input>
            <!-- 评论按钮 -->
            <el-button @click="postComment">发布</el-button>
          </div>

          <!-- 评论帖子 -->
          <div class="inner-frame" v-for="item in commentList" :key="item.id">
            <!-- 分割线 -->
            <div class="cutline"></div>
            <!-- 用户信息 -->
            <div class="user-comment">
              <!-- 用户头像 -->
              <div class="user-info">
                <img src="../assets/img/avatar.png" alt="用户头像" />
              </div>
              <div class="comments">
                <!-- 用户昵称 -->
                <div class="user-id">{{ item.nickname }}</div>
                <!-- 用户评论 -->
                <div class="comment-content">{{ item.content }}</div>
                <!-- 时间信息 -->
                <div class="commenttime">{{ item.createtime }}</div>
              </div>
            </div>
          </div>
          <!-- 分割线 -->
          <div class="cutline"></div>
        </div>
      </div>
    </el-main>

    <!-- 模板框 -->
    <el-dialog
      title="我的模板"
      :visible.sync="templateDialogVisible"
      width="60%"
    >
      <!-- 我的模板 -->
      <el-table
        :data="templateList"
        max-height="350"
        :default-sort="{ prop: 'name', order: 'ascending' }"
      >
        <el-table-column prop="title" label="文件名" sortable width="180">
          <template slot-scope="scope">
            <!-- 文件名 -->
            <el-button @click.native="checkTemplate(scope.row)" type="text">
              {{ scope.row.name }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="模板ID" width="120" sortable>
        </el-table-column>
        <el-table-column
          prop="creater.nickname"
          label="创建者"
          width="120"
          sortable
        >
        </el-table-column>
        <el-table-column prop="createtime" label="创建时间" sortable>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button @click="useTemplate(scope.row)" size="small">
              <span>使用模板</span>
            </el-button>
            <el-button @click="deleteTemplate(scope.row)" size="small">
              <span>删除模板</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 分享文档对话框 -->
    <el-dialog
      title="分享文档链接"
      :visible.sync="shareDocDialogVisible"
      width="40%"
    >
      <!-- 输入框区域 -->
      <el-input v-model="shareDocForm.url" placeholder="文档链接"></el-input>
    </el-dialog>

    <!-- 文档信息框 -->
    <el-dialog
      title="文档信息"
      :visible.sync="docInfoDialogVisible"
      width="40%"
    >
      <!-- 文档ID -->
      <div>
        <span>文档ID</span>
        <span>{{ docInfo.owner }}</span>
      </div>
      <!-- 创建者 -->
      <div>
        <span>创建者</span>
        <span>{{ docInfo.owner }}</span>
      </div>
      <!-- 最后编辑者 -->
      <div>
        <span>最后编辑者</span>
        <span>{{ docInfo.lasteditor }}</span>
      </div>
      <!-- 最后编辑时间 -->
      <div>
        <span>最后编辑时间</span>
        <span>{{ docInfo.updatetime }}</span>
      </div>
    </el-dialog>

    <!-- 清空回收站对话框 -->
    <el-dialog
      title="确认清空回收站"
      :visible.sync="deleteDocDialogVisible"
      width="30%"
      center
    >
      <span>这将会删除回收站中所有文件！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDocDialogVisible = false">取 消</el-button>
        <el-button @click="deleteDoc">确 定</el-button>
      </span>
    </el-dialog>

    <el-footer>
      <div class="footer">
        <span>{{ showType > 0 ? '编写于' : '' }}</span>
        <span>金刚石文档</span>
      </div>
    </el-footer>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      // 存储数据------------------------------------------------------------

      // 文档显示模式（0：无权限；1：浏览模式；2：编辑模式）
      showType: 1,

      // 删除权限
      deletePermission: true,

      // 文档信息
      docInfo: {
        id: 12123,
        auth: 0,
        author: {
          id: 1,
          nickname: 'redal',
          username: 'redal',
          token: '2fd37206-ccf1-48c1-9da7-fa32829192cb'
        },
        createtime: '2020-08-13T03:14:18+08:00',
        updatetime: '2020-08-11 17:34:32',
        title: '1234567',
        content: '7@qq.cofwerffewrewrw分威风威风额m',
        group: null
      },

      // 通知信息数字框
      messageInfo: {
        messageNum: '',
        isHidden: false
      },

      // 通知信息列表
      messageList: [],

      // 评论列表
      commentList: [
        {
          id: 1,
          nickname: '用户名1',
          content: 'sdasdasdsa',
          createtime: '2020-08-11 17:34:32'
        },
        {
          id: 2,
          nickname: '用户名2',
          content: 'sdasdasdsa',
          createtime: '2020-08-11 17:34:32'
        }
      ],

      templateList: [
        {
          id: 1,
          name: '模板1',
          content: '123456',
          createtime: '2020-08-15T22:28:08+08:00',
          creater: {
            id: 1,
            nickname: 'redal'
          }
        }
      ],

      // 富文本编辑器---------------------------------------------------------------------

      // 表单---------------------------------------------------------------------
      newTitle: '1234567',

      // 分享文档链接对象
      shareDocForm: {
        url: ''
      },

      // 评论输入框
      comments: '',

      // 对话框的可见属性----------------------------------------------------------

      // 模板对话框的可见属性
      templateDialogVisible: false,

      // 分享对话框的可见属性
      shareDocDialogVisible: false,

      // 文档信息对话框的可见属性
      docInfoDialogVisible: false,

      // 删除文档对话框的可见属性
      deleteDocDialogVisible: false
    }
  },
  created() {},
  methods: {
    // 头部区域---------------------------------------------------------------

    // 回到工作台
    backDashborad() {
      // 询问是否保存
      // 跳转
      this.$router.push('/home')
    },

    // 新建文档
    createNewDoc() {},

    // 分享文档
    shareDoc() {
      // 传输
      var url = window.location.href
      this.shareDocForm.url = url
      this.shareDocDialogVisible = true
    },

    // 账号设置
    setAccount() {
      this.$router.push('/profile')
    },
    // 前往官网
    gotoWelcome() {
      this.$router.push('/')
    },
    // 获取帮助
    getHelp() {
      this.$router.push('/help')
    },
    // 退出登录
    logout() {
      // 清除token
      window.sessionStorage.removeItem('token')
      // 跳转到/
      this.$router.push('/')
    },

    // 删除文档
    deleteDoc() {
      // 弹窗
      this.$message.success('删除成功')
    },

    // 模板---------------------------------------------------------------

    // 获取模板
    getTemplate() {
      this.$message.success('获取模板成功')
    },

    // 保存为模板
    saveTemplate() {},

    // 查看模板
    checkTemplate() {},

    // 使用模板
    useTemplate(template) {},

    // 删除模板
    deletTemplate() {
      // 弹窗
      this.$message.success('删除成功')
    },

    // 通知---------------------------------------------------------------

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

    authorityJudge() {
      // 检查权限
      // 跳转
    },

    // 切换文档模式
    switchMode() {
      // 判断权限
      // 更改showType
      if (this.showType === 1) {
        this.showType = 2
      } else if (this.showType === 2) {
        this.showType = 1
      }
      this.$message.success('切换成功')
    },

    // 文档标题输入框区域---------------------------------------------------------------

    // 更改文档标题
    changeDocTitle() {
      this.$message.success('重命名成功')
    },

    // 富文本编辑器区域---------------------------------------------------------------

    // 失去焦点事件
    onEditorBlur(event) {
      if (this.showType === 1) {
        event.enable(false)
      } else {
        event.enable(true)
      }
    },

    // 获得焦点事件
    onEditorFocus(event) {
      if (this.showType === 1) {
        event.enable(false)
      } else {
        event.enable(true)
      }
    },

    // 上传图片前
    beforeUploadImg(res, file) {
      const isJPG =
        file.type === 'image/jpg' ||
        file.type === 'image/png' ||
        file.type === 'image/jpeg' ||
        file.type === 'image/gif'
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isJPG) {
        this.$message.error('支持JPG、PNG、GIF格式的图片，大小不得超过5M')
      }
      if (!isLt5M) {
        this.$message.error('文件最大不得超过5M')
      }
      return isJPG && isLt5M
    },

    // 上传图片成功
    uploadSuccess(res, file) {
      // 插入图片url？
      var quill = this.$refs.QuillEditor.quill
      var length = quill.getSelection().index
      // insertEmbed：插入内容
      quill.insertEmbed(length, 'image', res.url)
      quill.setSelection(length + 1)
    },

    // 上传图片失败
    uploadError(res, file) {
      this.$message.error('图片插入失败')
    },

    // 上传图片处理过程
    upload(req) {},

    // 评论区域---------------------------------------------------------------

    // 发表评论
    postComment() {}

    // 监听------------------------------------------------------------
  }
}
</script>

<style>
.el-textarea .el-textarea__inner {
  width: 100%;
  height: 80px;
  font-size: 14px;
  border-radius: 5px;
  outline: none;
  background-color: whitesmoke;
  resize: none;
}
.el-textarea .el-textarea__inner:focus {
  background: transparent;
  border-color: rgb(85, 85, 85);
}
</style>
<style scoped>
/* global css*/
.el-container {
  width: 100%;
  min-height: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  background-color: whitesmoke;
}
.el-header {
  width: 100%;
  margin: 0;
  padding: 0;
  position: fixed;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 99;
}
.nav {
  height: 50px !important;
  background-color: white;
  box-shadow: 0 0 5px rgb(214, 214, 214);
}
.header-left {
  width: 250px;
  height: 50px;
  margin: 0;
  margin-left: 10px;
  padding: 0;
  display: flex;
  justify-items: flex-start;
  align-items: center;
}
.nav .el-button {
  width: 30px;
  height: 30px;
  margin: 0 5px;
  padding: 0;
  color: black;
  border: none;
  border-radius: 1px;
  background-color: white;
  box-shadow: 1px 1px 1px rgb(219, 219, 219);
}
.nav .el-button:hover {
  background-color: rgb(248, 248, 248);
}
.header-right {
  width: 400px;
  height: 50px;
  margin: 0;
  margin-right: 10px;
  padding: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.header-right .share {
  width: 100px;
}
.nav-dropdown {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.header-right .nav-avatar {
  width: 35px;
  height: 35px;
  border-radius: 100%;
}
.nav-avatar img {
  width: 30px;
  height: 30px;
  border-radius: 100%;
}
.dropdown-menu {
  margin: 0;
  padding-top: 5px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.el-main {
  width: 100%;
  height: auto;
  margin: 0;
  padding: 0;
  padding-top: 90px;
  padding-bottom: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.cover {
  width: 100%;
  height: 87px;
  position: fixed;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: whitesmoke;
  z-index: 60;
}
.cover .remind {
  position: relative;
  top: 60px;
  color: rgb(129, 129, 129);
  font-size: 14px;
}
.cover .switch {
  width: 70px;
  height: 70px;
  position: relative;
  top: 70px;
  right: -550px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: black;
  border: none;
  border-radius: 1px;
  background-color: white;
  box-shadow: 0 1px 5px rgb(214, 214, 214);
}
.cover .switch:hover {
  background-color: rgb(248, 248, 248);
}
.cover .switch p {
  margin: 5px;
}
.editor {
  width: 900px;
  min-height: 1500px;
  margin: 0;
  padding: 0;
}
.el-card {
  width: 100%;
  min-height: 1500px;
  border: none;
  border-radius: 1px;
  box-shadow: 0 1px 5px rgb(214, 214, 214);
}
.el-footer {
  width: 100%;
  height: 50px !important;
  margin-top: 10px;
  position: relative;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.footer {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
}
.footer span:nth-child(1) {
  margin-right: 10px;
  color: rgb(167, 167, 167);
}
.footer span:nth-child(2) {
  font-weight: 600;
}

/* onlyRead css */

.el-card div {
  margin: 30px 20px;
}
.comment-frame {
  width: 50%;
  min-height: 150px;
  margin: 0;
  margin-top: 50px;
  margin-bottom: 10px;
}
.comment-frame img {
  width: 65px;
  height: 65px;
  margin: 0 20px;
  border-radius: 100%;
}
.comment-container {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
}
.comment-input {
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.comment-input .el-button {
  width: 60px;
  height: 80px;
  margin: 0 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 15px;
  border: none;
  border-radius: 5px;
  background-color: rgb(85, 85, 85);
  cursor: pointer;
  user-select: none;
}
.comment-input .el-button:hover {
  background-color: rgb(49, 49, 49);
  box-shadow: 0 0 3px rgb(49, 49, 49);
}
.comment-input .el-button:active {
  background-color: rgb(85, 85, 85);
  box-shadow: none;
}
.inner-frame {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
}
.cutline {
  width: 87%;
  height: 1px;
  margin-bottom: 30px;
  margin-left: 85px;
  background-color: rgb(226, 226, 226);
}
.user-comment {
  width: 100%;
  height: auto;
  display: flex;
}
.comments {
  width: 85%;
  min-height: 50px;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
}
.user-id {
  margin-bottom: 5px;
  color: rgb(85, 85, 85);
  font-weight: 600;
}
.comment-content {
  width: 100%;
  margin-bottom: 5px;
}
.commenttime {
  color: rgb(167, 167, 167);
}

/* onlyWrite css */
.header-right .save {
  width: 100px;
  color: white;
  background-color: rgb(85, 85, 85);
  box-shadow: none;
}
.header-right .save:hover {
  background-color: rgb(49, 49, 49);
  box-shadow: 0 0 3px rgb(49, 49, 49);
}
.header-right .save:active {
  background-color: rgb(85, 85, 85);
  box-shadow: none;
}

/* noneAuthority css */
.auth-warn {
  color: rgb(129, 129, 129);
}
</style>
