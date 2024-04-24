// 格式化时间
export const formatTime = (dateStr) => {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = ('0' + (date.getMonth() + 1)).slice(-2) // getMonth() 返回的是从0开始的月份，所以需要+1
  const day = ('0' + date.getDate()).slice(-2)
  return `${year}年${month}月${day}日`
}
