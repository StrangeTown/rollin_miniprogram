const builtInStructures = require('../../data/oral-structures.js')
const wechatStructures = require('../../data/oral-structures-wechat.js')

const PAGE_SIZE = 30

const TAB_ITEMS = [
  {
    key: 'built-in',
    label: '默认',
    description: '小程序默认句库'
  },
  {
    key: 'wechat',
    label: '公众号',
    description: '《每日一篇英语阅读》'
  }
]

Page({
  data: {
    tabs: TAB_ITEMS.map(tab => ({
      key: tab.key,
      label: tab.label,
      description: tab.description
    })),
    currentTab: 'built-in',
    visibleItems: [],
    totalCount: 0,
    loadedCount: 0,
    remainingCount: 0,
    hasMore: false
  },

  _datasets: {
    'built-in': builtInStructures,
    wechat: wechatStructures
  },
  _activeItemsAll: [],

  onLoad() {
    this.updateActiveTab(this.data.currentTab)
  },

  switchTab(e) {
    const nextTab = e && e.currentTarget && e.currentTarget.dataset
      ? e.currentTarget.dataset.key
      : ''

    if (!nextTab) {
      return
    }

    if (nextTab === this.data.currentTab) {
      if (nextTab === 'wechat') {
        wx.openOfficialAccountProfile({
          username: 'gh_7a9ddb638472'
        })
      }
      return
    }

    wx.vibrateShort({ type: 'light' })
    this.updateActiveTab(nextTab)
  },

  loadMore() {
    if (!this.data.hasMore) {
      return
    }

    wx.vibrateShort({ type: 'light' })
    this.updateVisibleItems(this.data.loadedCount + PAGE_SIZE)
  },

  updateActiveTab(tabKey) {
    const activeItems = this._datasets[tabKey] || []
    this._activeItemsAll = activeItems

    this.setData({ currentTab: tabKey })
    this.updateVisibleItems(PAGE_SIZE)
  },

  updateVisibleItems(nextCount) {
    const totalCount = this._activeItemsAll.length
    const loadedCount = Math.min(nextCount, totalCount)
    const remainingCount = Math.max(totalCount - loadedCount, 0)

    this.setData({
      visibleItems: this._activeItemsAll.slice(0, loadedCount),
      totalCount,
      loadedCount,
      remainingCount,
      hasMore: remainingCount > 0
    })
  }
})