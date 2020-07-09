<template>
  <div id="wrapper">
    <div id="header">
      <img id="profile-img" :src="profileImg" alt="Profile Image">
      <div id="name-wrapper">
        <h4 id="name">Jason Acheampong</h4>
      </div>
    </div>

    <div v-if="!productView" class="content">
      <div @click="productView = true" id="saved-products">
        <span class="material-icons">check_circle_outline</span>
        <div id="saved-products-text-container">
          <p>{{ savedProducts.length }} products currently <span>saved!</span></p>
          <span class="material-icons">chevron_right</span>
        </div>
      </div>
      <div id="to-track-prices">
        <a href="http://www.timeless-apps.com/" target="_blank">Check Out Track Prices!</a>
      </div>
    </div>

    <div v-if="productView" class="content">
      <div id="products-container">
        <div id="product-list-item" v-for="product in savedProducts" :key="product.itemModel">
          <p>{{ product.title | truncate }}</p>
          <div style="display: flex; flex: 1; flex-flow: row; justify-content: flex-end;">
            <a @click.prevent="removeProduct(product.itemModel)">Remove</a>
          </div>
        </div>
      </div>
      <div @click="productView = false" id="back">
        <span class="material-icons">chevron_left</span>
        <p>Back</p>
      </div>
    </div>

    <a id="sign-out" @click.prevent="signOut()">Sign Out</a>
  </div>
</template>

<script>
export default {
  data () {
    return {
      profileImg: 'https://lh3.googleusercontent.com/ogw/ADGmqu9CohlcoBgcFIjT__icy6vLfyusMxjm0m05nJhd=s32-c-mo',
      productView: false,
      savedProducts: [
        { itemModel: 'item-model', title: 'Intel Core i9-9900K Desktop Processor 8 Cores up to 5.0 GHz Turbo unlocked LGA1151 300 Series 95W' },
        { itemModel: 'item-model', title: 'Intel NUC 10 Performance Kit – Intel Core i7 Processor (Tall Chassis)' },
        { itemModel: 'item-model', title: 'Intel Core i7-10700 Desktop Processor 8 Cores up to 4.8 GHz LGA 1200 (Intel 400 Series Chipset) 65W, BX8070110700' },
        { itemModel: 'item-model', title: 'Intel Core i7-9700K Desktop Processor 8 Cores up to 4.9 GHz Turbo unlocked LGA1151 300 Series 95W' },
        { itemModel: 'item-model', title: 'AMD Ryzen 5 3600 6-Core, 12-Thread Unlocked Desktop Processor with Wraith Stealth Cooler' },
        { itemModel: 'item-model', title: 'AMD Ryzen 5 3600X 6-Core, 12-Thread Unlocked Desktop Processor with Wraith Spire Cooler' }
      ]
    }
  },
  methods: {
    signOut () {
      console.log('have to sign out')
    },
    removeProduct (itemModel) {
      console.log('gotta remove ' + itemModel)
    }
  },
  filters: {
    truncate (value) {
      if (value.length > 25) {
        return value.slice(0, 25) + '...'
      } else {
        return value
      }
    }
  }
}
</script>

<style lang="css" scoped>
@import url('../styles/typeface-quicksand.css');
@import url('../styles/typeface-muli.css');
@import url('../styles/material-icons.css');

#wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-top: 10px solid;
  border-image-slice: 1;
  border-width: 5px;
  border-image-source: linear-gradient(315deg, #06bcfb 0%, #4884ee 74%);
  font-family: 'Muli'
}

#header {
  width: 100%;
  display: flex;
  flex-direction: row;
  padding-left: 5px;
  padding-right: 5px;
  margin-top: 3px;
}

#profile-img {
  height: 48px;
  width: 48px;
  border-radius: 50%;
}

#name-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.content {
  display: flex;
  flex-flow: column;
  flex: 1;
}

#product-list-item {
  display: flex;
  flex-flow: row;
  align-items: center;
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-top: 3px;
  margin-bottom: 3px;
  background-color: #fcfcfc;
}

#product-list-item > p {
  margin: 0;
}

#product-list-item > div > a {
  color: #40c4ff;
}

#product-list-item > div > a:hover {
  cursor: pointer;
}

#back {
  cursor: pointer;
  display: flex;
  flex-flow: row;
  width: 100%;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
  color: #40c4ff;
}

#back > p {
  margin: 0;
}

#saved-products {
  display: flex;
  flex-flow: row;
  align-items: center;
  height: 50px;
  margin-top: 8px;
  background-color: #fcfcfc;
}

#saved-products:hover {
  cursor: pointer;
}

#saved-products > span {
  font-size: 30px;
  color: #2cb922;
}

#saved-products-text-container {
  display: flex;
  flex-flow: row;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}

#saved-products-text-container > p {
  font-size: 18px;
  margin: 0;
}

#saved-products-text-container > p > span:nth-child(1) {
  color: #40c4ff;
}

#saved-products-text-container > span:nth-child(2) {
  font-size: 25px;
}

#to-track-prices {
  display: flex;
  flex-flow: column;
  justify-items: center;
  width: 100%;
  height: 35px;
  margin-top: 71px;
  text-align: center;
  font-size: 22px;
  background-image:  linear-gradient(315deg, #06bcfb 0%, #4884ee 74%);
}

#to-track-prices > a {
  width: 100%;
  height: 100%;
  color: white;
  text-decoration: none;
  margin-top: 2px;
}

#sign-out {
  height: 30px;
  width: 100%;
  color: white;
  font-size: 18px;
  text-align: center;
  background-color: #ff4444;
}

#sign-out:hover {
  background-color: #CC0000;
  cursor: pointer;
}

</style>
