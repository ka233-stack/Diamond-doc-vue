<template>
  <div>
    <!-- 头部区域-->
    <div>
      <!-- 查看文件 -->
      <el-menu
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        :router="true"
      >
        <el-menu-item index="/dashboard/used">最近使用</el-menu-item>
        <el-menu-item index="/dashboard/own">我创建的</el-menu-item>
        <el-menu-item index="/dashboard/favorite">我的收藏</el-menu-item>
      </el-menu>
    </div>
    <!-- 路由占位符 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'dashboard',
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="less" scoped></style>
