const CUSTOM_EXAMPLES_KEY = 'custom_examples'

Page({
  data: {
    structure: '',
    en: '',
    zh: '',
    canSave: false,
    customList: [],
    showListSheet: false
  },

  _structureId: '',

  onLoad(options) {
    if (options.structureId) {
      this._structureId = options.structureId
    }
    if (options.structure) {
      this.setData({
        structure: decodeURIComponent(options.structure)
      })
    }
    this.loadCustomList()
  },

  loadCustomList() {
    try {
      const all = wx.getStorageSync(CUSTOM_EXAMPLES_KEY) || {}
      const list = all[this._structureId] || []
      this.setData({ customList: list })
    } catch (err) {
      this.setData({ customList: [] })
    }
  },

  onEnInput(e) {
    const val = e.detail.value || ''
    this.setData({ en: val }, this.checkIfCanSave)
  },

  onZhInput(e) {
    const val = e.detail.value || ''
    this.setData({ zh: val }, this.checkIfCanSave)
  },

  copyStructure() {
    const { structure } = this.data
    if (!structure) return

    wx.vibrateShort({ type: 'light' })
    wx.setClipboardData({
      data: structure,
      success: () => {
        wx.showToast({
          title: '已复制',
          icon: 'success',
          duration: 1200
        })
      }
    })
  },

  checkIfCanSave() {
    const { en, zh } = this.data
    this.setData({
      canSave: !!(en.trim() && zh.trim())
    })
  },

  onSave() {
    if (!this.data.canSave) return
    if (!this._structureId) {
      wx.showToast({ title: '缺少句型信息', icon: 'none' })
      return
    }

    const { en, zh } = this.data
    const newExample = { en: en.trim(), zh: zh.trim() }

    try {
      const all = wx.getStorageSync(CUSTOM_EXAMPLES_KEY) || {}
      if (!Array.isArray(all[this._structureId])) {
        all[this._structureId] = []
      }
      all[this._structureId].push(newExample)
      wx.setStorageSync(CUSTOM_EXAMPLES_KEY, all)
    } catch (err) {
      console.warn('Failed to save custom example:', err)
      wx.showToast({ title: '保存失败', icon: 'none' })
      return
    }

    wx.vibrateShort({ type: 'medium' })
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      duration: 1500
    })

    this.setData({ en: '', zh: '', canSave: false })
    this.loadCustomList()
  },

  openListSheet() {
    wx.vibrateShort({ type: 'light' })
    this.setData({ showListSheet: true })
  },

  closeListSheet() {
    this.setData({ showListSheet: false })
  },

  noop() {},

  deleteExample(e) {
    const idx = e.currentTarget.dataset.idx
    wx.showModal({
      title: '确认删除',
      content: '删除后不可恢复，确定要删除这条例句吗？',
      confirmText: '删除',
      confirmColor: '#EF4444',
      success: (res) => {
        if (!res.confirm) return

        try {
          const all = wx.getStorageSync(CUSTOM_EXAMPLES_KEY) || {}
          const list = all[this._structureId] || []
          list.splice(idx, 1)
          all[this._structureId] = list
          wx.setStorageSync(CUSTOM_EXAMPLES_KEY, all)
        } catch (err) {
          console.warn('Failed to delete custom example:', err)
          wx.showToast({ title: '删除失败', icon: 'none' })
          return
        }

        wx.vibrateShort({ type: 'medium' })
        wx.showToast({ title: '已删除', icon: 'success', duration: 1200 })
        this.loadCustomList()

        if (this.data.customList.length === 0) {
          this.setData({ showListSheet: false })
        }
      }
    })
  },

  deleteAllExamples() {
    wx.showModal({
      title: '确认删除',
      content: '将删除当前句型下所有自定义例句，且不可恢复',
      confirmText: '全部删除',
      confirmColor: '#EF4444',
      success: (res) => {
        if (!res.confirm) return

        try {
          const all = wx.getStorageSync(CUSTOM_EXAMPLES_KEY) || {}
          delete all[this._structureId]
          wx.setStorageSync(CUSTOM_EXAMPLES_KEY, all)
        } catch (err) {
          console.warn('Failed to delete all custom examples:', err)
          wx.showToast({ title: '删除失败', icon: 'none' })
          return
        }

        wx.vibrateShort({ type: 'medium' })
        wx.showToast({ title: '已删除', icon: 'success', duration: 1200 })
        this.loadCustomList()
        this.setData({ showListSheet: false })
      }
    })
  }
})
