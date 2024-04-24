<script setup>
import PageContainer from '@/components/pageContainer.vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores/index.js'
import { userUpdateInfoService } from '@/api/user.js'

const formRef = ref(null)

// 表单验证
const rules = {
  nickname: [
    { required: true, message: '用户昵称不能为空', trigger: 'blur' },
    { min: 3, max: 10, message: '用户昵称必须为3~10位的字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    {
      pattern:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: '请输入正确的邮箱格式',
      trigger: 'blur'
    }
  ]
}

// 用户基本信息
const {
  user: { email, id, nickname, username },
  getUser
} = useUserStore()

const userInfo = ref({
  id,
  email,
  nickname,
  username
})

// 获取用户基本信息
const userStore = useUserStore()
const getUserInfo = async () => {
  userInfo.value = userStore.user
}
getUserInfo()

// 提交修改
const onSubmit = async () => {
  await formRef.value.validate()
  await userUpdateInfoService(userInfo.value)
  // 通知user模块进行数据的更新
  await getUser()
  ElMessage.success('修改成功')
}
</script>

<template>
  <page-container title="基本资料">
    <!--表单部分-->
    <el-form ref="formRef" :model="userInfo" :rules="rules" size="large">
      <el-form-item label="登录名称" label-width="100px" prop="username">
        <el-input
          v-model="userInfo.username"
          disabled
          placeholder="请输入用户名"
          style="width: 500px"
        ></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" label-width="100px" prop="nickname">
        <el-input
          v-model="userInfo.nickname"
          placeholder="请输入用户昵称"
          style="width: 500px"
        ></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" label-width="100px" prop="email">
        <el-input
          v-model="userInfo.email"
          placeholder="请输入邮箱地址"
          style="width: 500px"
        ></el-input>
      </el-form-item>
      <el-form-item label-width="100px">
        <el-button type="primary" @click="onSubmit">提交修改</el-button>
      </el-form-item>
    </el-form>
  </page-container>
</template>

<style lang="scss" scoped></style>
