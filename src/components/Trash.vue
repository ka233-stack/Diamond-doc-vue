<template>
  <div>
    <!-- 头部区域 -->
    <div class="header">
      <h2>回收站</h2>
      <!-- 清空回收站按钮 -->
      <el-button>清空回收站</el-button>
      <!-- 显示方式按钮组 -->
      <el-button-group>
        <el-button icon="el-icon-menu"></el-button>
        <el-button icon="el-icon-s-unfold"></el-button>
      </el-button-group>
    </div>
    <!-- 文档区域 -->
    <div>
      <!-- 文档 -->
      <div>
        <!-- 文档图片 -->
        <img src="../assets/doc.jpg" alt="文档" />
        <!-- 文档标题 -->
        <span>文档标题</span>
        <!-- 文档管理下拉菜单 -->
        <el-dropdown>
          <!-- 按钮 -->
          <el-button icon="el-icon-setting"></el-button>
          <!-- 下拉菜单 -->
          <el-dropdown-menu slot="dropdown">
            <!-- 恢复文件 -->
            <el-dropdown-item @click="restoreFile">
              <span>恢复文件</span>
            </el-dropdown-item>
            <!-- 彻底删除 -->
            <el-dropdown-item @click="deleteFile">
              <span>彻底删除</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      docList: []
    }
  },
  mounted() {
    if (this.$route.name === 'Dashboard') {
    }
  },
  methods: {
    // 新疆团队空间
    createTeamSpace() {
      // 弹框
    },
    // 恢复文件
    restoreFile() {
      // 发送数据
      // 刷新
      // 消息提示
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
    },
    // 彻底删除
    deleteFile() {
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
