<script setup>
import { ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import ChannelSelect from '@/views/article/components/ChannelSelect.vue'
import ArticleEdit from '@/views/article/components/ArticleEdit.vue'
import PageContainer from '@/components/pageContainer.vue'
import { articleGetListService } from '@/api/article.js'
import { formatTime } from '../../utils/format.js'
// 文章列表----------------------------------------
const articleList = ref([])
// 文章总条数
const total = ref(0)
// 添加加载效果
const isLoading = ref(false)

// 传递给获取文章列表的参数---------------------------
const params = ref({
  pagenum: 1,
  pagesize: 5,
  cate_id: '',
  state: ''
})

// 一进浏览器立即渲染-------------------------------
const getArticleList = async () => {
  isLoading.value = true
  const res = await articleGetListService(params.value)
  articleList.value = res.data.data
  total.value = res.data.total
  isLoading.value = false
}
getArticleList()

// 搜索和重置--------------------------------------
// 点击搜索，获取符合条件的文章列表
const onSearch = () => {
  params.value.pagenum = 1
  getArticleList()
}
// 点击重置，清空下拉选框，显示所有文章
const onReset = () => {
  params.value.pagenum = 1
  params.value.cate_id = ''
  params.value.state = ''
  getArticleList()
}

// 编辑和删除功能-----------------------------------
const articleEditRef = ref(null)
// 新增文章
const onAddArticle = () => {
  articleEditRef.value.open({})
}

// 编辑文章
const onEditArticle = (row) => {
  articleEditRef.value.open(row)
}
// 删除文章
const onDeleteArticle = (row) => {
  ElMessageBox.confirm('确定要删除吗？', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(async () => {
      await articleEditRef.value.delArticle(row)
      await getArticleList()
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

// 分页器逻辑--------------------------------------
// 每页条数
const onSizeChange = async (size) => {
  isLoading.value = true
  // 只要是每页条数变化了，原本访问的当前页意义不大了，数据已经不在原来那一页了，重新从第一页渲染
  params.value.pagenum = 1
  params.value.pagesize = size
  await getArticleList()
  isLoading.value = false
}
// 当前页
const onCurrentChange = async (page) => {
  isLoading.value = true
  params.value.pagenum = page
  await getArticleList()
  isLoading.value = false
}

// 抽屉-------------------------------
const onSuccess = (type) => {
  if (type === 'add') {
    // 如果是添加，最好渲染最后一页
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    params.value.pagenum = lastPage
  }
  getArticleList()
}
</script>

<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">新增文章</el-button>
    </template>
    <!--搜索框表单-->
    <el-form class="search" inline>
      <el-form-item label="文章分类：">
        <!--v-model => :modelValue 和 @update:modelValue 的简写-->
        <channel-select v-model="params.cate_id" width="240px"></channel-select>
      </el-form-item>
      <el-form-item label="发布状态：">
        <el-select v-model="params.state" style="width: 240px">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button size="default" type="primary" @click="onSearch">
          搜索
        </el-button>
        <el-button size="default" @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!--表格-->
    <el-table
      v-loading="isLoading"
      :data="articleList"
      height="410px"
      style="width: 100%"
    >
      <el-table-column label="文章标题" prop="title">
        <template #default="{ row }">
          <el-link :underline="false" type="primary">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发布时间" prop="pub_date">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <!--利用作用域插槽，可以获取当前行的数据，row相当于用v-for遍历item-->
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditArticle(row)"
          />
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDeleteArticle(row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <!--分页器-->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :background="true"
      :page-sizes="[2, 4, 5, 10]"
      :total="total"
      layout="jumper, total, sizes, prev, pager, next"
      style="margin-top: 20px; display: flex; justify-content: flex-end"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
    />

    <!--抽屉弹层-文章编辑-->
    <article-edit ref="articleEditRef" @success="onSuccess"></article-edit>
  </page-container>
</template>

<style lang="scss" scoped></style>
