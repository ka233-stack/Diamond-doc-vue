<template>
  <div class="container">
    <!-- 头部区域 -->
    <div class="header">
      <h2>回收站</h2>
      <div>
        <!-- 清空回收站按钮 -->
        <el-button @click="deleteAllDialogVisible = true">清空回收站</el-button>
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
        </el-table-column>

        <!-- 删除时间 -->
        <el-table-column prop="nickname" label="删除时间" width="100">
        </el-table-column>

        <!-- 按钮 -->
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
                  <span>彻底删除</span>
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
                <span>删除时间</span>
              </div>
              <div>
                <span>{{ item.updatetime }}</span>
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
              <el-dropdown-item @click.native="restoreFile(item)">
                <span>恢复文件</span>
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

    <!-- 清空回收站对话框 -->
    <el-dialog
      title="确认清空回收站"
      :visible.sync="deleteAllDialogVisible"
      width="30%"
      center
    >
      <span>这将会删除回收站中所有文件！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteAllDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteAll">确 定</el-button>
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
export default {
  components: {},
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

      // 对话框的可见属性----------------------------------------------------------

      // 分享对话框的可见属性
      deleteAllDialogVisible: false,

      // 辅助--------------------------------------------------------------------

      // 切换文档
      isListShow: false
    }
  },
  created() {
    this.getTrash()
  },
  methods: {
    // 获取回收站文件信息
    async getTrash() {
      var token = window.sessionStorage.getItem('token')
      var page = this.docListInfo.pageNum
      const { data: res } = await this.$http.get(
        '/doc/bin/?token=' + token + '&page=' + page
      )
      if (res === '查询结果为空') {
        this.$message.error('获取列表失败')
      }
      this.docList = res
      this.docListInfo.total = this.docList[0].total
    },

    // 清空回收站
    async deleteAll() {
      // 弹窗确认
      this.deleteAllDialogVisible = false
      // 传输数据
      var token = window.sessionStorage.getItem('token')
      const { data: res } = await this.$http.patch('/doc/bin/?token=' + token)
      if (res === '成功') {
        this.$message.success('成功清空回收站')
      } else {
        this.$message.error('清空回收站失败')
      }
      var page = this.docListInfo.pageNum
      const { data: res2 } = await this.$http.get(
        '/doc/bin/?token=' + token + '&page=' + page
      )
      if (res2 === '查询结果为空') {
        this.$message.error('获取列表失败')
      }
      this.docList = res2
      this.docListInfo.total = this.docList[0].total
    },
    // 恢复文件
    async restoreFile(doc) {
      // 发送数据
      // 刷新
      // 消息提示
      var token = window.sessionStorage.getItem('token')
      var patchform = {
        delete: '0'
      }
      const { data: res } = await this.$http.patch(
        '/doc/' + doc.id + '/?token=' + token,
        patchform
      )
      if (
        res === '请先登录' ||
        res === '该文档正在被编辑' ||
        res === '无权限'
      ) {
        this.$message.error('恢复失败')
      } else {
        this.$message.success('恢复成功')
      }
      var page = this.docListInfo.pageNum
      const { data: res2 } = await this.$http.get(
        '/doc/bin/?token=' + token + '&page=' + page
      )
      if (res2 === '查询结果为空') {
        this.$message.error('获取列表失败')
      }
      this.docList = res2
      this.docListInfo.total = this.docList[0].total
    },
    // 彻底删除
    async deleteDoc(doc) {
      var token = window.sessionStorage.getItem('token')
      var patchform = {
        delete: '2'
      }
      const { data: res } = await this.$http.patch(
        '/doc/' + doc.id + '/?token=' + token,
        patchform
      )
      if (
        res === '请先登录' ||
        res === '该文档正在被编辑' ||
        res === '无权限'
      ) {
        this.$message.error('彻底删除失败')
      } else {
        this.$message.success('彻底删除成功')
      }
      var page = this.docListInfo.pageNum
      const { data: res2 } = await this.$http.get(
        '/doc/bin/?token=' + token + '&page=' + page
      )
      if (res2 === '查询结果为空') {
        this.$message.error('获取列表失败')
      }
      this.docList = res2
      this.docListInfo.total = this.docList[0].total
    },

    // 监听------------------------------------------------------------

    // 监听pageSize的改变
    handleSizeChange(newSize) {
      this.docListInfo.pageSize = newSize
      // 重新获取数据：判断列表类型，复用对应获取方法
    },

    // 监听页码值的改变
    handleCurrentChange(newPage) {
      this.docListInfo.pageNum = newPage
      this.getTrash()
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
