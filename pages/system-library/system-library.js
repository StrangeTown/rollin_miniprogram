const builtInStructures = require('../../data/oral-structures.js')

const PAGE_SIZE = 30

Page({
  data: {
    visibleItems: [],
    totalCount: 0,
    loadedCount: 0,
    remainingCount: 0,
    hasMore: false
  },

  _activeItemsAll: [],

  onLoad() {
    this._activeItemsAll = [...builtInStructures].reverse()
    this.updateVisibleItems(PAGE_SIZE)
  },

  loadMore() {
    if (!this.data.hasMore) {
      return
    }

    wx.vibrateShort({ type: 'light' })
    this.updateVisibleItems(this.data.loadedCount + PAGE_SIZE)
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