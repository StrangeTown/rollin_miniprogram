// app.js
const { cleanOldHistory } = require('./utils/drill-history')

App({
  onLaunch() {
    cleanOldHistory(7)
  },

  globalData: {
  }
})
