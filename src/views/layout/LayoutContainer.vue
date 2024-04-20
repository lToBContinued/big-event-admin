<script setup>
import {
  CaretBottom,
  Crop,
  Lock,
  Management,
  Promotion,
  SwitchButton,
  User
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/index.js'
import avatar from '@/assets/avatar.jpg'
import router from '@/router/index.js'

// 获取用户基本信息
const userStore = useUserStore()
userStore.getUser()

const handelCommand = (key) => {
  if (key === 'logout') {
    // 退出操作
    ElMessageBox.confirm('确定要退出登录吗？', '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        userStore.removeToken()
        userStore.setUser({})
        router.push('/login')
      })
      .catch(() => {})
  } else {
    // 跳转出操作
    router.push(`/user/${key}`)
  }
}
</script>

<template>
  <el-container class="layout-container">
    <!--左侧边菜单栏-->
    <el-aside width="200px">
      <div class="logo"></div>
      <el-menu
        :default-active="$router.path"
        active-text-color="#00A9FF"
        background-color="#232323"
        router
        text-color="#fff"
      >
        <el-menu-item index="/article/channel">
          <el-icon>
            <Management />
          </el-icon>
          <span>文章分类</span>
        </el-menu-item>

        <el-menu-item index="/article/manage">
          <el-icon>
            <Promotion />
          </el-icon>
          <span>文章管理</span>
        </el-menu-item>

        <el-sub-menu index="/user">
          <template #title>
            <el-icon>
              <User />
            </el-icon>
            <span>个人中心</span>
          </template>

          <el-menu-item index="/user/profile">
            <el-icon>
              <User />
            </el-icon>
            基本资料
          </el-menu-item>

          <el-menu-item index="/user/avatar">
            <el-icon>
              <Crop />
            </el-icon>
            更换头像
          </el-menu-item>

          <el-menu-item index="/user/password">
            <el-icon>
              <Lock />
            </el-icon>
            重置密码
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <!--右侧部分-->
    <el-container>
      <!--头部顶栏-->
      <el-header>
        <div>
          欢迎：
          <strong>
            {{ userStore.user.nickname || userStore.user.username }}
          </strong>
        </div>

        <el-dropdown placement="bottom-end" @command="handelCommand">
          <!--展示给用户，默认看到的-->
          <div class="el-dropdown-link">
            <el-avatar :size="40" :src="userStore.user.user_pic || avatar" />
            <el-icon><CaretBottom /></el-icon>
          </div>
          <!--折叠的下拉菜单部分-->
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :icon="User" command="profile"
                >基本资料</el-dropdown-item
              >
              <el-dropdown-item :icon="Crop" command="avatar"
                >更换头像</el-dropdown-item
              >
              <el-dropdown-item :icon="Lock" command="password"
                >重置密码</el-dropdown-item
              >
              <el-dropdown-item :icon="SwitchButton" command="logout"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>

      <!--中间主体-->
      <el-main>
        <router-view></router-view>
      </el-main>

      <!--底部-->
      <el-footer>大事件 ©2024 Created by wt</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;

  .el-aside {
    background-color: #232323;

    .logo {
      height: 120px;
      background: url('@/assets/logo.png') no-repeat center / 120px auto;
    }

    .el-menu {
      border-right: none;
    }
  }

  .el-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    .el-dropdown-link {
      display: flex;
      align-items: center;
      .el-avatar {
        margin-right: 10px;
      }
    }
  }

  .el-footer {
    line-height: 60px;
    text-align: center;
    color: #666;
    font-size: 14px;
  }
}
</style>
