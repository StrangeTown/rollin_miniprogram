const structures = require('../../data/oral-structures-all.js')
const { getAllPracticeItems } = require('../../utils/all-items.js')
const share = require('../../utils/share.js')
const {
  getDateKeyByOffset,
  getPracticeIdsByDate
} = require('../../utils/drill-history.js')

const RELEASE_NOTES_SEEN_KEY = 'release_notes_seen_signature'

let releaseNotes = {
  version: '2.0.0',
  title: '新功能',
  summary: '小程序已经从"查表达"切换为"练语块"，现在围绕地道英语语块来做练习和回顾。',
  highlights: []
}

try {
  releaseNotes = require('../../data/release-notes.js')
} catch (err) {
  console.warn('Failed to load release notes config:', err)
}

function getReleaseNotesSignature(notes) {
  if (!notes) {
    return ''
  }

  return JSON.stringify({
    version: notes.version || '',
    title: notes.title || '',
    summary: notes.summary || '',
    highlights: Array.isArray(notes.highlights) ? notes.highlights : []
  })
}

const HISTORY_DAY_OPTIONS = [
  { label: '今天', offset: 0 },
  { label: '昨天', offset: -1 },
  { label: '前天', offset: -2 }
]

const MAIN_SHARE_TITLE = '造句练口语'

Page({
  data: {
    showHistory: false,
    showReleaseNotes: false,
    historySummaries: [],
    selectedHistoryDate: '',
    selectedHistoryLabel: '',
    selectedHistoryItems: [],
    releaseNotes: releaseNotes,
    _isRecentDaysMode: false
  },

  onShow() {
    this._loadRecentHistory()
    this._checkReleaseNotes()
  },

  _checkReleaseNotes() {
    const signature = getReleaseNotesSignature(this.data.releaseNotes)
    if (!signature) {
      return
    }

    try {
      const seenSignature = wx.getStorageSync(RELEASE_NOTES_SEEN_KEY) || ''
      if (seenSignature !== signature) {
        this.setData({ showReleaseNotes: true })
      }
    } catch (err) {
      console.warn('Failed to read release notes status:', err)
      this.setData({ showReleaseNotes: true })
    }
  },

  closeReleaseNotes() {
    const signature = getReleaseNotesSignature(this.data.releaseNotes)

    try {
      if (signature) {
        wx.setStorageSync(RELEASE_NOTES_SEEN_KEY, signature)
      }
    } catch (err) {
      console.warn('Failed to persist release notes status:', err)
    }

    this.setData({ showReleaseNotes: false })
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
    wx.navigateTo({ url: '/pages/scenarios/scenarios' })
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
