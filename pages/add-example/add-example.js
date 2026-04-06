Page({
  data: {
    structure: '',
    en: '',
    zh: '',
    canSave: false
  },

  onLoad(options) {
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

  checkIfCanSave() {
    const { en, zh } = this.data
    this.setData({
      canSave: !!(en.trim() && zh.trim())
    })
  },

  onSave() {
    if (!this.data.canSave) return

    wx.vibrateShort({ type: 'medium' })
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      duration: 1500
    })

    // Simulate saving and returning
    setTimeout(() => {
      wx.navigateBack()
    }, 1500)
  }
})
