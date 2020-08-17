import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import Welcome from '../components/Welcome.vue'
import Home from '../components/Home.vue'
import Dashboard from '../components/Dashboard.vue'
import Desktop from '../components/Desktop.vue'
import Trash from '../components/Trash.vue'
import Doc from '../components/Doc.vue'
import Space from '../components/Space.vue'
import Profile from '../components/Profile.vue'

Vue.use(VueRouter)

const routes = [
  // 将重定向到根路径
  // { path: '*', redirect: '/' },
  // 将根路径重定向到/welcome
  { path: '/', redirect: '/welcome' },
  // 将Welcome组件渲染到/welcome
  { path: '/welcome', meta: { title: '金刚石文档' }, component: Welcome },
  // 将Login组件渲染到/login
  { path: '/login', meta: { title: '登录页-金刚石文档' }, component: Login },
  // 将Register组件渲染到/register
  {
    path: '/register',
    meta: { title: '注册页-金刚石文档' },
    component: Register
  },
  // 将Profile组件渲染到/profile
  {
    path: '/profile',
    meta: { title: '个人信息页-金刚石文档' },
    component: Profile
  },
  // 将Home组件渲染到/home
  {
    path: '/home',
    component: Home,
    redirect: '/dashboard',
    // 子路由
    children: [
      // 将Dashboard子组件渲染到/dashboard
      {
        path: '/dashboard',
        meta: { title: '工作台 - 金刚石文档' },
        component: Dashboard
      },
      // 将Desktop子组件渲染到/desktop
      {
        path: '/desktop',
        meta: { title: '我的桌面 - 金刚石文档' },
        component: Desktop
      },
      // 将Trash组件渲染到/trash
      {
        path: '/trash',
        meta: { title: '回收站 - 金刚石文档' },
        component: Trash
      },
      // 将Space组件渲染到/space/id
      {
        path: '/space/:id',
        meta: { title: '团队空间 - 金刚石文档' },
        component: Space
      }
    ]
  },
  // 将Doc组件渲染到/doc
  { path: '/doc/:id', meta: { title: '文档编辑页 - 金刚石文档' }, component: Doc }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, before, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转过来
  // next 是一个函数，表示放行
  // next() 放行  next('/login') 强制跳转到/login
  if (to.path === '/login') return next()
  // 获取token
  // const tokenStr = window.sessionStorage.getItem('token')
  // if (!tokenStr) return next('/login')
  next()
})

export default router
