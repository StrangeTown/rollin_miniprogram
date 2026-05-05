const scenarioIndex = require('../../data/scenarios/index.js')

Page({
  data: {
    scenarios: [],
    showSheet: false,
    currentScenario: null,
    currentSentences: [],
    refreshing: false
  },

  onLoad() {
    this.setData({ scenarios: scenarioIndex })
  },

  onScenarioTap(e) {
    const id = e.currentTarget.dataset.id
    const info = this.data.scenarios.find(s => s.id === id)
    if (!info) return

    wx.vibrateShort({ type: 'light' })

    try {
      const scenarioData = require('../../data/scenarios/' + id + '.js')
      const all = scenarioData.sentences || []
      const shuffled = all.slice().sort(() => Math.random() - 0.5)
      const preview = shuffled.slice(0, 3)
      this.setData({
        showSheet: true,
        currentScenario: scenarioData,
        currentSentences: preview
      })
    } catch (err) {
      wx.showToast({ title: '场景数据加载失败', icon: 'none' })
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
    wx.navigateTo({
      url: '/pages/drill/drill?mode=scenario&scenarioId=' + scenario.id + '&sentenceIds=' + sentenceIds + '&entryLabel=' + label
    })
  }
})
