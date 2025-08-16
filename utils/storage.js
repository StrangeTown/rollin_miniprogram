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

module.exports = {
  getUserId
};