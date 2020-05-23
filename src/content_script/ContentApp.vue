<template>
  <div>
    <pa-retailer-card :retailer="retailer"></pa-retailer-card>
  </div>
</template>

<script>
import RetailerCard from './RetailerCard';
export default {
  data() {
    return {
      retailer: {
        title: 'Amazon',
        price: 500.99,
        link: 'https://www.timeless-apps.com/',
      },
    };
  },
  components: {
    'pa-retailer-card': RetailerCard,
  },
};
</script>

<style lang="css" scoped>
@import url('../styles/typeface-quicksand.css');
@import url('../styles/typeface-muli.css');
</style>
