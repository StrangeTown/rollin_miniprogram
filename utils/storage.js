// utils/storage.js

/**
 * Get user ID from storage
 * @returns {string|null} User ID or null if not found
 */
function getUserId() {
  try {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo && userInfo.id) {
      return userInfo.id;
    }
    return null;
  } catch (error) {
    console.error('Error getting user ID from storage:', error);
    return null;
  }
}

/**
 * Get target language from stored userInfo
 * @returns {string|null} target language code (e.g. 'en') or null if not set
 */
function getTargetLanguage() {
  try {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo && userInfo.targetLang) {
      return userInfo.targetLang;
    }
    return null;
  } catch (error) {
    console.error('Error getting target language from storage:', error);
    return null;
  }
}

/**
 * Persist userInfo object to storage. Only the known fields will be written.
 * Allowed fields: id, isVip, lang, nickname, openId, registerTime, targetLang
 * @param {Object} info
 * @returns {boolean} true on success, false on failure
 */
function setUserInfo(info) {
  if (!info || typeof info !== 'object') return false;
  try {
    const existing = wx.getStorageSync('userInfo') || {};
    const allowed = ['id', 'isVip', 'lang', 'nickname', 'openId', 'registerTime', 'targetLang'];
    allowed.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(info, key)) {
        existing[key] = info[key];
      }
    });
    wx.setStorageSync('userInfo', existing);
    return true;
  } catch (err) {
    console.error('Error setting userInfo in storage:', err);
    return false;
  }
}

module.exports = {
  getUserId,
  getTargetLanguage,
  setUserInfo
};