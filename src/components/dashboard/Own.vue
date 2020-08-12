<template>
  <div>
    <!-- 文档 -->
    <h2>我创建的</h2>
    <div>
      <!-- 文档图片 -->
      <img src="../../assets/doc.jpg" alt="文档" />
      <!-- 文档标题 -->
      <span>文档标题</span>
      <!-- 文档信息 -->
      <span>时间 编辑人 打开</span>
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
</template>

<script>
export default {
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="less" scoped></style>
