<script setup>
import { ref } from 'vue'
import {
  articleDelChannelsService,
  articleGetChannelsService
} from '@/api/article.js'
import { Delete, Edit } from '@element-plus/icons-vue'
import ChannelEdit from '@/views/article/components/ChannelEdit.vue'

const channelList = ref([])
const loading = ref(false)
const dialog = ref(null)
// 获取文章列表
const getChannels = async () => {
  loading.value = true
  const res = await articleGetChannelsService()
  channelList.value = res.data.data
  loading.value = false
}
getChannels()

// 弹层显示
const onEditChannel = async (row) => {
  // 打开弹层并进行回显
  dialog.value.open(row)
}

// 添加文章分类
const onAddChannel = () => {
  dialog.value.open({})
}
const onSuccess = () => {
  getChannels()
}

// 删除文章分类
const onDelChannel = (row) => {
  ElMessageBox.confirm('你确定要删除吗？', '温馨提示', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await articleDelChannelsService(row.id)
      ElMessage.success('删除成功')
      await getChannels()
    })
    .catch(() => {})
}
</script>

<template>
  <pageContainer title="文章分类">
    <!--按钮-->
    <template #extra>
      <el-button type="primary" @click="onAddChannel">添加分类</el-button>
    </template>

    <!--表格部分-->
    <el-table
      v-loading="loading"
      :data="channelList"
      height="460px"
      style="width: 100%"
    >
      <el-table-column
        fixed
        label="序号"
        type="index"
        width="100"
      ></el-table-column>
      <el-table-column label="分类名称" prop="cate_name"></el-table-column>
      <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
      <el-table-column class="operation" label="操作" width="100">
        <!--row 是channelList的每一项，$index 是下标-->
        <template #default="{ row, $index }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditChannel(row, $index)"
          />
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDelChannel(row)"
          />
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="空空如也" />
      </template>
    </el-table>

    <!--弹层提示-->
    <ChannelEdit ref="dialog" @success="onSuccess"></ChannelEdit>
  </pageContainer>
</template>

<style lang="scss" scoped></style>
