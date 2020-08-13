<template>
  <div class="container">
    <!-- 头部区域 -->
    <div>
      <!-- 查看文件 -->
      <el-menu class="el-menu-demo" mode="horizontal">
        <el-menu-item @click="getUsed">最近使用</el-menu-item>
        <el-menu-item @click="getOwn">我创建的</el-menu-item>
        <el-menu-item @click="getFavorite">我的收藏</el-menu-item>
      </el-menu>
    </div>
    <!-- 文档显示区域 -->
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
            @click.native="addFavorite(scope.row.id)"
            size="mini"
            icon="el-icon-star-off"
            circle
          ></el-button>
          <!-- 设置按钮下拉菜单 -->
          <el-dropdown>
            <!-- 设置按钮 -->
            <el-button size="mini" icon="el-icon-setting" circle></el-button>
            <el-dropdown-menu class="dropdown-menu" slot="dropdown">
              <el-dropdown-item @click.native="shareDoc(scope.row.id)">
                <span>分享</span>
              </el-dropdown-item>
              <el-dropdown-item @click.native="addFavorite(scope.row.id)">
                <span>收藏</span>
              </el-dropdown-item>
              <el-dropdown-item @click.native="renameDoc(scope.row.id)">
                <span>重命名</span>
              </el-dropdown-item>
              <el-dropdown-item @click.native="deleteDoc(scope.row.id)" divided>
                <span>删除</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  owner: 'dashboard',
  data() {
    return {
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
      ],
      // 删除操作弹出框
      deletePopoverVisible: false
    }
  },
  mounted() {},
  methods: {
    // 获取最近使用的文档
    getUsed() {
      // 发送数据
      // 高亮激活
      // 渲染
    },
    // 获取我创建的的文档
    getOwn() {
      // 发送数据
      // 高亮激活
      // 渲染
    },
    // 获取我收藏的文档
    getFavorite() {
      // 发送数据
      // 高亮激活
      // 渲染
    },
    // 打开文档
    openDoc() {
      alert('111')
      // 跳转
    },
    // 分享文档
    shareDoc(id) {
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
    addFavorite(id) {
      // 传输
      // 判断成功
      // 消息提示
      this.$message({
        showClose: true,
        message: '收藏成功',
        type: 'success'
      })
    },
    // 重命名文档
    renameDoc(id) {
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
    deleteDoc(id) {
      //
      // 传输
      // 判断成功
      // 消息提示
      this.$message({
        showClose: true,
        message: '删除成功',
        type: 'success'
      })
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
</style>
