// utils/share.js
const storage = require('./storage.js');

/**
 * Get share path with referrer ID
 * @param {string} targetPage - The target page path (e.g., 'pages/home/home')
 * @returns {string} Share path with or without referrer ID
 */
function getSharePath(targetPage = 'pages/home/home') {
  try {
    const userId = storage.getUserId();
    
    if (userId) {
      return `${targetPage}?refererId=${userId}`;
    } else {
      return targetPage;
    }
  } catch (error) {
    console.error('Error getting share path:', error);
    return targetPage;
  }
}

module.exports = {
  getSharePath
};
