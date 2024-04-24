<script setup>
import PageContainer from '@/components/pageContainer.vue'
import { Plus, Upload } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores/index.js'
import { userUpdateAvatarService } from '@/api/user.js'

const uploadRef = ref(null)
const userStore = useUserStore()
// 基于store的数据初始化imgUrl的初始值
const imgUrl = ref(userStore.user.user_pic)

const onSelectFile = (uploadFile) => {
  // 基于 FileReader 读取图片做预览
  const reader = new FileReader()
  reader.readAsDataURL(uploadFile.raw)
  reader.onload = () => {
    imgUrl.value = reader.result
  }
}

const onUpload = async () => {
  // 发送请求更新头像
  await userUpdateAvatarService(imgUrl.value)
  // 更新用户信息
  await userStore.getUser()
  ElMessage.success('修改头像成功')
}
</script>

<template>
  <page-container title="更换头像">
    <el-upload
      ref="uploadRef"
      class="avatar-uploader"
      :auto-upload="false"
      :on-change="onSelectFile"
      :show-file-list="false"
    >
      <img v-if="imgUrl" :src="imgUrl" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>

    <el-button
      type="primary"
      :icon="Plus"
      size="large"
      @click="uploadRef.$el.querySelector('input').click()"
    >
      选择图片</el-button
    >

    <el-button type="success" :icon="Upload" size="large" @click="onUpload"
      >上传头像</el-button
    >
  </page-container>
</template>

<style scoped lang="scss">
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
      display: block;
    }
    .el-upload {
      margin-bottom: 20px;
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>
