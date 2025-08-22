// pages/points-records/points-records.js
const { formatTime } = require("../../utils/format.js");

Page({

  /**
   * Page initial data
   */
  data: {
    recordsList: [],
    total: 0,
    pageNum: 1,
    pageSize: 10,
    isLoading: false,
  },

  /**
   * Get channel display name
   */
  getChannelName(channel) {
    const channelMap = {
      'user_register': '注册奖励',
      'user_share': '分享奖励',
      'user_embrace': '推荐奖励',
      'user_search': '搜索消耗',
      'user_login': '登录奖励'
    };
    return channelMap[channel] || '翻点变动';
  },

  /**
   * Load points records from API
   */
  loadPointsRecords() {
    if (this.data.isLoading) return;
    
    this.setData({ isLoading: true });
    
    const { request } = require("../../utils/request.js");
    request({
      url: `/user/delta/list?pageNum=${this.data.pageNum}&pageSize=${this.data.pageSize}`,
      method: 'GET',
      success: (res) => {
        console.log("Points records response:", res);
        if (res.data && res.data.code === 0) {
          const { total, pageNum, pageSize, list } = res.data.data;
          
          // Process the list to add formatted data
          const processedList = (list || []).map(item => ({
            ...item,
            channelName: this.getChannelName(item.channel),
            formattedTime: formatTime(item.createdAt)
          }));
          
          this.setData({
            recordsList: processedList,
            total: total || 0,
            pageNum: pageNum || 1,
            pageSize: pageSize || 10,
            isLoading: false,
          });
        } else {
          console.error("Failed to load points records:", res.data.msg);
          wx.showToast({ 
            title: "加载失败", 
            icon: "none",
            duration: 1500
          });
          this.setData({ isLoading: false });
        }
      },
      fail: (err) => {
        console.error("Points records request failed:", err);
        wx.showToast({ 
          title: "网络错误", 
          icon: "none",
          duration: 1500
        });
        this.setData({ isLoading: false });
      },
    });
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    this.loadPointsRecords();
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