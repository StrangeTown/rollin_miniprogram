const structures = require('../../data/oral-structures.js')
const {
  getDateKey,
  getPracticeIdsByDate,
  recordPractice
} = require('../../utils/drill-history.js')

const AUTO_LOOP_KEY = 'drill_auto_loop'
const CUSTOM_EXAMPLES_KEY = 'custom_examples'
const CUSTOM_EXAMPLE_PICK_PROB = 0.7

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp
  }
  return arr
}

Page({
  data: {
    structure: '',
    zh: '',
    en: '',
    showAnswer: false,
    cardAnim: '',
    current: 0,
    totalCount: 0,
    finished: false,
    round: 1,
    autoLoopPractice: false,
    showSettingsSheet: false
  },

  _items: [],
  _idx: 0,
  _shouldRecordPractice: true,
  _customExamples: {},

  onLoad(options) {
    this.loadAutoLoopPracticeSetting()
    this.loadCustomExamples()

    const mode = options.mode || 'random'
    this._shouldRecordPractice = mode !== 'review'
    if (mode === 'review') {
      const dateKey = options.date || getDateKey()
      const practiceIds = getPracticeIdsByDate(dateKey)
      const practiceItems = structures.filter(s => practiceIds.includes(s.id))
      if (practiceItems.length === 0) {
        wx.showToast({ title: '这一天还没有练习记录', icon: 'none' })
        wx.navigateBack()
        return
      }
      this._items = shuffle(practiceItems.slice())
    } else {
      const count = parseInt(options.count) || 3
      this._items = shuffle(structures.slice()).slice(0, count)
    }
    this._idx = 0
    this.setData({ totalCount: this._items.length, current: 1 })
    this.showItem()
  },

  onShow() {
    this.loadCustomExamples()
  },

  showItem() {
    const structureItem = this._items[this._idx]
    if (!structureItem) return

    const systemExamples = Array.isArray(structureItem.examples) ? structureItem.examples : []
    const customExamples = Array.isArray(this._customExamples[structureItem.id])
      ? this._customExamples[structureItem.id]
      : []

    let sourceExamples = systemExamples
    if (customExamples.length === 0) {
      sourceExamples = systemExamples
    } else if (systemExamples.length === 0) {
      sourceExamples = customExamples
    } else {
      sourceExamples = Math.random() < CUSTOM_EXAMPLE_PICK_PROB ? customExamples : systemExamples
    }

    const example = sourceExamples[Math.floor(Math.random() * sourceExamples.length)] || { en: '', zh: '' }

    this._currentStructureId = structureItem.id
    this.setData({
      structure: structureItem.structure,
      zh: example.zh,
      en: example.en,
      showAnswer: false
    })
  },

  revealAnswer() {
    wx.vibrateShort({ type: 'light' })
    this.setData({ showAnswer: true })
    if (this._shouldRecordPractice) {
      recordPractice(this._items[this._idx].id)
    }
  },

  nextQuestion() {
    wx.vibrateShort({ type: 'medium' })
    const next = this._idx + 1

    if (next >= this._items.length) {
      if (this.data.autoLoopPractice) {
        this.setData({ cardAnim: 'card-leave' })
        setTimeout(() => {
          this._items = shuffle(this._items.slice())
          this._idx = 0
          this.showItem()
          this.setData({
            cardAnim: 'card-enter',
            current: 1,
            round: this.data.round + 1,
            finished: false
          })
          setTimeout(() => {
            this.setData({ cardAnim: '' })
          }, 350)
        }, 300)
        return
      }

      this.setData({ finished: true })
      return
    }
    this.setData({ cardAnim: 'card-leave' })
    setTimeout(() => {
      this._idx = next
      this.showItem()
      this.setData({ cardAnim: 'card-enter', current: next + 1 })
      setTimeout(() => {
        this.setData({ cardAnim: '' })
      }, 350)
    }, 300)
  },

  goBack() {
    wx.vibrateShort({ type: 'light' })
    wx.navigateBack()
  },

  replayRound() {
    wx.vibrateShort({ type: 'medium' })
    this._items = shuffle(this._items.slice())
    this._idx = 0
    this.setData({
      finished: false,
      current: 1,
      round: this.data.round + 1,
      cardAnim: ''
    })
    this.showItem()
  },

  noop() {},

  openSettingsSheet() {
    wx.vibrateShort({ type: 'light' })
    this.setData({ showSettingsSheet: true })
  },

  closeSettingsSheet() {
    this.setData({ showSettingsSheet: false })
  },

  openAddDialog() {
    this.setData({ showSettingsSheet: false })
    const id = this._currentStructureId || ''
    wx.navigateTo({
      url: `/pages/add-example/add-example?structureId=${id}&structure=${encodeURIComponent(this.data.structure)}`
    })
  },

  onAutoLoopChange(e) {
    const enabled = !!(e && e.detail && e.detail.value)
    this.setData({ autoLoopPractice: enabled })
    try {
      wx.setStorageSync(AUTO_LOOP_KEY, enabled)
    } catch (err) {
      console.warn('Failed to persist auto-loop practice setting:', err)
    }
  },

  loadAutoLoopPracticeSetting() {
    try {
      this.setData({ autoLoopPractice: !!wx.getStorageSync(AUTO_LOOP_KEY) })
    } catch (err) {
      console.warn('Failed to load auto-loop practice setting:', err)
      this.setData({ autoLoopPractice: false })
    }
  },

  loadCustomExamples() {
    try {
      this._customExamples = wx.getStorageSync(CUSTOM_EXAMPLES_KEY) || {}
    } catch (err) {
      console.warn('Failed to load custom examples:', err)
      this._customExamples = {}
    }
  }
})
