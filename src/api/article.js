import request from '@/utils/request'

// 获取文章分类
export const articleGetChannelsService = () => {
  return request({ url: '/my/cate/list' })
}

// 添加文章分类
export const articleAddChannelsService = (data) => {
  return request({
    url: '/my/cate/add',
    method: 'POST',
    data
  })
}

// 修改文章分类
export const articleEditChannelsService = (data) => {
  return request({
    url: '/my/cate/info',
    method: 'PUT',
    data
  })
}

// 删除文章
export const articleDelChannelsService = (id) => {
  return request({
    url: '/my/cate/del',
    method: 'DELETE',
    params: {
      id
    }
  })
}
