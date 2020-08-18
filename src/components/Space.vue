<template>
  <div>
    <!-- 头部区域 -->
    <div class="header">
      <!-- 团队空间名称 -->
      <h2>{{ teamInfo.teamName }}</h2>

      <!-- 团队信息按钮 -->
      <div>
        <el-button class="newdoc" @click="teamInfoDialogVisible = true">
          <span>团队信息</span>
        </el-button>
      </div>

      <!-- 管理团队按钮 -->
      <div v-if="teamInfo.isManager">
        <el-button class="newdoc" @click="manageTeamDialogVisible = true">
          <span>管理团队</span>
        </el-button>
      </div>
    </div>

    <div>
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

    <!-- 文档列表显示区域 -->
    <div class="doclist" v-if="isListShow">
      <!-- 文档列表 -->
      <el-table
        :data="docList"
        :default-sort="{ prop: 'title', order: 'ascending' }"
      >
        <!-- 文件名 -->
        <el-table-column prop="title" label="文件名" sortable width="180">
          <template slot-scope="scope">
            <!-- 文件名 -->
            <el-button @click.native="openDoc(scope.row)" type="text" circle>
              {{ scope.row.title }}
            </el-button>
          </template>
        </el-table-column>

        <!-- 创建者 -->
        <el-table-column prop="nickname" label="创建者" width="100">
        </el-table-column>

        <!-- 创建时间 -->
        <el-table-column
          prop="createtime"
          label="创建时间"
          sortable
          width="140"
        >
        </el-table-column>

        <!-- 最后打开时间 -->
        <el-table-column
          prop="updatetime"
          label="最后编辑时间"
          sortable
          width="140"
        >
        </el-table-column>

        <!-- 最后编辑者 -->
        <el-table-column
          prop="lasteditor_nickname"
          label="最后编辑者"
          width="140"
        >
        </el-table-column>

        <!-- 按钮 -->
        <el-table-column>
          <template slot-scope="scope">
            <!-- 收藏按钮 -->
            <el-button
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
              <el-button size="mini" icon="el-icon-setting" circle></el-button>

              <el-dropdown-menu class="dropdown-menu" slot="dropdown">
                <el-dropdown-item @click.native="shareDoc(scope.row)">
                  <span>分享</span>
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
    <div class="docblock" v-if="!isListShow">
      <div v-for="item in docList" :key="item.id">
        <!-- 文档块 -->
        <!--class='template'部分为块分布模板-->
        <div class="block" @click="openDoc(item)">
          <!-- 文档图片 -->
          <div>
            <img class="img-doc" src="../assets/img/doc.jpg" alt="文档" />
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
              icon="el-icon-more"
              style="transform: rotate(90deg);"
            ></el-button>
            <!-- 文档管理下拉菜单 -->
            <el-dropdown-menu class="dropdown-menu" slot="dropdown">
              <el-dropdown-item @click.native="shareDoc(item)">
                <span>分享</span>
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
      title="团队信息"
      :visible.sync="teamInfoDialogVisible"
      width="80%"
    >
      <!-- 管理者 -->
      <div>
        <span>管理者：{{ teamInfo.teamCreator }}</span>
      </div>
      <!-- 成员信息 -->
      <div>
        <span>成员信息：</span>
      </div>
      <el-table :data="teamInfo.memberList">
        <el-table-column prop="nickname" label="昵称" sortable>
        </el-table-column>
        <el-table-column prop="username" label="用户名" sortable>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" sortable> </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 管理团队框 -->
    <el-dialog
      title="管理团队"
      :visible.sync="manageTeamDialogVisible"
      width="80%"
    >
      <!-- 解散团队按钮 -->
      <div>
        <el-button @click="dissolveTeamDialogVisible = true">
          <span>解散团队</span>
        </el-button>
      </div>
      <!-- 成员信息 -->
      <div>
        <h3>成员信息</h3>
        <el-table
          :data="teamInfo.memberList"
          max-height="350"
          :default-sort="{ prop: 'nickname', order: 'ascending' }"
        >
          <el-table-column prop="nickname" label="昵称" sortable>
          </el-table-column>
          <el-table-column prop="username" label="用户名" sortable>
          </el-table-column>
          <el-table-column prop="email" label="邮箱" sortable>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <el-button @click="removeMember(scope.row)" size="mini">
                <span>移出团队</span>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!-- 确认对话框 -->
    <el-dialog
      title="确认解散团队"
      :visible.sync="dissolveTeamDialogVisible"
      width="30%"
      center
    >
      <span>这将会删除所有队员并丢失团队空间中所有文件！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dissolveTeamDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dissolveTeam">确 定</el-button>
      </span>
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

    <!-- 重命名文档对话框 -->
    <el-dialog
      title="重命名文档"
      :visible.sync="renameDocDialogVisible"
      width="40%"
      @close="renameDocDialogClosed"
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="renameDocDialogVisible = false">取 消</el-button>
        <el-button @click="renameDoc">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分页区域 -->
    <div>
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
  </div>
</template>
<script>
// export 表示导出,在自定义组件里面使用export default导出
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
        isManager: true,
        memberList: [
          {
            id: 1,
            nickname: 'user1',
            username: 'user1',
            email: 'user1@qq.com'
          },
          {
            id: 2,
            nickname: 'user2',
            username: 'user2',
            email: 'user2@qq.com'
          },
          {
            id: 4,
            nickname: 'user4',
            username: 'user4',
            email: 'user4@qq.com'
          },
          {
            id: 3,
            nickname: 'user3',
            username: 'user3',
            email: 'user3@qq.com'
          },
          {
            id: 6,
            nickname: 'user6',
            username: 'user6',
            email: 'user6@qq.com'
          },
          {
            id: 5,
            nickname: 'user5',
            username: 'user5',
            email: 'user5@qq.com'
          },
          {
            id: 9,
            nickname: 'user9',
            username: 'user9',
            email: 'user9@qq.com'
          },
          {
            id: 7,
            nickname: 'user7',
            username: 'user7',
            email: 'user7@qq.com'
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

      // 重命名文档名称对象
      renameDocForm: {
        userId: '',
        newName: ''
      },

      // 对话框的可见属性----------------------------------------------------------

      // 团队信息对话框的可见属性
      teamInfoDialogVisible: false,

      // 管理团队对话框的可见属性
      manageTeamDialogVisible: false,

      // 解散团队对话框的可见属性
      dissolveTeamDialogVisible: false,

      // 分享对话框的可见属性
      shareDocDialogVisible: false,

      // 控制重命名文档对话框的显示
      renameDocDialogVisible: false,

      // 辅助--------------------------------------------------------------------

      // 切换文档
      isListShow: false
    }
  },
  created() {
    this.getTeamInfo()
    this.getTeamDoc()
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
      if (
        res === '请先登录' ||
        res === '该文档正在被编辑' ||
        res === '无权限'
      ) {
        this.$message.error('获取列表失败')
      }
      this.teamInfo.memberList = res.member
      this.teamInfo.teamCreator = res.leader.nickname
    },

    // 获取团队文档
    async getTeamDoc() {
      var token = window.sessionStorage.getItem('token')
      var page = this.docListInfo.pageNum
      var teamId = this.$route.params.id
      const { data: res } = await this.$http.get(
        '/doc/group/' + teamId + '/?token=' + token + '&page=' + page
      )
      if (res === '查询结果为空') {
        this.$message.error('获取列表失败')
      }
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

    // 文档列表---------------------------------------------------------------

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
      if (res2 === '查询结果为空') {
        this.$message.error('获取列表失败')
      }
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
      if (res2 === '查询结果为空') {
        this.$message.error('获取列表失败')
      }
      this.docList = res2
      this.docListInfo.total = this.docList[0].total
    },

    // 对话框------------------------------------------------------------

    // 展示重命名文档的对话框
    showrenameDocDialog(id) {
      // 获取文档名称
      // 展示重命名文档的对话框
      this.renameDocDialogVisible = true
      this.renameDocForm.userId = id
    },

    // 监听------------------------------------------------------------

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
.desktop-container {
  height: 100%;
}
.el-header {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  padding-left: 0px;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
    font-size: 20px;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #e6e6e6;
}
.el-main {
  background-color: #f7f7f7;
}
.doclist {
  width: 1200px;
  margin-top: 30px;
}
.docblock {
  width: 100%;
  display: grid;
  grid-auto-flow: row dense;
  place-content: flex-start start;
  grid-template-columns: repeat(4, 300px);
  grid-template-rows: repeat(auto-fill, 100px);
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
.img-doc {
  width: 60px;
  height: 60px;
  margin: 0 20px;
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
  border: none;
  background-color: transparent;
}
</style>
