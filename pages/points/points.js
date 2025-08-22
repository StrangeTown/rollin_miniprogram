// pages/points/points.js
const storage = require('../../utils/storage.js');
const share = require('../../utils/share.js');

Page({

  /**
   * Page initial data
   */
  data: {
    userPoints: 23
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
   * Watch ad to earn points
   */
  watchAd() {
    wx.showToast({
      title: '该功能还在开发中...',
      icon: 'none',
      duration: 2000
    });
  },

  // Navigate to points records page
  goToPointsRecords() {
    wx.navigateTo({
      url: '/pages/points-records/points-records'
    });
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {
    const shareUrl = share.getSharePath('pages/home/home');
    
    return {
      title: '快来使用口语翻翻，把中文变成地道美式口语！',
      path: shareUrl,
      imageUrl: '' // 可以设置分享图片
    };
  }
})