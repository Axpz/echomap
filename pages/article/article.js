Page({
  data: {
    title: '加载中...',
    content: '',
    url: ''
  },
  onLoad(options) {
    const { url, title } = options
    if (url) {
      this.setData({ 
        url: decodeURIComponent(url),
        title: decodeURIComponent(title || '知识内容')
      })
      this.fetchArticleContent()
    }
  },
  fetchArticleContent() {
    wx.showLoading({ title: '加载中...' })
    wx.request({
      url: this.data.url,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({
            content: res.data
          })
        } else {
          this.setData({
            content: '无法加载内容，请稍后再试。'
          })
        }
      },
      fail: () => {
        this.setData({
          content: '网络请求失败，请检查网络连接。'
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  }
})
