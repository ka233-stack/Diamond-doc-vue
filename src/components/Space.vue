<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <!-- 团队空间名称 -->
      <h3>{{ teamInfo.teamName }}</h3>
      <!-- 团队信息按钮 -->
      <div>
        <el-button class="spaceinfo" @click="teamInfoDialogVisible = true"
          >团队信息</el-button
        >
      </div>
      <!-- 管理团队按钮 -->
      <div v-if="teamInfo.isManager">
        <el-button class="manage" @click="manageTeamDialogVisible = true"
          >管理团队</el-button
        >
      </div>
      <!-- 退出团队按钮 -->
      <div v-if="!teamInfo.isManager">
        <el-button class="manage" @click="quitTeamDialogVisible = true"
          >退出团队</el-button
        >
      </div>
      <div class="switchbtns">
        <!-- 显示方式按钮组 -->
        <el-button-group>
          <el-tooltip content="块状显示" placement="bottom" effect="light">
            <el-button
              icon="el-icon-menu"
              @click="isListShow = false"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="列表显示" placement="bottom" effect="light">
            <el-button
              icon="el-icon-s-unfold"
              @click="isListShow = true"
            ></el-button>
          </el-tooltip>
        </el-button-group>
      </div>
    </el-header>
    <!-- 文档列表显示区域 -->
    <div class="doclist" v-if="isListShow && this.docListInfo.total > 0">
      <!-- 文档列表 -->
      <el-table
        :data="docList"
        :default-sort="{ prop: 'title', order: 'ascending' }"
      >
        <!-- 文件名 -->
        <el-table-column
          prop="title"
          label="文件名"
          sortable
          width="220"
          align="left"
          header-align="left"
        >
          <template slot-scope="scope">
            <!-- 文件名 -->
            <el-button
              class="docname"
              @click.native="openDoc(scope.row)"
              type="text"
              circle
              >{{ scope.row.title }}</el-button
            >
          </template>
        </el-table-column>
        <!-- 创建者 -->
        <el-table-column
          prop="nickname"
          label="创建者"
          width="200"
          align="center"
          header-align="center"
        ></el-table-column>
        <!-- 创建时间 -->
        <el-table-column
          prop="createtime"
          label="创建时间"
          sortable
          width="145"
          align="center"
          header-align="center"
        ></el-table-column>
        <!-- 最后打开时间 -->
        <el-table-column
          prop="updatetime"
          label="最后编辑时间"
          sortable
          width="145"
          align="center"
          header-align="right"
        >
        </el-table-column>
        <!-- 最后编辑者 -->
        <el-table-column
          prop="lasteditor_nickname"
          label="最后编辑者"
          width="200"
          align="center"
          header-align="center"
        >
        </el-table-column>
        <!-- 按钮 -->
        <el-table-column>
          <template slot-scope="scope">
            <!-- 收藏按钮 -->
            <el-button
              class="favbtn"
              @click.native="changeFavState(scope.row)"
              size="mini"
              :icon="
                scope.row.isFavorite ? 'el-icon-star-on' : 'el-icon-star-off'
              "
              circle
            ></el-button>
            <!-- 设置按钮下拉菜单 -->
            <el-dropdown>
              <!-- 设置按钮 -->
              <el-button
                class="morebtn"
                size="mini"
                icon="el-icon-more"
                circle
              ></el-button>
              <el-dropdown-menu class="dropdown-menu" slot="dropdown">
                <el-dropdown-item @click.native="shareDoc(scope.row)">
                  <span>分享</span>
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="scope.row.hasAuth"
                  @click.native="showSetAuthDialog(scope.row)"
                >
                  <span>设置权限</span>
                </el-dropdown-item>
                <el-dropdown-item @click.native="changeFavState(scope.row)">
                  <span>{{ scope.row.isFavorite ? '取消收藏' : '收藏' }}</span>
                </el-dropdown-item>
                <el-dropdown-item
                  @click.native="showrenameDocDialog(scope.row.id)"
                >
                  <span>重命名</span>
                </el-dropdown-item>
                <el-dropdown-item @click.native="deleteDoc(scope.row)" divided>
                  <span>删除</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 文档块状显示区域 -->
    <div class="docblock" v-if="!isListShow && this.docListInfo.total > 0">
      <div v-for="item in docList" :key="item.id">
        <!-- 文档块 -->
        <!--class='template'部分为块分布模板-->
        <div class="block" @click="openDoc(item)">
          <!-- 文档图片 -->
          <div>
            <img class="img-doc" src="../assets/img/doc.png" alt="文档" />
          </div>
          <div class="menu">
            <!-- 文档标题 -->
            <span id="title">{{ item.title }}</span>
            <!-- 文档信息 -->
            <div class="info">
              <div>
                <span>最后于</span>
                <span>{{ item.updatetime }}</span>
              </div>
              <div>
                <span>由</span>
                <span>{{ item.lasteditor_nickname }}</span>
                <span>编辑</span>
              </div>
            </div>
          </div>
          <!-- 文档管理下拉菜单 -->
          <el-dropdown>
            <!-- 按钮 -->
            <el-button
              class="morebtn"
              icon="el-icon-more"
              style="transform: rotate(90deg);"
            ></el-button>
            <!-- 文档管理下拉菜单 -->
            <el-dropdown-menu class="dropdown-menu" slot="dropdown">
              <el-dropdown-item @click.native="shareDoc(item)">
                <span>分享</span>
              </el-dropdown-item>
              <el-dropdown-item
                v-if="item.hasAuth"
                @click.native="showSetAuthDialog(item)"
              >
                <span>设置权限</span>
              </el-dropdown-item>
              <el-dropdown-item @click.native="changeFavState(item)">
                <span>{{ item.isFavorite ? '取消收藏' : '收藏' }}</span>
              </el-dropdown-item>
              <el-dropdown-item @click.native="showrenameDocDialog(item.id)">
                <span>重命名</span>
              </el-dropdown-item>
              <el-dropdown-item @click.native="deleteDoc(item)" divided>
                <span>删除</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <!--class='template'部分为块分布模板-->
      </div>
    </div>
    <!-- 团队信息框 -->
    <el-dialog
      class="infolog"
      title="团队信息"
      :visible.sync="teamInfoDialogVisible"
      width="800px"
      :append-to-body="true"
    >
      <!-- 管理者 -->
      <div>
        <span>管理者：{{ teamInfo.teamCreator }}</span>
      </div>
      <!-- 成员信息 -->
      <div class="membership">
        <el-table :data="teamInfo.memberList" max-height="350">
          <el-table-column
            prop="nickname"
            label="昵称"
            sortable
            width="200"
            align="center"
            header-align="center"
          ></el-table-column>
          <el-table-column
            prop="username"
            label="用户名"
            sortable
            width="200"
            align="center"
            header-align="center"
          ></el-table-column>
          <el-table-column
            prop="email"
            label="邮箱"
            sortable
            align="center"
            header-align="center"
          ></el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 管理团队框 -->
    <el-dialog
      class="manalog"
      title="管理团队"
      :visible.sync="manageTeamDialogVisible"
      width="1000px"
      :append-to-body="true"
    >
      <div class="manalog-inner">
        <!-- 解散团队按钮 -->
        <el-button class="disband" @click="dissolveTeamDialogVisible = true"
          >解散团队</el-button
        >
        <!-- 成员信息 -->
        <div class="membership">
          <el-table
            :data="teamInfo.memberList"
            max-height="350"
            :default-sort="{ prop: 'nickname', order: 'ascending' }"
          >
            <el-table-column
              prop="nickname"
              label="昵称"
              sortable
              width="200"
              align="center"
              header-align="center"
            ></el-table-column>
            <el-table-column
              prop="username"
              label="用户名"
              sortable
              width="200"
              align="center"
              header-align="center"
            ></el-table-column>
            <el-table-column
              prop="email"
              label="邮箱"
              sortable
              width="350"
              align="center"
              header-align="center"
            ></el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button
                  class="removebtn"
                  @click="removeMember(scope.row)"
                  size="mini"
                  >移出团队</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
    <!-- 退出确认对话框 -->
    <el-dialog
      class="disbandlog"
      title="确认退出团队"
      :visible.sync="quitTeamDialogVisible"
      width="500px"
      center
      :append-to-body="true"
    >
      <span>确认退出团队</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="quitTeamDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="quitTeam">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 确认对话框 -->
    <el-dialog
      class="disbandlog"
      title="确认解散团队"
      :visible.sync="dissolveTeamDialogVisible"
      width="500px"
      center
      :append-to-body="true"
    >
      <span>这将会删除所有队员并丢失团队空间中所有文件！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dissolveTeamDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dissolveTeam">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分享文档对话框 -->
    <el-dialog
      class="defaultlog"
      title="分享文档链接"
      :visible.sync="shareDocDialogVisible"
      width="500px"
      @close="shareDocDialogClosed"
      :append-to-body="true"
    >
      <!-- 输入框区域 -->
      <el-input v-model="shareDocForm.url" placeholder="文档链接"></el-input>
    </el-dialog>
    <!-- 设置权限对话框 -->
    <el-dialog
      title="设置文档权限"
      :visible.sync="setAuthDialogVisible"
      width="500px"
      @close="setAuthDialogClosed"
      :append-to-body="true"
    >
      <el-select v-model="docAuth.label" placeholder="请选择">
        <el-option
          v-for="item in authList"
          :key="item.auth"
          :label="item.label"
          :value="item.value"
        >
          <span style="float: left">{{ item.label }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{
            item.value
          }}</span>
        </el-option>
      </el-select>
      <!-- 底部区域 -->
      <el-button @click="setAuth">确 定</el-button>
    </el-dialog>
    <!-- 重命名文档对话框 -->
    <el-dialog
      class="defaultlog"
      title="重命名文档"
      :visible.sync="renameDocDialogVisible"
      width="600px"
      @close="renameDocDialogClosed"
      :append-to-body="true"
    >
      <!-- 重命名文档表单 -->
      <el-form :model="renameDocForm" ref="renameDocFormRef">
        <el-form-item prop="newName">
          <el-input
            v-model="renameDocForm.newName"
            placeholder="文档名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <el-button @click="renameDoc">确 定</el-button>
    </el-dialog>
    <!-- 分页区域 -->
    <div v-if="this.docListInfo.total > 0">
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="docListInfo.pageNum"
        :page-size="2"
        layout="total, prev, pager, next, jumper"
        :total="docListInfo.total"
      >
      </el-pagination>
    </div>
  </el-container>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      // 存储数据------------------------------------------------------------
      // 团队信息
      teamInfo: {
        teamId: '1',
        teamName: '123123',
        teamCreator: '顺丰到付',
        isManager: false,
        memberList: [
          {
            id: 1,
            nickname: 'user1',
            username: 'user1',
            email: 'user1@qq.com'
          }
        ]
      },

      // 文档列表信息
      docListInfo: {
        query: '',
        // 文档类型
        // 最近使用:0
        // 我创建的:1
        // 我的收藏:2
        type: 0,
        // 当前的页数
        pageNum: 1,
        // 总的文档数
        total: 32
      },

      // 文档列表
      docList: [
        {
          id: 1,
          isFavorite: true,
          title: '文档名2',
          nickname: '王小虎1',
          createtime: '05-02 10：12',
          updatetime: '05-02 10：12',
          lasteditor_nickname: '王小2'
        },
        {
          id: 3,
          isFavorite: false,
          title: '文档名4',
          nickname: '王小虎2',
          createtime: '05-02 10：12',
          updatetime: '05-02 10：41',
          lasteditor_nickname: '王小3'
        },
        {
          id: 2,
          isFavorite: false,
          title: '文档名1',
          nickname: '王小虎3',
          createtime: '05-02 10：12',
          updatetime: '05-02 10：51',
          lasteditor_nickname: '王小4'
        },
        {
          id: 6,
          isFavorite: true,
          title: '文档名3',
          nickname: '王小虎4',
          createtime: '05-02 10：12',
          updatetime: '05-02 10：01',
          lasteditor_nickname: '王小1'
        }
      ],

      // 表单---------------------------------------------------------------------

      // 分享文档链接对象
      shareDocForm: {
        url: ''
      },

      // 设置权限
      docAuth: {
        docId: 0,
        auth: 0,
        label: ''
      },

      // 重命名文档名称对象
      renameDocForm: {
        userId: '',
        newName: ''
      },

      // 对话框的可见属性----------------------------------------------------------

      // 团队信息对话框的可见属性
      teamInfoDialogVisible: false,
      // 设置权限对话框的可见属性
      setAuthDialogVisible: false,
      // 管理团队对话框的可见属性
      manageTeamDialogVisible: false,
      // 退出团队对话框的可见属性
      quitTeamDialogVisible: false,

      // 解散团队对话框的可见属性
      dissolveTeamDialogVisible: false,

      // 分享对话框的可见属性
      shareDocDialogVisible: false,

      // 控制重命名文档对话框的显示
      renameDocDialogVisible: false,

      // 辅助--------------------------------------------------------------------

      // 切换文档
      isListShow: false,

      // 权限列表
      authList: [
        {
          auth: 0,
          value: '仅自己可以查看',
          label: '私密文档'
        },
        {
          auth: 1,
          value: '其他人可以查看，但不能编辑或评论',
          label: '他人可读'
        },
        {
          auth: 2,
          value: '其他人可以查看或评论，但不能编辑',
          label: '他人可读/评论'
        },
        {
          auth: 3,
          value: '其他人可以查看、评论、编辑',
          label: '他人可读/编辑/评论'
        }
      ]
    }
  },
  created() {
    this.getTeamInfo()
    this.getTeamDoc()
  },
  // 观察路由变化
  watch: {
    $route(to, from) {
      this.getTeamInfo()
      this.getTeamDoc()
    }
  },
  methods: {
    // 团队信息---------------------------------------------------------------

    // 获取团队信息
    async getTeamInfo() {
      var token = window.sessionStorage.getItem('token')
      var teamId = this.$route.params.id
      const { data: res } = await this.$http.get(
        '/group/' + teamId + '/?token=' + token
      )
      this.teamInfo.memberList = res.member
      this.teamInfo.teamCreator = res.leader.nickname
      this.teamInfo.isManager = res.isManager
      this.teamInfo.teamName = res.name
    },

    // 获取团队文档
    async getTeamDoc() {
      this.docList = []
      this.docListInfo.total = 0
      var token = window.sessionStorage.getItem('token')
      var page = this.docListInfo.pageNum
      var teamId = this.$route.params.id
      const { data: res } = await this.$http.get(
        '/doc/group/' + teamId + '/?token=' + token + '&page=' + page
      )
      this.docList = res
      this.docListInfo.total = this.docList[0].total
    },

    // 管理团队---------------------------------------------------------------

    // 解散团队
    async dissolveTeam() {
      // 消息提示
      var teamId = this.$route.params.id
      var token = window.sessionStorage.getItem('token')
      const { data: res } = await this.$http.delete(
        '/group/' + teamId + '/?token=' + token
      )
      if (res === '解散成功') {
        this.$message.success('解散成功')
      } else {
        this.$message.error('解散失败')
      }
      this.$router.push('/dashboard')
    },

    // 移除成员
    async removeMember(member) {
      // 消息提示
      var teamId = this.$route.params.id
      var token = window.sessionStorage.getItem('token')
      const { data: res } = await this.$http.put(
        '/group/' + teamId + '/member/' + member.id + '/?token=' + token
      )
      if (res === '成功') {
        this.$message.success('移除成功')
      } else {
        this.$message.error('移除失败')
      }
      const { data: res2 } = await this.$http.get(
        '/group/' + teamId + '/?token=' + token
      )
      if (
        res2 === '请先登录' ||
        res2 === '该文档正在被编辑' ||
        res2 === '无权限'
      ) {
        this.$message.error('获取列表失败')
      }
      this.teamInfo.memberList = res2.member
      this.teamInfo.teamCreator = res2.leader.nickname
    },

    async quitTeam() {
      //
      var token = window.sessionStorage.getItem('token')
      var groupId = this.$route.params.id
      const { data: res } = await this.$http.delete(
        '/group/' + groupId + '/member' + '/?token=' + token
      )
      if (res === '成功') {
        this.$message.success('退出成功')
        this.quitTeamDialogVisible = false
        this.$router.push('/dashboard')
      } else {
        this.$message.error('退出失败')
      }
    },

    // 文档列表---------------------------------------------------------------

    // 设置权限
    async setAuth() {
      if (this.docAuth.label === '仅自己可以查看') {
        this.docAuth.auth = 0
      } else if (this.docAuth.label === '其他人可以查看，但不能编辑或评论') {
        this.docAuth.auth = 1
      } else if (this.docAuth.label === '其他人可以查看或评论，但不能编辑') {
        this.docAuth.auth = 2
      } else {
        this.docAuth.auth = 3
      }
      var token = window.sessionStorage.getItem('token')
      var patchform = {
        auth: this.docAuth.auth,
        noweditor: null
      }
      const { data: res } = await this.$http.patch(
        '/doc/' + this.docAuth.docId + '/?token=' + token,
        patchform
      )
      if (
        res === '请先登录' ||
        res === '无权限' ||
        res === '该文档正在被编辑'
      ) {
        this.$message.error(res)
      } else {
        this.$message.success('权限更改成功')
        this.setAuthDialogVisible = false
      }
      // 发送docAuth
      // 判断
      // 成功则关闭对话框
    },

    // 打开文档!!!!!!!!!!!!!!!!!!!!!!!未完成!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    async openDoc(docInfo) {
      this.$router.push('/doc/' + docInfo.id)
      // 跳转
    },

    // 分享文档
    shareDoc(docInfo) {
      // 传输
      var url = window.location.href.replace('space', 'doc')
      this.shareDocForm.url = url
      this.shareDocDialogVisible = true
    },

    // 收藏文档!!!!!!!!!!!!!!!!!!!!!!!未完成!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    async changeFavState(docInfo) {
      // 传输
      // 判断成功
      // 消息提示
      // 改变收藏状态
      var token = window.sessionStorage.getItem('token')
      if (docInfo.isFavorite === true) {
        const { data: res } = await this.$http.delete(
          '/favorite/' + docInfo.id + '/?token=' + token
        )
        if (res === '成功') {
          this.$message.success('取消收藏成功')
        } else {
          this.$$message.error('取消收藏失败')
        }
      } else {
        const { data: res } = await this.$http.put(
          '/favorite/' + docInfo.id + '/?token=' + token
        )
        if (res === '成功') {
          this.$message.success('收藏成功')
        } else {
          this.$$message.error('收藏失败')
        }
      }
      docInfo.isFavorite = !docInfo.isFavorite
      var page = this.docListInfo.pageNum
      var teamId = this.$route.params.id
      const { data: res2 } = await this.$http.get(
        '/doc/group/' + teamId + '/?token=' + token + '&page=' + page
      )
      if (res2 === '查询结果为空') {
        this.$message.error('获取列表失败')
      }
      this.docList = res2
      this.docListInfo.total = this.docList[0].total
    },

    // 重命名文档!!!!!!!!!!!!!!!!!!!!!!!未完成!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    async renameDoc(docInfo) {
      // 传输
      // 判断
      // 错误
      // 消息提示
      // 成功
      // 关闭对话框
      this.renameDocDialogVisible = false
      // 成功消息提示
      var token = window.sessionStorage.getItem('token')
      var patchform = {
        title: this.renameDocForm.newName
      }
      const { data: res } = await this.$http.patch(
        '/doc/' + this.renameDocForm.userId + '/?token=' + token,
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
      var page = this.docListInfo.pageNum
      var teamId = this.$route.params.id
      const { data: res2 } = await this.$http.get(
        '/doc/group/' + teamId + '/?token=' + token + '&page=' + page
      )
      this.docList = res2
      this.docListInfo.total = this.docList[0].total
    },

    // 删除文档!!!!!!!!!!!!!!!!!!!!!!!未完成!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    async deleteDoc(docInfo) {
      //
      // 传输
      // 判断成功
      // 消息提示
      var token = window.sessionStorage.getItem('token')
      var patchform = {
        delete: '1'
      }
      const { data: res } = await this.$http.patch(
        '/doc/' + docInfo.id + '/?token=' + token,
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
      var page = this.docListInfo.pageNum
      var teamId = this.$route.params.id
      const { data: res2 } = await this.$http.get(
        '/doc/group/' + teamId + '/?token=' + token + '&page=' + page
      )
      this.docList = res2
      this.docListInfo.total = this.docList[0].total
    },

    // 对话框------------------------------------------------------------

    // 展示设置权限的对话框
    showSetAuthDialog(docInfo) {
      // 获取文档名称
      // 展示重命名文档的对话框
      this.docAuth.docId = docInfo.id
      this.setAuthDialogVisible = true
      this.docAuth.auth = docInfo.auth
      if (this.docAuth.auth === 0) {
        this.docAuth.label = '私密文档'
      } else if (this.docAuth.auth === 1) {
        this.docAuth.label = '他人可读'
      } else if (this.docAuth.auth === 2) {
        this.docAuth.label = '他人可读/评论'
      } else {
        this.docAuth.label = '他人可读/编辑/评论'
      }
    },

    // 展示重命名文档的对话框
    showrenameDocDialog(id) {
      // 获取文档名称
      // 展示重命名文档的对话框
      this.renameDocDialogVisible = true
      this.renameDocForm.userId = id
    },

    // 监听------------------------------------------------------------

    // 监听分享文档对话框的关闭事件
    shareDocDialogClosed() {
      this.shareDocDialogVisible = false
      // 重置对话框中输入框内容
      this.$refs.shareDocFormRef.resetFields()
    },

    // 监听修改权限对话框的关闭事件
    setAuthDialogClosed() {
      this.setAuthDialogVisible = false
      // 重置对话框中输入框内容
      this.docAuth.status = 0
      this.docAuth.label = ''
    },
    // 监听pageSize的改变!!!!!!!!!!!!!!!!!!!!!!!未完成!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    handleSizeChange(newSize) {
      this.docListInfo.pageSize = newSize
      // 重新获取数据：判断列表类型，复用对应获取方法
    },

    // 监听页码值的改变!!!!!!!!!!!!!!!!!!!!!!!未完成!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    handleCurrentChange(newPage) {
      this.docListInfo.pageNum = newPage
      this.getTeamDoc()
    },

    // 监听重命名文档对话框的关闭事件
    renameDocDialogClosed() {
      // 重置对话框中输入框内容
      this.$refs.renameDocFormRef.resetFields()
    }
  }
}
</script>
<style lang="less" scoped>
.el-container {
  width: 1300px;
  height: 800px;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.el-header {
  width: 1300px;
  height: 100px !important;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.spaceinfo,
.manage {
  margin: 0;
  padding: 0;
  position: absolute;
  top: 30px;
  left: 50px;
  color: rgb(150, 150, 150);
  background-color: transparent;
  border: none;
}
.manage {
  left: 200px;
}
.spaceinfo:hover,
.manage:hover {
  color: rgb(50, 50, 50);
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  background-color: transparent;
}
.switchbtns {
  position: absolute;
  top: 15px;
  right: 300px;
}
.switchbtns .el-button {
  width: 30px;
  height: 30px;
  margin: 0;
  padding: 0;
  color: rgb(150, 150, 150);
  background-color: transparent;
  border: none;
}
.switchbtns .el-button:hover {
  color: rgb(50, 50, 50);
}
.switchbtns .el-button:active {
  color: rgb(50, 50, 50);
  transform: translateY(1px);
  -webkit-transform: translateY(1px);
}
.switchbtns .el-button:focus {
  color: rgb(50, 50, 50);
}
.doclist {
  width: 1000px;
  max-height: 630px;
  margin-bottom: 20px;
}
.docname {
  color: rgb(50, 50, 50);
  font-weight: 600;
}
/deep/ .el-table {
  border: none;
}
/deep/ .membership .el-table {
  margin-top: 10px;
  border: none;
}
/deep/ .el-table__header tr,
/deep/ .el-table__header th {
  height: 50px;
  padding: 0;
}
/deep/ .el-table__body tr,
/deep/ .el-table__body td {
  height: 50px;
  padding: 0;
}
/deep/ .membership .el-table__header tr,
/deep/ .membership .el-table__header th {
  height: 40px;
  padding: 0;
}
/deep/ .membership .el-table__body tr,
/deep/ .membership .el-table__body td {
  height: 40px;
  padding: 0;
}
/deep/ .el-table .el-table__header-wrapper tr th {
  color: rgb(50, 50, 50);
  background-color: whitesmoke !important;
}
/deep/ .el-table .el-table__row {
  color: rgb(50, 50, 50);
  background-color: whitesmoke !important;
}
/deep/ .membership .el-table .el-table__header-wrapper tr th {
  color: rgb(50, 50, 50);
  background-color: white !important;
}
/deep/ .membership .el-table .el-table__row {
  color: rgb(50, 50, 50);
  background-color: white !important;
}
/deep/ .el-table .el-table__body tr.current-row > td {
  background-color: rgb(238, 238, 238) !important;
}
/deep/ .el-table .el-table__body tr:hover > td {
  background-color: rgb(238, 238, 238) !important;
}
/deep/ .membership .el-table .el-table__body tr.current-row > td {
  background-color: whitesmoke !important;
}
/deep/ .membership .el-table .el-table__body tr:hover > td {
  background-color: whitesmoke !important;
}
/deep/ .el-table td,
/deep/ .el-table th.is-leaf {
  border-bottom: 1px solid rgb(221, 221, 221);
}
/deep/ .membership .el-table th.is-leaf {
  border-bottom: 1px solid rgb(150, 150, 150);
}
/deep/ .membership .el-table td {
  border-bottom: none;
}
/deep/ .el-table .ascending .sort-caret.ascending {
  border-bottom-color: rgb(50, 50, 50);
}
/deep/ .el-table .descending .sort-caret.descending {
  border-top-color: rgb(50, 50, 50);
}
.favbtn,
.morebtn {
  margin-right: 10px;
  color: rgb(150, 150, 150);
  background-color: transparent;
  border: none;
}
.favbtn:hover,
.morebtn:hover {
  color: rgb(50, 50, 50);
  background-color: transparent;
}
.favbtn:active {
  color: rgb(50, 50, 50);
  background-color: transparent;
  transform: translateY(1px);
  -webkit-transform: translateY(1px);
}
.favbtn:focus,
.morebtn:focus {
  color: rgb(50, 50, 50);
  background-color: transparent;
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
.docblock {
  width: 1300px;
  margin-bottom: 20px;
  display: grid;
  grid-auto-flow: row dense;
  place-content: flex-start center;
  grid-template-columns: repeat(4, 300px);
  grid-template-rows: repeat(autofill, 100px);
  grid-gap: 5px;
  white-space: normal;
}
.block {
  width: 300px;
  height: 100px;
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid rgb(231, 231, 231);
  background-color: white;
  transition: 0.2s ease-in-out;
  -webkit-transition: 0.2s ease-in-out;
}
.block:hover {
  box-shadow: 0 0 6px rgb(206, 206, 206);
  cursor: pointer;
  transition: 0.2s ease-in-out;
  -webkit-transition: 0.2s ease-in-out;
}
.block:hover #title {
  font-weight: 600;
}
.img-doc {
  height: 55px;
  margin: 0;
  margin-left: 30px;
  margin-right: 20px;
  opacity: 0.5;
  transition: 0.2s ease-in-out;
  -webkit-transition: 0.2s ease-in-out;
}
.block:hover .img-doc {
  opacity: 1;
  transition: 0.2s ease-in-out;
  -webkit-transition: 0.2s ease-in-out;
}
.menu {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 14px;
}
.menu .info {
  width: 100%;
  margin: 3px 0;
  color: rgb(172, 172, 172);
}
.el-dropdown .el-button {
  width: 30px;
  height: 30px;
  margin: 0;
  padding: 0;
  position: relative;
  right: 10px;
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
.defaultlog .el-button {
  width: 100px;
  height: 40px;
  margin: 0;
  position: absolute;
  top: 84px;
  right: 20px;
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
.defaultlog .el-button:hover {
  color: white;
}
.defaultlog .el-button:active {
  background: linear-gradient(
    -20deg,
    rgb(85, 85, 85) 0%,
    rgb(100, 100, 100) 60%,
    rgb(85, 85, 85) 100%
  );
  box-shadow: none;
}
.defaultlog .el-button:focus {
  color: white;
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
.manalog-inner {
  width: 100%;
  height: 400px;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.manalog-inner .el-table {
  width: 900px;
}
.infolog span,
.manalog span {
  margin: 5px 0;
  color: rgb(50, 50, 50);
  font-size: 15px;
}
.disband {
  width: 140px;
  height: 35px;
  margin: 0;
  position: absolute;
  top: 70px;
  right: 50px;
  color: white;
  font-size: 13px;
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
  z-index: 99;
}
.disband:hover {
  color: white;
}
.disband:active {
  background: linear-gradient(
    -20deg,
    rgb(85, 85, 85) 0%,
    rgb(100, 100, 100) 60%,
    rgb(85, 85, 85) 100%
  );
  box-shadow: none;
}
.disband:focus {
  color: white;
}
.removebtn {
  color: rgb(85, 85, 85);
  border: 1px solid rgb(85, 85, 85);
  border-radius: 5px;
  background-color: white;
}
.removebtn:hover {
  color: rgb(85, 85, 85);
  background-color: white;
  border: 1px solid rgb(85, 85, 85);
}
.removebtn:active {
  color: rgb(50, 50, 50);
  background: linear-gradient(
    -20deg,
    rgb(235, 235, 235) 0%,
    whitesmoke 60%,
    rgb(235, 235, 235) 100%
  );
  border: 1px solid rgb(50, 50, 50);
}
.removebtn:focus {
  color: rgb(85, 85, 85);
  background-color: white;
  border: 1px solid rgb(85, 85, 85);
}
.disbandlog .el-button {
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
.disbandlog .el-button:hover {
  color: white;
}
.disbandlog .el-button:active {
  background: linear-gradient(
    -20deg,
    rgb(85, 85, 85) 0%,
    rgb(100, 100, 100) 60%,
    rgb(85, 85, 85) 100%
  );
  box-shadow: none;
}
</style>
