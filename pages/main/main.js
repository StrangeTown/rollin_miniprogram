const { getAllPracticeItems } = require('../../utils/all-items.js')
const share = require('../../utils/share.js')
const {
  getDateKeyByOffset,
  getPracticeIdsByDate
} = require('../../utils/drill-history.js')

const HISTORY_DAY_OPTIONS = [
  { label: '今天', offset: 0 },
  { label: '昨天', offset: -1 },
  { label: '前天', offset: -2 }
]

const MAIN_SHARE_TITLE = '造句练口语'

Page({
  data: {
    showHistory: false,
    historySummaries: [],
    selectedHistoryDate: '',
    selectedHistoryLabel: '',
    selectedHistoryItems: [],
    _isRecentDaysMode: false
  },

  onShow() {
    this._loadRecentHistory()
  },

  _loadRecentHistory() {
    const allItems = getAllPracticeItems()
    const historySummaries = HISTORY_DAY_OPTIONS.map(day => {
      const dateKey = getDateKeyByOffset(day.offset)
      const ids = getPracticeIdsByDate(dateKey)
      const items = allItems.filter(s => ids.includes(s.id))
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

  goToScenarios() {
    wx.navigateTo({ url: '/pages/recite-sentences/recite-sentences' })
  },

  onShareAppMessage() {
    return {
      title: MAIN_SHARE_TITLE,
      path: share.getSharePath('pages/main/main'),
      imageUrl: share.getShareImagePath()
    }
  },

  onShareTimeline() {
    const query = share.getShareQuery()
    const result = {
      title: MAIN_SHARE_TITLE
    }

    if (query) {
      result.query = query
    }

    return result
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
      selectedHistoryItems: summary.items,
      _isRecentDaysMode: false
    })
  },

  showAllRecentHistory() {
    const seenIds = {}
    const combined = []
    this.data.historySummaries.forEach(function (day) {
      day.items.forEach(function (item) {
        if (!seenIds[item.id]) {
          seenIds[item.id] = true
          combined.push(item)
        }
      })
    })

    if (combined.length === 0) {
      wx.showToast({ title: '近三天还没有练习记录', icon: 'none' })
      return
    }

    wx.vibrateShort({ type: 'light' })

    this.setData({
      showHistory: true,
      selectedHistoryDate: '',
      selectedHistoryLabel: '近三天',
      selectedHistoryItems: combined,
      _isRecentDaysMode: true
    })
  },

  closeHistory() {
    this.setData({ showHistory: false })
  },

  drillSelectedItems() {
    if (!this.data._isRecentDaysMode && !this.data.selectedHistoryDate) {
      return
    }

    this.setData({ showHistory: false })
    const reviewLabel = encodeURIComponent(this.data.selectedHistoryLabel || '')

    if (this.data._isRecentDaysMode) {
      wx.navigateTo({
        url: `/pages/drill/drill?mode=review&recentDays=3&entryLabel=${reviewLabel}`
      })
    } else {
      wx.navigateTo({
        url: `/pages/drill/drill?mode=review&date=${this.data.selectedHistoryDate}&entryLabel=${reviewLabel}`
      })
    }
  }
})
