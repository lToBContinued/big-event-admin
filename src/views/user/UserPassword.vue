<script setup>
import PageContainer from '@/components/pageContainer.vue'
import { ref } from 'vue'
import { userUpdatePasswordService } from '@/api/user.js'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

const router = useRouter()
const formRef = ref(null)
const userStore = useUserStore()

const formModel = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})

// 表单校验
const checkDifferent = (rule, value, callback) => {
  // 新密码和原密码不能一样
  if (value === formModel.value.old_pwd) {
    callback(new Error('新密码不能和原密码一样'))
  } else {
    callback()
  }
}
const checkSameAsNewPwd = (rule, value, callback) => {
  // 校验确认密码
  if (value !== formModel.value.new_pwd) {
    callback(new Error('确认密码必须和新密码一样'))
  } else {
    callback()
  }
}
const rules = {
  old_pwd: [
    { required: true, message: '原密码不能为空', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6~15位非空字符',
      trigger: 'blur'
    }
  ],
  new_pwd: [
    { required: true, message: '新密码不能为空', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6~15位非空字符',
      trigger: 'blur'
    },
    {
      validator: checkDifferent,
      trigger: 'blur'
    }
  ],
  re_pwd: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6~15位非空字符',
      trigger: 'blur'
    },
    {
      validator: checkSameAsNewPwd,
      trigger: 'blur'
    }
  ]
}

// 提交修改密码
const onSubmit = async () => {
  await formRef.value.validate()
  await userUpdatePasswordService(formModel.value)
  ElMessage.success('修改密码成功，请重新登录')
  // 清空用户数据
  userStore.setToken('')
  userStore.setUser({})
  // 拦截到登录页面
  setTimeout(async () => await router.push('/login'), 1500)
}

// 清空输入框
const onReset = () => {
  formRef.value.resetFields()
}
</script>

<template>
  <page-container title="基本资料">
    <!--表单部分-->
    <el-form ref="formRef" :model="formModel" :rules="rules" size="large">
      <el-form-item label="原密码" label-width="100px" prop="old_pwd">
        <el-input
          v-model="formModel.old_pwd"
          placeholder=""
          style="width: 500px"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码" label-width="100px" prop="new_pwd">
        <el-input
          v-model="formModel.new_pwd"
          placeholder=""
          style="width: 500px"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" label-width="100px" prop="re_pwd">
        <el-input
          v-model="formModel.re_pwd"
          placeholder=""
          style="width: 500px"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item label-width="100px">
        <el-button type="primary" @click="onSubmit">修改密码</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
  </page-container>
</template>

<style lang="scss" scoped></style>
