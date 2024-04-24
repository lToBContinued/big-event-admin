import request from '@/utils/request'

/* 分类相关 */
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

/* 文章相关 */
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

// 获取文章列表
export const articleGetListService = (data) => {
  return request({
    url: '/my/article/list',
    method: 'GET',
    params: data
  })
}

// 删除文章
export const articleDelInfoService = (id) => {
  return request({
    url: '/my/article/info',
    method: 'DELETE',
    params: {
      id
    }
  })
}

// 发布文章
export const articlePublishService = (data) => {
  return request({
    url: '/my/article/add',
    method: 'POST',
    data
  })
}

// 获取文章详情
export const articleGetDetailService = (id) => {
  return request({
    url: '/my/article/info',
    params: {
      id
    }
  })
}

// 更新编辑后的文章
export const articleEditService = (data) => {
  return request({
    url: '/my/article/info',
    method: 'PUT',
    data
  })
}
