const HISTORY_KEY = 'drill_history'
const CUSTOM_EXAMPLES_KEY = 'custom_examples'
const releaseNotes = require('../../data/release-notes.js')

Page({
  data: {
    showSheet: false,
    showReleaseNotes: false,
    hasHistory: false,
    hasCustomExamples: false,
    appName: '口语翻翻',
    appVersion: releaseNotes.version || '',
    releaseNotes: releaseNotes
  },

  onShow() {
    this.checkData()
  },

  checkData() {
    let hasHistory = false
    let hasCustomExamples = false

    try {
      const history = wx.getStorageSync(HISTORY_KEY)
      if (history && typeof history === 'object' && !Array.isArray(history)) {
        hasHistory = Object.keys(history).some(k => {
          const arr = history[k]
          return Array.isArray(arr) && arr.length > 0
        })
      }
    } catch (e) {}

    try {
      const examples = wx.getStorageSync(CUSTOM_EXAMPLES_KEY)
      if (examples && typeof examples === 'object' && !Array.isArray(examples)) {
        hasCustomExamples = Object.keys(examples).some(k => {
          const arr = examples[k]
          return Array.isArray(arr) && arr.length > 0
        })
      }
    } catch (e) {}

    this.setData({ hasHistory, hasCustomExamples })
  },

  openSheet() {
    wx.vibrateShort({ type: 'light' })
    this.setData({ showSheet: true })
  },

  goToSystemLibrary() {
    wx.vibrateShort({ type: 'light' })
    wx.navigateTo({ url: '/pages/system-library/system-library' })
  },

  openReleaseNotes() {
    wx.vibrateShort({ type: 'light' })
    this.setData({ showReleaseNotes: true })
  },

  closeReleaseNotes() {
    this.setData({ showReleaseNotes: false })
  },

  closeSheet() {
    this.setData({ showSheet: false })
  },

  noop() {},

  clearHistory() {
    wx.showModal({
      title: '确认清空',
      content: '将清空所有练习记录，且不可恢复',
      confirmText: '清空',
      confirmColor: '#EF4444',
      success: (res) => {
        if (!res.confirm) return
        try {
          wx.removeStorageSync(HISTORY_KEY)
        } catch (e) {}
        wx.vibrateShort({ type: 'medium' })
        wx.showToast({ title: '已删除', icon: 'success', duration: 1200 })
        this.checkData()
      }
    })
  },

  clearCustomExamples() {
    wx.showModal({
      title: '确认清空',
      content: '将清空所有自定义例句，且不可恢复',
      confirmText: '清空',
      confirmColor: '#EF4444',
      success: (res) => {
        if (!res.confirm) return
        try {
          wx.removeStorageSync(CUSTOM_EXAMPLES_KEY)
        } catch (e) {}
        wx.vibrateShort({ type: 'medium' })
        wx.showToast({ title: '已删除', icon: 'success', duration: 1200 })
        this.checkData()
      }
    })
  }
})
