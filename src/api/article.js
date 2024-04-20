import request from '@/utils/request'

// 获取文章分类
export const articleGetChannelsService = () => {
  return request({ url: '/my/cate/list' })
}
