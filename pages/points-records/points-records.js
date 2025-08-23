// pages/points-records/points-records.js
const { formatTime } = require("../../utils/format.js");
const share = require('../../utils/share.js');
const shareBehavior = require('../../behaviors/share.js');

Page({
  behaviors: [shareBehavior],

  /**
   * Page initial data
   */
  data: {
    recordsList: [],
    total: 0,
    pageNum: 1,
    pageSize: 10,
    isLoading: false,
    hasMore: true,
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
  loadPointsRecords(isLoadMore = false) {
    if (this.data.isLoading) return;
    
    // If it's load more but no more data, return
    if (isLoadMore && !this.data.hasMore) return;
    
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
          
          // Calculate if there are more pages
          const currentTotal = (this.data.recordsList.length + processedList.length);
          const hasMore = currentTotal < (total || 0);
          
          this.setData({
            recordsList: isLoadMore ? [...this.data.recordsList, ...processedList] : processedList,
            total: total || 0,
            pageNum: pageNum || 1,
            pageSize: pageSize || 10,
            hasMore: hasMore,
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
   * Load more records
   */
  loadMore() {
    if (!this.data.hasMore || this.data.isLoading) return;
    
    this.setData({
      pageNum: this.data.pageNum + 1
    }, () => {
      this.loadPointsRecords(true);
    });
  },

  /**
   * Handle scroll to lower
   */
  onScrollToLower() {
    this.loadMore();
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

  }
})