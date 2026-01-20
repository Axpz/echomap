const { PROVINCES, CITIES } = require('./geo-data.js');

/**
 * 计算两个经纬度点之间的距离（欧几里得距离，简单近似）
 */
function getDistance(p1, p2) {
  return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}

/**
 * 根据经纬度获取所在的省份和城市（离线版）
 * @param {number} longitude 经度
 * @param {number} latitude 纬度
 * @returns {Object} { province, city, provinceSlug, citySlug }
 */
function getLocalLocation(longitude, latitude) {
  const point = [longitude, latitude];
  
  // 1. 查找所有匹配 BBox 的省份
  const matchedProvinces = PROVINCES.filter(p => 
    longitude >= p.bbox[0] && longitude <= p.bbox[2] &&
    latitude >= p.bbox[1] && latitude <= p.bbox[3]
  );

  // 2. 在这些省份的城市中找最近的
  let cityMatch = null;
  let provinceMatch = null;
  let citySlugMatch = null;
  let provinceSlugMatch = null;
  let minCityDist = Infinity;

  // 获取这些省份的所有城市
  const candidateCities = CITIES.filter(c => 
    matchedProvinces.some(p => p.name === c.province)
  );

  if (candidateCities.length > 0) {
    for (const c of candidateCities) {
      const dist = getDistance(point, c.center);
      if (dist < minCityDist) {
        minCityDist = dist;
        cityMatch = c.name;
        citySlugMatch = c.slug;
        provinceMatch = c.province;
        provinceSlugMatch = PROVINCES.find(p => p.name === provinceMatch)?.slug;
      }
    }
  }

  // 如果还是没找到（可能是该省份没有城市数据），使用面积最小的省份
  if (!provinceMatch && matchedProvinces.length > 0) {
    let minArea = Infinity;
    for (const p of matchedProvinces) {
      const area = (p.bbox[2] - p.bbox[0]) * (p.bbox[3] - p.bbox[1]);
      if (area < minArea) {
        minArea = area;
        provinceMatch = p.name;
        provinceSlugMatch = p.slug;
        cityMatch = p.name;
        citySlugMatch = p.slug;
      }
    }
  }

  // 如果连 BBox 都没有匹配到，找全球最近的省份中心
  if (!provinceMatch) {
    let minProvinceDist = Infinity;
    for (const p of PROVINCES) {
      const dist = getDistance(point, p.center);
      if (dist < minProvinceDist) {
        minProvinceDist = dist;
        provinceMatch = p.name;
        provinceSlugMatch = p.slug;
        cityMatch = p.name;
        citySlugMatch = p.slug;
      }
    }
  }

  return {
    province: provinceMatch || '未知省份',
    city: cityMatch || provinceMatch || '未知城市',
    provinceSlug: provinceSlugMatch || 'unknown',
    citySlug: citySlugMatch || 'unknown'
  };
}

module.exports = {
  getLocalLocation
};
