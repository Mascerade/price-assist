import Vue from 'vue'

export const bus = new Vue({
  data: {
  },
  methods: {
    // Sent by content.js and received by ContentApp.vue
    sendRetailers (retailerData) {
      this.$emit('newRetailerData', retailerData)
    },
    // Sent by content.js and received by Retailers Container
    sendNoRetailers () {
      this.$emit('noRetailers')
    },
    // Sent by Content App and received by Retailers Container
    sendFoundRetailers () {
      this.$emit('foundRetailers')
    },
    // Sent by Footer.vue and received by content.js
    sendSaveProduct () {
      this.$emit('saveProduct')
    },
    // Sent by content.js and received by ContentApp.vue
    sendProductSaved (onlyToggle) {
      this.$emit('productSaved', onlyToggle)
    },
    // Sent by Footer.vue and received by content.js
    sendRemoveProduct () {
      this.$emit('removeProduct')
    },
    // Sent by content.js and received by ContentApp.vue
    sendRemovedProduct () {
      this.$emit('removedProduct')
    },
    // Sent by content.js and received by ContentApp.vue
    sendNeedAccount () {
      this.$emit('needAccount')
    },
    popupSendProfile (profile) {
      this.$emit('popupProfile', profile)
    },
    // Sent by PopupApp and received by PopupApp
    popupUpdateItemModels (profile) {
      this.$emit('updatePopupItemModels', profile)
    }
  }
})
