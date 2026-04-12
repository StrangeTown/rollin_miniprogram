const structures = require('../../data/oral-structures-all.js')
const {
  getDateKeyByOffset,
  getPracticeIdsByDate
} = require('../../utils/drill-history.js')

const HISTORY_DAY_OPTIONS = [
  { label: '今天', offset: 0 },
  { label: '昨天', offset: -1 },
  { label: '前天', offset: -2 }
]

Page({
  data: {
    showHistory: false,
    historySummaries: [],
    selectedHistoryDate: '',
    selectedHistoryLabel: '',
    selectedHistoryItems: []
  },

  onShow() {
    this._loadRecentHistory()
  },

  _loadRecentHistory() {
    const historySummaries = HISTORY_DAY_OPTIONS.map(day => {
      const dateKey = getDateKeyByOffset(day.offset)
      const ids = getPracticeIdsByDate(dateKey)
      const items = structures.filter(s => ids.includes(s.id))
      return {
        label: day.label,
        dateKey: dateKey,
        count: items.length,
        items: items
      }
    })

    const firstAvailable = historySummaries.find(item => item.count > 0) || historySummaries[0]

    this.setData({
      historySummaries: historySummaries,
      selectedHistoryDate: firstAvailable ? firstAvailable.dateKey : '',
      selectedHistoryLabel: firstAvailable ? firstAvailable.label : '',
      selectedHistoryItems: firstAvailable ? firstAvailable.items : []
    })
  },

  goToSettings() {
    wx.navigateTo({ url: '/pages/new-settings/new-settings' })
  },

  goToPractice(e) {
    const count = e.currentTarget.dataset.count
    wx.vibrateShort({ type: 'light' })
    wx.navigateTo({
      url: '/pages/drill/drill?mode=random&count=' + count
    })
  },

  showHistoryForDate(e) {
    const dateKey = e.currentTarget.dataset.dateKey
    const label = e.currentTarget.dataset.label
    const summary = this.data.historySummaries.find(item => item.dateKey === dateKey)

    if (!summary || summary.count === 0) {
      wx.showToast({ title: `${label}还没有练习记录`, icon: 'none' })
      return
    }

    wx.vibrateShort({ type: 'light' })

    this.setData({
      showHistory: true,
      selectedHistoryDate: summary.dateKey,
      selectedHistoryLabel: summary.label,
      selectedHistoryItems: summary.items
    })
  },

  closeHistory() {
    this.setData({ showHistory: false })
  },

  drillSelectedItems() {
    if (!this.data.selectedHistoryDate) {
      return
    }

    this.setData({ showHistory: false })
    const reviewLabel = encodeURIComponent(this.data.selectedHistoryLabel || '')
    wx.navigateTo({
      url: `/pages/drill/drill?mode=review&date=${this.data.selectedHistoryDate}&entryLabel=${reviewLabel}`
    })
  }
})
