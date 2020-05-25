<template>
  <div id="price-assist-wrapper">
    <pa-content-header />
    <pa-retailers-container :retailerData="retailerData" />
    <pa-footer />
  </div>
</template>

<script>
import ContentHeader from './ContentHeader';
import RetailersContainer from './RetailersContainer';
import Footer from './Footer';
import { bus } from './bus';
export default {
  data() {
    return {
      retailerData: [],
    };
  },
  created() {
    bus.$on('newRetailerData', retailerData => {
      for (const [key, value] of Object.entries(retailerData)) {
        if (value[1] == null || value[2] == null || key === 'identifier' || key === 'title') {
        } else {
          this.retailerData.push({
            title: value[0],
            price: value[1],
            link: value[2],
          });
        }
      }
    });
  },
  components: {
    'pa-content-header': ContentHeader,
    'pa-retailers-container': RetailersContainer,
    'pa-footer': Footer,
  },
};
</script>

<style lang="css" scoped>
@import url('../styles/typeface-quicksand.css');
@import url('../styles/typeface-muli.css');

#price-assist-wrapper {
  height: 500px;
  width: 300px;
  z-index: 2147483647;
  background-color: white;
  position: fixed;
  top: 25px;
  right: 25px;
  font-family: 'Muli';
  font-weight: 300;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
</style>
