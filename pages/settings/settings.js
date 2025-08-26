// pages/settings/settings.js
const storage = require('../../utils/storage.js');
const request = require('../../utils/request.js');
const api = require('../../utils/api.js');

Page({

  /**
   * Page initial data
   */
  data: {
    targetLanguage: null,
    flagEmoji: '🇺🇸', // Default flag
    // available languages fetched from server
  languages: [],
  // control for language selection modal
  showLanguageModal: false
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
    // Open the language selection modal
    this.setData({ showLanguageModal: true });
  },

  /**
   * Called when a language item is selected inside the modal
   * data-code attribute contains the language code
   */
  onSelectLanguage(e) {
    const code = e.currentTarget.dataset.code;
    if (code) {
      // set selected language as target
      this.setData({ targetLanguage: code });
      // update flag emoji
      const flagEmoji = this.getFlagEmoji(code);
      this.setData({ flagEmoji });
      // close modal
      this.setData({ showLanguageModal: false });
      // persist selection via storage util
      try {
        const ok = storage.setUserInfo({ targetLang: code });
        if (!ok) console.warn('storage.setUserInfo returned false when setting targetLang');
      } catch (err) {
        console.warn('Failed to persist selected language via storage.setUserInfo', err);
      }
      // update server with selected language
      try {
        this.setUserLanguageOnServer(code);
      } catch (err) {
        console.warn('Failed to call setUserLanguageOnServer', err);
      }
    }
  },

  /**
   * Send selected language to server
   * PUT /user/set/lang { targetLang }
   */
  setUserLanguageOnServer(targetLang) {
    try {
      request.request({
        url: '/user/set/lang',
        method: 'PUT',
        data: { targetLang, lang: "zh-CN" },
        success(res) {
          if (res && res.data && res.data.code === 0) {
            console.log('setUserLanguageOnServer success', targetLang);
            // refresh token after changing language on server
            api.refreshToken()
              .then((r) => {
                console.log('refreshToken response', r);
                try {
                  const data = r && r.data && r.data.data ? r.data.data : null;
                  if (data) {
                    const token = data.token || null;
                    const userInfo = data.userInfo || null;
                    console.log('refreshed token:', token);
                    console.log('refreshed userInfo:', userInfo);
                    try {
                      const ok = storage.setUserInfoAndToken(userInfo, token);
                      console.log('persisted refreshed credentials:', ok);
                    } catch (ex2) {
                      console.warn('Failed to persist refreshed credentials', ex2);
                    }
                  }
                } catch (ex) {
                  console.warn('Failed to parse refreshToken response', ex);
                }
              })
              .catch((err) => {
                console.warn('refreshToken failed', err);
              });
          } else {
            console.warn('setUserLanguageOnServer unexpected response', res && res.data);
          }
        },
        fail(err) {
          console.error('setUserLanguageOnServer failed', err);
        }
      });
    } catch (err) {
      console.error('setUserLanguageOnServer exception', err);
    }
  },

  /**
   * Modal close handler
   */
  onLanguageModalClose() {
    this.setData({ showLanguageModal: false });
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
            // Filter out 'zh-CN' from the language list and enhance with flag and label
            const filteredLanguages = res.data.data.values
              .filter(lang => lang.code !== 'zh-CN')
            that.setData({ languages: filteredLanguages });
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