<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <h3>我的桌面</h3>
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
        max-height="600px"
      >
        <!-- 文件名 -->
        <el-table-column
          prop="title"
          label="文件名"
          sortable
          width="180"
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
          width="160"
          align="center"
          header-align="center"
        ></el-table-column>
        <!-- 创建时间 -->
        <el-table-column
          prop="createtime"
          label="创建时间"
          sortable
          width="200"
          align="center"
          header-align="center"
        ></el-table-column>
        <!-- 最后打开时间 -->
        <el-table-column
          prop="updatetime"
          label="最后编辑时间"
          sortable
          width="200"
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
    <!-- 分享文档对话框 -->
    <el-dialog
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
        :page-size="12"
        layout="total, prev, pager, next, jumper"
        :total="docListInfo.total"
      >
      </el-pagination>
    </div>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
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
          hasAuth: true,
          title: '文档名2',
          nickname: '王小虎1',
          createtime: '05-02 10：12',
          updatetime: '05-02 10：12',
          lasteditor_nickname: '王小2',
          status: 0,
          auth: 0
        },
        {
          id: 3,
          isFavorite: false,
          hasAuth: true,
          title: '文档名4',
          nickname: '王小虎2',
          createtime: '05-02 10：12',
          updatetime: '05-02 10：41',
          lasteditor_nickname: '王小3',
          status: 1,
          auth: 1
        },
        {
          id: 2,
          isFavorite: false,
          hasAuth: false,
          title: '文档名1',
          nickname: '王小虎3',
          createtime: '05-02 10：12',
          updatetime: '05-02 10：51',
          lasteditor_nickname: '王小4',
          status: 0,
          auth: 2
        },
        {
          id: 6,
          isFavorite: true,
          hasAuth: false,
          title: '文档名3',
          nickname: '王小虎4',
          createtime: '05-02 10：12',
          updatetime: '05-02 10：01',
          lasteditor_nickname: '王小1',
          status: 1,
          auth: 3
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
      // 设置权限对话框的可见属性
      setAuthDialogVisible: false,
      // 分享对话框的可见属性
      shareDocDialogVisible: false,

      // 控制重命名文档对话框的显示
      renameDocDialogVisible: false,

      // 辅助--------------------------------------------------------------------

      // 切换文档显示
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
  async created() {
    // 加载文档数据
    this.getDesktop()
  },
  methods: {
    // 文档列表---------------------------------------------------------------

    // 获取桌面文档信息
    async getDesktop() {
      var token = window.sessionStorage.getItem('token')
      var page = this.docListInfo.pageNum
      const { data: res } = await this.$http.get(
        '/doc/user/?token=' + token + '&page=' + page
      )
      if (res === '查询结果为空') {
        this.docListInfo.total = 0
      } else {
        this.docList = res
        this.docListInfo.total = this.docList[0].total
      }
    },

    // 打开文档!!!!!!!!!!!!!!!!!!!!!!!未完成!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    async openDoc(docInfo) {
      this.$router.push('/doc/' + docInfo.id)
      // 跳转
    },

    // 分享文档
    shareDoc(docInfo) {
      // 传输
      var url = window.location.href.replace('desktop', 'doc/' + docInfo.id)
      this.shareDocForm.url = url
      this.shareDocDialogVisible = true
    },
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
        title: this.renameDocForm.newName,
        noweditor: null
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
      const { data: res2 } = await this.$http.get(
        '/doc/user/?token=' + token + '&page=' + page
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
        delete: '1',
        noweditor: null
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
      const { data: res2 } = await this.$http.get(
        '/doc/user/?token=' + token + '&page=' + page
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
      this.$refs.shareDocFormRef.resetFields()
    },
    // 监听修改权限对话框的关闭事件
    setAuthDialogClosed() {
      this.setAuthDialogVisible = false
      // 重置对话框中输入框内容
      this.docAuth.status = 0
      this.docAuth.label = ''
    },

    // 监听pageSize的改变
    handleSizeChange(newSize) {
      this.docListInfo.pageSize = newSize
      // 重新获取数据：判断列表类型，复用对应获取方法
    },
    // 监听页码值的改变
    handleCurrentChange(newPage) {
      this.docListInfo.pageNum = newPage
      this.getDesktop()
      // 重新获取数据：判断列表类型，复用对应获取方法
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
  width: 1100px;
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
.el-dialog .el-button {
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
