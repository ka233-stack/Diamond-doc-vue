<template>
  <el-container class="desktop-container">
    <!-- 头部区域-->
    <el-header>
      <div class="header-left">
        <img src="../assets/logo.png" alt="金刚石文档logo" />
        <router-link to="/">
          <span>金刚石文档</span>
        </router-link>
      </div>
      <div class="header-right">
        <!-- 顶部搜索框 -->
        <el-input
          prefix-icon="el-icon-search"
          v-model="searchInput"
          placeholder="搜索文件"
          clearable
        >
        </el-input>
        <!-- 通知 -->
        <el-badge :value="12" class="item">
          <el-button icon="el-icon-bell" circle></el-button>
        </el-badge>
        <!-- 头像下拉菜单 -->
        <el-dropdown>
          <!-- 头像 -->
          <el-button circle
            ><img src="../assets/avatar.png" alt="用户头像"
          /></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              账号设置
            </el-dropdown-item>
            <el-dropdown-item>
              前往官网
            </el-dropdown-item>
            <el-dropdown-item>
              获取帮助
            </el-dropdown-item>
            <el-dropdown-item>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside width="200px">
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#e6e6e6"
          text-color="#7D7D7D"
          active-text-color="#000"
          :router="true"
        >
          <!-- 区域1 -->
          <el-menu-item index="/dashboard">
            <i class="el-icon-files"></i>
            <span>工作台</span>
          </el-menu-item>
          <!-- 分割线 -->
          <el-divider></el-divider>
          <!-- 区域2 -->
          <!-- 我的桌面 -->
          <el-menu-item index="/desktop">
            <i class="el-icon-house"></i>
            <span>我的桌面</span>
          </el-menu-item>
          <!-- 团队空间一级菜单 -->
          <el-submenu>
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-box"></i>
              <!-- 文本 -->
              <span>团队空间</span>
            </template>
            <!-- 团队空间二级菜单 -->
            <el-menu-item-group>
              <el-menu-item index="3-1">
                <!-- 文本 -->
                <span>空间名称</span>
              </el-menu-item>
              <el-menu-item
                :index="item.id + ''"
                v-for="item in teamList"
                :key="item.id"
              >
                <!-- 文本 -->
                <span>{{ item.spaceName }}</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="/trash">
            <i class="el-icon-delete"></i>
            <span>回收站</span>
          </el-menu-item>
          <!-- 分割线 -->
          <el-divider></el-divider>
          <!-- 区域3 -->
          <el-menu-item index="5">
            <i class="el-icon-question"></i>
            <span>帮助</span>
          </el-menu-item>
        </el-menu>
        <!-- 添加团队空间按钮 -->
        <el-button @click="createTeamSpace">
          <i class="el-icon-plus"></i>
        </el-button>
      </el-aside>
      <!-- 内容主体区域 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
        <!-- 右侧按钮区域 -->
        <div>
          <el-button @click="createNewDoc">
            <span>新建文档</span>
          </el-button>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
// export 表示导出,在自定义组件里面使用export default导出
export default {
  components: {},
  data() {
    return {
      // 左侧菜单数据
      teamList: [],
      searchInput: ''
    }
  },
  created() {},
  methods: {
    // 获取所有的菜单
    async getTeamList() {
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
    // 新建团队空间
    createTeamSpace() {
      // 消息弹框
      // 判断空间名称是否重复
    },
    // 新建文档
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
.router-link-active {
  text-decoration: none;
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
.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>
