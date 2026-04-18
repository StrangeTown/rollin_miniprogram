Page({
  data: {},

  openOfficialAccount() {
    wx.vibrateShort({ type: 'light' })
    wx.openOfficialAccountProfile({
      username: 'gh_7a9ddb638472'
    })
  },

  openMiniProgram() {
    wx.vibrateShort({ type: 'light' })
    wx.navigateToMiniProgram({
      appId: 'wx21b1c15603cfaee8',
      path: 'pages/home/home'
    })
  },

  openAccountBook() {
    wx.vibrateShort({ type: 'light' })
    wx.navigateToMiniProgram({
      appId: 'wx2949745f913e18ac',
      path: 'pages/launch/launch'
    })
  }
})
