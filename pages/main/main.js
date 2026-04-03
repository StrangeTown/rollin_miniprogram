const structures = require('../../data/oral-structures.js')
const { getTodayPracticeIds } = require('../../utils/drill-history.js')

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
    const todayIds = getTodayPracticeIds()

    const todayItems = structures.filter(s => todayIds.includes(s.id))
    this.setData({
      todayItems: todayItems,
      todayCount: todayItems.length
    })
  },

  goToPractice(e) {
    const count = e.currentTarget.dataset.count
    wx.navigateTo({
      url: '/pages/drill/drill?mode=random&count=' + count
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
    this.setData({ showHistory: false })
    wx.navigateTo({
      url: '/pages/drill/drill?mode=review'
    })
  }
})
