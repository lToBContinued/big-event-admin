<script setup>
import { ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {
  articleDelInfoService,
  articleEditService,
  articleGetDetailService,
  articlePublishService
} from '@/api/article.js'
import { baseURL } from '@/utils/request.js'
import axios from 'axios'
// 表单数据
const formModel = ref({
  title: '',
  cate_id: '',
  content: '',
  cover_img: '',
  state: ''
})

// 表单校验
const rules = {
  title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
  cate_id: [{ required: true, message: '分类不能为空', trigger: 'blur' }]
}

// 图片上传相关逻辑
const imgUrl = ref('')
const onSelectFile = (uploadFile) => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw) // 预览图片
  formModel.value.cover_img = uploadFile.raw
}

const emit = defineEmits(['success'])
// 提交文章
const onPublish = async (state) => {
  // 将已发布或者草稿状态存入formModel
  formModel.value.state = state
  // 当前接口需要formData对象
  // 将普通对象转换成 formData 对象
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }

  // 发请求
  if (formModel.value.id) {
    // 编辑操作
    await articleEditService(fd)
    ElMessage.success('文章修改成功')
    visibleDrawer.value = false
    // 通知父组件渲染当前页
    emit('success', 'edit')
  } else {
    // 添加操作
    await articlePublishService(fd)
    ElMessage.success('添加成功')
    visibleDrawer.value = false
    // 通知父组件渲染最后一页
    emit('success', 'add')
  }
}

// 删除文章
const delArticle = async (row) => {
  console.log(row.id)
  await articleDelInfoService(row.id)
}

// 抽屉
async function imageUrlToFileObject(imageUrl, filename) {
  try {
    // 使用axios下载图片数据
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer'
    })

    // 将下载的数据转换成Blob对象
    const blob = new Blob([response.data], {
      type: response.headers['content-type']
    })

    // 创建file对象
    const file = new File([blob], filename, {
      type: response.headers['content-type']
    })

    return file
  } catch (err) {
    console.error(err)
    return null
  }
}
const editorRef = ref(null)
const visibleDrawer = ref(false)
const open = async (row) => {
  visibleDrawer.value = true
  if (row.id) {
    // 需要基于row.id发送请求，获取编辑对应的详情数据，进行回显
    const res = await articleGetDetailService(row.id)
    formModel.value = res.data.data
    // 图片单独处理回显
    imgUrl.value = baseURL + formModel.value.cover_img
    // 提交给后台需要的数据格式，是file对象格式，需要将网络图片地址转换成file对象存储起来，便于提交
    const file = await imageUrlToFileObject(
      imgUrl.value,
      formModel.value.cover_img
    )
    formModel.value.cover_img = file
  } else {
    // 基于默认的数据，重置form数据
    formModel.value = {
      title: '',
      cate_id: '',
      content: '',
      cover_img: '',
      state: ''
    }
    // 重置图片img地址和富文本编辑器的数据
    imgUrl.value = ''
    editorRef.value.getHTML('')
  }
}

defineExpose({
  open,
  delArticle
})
</script>

<template>
  <el-drawer v-model="visibleDrawer" size="50%" title="文章编辑">
    <el-form :model="formModel" label-width="100px" :rules="rules">
      <el-form-item label="文章标题" prop="title">
        <el-input
          placeholder="请输入标题"
          v-model="formModel.title"
          type="text"
        ></el-input>
      </el-form-item>

      <el-form-item label="文章分类" prop="cate_id">
        <channel-select
          v-model="formModel.cate_id"
          width="100%"
        ></channel-select>
      </el-form-item>

      <el-form-item label="文章封面" prop="cover_img">
        <!--此处需要关闭 element-plus 的自动上传，不需要配置 action 等参数
              只需要做前端的本地预览图片即可，无需在提交前上传图片
              本地预览语法：URL.createObjectUrl(...) 创建本地预览的地址，来预览
          -->
        <el-upload
          class="avatar-uploader"
          :auto-upload="false"
          :on-change="onSelectFile"
          :show-file-list="false"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <!--文本编辑器-->
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <quill-editor
            ref="editorRef"
            theme="snow"
            v-model:content="formModel.content"
            content-type="html"
          ></quill-editor>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onPublish('已发布')">发布</el-button>
        <el-button type="info" @click="onPublish('草稿')">存草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
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
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
