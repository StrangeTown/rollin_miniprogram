// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // Handle user login
    this.loginPromise = this.handleUserLogin();
  },

  /**
   * Handle user login with token validation and refresh
   * @returns {Promise<boolean>} Promise that resolves to true if login successful, false otherwise
   */
  handleUserLogin() {
    return new Promise((resolve) => {
      // 登录优化：仅在无token或token过期时请求
      const token = wx.getStorageSync('token');
      const now = Math.floor(Date.now() / 1000);
      if (!token || !token.expireIn || token.expireIn < now) {
        const { request } = require('./utils/request.js');
        wx.login({
          success: res => {
            if (res.code) {
              console.log('jscode:', res.code);
              request({
                url: `/user/login/${res.code}`,
                method: 'GET',
                success: response => {
                  if (response.data && response.data.code === 0) {
                    try {
                      const storage = require('./utils/storage.js');
                      const token = response.data.data.token || null;
                      const userInfo = response.data.data.userInfo || null;
                      storage.setUserInfoAndToken(userInfo, token);
                    } catch (err) {
                      console.warn('Failed to persist login data via storage helper', err);
                    }
                    console.log('Login success:', response.data.data);
                    
                    resolve(true);
                  } else {
                    console.log('Login failed:', response.data.msg);
                    resolve(false);
                  }
                },
                fail: err => {
                  console.log('Request failed:', err);
                  resolve(false);
                }
              });
            } else {
              console.log('登录失败：', res.errMsg);
              resolve(false);
            }
          },
          fail: err => {
            console.log('wx.login failed:', err);
            resolve(false);
          }
        })
      } else {
        console.log('Token is valid, skip login request.');
        resolve(true);
      }
    });
  },
  
  /**
   * Fetch user's points from backend and store in globalData.userPoints
   * Uses the existing request util at ./utils/request.js
   */
  /**
   * Fetch user's points from backend and return a Promise that resolves to the points number.
   * Other pages can call: getApp().fetchUserPoints().then(points => { ... })
   * Resolves to null if the server returns a non-success code.
   * @returns {Promise<number|null>}
   */
  fetchUserPoints() {
    return new Promise((resolve) => {
      const { request } = require('./utils/request.js');
      request({
        url: '/user/points',
        method: 'GET',
        success: (res) => {
          try {
            if (res && res.data && res.data.code === 0) {
              const points = res.data.data;
              this.globalData.userPoints = points;
              console.log('Fetched userPoints:', points);
              resolve(points);
            } else {
              console.warn('Failed to fetch user points:', res && res.data);
              resolve(null);
            }
          } catch (err) {
            console.error('Error processing fetchUserPoints response:', err);
            resolve(null);
          }
        },
        fail: (err) => {
          console.error('fetchUserPoints request failed:', err);
          resolve(null);
        }
      });
    });
  },
  globalData: {
    userInfo: null,
    userPoints: ''
  }
})
