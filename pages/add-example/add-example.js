const CUSTOM_EXAMPLES_KEY = 'custom_examples'

Page({
  data: {
    structure: '',
    en: '',
    zh: '',
    canSave: false
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

    setTimeout(() => {
      wx.navigateBack()
    }, 1500)
  }
})
