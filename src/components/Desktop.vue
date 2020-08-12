<template>
  <div>
    <!-- 头部区域 -->
    <div class="header">
      <h2>我的桌面</h2>
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
        <!-- 文档管理下拉菜单 -->
        <el-dropdown>
          <!-- 按钮 -->
          <el-button icon="el-icon-arrow-down">
          </el-button>
          <!-- 下拉菜单 -->
          <el-dropdown-menu slot="dropdown">
            <!-- 恢复文件 -->
            <el-dropdown-item>222</el-dropdown-item>
            <!-- 彻底删除 -->
            <el-dropdown-item>222</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
// export 表示导出,在自定义组件里面使用export default导出
export default {
  name: 'desktop',
  // name 表示设置别名，可以不设置，建议和组件的名称一致
  components: {},
  data() {
    return {
      // 左侧菜单数据
      menuList: []
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    // 获取所有的菜单
    async getMenuList() {
      // get请求
    },
    // 退出登录
    logout() {
      // 清除token
      window.sessionStorage.removeItem('token')
      // 跳转到登录界面
      this.$router.push('/login')
    },
    alert() {
      alert('111')
    },
    // 新疆团队空间
    createTeamSpace() {
      // 消息弹框
      // 判断空间名称是否重复
    },
    createNewDoc() {
      // 跳转至文档页
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
