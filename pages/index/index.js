const { getLocalLocation } = require('../../utils/geo.js')

Page({
  data: {
    scale: 16,
    center: {
      latitude: 39.909,
      longitude: 116.397,
    },
    bottomSheetVisible: false,
    selectedLocation: {
      name: '定位中...',
      latitude: '--',
      longitude: '--',
      province: '',
    },
    previewImages: [
      'https://heatpatch.axpz.org/uploads/74a211daffc6bf07a9b5f22b23930041.jpg',
      'https://heatpatch.axpz.org/uploads/74a211daffc6bf07a9b5f22b23930041.jpg',
    ],
  },
  onLoad() {    
    this.initLocation()
  },
  onMapTap(e) {
    const { latitude, longitude } = e.detail
    this.handleLocationSelect(latitude, longitude)
  },
  onPoiTap(e) {
    const { name, latitude, longitude } = e.detail
    console.log(name, latitude, longitude)
    this.handleLocationSelect(latitude, longitude, name)
  },
  handleLocationSelect(latitude, longitude, name = '解析省份中...') {
    // 始终显示弹窗并更新位置信息
    this.setData({
      bottomSheetVisible: true,
      selectedLocation: {
        name,
        latitude: latitude.toFixed(6),
        longitude: longitude.toFixed(6),
        province: '',
      },
    })
    this.reverseGeocode(latitude, longitude, name)
  },
  initLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        const { latitude, longitude } = res
        this.setData({
          center: {
            latitude,
            longitude,
          },
          selectedLocation: {
            name: '当前位置',
            latitude: latitude.toFixed(6),
            longitude: longitude.toFixed(6),
            province: '',
          },
        })
        this.reverseGeocode(latitude, longitude)
      },
      fail: () => {
        this.setData({
          selectedLocation: {
            name: '定位失败',
            latitude: '--',
            longitude: '--',
            province: '',
          },
        })
      },
    })
  },
  reverseGeocode(latitude, longitude, providedName) {
    // const tencentMapKey = process.env.TENCENT_MAP_KEY
    // wx.request({
    //   url: 'https://apis.map.qq.com/ws/geocoder/v1/',
    //   data: {
    //     location: `${latitude},${longitude}`,
    //     key: tencentMapKey,
    //     get_poi: 0,
    //   },
    //   success: res => {
    //     const data = res.data || {}
    //     const result = data.result || {}
    //     const addressComponent = result.address_component || {}
    //     const province = addressComponent.province || ''
    //     const city = addressComponent.city || ''
    //     const district = addressComponent.district || ''
    //     const name = province || city || district ? `${province}${city}${district}` : '未知位置'
    //     this.setData({
    //       selectedLocation: {
    //         name,
    //         latitude,
    //         longitude,
    //         province,
    //       },
    //     })
    //   },
    //   fail: () => {
    //     this.setData({
    //       selectedLocation: {
    //         name: '省份解析失败',
    //         latitude,
    //         longitude,
    //         province: '',
    //       },
    //     })

    const { province, city } = getLocalLocation(longitude, latitude)
    
    // 如果提供了有效的名称（比如 POI 名称），则优先使用；
    // 否则使用解析出来的省份名称。
    let name = providedName
    if (!name || name === '解析省份中...') {
      name = province ? `${province}` : (province || '未知位置')
    }
    
    this.setData({
      selectedLocation: {
        name,
        latitude: latitude.toFixed(6),
        longitude: longitude.toFixed(6),
        province,
      },
    })

    // 获取后端推荐方案
    this.fetchRegionInfo(province)
  },
  fetchRegionInfo(province) {
    // 简单的省份名称到 slug 的映射，这里先硬编码北京示例
    // 实际项目中可以根据 province 动态生成 slug
    let slug = 'beijing'
    if (province.includes('北京')) slug = 'beijing'
    else if (province.includes('上海')) slug = 'shanghai'
    // ... 其他映射

    wx.request({
      url: `http://localhost:8080/api/v2/region/${slug}`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200 && res.data && res.data.data) {
          const regionData = res.data.data
          const images = regionData.content ? regionData.content.images : []
          
          if (images && images.length > 0) {
            this.setData({
              previewImages: images
            })
          }
        }
      },
      fail: (err) => {
        console.error('获取地区信息失败:', err)
      }
    })
  },
  onCloseBottomSheet() {
    this.setData({
      bottomSheetVisible: false,
    })
  },
  onImagePreview(e) {
    const { index } = e.currentTarget.dataset
    const urls = this.data.previewImages || []
    if (!urls.length) {
      return
    }
    const current = urls[index] || urls[0]
    wx.previewImage({
      current,
      urls,
    })
  },
})
