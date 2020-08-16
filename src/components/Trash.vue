<template>
  <div class="container">
    <!-- 头部区域 -->
    <div class="header">
      <h2>回收站</h2>
      <div>
        <!-- 清空回收站按钮 -->
        <el-button @click="deleteAllDialogVisible">清空回收站</el-button>
      </div>
    </div>

    <!-- 文档区域 -->
    <div class="docList">
      <!-- 文档列表 -->
      <el-table
        :data="docList"
        :default-sort="{ prop: 'title', order: 'ascending' }"
      >
        <el-table-column prop="title" label="文件名" sortable width="180">
        </el-table-column>
        <el-table-column
          prop="lasteditor"
          label="删除时间"
          sortable
          width="180"
        >
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <!-- 设置按钮下拉菜单 -->
            <el-dropdown>
              <!-- 设置按钮 -->
              <el-button size="mini" icon="el-icon-setting" circle></el-button>
              <el-dropdown-menu class="dropdown-menu" slot="dropdown">
                <el-dropdown-item @click.native="restoreFile(scope.row)">
                  <span>恢复文件</span>
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

    <!-- 分页区域 -->
    <div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="docListInfo.pageNum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="docListInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="docListInfo.total"
      >
      </el-pagination>
    </div>

    <!-- 清空回收站对话框 -->
    <el-dialog
      title="清空回收站"
      :visible.sync="deleteAllDialogVisible"
      width="30%"
      center
    >
      <span>回收站中所有文件将会被彻底删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteAllDialogVisible = false">取 消</el-button>
        <el-button type="danger" @click="deleteAll">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      // 存储数据-------------------------------------------------------------------

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
        // 每页显示的文档数
        pageSize: 2,
        // 每页显示的文档数
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

      // 对话框的可见属性------------------------------------------------------------

      // 清空回收站对话框的可见属性
      deleteAllDialogVisible: false
    }
  },
  mounted() {},
  methods: {
    // 清空回收站
    deleteAll() {
      // 传输数据
    },
    // 恢复文件
    restoreFile(doc) {
      // 发送数据
      // 刷新
      // 消息提示
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
    },
    // 彻底删除
    deleteDoc(doc) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 发送数据
          // 刷新
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 监听pageSize的改变
    handleSizeChange(newSize) {
      this.docListInfo.pageSize = newSize
      // 重新获取数据：判断列表类型，复用对应获取方法
    },

    // 监听页码值的改变
    handleCurrentChange(newPage) {
      this.docListInfo.pageNum = newPage
      // 重新获取数据：判断列表类型，复用对应获取方法
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  width: 65%;
  max-height: 800px;
  position: absolute;
  left: 50%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  transform: translateX(-50%);
  -webkit-transform: translateX(-50%);
}
.header {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.content {
  width: 100%;
  display: grid;
}
.template {
  width: 300px;
  height: 100px;
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: white;
  box-shadow: 0 0 4px rgb(206, 206, 206);
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
