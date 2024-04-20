<script setup>
import { ref } from 'vue'
import { articleGetChannelsService } from '@/api/article.js'
import { Delete, Edit } from '@element-plus/icons-vue'

const channelList = ref([])
const loading = ref(false)

// 获取文章列表
const getChannels = async () => {
  loading.value = true
  const res = await articleGetChannelsService()
  channelList.value = res.data.data
  loading.value = false
}
getChannels()

const onEditChannel = (row, index) => {
  console.log(row, index)
}
const onDelChannel = (row, index) => {
  console.log(row, index)
}
</script>

<template>
  <pageContainer title="文章分类">
    <template #extra>
      <el-button type="primary">添加分类</el-button>
    </template>
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column label="序号" type="index" width="100"></el-table-column>
      <el-table-column label="分类名称" prop="cate_name"></el-table-column>
      <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
      <el-table-column label="操作" width="100">
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
            @click="onDelChannel(row, $index)"
          />
        </template>
      </el-table-column>

      <template #empty>
        <el-empty description="空空如也" />
      </template>
    </el-table>
  </pageContainer>
</template>

<style lang="scss" scoped></style>
