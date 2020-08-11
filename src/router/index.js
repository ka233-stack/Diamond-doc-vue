import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'

Vue.use(VueRouter)

const routes = [
  // 将根路径重定向到login（调试用）
  { path: '/', redirect: '/login' },
  // 将Login组件渲染到/login
  { path: '/login', component: Login },
  // 将Register组件渲染到/register
  { path: '/register', component: Register }
]

const router = new VueRouter({
  routes
})

export default router
