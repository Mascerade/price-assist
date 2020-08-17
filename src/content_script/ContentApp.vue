<template>
  <div>
    <div v-show="displayGui" id="price-assist-wrapper">
      <pa-content-header @hideGui="displayGui=false" />
      <pa-retailers-container :retailerData="retailerData" />
      <pa-footer :productSaved="productSaved" />
    </div>
    <div @click="showGui" v-show="!displayGui" id="show-gui">
      <p>P</p>
    </div>
  </div>
</template>

<script>
import ContentHeader from './ContentHeader'
import RetailersContainer from './RetailersContainer'
import Footer from './Footer'
import { bus } from '../bus'
import 'typeface-muli'
import 'typeface-quicksand'
import 'material-icons'

export default {
  data () {
    return {
      retailerData: [],
      displayGui: true,
      productSaved: false
    }
  },
  created () {
    // Sent by content.js
    // After we get data from the server, we iterate over it and add it to retailerData
    // in order to be displayed as a card in the GUI
    bus.$on('newRetailerData', retailerData => {
      for (const [key, value] of Object.entries(retailerData)) {
        if (value[1] == null || value[2] == null || key === 'identifier' || key === 'title') {
        } else {
          this.retailerData.push({
            title: value[0],
            price: value[1],
            link: value[2]
          })
        }
      }
      if (this.retailerData.length > 1) {
        // Received by Retailers Container
        bus.sendFoundRetailers()
      }
    })
    // Sent by content.js
    // Display a toast saying that the user needs to create an account before
    // saving a product
    bus.$on('needAccount', () => {
      this.$toasted
        .error('Sign In First!', {
          icon: 'error',
          position: 'bottom-center'
        })
        .goAway(1200)
    })
    // Sent by content.js
    // Display a toast if the user saved a product
    bus.$on('productSaved', onlyToggle => {
      this.productSaved = true
      if (!onlyToggle) {
        this.$toasted
          .show('Added Product!', {
            icon: 'add',
            position: 'bottom-center'
          })
          .goAway(1200)
      }
    })
    // Sent by content.js
    // Display a toast if the user unsaved/removed a product
    bus.$on('removedProduct', () => {
      this.productSaved = false
      this.$toasted
        .show('Removed Product!', {
          position: 'bottom-center'
        })
        .goAway(1200)
    })
  },
  methods: {
    showGui () {
      this.displayGui = true
    }
  },
  components: {
    'pa-content-header': ContentHeader,
    'pa-retailers-container': RetailersContainer,
    'pa-footer': Footer
  }
}
</script>

<style lang="css" scoped>
@import url('../styles/typeface-quicksand.css');
@import url('../styles/typeface-muli.css');
@import url('../styles/material-icons.css');

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

#show-gui {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
  position: fixed;
  border-top-left-radius: 7px;
  border-bottom-left-radius: 7px;
  z-index: 2147483647;
  top: 200px;
  right: 0;
  height: 60px;
  width: 60px;
  background-color: #1fd1f9;
  background-image: linear-gradient(315deg, #06bcfb 0%, #4884ee 74%);
}

#show-gui:hover {
  cursor: pointer;
}

#show-gui > p {
  color: white;
  font-family: "Quicksand";
  font-size: 36px;
  margin: 0;
}

</style>
