const structures = require('../../data/oral-structures.js')

const HISTORY_KEY = 'drill_history'

function recordPractice(id) {
  const history = wx.getStorageSync(HISTORY_KEY) || []
  history.push({ id: id, ts: Date.now() })
  wx.setStorageSync(HISTORY_KEY, history)
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
    round: 1
  },

  _lastId: null,
  _pool: null,
  _roundItems: [],
  _replayQueue: null,

  onLoad(options) {
    this._roundItems = []
    this._replayQueue = null
    const mode = options.mode || 'random'
    if (mode === 'review') {
      const history = wx.getStorageSync(HISTORY_KEY) || []
      const today = new Date()
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
      const todayIds = []
      history.forEach(item => {
        if (item.ts >= startOfDay && !todayIds.includes(item.id)) {
          todayIds.push(item.id)
        }
      })
      this._pool = structures.filter(s => todayIds.includes(s.id))
      if (this._pool.length === 0) {
        wx.showToast({ title: '今天还没有练习记录', icon: 'none' })
        wx.navigateBack()
        return
      }
      this.setData({ totalCount: this._pool.length, current: 1 })
    } else {
      // random mode
      const count = parseInt(options.count) || 3
      this._pool = structures
      this.setData({ totalCount: count, current: 1 })
    }
    this.pickRandom()
  },

  pickRandom() {
    // Replay mode: use queued structure items with a fresh random example
    if (this._replayQueue && this._replayQueue.length > 0) {
      const structureItem = this._replayQueue.shift()
      const example = structureItem.examples[Math.floor(Math.random() * structureItem.examples.length)]
      this._lastId = structureItem.id
      this.setData({
        structure: structureItem.structure,
        zh: example.zh,
        en: example.en,
        showAnswer: false
      })
      return
    }

    const pool = this._pool
    if (!pool || pool.length === 0) return

    let candidates = pool
    if (pool.length > 1 && this._lastId) {
      candidates = pool.filter(s => s.id !== this._lastId)
    }
    const structureItem = candidates[Math.floor(Math.random() * candidates.length)]
    const example = structureItem.examples[Math.floor(Math.random() * structureItem.examples.length)]

    this._lastId = structureItem.id

    this._roundItems.push(structureItem)

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
    recordPractice(this._lastId)
  },

  nextQuestion() {
    wx.vibrateShort({ type: 'medium' })
    const next = this.data.current + 1
    if (next > this.data.totalCount) {
      this.setData({ finished: true })
      return
    }
    // Animate card out, then switch
    this.setData({ cardAnim: 'card-leave' })
    setTimeout(() => {
      this.pickRandom()
      this.setData({ cardAnim: 'card-enter', current: next })
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
    this._replayQueue = [...this._roundItems]
    this._lastId = null
    this.setData({
      finished: false,
      current: 1,
      round: this.data.round + 1,
      cardAnim: ''
    })
    this.pickRandom()
  }
})
