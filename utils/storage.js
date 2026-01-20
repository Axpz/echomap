/**
 * 带过期时间的本地存储工具
 */

const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;

/**
 * 设置带过期时间的缓存
 * @param {string} key 
 * @param {any} data 
 * @param {number} expire 过期时间（毫秒），默认15天
 */
function setWithExpire(key, data, expire = FIFTEEN_DAYS_MS) {
  const expireTime = Date.now() + expire;
  const payload = {
    data,
    expireTime
  };
  wx.setStorageSync(key, payload);
}

/**
 * 获取缓存，如果过期则返回 null
 * @param {string} key 
 * @returns {any|null}
 */
function getWithExpire(key) {
  const payload = wx.getStorageSync(key);
  if (!payload) return null;

  if (Date.now() > payload.expireTime) {
    wx.removeStorageSync(key);
    return null;
  }

  return payload.data;
}

module.exports = {
  setWithExpire,
  getWithExpire
};
