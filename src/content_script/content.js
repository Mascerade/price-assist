import Vue from 'vue';
import Content from './ContentApp';
import { amazon } from './Amazon';

// First thing to do is to connect to the background script
const port = chrome.runtime.connect({ name: 'cs-port' });

const retailerDict = {
  Amazon: amazon,
};

let retailerName;
const url = window.location.toString();
if (url.includes('www.amazon.com')) {
  retailerName = 'Amazon';
}

const retailer = retailerDict[retailerName];
retailer.extractCategory();
if (retailer.validCategories.includes(retailer.category)) {
  port.postMessage({ message: 'hi' });
}

const div = document.createElement('div');
div.id = 'price-assist';
document.getElementsByTagName('body')[0].appendChild(div);

/* eslint-disable no-new */
new Vue({
  el: '#price-assist',
  render: h => {
    return h(Content);
  },
});

// Listens to messages from the background script
port.onMessage.addListener(message => {
  console.log(message);
});
