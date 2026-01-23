/**
 * 本地存储工具（基于版本控制，不再使用过期时间）
 */

/**
 * 设置本地存储
 * @param {string} key 
 * @param {any} data 
 */
function setWithExpire(key, data) {
  wx.setStorageSync(key, data);
}

/**
 * 获取本地存储
 * @param {string} key 
 * @returns {any|null}
 */
function getWithExpire(key) {
  const data = wx.getStorageSync(key);
  return data || null;
}

module.exports = {
  setWithExpire,
  getWithExpire
};
