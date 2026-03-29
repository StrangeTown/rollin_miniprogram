const structures = require('../../data/oral-structures.js')

const HISTORY_KEY = 'drill_history'

Page({
  data: {
    showHistory: false,
    todayItems: [],
    todayCount: 0
  },

  onShow() {
    this._loadTodayHistory()
  },

  _loadTodayHistory() {
    const history = wx.getStorageSync(HISTORY_KEY) || []
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()

    // Get unique structure ids practiced today
    const todayIds = []
    history.forEach(item => {
      if (item.ts >= startOfDay && !todayIds.includes(item.id)) {
        todayIds.push(item.id)
      }
    })

    const todayItems = structures.filter(s => todayIds.includes(s.id))
    this.setData({
      todayItems: todayItems,
      todayCount: todayItems.length
    })
  },

  goToPractice(e) {
    const count = e.currentTarget.dataset.count
    wx.navigateTo({
      url: '/pages/drill/drill?count=' + count
    })
  },

  showTodayHistory() {
    if (this.data.todayCount === 0) {
      wx.showToast({ title: '今天还没有练习记录', icon: 'none' })
      return
    }
    this.setData({ showHistory: true })
  },

  closeHistory() {
    this.setData({ showHistory: false })
  },

  drillTodayItems() {
    const ids = this.data.todayItems.map(s => s.id).join(',')
    this.setData({ showHistory: false })
    wx.navigateTo({
      url: '/pages/drill/drill?ids=' + ids
    })
  }
})
