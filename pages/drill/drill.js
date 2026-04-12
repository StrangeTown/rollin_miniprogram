const structures = require('../../data/oral-structures-all.js')
const {
  getDateKey,
  getPracticeIdsByDate,
  recordPractice
} = require('../../utils/drill-history.js')

const AUTO_LOOP_KEY = 'drill_auto_loop'
const CUSTOM_EXAMPLES_KEY = 'custom_examples'
const REVIEW_BLUR_STRUCTURE_KEY = 'drill_review_blur_structure'
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
    navTitle: '练习',
    isReviewMode: false,
    structure: '',
    zh: '',
    en: '',
    showStructure: true,
    showAnswer: false,
    cardAnim: '',
    current: 0,
    totalCount: 0,
    finished: false,
    round: 1,
    autoLoopPractice: false,
    blurStructureInReview: false,
    showSettingsSheet: false
  },

  _items: [],
  _idx: 0,
  _shouldRecordPractice: true,
  _customExamples: {},

  onLoad(options) {
    this.loadAutoLoopPracticeSetting()
    this.loadReviewBlurStructureSetting()
    this.loadCustomExamples()

    const mode = options.mode || 'random'
    const isReviewMode = mode === 'review'
    const entryLabel = options.entryLabel ? decodeURIComponent(options.entryLabel) : ''
    this._shouldRecordPractice = !isReviewMode
    this.setData({
      isReviewMode,
      navTitle: isReviewMode && entryLabel ? `练习 · ${entryLabel}` : '练习'
    })
    if (isReviewMode) {
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
    const shouldHideStructure = this.data.isReviewMode && this.data.blurStructureInReview
    this.setData({
      structure: structureItem.structure,
      zh: example.zh,
      en: example.en,
      showStructure: !shouldHideStructure,
      showAnswer: false
    })
  },

  revealStructure() {
    if (!this.data.isReviewMode || !this.data.blurStructureInReview || this.data.showStructure) {
      return
    }
    wx.vibrateShort({ type: 'light' })
    this.setData({ showStructure: true })
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

  onReviewBlurChange(e) {
    const enabled = !!(e && e.detail && e.detail.value)
    const nextData = {
      blurStructureInReview: enabled
    }

    if (!enabled) {
      nextData.showStructure = true
    } else if (this.data.isReviewMode) {
      nextData.showStructure = false
    }

    this.setData(nextData)
    try {
      wx.setStorageSync(REVIEW_BLUR_STRUCTURE_KEY, enabled)
    } catch (err) {
      console.warn('Failed to persist review structure blur setting:', err)
    }
  },

  loadReviewBlurStructureSetting() {
    try {
      this.setData({ blurStructureInReview: !!wx.getStorageSync(REVIEW_BLUR_STRUCTURE_KEY) })
    } catch (err) {
      console.warn('Failed to load review structure blur setting:', err)
      this.setData({ blurStructureInReview: false })
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
