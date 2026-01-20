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
      provinceSlug: '',
      citySlug: '',
    },
    cityImages: [],
    provinceImages: [],
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
        provinceSlug: '',
        citySlug: '',
      },
      cityImages: [],
      provinceImages: [],
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
            provinceSlug: '',
            citySlug: '',
          },
          cityImages: [],
          provinceImages: [],
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
            provinceSlug: '',
            citySlug: '',
          },
          cityImages: [],
          provinceImages: [],
        })
      },
    })
  },
  reverseGeocode(latitude, longitude, providedName) {
    const { province, city, provinceSlug, citySlug } = getLocalLocation(longitude, latitude)
    
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
        provinceSlug,
        citySlug,
      },
    })

    // 获取城市和省份的图片（考虑嵌套关系）
    this.fetchAllImages(citySlug, provinceSlug)
  },
  // 封装请求图片的方法，返回 Promise，参数为相对路径
  fetchImagesBySlug(path) {
    if (!path || path === 'unknown') return Promise.resolve([])
    
    const baseUrl = 'https://gitee.com/axpz/echomap/raw/main/assets/raw_images/'
    return new Promise((resolve) => {
      wx.request({
        url: `${baseUrl}${path}/meta.json`,
        method: 'GET',
        success: (res) => {
          if (res.statusCode === 200 && res.data && res.data.images) {
            const images = res.data.images.map(imgName => `${baseUrl}${path}/${imgName}`)
            resolve(images)
          } else {
            resolve([])
          }
        },
        fail: () => {
          resolve([])
        }
      })
    })
  },
  // 并行获取并合并图片
  async fetchAllImages(citySlug, provinceSlug) {
    // 构造路径：城市通常嵌套在省份文件夹下
    // 如果 citySlug 和 provinceSlug 不同（如：hebei/shijiazhuang）
    // 如果相同（如直辖市：beijing），则直接使用 provinceSlug
    const isSpecialRegion = !citySlug || !provinceSlug || citySlug === provinceSlug
    
    const cityPath = isSpecialRegion ? citySlug : `${provinceSlug}/${citySlug}`
    const provincePath = provinceSlug

    const cityImagesPromise = this.fetchImagesBySlug(cityPath)
    const provinceImagesPromise = !isSpecialRegion 
      ? this.fetchImagesBySlug(provincePath) 
      : Promise.resolve([])

    try {
      const [cityImages, provinceImages] = await Promise.all([
        cityImagesPromise,
        provinceImagesPromise
      ])

      this.setData({
        cityImages: cityImages,
        provinceImages: provinceImages
      })
    } catch (err) {
      console.error('获取旅游信息失败:', err)
      this.setData({ 
        cityImages: [],
        provinceImages: []
      })
    }
  },
  onCloseBottomSheet() {
    this.setData({
      bottomSheetVisible: false,
    })
  },
  onImagePreview(e) {
    const { index, type } = e.currentTarget.dataset
    const urls = type === 'city' ? this.data.cityImages : this.data.provinceImages
    if (!urls || !urls.length) {
      return
    }
    const current = urls[index] || urls[0]
    wx.previewImage({
      current,
      urls,
    })
  },
})
