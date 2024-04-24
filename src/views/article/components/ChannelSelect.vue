<script setup>
import { ref } from 'vue'
import { articleGetChannelsService } from '@/api/article.js'

defineProps({
  modelValue: {
    type: [Number, String]
  },
  width: {
    type: String
  }
})

const emit = defineEmits(['update:modelValue'])

// 获取文章分类----------------------------------------
const channelList = ref([])
const getChannelList = async () => {
  const {
    data: { data }
  } = await articleGetChannelsService()
  channelList.value = data
}
getChannelList()
</script>

<template>
  <!--label 展示给用户看，value 收集起来交给后台-->
  <el-select
    :modelValue="modelValue"
    :style="{ width }"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <el-option
      v-for="channel in channelList"
      :key="channel.id"
      :label="channel.cate_name"
      :value="channel.id"
    ></el-option>
  </el-select>
</template>

<style lang="scss" scoped></style>
