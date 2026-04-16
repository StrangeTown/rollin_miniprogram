const scenarioIndex = require('../../data/scenarios/index.js')

Page({
  data: {
    scenarios: [],
    showSheet: false,
    currentScenario: null,
    currentSentences: []
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
      this.setData({
        showSheet: true,
        currentScenario: scenarioData,
        currentSentences: scenarioData.sentences || []
      })
    } catch (err) {
      wx.showToast({ title: '场景数据加载失败', icon: 'none' })
    }
  },

  closeSheet() {
    this.setData({ showSheet: false })
  },

  drillScenario() {
    const scenario = this.data.currentScenario
    if (!scenario) return

    this.setData({ showSheet: false })
    const label = encodeURIComponent(scenario.name)
    wx.navigateTo({
      url: '/pages/drill/drill?mode=scenario&scenarioId=' + scenario.id + '&entryLabel=' + label
    })
  }
})
