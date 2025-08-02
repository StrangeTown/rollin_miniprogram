// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录优化：仅在无token或token过期时请求
    const token = wx.getStorageSync('token');
    const now = Math.floor(Date.now() / 1000);
    if (!token || !token.expireIn || token.expireIn < now) {
      wx.login({
        success: res => {
          if (res.code) {
            console.log('jscode:', res.code);
            // GET login request
            wx.request({
              url: `https://www.itwork.club/rollin_test/user/login/${res.code}`,
              method: 'GET',
              success: response => {
                if (response.data && response.data.code === 0) {
                  // Store token info
                  wx.setStorageSync('token', response.data.data.token);
                  // Store userInfo
                  wx.setStorageSync('userInfo', response.data.data.userInfo);
                  console.log('Login success:', response.data.data);
                } else {
                  console.log('Login failed:', response.data.msg);
                }
              },
              fail: err => {
                console.log('Request failed:', err);
              }
            });
          } else {
            console.log('登录失败：', res.errMsg);
          }
        }
      })
    } else {
      console.log('Token is valid, skip login request.');
    }
  },
  globalData: {
    userInfo: null
  }
})
