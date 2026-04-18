const structures = require('../../data/oral-structures-all.js')
const { getAllPracticeItems } = require('../../utils/all-items.js')
const {
  getDateKey,
  getDateKeyByOffset,
  getPracticeIdsByDate,
  recordPractice
} = require('../../utils/drill-history.js')

const AUTO_LOOP_KEY = 'drill_auto_loop'
const CUSTOM_EXAMPLES_KEY = 'custom_examples'
const REVIEW_BLUR_STRUCTURE_KEY = 'drill_review_blur_structure'
const REVIEW_RECALL_PREVIOUS_KEY = 'drill_review_recall_previous'
const CUSTOM_EXAMPLE_PICK_PROB = 0.7
const AUTOPLAY_DURATION = 5000

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
    isScenarioMode: false,
    structure: '',
    zh: '',
    en: '',
    previousPromptZh: '',
    showStructure: true,
    showAnswer: false,
    cardAnim: '',
    current: 0,
    totalCount: 0,
    finished: false,
    round: 1,
    autoLoopPractice: false,
    blurStructureInReview: false,
    recallPreviousInReview: false,
    showSettingsSheet: false,
    showAutoPlay: false,
    autoPlayZh: '',
    autoPlaySpeed: 5000,
    showSpeedSheet: false,
    autoPlayFlash: false,
    autoPlayZhVisible: true
  },

  _items: [],
  _idx: 0,
  _shouldRecordPractice: true,
  _customExamples: {},
  _shownExamples: [],
  _lastPromptZh: '',
  _autoPlayTimer: null,
  _autoPlayLastId: '',

  onLoad(options) {
    this.loadAutoLoopPracticeSetting()
    this.loadReviewBlurStructureSetting()
    this.loadReviewRecallSetting()
    this.loadCustomExamples()

    const mode = options.mode || 'random'
    const isReviewMode = mode === 'review'
    const isScenarioMode = mode === 'scenario'
    const entryLabel = options.entryLabel ? decodeURIComponent(options.entryLabel) : ''
    this._shouldRecordPractice = !isReviewMode
    this.setData({
      isReviewMode,
      isScenarioMode,
      navTitle: entryLabel ? `练习 · ${entryLabel}` : '练习'
    })
    if (isReviewMode) {
      let practiceIds
      if (options.recentDays) {
        const days = parseInt(options.recentDays) || 3
        const idSet = {}
        practiceIds = []
        for (let i = 0; i < days; i++) {
          const dateKey = getDateKeyByOffset(-i)
          getPracticeIdsByDate(dateKey).forEach(function (id) {
            if (!idSet[id]) {
              idSet[id] = true
              practiceIds.push(id)
            }
          })
        }
      } else {
        const dateKey = options.date || getDateKey()
        practiceIds = getPracticeIdsByDate(dateKey)
      }
      const allItems = getAllPracticeItems()
      const practiceItems = allItems.filter(s => practiceIds.includes(s.id))
      if (practiceItems.length === 0) {
        wx.showToast({ title: '这一天还没有练习记录', icon: 'none' })
        wx.navigateBack()
        return
      }
      this._items = shuffle(practiceItems.slice())
    } else if (isScenarioMode && options.scenarioId) {
      try {
        const scenarioData = require('../../data/scenarios/' + options.scenarioId + '.js')
        this._items = shuffle((scenarioData.sentences || []).map(function (s) {
          return { id: s.id, structure: '', examples: [{ en: s.en, zh: s.zh }] }
        }))
      } catch (err) {
        wx.showToast({ title: '场景数据加载失败', icon: 'none' })
        wx.navigateBack()
        return
      }
    } else {
      const count = parseInt(options.count) || 3
      this._items = shuffle(structures.slice()).slice(0, count)
    }
    this._idx = 0
    this._shownExamples = []
    this._lastPromptZh = ''
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

    let example = this._shownExamples[this._idx]

    if (!example) {
      let sourceExamples = systemExamples
      if (customExamples.length === 0) {
        sourceExamples = systemExamples
      } else if (systemExamples.length === 0) {
        sourceExamples = customExamples
      } else {
        sourceExamples = Math.random() < CUSTOM_EXAMPLE_PICK_PROB ? customExamples : systemExamples
      }

      example = sourceExamples[Math.floor(Math.random() * sourceExamples.length)] || { en: '', zh: '' }
      this._shownExamples[this._idx] = example
    }

    this._currentStructureId = structureItem.id
    const isScenarioItem = !!structureItem._scenario
    const shouldHideStructure = !isScenarioItem && this.data.isReviewMode && this.data.blurStructureInReview
    this.setData({
      structure: structureItem.structure,
      zh: example.zh,
      en: example.en,
      previousPromptZh: this.data.isReviewMode ? this._lastPromptZh : '',
      showStructure: !shouldHideStructure,
      hideStructureBanner: isScenarioItem,
      isScenarioItem: isScenarioItem,
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
    const currentExample = this._shownExamples[this._idx]
    this._lastPromptZh = currentExample && currentExample.zh ? currentExample.zh : ''
    const next = this._idx + 1

    if (next >= this._items.length) {
      if (this.data.autoLoopPractice) {
        this.setData({ cardAnim: 'card-leave' })
        setTimeout(() => {
          this._items = shuffle(this._items.slice())
          this._idx = 0
          this._shownExamples = []
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
    this._shownExamples = []
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

  onReviewRecallChange(e) {
    const enabled = !!(e && e.detail && e.detail.value)
    this.setData({
      recallPreviousInReview: enabled,
      previousPromptZh: this.data.isReviewMode ? this._lastPromptZh : ''
    })
    try {
      wx.setStorageSync(REVIEW_RECALL_PREVIOUS_KEY, enabled)
    } catch (err) {
      console.warn('Failed to persist review recall setting:', err)
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

  loadReviewRecallSetting() {
    try {
      this.setData({ recallPreviousInReview: !!wx.getStorageSync(REVIEW_RECALL_PREVIOUS_KEY) })
    } catch (err) {
      console.warn('Failed to load review recall setting:', err)
      this.setData({ recallPreviousInReview: false })
    }
  },

  loadCustomExamples() {
    try {
      this._customExamples = wx.getStorageSync(CUSTOM_EXAMPLES_KEY) || {}
    } catch (err) {
      console.warn('Failed to load custom examples:', err)
      this._customExamples = {}
    }
  },

  startAutoPlay() {
    this.setData({ showSettingsSheet: false })
    setTimeout(() => {
      this._autoPlayLastId = ''
      this.setData({ showAutoPlay: true, autoPlayZh: '' })
      setTimeout(() => { this._autoPlayNext() }, 100)
    }, 200)
  },

  stopAutoPlay() {
    this._autoPlayRunning = false
    if (this._autoPlayTimer) {
      clearTimeout(this._autoPlayTimer)
      this._autoPlayTimer = null
    }
    if (this._autoPlayFlashTimer) {
      clearTimeout(this._autoPlayFlashTimer)
      this._autoPlayFlashTimer = null
    }
    this.setData({ showAutoPlay: false, autoPlayZh: '', autoPlayZhVisible: true })
  },

  _autoPlayNext() {
    if (!this.data.showAutoPlay) return

    var candidates = this._items
    if (candidates.length > 1) {
      var lastId = this._autoPlayLastId
      candidates = candidates.filter(function (item) { return item.id !== lastId })
    }

    var picked = candidates[Math.floor(Math.random() * candidates.length)]
    if (!picked) return

    this._autoPlayLastId = picked.id
    var examples = Array.isArray(picked.examples) ? picked.examples : []
    var example = examples[Math.floor(Math.random() * examples.length)] || { zh: '' }

    this.setData({ autoPlayZh: example.zh, autoPlayZhVisible: true })
    this._startRingAnimation()

    var self = this
    if (this.data.autoPlayFlash) {
      if (this._autoPlayFlashTimer) clearTimeout(this._autoPlayFlashTimer)
      this._autoPlayFlashTimer = setTimeout(function () {
        self._autoPlayFlashTimer = null
        self.setData({ autoPlayZhVisible: false })
      }, 800)
    }

    if (this._autoPlayTimer) {
      clearTimeout(this._autoPlayTimer)
    }
    this._autoPlayTimer = setTimeout(function () {
      self._autoPlayTimer = null
      self._autoPlayNext()
    }, self.data.autoPlaySpeed)
  },

  _startRingAnimation() {
    var self = this
    this._autoPlayRunning = true
    var query = this.createSelectorQuery()
    query.select('#autoplayRing').fields({ node: true, size: true }).exec(function (res) {
      if (!res || !res[0] || !res[0].node) return
      var canvas = res[0].node
      var ctx = canvas.getContext('2d')
      var info = wx.getWindowInfo()
      var dpr = info.pixelRatio || 2
      var w = res[0].width
      var h = res[0].height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.scale(dpr, dpr)

      var cx = w / 2
      var cy = h / 2
      var r = (Math.min(w, h) - 6) / 2
      var startTime = Date.now()
      var duration = self.data.autoPlaySpeed

      var draw = function () {
        if (!self._autoPlayRunning || !self.data.showAutoPlay) return
        var elapsed = Date.now() - startTime
        var progress = Math.min(elapsed / duration, 1)

        ctx.clearRect(0, 0, w, h)

        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(255,255,255,0.12)'
        ctx.lineWidth = 3
        ctx.lineCap = 'round'
        ctx.stroke()

        if (progress > 0) {
          ctx.beginPath()
          ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress)
          ctx.strokeStyle = 'rgba(255,255,255,0.85)'
          ctx.lineWidth = 3
          ctx.lineCap = 'round'
          ctx.stroke()
        }

        if (progress < 1) {
          canvas.requestAnimationFrame(draw)
        }
      }

      canvas.requestAnimationFrame(draw)
    })
  },

  onUnload() {
    this._autoPlayRunning = false
    if (this._autoPlayTimer) {
      clearTimeout(this._autoPlayTimer)
      this._autoPlayTimer = null
    }
    if (this._autoPlayFlashTimer) {
      clearTimeout(this._autoPlayFlashTimer)
      this._autoPlayFlashTimer = null
    }
  },

  openSpeedSheet() {
    wx.vibrateShort({ type: 'light' })
    this.setData({ showSpeedSheet: true })
  },

  closeSpeedSheet() {
    this.setData({ showSpeedSheet: false })
  },

  pickSpeed(e) {
    var speed = parseInt(e.currentTarget.dataset.speed)
    if (!speed) return
    wx.vibrateShort({ type: 'light' })
    this.setData({ autoPlaySpeed: speed, showSpeedSheet: false })
    // Restart current sentence with new speed
    this._autoPlayRunning = false
    if (this._autoPlayTimer) {
      clearTimeout(this._autoPlayTimer)
      this._autoPlayTimer = null
    }
    var self = this
    setTimeout(function () {
      self._autoPlayNext()
    }, 50)
  },

  toggleFlash() {
    wx.vibrateShort({ type: 'light' })
    this.setData({ autoPlayFlash: !this.data.autoPlayFlash })
  }
})
