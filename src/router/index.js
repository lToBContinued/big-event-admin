import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/stores/index.js'

// 在vue3 compositionAPI中
// 1. 获取路由对象 router useRouter
//    const router = useRouter()
// 2. 获取路由参数router useRoute
//    const route = useRoute()
const router = createRouter({
  // vite 中的环境变量 import.meta.env.BASE_URL 就是 vite.config.js 中的 base 配置项
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') }, // 登录页
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/manage',
      children: [
        {
          path: '/article/manage',
          component: () => import('@/views/article/ArticleManage.vue')
        },
        {
          path: '/article/channel',
          component: () => import('@/views/article/ArticleChannel.vue')
        }
      ]
    },
    {
      path: '/user',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      children: [
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue')
        }
      ]
    }
  ]
})

// 登录访问拦截
router.beforeEach((to) => {
  const userStore = useUserStore()
  // 如果没有token，且访问的是非登录页，就拦截到登录
  if (!userStore.token && to.path !== '/login') {
    return '/login'
  }
})

export default router
