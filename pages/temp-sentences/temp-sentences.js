const STORAGE_KEY = 'temp_spoken_sentences'

function createSentenceItem(text) {
  return {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    text
  }
}

function normalizeSentences(raw) {
  if (!Array.isArray(raw)) return []

  return raw
    .map((item, index) => {
      if (typeof item === 'string') {
        const text = item.trim()
        return text ? { id: 'legacy-' + index, text } : null
      }

      if (!item || typeof item.text !== 'string') return null

      const text = item.text.trim()
      if (!text) return null

      return {
        id: item.id || 'legacy-' + index,
        text
      }
    })
    .filter(Boolean)
}

Page({
  data: {
    inputValue: '',
    focusInput: true,
    sentences: []
  },

  onLoad() {
    this.loadSentences()
  },

  loadSentences() {
    try {
      const stored = wx.getStorageSync(STORAGE_KEY)
      const sentences = normalizeSentences(stored)
      this.setData({ sentences })
    } catch (err) {
      this.setData({ sentences: [] })
    }
  },

  persistSentences(sentences) {
    try {
      wx.setStorageSync(STORAGE_KEY, sentences)
      return true
    } catch (err) {
      wx.showToast({ title: '保存失败', icon: 'none' })
      return false
    }
  },

  onInput(e) {
    this.setData({ inputValue: e.detail.value })
  },

  onInputFocus() {
    if (!this.data.focusInput) {
      this.setData({ focusInput: true })
    }
  },

  onInputBlur() {
    if (this.data.focusInput) {
      this.setData({ focusInput: false })
    }
  },

  onInputConfirm() {
    const text = (this.data.inputValue || '').trim()

    if (!text) {
      this.setData({ focusInput: false })
      return
    }

    const next = [createSentenceItem(text)].concat(this.data.sentences)
    if (!this.persistSentences(next)) return

    wx.vibrateShort({ type: 'light' })
    this.setData({
      sentences: next,
      inputValue: '',
      focusInput: false
    })
  },

  onDeleteSentence(e) {
    const { id } = e.currentTarget.dataset
    if (!id) return

    const next = this.data.sentences.filter(item => item.id !== id)
    if (next.length === this.data.sentences.length) return
    if (!this.persistSentences(next)) return

    wx.vibrateShort({ type: 'light' })
    this.setData({ sentences: next })
  },

  copyAll() {
    const sentences = this.data.sentences || []
    if (!sentences.length) {
      wx.showToast({ title: '暂无句子', icon: 'none' })
      return
    }

    const content = sentences.map(item => item.text).join(';')
    wx.setClipboardData({
      data: content,
      success: () => {
        wx.vibrateShort({ type: 'light' })
      },
      fail: () => {
        wx.showToast({ title: '复制失败', icon: 'none' })
      }
    })
  },

  confirmClearAll() {
    if (!this.data.sentences.length) {
      wx.showToast({ title: '暂无句子', icon: 'none' })
      return
    }

    wx.showModal({
      title: '确认删除',
      content: '将删除所有临时口语句子，且不可恢复',
      confirmText: '删除',
      confirmColor: '#EF4444',
      success: (res) => {
        if (!res.confirm) return
        if (!this.persistSentences([])) return

        wx.vibrateShort({ type: 'medium' })
        this.setData({ sentences: [] })
      }
    })
  }
})