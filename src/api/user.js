import request from '@/utils/request'

// 注册接口
export const userRegisterService = ({ username, password, repassword }) => {
  return request({
    url: '/api/reg',
    method: 'POST',
    data: {
      username,
      password,
      repassword
    }
  })
}

// 登录接口
export const userLoginService = ({ username, password }) => {
  return request({
    url: '/api/login',
    method: 'POST',
    data: {
      username,
      password
    }
  })
}

// 获取用户基本信息
export const userGetInfoService = () => {
  return request({
    url: '/my/userinfo'
  })
}

// 更新用户个人信息
export const userUpdateInfoService = (data) => {
  return request({
    url: '/my/userinfo',
    method: 'PUT',
    data
  })
}

// 更新用户头像
export const userUpdateAvatarService = (avatar) => {
  return request({
    url: '/my/update/avatar',
    method: 'PATCH',
    data: {
      avatar
    }
  })
}

// 修改密码
export const userUpdatePasswordService = (data) => {
  return request({
    url: '/my/updatepwd',
    method: 'PATCH',
    data
  })
}
