<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <h3>回收站</h3>
      <!-- 清空回收站按钮 -->
      <el-button class="clear" @click="deleteAllDialogVisible = true"
        >清空回收站</el-button
      >
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
          width="400"
          align="center"
          header-align="center"
        ></el-table-column>
        <!-- 删除时间 -->
        <el-table-column
          prop="nickname"
          label="删除时间"
          width="200"
          align="center"
          header-align="center"
        ></el-table-column>
        <!-- 按钮 -->
        <el-table-column align="center">
          <template slot-scope="scope">
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
            <img class="img-doc" src="../assets/img/doc.png" alt="文档" />
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
              class="morebtn"
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
      width="500px"
      center
      :append-to-body="true"
    >
      <span>这将会删除回收站中所有文件！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteAllDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteAll">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分页区域 -->
    <div v-if="this.docListInfo.total > 0">
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
  </el-container>
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
        total: 0
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
      this.docList = res
      console.log(res)
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
      this.docList = res2
      this.docListInfo.total = 0
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
.clear {
  margin: 0;
  padding: 0;
  position: absolute;
  top: 30px;
  left: 50px;
  color: rgb(150, 150, 150);
  background-color: transparent;
  border: none;
}
.clear:hover {
  color: rgb(50, 50, 50);
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  background-color: transparent;
}
.clear:active {
  color: rgb(50, 50, 50);
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  background-color: transparent;
  transform: translateY(1px);
  -webkit-transform: translateY(1px);
}
.clear:focus {
  color: rgb(50, 50, 50);
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
  width: 800px;
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
/deep/ .el-table .el-table__header-wrapper tr th {
  color: rgb(50, 50, 50);
  background-color: whitesmoke !important;
}
/deep/ .el-table .el-table__row {
  color: rgb(50, 50, 50);
  background-color: whitesmoke !important;
}
/deep/ .el-table .el-table__body tr.current-row > td {
  background-color: rgb(238, 238, 238) !important;
}
/deep/ .el-table .el-table__body tr:hover > td {
  background-color: rgb(238, 238, 238) !important;
}
/deep/ .el-table td,
/deep/ .el-table th.is-leaf {
  border-bottom: 1px solid rgb(221, 221, 221);
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
/deep/ .el-dialog .el-input__inner:focus {
  box-shadow: inset 0 0 8px rgb(189, 189, 189);
}
.el-dialog .el-button {
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
.el-dialog .el-button:hover {
  color: white;
}
.el-dialog .el-button:active {
  background: linear-gradient(
    -20deg,
    rgb(85, 85, 85) 0%,
    rgb(100, 100, 100) 60%,
    rgb(85, 85, 85) 100%
  );
  box-shadow: none;
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
</style>
