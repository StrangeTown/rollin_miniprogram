const structures = require('../../data/oral-structures.js')
const {
  getDateKey,
  getPracticeIdsByDate,
  recordPractice
} = require('../../utils/drill-history.js')

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
    round: 1
  },

  _items: [],
  _idx: 0,
  _shouldRecordPractice: true,

  onLoad(options) {
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

  showItem() {
    const structureItem = this._items[this._idx]
    if (!structureItem) return
    const example = structureItem.examples[Math.floor(Math.random() * structureItem.examples.length)]
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
  }
})
