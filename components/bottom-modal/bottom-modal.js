// components/bottom-modal/bottom-modal.js
Component({
  /**
   * Component properties
   */
  properties: {
    // Whether to show the modal
    show: {
      type: Boolean,
      value: false
    },
    // Modal title
    title: {
      type: String,
      value: ''
    },
    // Whether to show cancel button
    showCancel: {
      type: Boolean,
      value: true
    },
    // Cancel button text
    cancelText: {
      type: String,
      value: '取消'
    }
  },

  /**
   * Component initial data
   */
  data: {

  },

  /**
   * Component methods
   */
  methods: {
    /**
     * Close modal and trigger close event
     */
    onClose() {
      this.triggerEvent('close');
    },

    /**
     * Stop event propagation when clicking on modal content
     */
    stopPropagation() {
      // Prevent modal from closing when clicking on modal content
    }
  }
})
