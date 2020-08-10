import Vue from 'vue' // E56模块导入方式
import App from './App.vue' // 独立测试区1

Vue.config.productionTip = false

//--------------独立测试区1--------------
new Vue({
  render: h => h(App), //这个App组件(根组件)需要手动创建并引入
  // render渲染
}).$mount('#app') // new 一个Vue实例,挂载(mount)到节点上
