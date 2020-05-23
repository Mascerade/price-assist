<template>
  <div id="price-assist-wrapper">
    <pa-content-header />
    <pa-retailers-container :retailerData="retailerData" />
  </div>
</template>

<script>
import ContentHeader from './ContentHeader';
import RetailersContainer from './RetailersContainer';
export default {
  data() {
    return {
      retailerData: [
        {
          title: 'Amazon',
          price: 499.99,
          link: 'https://www.amazon.com/',
        },
        {
          title: 'Newegg',
          price: 509.99,
          link: 'https://www.newegg.com/',
        },
        {
          title: 'Walmart',
          price: 519.99,
          link: 'https://www.walmart.com/',
        },
      ],
    };
  },
  components: {
    'pa-content-header': ContentHeader,
    'pa-retailers-container': RetailersContainer,
  },
};
</script>

<style lang="css" scoped>
@import url('../styles/typeface-quicksand.css');
@import url('../styles/typeface-muli.css');

#price-assist-wrapper {
  height: 500px;
  width: 300px;
  font-family: 'Muli';
  font-weight: 300;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
</style>
