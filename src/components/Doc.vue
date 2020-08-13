<template>
  <el-container>
    <!-- 页面头部区域 -->
    <el-header>
      <div class="header-left">
        <!-- 返回按钮 -->
        <el-button icon="el-icon-back"></el-button>
        <!-- 新建文档按钮 -->
        <el-button icon="el-icon-document-add"></el-button>
        <!-- 保存按钮 -->
        <el-button>
          <span>保存</span>
        </el-button>
      </div>
      <div class="header-right">
        <!-- 分享按钮 -->
        <el-button>
          <span>分享</span>
        </el-button>
        <!-- 通知 -->
        <el-button icon="el-icon-bell" circle></el-button>
        <!-- 头像下拉菜单 -->
        <el-dropdown>
          <!-- 头像 -->
          <el-button class="nav-avatar" circle>
            <img src="" alt="用户头像" />
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

        <!-- 设置下拉菜单 -->
        <el-dropdown>
          <!-- 设置 -->
          <el-button icon="el-icon-setting" circle></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>文档信息</el-dropdown-item>
            <el-dropdown-item @click="deleteDoc">删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <!-- 页面主体区域 -->
    <el-main>
      <!-- 富文本编辑器 -->
      <el-card style="height: 610px;">
        <quill-editor
          v-model="content"
          ref="myQuillEditor"
          style="height: 500px;"
          :options="editorOption"
        >
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
              <option selected>段落</option>
              <option value="1">标题1</option>
              <option value="2">标题2</option>
              <option value="3">标题3</option>
              <option value="4">标题4</option>
              <option value="5">标题5</option>
              <option value="6">标题6</option>
            </select>
            <select class="ql-size" title="字体大小">
              <option value="10px">10px</option>
              <option value="12px">12px</option>
              <option value="14px">14px</option>
              <option value="16px" selected>16px</option>
              <option value="18px">18px</option>
              <option value="20px">20px</option>
            </select>
            <select class="ql-font" title="字体">
              <option value="SimSun">宋体</option>
              <option value="SimHei">黑体</option>
              <option value="Microsoft-YaHei">微软雅黑</option>
              <option value="KaiTi">楷体</option>
              <option value="FangSong">仿宋</option>
              <option value="Arial">Arial</option>
            </select>
            <!-- Add subscript and superscript buttons -->
            <select class="ql-color" value="color" title="字体颜色"></select>
            <select
              class="ql-background"
              value="background"
              title="背景颜色"
            ></select>
            <select class="ql-align" value="align" title="对齐"></select>
            <button class="ql-clean" title="还原"></button>
            <!-- You can also add your own -->
          </div>
        </quill-editor>
      </el-card>
      <!-- 文档评论区 -->
      <div>
        <!-- 评论区头部 -->
        <div>
          <span>文档评论</span>
        </div>
        <!-- 编写评论区 -->
        <div>
          <!-- 评论输入框 -->
          <el-input
            type="textarea"
            autosize
            placeholder="发表评论"
            v-model="commentStr"
          >
          </el-input>
          <!-- 评论按钮 -->
          <el-button @click="comment">
            <span>评论</span>
          </el-button>
        </div>

        <!-- 评论帖子 -->
        <div>
          <!-- 用户信息 -->
          <div>
            <!-- 用户头像 -->
            <div>
              <img src="" alt="用户头像" />
            </div>
            <!-- 用户头像 -->
            <div>
              <span>用户昵称</span>
            </div>
          </div>
          <!-- 用户评论 -->
          <div>
            <span>用户评论大撒大撒撒旦撒恶打撒但是</span>
          </div>
          <!-- 时间信息 -->
          <div>
            <span>评论于2月16日</span>
          </div>
        </div>
      </div>
    </el-main>
    <el-footer>
      <span>编写于金刚石文档</span>
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
    comment() {}
  }
}
</script>

<style scoped></style>
