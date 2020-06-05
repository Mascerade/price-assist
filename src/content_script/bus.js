import Vue from 'vue';

export const bus = new Vue({
  data: {},
  methods: {
    sendRetailers(retailerData) {
      this.$emit('newRetailerData', retailerData);
    },
    sendSaveProduct() {
      this.$emit('saveProduct');
    }
  },
});
