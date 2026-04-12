Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    releaseNotes: {
      type: Object,
      value: null
    },
    cancelText: {
      type: String,
      value: '我知道了'
    }
  },

  methods: {
    onClose() {
      this.triggerEvent('close')
    }
  }
})