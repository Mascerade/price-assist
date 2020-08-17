<template>
  <div id="price-assist-content">
    <pa-retailer-card v-show="loadedPrices && foundRetailers" v-for="retailer in retailerData" :retailer="retailer" :key="retailer['title']" />
    <pa-loading-prices v-show="!loadedPrices"></pa-loading-prices>
    <pa-no-retailer-error v-show="loadedPrices && !foundRetailers"></pa-no-retailer-error>
  </div>
</template>

<script>
import { bus } from '../bus'
import RetailerCard from './RetailerCard'
import LoadingPrices from './LoadingPrices'
import NoRetailerError from './NoRetailerError'

export default {
  props: ['retailerData'],
  data () {
    return {
      loadedPrices: false, // Variable to control whether we finished the request to the server
      foundRetailers: false // Variable to control whether we actually found valid retailer prices in the request
    }
  },
  created () {
    // Sent by content.js if the request to the server was successful
    bus.$on('newRetailerData', retailerData => {
      console.log('got new retailer data')
      this.loadedPrices = true
    })
    // Sent by ContentApp.vue if there was actually valid retailer prices
    // Changes the view to the Retailer Cards
    bus.$on('foundRetailers', () => {
      console.log('found retailers')
      this.foundRetailers = true
    })
    // Sent by content.js if there was no item model on the page
    // Changes the veiw to the NoRetailerError
    bus.$on('noRetailers', () => {
      console.log('got sent no retailers')
      this.loadedPrices = true
      this.foundRetailers = false
    })
  },
  components: {
    'pa-retailer-card': RetailerCard,
    'pa-loading-prices': LoadingPrices,
    'pa-no-retailer-error': NoRetailerError
  }
}
</script>

<style lang="css" scoped>
#price-assist-content {
  display: flex;
  flex-flow: column;
  height: 410px;
  width: 100%;
  overflow-y: scroll;
}

#price-assist-content::-webkit-scrollbar-track {
  background-color: #f5f5f5;
}

#price-assist-content::-webkit-scrollbar {
  width: 5px;
  background-color: #60dfcd;
  background-image: linear-gradient(315deg, #60dfcd 0%, #1e9afe 74%);
}

#price-assist-content::-webkit-scrollbar-thumb {
  width: 5px;
  background-color: #60dfcd;
  background-image: linear-gradient(315deg, #60dfcd 0%, #1e9afe 74%);
}

@keyframes scale-small-up {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.005);
  }
}

@keyframes scale-big-up {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.005);
  }
}

@keyframes vertical-mover {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-2px);
  }
}

#price-assist-content::before {
  position: absolute;
  z-index: -1;
  width: 300px;
  height: 250px;
  content: '';
  background: inherit;
  background-image: url('https://dl.dropbox.com/s/h55tul7j9ouprxt/star.svg?dl=0https://www.dropbox.com/s/h55tul7j9ouprxt/star.svg?dl=0');
  background-repeat: no-repeat;
  background-position: 215px 15px;
  background-size: 70px;
  opacity: 0.9;
  -webkit-animation: scale-small-up 1s infinite alternate;
  animation: scale-small-up 1s infinite alternate;
}

</style>
