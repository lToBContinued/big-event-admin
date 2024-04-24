<script setup>
import PageContainer from '@/components/pageContainer.vue'
import { ref } from 'vue'
import { userUpdatePasswordService } from '@/api/user.js'
import { useUserStore } from '@/stores/index.js'
import { useRouter } from 'vue-router'

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
      validator: (rule, value, callback) => {
        // 判断 value 和当前 form 中收集的 password 是否一致
        if (value !== formModel.value.new_pwd) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback() // 就算校验成功，也需要callback
        }
      },
      trigger: 'blur'
    }
  ]
}

const router = useRouter()
const formRef = ref(null)
const userStore = useUserStore()

const formModel = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})

// 提交修改密码
const onSubmit = async () => {
  await formRef.value.validate()
  await userUpdatePasswordService(formModel.value)
  ElMessage.success('修改密码成功，请重新登录')
  userStore.token = ''
  userStore.user = {}
  setTimeout(async () => await router.push('/login'), 1500)
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
      </el-form-item>
    </el-form>
  </page-container>
</template>

<style lang="scss" scoped></style>
