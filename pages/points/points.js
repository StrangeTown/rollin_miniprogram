// pages/points/points.js
const storage = require('../../utils/storage.js');
const share = require('../../utils/share.js');

Page({

  /**
   * Page initial data
   */
  data: {
    userPoints: '',
    pointsRules: [],
    showRulesModal: false
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    // Load points rules from server
    if (typeof this.fetchPoitnsRules === 'function') {
      this.fetchPoitnsRules();
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
    // Initialize userPoints from global data when the page is shown
    const app = getApp();
    const gp = app && app.globalData ? app.globalData.userPoints : null;

    if (gp !== null && gp !== undefined) {
      this.setData({ userPoints: gp });
    } else if (app && typeof app.fetchUserPoints === 'function') {
      // Fallback: fetch from server and update local data
      app.fetchUserPoints().then(points => {
        if (points !== null && points !== undefined) {
          this.setData({ userPoints: points });
        }
      });
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
   * Show point rules - display custom modal with rules from page data
   */
  showPointRules() {
    this.setData({ showRulesModal: true });
  },

  /**
   * Close the rules modal
   */
  closeRulesModal() {
    this.setData({ showRulesModal: false });
  },

  /**
   * Handle refresh points button click
   */
  onRefreshPoints() {
    console.log('User clicked refresh points icon');
    
    const app = getApp();
    if (app && typeof app.fetchUserPoints === 'function') {
      app.fetchUserPoints().then(points => {
        if (points !== null && points !== undefined) {
          this.setData({ userPoints: points });
          console.log('Points refreshed:', points);
          wx.showToast({
            title: '刷新成功',
            icon: 'success',
            duration: 1500
          });
        }
      }).catch(err => {
        console.error('Failed to refresh points:', err);
        wx.showToast({
          title: '刷新失败',
          icon: 'none',
          duration: 1500
        });
      });
    } else {
      console.warn('fetchUserPoints method not available');
    }
  },

  /**
   * Fetch points rules from admin config API
   */
  fetchPoitnsRules() {
    const { request } = require('../../utils/request.js');
    request({
      url: '/admin/configs/app/obtain_points_rule',
      method: 'GET',
      success: (res) => {
        if (res && res.data && res.data.code === 0 && res.data.data) {
          const values = res.data.data.values || [];
          this.setData({ pointsRules: values });
        } else {
          console.warn('Failed to load points rules:', res && res.data && res.data.msg);
        }
      },
      fail: (err) => {
        console.error('Request for points rules failed:', err);
      }
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