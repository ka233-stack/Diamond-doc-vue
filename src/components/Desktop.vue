<template>
  <div class="container">
    <!-- 头部区域 -->
    <div class="header">
      <h2>我的桌面</h2>
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
        <el-table-column prop="lasteditor" label="最后编辑者" width="140">
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

    <!-- 分享文档对话框 -->
    <el-dialog
      title="分享文档链接"
      :visible.sync="shareDocDialogVisible"
      width="40%"
      @close="shareDocDialogClosed"
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
          docId: 1,
          isFavorite: true,
          title: '文档名2',
          nickname: '王小虎1',
          createtime: '05-02 10：12',
          updatetime: '05-02 10：12',
          lasteditor: '王小2'
        },
        {
          docId: 3,
          isFavorite: false,
          title: '文档名4',
          nickname: '王小虎2',
          createtime: '05-02 10：12',
          updatetime: '05-02 10：41',
          lasteditor: '王小3'
        },
        {
          docId: 2,
          isFavorite: false,
          title: '文档名1',
          nickname: '王小虎3',
          createtime: '05-02 10：12',
          updatetime: '05-02 10：51',
          lasteditor: '王小4'
        },
        {
          docId: 6,
          isFavorite: true,
          title: '文档名3',
          nickname: '王小虎4',
          createtime: '05-02 10：12',
          updatetime: '05-02 10：01',
          lasteditor: '王小1'
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

      // 对话框的可见属性----------------------------------------------------------

      // 修改密码对话框的可见属性
      shareDocDialogVisible: false,

      // 控制重命名文档对话框的显示
      renameDocDialogVisible: false,

      // 辅助--------------------------------------------------------------------

      // 切换文档
      isListShow: false
    }
  },
  created() {
    // 数据初始化
    // 获取团队文档列表
    this.getDocList()
  },
  methods: {
    // 文档列表------------------------------------------------------------

    // 获取文档
    getDocList() {},

    // 打开文档
    openDoc() {
      alert('111')
      // 跳转
    },

    // 分享文档
    shareDoc(docInfo) {
      // 传输
      var url = window.location.href.replace('desktop', 'doc/' + docInfo.docId)
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

    // 监听pageSize的改变!!!!!!!!!!!!!!!!!!!!!!!未完成!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    handleSizeChange(newSize) {
      this.docListInfo.pageSize = newSize
      // 重新获取数据：判断列表类型，复用对应获取方法
    },

    // 监听页码值的改变!!!!!!!!!!!!!!!!!!!!!!!未完成!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    handleCurrentChange(newPage) {
      this.docListInfo.pageNum = newPage
      // 重新获取数据：判断列表类型，复用对应获取方法
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
.container {
  width: 70%;
  max-height: 800px;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.el-menu {
  width: 800px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-menu-item {
  width: 100px;
  height: 50px;
  margin: 0 60px;
  line-height: 50px;
}
.doclist {
  width: 1200px;
  margin-top: 30px;
}
</style>
