import Vue from 'vue';
import Toasted from 'vue-toasted';
import Content from './ContentApp';
import { amazon } from './Amazon';
import { bus } from './bus';

// First thing to do is to connect to the background script
const port = chrome.runtime.connect({ name: 'cs-port' });

const retailerDict = {
  Amazon: amazon,
};

// Get the name of the retailer so that we know where we should extract data from
let retailerName;
const url = window.location.toString();
if (url.includes('www.amazon.com')) {
  retailerName = 'Amazon';
}

// Get the actual object for the specific retailer along with the category
const retailer = retailerDict[retailerName];
retailer.extractCategory();
// If we support the category, get the necessary data and send it to the background script
// The background script will actually send the request to the server
if (retailer.validCategories.includes(retailer.category)) {
  retailer.extractAllData();
  port.postMessage({ message: 'get data', retailer: retailerName, price: retailer.price, itemModel: retailer.itemModel, title: retailer.title, imgSrc: retailer.imgSrc });
}

const div = document.createElement('div');
div.id = 'price-assist';
document.getElementsByTagName('body')[0].appendChild(div);

Vue.use(Toasted);

/* eslint-disable no-new */
new Vue({
  el: '#price-assist',
  render: h => {
    return h(Content);
  },
});

// Listens to messages from the background script
port.onMessage.addListener(message => {
  if (message.message === 'add retailers') {
    bus.sendRetailers(message.data);
  } else if (message.message === 'saved product') {
    bus.sendProductSaved();
  } else if (message.message === 'need to create account') {
    bus.sendNeedAccount();
  }
});

bus.$on('saveProduct', () => {
  port.postMessage({ message: 'save product', itemModel: retailer.itemModel });
});
