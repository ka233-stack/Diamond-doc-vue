<template>
  <el-container>
    <!-- 页面头部区域 -->
    <el-header class="nav">
      <div class="header-left">
        <!-- 返回按钮 -->
        <el-button icon="el-icon-back" @click="backdashborad"></el-button>
        <!-- 新建文档按钮 -->
        <el-button icon="el-icon-document-add"></el-button>
      </div>
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
        <!-- 通知 -->
        <el-button icon="el-icon-bell"></el-button>
        <!-- 设置下拉菜单 -->
        <el-dropdown>
          <!-- 设置 -->
          <el-button icon="el-icon-setting"></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>文档信息</el-dropdown-item>
            <el-dropdown-item @click="deleteDoc">删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- 分享按钮 -->
        <el-button class="share">分享</el-button>
        <!-- 保存按钮 -->
        <el-button class="save">保存</el-button>
      </div>
    </el-header>
    <!-- 页面主体区域 -->
    <el-main>
      <!-- 滚动遮盖 -->
      <div class="cover"></div>
      <!-- 富文本编辑器 -->
      <div class="editor">
        <el-card>
          <quill-editor v-model="content" ref="myQuillEditor" :options="editorOption">
            <!-- 自定义toolar -->
            <div id="toolbar" slot="toolbar">
              <!-- Add a bold button -->
              <button class="ql-bold" title="加粗">Bold</button>
              <button class="ql-italic" title="斜体">Italic</button>
              <button class="ql-underline" title="下划线">underline</button>
              <button class="ql-strike" title="删除线">strike</button>
              <button class="ql-blockquote" title="引用"></button>
              <button class="ql-code-block" title="代码"></button>
              <button class="ql-header" value="1" title="标题1"></button>
              <button class="ql-header" value="2" title="标题2"></button>
              <!--Add list -->
              <button class="ql-list" value="ordered" title="有序列表"></button>
              <button class="ql-list" value="bullet" title="无序列表"></button>
              <!-- Add font size dropdown -->
              <select class="ql-header" title="段落格式">
                <option selected>正文</option>
                <option value="1">标题1</option>
                <option value="2">标题2</option>
                <option value="3">标题3</option>
                <option value="4">标题4</option>
                <option value="5">标题5</option>
                <option value="6">标题6</option>
              </select>
              <select class="ql-font" title="字体">
                <option value="SimSun">宋体</option>
                <option value="SimHei">黑体</option>
                <option value="Microsoft-YaHei">微软雅黑</option>
                <option value="KaiTi">楷体</option>
                <option value="FangSong">仿宋</option>
                <option value="Arial">Arial</option>
              </select>
              <select class="ql-size" title="字体大小">
                <option value="10px">10</option>
                <option value="12px">12</option>
                <option value="14px">14</option>
                <option value="16px" selected>16</option>
                <option value="18px">18</option>
                <option value="20px">20</option>
              </select>
              <!-- Add subscript and superscript buttons -->
              <select class="ql-color" value="color" title="字体颜色"></select>
              <select class="ql-background" value="background" title="背景颜色"></select>
              <select class="ql-align" value="align" title="对齐"></select>
              <button class="ql-clean" title="还原"></button>
              <!-- You can also add your own -->
            </div>
          </quill-editor>
        </el-card>
      </div>

      <!-- 文档评论区 -->
      <div class="comment-frame">
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
            <el-input type="textarea" placeholder="写下你的评论"></el-input>
            <!-- 评论按钮 -->
            <el-button @click="comment">发布</el-button>
          </div>

          <!-- 评论帖子 -->
          <div id="comment#1" class="inner-frame">
            <!-- 分割线 -->
            <div class="cutline"></div>
            <!-- 用户信息 -->
            <div class="user-comment">
              <!-- 用户头像 -->
              <div class="user-info">
                <img src="../assets/img/avatar.png" alt="用户头像" />
              </div>
              <div class="comments">
                <!-- 用户头像 -->
                <div class="user-id">用户昵称</div>
                <!-- 用户评论 -->
                <div class="comment-content">这是一条评论</div>
                <!-- 时间信息 -->
                <div class="commenttime">2020/8/14 9:00</div>
              </div>
            </div>
          </div>

          <div id="comment#2" class="inner-frame">
            <!-- 分割线 -->
            <div class="cutline"></div>
            <!-- 用户信息 -->
            <div class="user-comment">
              <!-- 用户头像 -->
              <div class="user-info">
                <img src="../assets/img/avatar.png" alt="用户头像" />
              </div>
              <div class="comments">
                <!-- 用户头像 -->
                <div class="user-id">用户昵称</div>
                <!-- 用户评论 -->
                <div class="comment-content">这是</div>
                <!-- 时间信息 -->
                <div class="commenttime">2010/14/14 9:00</div>
              </div>
            </div>
          </div>

          <div id="comment#3" class="inner-frame">
            <!-- 分割线 -->
            <div class="cutline"></div>
            <!-- 用户信息 -->
            <div class="user-comment">
              <!-- 用户头像 -->
              <div class="user-info">
                <img src="../assets/img/avatar.png" alt="用户头像" />
              </div>
              <div class="comments">
                <!-- 用户头像 -->
                <div class="user-id">用户昵称</div>
                <!-- 用户评论 -->
                <div
                  class="comment-content"
                >这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论这是一条评论</div>
                <!-- 时间信息 -->
                <div class="commenttime">8020/8/12 9:00</div>
              </div>
            </div>
          </div>
          <!-- 分割线 -->
          <div class="cutline"></div>
        </div>
      </div>
    </el-main>
    <el-footer>
      <div class="footer">
        <span>编写于</span>
        <span>金刚石文档</span>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
import { Quill, quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 引入font.css
import '../assets/css/font.css'

// 自定义字体大小
var Size = Quill.import('attributors/style/size')
Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px']
Quill.register(Size, true)

// 自定义字体类型
var fonts = [
  'SimSun',
  'SimHei',
  'Microsoft-YaHei',
  'KaiTi',
  'FangSong',
  'Arial',
  'Times-New-Roman',
  'sans-serif',
  '宋体',
  '黑体'
]
var Font = Quill.import('formats/font')
Font.whitelist = fonts
Quill.register(Font, true)

export default {
  components: {
    quillEditor
  },
  data() {
    return {
      content: null,
      editorOption: {
        placeholder: '请输入',
        theme: 'snow',
        modules: {
          toolbar: {
            container: '#toolbar'
          }
        }
      },
      commentStr: ''
    }
  },
  methods: {
    // 回到工作台
    backdashborad() {
      // 询问是否保存
      // 跳转
      this.$router.push('/home')
    },
    // 账号设置
    setAccount() {
      this.$router.push('/')
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
      // 跳转到h/
      this.$router.push('/')
    },
    // 删除文档
    deleteDoc() {
      // 弹窗
    },
    // 发表评论
    comment() {

    }
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
  padding-top: 80px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.cover {
  width: 100%;
  height: 77px;
  position: fixed;
  top: 0;
  background: whitesmoke;
  z-index: 60;
}
.editor {
  width: 50%;
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
.quill-editor {
  min-height: 1500px;
}
#toolbar {
  width: 50px;
  height: 450px;
  margin: 0;
  padding: 0;
  position: fixed;
  top: 80px;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  border: none;
  box-shadow: 0 1px 5px rgb(214, 214, 214);
}
#toolbar .select {
  width: 50px !important;
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
.el-footer {
  width: 100%;
  height: 50px !important;
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
</style>
