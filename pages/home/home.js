// pages/home.js
const share = require('../../utils/share.js');
const shareBehavior = require('../../behaviors/share.js');

Page({
  behaviors: [shareBehavior],

  /**
   * Page initial data
   */
  data: {
    userPoints: '',
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

  goToPoints() {
    wx.navigateTo({
      url: '/pages/points/points',
    });
  },

  goToListening() {
    wx.showToast({
      title: '功能开发中…',
      icon: 'none',
      duration: 1500
    });
  },

  goToSettings() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    });
  },

  goToScenarios() {
    wx.showToast({
      title: '场景练习功能开发中…',
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
   * Fetch and update user points from global app
   */
  fetchAndUpdateUserPoints() {
    try {
      const app = getApp();
      if (app && typeof app.fetchUserPoints === 'function') {
        app.fetchUserPoints().then((points) => {
          if (points !== null && typeof points !== 'undefined') {
            this.setData({ userPoints: points });
          }
        });
      }
    } catch (err) {
      console.error('Error calling fetchUserPoints:', err);
    }
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    // Check if this user came from a referral share
    if (options.refererId) {
      console.log('Referrer User ID:', options.refererId);

      // Send referral tracking request
      this.trackReferral(options.refererId);
    }

    // Check app.loginPromise and fetch user points after login
    const app = getApp();
    if (app.loginPromise) {
      app.loginPromise.then(loginSuccess => {
        if (loginSuccess) {
          console.log('Login completed, fetching user points');
          this.fetchAndUpdateUserPoints();
        } else {
          console.log('Login failed, unable to fetch user points');
        }
      });
    } else {
      // Fallback: if no loginPromise, try to fetch points anyway
      this.fetchAndUpdateUserPoints();
    }

    this.setRandomPhrase();
    this.phraseInterval = setInterval(() => {
      this.animatePhraseChange();
    }, 3000);
  },

  /**
   * Track referral when user comes from a share link
   */
  trackReferral(refererId) {
    const { request } = require('../../utils/request.js');
    request({
      url: '/user/delta',
      method: 'POST',
      data: {
        channel: 'user_share',
        shareId: parseInt(refererId) || 1
      },
      success: (res) => {
        console.log('Referral tracking success:', res);
        if (res.data && res.data.code === 0) {
          console.log('Referral points awarded successfully');
        }
      },
      fail: (err) => {
        console.error('Referral tracking failed:', err);
      }
    });
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
    try {
      const app = getApp();
      if (app && app.globalData) {
        const points = app.globalData.userPoints;
        this.setData({ userPoints: points });
      }
    } catch (err) {
      console.error('Error syncing userPoints in home page onShow:', err);
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
   * Show usage rules for points system
   */
  showUsageRules() {
    wx.navigateTo({
      url: '/pages/points/points?showRules=true'
    });
  }
})