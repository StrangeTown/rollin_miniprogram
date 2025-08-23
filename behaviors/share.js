// behaviors/share.js
const share = require('../utils/share.js');

/**
 * Share behavior for WeChat Mini Program
 * Provides common share functionality across all pages
 */
const shareBehavior = Behavior({
  /**
   * Called when user clicks on the top right corner to share
   */
  methods: {
    onShareAppMessage() {
      const shareUrl = share.getSharePath('pages/home/home');
      
      return {
        title: '快来使用口语翻翻，把中文变成地道美式口语！',
        path: shareUrl,
        imageUrl: share.getShareImagePath()
      };
    },

    /**
     * Called when user shares to WeChat Moments (Timeline)
     */
    onShareTimeline() {
      return {
        title: '快来使用口语翻翻，把中文变成地道美式口语！'
      };
    }
  }
});

module.exports = shareBehavior;
