const sentenceLibrary = require('../../data/sentence-library/index.js')

function loadSentenceFile(source, id) {
  if (source === 'others') {
    return require('../../data/sentence-library/others/' + id + '.js')
  }
  return require('../../data/sentence-library/scenarios/' + id + '.js')
}

Page({
  data: {
    groups: [],
    showSheet: false,
    currentScenario: null,
    currentSource: '',
    currentSentences: [],
    refreshing: false
  },

  onLoad() {
    this.setData({ groups: sentenceLibrary })
  },

  onScenarioTap(e) {
    const id = e.currentTarget.dataset.id
    const source = e.currentTarget.dataset.source
    if (!id || !source) return

    wx.vibrateShort({ type: 'light' })

    try {
      const scenarioData = loadSentenceFile(source, id)
      const all = scenarioData.sentences || []
      const shuffled = all.slice().sort(() => Math.random() - 0.5)
      const preview = shuffled.slice(0, 3)
      this.setData({
        showSheet: true,
        currentScenario: scenarioData,
        currentSource: source,
        currentSentences: preview
      })
    } catch (err) {
      wx.showToast({ title: '内容加载失败', icon: 'none' })
    }
  },

  closeSheet() {
    this.setData({ showSheet: false })
  },

  refreshSentences() {
    if (this.data.refreshing) return
    const scenario = this.data.currentScenario
    if (!scenario) return

    wx.vibrateShort({ type: 'light' })
    this.setData({ refreshing: true })

    setTimeout(() => {
      const all = scenario.sentences || []
      const shuffled = all.slice().sort(() => Math.random() - 0.5)
      const preview = shuffled.slice(0, 3)
      this.setData({ currentSentences: preview, refreshing: false })
    }, 500)
  },

  drillScenario() {
    const scenario = this.data.currentScenario
    if (!scenario) return

    const sentenceIds = this.data.currentSentences.map(s => s.id).join(',')
    this.setData({ showSheet: false })
    const label = encodeURIComponent(scenario.name)
    const source = this.data.currentSource || 'scenarios'
    wx.navigateTo({
      url: '/pages/drill/drill?mode=scenario&scenarioId=' + scenario.id + '&scenarioSource=' + source + '&sentenceIds=' + sentenceIds + '&entryLabel=' + label
    })
  }
})
