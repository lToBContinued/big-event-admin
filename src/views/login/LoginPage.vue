<script setup>
import { Back, Lock, Right, User } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { userLoginService, userRegisterService } from '@/api/user.js'
import { useUserStore } from '@/stores/index.js'
import router from '@/router/index.js'

const isRegister = ref(false)
const form = ref(null)
// 注册表单中，整个用于提交的form对象
const formModel = ref({
  username: '',
  password: '',
  repassword: ''
})
// 整个表单的校验规则
// 1. 非空校验：required: true  message消息提示  trigger触发校验的实际（blur：失焦时校验，change：值改变时候触发）
// 2. 长度校验：min:xx  max:xx
// 3. 正则校验：pattern: 正则规则
// 4. 自定义校验
//    validator: (rule, value, callback)
//    （1）rule 当前校验规则相关的信息
//    （2）value 所校验的表单元素目前的表单值
//    （3）callback 无论成功还是失败，都需要 callback 回调
//        - callback() 校验成功
//        - callback(new Error(失败信息)) 校验失败
const rules = {
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 3, max: 10, message: '用户名必须为3~10位的字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6~15位非空字符',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6~15位非空字符',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        // 判断 value 和当前 form 中收集的 password 是否一致
        if (value !== formModel.value.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback() // 就算校验成功，也需要callback
        }
      },
      trigger: 'blur'
    }
  ]
}

// 注册功能
const register = async () => {
  // 注册成功之前先进行预校验（validate），校验成功 → 请求，校验失败 → 自动提示
  await form.value.validate()
  try {
    await userRegisterService(formModel.value)
    ElMessage.success('注册成功')
    // 跳转到登录页
    setTimeout(() => (isRegister.value = false), 1500)
  } catch (err) {
    ElMessage.error(err.message)
  }
}

// 切换登录和注册的时候重置表单的内容
watch(isRegister, () => {
  formModel.value = { username: '', password: '', repassword: '' }
})

// 登录功能
const userStore = useUserStore()
const login = async () => {
  await form.value.validate()
  const { data } = await userLoginService(formModel.value)
  if (data.code === 0) {
    userStore.setToken(data.token)
    ElMessage.success(data.message)
    // 跳转首页
    router.push('/')
  } else {
    ElMessage.error('登录失败，请检查账号和密码')
  }
}
</script>

<template>
  <el-row class="login-page">
    <!--左侧背景大图-->
    <el-col ref="background" :span="12" class="bg"></el-col>
    <!--注册表单-->
    <el-col v-if="isRegister" :offset="3" :span="6" class="form">
      <el-form
        ref="form"
        :model="formModel"
        :rules="rules"
        autocomplete="off"
        size="large"
      >
        <el-form-item>
          <h1 ref="formItem" class="title">注册</h1>
        </el-form-item>

        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
            type="text"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            placeholder="请输入密码"
            type="password"
          ></el-input>
        </el-form-item>

        <el-form-item prop="repassword">
          <el-input
            v-model="formModel.repassword"
            :prefix-icon="Lock"
            placeholder="请再次输入密码"
            type="password"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button class="btn" type="primary" @click="register"
            >注&nbsp;册</el-button
          >
        </el-form-item>

        <el-form-item>
          <el-link :underline="false" @click="isRegister = fasle">
            <el-icon> <Back /> </el-icon>&nbsp;登录
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>

    <!--登录表单-->
    <el-col v-else :offset="3" :span="6" class="form">
      <el-form
        ref="form"
        :model="formModel"
        :rules="rules"
        autocomplete="off"
        size="large"
      >
        <el-form-item>
          <h1 class="title">登录</h1>
        </el-form-item>

        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
            type="text"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            placeholder="请输入密码"
            type="password"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button class="btn" type="primary" @click="login"
            >登&nbsp;录</el-button
          >
        </el-form-item>

        <el-form-item>
          <el-link :underline="false" @click="isRegister = true">
            <el-icon> <Right /> </el-icon>&nbsp;注册
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  position: relative;
  height: 100vh;
  background-color: #fff;

  .bg {
    background:
      url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;

    .btn {
      width: 100%;
    }

    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
