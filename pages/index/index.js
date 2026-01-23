const { getLocalLocation } = require('../../utils/geo.js')
const { setWithExpire, getWithExpire } = require('../../utils/storage.js')
const { matchKnowledge, normalize } = require('../../utils/match.js')

// 用于记录本周期（登录后）已校验过版本的路径
const verifiedPaths = new Set();

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
    allKnowledge: [], // 合并后的知识库
    matchedKnowledge: null, // 匹配到的 POI 知识
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
        city: '',
        provinceSlug: '',
        citySlug: '',
      },
      cityImages: [],
      provinceImages: [],
      allKnowledge: [],
      matchedKnowledge: null,
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
          allKnowledge: [],
          matchedKnowledge: null,
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
          allKnowledge: [],
          matchedKnowledge: null,
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
        city,
        provinceSlug,
        citySlug,
      },
    })

    // 获取城市和省份的图片（考虑嵌套关系）
    this.fetchAllContent(citySlug, provinceSlug, name)
  },
  // 封装请求内容的方法，返回 Promise，包含图片和原始文件名列表
  fetchContentBySlug(path) {
    if (!path || path === 'unknown') return Promise.resolve({ images: [], files: [] })
    
    const baseUrl = 'https://gitee.com/axpz/echomap/raw/main/assets/raw_images/'
    const cacheKey = `meta_cache_${path}`
    const cachedData = getWithExpire(cacheKey)

    const formatData = (data, slugPath) => {
      const images = (data.images || []).map(img => `${baseUrl}${slugPath}/${img}`)
      const files = (data.files || []).map(file => ({
        title: file.replace('.md', ''),
        file: file,
        url: `${baseUrl}${slugPath}/${file}`
      }))
      return { images, files }
    }

    if (cachedData && verifiedPaths.has(path)) {
      return Promise.resolve(formatData(cachedData, path))
    }

    return new Promise((resolve) => {
      wx.cloud.callFunction({
        name: 'giteeproxy',
        data: {
          url: `${baseUrl}${path}/meta.json`
        },
        success: (res) => {
          if (res.result && res.result.code === 0) {
            const remoteData = res.result.data
            verifiedPaths.add(path)
            if (!cachedData || cachedData.version !== remoteData.version) {
              setWithExpire(cacheKey, remoteData)
            }
            resolve(formatData(remoteData, path))
          } else {
            console.error('云函数调用失败:', res.result ? res.result.msg : '未知错误')
            resolve({ images: [], files: [] })
          }
        },
        fail: (err) => {
          console.error('云函数请求异常:', err)
          if (cachedData) {
            resolve(formatData(cachedData, path))
          } else {
            resolve({ images: [], files: [] })
          }
        }
      })
    })
  },
  // 并行获取并合并内容
  async fetchAllContent(citySlug, provinceSlug, poiName) {
    const hasCity = citySlug && citySlug !== 'unknown';
    const hasProvince = provinceSlug && provinceSlug !== 'unknown';
    const isSame = citySlug === provinceSlug;

    let cityPath = '';
    let provincePath = '';

    if (hasCity && hasProvince && !isSame) {
      // 场景 1: 标准两级结构 (如 hebei/shijiazhuang)
      cityPath = `${provinceSlug}/${citySlug}`;
      provincePath = provinceSlug;
    } else {
      // 场景 2: 单级结构 (直辖市 beijing/beijing，或者只有省，或者只有市)
      cityPath = hasCity ? citySlug : (hasProvince ? provinceSlug : '');
      provincePath = ''; // 这种情况下不需要再读第二层
    }

    const cityPromise = cityPath ? this.fetchContentBySlug(cityPath) : Promise.resolve({ images: [], files: [] });
    const provincePromise = provincePath ? this.fetchContentBySlug(provincePath) : Promise.resolve({ images: [], files: [] });

    try {
      const [cityContent, provinceContent] = await Promise.all([cityPromise, provincePromise])

      // 层级合并策略：
      // 1. 图片合并（城市优先）
      const cityImages = cityContent.images
      const provinceImages = provinceContent.images

      // 2. 知识库合并：city.files + province.files，去重
      const allKnowledgeMap = new Map()
      // 先加省级的
      provinceContent.files.forEach(f => allKnowledgeMap.set(f.title, f))
      // 再加市级的（同名覆盖，即城市优先）
      cityContent.files.forEach(f => allKnowledgeMap.set(f.title, f))
      
      const allKnowledge = Array.from(allKnowledgeMap.values())

      // 3. POI 匹配
      const matchedKnowledge = matchKnowledge(poiName, allKnowledge, 0.6)

      this.setData({
        cityImages,
        provinceImages,
        allKnowledge,
        matchedKnowledge
      })
    } catch (err) {
      console.error('获取内容失败:', err)
    }
  },
  onArticleTap(e) {
    const { url, title } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/article/article?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
    })
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
