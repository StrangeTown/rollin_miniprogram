// pages/settings/settings.js
Page({

  /**
   * Page initial data
   */
  data: {

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