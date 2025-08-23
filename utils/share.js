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

/**
 * Get random share image path
 * @returns {string} Random share image path from share_1.png to share_5.png
 */
function getShareImagePath() {
  // Generate random number between 1 and 5
  const randomNum = Math.floor(Math.random() * 5) + 1;
  return `/assets/images/share/share_${randomNum}.png`;
}

module.exports = {
  getSharePath,
  getShareImagePath
};
