// pages/search/search.js
Page({

  /**
   * Page initial data
   */
  data: {
    translatedResult: '',
    translatedResults: [
      'Hello, how are you?',
      'Nice to meet you.',
      'What time is it?',
      'Where are you going?',
      'Can you help me?',
      'I don\'t understand.',
      'Please say it again.',
      'How much is this?',
      'I\'m hungry.',
      'I\'m tired.',
      'Let\'s go together.',
      'I\'m sorry.',
      'Thank you very much.',
      'See you tomorrow.',
      'Good luck!',
      'Have a nice day!',
      'What\'s your name?',
      'Where do you live?',
      'I like this.',
      'Can I ask you a question?'
    ],
    recentResults: []
  },

  onConfirm(e) {
    const results = this.data.translatedResults;
    const idx = Math.floor(Math.random() * results.length);
    const translatedResult = results[idx];
    this.setData({ translatedResult });
    this.storeRecentResult(translatedResult);
  },

  storeRecentResult(result) {
    let recentResults = wx.getStorageSync('recentResults') || [];
    recentResults.unshift(result);
    recentResults = recentResults.slice(0, 5);
    wx.setStorageSync('recentResults', recentResults);
    this.setData({ recentResults });
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
    // Load recent results from storage when page is shown
    const recentResults = wx.getStorageSync('recentResults') || [];
    this.setData({ recentResults });
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