// pages/settings/settings.js
const storage = require('../../utils/storage.js');

Page({

  /**
   * Page initial data
   */
  data: {
    targetLanguage: null,
    flagEmoji: '🇺🇸' // Default flag
  },

  /**
   * Get flag emoji based on target language
   */
  getFlagEmoji(lang) {
    // Accepts a language code parameter (e.g. 'en-US') and returns a flag emoji
    const languageFlagMap = {
      'en': '🇺🇸',
      'en-US': '🇺🇸',
      'zh': '🇨🇳',
      'zh-CN': '🇨🇳',
      'ja': '🇯🇵',
      'ja-JP': '🇯🇵',
      'ko': '🇰🇷',
      'ko-KR': '🇰🇷',
      'es': '🇪🇸',
      'es-ES': '🇪🇸',
      'fr': '🇫🇷',
      'fr-FR': '🇫🇷',
      'de': '🇩🇪',
      'de-DE': '🇩🇪'
    };

    const code = lang || null;
    return code && languageFlagMap[code] ? languageFlagMap[code] : '🇺🇸'; // Default to US flag
  },

  /**
   * Navigate to search language settings
   */
  goToSearchLanguage() {
    wx.showToast({
      title: '语言设置功能开发中…',
      icon: 'none',
      duration: 1500
    });
  },

  /**
   * Navigate to points page
   */
  goToPoints() {
    wx.navigateTo({
      url: '/pages/points/points'
    });
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    try {
      const target = storage.getTargetLanguage();
      if (target) {
        this.setData({ targetLanguage: target });
        // Set flag emoji based on target language
        const flagEmoji = this.getFlagEmoji(target);
        this.setData({ flagEmoji });
      } else {
        this.setData({ 
          targetLanguage: null,
          flagEmoji: '🇺🇸' // Default flag
        });
      }
    } catch (err) {
      console.error('Failed to load target language:', err);
      this.setData({ 
        targetLanguage: null,
        flagEmoji: '🇺🇸' // Default flag
      });
    }

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  }
})