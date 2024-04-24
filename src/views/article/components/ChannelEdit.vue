<script setup>
import { ref } from 'vue'
import {
  articleAddChannelsService,
  articleEditChannelsService
} from '@/api/article.js'

const formRef = ref(null) // 获取表单组件
const dialogVisible = ref(false) // 控制弹层显示
// 表单数据----------------------------------------------------------
const formModel = ref({
  cate_name: '',
  cate_alias: ''
})

// 表单校验规则----------------------------------------------------------
const rules = {
  cate_name: [
    { required: true, message: '分类名称不能为空', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '分类名称必须是1~10位非空字符',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    { required: true, message: '分类别名不能为空', trigger: 'blur' },
    {
      pattern: /^[0-9a-zA-Z]{1,15}$/,
      message: '分类别名必须是1~15位字母或数字',
      trigger: 'blur'
    }
  ]
}

// 渲染弹层
// 组件对外暴露一个方法 open，基于 open 传来的参数区分是添加还是编辑
// open({}) => 表单无需渲染，说明添加
// open({ id, cate_name, ... }) => 表单需要渲染，说明是编辑
// open 调用后可以打开弹窗
const open = (row) => {
  dialogVisible.value = true
  formModel.value = { ...row } // 浅拷贝往表单中添加数据
}

// 编辑文章分类----------------------------------------------------------
const emit = defineEmits(['success'])
const onSubmit = async () => {
  await formRef.value.validate()
  // 通过文章的id是否存在来判断是编辑还是添加
  const isEdit = formModel.value.id
  if (isEdit) {
    await articleEditChannelsService(formModel.value)
    ElMessage.success('编辑成功')
  } else {
    await articleAddChannelsService(formModel.value)
    ElMessage.success('添加成功')
  }
  dialogVisible.value = false
  // 通知父组件重新渲染表单
  emit('success')
}

// 向外暴露方法----------------------------------------------------------
defineExpose({
  open,
  onSubmit
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? '编辑分类' : '添加分类'"
    top="25vh"
    width="500"
  >
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      label-width="100px"
      style="padding-right: 30px"
    >
      <el-form-item label="分类名称：" prop="cate_name">
        <el-input
          v-model="formModel.cate_name"
          placeholder="请输入分类名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="分类别名：" prop="cate_alias">
        <el-input
          v-model="formModel.cate_alias"
          placeholder="请输入分类别名"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
