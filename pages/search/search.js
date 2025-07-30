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
    let results = wx.getStorageSync('results') || [];
    results.unshift(result);
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
    // Load recent results from storage when page is shown
    this.updateRecentResults();
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