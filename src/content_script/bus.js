import Vue from 'vue';

export const bus = new Vue({
  data: {},
  methods: {
    sendRetailers(retailerData) {
      this.$emit('newRetailerData', retailerData);
    },
    sendSaveProduct() {
      this.$emit('saveProduct');
    },
    sendProductSaved(onlyToggle) {
      this.$emit('productSaved', onlyToggle);
    },
    sendRemoveProduct() {
      this.$emit('removeProduct');
    },
    sendRemovedProduct() {
      this.$emit('removedProduct');
    },
    sendNeedAccount() {
      this.$emit('needAccount');
    },
  },
});
