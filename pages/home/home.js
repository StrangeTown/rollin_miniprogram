// pages/home.js
Page({

  /**
   * Page initial data
   */
  data: {
    suggestedPhrases: [
      "你吃了吗？",
      "今天天气真好。",
      "你去哪儿？",
      "我们一起去吧。",
      "这个多少钱？",
      "我不太明白。",
      "你会说英语吗？",
      "请再说一遍。",
      "没关系，谢谢。",
      "我很高兴认识你。"
    ],
    currentPhrase: '',
    phraseAnimClass: '',
    firstRender: true,
    showShareModal: false,
  },

  goToSearch() {
    wx.navigateTo({
      url: '/pages/search/search',
    });
  },

  goToSentences() {
    wx.navigateTo({
      url: '/pages/sentences/sentences',
    });
  },

  goToPractice() {
    wx.navigateTo({
      url: '/pages/practice/practice',
    });
  },

  goToListening() {
    wx.showToast({
      title: '功能开发中…',
      icon: 'none',
      duration: 1500
    });
  },

  goToShare() {
    this.setData({
      showShareModal: true
    });
  },

  closeShareModal() {
    this.setData({
      showShareModal: false
    });
  },

  stopPropagation() {
    // Prevent modal from closing when clicking on modal content
  },

  showMomentsToast() {
    wx.showToast({
      title: '请点击页面右上角「···」菜单分享到朋友圈',
      icon: 'none',
      duration: 3000
    });
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    this.setRandomPhrase();
    this.phraseInterval = setInterval(() => {
      this.animatePhraseChange();
    }, 3000);
  },

  setRandomPhrase(newPhrase) {
    // If a phrase is provided, use it; otherwise pick random
    const phrases = this.data.suggestedPhrases;
    let phrase = newPhrase;
    if (!phrase && phrases && phrases.length > 0) {
      const idx = Math.floor(Math.random() * phrases.length);
      phrase = phrases[idx];
    }

    // If this is the first render, set without animation
    // Otherwise, apply enter animation
    if (this.data.firstRender) {
      this.setData({
        currentPhrase: phrase,
        phraseAnimClass: '',
        firstRender: false
      });
    } else {
      this.setData({
        currentPhrase: phrase,
        phraseAnimClass: 'phrase-enter'
      });
      setTimeout(() => {
        this.setData({ phraseAnimClass: 'phrase-enter phrase-enter-active' });
      }, 200); // Trigger enter animation
    }
  },

  animatePhraseChange() {
    // Start leave animation
    this.setData({ phraseAnimClass: 'phrase-leave phrase-leave-active' });
    setTimeout(() => {
      // After leave, clear text and wait a tick
      let newPhrase = '';
      const phrases = this.data.suggestedPhrases;
      if (phrases && phrases.length > 0) {
        // Ensure new phrase is different from current
        do {
          const idx = Math.floor(Math.random() * phrases.length);
          newPhrase = phrases[idx];
        } while (newPhrase === this.data.currentPhrase && phrases.length > 1);
      }
      setTimeout(() => {
        this.setRandomPhrase(newPhrase);
      }, 30); // allow DOM to clear before animating in
    }, 400); // match the CSS transition duration
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
    if (this.phraseInterval) {
      clearInterval(this.phraseInterval);
    }
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
    return {
      title: '把你想说的中文，变成地道美式口语',
      path: '/pages/home/home'
    }
  },

  /**
   * Called when user shares to WeChat Moments (Timeline)
   */
  onShareTimeline() {
    return {
      title: '把你想说的中文，变成地道美式口语'
    }
  }
})