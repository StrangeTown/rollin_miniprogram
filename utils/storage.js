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

module.exports = {
  getUserId,
  getTargetLanguage
};