// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

// 云函数入口函数
exports.main = async (event, context) => {
  const { url } = event

  if (!url) {
    return {
      code: -1,
      msg: 'url is required'
    }
  }

  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'json'
    })

    return {
      code: 0,
      data: response.data,
      statusCode: response.status
    }
  } catch (error) {
    console.error('Proxy Error:', error)
    return {
      code: -1,
      msg: error.message,
      error: error.response ? error.response.data : null
    }
  }
}