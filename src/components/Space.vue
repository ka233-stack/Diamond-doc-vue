<template>
  <div>
    <!-- 头部区域 -->
    <div class="header">
      <!-- 团队空间名称 -->
      <h2>{{teamInfo.teamName}}</h2>
    </div>
    <!-- 文档显示区域 -->
    <div>
      <el-table
        :data="docList"
        :default-sort="{ prop: 'title', order: 'ascending' }"
      >
        <el-table-column prop="title" label="文件名" sortable width="180">
        </el-table-column>
        <el-table-column prop="owner" label="创建者" width="180">
        </el-table-column>
        <el-table-column prop="creationTime" label="创建时间" sortable>
        </el-table-column>
        <el-table-column prop="lastEditTime" label="最后打开时间" sortable>
        </el-table-column>
        <el-table-column prop="lastEditor" label="最后编辑者" width="180">
        </el-table-column>
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
                <el-dropdown-item @click.native="renameDoc(scope.row)">
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
  </div>
</template>
<script>
// export 表示导出,在自定义组件里面使用export default导出
export default {
  components: {},
  data() {
    return {
      // 团队信息
      teamInfo: {
        teamId: '1',
        teamName: '123123',
        teamCreator: '顺丰到付',
        teamMemberList: [{}]
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
        // 每页显示的文档数
        pageSize: 2,
        // 每页显示的文档数
        total: 32
      },
      // 文档列表
      docList: [
        {
          id: 1,
          isFavorite: true,
          title: '文档名2',
          owner: '王小虎1',
          creationTime: '05-02 10：12',
          lastEditTime: '05-02 10：12',
          lastEditor: '王小2'
        },
        {
          id: 3,
          isFavorite: false,
          title: '文档名4',
          owner: '王小虎2',
          creationTime: '05-02 10：12',
          lastEditTime: '05-02 10：41',
          lastEditor: '王小3'
        },
        {
          id: 2,
          isFavorite: false,
          title: '文档名1',
          owner: '王小虎3',
          creationTime: '05-02 10：12',
          lastEditTime: '05-02 10：51',
          lastEditor: '王小4'
        },
        {
          id: 6,
          isFavorite: true,
          title: '文档名3',
          owner: '王小虎4',
          creationTime: '05-02 10：12',
          lastEditTime: '05-02 10：01',
          lastEditor: '王小1'
        }
      ]
    }
  },
  mounted() {},
  methods: {
    // 获取我创建的的文档
    getOwn() {
      // 发送数据
      // 高亮激活
      // 渲染
    },
    alert() {
      alert('111')
    },
    // 打开文档
    openDoc() {
      alert('111')
      // 跳转
    },
    // 分享文档
    shareDoc(docInfo) {
      // 传输
      // 判断成功
      // 消息提示
      this.$message({
        showClose: true,
        message: '分享成功',
        type: 'success'
      })
    },
    // 收藏文档
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
    // 重命名文档
    renameDoc(docInfo) {
      // 重命名
      // 传输
      // 判断成功
      // 消息提示
      this.$message({
        showClose: true,
        message: '重命名成功',
        type: 'success'
      })
    },
    // 删除文档
    deleteDoc(docInfo) {
      //
      // 传输
      // 判断成功
      // 消息提示
      this.$message({
        showClose: true,
        message: '删除成功',
        type: 'success'
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
