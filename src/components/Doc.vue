<template>
  <el-container>
    <!-- 页面头部区域 -->
    <el-header>
      <div class="welcomebtn" @click="backDashborad">
        <div id="bars"></div>
        <div id="bars"></div>
        <div id="bars"></div>
      </div>
      <div id="triangle-top-left"></div>
      <div class="btnsarea">
        <div class="leftarea">
          <!-- 新建文档按钮 -->
          <el-button
            class="d_newdoc"
            icon="el-icon-document-add"
            @click="createNewDoc"
          ></el-button>
          <!-- 选择模板按钮 -->
          <el-button
            class="choosetemp"
            v-if="showType > 1"
            @click="
              getTemplate()
              templateDialogVisible = true
            "
            >选择模板</el-button
          >
          <!-- 保存为模板按钮 -->
          <el-button class="savetemp" v-if="showType > 0" @click="saveTemplate"
            >保存为模板</el-button
          >
        </div>
        <div class="doctitle">
          <span>{{ docInfo.title }}</span>
        </div>
        <div class="rightarea">
          <!-- 设置下拉菜单 -->
          <el-dropdown v-if="showType > 0">
            <!-- 设置 -->
            <el-button class="morebtn" icon="el-icon-more"></el-button>
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
          <el-button class="share" v-if="showType > 0" @click="shareDoc"
            >分享</el-button
          >
          <!-- 保存按钮 -->
          <el-button class="save" v-if="showType === 2" @click="saveDoc"
            >保存</el-button
          >
        </div>
      </div>
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
                :src="'http://123.57.67.128:8000' + imgsrc"
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
    <!-- 滚动遮盖 -->
    <!-- 浏览模式滚动遮盖 -->
    <div class="cover toobar-cover" v-if="showType === 1">
      <div class="remind">您目前处于浏览模式</div>
      <div>
        <el-button class="switch" @click="editMode">
          <img src="../assets/img/switch.png" alt="switch" />
          <p>切换为编辑模式</p>
        </el-button>
      </div>
    </div>
    <!-- 编辑模式滚动遮盖 -->
    <div class="cover" v-else-if="showType === 2">
      <div class="remind">您目前处于编辑模式</div>
      <div>
        <el-button class="switch" @click="checkMode">
          <img src="../assets/img/switch.png" alt="switch" />
          <p>切换为浏览模式</p>
        </el-button>
      </div>
      <div class="toolbar-cover"></div>
    </div>
    <!-- 无权限模式 -->
    <div class="na-div" v-else>
      <img class="warn-icon" src="../assets/img/lock.png" alt="lock" />
      <div class="auth-warn">您没有阅读此文档的权限</div>
    </div>
    <!-- 内容区域 -->
    <el-main>
      <!-- 编辑器区域:编辑模式、浏览模式 -->
      <div v-if="showType > 0">
        <div class="paper">
          <div class="editarea">
            <!-- 文档标题 -->
            <div class="titlebar">
              <h2 v-if="showType === 1">{{ docInfo.title }}</h2>
              <el-input
                v-else-if="showType === 2"
                v-model="newTitle"
                placeholder="请输入标题"
                @change="changeDocTitle"
              ></el-input>
            </div>
            <div>
              <!-- 编辑器 -->
              <quill-editor
                v-model="docInfo.content"
                :options="quillOption"
                ref="QuillEditor"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
              ></quill-editor>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <span>{{ showType > 0 ? '编写于' : '' }}</span>
        <span>黑石文档</span>
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
            <img :src="'http://123.57.67.128:8000' + imgsrc" alt="用户头像" />
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
                <img
                  :src="'http://123.57.67.128:8000' + item.commenter.image"
                  alt="用户头像"
                  @click="jumpto(item.commenter.id)"
                />
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
      width="1000px"
    >
      <!-- 我的模板 -->
      <el-table
        :data="templateList"
        max-height="350"
        :default-sort="{ prop: 'name', order: 'ascending' }"
      >
        <el-table-column
          prop="name"
          label="文件名"
          sortable
          width="200"
          align="center"
          header-align="center"
        ></el-table-column>
        <el-table-column
          prop="id"
          label="模板ID"
          sortable
          width="150"
          align="center"
          header-align="center"
        ></el-table-column>
        <el-table-column
          prop="creater.nickname"
          label="创建者"
          sortable
          width="200"
          align="center"
          header-align="center"
        ></el-table-column>
        <el-table-column
          prop="createtime"
          label="创建时间"
          sortable
          width="200"
          align="center"
          header-align="center"
        ></el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button
              class="tempbtn"
              @click="useTemplate(scope.row)"
              size="small"
            >
              <span>使用模板</span>
            </el-button>
            <el-button
              class="tempbtn"
              @click="deleteTemplate(scope.row)"
              size="small"
            >
              <span>删除模板</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 分享文档对话框 -->
    <el-dialog
      class="sharelink"
      title="分享文档链接"
      :visible.sync="shareDocDialogVisible"
      width="500px"
    >
      <!-- 输入框区域 -->
      <el-input v-model="shareDocForm.url" placeholder="文档链接"></el-input>
    </el-dialog>
    <!-- 文档信息框 -->
    <el-dialog
      title="文档信息"
      :visible.sync="docInfoDialogVisible"
      width="600px"
    >
      <!-- 文档ID -->
      <div class="infolog">
        <h4>文档ID</h4>
        <span>{{ docInfo.id }}</span>
        <h4>创建者</h4>
        <span>{{ docInfo.author.nickname }}</span>
        <h4>最后编辑者</h4>
        <span>{{ docInfo.lasteditor.nickname }}</span>
        <h4>最后编辑时间</h4>
        <span>{{ docInfo.updatetime }}</span>
      </div>
    </el-dialog>
    <!-- 清空回收站对话框 -->
    <el-dialog
      class="deletelog"
      title="确认删除当前文件"
      :visible.sync="deleteDocDialogVisible"
      width="500px"
      center
    >
      <span>这将会删除当前文件!</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDocDialogVisible = false">取 消</el-button>
        <el-button @click="deleteDoc">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>
<script>
import { quillEditor } from 'vue-quill-editor'
import quillConfig from '../plugins/quill-config.js'
// 引入编辑器
import * as Quill from 'quill'
// quill编辑器的字体
var fonts = [
  'SimSun',
  'SimHei',
  'Microsoft-YaHei',
  'KaiTi',
  'FangSong',
  'Arial',
  'Times-New-Roman',
  'sans-serif'
]
var Font = Quill.import('formats/font')
// 将字体加入到白名单
Font.whitelist = fonts
Quill.register(Font, true)
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      // 存储数据------------------------------------------------------------

      // 获取头像地址
      imgsrc: '',

      // 当前编辑者ID
      userId: '',

      // 文档显示模式（0：无权限；1：浏览模式；2：编辑模式）
      showType: 0,

      // 删除权限
      deletePermission: true,

      // 文档信息
      docInfo: {
        id: 12123,
        auth: 0,
        author: {
          // id: 1,
          // nickname: '',
          // username: '',
          // token: ''
        },
        lasteditor: {
          // nickname: ''
        },
        createtime: '',
        updatetime: '',
        title: '',
        content: '',
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
          nickname: '',
          content: '',
          createtime: ''
        },
        {
          id: 2,
          nickname: '',
          content: '',
          createtime: ''
        }
      ],

      templateList: [
        {
          id: 1,
          name: '',
          content: '',
          createtime: '',
          creater: {
            id: 1,
            nickname: ''
          }
        }
      ],

      // 表单---------------------------------------------------------------------
      newTitle: '',

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
      deleteDocDialogVisible: false,

      quillOption: quillConfig
    }
  },
  created() {
    this.getImgsrc()
    this.getDocInfo()
    this.getComment()
    this.getMessage()
    this.getEditorId()
  },
  methods: {
    // 头部区域---------------------------------------------------------------

    // 跳转到个人界面
    gotoProfile() {
      this.$router.push('/profile')
    },

    // 获取当前编辑者ID
    async getEditorId() {
      var token = window.sessionStorage.getItem('token')
      const { data: res } = await this.$http.get('/user' + '/?token=' + token)
      this.userId = res.id
    },

    // 点击评论头像跳转
    jumpto(Id) {
      this.$router.push('/profile/' + Id)
    },

    // 回到工作台
    backDashborad() {
      // 询问是否保存
      // 跳转
      this.saveDoc()
      this.$router.push('/home')
    },

    // 获取个人头像地址
    async getImgsrc() {
      var token = window.sessionStorage.getItem('token')
      const { data: res } = await this.$http.get('/user' + '/?token=' + token)
      this.imgsrc = res.image
    },

    // 新建文档
    async createNewDoc() {
      var docId = this.$route.params.id
      var token = window.sessionStorage.getItem('token')
      var patchform = {
        content: this.docInfo.content,
        title: this.docInfo.title,
        noweditor: null
      }
      const { data: res } = await this.$http.patch(
        '/doc/' + docId + '/?token=' + token,
        patchform
      )
      if (
        res === '请先登录' ||
        res === '该文档正在被编辑' ||
        res === '无权限'
      ) {
        this.$message.error('保存失败')
      } else {
        this.$message.success('保存成功')
      }
      var patchform2 = {
        title: '无标题',
        auth: '0'
      }
      const { data: res2 } = await this.$http.post(
        '/doc' + '/?token=' + token,
        patchform2
      )
      if (res2 === '请先登录') {
        this.$message.error('创建失败')
      } else {
        this.$router.push('/doc/' + res2.id)
        this.getDocInfo()
      }
    },

    // 保存文档
    async saveDoc() {
      var token = window.sessionStorage.getItem('token')
      var docId = this.$route.params.id
      var patchform = {
        content: this.docInfo.content,
        title: this.docInfo.title,
        noweditor: null
      }
      const { data: res } = await this.$http.patch(
        '/doc/' + docId + '/?token=' + token,
        patchform
      )
      if (
        res === '请先登录' ||
        res === '该文档正在被编辑' ||
        res === '无权限'
      ) {
        this.$message.error('保存失败')
      } else {
        this.$message.success('保存成功')
        this.showType = 1
      }
    },

    // 获取文档信息
    async getDocInfo() {
      var token = window.sessionStorage.getItem('token')
      var docId = this.$route.params.id
      const { data: res } = await this.$http.get(
        '/doc/' + docId + '/?token=' + token
      )
      if (res === '请先登录' || res === '无权限') {
        this.$message.error(res)
        this.showType = 0
      } else {
        this.docInfo = res
        this.showType = 1
        this.newTitle = this.docInfo.title
      }
    },

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
    async deleteDoc() {
      // 弹窗
      var token = window.sessionStorage.getItem('token')
      var docId = this.$route.params.id
      var patchform = {
        delete: '1',
        noweditor: null
      }
      const { data: res } = await this.$http.patch(
        '/doc/' + docId + '/?token=' + token,
        patchform
      )
      if (
        res === '请先登录' ||
        res === '该文档正在被编辑' ||
        res === '无权限'
      ) {
        this.$message.error('删除失败')
      } else {
        this.$message.success('删除成功')
      }
      this.$router.push('/desktop')
    },

    // 模板---------------------------------------------------------------

    // 获取模板
    async getTemplate() {
      var token = window.sessionStorage.getItem('token')
      const { data: res } = await this.$http.get('/module' + '/?token=' + token)
      if (res === null) {
        this.$message.error('列表为空')
      } else {
        this.templateList = res
      }
    },

    // 保存为模板
    async saveTemplate() {
      var token = window.sessionStorage.getItem('token')
      var patchform = {
        name: this.docInfo.title,
        content: this.docInfo.content
      }
      const { data: res } = await this.$http.post(
        '/module' + '/?token=' + token,
        patchform
      )
      if (res === null) {
        this.$message.error('列表为空')
      } else {
        this.$message.success('储存成功')
      }
      const { data: res2 } = await this.$http.get(
        '/module' + '/?token=' + token
      )
      this.templateList = res2
      if (res2 === null) {
        this.$message.error('列表为空')
      } else {
      }
    },

    // 查看模板
    checkTemplate() {},

    // 使用模板
    useTemplate(template) {
      this.docInfo.title = template.name
      this.docInfo.content = template.content
      this.templateDialogVisible = false
      this.$message.success('成功启用模板')
    },

    // 删除模板
    async deleteTemplate(templete) {
      // 弹窗
      var token = window.sessionStorage.getItem('token')
      const { data: res } = await this.$http.delete(
        '/module/' + templete.id + '/?token=' + token
      )
      if (res === '成功') {
        this.$message.success('删除成功')
      } else {
        this.$message.error('删除失败')
      }
      const { data: res2 } = await this.$http.get(
        '/module' + '/?token=' + token
      )
      this.templateList = res2
      if (res2 === null) {
        this.$message.error('列表为空')
      } else {
      }
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

    // 权限相关
    // 查看模式进入编辑模式
    async editMode() {
      var token = window.sessionStorage.getItem('token')
      const { data: res0 } = await this.$http.get('/user' + '/?token=' + token)
      this.userId = res0.id
      var docId = this.$route.params.id
      // 获取信息
      this.getDocInfo()
      var canEdit = false
      var patchform = {
        noweditor: this.userId
      }
      console.log(this.userId)
      console.log(this.docInfo.noweditor)
      if (this.docInfo.noweditor !== null) {
        // 人编辑
        // 不能编辑
        if (this.docInfo.noweditor.id === this.userId) {
          canEdit = true
        } else {
          this.$message.error('正在被人编辑')
          return
        }
      }
      // 判断权限
      if (this.docInfo.auth < 3) {
        if (this.docInfo.hasAuth) {
          // 可以编辑
          canEdit = true
        } else {
          // 判断团队内
          const { data: res1 } = await this.$http.get(
            '/group/user' + '/?token=' + token
          )
          // 存团队列表teamList（id）
          for (var i = 0; i < res1.length; i++) {
            console.log(res1[i].id)
            if (res1[i].id === this.docInfo.group.id) {
              // 可以编辑
              canEdit = true
            }
          }
        }
        // 判断是不是作者
      } else {
        canEdit = true
      }
      // 判断编辑
      if (!canEdit) {
        this.$message.error('正在被人编辑')
        return
      }
      // 可以编辑
      // 请求
      // 切换显示
      const { data: res } = await this.$http.patch(
        '/doc/' + docId + '/?token=' + token,
        patchform
      )
      if (res !== '请先登录' && res !== '无权限') {
        this.showType = 2
        this.$message.success('切换至编辑模式成功')
      }
    },
    // 编辑模式进入查看模式
    async checkMode() {
      this.saveDoc()
      var token = window.sessionStorage.getItem('token')
      var docId = this.$route.params.id
      var patchform = {
        noweditor: null
      }
      const { data: res } = await this.$http.patch(
        '/doc/' + docId + '/?token=' + token,
        patchform
      )
      if (res !== '请先登录' && res !== '无权限') {
        this.showType = 1
        this.$message.success('切换至浏览模式成功')
      }
    },

    // 文档标题输入框区域---------------------------------------------------------------

    // 更改文档标题
    async changeDocTitle() {
      var token = window.sessionStorage.getItem('token')
      var docId = this.$route.params.id
      var patchform = {
        title: this.newTitle,
        noweditor: null
      }
      const { data: res } = await this.$http.patch(
        '/doc/' + docId + '/?token=' + token,
        patchform
      )
      if (
        res === '请先登录' ||
        res === '该文档正在被编辑' ||
        res === '无权限'
      ) {
        this.$message.error('重命名失败')
      } else {
        this.$message.success('重命名成功')
      }
      this.getDocInfo()
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

    // 评论区域---------------------------------------------------------------

    // 发表评论
    async postComment() {
      if (this.comments === '') {
        this.$message.error('评论不可为空')
        return
      }
      var token = window.sessionStorage.getItem('token')
      var docId = this.$route.params.id
      var postform = {
        content: this.comments
      }
      const { data: res } = await this.$http.post(
        '/comment/' + docId + '/?token=' + token,
        postform
      )
      if (res === '请先登录' || res === '无权限') {
        this.$message.error(res)
      } else {
        this.$message.success('评论成功')
        this.getComment()
      }
      this.comments = ''
    },

    // 获取评论
    async getComment() {
      this.commentList = []
      var docId = this.$route.params.id
      var token = window.sessionStorage.getItem('token')
      const { data: res } = await this.$http.get(
        '/comment/' + docId + '/?token=' + token
      )
      this.commentList = res
    }

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
  background-color: rgb(250, 250, 250);
  resize: none;
}
.el-textarea .el-textarea__inner:focus {
  background: transparent;
  border-color: rgb(150, 150, 150);
}
</style>
<style lang="less" scoped>
/* global css*/
.el-container {
  width: 100vw;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  padding-bottom: 100px;
  position: absolute;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: whitesmoke;
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
.btnsarea {
  width: 75vw;
  height: 50px;
  position: fixed;
  top: 0;
  left: 50%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transform: translateX(-50%);
  -webkit-transform: translateX(-50%);
  z-index: 99;
}
.leftarea,
.rightarea {
  width: 35%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.rightarea {
  justify-content: flex-end;
}
.doctitle {
  min-width: 50px;
  height: 30px;
  margin: 0;
  padding: 0 5px;
  padding-bottom: 2px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  border-bottom: 2px solid rgb(185, 185, 185);
}
.doctitle span {
  color: rgb(50, 50, 50);
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1px;
  text-indent: 1px;
}
.btnsarea .el-button {
  height: 30px;
  margin: 0 15px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(150, 150, 150);
  font-size: 14px;
  background-color: transparent;
  border: none;
}
.btnsarea .el-button:hover {
  color: rgb(50, 50, 50);
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  background-color: transparent;
}
.btnsarea .el-button:active {
  color: rgb(50, 50, 50);
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  background-color: transparent;
  transform: translateY(1px);
  -webkit-transform: translateY(1px);
}
.btnsarea .el-button:focus {
  color: rgb(50, 50, 50);
  background-color: transparent;
}
.btnsarea .d_newdoc {
  width: 30px;
  font-size: 16px;
}
.btnsarea .share,
.btnsarea .save {
  margin: 0;
  width: 100px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.12), 0 0 4px rgba(0, 0, 0, 0.04);
}
.btnsarea .share {
  margin-left: 10px;
  background: linear-gradient(
    to bottom,
    rgb(250, 250, 250) 0%,
    white 10%,
    white 60%,
    whitesmoke 100%
  );
}
.btnsarea .share:focus {
  color: rgb(150, 150, 150);
  background: linear-gradient(
    to bottom,
    rgb(250, 250, 250) 0%,
    white 10%,
    white 60%,
    whitesmoke 100%
  );
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.12), 0 0 4px rgba(0, 0, 0, 0.04);
}
.btnsarea .share:hover {
  color: rgb(50, 50, 50);
  font-weight: 600;
  text-shadow: none;
  background: linear-gradient(
    to bottom,
    rgb(250, 250, 250) 0%,
    white 10%,
    white 60%,
    whitesmoke 100%
  );
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.btnsarea .share:active {
  text-shadow: none;
  background: linear-gradient(
    to bottom,
    rgb(250, 250, 250) 0%,
    white 10%,
    white 60%,
    whitesmoke 100%
  );
  box-shadow: 0 2px 1px rgba(0, 0, 0, 0.12), 0 0 2px rgba(0, 0, 0, 0.04);
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
  width: 100vw;
  margin: 0;
  padding: 0;
  padding-top: 90px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.el-main::-webkit-scrollbar {
  width: 0;
}
.cover {
  width: 100%;
  height: 137px;
  position: fixed;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: whitesmoke;
  user-select: none;
  z-index: 60;
}
.cover .remind {
  position: relative;
  top: 60px;
  color: rgb(150, 150, 150);
  font-size: 14px;
}
.cover .switch {
  width: 50px;
  height: 62px;
  margin: 0;
  padding: 0;
  position: relative;
  top: 130px;
  right: -520px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: black;
  border: none;
  border-radius: 1px;
  background-color: whitesmoke;
  opacity: 0.6;
}
.cover .switch:hover {
  background-color: rgb(248, 248, 248);
  opacity: 1;
}
.cover .switch img {
  width: 50px;
}
.cover .switch p {
  margin: 0;
  padding: 0;
  margin-top: 5px;
  color: rgb(85, 85, 85);
  font-size: 12px;
}
.cover .switch:hover p {
  font-weight: 600;
}
.toobar-cover {
  z-index: 97;
}
.paper {
  width: 900px;
  min-height: 1500px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  border: none;
  border-radius: 1px;
  background-color: white;
  box-shadow: 0 1px 5px rgb(214, 214, 214);
}
.editarea {
  width: 100%;
  height: 100%;
  margin: 40px 60px;
  padding: 0;
  text-align: justify;
}
.titlebar {
  width: 100%;
  height: 60px;
  margin-bottom: 20px;
  padding: 0;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  border-bottom: 1px solid rgb(230, 230, 230);
}
.titlebar h2 {
  margin: 10px 20px;
  padding: 0;
}
/deep/ .titlebar .el-input__inner {
  width: 740px;
  height: 50px;
  margin: 0 20px;
  padding: 0;
  color: black;
  font-size: 24px;
  font-weight: 600;
  border: none;
}
/deep/ .el-table .el-table__body tr.current-row > td {
  background-color: rgb(248, 248, 248) !important;
}
/deep/ .el-table .el-table__body tr:hover > td {
  background-color: rgb(248, 248, 248) !important;
}
/deep/ .el-table td {
  border-bottom: 1px solid rgb(221, 221, 221);
}
/deep/ .el-table th.is-leaf {
  border-bottom: 1px solid rgb(200, 200, 200);
}
/deep/ .el-table .ascending .sort-caret.ascending {
  border-bottom-color: rgb(50, 50, 50);
}
/deep/ .el-table .descending .sort-caret.descending {
  border-top-color: rgb(50, 50, 50);
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
.tempbtn {
  color: rgb(150, 150, 150);
  border: 1px solid rgb(221, 221, 221);
  border-radius: 5px;
  background-color: white;
}
.tempbtn:focus {
  color: rgb(150, 150, 150);
  background-color: white;
  border: 1px solid rgb(221, 221, 221);
}
.tempbtn:hover {
  color: rgb(85, 85, 85);
  background-color: white;
  border: 1px solid rgb(170, 170, 170);
}
.tempbtn:active {
  color: rgb(50, 50, 50);
  background: linear-gradient(
    -20deg,
    white 0%,
    rgb(248, 248, 248) 60%,
    white 100%
  );
  border: 1px solid rgb(50, 50, 50);
}
/deep/ .sharelink .el-input__inner {
  width: 450px;
  color: rgb(85, 85, 85);
  font-size: 15px;
  border: none;
  border-radius: 1px;
  box-shadow: inset 0 0 6px rgb(224, 224, 224);
  transition: 0.1s linear;
  -webkit-transition: 0.1s linear;
}
/deep/ .sharelink .el-input__inner:focus {
  box-shadow: inset 0 0 8px rgb(189, 189, 189);
}
.deletelog .el-button {
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
.deletelog .el-button:hover {
  color: white;
}
.deletelog .el-button:active {
  background: linear-gradient(
    -20deg,
    rgb(85, 85, 85) 0%,
    rgb(100, 100, 100) 60%,
    rgb(85, 85, 85) 100%
  );
  box-shadow: none;
}
.infolog {
  color: rgb(85, 85, 85);
}
.footer {
  width: 100%;
  height: 100%;
  margin-top: 20px;
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
.comment-frame {
  width: 1000px;
  min-height: 150px;
  margin: 0;
  margin-top: 50px;
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
.btnsarea .save {
  margin-left: 5px;
  background: linear-gradient(
    to bottom,
    rgb(85, 85, 85) 0%,
    rgb(50, 50, 50) 10%,
    rgb(50, 50, 50) 60%,
    rgb(70, 70, 70) 100%
  );
}
.btnsarea .save:focus {
  color: rgb(150, 150, 150);
  background: linear-gradient(
    to bottom,
    rgb(85, 85, 85) 0%,
    rgb(50, 50, 50) 10%,
    rgb(50, 50, 50) 60%,
    rgb(70, 70, 70) 100%
  );
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.12), 0 0 4px rgba(0, 0, 0, 0.04);
}
.btnsarea .save:hover {
  color: rgb(255, 255, 255);
  font-weight: 600;
  text-shadow: none;
  background: linear-gradient(
    to bottom,
    rgb(85, 85, 85) 0%,
    rgb(50, 50, 50) 10%,
    rgb(50, 50, 50) 60%,
    rgb(70, 70, 70) 100%
  );
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.btnsarea .save:active {
  text-shadow: none;
  background: linear-gradient(
    to bottom,
    rgb(85, 85, 85) 0%,
    rgb(50, 50, 50) 10%,
    rgb(50, 50, 50) 60%,
    rgb(70, 70, 70) 100%
  );
  box-shadow: 0 2px 1px rgba(0, 0, 0, 0.12), 0 0 2px rgba(0, 0, 0, 0.04);
}

/* noneAuthority css */
.na-div {
  margin-top: 20vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.warn-icon {
  width: 200px;
  opacity: 0.6;
}
.auth-warn {
  margin-top: 20px;
  color: rgb(150, 150, 150);
}
</style>
