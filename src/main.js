import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// quillEditor
import VueQuillEditor from 'vue-quill-editor'
// 一定要引入这三个css，不然文本编辑器会出现不规则黑白几何图形
// 这三个css可以在main.js中引入，也可以在具体使用的.vue文件中引入
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 导入全局样式
import './assets/css/global.css'

// 配置axios
import axios from 'axios'

// 配置请求的根路径
axios.defaults.baseURL = 'http://123.57.67.128:8000'

Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.use(VueQuillEditor)

/* 路由发生变化修改页面title */
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
