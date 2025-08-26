// pages/settings/settings.js
const storage = require('../../utils/storage.js');
const request = require('../../utils/request.js');

Page({

  /**
   * Page initial data
   */
  data: {
    targetLanguage: null,
    flagEmoji: '🇺🇸', // Default flag
    // available languages fetched from server
    languages: []
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
   * Load and set target language from storage
   */
  loadTargetLanguage() {
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
  * Fetch language configuration from server and set to page data.languages
   * endpoint: /admin/configs/app/language
   * expected response: { code: 0, msg: "成功", data: { keys: "language", values: [ { code, language }, ... ] } }
   */
  fetchLanguageConfig() {
    const that = this;
    try {
      request.request({
        url: '/admin/configs/app/language',
        method: 'GET',
        success(res) {
          if (res && res.data && res.data.code === 0 && res.data.data && Array.isArray(res.data.data.values)) {
            that.setData({ languages: res.data.data.values });
          } else {
            console.warn('fetchLanguageConfig: unexpected response', res && res.data);
          }
        },
        fail(err) {
          console.error('fetchLanguageConfig failed', err);
        }
      });
    } catch (err) {
      console.error('fetchLanguageConfig exception', err);
    }
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    this.loadTargetLanguage();

    // load available languages from server
    this.fetchLanguageConfig();
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