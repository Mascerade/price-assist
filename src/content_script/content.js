import Vue from 'vue'
import Toasted from 'vue-toasted'
import Content from './ContentApp'
import { amazon } from './Amazon'
import { bus } from '../bus'

// First thing to do is to connect to the background script
const port = chrome.runtime.connect({ name: 'cs-port' })
const retailerDict = {
  Amazon: amazon
}

// Get the name of the retailer so that we know where we should extract data from
let retailerName
const url = window.location.toString()
if (url.includes('www.amazon.com')) {
  retailerName = 'Amazon'
}

// Get the actual object for the specific retailer and extract the data
const retailer = retailerDict[retailerName]
retailer.extractAllData()
console.log(retailer)

// If we support the category and there is an item model, send the data to the background script
// The background script will actually send the request to the server
if (retailer.validCategories.includes(retailer.category) && (retailer.itemModel !== null && retailer.itemModel !== '' && retailer.itemModel !== undefined)) {
  // Sends a message to the background script and gets the retailer data
  port.postMessage({ message: 'get data', retailer: retailerName, price: retailer.price, itemModel: retailer.itemModel, title: retailer.title, imgSrc: retailer.imgSrc })
}

const div = document.createElement('div')
div.id = 'price-assist'
document.getElementsByTagName('body')[0].appendChild(div)

Vue.use(Toasted)

/* eslint-disable no-new */
new Vue({
  el: '#price-assist',
  render: h => {
    return h(Content)
  }
})

// Listens to messages from the background script
port.onMessage.addListener(message => {
  if (message.message === 'add retailers') {
    // Emits 'newRetailerData' and sends the retailer data to ContentApp.vue
    bus.sendRetailers(message.data)
  } else if (message.message === 'saved product') {
    // Emits 'productSaved' and received by ContentApp.vue
    bus.sendProductSaved(message.onlyToggle)
  } else if (message.message === 'need to create account') {
    // Emits 'needAccount' and received by ContentApp.vue
    bus.sendNeedAccount()
  } else if (message.message === 'removed product') {
    // Emits 'removedProduct' and received by ContentApp.vue
    bus.sendRemovedProduct()
  }
})

// Sent by Footer.vue
bus.$on('saveProduct', () => {
  port.postMessage({ message: 'save product', itemModel: retailer.itemModel })
})

// Sent by Footer.vue
bus.$on('removeProduct', () => {
  port.postMessage({ message: 'remove product', itemModel: retailer.itemModel })
})
