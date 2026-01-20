/**
 * 中国省份和城市的基础数据（简化版）
 * 包含省份的边界矩形 (bbox) 和中心点，以及主要城市的中心点
 */

const PROVINCES = [
  { name: '北京市', slug: 'beijing', bbox: [115.4, 39.4, 117.5, 41.1], center: [116.405285, 39.904989] },
  { name: '天津市', slug: 'tianjin', bbox: [116.7, 38.5, 118.1, 40.2], center: [117.190182, 39.125596] },
  { name: '河北省', slug: 'hebei', bbox: [113.4, 36.0, 119.9, 42.6], center: [114.502461, 38.045474] },
  { name: '山西省', slug: 'shanxi', bbox: [110.2, 34.5, 114.6, 40.8], center: [112.549248, 37.857014] },
  { name: '内蒙古自治区', slug: 'neimenggu', bbox: [97.1, 37.4, 126.1, 53.5], center: [111.670801, 40.818311] },
  { name: '辽宁省', slug: 'liaoning', bbox: [118.8, 38.7, 125.8, 43.5], center: [123.429096, 41.796767] },
  { name: '吉林省', slug: 'jilin', bbox: [121.6, 40.8, 131.3, 46.3], center: [125.324542, 43.886841] },
  { name: '黑龙江省', slug: 'heilongjiang', bbox: [121.1, 43.4, 135.1, 53.6], center: [126.642464, 45.756967] },
  { name: '上海市', slug: 'shanghai', bbox: [120.8, 30.6, 122.2, 31.9], center: [121.472644, 31.231706] },
  { name: '江苏省', slug: 'jiangsu', bbox: [116.3, 30.7, 121.9, 35.1], center: [118.767413, 32.041544] },
  { name: '浙江省', slug: 'zhejiang', bbox: [118.0, 27.0, 122.9, 31.2], center: [120.153576, 30.287459] },
  { name: '安徽省', slug: 'anhui', bbox: [114.8, 29.6, 119.7, 34.7], center: [117.283042, 31.86119] },
  { name: '福建省', slug: 'fujian', bbox: [115.8, 23.5, 120.7, 28.4], center: [119.306239, 26.075302] },
  { name: '江西省', slug: 'jiangxi', bbox: [113.5, 24.4, 118.5, 30.1], center: [115.892151, 28.676493] },
  { name: '山东省', slug: 'shandong', bbox: [114.7, 34.3, 122.7, 38.4], center: [117.000923, 36.675807] },
  { name: '河南省', slug: 'henan', bbox: [110.3, 31.3, 116.7, 36.4], center: [113.665412, 34.757975] },
  { name: '湖北省', slug: 'hubei', bbox: [108.3, 29.0, 116.2, 33.3], center: [114.298572, 30.584355] },
  { name: '湖南省', slug: 'hunan', bbox: [108.7, 24.6, 114.3, 30.1], center: [112.982279, 28.19409] },
  { name: '广东省', slug: 'guangdong', bbox: [109.6, 20.2, 117.2, 25.5], center: [113.280637, 23.125178] },
  { name: '广西壮族自治区', slug: 'guangxi', bbox: [104.4, 20.9, 112.1, 26.4], center: [108.320004, 22.82402] },
  { name: '海南省', slug: 'hainan', bbox: [108.6, 18.1, 111.1, 20.2], center: [110.33119, 20.031971] },
  { name: '重庆市', slug: 'chongqing', bbox: [105.1, 28.1, 110.2, 32.3], center: [106.504962, 29.533155] },
  { name: '四川省', slug: 'sichuan', bbox: [97.3, 26.0, 108.6, 34.4], center: [104.065735, 30.659462] },
  { name: '贵州省', slug: 'guizhou', bbox: [103.5, 24.6, 109.6, 29.3], center: [106.713478, 26.578343] },
  { name: '云南省', slug: 'yunnan', bbox: [97.5, 21.1, 106.2, 29.3], center: [102.712251, 25.040609] },
  { name: '西藏自治区', slug: 'xizang', bbox: [78.4, 26.8, 99.1, 36.5], center: [91.132212, 29.660361] },
  { name: '陕西省', slug: 'shanxi', bbox: [105.4, 31.7, 111.3, 39.6], center: [108.948024, 34.263161] },
  { name: '甘肃省', slug: 'gansu', bbox: [92.2, 32.5, 108.8, 42.8], center: [103.823557, 36.058039] },
  { name: '青海省', slug: 'qinghai', bbox: [89.4, 31.6, 103.1, 39.3], center: [101.778916, 36.623178] },
  { name: '宁夏回族自治区', slug: 'ningxia', bbox: [104.2, 35.2, 107.7, 39.5], center: [106.278179, 38.46637] },
  { name: '新疆维吾尔自治区', slug: 'xinjiang', bbox: [73.6, 34.3, 96.4, 49.2], center: [87.617733, 43.792818] },
  { name: '香港特别行政区', slug: 'hongkong', bbox: [113.83, 22.15, 114.44, 22.56], center: [114.173355, 22.320048] },
  { name: '澳门特别行政区', slug: 'macao', bbox: [113.52, 22.11, 113.59, 22.22], center: [113.54909, 22.198951] },
  { name: '台湾省', slug: 'taiwan', bbox: [119.3, 21.8, 122.1, 25.4], center: [121.509062, 25.044332] }
];

// 城市中心点数据
const CITIES = [
  { name: '东城区', slug: 'dongcheng', province: '北京市', center: [116.405285, 39.904989] },
  { name: '天津市', slug: 'tianjin', province: '天津市', center: [117.190182, 39.125596] },
  { name: '上海市', slug: 'shanghai', province: '上海市', center: [121.472644, 31.231706] },
  { name: '重庆市', slug: 'chongqing', province: '重庆市', center: [106.504962, 29.533155] },
  { name: '香港特别行政区', slug: 'hongkong', province: '香港特别行政区', center: [114.173355, 22.320048] },
  { name: '澳门特别行政区', slug: 'macao', province: '澳门特别行政区', center: [113.54909, 22.198951] },
  { name: '石家庄市', slug: 'shijiazhuang', province: '河北省', center: [114.502461, 38.045474] },
  { name: '太原市', slug: 'taiyuan', province: '山西省', center: [112.549248, 37.857014] },
  { name: '呼和浩特市', slug: 'huhehaote', province: '内蒙古自治区', center: [111.670801, 40.818311] },
  { name: '沈阳市', slug: 'shenyang', province: '辽宁省', center: [123.429096, 41.796767] },
  { name: '长春市', slug: 'changchun', province: '吉林省', center: [125.324542, 43.886841] },
  { name: '哈尔滨市', slug: 'haerbin', province: '黑龙江省', center: [126.642464, 45.756967] },
  { name: '南京市', slug: 'nanjing', province: '江苏省', center: [118.767413, 32.041544] },
  { name: '杭州市', slug: 'hangzhou', province: '浙江省', center: [120.153576, 30.287459] },
  { name: '合肥市', slug: 'hefei', province: '安徽省', center: [117.283042, 31.86119] },
  { name: '福州市', slug: 'fuzhou', province: '福建省', center: [119.306239, 26.075302] },
  { name: '南昌市', slug: 'nanchang', province: '江西省', center: [115.892151, 28.676493] },
  { name: '济南市', slug: 'jinan', province: '山东省', center: [117.000923, 36.675807] },
  { name: '郑州市', slug: 'zhengzhou', province: '河南省', center: [113.665412, 34.757975] },
  { name: '武汉市', slug: 'wuhan', province: '湖北省', center: [114.298572, 30.584355] },
  { name: '长沙市', slug: 'changsha', province: '湖南省', center: [112.982279, 28.19409] },
  { name: '广州市', slug: 'guangzhou', province: '广东省', center: [113.280637, 23.125178] },
  { name: '深圳市', slug: 'shenzhen', province: '广东省', center: [114.085947, 22.547] },
  { name: '南宁市', slug: 'nanning', province: '广西壮族自治区', center: [108.320004, 22.82402] },
  { name: '海口市', slug: 'haikou', province: '海南省', center: [110.33119, 20.031971] },
  { name: '成都市', slug: 'chengdu', province: '四川省', center: [104.065735, 30.659462] },
  { name: '贵阳市', slug: 'guiyang', province: '贵州省', center: [106.713478, 26.578343] },
  { name: '昆明市', slug: 'kunming', province: '云南省', center: [102.712251, 25.040609] },
  { name: '拉萨市', slug: 'lasa', province: '西藏自治区', center: [91.132212, 29.660361] },
  { name: '西安市', slug: 'xian', province: '陕西省', center: [108.948024, 34.263161] },
  { name: '兰州市', slug: 'lanzhou', province: '甘肃省', center: [103.823557, 36.058039] },
  { name: '西宁市', slug: 'xining', province: '青海省', center: [101.778916, 36.623178] },
  { name: '银川市', slug: 'yinchuan', province: '宁夏回族自治区', center: [106.278179, 38.46637] },
  { name: '乌鲁木齐市', slug: 'wulumuqi', province: '新疆维吾尔自治区', center: [87.617733, 43.792818] },
  { name: '台北市', slug: 'taibei', province: '台湾省', center: [121.509062, 25.044332] }
];

module.exports = {
  PROVINCES,
  CITIES
};
