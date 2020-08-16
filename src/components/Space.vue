<template>
  <div>
    <!-- 头部区域 -->
    <div class="header">
      <!-- 团队空间名称 -->
      <div>
        <h2>{{ teamInfo.teamName }}</h2>
      </div>
      <!-- 按钮区域 -->
      <div>
        <!-- 团队信息按钮 -->
        <el-button @click="teamInfoDialogVisible = true">
          <span>团队信息</span>
        </el-button>
        <!-- 管理团队按钮 -->
        <el-button @click="manageTeamDialogVisible = true">
          <span>管理团队</span>
        </el-button>
      </div>
    </div>

    <!-- 文档显示区域 -->
    <div class="doclist">
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
        <el-table-column prop="lastEditor" label="最后编辑者" width="140">
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
                  @click.native="showrenameDocDialog(scope.row.docId)"
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
      <el-table
        :data="teamInfo.memberList"
        max-height="350"
        :default-sort="{ prop: 'nickname', order: 'ascending' }"
      >
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

    <!-- 确认解散团队对话框 -->
    <el-dialog
      title="确认解散团队"
      :visible.sync="dissolveTeamDialogVisible"
      width="30%"
      center
    >
      <span>解散团队将会失去所有团队文档</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dissolveTeamDialogVisible = false">取 消</el-button>
        <el-button type="danger" @click="dissolveTeam">确 定</el-button>
      </span>
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
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="docListInfo.total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
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
          lastEditor: '王小2'
        },
        {
          id: 3,
          isFavorite: false,
          title: '文档名4',
          nickname: '王小虎2',
          createtime: '05-02 10：12',
          updatetime: '05-02 10：41',
          lastEditor: '王小3'
        },
        {
          id: 2,
          isFavorite: false,
          title: '文档名1',
          nickname: '王小虎3',
          createtime: '05-02 10：12',
          updatetime: '05-02 10：51',
          lastEditor: '王小4'
        },
        {
          id: 6,
          isFavorite: true,
          title: '文档名3',
          nickname: '王小虎4',
          createtime: '05-02 10：12',
          updatetime: '05-02 10：01',
          lastEditor: '王小1'
        }
      ],

      // 表单---------------------------------------------------------------------

      // 分享文档链接对象
      shareDocForm: {
        url: ''
      },

      // 重命名文档名称对象
      renameDocForm: {
        newName: ''
      },

      // 验证规则--------------------------------------------------------------------

      // 添加成员的验证规则对象
      addMemberRules: {
        userId: [
          { required: true, message: 'ID不能为空', trigger: 'blur' },
          { type: 'number', message: '请输入数字ID', trigger: 'blur' }
        ]
      },

      // 对话框的可见属性------------------------------------------------------------

      // 团队信息对话框的可见属性
      teamInfoDialogVisible: false,

      // 管理团队对话框的可见属性
      manageTeamDialogVisible: false,

      // 解散团队确认对话框的可见属性
      dissolveTeamDialogVisible: false,

      // 控制重命名文档对话框的显示
      renameDocDialogVisible: false,

      // 辅助--------------------------------------------------------------------

      // 切换文档
      isListShow: false
    }
  },
  created() {
    // 获取团队信息
    this.getTeamInfo()

    // 获取团队文档列表
    this.getDocList()
  },
  methods: {
    // 管理团队------------------------------------------------------------

    // 获取团队信息!!!!!!!!!!!!!!!!!!!!!!!未完成!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    getTeamInfo() {},

    // 解散团队!!!!!!!!!!!!!!!!!!!!!!!未完成!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    dissolveTeam() {
      // 隐藏对话框
      this.addMemberDialogVisible = false
      // 消息提示
      this.$message.success('解散团队成功')
      // 跳转
    },

    // 移除成员!!!!!!!!!!!!!!!!!!!!!!!未完成!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    removeMember(member) {
      // 检查是否是管理者，管理者不能被移除
      this.$message.error('管理者不能被移除')
      // 消息提示
      this.$message.success('移除成员成功')
    },

    // 文档列表------------------------------------------------------------

    // 获取团队文档!!!!!!!!!!!!!!!!!!!!!!!未完成!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    getDocList() {},

    // 打开文档!!!!!!!!!!!!!!!!!!!!!!!未完成!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    openDoc() {
      // 跳转
    },

    // 分享文档
    shareDoc(docInfo) {
      // 传输
      var url = window.location.href.replace(
        'dashboard',
        'doc/' + docInfo.docId
      )
      this.shareDocForm.url = url
      this.shareDocDialogVisible = true
    },

    // 收藏文档!!!!!!!!!!!!!!!!!!!!!!!未完成!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    changeFavState(docInfo) {
      // 传输
      // 判断成功
      // 消息提示
      this.$message({
        showClose: true,
        message: docInfo.isFavorite ? '取消收藏成功' : '收藏成功',
        type: 'success'
      })
      // 改变收藏状态
      docInfo.isFavorite = !docInfo.isFavorite
    },

    // 重命名文档!!!!!!!!!!!!!!!!!!!!!!!未完成!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    renameDoc(docInfo) {
      // 传输
      // 判断
      // 错误
      // 消息提示
      this.$message.error('重命名文档')
      // 成功
      // 关闭对话框
      this.renameDocDialogVisible = false
      // 成功消息提示
      this.$message.success('重命名成功')
    },

    // 删除文档!!!!!!!!!!!!!!!!!!!!!!!未完成!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    deleteDoc(docInfo) {
      //
      // 传输
      // 判断成功
      // 消息提示
      this.$message.success('删除成功')
    },

    // 对话框------------------------------------------------------------

    // 展示重命名文档的对话框
    showrenameDocDialog(docId) {
      // 获取文档名称
      // 展示重命名文档的对话框
      this.renameDocDialogVisible = true
    },

    // 监听------------------------------------------------------------

    // 监听pageSize的改变
    handleSizeChange(newSize) {
      this.docListInfo.pageSize = newSize
      // 重新获取数据
    },

    // 监听页码值的改变
    handleCurrentChange(newPage) {
      this.docListInfo.pageNum = newPage
      // 重新获取数据
    },

    // 监听分享文档对话框的关闭事件
    shareDocDialogClosed() {
      this.shareDocDialogVisible = false
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
</style>
