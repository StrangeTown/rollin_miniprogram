// pages/search/search.js
Page({

  /**
   * Page initial data
   */
  data: {
    translatedResult: '',
    recentResults: []
  },

  onConfirm(e) {
    const value = e.detail.value;
    if (!value) return;
    const { request } = require('../../utils/request.js');
    request({
      url: '/search',
      method: 'POST',
      data: {
        content: value
      },
      success: res => {
        console.log('Translation response:', res);
        if (res.data && res.data.code === 0) {
          const translatedResult = res.data.data;
          this.setData({ translatedResult });
          this.storeRecentResult({
            input: value,
            result: translatedResult,
            createdAt: new Date().toISOString().replace('Z', '+08:00')
          });
        } else {
          console.error('Translation failed:', res.data.msg);
          wx.showToast({ title: '翻译失败', icon: 'none' });
        }
      }
    });
  },

  storeRecentResult(obj) {
    let results = wx.getStorageSync('results') || [];
    results.unshift(obj);
    wx.setStorageSync('results', results);
    this.updateRecentResults();
  },

  updateRecentResults() {
    const allResults = wx.getStorageSync('results') || [];
    const recentResults = allResults.slice(0, 3);
    this.setData({ recentResults });
  },

  goToSentences() {
    wx.navigateTo({
      url: '/pages/sentences/sentences',
    });
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {

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
    // Sync results from server if needed, then update recent results
    this.syncResults(() => {
      this.updateRecentResults();
    });
  },

  syncResults(callback) {
    let results = wx.getStorageSync('results') || [];
    if (!results || results.length === 0) {
      const { getHistoryList } = require('../../utils/api.js');
      getHistoryList({
        pageSize: 10,
        pageNum: 1,
        success: (res) => {
          if (
            res.data &&
            res.data.code === 0 &&
            res.data.data &&
            Array.isArray(res.data.data.list)
          ) {
            // Convert server list to local storage format
            const serverResults = res.data.data.list.map(item => ({
              input: item.content,
              result: item.english,
              createdAt: item.createdAt
            }));
            wx.setStorageSync('results', serverResults);
          }
          if (typeof callback === 'function') callback();
        },
        fail: () => {
          if (typeof callback === 'function') callback();
        }
      });
    } else {
      if (typeof callback === 'function') callback();
    }
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