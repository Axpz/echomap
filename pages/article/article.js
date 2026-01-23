const { parse } = require('../../utils/markdown.js')

Page({
  data: {
    title: '加载中...',
    htmlContent: '', // 解析后的 HTML 内容
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
    
    wx.cloud.callFunction({
      name: 'giteeproxy',
      data: {
        url: this.data.url
      },
      success: (res) => {
        if (res.result && res.result.code === 0) {
          const content = res.result.data
          this.setData({
            htmlContent: parse(content)
          })
        } else {
          this.setData({
            htmlContent: '<p>无法加载内容，请稍后再试。</p>'
          })
        }
      },
      fail: (err) => {
        console.error('获取文章内容失败:', err)
        this.setData({
          htmlContent: '<p>网络请求失败，请检查网络连接。</p>'
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  }
})
