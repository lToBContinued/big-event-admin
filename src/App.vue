<script setup>
// 在vue3 compositionAPI中
// 1. 获取路由对象 router useRouter
//    const router = useRouter()
// 2. 获取路由参数router useRoute
//    const route = useRoute()
import { useRoute, useRouter } from 'vue-router'
import TestDemo from '@/components/TestDemo.vue'
import { useUserStore } from '@/stores'

const router = useRouter()
const route = useRoute()

const goList = () => {
  console.log(router, route)
  router.push('/list')
}

const userStore = useUserStore()
</script>

<template>
  <div>
    <hr />
    <router-view></router-view>
    <hr />
    <hr />
    <hr />
    <hr />
    我是app
    <test-demo></test-demo>
    <el-button @click="$router.push('/home')">跳首页</el-button>
    <el-button @click="goList">跳列表页</el-button>

    <el-button type="primary">Primary</el-button>
    <el-button type="success">Success</el-button>

    <p>{{ userStore.token }}</p>
    <el-button @click="userStore.setToken('4613156464643121')">登录</el-button>
    <el-button @click="userStore.removeToken">退出</el-button>
  </div>
</template>

<style scoped></style>
